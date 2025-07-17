import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  bio: z.string().optional(),
  profilePictureUrl: z.string().url().optional(),
  preferredLanguage: z.string().default('en'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userProfileSchema = z.object({
  fullName: z.string(),
  bio: z.string().optional(),
  profilePictureUrl: z.string().url().optional(),
  preferredLanguage: z.string(),
  updatedAt: z.string(), // ISO string
});

/**
 * Schema for user entity with profile
 */
export const userWithProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  isActive: z.boolean(),
  createdAt: z.string(), // ISO string
  updatedAt: z.string(), // ISO string
  profile: userProfileSchema.optional(), // optional if not joined
});
export const getAllRegisteredUsersResponseSchema = z.array(userWithProfileSchema);

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type loginInput = z.infer<typeof loginSchema>;

export type UserWithProfile = z.infer<typeof userWithProfileSchema>;
export type GetAllRegisteredUsersResponse = z.infer<typeof getAllRegisteredUsersResponseSchema>;
