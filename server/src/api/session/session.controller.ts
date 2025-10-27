import { FastifyRequest, FastifyReply } from 'fastify';
import SessionService from '@/api/session/session.service';
// Utils
import { ApiResponse, ErrorUtils } from '@/shared/utils';

export default class SessionController {

    /**
     * Route: GET /sessions/me/current
     * Get the current session for the authenticated user.
     * @param request - The Fastify request object.
     * @param reply - The Fastify reply object.
     * @returns The current session information.
     */
    static async getMyCurrentSession(request: FastifyRequest, reply: FastifyReply) {
        try {
            return ApiResponse.success(reply, request.session);
        } catch (error) {
            return ApiResponse.internalError(
                reply,
                error instanceof Error ? error.message : 'Internal server error'
            );
        }
    }

    /**
     * Route: GET /sessions/:id
     * Get the session by ID for the authenticated user.
     * @param request - The Fastify request object.
     * @param reply - The Fastify reply object.
     * @returns The session information.
     */
    static async getSessionById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const session = await SessionService.getSessionById(id);
            if (!session) {
                return ApiResponse.notFound(reply, 'Session not found');
            }
            return ApiResponse.success(reply, { ...session.toJSON() });
        } catch (error) {
            return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
        }
    }

    /**
     * Route: GET /sessions/all
     * Get all sessions for the authenticated user.
     * @param request - The Fastify request object.
     * @param reply - The Fastify reply object.
     * @returns The list of user sessions.
     */
    static async getUserSessions(request: FastifyRequest, reply: FastifyReply) {
        try {
            const sessions = await SessionService.getUserSessions(request.userId);
            return ApiResponse.success(reply, [...sessions]);
        } catch (error) {
            return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
        }
    }

    /**
     * Route: DELETE /sessions/:id
     * Delete a session by ID for the authenticated user.
     * @param request - The Fastify request object.
     * @param reply - The Fastify reply object.
     * @returns A success message or an error.
     */
    static async deleteSessionById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const success = await SessionService.deleteSessionById(id);
            if (!success) {
                return ApiResponse.notFound(reply, 'Session not found');
            }
            return ApiResponse.success(reply, { message: 'Session deleted successfully' });
        } catch (error) {
            return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
        }
    }

    /**
     * Route: DELETE /sessions/me/all
     * Delete all sessions for the authenticated user.
     * @param request - The Fastify request object.
     * @param reply - The Fastify reply object.
     * @returns A success message or an error.
     */
    static async deleteUserSessions(request: FastifyRequest, reply: FastifyReply) {
        try {
            await SessionService.deleteUserSessions(request.userId);
            return ApiResponse.success(reply, { message: 'All sessions deleted successfully' });
        } catch (error) {
            return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
        }
    }
}