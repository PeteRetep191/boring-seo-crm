import { z } from 'zod';

const permissionActionSchema = z.enum(['create', 'read', 'update', 'delete', 'list']);

const filterSchema = z.object({
  key: z.string().min(1, 'Filter key is required'),
  operator: z.enum(['eq', 'in', 'gt', 'lt', 'contains'])
});

const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  actions: z.array(permissionActionSchema).min(1, 'At least one action is required'),
  filters: z.array(filterSchema).optional(),
  filterLogic: z.enum(['AND', 'OR']).default('AND').optional()
});

export const servicePermissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required'),
  description: z.string().optional(),
  sections: z.array(sectionSchema).min(1, 'At least one section is required')
});
