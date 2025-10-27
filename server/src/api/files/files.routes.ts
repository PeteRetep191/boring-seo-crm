import { FastifyInstance } from 'fastify';
import { authMiddleware } from '@/middleware/auth.middleware';
import * as FilesController from './files.controller';

export default async function filesRoutes(fastify: FastifyInstance) {
  // Роут под клиент: POST /api/files/upload
  fastify.post('/upload', { preHandler: [authMiddleware] }, FilesController.uploadFile);
}