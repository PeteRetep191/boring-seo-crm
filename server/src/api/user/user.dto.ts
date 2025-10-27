import { z } from 'zod';
import * as userSchemas from './user.schemas';

export type FetchUsersDTO = z.infer<typeof userSchemas.fetchUsersSchema>;
export type FetchUserByIdDTO = z.infer<typeof userSchemas.fetchUserByIdSchema>;
export type CreateUserDTO = z.infer<typeof userSchemas.createUserSchema>;
export type UpdateUserDTO = z.infer<typeof userSchemas.updateUserSchema>;
export type DeleteUserByIdDTO = z.infer<typeof userSchemas.deleteUserByIdSchema>;
export type DeleteBulkUsersDTO = z.infer<typeof userSchemas.deleteBulkUsersSchema>;