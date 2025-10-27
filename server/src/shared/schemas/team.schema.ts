import { z } from 'zod';
import mongoose from 'mongoose';

export const teamNameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(100, 'Name cannot exceed 100 characters');

export const teamAvatarSchema = z
  .string()
  .trim()
  .optional();

export const teamDescriptionSchema = z
  .string()
  .trim()
  .optional();

export const teamMembersSchema = z
  .array(
    z.string().refine(
      (val) => mongoose.Types.ObjectId.isValid(val),
      { message: 'Invalid ObjectId format for member' }
    )
  )
  .default([]);

export const teamOwnerIdSchema = z
  .string()
  .refine(
    (val) => mongoose.Types.ObjectId.isValid(val),
    { message: 'Invalid ObjectId format for ownerId' }
  )
  .transform(val => new mongoose.Types.ObjectId(val));

export const teamOwnerSalarySchema = z.object({
  type: z.enum(['fixed', 'percentage']),
  amount: z.number().min(0, 'Amount must be positive or zero'),
  currency: z.string().trim().default('USD').optional()
});

export const teamArchivedSchema = z
  .boolean()
  .default(false);