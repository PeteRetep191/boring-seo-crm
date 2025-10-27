import { FastifyReply } from 'fastify';

export default class ApiResponse {
    private static send(reply: FastifyReply, data: any, statusCode: number): void {
        reply.status(statusCode).send({ ...data, timestamp: new Date().toISOString() });
    }

    static success<T>(reply: FastifyReply, result: T, statusCode = 200): void {
        this.send(reply, { success: true, result }, statusCode);
    }

    static error(reply: FastifyReply, error: any, statusCode = 500, code?: string): void {
        this.send(reply, { success: false, error }, statusCode);
    }

    static paginated<T>(reply: FastifyReply, result: T[], page: number, limit: number, total: number): void {
        this.send(reply, {
            success: true,
            result,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }, 200);
    }

    static notFound(reply: FastifyReply, message: string = 'Resource not found'): void {
        this.error(reply, { message }, 404);
    }

    static unauthorized(reply: FastifyReply, message: string = 'Unauthorized'): void {
        this.error(reply, { message }, 401);
    }

    static internalError(reply: FastifyReply, message: string = 'Internal server error'): void {
        this.error(reply, { message }, 500);
    }
    
    static forbidden(reply: FastifyReply, message: string = 'Forbidden'): void {
        this.error(reply, { message }, 403);
    }
}