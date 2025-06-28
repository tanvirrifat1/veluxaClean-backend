import { z } from 'zod';

const createBlogZodSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  description: z.string({ required_error: 'description is required' }),
});

const updateBlogZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export const BlogValidation = {
  createBlogZodSchema,
  updateBlogZodSchema,
};
