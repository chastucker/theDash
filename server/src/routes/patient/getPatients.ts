import { z } from 'zod';
import { Route } from '../Route';
import { prisma } from '../prisma';
import { getUserId } from '../utils';
import { PatientsResponse } from './schemas';

export const getPatients: Route = {
  method: 'GET',
  url: '/get-patients',
  schema: {
    description: 'Gets all the patients for the current user.',
    tags: ['patient'],
    response: {
      200: PatientsResponse,
      401: z.string(),
    },
  },
  handler: async (req, res) => {
    const userId = await getUserId(req.headers.authorization);

    if (!userId) {
      res.status(401).send('Unauthorized');
      return;
    }

    const patients = await prisma.patient.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        userId: true,
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
            customFieldId: true,
          },
          orderBy: {
            customField: {
              name: 'asc',
            },
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
        defaultValue: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return { patients, customFields };
  },
};
