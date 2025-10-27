import { z } from 'zod';
import dotenv from 'dotenv';
import Logger from '@/shared/utils/Logger.utils';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  COOKIE_SECRET: z.string().min(1, 'COOKIE_SECRET is required'),
});

export type IEnv = z.infer<typeof envSchema>;

class EnvManager {
  private _env: IEnv | null = null;
  private _isInitialized = false;

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  async init(): Promise<void> {
    dotenv.config();

    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      // Лаконично выводим ошибки по полям
      const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
      Logger.error('Environment validation failed:', issues);
      throw new Error('Environment validation failed');
    }

    this._env = parsed.data;
    this._isInitialized = true;
    Logger.info('Environment initialized');
  }

  get(): IEnv {
    if (!this._env) {
      throw new Error('Environment is not initialized');
    }
    return this._env;
  }

  getVar<K extends keyof IEnv>(key: K): IEnv[K] {
    return this.get()[key];
  }

  isDevelopment(): boolean {
    return this.get().NODE_ENV === 'development';
  }

  isProduction(): boolean {
    return this.get().NODE_ENV === 'production';
  }
}

// Singleton instance
const instance = new EnvManager();
export default instance;