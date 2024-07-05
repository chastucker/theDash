import { z } from 'zod';

export const AddPatientBody = z.object({
  firstName: z.string(),
  middleName: z.optional(z.string()),
  lastName: z.string(),
  status: z.string(),
  dateOfBirth: z.coerce.date(),
  addresses: z.array(
    z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    }),
  ),
  customFields: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
});

export const IdSchema = z.object({
  id: z.string(),
});

export const PatientsResponse = z.object({
  patients: z.array(
    z.object({
      id: z.string().uuid(),
      firstName: z.string(),
      middleName: z.optional(z.string()),
      lastName: z.string(),
      status: z.string(),
      dateOfBirth: z.date(),
      addresses: z.array(
        z.object({
          id: z.string().uuid(),
          street: z.string(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
        }),
      ),
      patientCustomFields: z.array(
        z.object({
          id: z.string(),
          value: z.string().nullable(),
          customFieldId: z.string(),
        }),
      ),
    }),
  ),
  customFields: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      defaultValue: z.string().nullable(),
    }),
  ),
});

export const UpdatePatientBody = z
  .object({
    id: z.string(),
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
    customFields: z
      .array(
        z.object({
          id: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
  })
  .partial();
