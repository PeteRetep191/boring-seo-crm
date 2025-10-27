// src/modules/user/user.schemas.ts
import { z } from 'zod';
import { fetchQuerySchema } from '@/shared/schemas';

const name = z.string().trim().min(1, 'name is required');
const email = z.string().trim().min(1, 'email is required').email('invalid email');
const password = z.string().trim().min(8, 'password must be at least 8 chars');

export const fetchUsersSchema = fetchQuerySchema;

export const fetchUserByIdSchema = z.object({
  userId: z.string().min(1),
});

export const createUserSchema = z.object({
  name,
  email,
  password,
  archived: z.boolean().optional(),
});

export const updateUserSchema = z.object({
  name: name.optional(),
  email: email.optional(),
  password: password.optional(),
  archived: z.boolean().optional(),
});

export const deleteUserByIdSchema = z.object({
  userId: z.string().min(1),
});

export const deleteBulkUsersSchema = z.object({
  userIds: z.array(z.string().min(1)).min(1, 'At least one userId is required'),
});

export const changeUserPasswordSchema = z.object({
  oldPassword: password,
  newPassword: password,
});

// отдельная схема для root-создания (та же, но явно)
export const createRootUserSchema = z.object({
  name,
  email,
  password,
});