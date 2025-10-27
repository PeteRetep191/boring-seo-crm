// import { BaseApiResponse } from "@/shared/types/api/backend/response.types"
import type { AxiosResponse } from "axios";

// ===============================
// Requests
// ===============================
export type LoginRequestDTO = {
    username: string;
    password: string;
    rememberMe?: boolean
}

export type LogoutRequestDTO = {
    sessionId: string;
}

// ===============================
// Responses
// ===============================
export type LoginResponseDTO = AxiosResponse<any>;

export type LogoutResponseDTO = AxiosResponse<any>;