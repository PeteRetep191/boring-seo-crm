import { SESSION_ID_KEY } from "@/shared/constants/storage-keys";
import { ISessionId } from "./types";

export const saveSessionId = (sessionId: ISessionId): void => {
  localStorage.setItem(SESSION_ID_KEY, sessionId);
};

export const getSessionId = (): ISessionId | null => {
  return localStorage.getItem(SESSION_ID_KEY) as ISessionId | null;
};

export const clearSessionId = (): void => {
  localStorage.removeItem(SESSION_ID_KEY);
}