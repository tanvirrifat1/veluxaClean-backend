import { z } from 'zod';
import { Types } from 'mongoose';

export const bookingZodSchema = z.object({
  body: z.object({
    service: z.string().refine(val => Types.ObjectId.isValid(val), {
      message: 'Invalid service ObjectId',
    }),
    date: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    description: z.string().min(1, { message: 'Description is required' }),
    time: z.string().min(1, { message: 'Time is required' }),
  }),
});
