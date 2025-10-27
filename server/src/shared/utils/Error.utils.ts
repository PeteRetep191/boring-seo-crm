import { ZodError } from "zod";

interface ErrorResult {
    message: string;
    statusCode: number;
    code?: string;
}

export default class ErrorUtils {
    static parseError(error: any): ErrorResult {
        // Zod validation errors
        if (error instanceof ZodError) {
            const messages = error.errors.map(e => {
                if (e.path.length === 0) {
                    if (e.code === 'invalid_type' && e.received === 'undefined') {
                        return 'Request body is required';
                    }
                    return `Validation failed: ${e.message}`;
                }
                return `${e.path.join('.')}: ${e.message}`;
            });
            return {
                message: messages.join(', '),
                statusCode: 400,
                code: 'VALIDATION_ERROR'
            };
        }

        // MongoDB errors
        if (error.name === 'MongoServerError') {
            if (error.code === 11000) {
                return {
                    message: 'Resource already exists',
                    statusCode: 409,
                    code: 'DUPLICATE_ERROR'
                };
            }
            return {
                message: 'Database error',
                statusCode: 500,
                code: 'DATABASE_ERROR'
            };
        }

        if (error.name === 'CastError') {
            return {
                message: 'Invalid ID format',
                statusCode: 400,
                code: 'INVALID_ID'
            };
        }

        // HTTP errors with status codes
        if (error.statusCode) {
            return {
                message: error.message || 'Request failed',
                statusCode: error.statusCode,
                code: error.code || 'HTTP_ERROR'
            };
        }

        // Default error
        return {
            message: error.message || 'Internal server error',
            statusCode: 500,
            code: 'INTERNAL_ERROR'
        };
    }
}