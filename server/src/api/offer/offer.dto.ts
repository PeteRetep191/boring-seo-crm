import type { z } from "zod";
import {
  fetchOffersSchema,
  fetchOfferByIdSchema,
  createOfferSchema,
  updateOfferSchema,
  deleteOfferByIdSchema,
} from "./offer.schemas";

export type FetchOffersDTO = z.infer<typeof fetchOffersSchema>;
export type FetchOfferByIdDTO = z.infer<typeof fetchOfferByIdSchema>;
export type CreateOfferDTO = z.infer<typeof createOfferSchema>;
export type UpdateOfferDTO = z.infer<typeof updateOfferSchema>;
export type DeleteOfferByIdDTO = z.infer<typeof deleteOfferByIdSchema>;

export type OfferDTO = {
  _id: string;
  name: string;
  logoUrl?: string | null;
  bonus: string;
  description?: string | null;
  rating: number;
  partnerUrl?: string | null;
  brandAdvantages: string[];
  isActive?: boolean;
  archived: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};
