import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResponse, ErrorUtils } from '@/shared/utils';
// Services
import * as DashboardService from './dashboard.service';

// GET /users
export async function fetchDashboard(request: FastifyRequest, reply: FastifyReply) {
  try {
    const dashboardData = await DashboardService.fetchDashboard();
    return ApiResponse.success(reply, dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return ApiResponse.error(reply, ErrorUtils.parseError(error), 400);
  }
}
