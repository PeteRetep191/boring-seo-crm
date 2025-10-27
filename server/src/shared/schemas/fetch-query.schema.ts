import { z } from 'zod';
import queryFilterSchema from './query-filter.schema';

const fetchQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    filters: z.array(queryFilterSchema).optional()
});

export default fetchQuerySchema;