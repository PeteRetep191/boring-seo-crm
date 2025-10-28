import { z } from 'zod';
import { fetchQuerySchema } from '@/shared/schemas';

const name = z.string().trim().min(1, 'name is required');
const email = z.string().trim().min(1, 'email is required').email('invalid email');
const password = z.string().trim().min(8, 'password must be at least 8 chars');

export const fetchDashboardSchema = z.object({
  query: fetchQuerySchema.optional(),
});
