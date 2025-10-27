import mongoose, { ConnectOptions } from 'mongoose';
// Interfaces
import { IBaseClient } from '@/shared/interfaces/common.interface';
// Core
import ConfigManager    from '@/core/ConfigManager';
// Utils
import LoggerService    from '@/shared/utils/Logger.utils';

// ================================
// Main MongoDB Client
// ================================
class MongoDBClient implements IBaseClient<IMongoConfig> {
    // -------------------------------
    // Private Properties
    // -------------------------------
    private _isConnected: boolean = false;
    private _uri: string = '';
    private _options: ConnectOptions = {};

    // -------------------------------
    // Getters
    // -------------------------------
    /**
     * Возвращает состояние подключения к MongoDB
     * @returns {boolean} - true если подключено, иначе false
     */
    public get isConnected(): boolean {
        return this._isConnected;
    }

    /**
     * Возвращает состояние подключения к MongoDB
     * @returns {boolean} - true если подключено, иначе false
     */
    public get getState(): boolean {
        return this._isConnected;
    }

    // -------------------------------
    // Core Methods
    // -------------------------------
    /**
     * Инициализация клиента MongoDB
     * @param config - Конфигурация подключения
     */
    async init(config: IMongoConfig): Promise<void> {
        this._uri = config.url;
        this._options = {
            ...ConfigManager.getMongooseConfig(),
            ...config.extraOptions
        };

        mongoose.connection.on('connected', () => {
            LoggerService.info('MongoDB connected');
            this._isConnected = true;
        });
        mongoose.connection.on('disconnected', () => {
            LoggerService.error('MongoDB disconnected');
            this._isConnected = false;
        });
        mongoose.connection.on('error', (err) => {
            LoggerService.error('MongoDB error:', err);
            this._isConnected = false;
        });
    }

    /**
     * Создает новое подключение к MongoDB если его нет
     * @returns 
     */
    async connect(): Promise<void> {
        if (this._isConnected) {
            LoggerService.warn('MongoDB already connected');
            return;
        }

        if (!this._uri) {
            throw new Error('MongoDB URI is not set. Call init() first.');
        }

        try {
            await mongoose.connect(this._uri, this._options);
        } catch (error) {
            LoggerService.error('MongoDB connection failed:', error);
            throw error;
        }
    }

    /**
     * Закрывает подключение к MongoDB если оно есть
     * @returns 
     */
    async disconnect(): Promise<void> {
        if (this._isConnected) {
            await mongoose.disconnect();
            this._isConnected = false;
            LoggerService.info('MongoDB disconnected');
        }
    }

    /**
     * Проверяет состояние подключения к MongoDB
     * @returns 
     */
    async ping(): Promise<"pong" | false> {
        try {
            if (!this._isConnected || mongoose.connection.readyState !== 1) {
                return false;
            }

            const db = mongoose.connection.db;
            if (!db) {
                return false;
            }

            const result = await db.admin().ping();
            return result.ok ? "pong" : false;
        } catch (error) {
            return false;
        }
    }
}

const instance = new MongoDBClient();
export default instance;


// ================================
// Interfaces
// ================================
export interface IMongoConfig {
    url: string;
    extraOptions?: ConnectOptions;
}