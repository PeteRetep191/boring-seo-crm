import { FastifyInstance } from 'fastify';
import { authMiddleware } from '@/middleware/auth.middleware';
import * as DashboardController from './dashboard.controller';

export default async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [authMiddleware] }, DashboardController.fetchDashboard);
}