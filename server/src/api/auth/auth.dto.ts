import { z } from 'zod';
import { userIdSchema } from '@/shared/schemas/auth.schema';

// Fields Schemas
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(6).max(100);
export const rememberMeSchema = z.boolean().default(false);

// DTO Schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: rememberMeSchema  
});

export const logoutSchema = z.object({
  userId: userIdSchema
});

// DTO Types
export type LoginDto = z.infer<typeof loginSchema>;
export type LogoutDto = z.infer<typeof logoutSchema>;