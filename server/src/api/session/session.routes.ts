import { FastifyInstance } from 'fastify';
// Middlewares
import { authMiddleware } from '@/middleware/auth.middleware';
// Controllers
import SessionController from '@/api/session/session.controller';

export default async function sessionRoutes(fastify: FastifyInstance) {

  /**
   * Get current user's sessions
   * @route GET /sessions/me
   */
  fastify.get('/me', { 
    preHandler: authMiddleware 
  }, SessionController.getUserSessions);

  /**
   * Get current user's sessions with filters and pagination
   * @route GET /sessions/me/current
   */
  fastify.get('/me/current', { 
    preHandler: authMiddleware 
  }, SessionController.getMyCurrentSession);

  /**
   * Delete current user's session by ID
   * @route DELETE /sessions/me/:id
   */
  fastify.delete('/me/:id', { 
    preHandler: authMiddleware 
  }, SessionController.deleteUserSessions);

  /**
   * Delete all current user's sessions
   * @route DELETE /sessions/me/all
   */
  fastify.delete('/me/all', { 
    preHandler: authMiddleware 
  }, SessionController.deleteUserSessions);

  /**
   * Get session by ID (admin only)
   * @route GET /sessions/:id
   */
  fastify.get('/:id', { 
    preHandler: [authMiddleware] 
  }, SessionController.getSessionById);

  /**
   * Delete session by ID (admin only)
   * @route DELETE /sessions/:id
   */
  fastify.delete('/:id', { 
    preHandler: [authMiddleware] 
  }, SessionController.deleteSessionById);
}
