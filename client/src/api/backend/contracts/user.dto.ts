import type { AxiosResponse } from "axios";

// ===============================
// Requests
// ===============================
export type UpdateUserDTO = {
    userId?: string;
    updatedUserData: any;
}

export type ChangeUserPasswordDTO = {
    userId: string;
    oldPassword: string;
    newPassword: string;
}

export type FetchUsersDTO = {
    page: number;
    limit: number;
    filters?: string;
    search?: string;
}

// ===============================
// Responses
// ===============================
// export type GetMeResponseDTO = AxiosResponse<BaseApiResponse<{
//     id: string;
//     username: string;
//     email: string;
//     fullName: string;
//     roles: string[];
// }>>;