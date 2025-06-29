import { z } from 'zod';

const serviceSchema = z.object({
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
  details: z.string().min(1, { message: 'Details are required' }),
  serviceName: z.string().min(1, { message: 'ServiceName are required' }),
  price: z.number().min(0, { message: 'Price must be non-negative' }),
  additionalServices: z.record(z.number()).optional(),
});

const updateServiceSchema = z.object({
  category: z
    .string()
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
    )
    .optional(),
  details: z.string().optional(),
  serviceName: z.string().optional(),
  price: z.number().optional(),
  additionalServices: z.record(z.number()).optional(),
});

export const CleaningServiceValidation = {
  serviceSchema,
  updateServiceSchema,
};
