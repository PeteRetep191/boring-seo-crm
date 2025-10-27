import { FastifyInstance } from 'fastify';
import AuthController from '@/api/auth/auth.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

export default async function authRoutes(fastify: FastifyInstance) {

  /**
   * Login route
   * @route POST /auth/login
   * @param {LoginDto} request.body - { username, password, rememberMe? }
   */
  fastify.post('/login', AuthController.login);

  /**
   * Register route (future use)
   * @route POST /auth/register
   * @group Auth - Operations about user registration
   */
  fastify.get('/logout', {
    preHandler: authMiddleware
   }, AuthController.logout);

  /**
   * Logout from all devices
   * @route GET /auth/logoutAll
   * @group Auth - Operations about user authentication
   */
  fastify.get('/logoutAll', { preHandler: authMiddleware }, AuthController.logoutAll);
  
  /**
   * Check if user is authenticated
   * @route GET /auth/isAuth
   * @group Auth - Operations about user authentication
   */
  fastify.get('/isAuth', { preHandler: authMiddleware }, AuthController.isAuth);
  
} 