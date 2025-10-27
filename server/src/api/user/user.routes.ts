import { FastifyInstance } from 'fastify';
import { authMiddleware } from '@/middleware/auth.middleware';
import * as UserController from './user.controller';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [authMiddleware] }, UserController.fetchUsers);
  fastify.get('/:id', { preHandler: [authMiddleware] }, UserController.getUserById);
  fastify.get('/me', { preHandler: [authMiddleware] }, UserController.getMe);

  // первичное создание root — без auth (или повесь свой preHandler при желании)
  fastify.post('/root', {}, UserController.createRoot);

  fastify.post('/', { preHandler: [authMiddleware] }, UserController.createUser);
  fastify.put('/:id', { preHandler: [authMiddleware] }, UserController.updateUser);
  fastify.delete('/:id', { preHandler: [authMiddleware] }, UserController.deleteUser);
  fastify.post('/:id/change-password', { preHandler: [authMiddleware] }, UserController.changePassword);
  fastify.post('/:id/change-password-as-root', { preHandler: [authMiddleware] }, UserController.changePasswordAsRoot);
}