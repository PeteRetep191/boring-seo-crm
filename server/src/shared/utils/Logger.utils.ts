import pino from 'pino';

export default class Logger {
    private static logger = pino({
        level: process.env.LOG_LEVEL || 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss UTC',
                ignore: 'pid,hostname'
            }
        }
    });

    static info(message: string, ...args: any[]): void {
        this.logger.info(message, ...args);
    }

    static error(message: string, ...args: any[]): void {
        this.logger.error(message, ...args);
    }

    static warn(message: string, ...args: any[]): void {
        this.logger.warn(message, ...args);
    }

    static debug(message: string, ...args: any[]): void {
        this.logger.debug(message, ...args);
    }

    static fatal(message: string, ...args: any[]): void {
        this.logger.fatal(message, ...args);
    }
}