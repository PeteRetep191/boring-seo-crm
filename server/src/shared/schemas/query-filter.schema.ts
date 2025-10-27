import { z } from 'zod';

const queryFilterSchema = z.object({
  key: z.string(),
  operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'like']),
  value: z.union([
    z.string(),
    z.number(),
    z.array(z.string()),
    z.array(z.number())
  ])
});

export default queryFilterSchema;