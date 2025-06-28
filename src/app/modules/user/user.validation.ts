import { z } from 'zod';

const createUserZodSchema = z.object({
  name: z.string().optional(),
  email: z.string({ required_error: 'Email name is required' }),
  password: z.string({ required_error: 'Password is required' }),
});

const updateZodSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const UserValidation = {
  createUserZodSchema,
  updateZodSchema,
};
