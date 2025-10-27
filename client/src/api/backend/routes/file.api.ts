import { createAxiosInstance } from "@/shared/lib/http";
// Create Axios Instance
const apiClient = createAxiosInstance({ baseURL: '/api/files' , options: { withSession: true } });

// ===============================
// Auth API Methods
// ===============================
export const uploadFile = async (file: File) => {
  const form = new FormData();
  form.append('file', file);

  const res = await apiClient.post('/upload', form);
  const payload = res.data?.result ?? res.data;
  return {
    url: payload?.url,
    path: payload?.path,
    mime: payload?.mime,
  };
};