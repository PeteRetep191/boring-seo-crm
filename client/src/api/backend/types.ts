import { AxiosResponse } from "axios"

export type BaseApiResponse<T> = {
  success: boolean;
  result: T;
  timestamp: string;
}
export type BaseApiResponseWithAxios<T> = AxiosResponse<BaseApiResponse<T>>;