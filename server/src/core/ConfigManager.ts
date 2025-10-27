// Types
import { FastifyServerOptions } from 'fastify';
import { ConnectOptions } from 'mongoose';
import { AppConfig } from '@/shared/types/config.types';

// Package
import pkg from '../../package.json'

// ============================
// Main Class
// ============================
class ConfigManager {

    /**
     * Возвращает основную информацию о приложении.
     * @returns {AppConfig}
     */
    static getAppConfig(): AppConfig {
        return {
            appName: pkg.name,
            appVersion: pkg.version
        }
    }

    /**
     * Возвращает конфигурацию Fastify.
     * @returns {FastifyServerOptions}
     */
    static getFastifyConfig(): FastifyServerOptions {
        return {
            logger: {
                level: 'info',
                transport: {
                    target: 'pino-pretty',
                    options: {
                        translateTime: 'HH:MM:ss Z',
                        ignore: 'pid,hostname'
                    }
                }
            },

            keepAliveTimeout:       30000,
            connectionTimeout:      60000,
            bodyLimit:              1048576,

            trustProxy:             true,
            caseSensitive:          true,

            requestTimeout:         30000,

            forceCloseConnections:  'idle'
        };
    }

    /**
     * Возвращает конфигурацию Mongoose.
     * @returns {ConnectOptions}
     */
    static getMongooseConfig(): ConnectOptions {
        return {
            maxPoolSize:            5,
            minPoolSize:            2,
            maxIdleTimeMS:          60000,

            retryWrites:            true,
            retryReads:             true,

            bufferCommands:         true,

            heartbeatFrequencyMS:   5000,
        };
    }
}

export default ConfigManager;