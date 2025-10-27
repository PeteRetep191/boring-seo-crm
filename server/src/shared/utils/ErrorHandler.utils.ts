import { FastifyError, FastifyRequest, FastifyReply } from "fastify"
import ApiResponse from "./ApiResponce.utils";

export default class ErrorHandler {
    static handle(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
        if (error.validation) {
            return ApiResponse.error(reply, 'Validation failed', 400, 'VALIDATION_ERROR');
        }

        const errorMap = {
            429: { message: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' },
            401: { message: 'Unauthorized', code: 'UNAUTHORIZED' },
            403: { message: 'Forbidden', code: 'FORBIDDEN' },
            404: { message: 'Resource not found', code: 'NOT_FOUND' }
        };

        const errorInfo = errorMap[error.statusCode as keyof typeof errorMap];
        if (errorInfo) {
            return ApiResponse.error(reply, errorInfo.message, error.statusCode, errorInfo.code);
        }

        const statusCode = error.statusCode || 500;
        const message = statusCode < 500 ? error.message : 'Internal server error';
        
        return ApiResponse.error(reply, message, statusCode);
    }
}