import { z } from 'zod';
import mongoose from 'mongoose';
import { servicePermissionSchema } from './permission.shema';

export const roleNameSchema = z
  .string()
  .trim()
  .min(1, 'Role name is required')
  .max(50, 'Role name cannot exceed 50 characters')
  .transform(val => val.toUpperCase());

export const roleArchivedSchema = z
  .boolean()
  .default(false);

export const roleDescriptionSchema = z
  .string()
  .trim()
  .max(200, 'Description cannot exceed 200 characters')
  .optional();

export const rolePermissionsSchema = z
  .array(servicePermissionSchema)
  .default([]);

export const roleCreatedBySchema = z
  .string()
  .refine(
    (val) => mongoose.Types.ObjectId.isValid(val),
    { message: 'Invalid ObjectId format for createdBy' }
  )
  .transform(val => new mongoose.Types.ObjectId(val));
