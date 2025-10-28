import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';
import { getSessionId, clearAuth } from '@/shared/lib/storage';
import { redirectTo } from '@/shared/helpers/path';

const DEFAULT_TIMEOUT = 60000;

const isFormData = (data: any) =>
  typeof FormData !== 'undefined' && data instanceof FormData;

export type CreateAxiosInstanceProps = {
  baseURL: string,
  config?: AxiosRequestConfig,
  options?: { withSession?: boolean },
};

const createAxiosInstance = (props: CreateAxiosInstanceProps): AxiosInstance => {
  const { baseURL, config, options } = props;

  const instance = axios.create({
    baseURL,
    timeout: DEFAULT_TIMEOUT,
    ...config,
  });

  instance.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
    cfg.headers = cfg.headers ?? {};

    // Auth
    if (options?.withSession) {
      const sessionId = getSessionId();
      if (sessionId) cfg.headers['Authorization'] = `Bearer ${sessionId}`;
    }

    // Content-Type
    if (isFormData(cfg.data)) {
      try {
        (cfg.headers as any).delete?.('Content-Type');
      } catch {
        (cfg.headers as any)['Content-Type'] = undefined;
      }
    } else {
      if (!(cfg.headers as any)['Content-Type']) {
        (cfg.headers as any)['Content-Type'] = 'application/json';
      }
    }

    return cfg;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (axios.isCancel(error)) return Promise.reject(error);
      if (error.response?.status === 401 && options?.withSession) {
        clearAuth();
        redirectTo('login');
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxiosInstance;