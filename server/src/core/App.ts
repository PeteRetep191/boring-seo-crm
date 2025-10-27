import { FastifyInstance, fastify } from 'fastify';

// Plugins
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import filesPlugin from '@/plugins/files';

// Core
import EnvManager from '@/core/EnvManager';
import ConfigManager from '@/core/ConfigManager';
import Router from '@/core/Router';

// Utils
import Logger from '@/shared/utils/Logger.utils';
import ErrorHandler from '@/shared/utils/ErrorHandler.utils';

// ============================
// Main Class
// ============================
class App implements IApp {
    private _fastify: FastifyInstance;
    private _router: Router;

    private _isRunning: boolean = false;

    constructor() {
        this._fastify = fastify(ConfigManager.getFastifyConfig());
        this._router = new Router(this._fastify);

        this._isRunning = false;
    }

    public get isRunning(): boolean {
        return this._isRunning;
    }

    /**
     * Ініціалізує Fastify, реєструє маршрути та налаштовує middleware.
     * Викликається перед запуском сервера.
     * @return Promise<void>
     */
    async init(): Promise<void> {
        await this.setupMiddleware();
        await this._router.registerRoutes();
        await this._fastify.register(filesPlugin);
        Logger.info('Application initialized');
    }

    /**
     * Запускается сервер Fastify на указаном порте.
     * @returns Promise<void>
     */
    async run(): Promise<void> {
        if (!this._fastify) {
            Logger.error('Fastify instance is not initialized');
            return;
        }

        if (!EnvManager.isInitialized) {
            Logger.error('Environment is not initialized');
            return;
        }

        try {
            const port = EnvManager.getVar('PORT');
            const address = await this._fastify.listen({ 
                port, 
                host: '0.0.0.0' 
            });
            
            this._isRunning = true;
            Logger.info(`I'm ready on ${address}`);
        } catch (error) {
            console.error(error);
            Logger.error('Error starting server:', error);
            process.exit(1);
        }
    }

    /**
     * Завершує роботу сервера та закриває всі підключення.
     * Використовується для коректного завершення роботи при отриманні сигналів зупинки.
     * @return Promise<void>
     */
    async shutdown(): Promise<void> {
        if (!this._isRunning || !this._fastify) {
            Logger.warn('Server is not running or not initialized, nothing to shut down.');
            return;
        }

        try {
            await this._fastify.close();
            this._isRunning = false;
            Logger.info('Server shut down gracefully');
        } catch (error) {
            Logger.error('Error shutting down server:', error);
        }
    }

    /**
     * Ініціалізує middleware для екземпляра Fastify.
     * Це включає обробку cookie, CORS, заголовки безпеки та обмеження швидкості.
     */
    private async setupMiddleware(): Promise<void> {
        await this._fastify.register(helmet);
        await this._fastify.register(cors, {
            origin: true,
            credentials: true
        });
        await this._fastify.register(cookie, {
            secret: process.env.COOKIE_SECRET,
            parseOptions: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            }
        });
        await this._fastify.register(rateLimit, {
            max: 100,
            timeWindow: '1 minute'
        });
        this._fastify.setErrorHandler(ErrorHandler.handle);
    }

}

// ===========================
// Interface
// ===========================
interface IApp {
    init(fastify: FastifyInstance): Promise<void>;
    run(): Promise<void>;
    shutdown(): Promise<void>;
    isRunning: boolean;
}

// ============================
// Export singleton instance
// ============================
const instance = new App();
export default instance;
