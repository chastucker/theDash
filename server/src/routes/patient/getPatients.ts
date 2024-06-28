import { z } from 'zod';
import { Route } from '../Route';
import { prisma } from '../prisma';
import { getUserId } from '../utils';

const getPatientsResponse = z.array(
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
        value: z.string(),
        customField: z.object({
          type: z.string(),
          name: z.string(),
        }),
      }),
    ),
  }),
);

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

    return await prisma.patient.findMany({
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
            customField: {
              select: {
                name: true,
                type: true,
              },
            },
            value: true,
          },
        },
      },
    });
  },
};
