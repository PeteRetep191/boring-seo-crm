import { FastifyRequest, FastifyReply } from 'fastify';
// Models
import SessionModel from '@/models/session.model';
import UserModel from '@/models/user.model';
// Helpers
import { getClientInfo } from '@/shared/helpers/fastify';
import { compareClientInfos } from '@/shared/helpers/session';
// Utils
import ApiResponse from '@/shared/utils/ApiResponce.utils';
import { getTokenType } from '@/shared/utils/token';

// ============================
// Auth Middleware
// ============================
export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // Get Auth Header
        const authHeader = request.headers.authorization;
        console.log('Auth Header:', authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error();
        }
        const authToken = authHeader.substring(7);

        // Determine Token Type
        const authTokenType = getTokenType(authToken);
        if(authTokenType === 'unknown') {
            throw new Error();
        }

        // Validate Token
        let session;
        const clientInfo = getClientInfo(request);
        switch (authTokenType) {
            case 'session': {
                session = await SessionModel.findOne({ tokenHash: authToken });
                if (!session) {
                    throw new Error();
                }

                if(!compareClientInfos(session, clientInfo, 'light') ) {
                    throw new Error();
                }

                session.updateActivity();

                break;
            }
            case 'api': {
                // TODO: Implement API token authentication
                throw new Error();
            }
            default:
                throw new Error();
        }

        // Get User
        const user = await UserModel.findOne({ _id: session.userId, archived: false }).lean();
        if (!user) {
            throw new Error();
        }

        request.userId = user._id.toString();
        request.user = user;
        request.session = session;
        request.tokenHash = authToken;
        request.tokenHashType = authTokenType;

    } catch (error) {
        request.log.error(error);
        console.log('Authentication error:', error);
        return ApiResponse.unauthorized(reply, 'Authentication error');
    }
};
