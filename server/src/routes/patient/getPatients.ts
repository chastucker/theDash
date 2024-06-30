import { z } from 'zod';
import { Route } from '../Route';
import { prisma } from '../prisma';
import { getUserId } from '../utils';

const getPatientsResponse = z.object({
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
        }),
      ),
    }),
  ),
  customFields: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
    }),
  ),
});

export const getPatients: Route = {
  method: 'GET',
  url: '/get-patients',
  schema: {
    description: '',
    tags: ['patient'],
    response: {
      200: getPatientsResponse,
    },
  },
  handler: async (req, res) => {
    const userId = await getUserId(req.headers.authorization);

    if (!userId) {
      res.status(401).send('Unauthorized');
      return;
    }

    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        dateOfBirth: true,
        status: true,
        addresses: true,
        patientCustomFields: {
          select: {
            id: true,
            value: true,
          },
        },
      },
    });

    const customFields = await prisma.customField.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    console.log('customFields', customFields);
    console.log('patients', patients);
    console.log('patients', patients[0].patientCustomFields);

    return { patients, customFields };
  },
};
