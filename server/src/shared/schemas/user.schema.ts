import { z } from 'zod';
import mongoose from 'mongoose';
import { servicePermissionSchema } from './permission.shema';

export const userNameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(100, 'Name cannot exceed 100 characters');

export const userEmailSchema = z
  .string()
  .trim()
  .email('Invalid email format')
  .max(100, 'Email cannot exceed 100 characters');

export const userExternalIdSchema = z
  .string()
  .trim()
  .optional();

export const userTelegramIdSchema = z
  .string()
  .trim()
  .optional();

export const userAvatarSchema = z
  .string()
  .trim()
  .optional();

export const userUsernameSchema = z
  .string()
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username cannot exceed 50 characters');

export const userPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters');

export const userRoleIdSchema = z
  .string()
  .refine(
    (val) => mongoose.Types.ObjectId.isValid(val),
    { message: 'Invalid ObjectId format for roleId' }
  )
  .transform(val => new mongoose.Types.ObjectId(val));

export const userSalarySchema = z.object({
  type: z.enum(['fixed', 'percentage']),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().trim().default('USD').optional()
}).default({ type: 'fixed', amount: 0 });

export const userPermissionsSchema = z
  .array(servicePermissionSchema)
  .default([]);

export const userArchivedSchema = z
  .boolean()
  .default(false);