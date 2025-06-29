import { Types } from 'mongoose';
import { z } from 'zod';

export const ReviewSchema = z.object({
  body: z.object({
    review: z.string().min(1, 'Review text is required'),
    rating: z
      .number()
      .min(0, 'Rating must be at least 0')
      .max(5, 'Rating cannot exceed 5'),
    service: z.string().refine(val => Types.ObjectId.isValid(val), {
      message: 'Invalid service ObjectId',
    }),
  }),
});
