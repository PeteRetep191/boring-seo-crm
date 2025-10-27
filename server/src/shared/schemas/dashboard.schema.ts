import { z } from 'zod';

export const dateStringSchema = z
  .string()
  .refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'Invalid date format' }
  )
  .transform(val => new Date(val));

export const dashboardDateSchema = z
  .object({
    start: dateStringSchema,
    end: dateStringSchema
  })
  .refine(
    (data) => data.start <= data.end,
    { message: 'Start date must be before or equal to end date' }
  );

export const dashboardUsersIdsSchema = z
  .array(z.string().trim())
