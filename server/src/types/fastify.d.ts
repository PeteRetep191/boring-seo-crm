import { FastifyRequest, FastifyReply } from 'fastify';
import { ServicePermission } from '@/shared/types';
// Types
import { IUser } from '@/models/user.model';
import { ISessionDocument } from '@/models/session.model';

declare module 'fastify' {
    interface FastifyRequest {
        tokenHash: string;
        tokenHashType: 'session' | 'api' | unknown;
        session: ISessionDocument;
        user: IUser;
        userId: string;
    }
}