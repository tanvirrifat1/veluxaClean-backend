import { z } from 'zod';

const createBlogZodSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  description: z.string({ required_error: 'description is required' }),
});

export const BlogValidation = {
  createBlogZodSchema,
};
