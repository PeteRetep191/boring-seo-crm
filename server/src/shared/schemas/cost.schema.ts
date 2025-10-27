import { z } from 'zod';
import mongoose from 'mongoose';

export const costDescriptionSchema = z
  .string()
  .trim()
  .max(500, 'Description cannot exceed 500 characters')
  .optional();

export const costAmountSchema = z
  .number()
  .positive('Amount must be positive')
  .max(1000000, 'Amount cannot exceed 1,000,000');

export const autoFeeSchema = z
  .boolean()
  .default(false);

export const costFeeProcentSchema = z
  .number()
  .min(0, 'Fee procent must be at least 0')
  .max(100, 'Fee procent cannot exceed 100')
  .default(0);

export const costFeeSchema = z
  .number()
  .optional();

export const costCurrencySchema = z
  .string()
  .trim()
  .length(3, 'Currency must be 3 characters')
  .default('USD');

export const costDateSchema = z
  .coerce
  .date()
  .default(() => new Date());

export const costOwnerSchema = z
  .string()
  .refine(
    (val) => mongoose.Types.ObjectId.isValid(val),
    { message: 'Invalid ObjectId format for owner' }
  )
  .transform(val => new mongoose.Types.ObjectId(val))
  .optional();

export const costCreatedBySchema = z
  .string()
  .refine(
    (val) => mongoose.Types.ObjectId.isValid(val),
    { message: 'Invalid ObjectId format for createdBy' }
  )
  .transform(val => new mongoose.Types.ObjectId(val));

export const mediaSourceSchema = z
  .enum(['BroCard', 'Epn', 'Agent1', 'Agent2'], {
    errorMap: () => ({ message: 'Source must be one of: BroCard, Epn, Agent1, Agent2' })
  });

export const mediaGeoSchema = z
  .string()
  .trim()
  .length(2, 'Geo must be 2 characters (ISO code)')
  .toUpperCase();

export const technicalCategorySchema = z
  .enum(['Accounts', 'Proxy', 'Design', 'Services', 'Other'], {
    errorMap: () => ({ message: 'Category must be one of: Accounts, Proxy, Design, Services, Other' })
  });

export const filterSchema = z.object({
  key: z.string(),
  operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'like']),
  value: z.union([
    z.string(),
    z.number(),
    z.array(z.string()),
    z.array(z.number())
  ])
});