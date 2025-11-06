import { createAxiosInstance } from "@/shared/lib/http";
// DTOs
import {
  FetchOffersDTO,
  CreateOfferDTO,
  UpdateOfferDTO,
} from "@/api/backend/contracts/offer.dto";

// Create Axios Instance
const apiClient = createAxiosInstance({
  baseURL: "/api/offers",
  options: { withSession: true },
});

// ===============================
// Helpers
// ===============================
const withEncodedFilters = (params: FetchOffersDTO) => {
  const { filters, ...rest } = params || {};
  return {
    ...rest,
    ...(Array.isArray(filters)
      ? { filters: encodeURIComponent(JSON.stringify(filters)) }
      : {}),
  };
};

// ===============================
// Auth API Methods
// ===============================
export const fetchOffers = async (params: FetchOffersDTO): Promise<any> => {
  return apiClient.get("/", { params: withEncodedFilters(params) });
};

export const getOfferById = async (offerId: string): Promise<any> => {
  return apiClient.get(`/${offerId}`);
};

export const createOffer = async (data: CreateOfferDTO): Promise<any> => {
  return apiClient.post("/", data);
};

export const updateOffer = async (data: {
  offerId: string;
  updatedOfferData: UpdateOfferDTO;
}): Promise<any> => {
  return apiClient.put(`/${data.offerId}`, data.updatedOfferData);
};

export const patchOffer = async (data: {
  offerId: string;
  updatedOfferData: UpdateOfferDTO;
}): Promise<any> => {
  return apiClient.patch(`/${data.offerId}`, data.updatedOfferData);
};

export const deleteOfferById = async (offerId: string): Promise<void> => {
  return apiClient.delete(`/${offerId}`);
};
