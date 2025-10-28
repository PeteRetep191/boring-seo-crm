// offer.schemas.ts
import { z } from "zod";
import { fetchQuerySchema } from "@/shared/schemas";

const name = z.string().trim().min(1, "name is required");
const url = z.string().trim().optional().nullable();
const bonus = z.string().trim().min(1, "bonus is required");
const rating = z.coerce.number().min(0).max(5);
const description = z.string().trim().optional().nullable();
const brandAdvantages = z.array(z.string().trim()).default([]);

export const fetchOffersSchema = fetchQuerySchema;

export const fetchOfferByIdSchema = z.object({ offerId: z.string().min(1) });

export const createOfferSchema = z.object({
  name,
  logoUrl: url,
  bonus,
  description,
  rating,
  partnerUrl: url,
  brandAdvantages,
  archived: z.boolean().optional(),
});

export const updateOfferSchema = z.object({
  name: name.optional(),
  logoUrl: url,
  bonus: bonus.optional(),        // string
  description,
  rating: rating.optional(),
  partnerUrl: url,
  brandAdvantages: brandAdvantages.optional(),
  archived: z.boolean().optional(),
});

export const deleteOfferByIdSchema = z.object({ offerId: z.string().min(1) });