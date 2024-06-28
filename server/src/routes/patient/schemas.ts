import { z } from 'zod';

export const Patient = z.object({
  firstName: z.string(),
  middleName: z.optional(z.string()),
  lastName: z.string(),
  dateOfBirth: z.coerce.date(),
  status: z.string(),
  addresses: z.array(
    z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    }),
  ),
  customFields: z.array(
    z.object({
      id: z.string(),
      value: z.string(),
    }),
  ).optional(),
});

export const IdSchema = z.object({
  id: z.string(),
});
