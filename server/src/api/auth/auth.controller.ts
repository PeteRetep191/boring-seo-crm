import { FastifyReply, FastifyRequest } from 'fastify';
import { loginSchema } from '@/api/auth/auth.dto';

import UserModel from '@/models/user.model';
import SessionService from '@/api/session/session.service';

import { ApiResponse, ErrorUtils } from '@/shared/utils';
import PasswordUtils from '@/shared/utils/Password.utils';

export default class AuthController {

    // User login
    static async login(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email, password, rememberMe = false } = loginSchema.parse(request.body);

            const fullUser = await UserModel.findOne({ email, archived: false }).select('+password');
            if (!fullUser || !await PasswordUtils.compare(password, fullUser.password)) {
                return ApiResponse.error(reply, 'Invalid email or password', 401);
            }
            
            request.userId = fullUser._id.toString();

            const newSession = await SessionService.createNewSessionByRequest(request, rememberMe);
            const userWithoutPassword = fullUser.withoutPassword();
            const sessionHashToken = newSession.tokenHash;

            return ApiResponse.success(reply, { user: userWithoutPassword, sessionId: sessionHashToken });
        } catch (error) {
            console.error("Login error:", error);
            return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
        }
    }

    // User logout
    static async logout(request: FastifyRequest, reply: FastifyReply) {
        try {
            const sessionId = request.session.tokenHash;
            if (sessionId) {
                await SessionService.deleteSessionByHash(sessionId);
            }
            
            return ApiResponse.success(reply, { message: 'Logged out successfully' });
            
        } catch (error) {
            console.error("Logout error:", error);
            return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
        }
    }

    /**
     * Logout from all sessions
     * @param request 
     * @param reply 
     * @returns 
     */
    static async logoutAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            if (!request.userId) {
                return ApiResponse.error(reply, 'User not authenticated', 401);
            }
            
            await SessionService.deleteUserSessions(request.userId.toString());
            reply.clearCookie('sessionId');
            
            return ApiResponse.success(reply, { message: 'All sessions terminated' });
            
        } catch (error) {
            console.error("Logout all error:", error);
            return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
        }
    }

    /**
     * Check if user is authenticated
     * @param request
     * @param reply
     * @returns
     */
    static async isAuth(request: FastifyRequest, reply: FastifyReply) {
        try {
            if (!request.userId) {
                return ApiResponse.error(reply, 'User not authenticated', 401);
            }
            
            const user = await UserModel.findById(request.userId);
            
            if (!user || user.archived) {
                return ApiResponse.error(reply, 'User not found or archived', 404);
            }
            
            return ApiResponse.success(reply, { user });
            
        } catch (error) {
            console.error("IsAuth error:", error);
            return ApiResponse.error(reply, ErrorUtils.parseError(error), 500);
        }
    }
}