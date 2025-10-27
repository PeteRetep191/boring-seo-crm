import { z } from 'zod';
import * as OfferSchemas from './offer.schemas';

export type FetchOffersDTO = z.infer<typeof OfferSchemas.fetchOffersSchema>;
export type FetchOfferByIdDTO = z.infer<typeof OfferSchemas.fetchOfferByIdSchema>;
export type CreateOfferDTO = z.infer<typeof OfferSchemas.createOfferSchema>;
export type UpdateOfferDTO = z.infer<typeof OfferSchemas.updateOfferSchema>;
export type DeleteOfferByIdDTO = z.infer<typeof OfferSchemas.deleteOfferByIdSchema>;