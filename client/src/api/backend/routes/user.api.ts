import { createAxiosInstance } from "@/shared/lib/http";
// DTOs
import { UpdateUserDTO, FetchUsersDTO, ChangeUserPasswordDTO } from "../contracts/user.dto";

// Create Axios Instance
const apiClient = createAxiosInstance({ baseURL: '/api/users' , options: { withSession: true } });

// ===============================
// Auth API Methods
// ===============================
export const getMe = async (): Promise<any> => {
    return apiClient.get('/me');
}

export const fetchUsers = async (data: FetchUsersDTO): Promise<any> => {
    return apiClient.get('/', { params: data });
}

export const updateUser = async (data: UpdateUserDTO): Promise<any> => {
    return apiClient.put(`/${data.userId}`, data.updatedUserData);
}

export const changePassword = async (data: ChangeUserPasswordDTO): Promise<any> => {
    return apiClient.post(`/${data.userId}/change-password`, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
    });
}

export const deleteUserById = async (userId: string): Promise<void> => {
    return apiClient.delete(`/${userId}`);
}

export const changePasswordAsRoot = async (data: { userId: string; newPassword: string }): Promise<void> => {
    return apiClient.post(`/${data.userId}/change-password-as-root`, {
        newPassword: data.newPassword
    });
}

export const createRootUser = async (data: { name: string; email: string; password: string }): Promise<any> => {
    return apiClient.post('/root', data);
}