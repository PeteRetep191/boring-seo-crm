import { createAxiosInstance } from "@/shared/lib/http";
import { BaseApiResponseWithAxios } from "../types";
// Create Axios Instance
const apiClient = createAxiosInstance({ baseURL: '/api/dashboard' , options: { withSession: true } });

// ===============================
// Auth API Methods
// ===============================
export const fetchDashboard = async (): Promise<BaseApiResponseWithAxios<{
    sites: { total: number; active: number; archived: number; };
    offers: { total: number; active: number; archived: number; };
}>> => {
    return apiClient.get('/');
}