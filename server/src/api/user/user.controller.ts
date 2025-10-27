import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResponse, ErrorUtils } from '@/shared/utils';
import * as UserSchemas from './user.schemas';
import * as UserService from './user.service';

// GET /users
export async function fetchUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const q = request.query as any;

    const raw = typeof q.filters === 'string' ? q.filters : undefined;
    const uiFilters = raw ? JSON.parse(decodeURIComponent(raw)) : [];

    const { filters: _ignored, ...rest } = q;
    const params = { ...rest, filters: uiFilters };

    const query = UserSchemas.fetchUsersSchema.parse(params);

    const result = await UserService.fetchUsers({
      search: query.search,
      page: query.page,
      limit: query.limit,
      filters: query.filters,
    });

    return ApiResponse.success(reply, result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 400);
  }
}

// GET /users/:id
export async function getUserById(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const user = await UserService.getUserById(id);
    if (!user) return ApiResponse.notFound(reply, 'User not found');
    return ApiResponse.success(reply, user);
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}

// GET /users/me
export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await UserService.getUserById(request.userId);
    if (!user) return ApiResponse.notFound(reply, 'User not found');
    return ApiResponse.success(reply, user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}

// POST /users  -> create (генерируем новый id внутри upsertUser)
export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = UserSchemas.createUserSchema.parse(request.body);
    const user = await UserService.upsertUser(undefined, payload);
    reply.code(201);
    return ApiResponse.success(reply, user);
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}

// PUT /users/:id  -> update via upsert
export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const data = UserSchemas.updateUserSchema.parse(request.body);
    const user = await UserService.upsertUser(id, data);
    if (!user) return ApiResponse.notFound(reply, 'User not found');
    return ApiResponse.success(reply, user);
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}

// DELETE /users/:id (archive)
export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const ok = await UserService.archiveUser(id);
    if (!ok) return ApiResponse.notFound(reply, 'User not found');
    return ApiResponse.success(reply, { message: 'User archived successfully' });
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}

// POST /users/:id/change-password
export async function changePassword(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const { newPassword, oldPassword } = UserSchemas.changeUserPasswordSchema.parse(request.body);
    const ok = await UserService.changePassword(id, newPassword, oldPassword);
    if (!ok) return ApiResponse.error(reply, 'Password change failed', 400);
    return ApiResponse.success(reply, { message: 'Password changed successfully' });
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}

// POST /users/:id/change-password-as-root
export async function changePasswordAsRoot(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = request.params as { id: string };
    const { newPassword } = UserSchemas.changeUserPasswordSchema.parse(request.body);
    const ok = await UserService.changePasswordAsRoot(id, newPassword);
    if (!ok) return ApiResponse.error(reply, 'Password change failed', 400);
    return ApiResponse.success(reply, { message: 'Password changed successfully' });
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}

// POST /users/root  -> init root (использует upsertUser с новым id)
export async function createRoot(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = UserSchemas.createRootUserSchema.parse(request.body);
    const result = await UserService.initRootUser(payload);

    if (!result.ok) {
      return ApiResponse.error(reply, result.reason, 403);
    }

    reply.code(201);
    return ApiResponse.success(reply, result.user);
  } catch (error) {
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
  }
}