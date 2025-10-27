import { createAxiosInstance } from "@/shared/lib/http";
// DTOs
// import { LoginRequestDTO, LoginResponseDTO, LogoutResponseDTO,  } from "../contracts/backend/auth.dto";

// Create Axios Instance
const apiClient = createAxiosInstance({ baseURL: '/api/auth' , options: { withSession: true } });

// ===============================
// Auth API Methods
// ===============================
export const login = async (data: any): Promise<any> => {
    return apiClient.post('/login', data);
}

export const logout = async (): Promise<any> => {
    return apiClient.get('/logout');
}