import { z } from 'zod';
import { fetchQuerySchema } from '@/shared/schemas';

const name = z.string().trim().min(1, 'name is required');
const url = z.string().trim().optional().nullable();
const bonus = z.number().min(0, 'bonus must be >= 0');
const bonusCurrency = z.string().trim().min(1, 'bonusCurrency is required');
const bonusDescription = z.string().trim().optional().nullable();
const rating = z.number().min(0).max(5);
const brandAdvantages = z.array(z.string().trim()).default([]);

export const fetchOffersSchema = fetchQuerySchema;

export const fetchOfferByIdSchema = z.object({
  offerId: z.string().min(1),
});

export const createOfferSchema = z.object({
  name,
  logoUrl: url,
  bonus,
  bonusCurrency,
  bonusDescription,
  rating,
  partnerUrl: url,
  brandAdvantages,
  archived: z.boolean().optional(),
});

export const updateOfferSchema = z.object({
  name: name.optional(),
  logoUrl: url,
  bonus: bonus.optional(),
  bonusCurrency: bonusCurrency.optional(),
  bonusDescription,
  rating: rating.optional(),
  partnerUrl: url,
  brandAdvantages: brandAdvantages.optional(),
  archived: z.boolean().optional(),
});

export const deleteOfferByIdSchema = z.object({
  offerId: z.string().min(1),
});