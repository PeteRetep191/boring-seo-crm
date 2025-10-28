import { FastifyInstance } from 'fastify';
// Core
import ConfigManager from '@/core/ConfigManager';
// Clients
import MongoDBClient from '@/clients/MongoDB.client';
// Routes
import multipart from '@fastify/multipart';
import userRoutes from '@/api/user/user.routes';
import authRoutes from '@/api/auth/auth.routes';
import offerRoutes from '@/api/offer/offer.routes';
import filesRoutes from '@/api/files/files.routes';
import dashboardRoutes from '@/api/dashboard/dashboard.routes';

class Router {
    private fastify: FastifyInstance;

    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
    }

    /**
     * Реєстрація всіх роутів додатку
     */
    async registerRoutes(): Promise<void> {
        await this.fastify.register(async (fastify) => {
            await fastify.register(multipart, {
                attachFieldsToBody: false,
                limits: { fileSize: 5 * 1024 * 1024, files: 1 },
            });

            await fastify.register(authRoutes, { prefix: '/auth' });
            await fastify.register(userRoutes, { prefix: '/users' });
            await fastify.register(offerRoutes, { prefix: '/offers' });
            await fastify.register(filesRoutes, { prefix: '/files' });
            await fastify.register(dashboardRoutes, { prefix: '/dashboard' });
        });

        await this.registerHealthRoutes();
        this.fastify.log.info('All routes registered');
    }

    /**
     * Health check роути
     */
    private async registerHealthRoutes(): Promise<void> {
        // GET /health
        this.fastify.get('/health', async (request, reply) => {
            return {
                status: 'ok',
                uptime: process.uptime(),
                clients: {
                    mongodb: await MongoDBClient.ping()
                }
            };
        });

        // GET /
        this.fastify.get('/', async (request, reply) => {
            return {
                service: ConfigManager.getAppConfig().appName,
                version: ConfigManager.getAppConfig().appVersion,
                status: 'running'
            };
        });
    }
}

export default Router;