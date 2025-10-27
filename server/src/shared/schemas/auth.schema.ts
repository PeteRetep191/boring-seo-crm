import { z } from 'zod';
import mongoose from 'mongoose';

export const userIdSchema = z
  .string()
  .refine(mongoose.Types.ObjectId.isValid, { message: 'Invalid ObjectId' })
  .transform((v) => new mongoose.Types.ObjectId(v));

export const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(100, 'Username cannot exceed 100 characters');

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(256, 'Password cannot exceed 256 characters');

export const rememberMeSchema = z
  .boolean()
  .default(false);