import { z } from 'zod';

export const createCleaningContact = z.object({
  body: z.object({
    category: z
      .string()
      .min(1, { message: 'Category name is required' })
      .refine(
        value =>
          [
            'Residential Cleaning Services',
            'Move-in/Move-out Cleaning',
            'Carpet Cleaning Service',
            'Commercial Cleaning Service',
          ].includes(value),
        {
          message: 'Invalid service name',
        }
      ),
    name: z.string().min(1, { message: 'Name are required' }),
    email: z.string().min(1, { message: 'Email are required' }),
    message: z.string().min(1, { message: 'Message are required' }),
  }),
});
