import { z } from 'zod';
import * as dashboardSchemas from './dashboard.schemas';

export type FetchDashboardDTO = z.infer<typeof dashboardSchemas.fetchDashboardSchema>;