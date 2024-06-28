import { z } from 'zod';
import { Route } from '../Route';
import { prisma } from '../prisma';
import { IdSchema, Patient } from './schemas';
import { getUserId } from '../utils';

export const addPatient: Route = {
  method: 'POST',
  url: '/add-patient',
  schema: {
    description: 'Add a patient',
    tags: ['patient'],
    body: Patient,
    response: {
      200: IdSchema,
      401: z.string(),
    },
  },
  handler: async (req, res) => {
    const userId = await getUserId(req.headers.authorization);

    if (!userId) {
      res.status(401).send('Unauthorized');
      return;
    }

    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      status,
      addresses,
      customFields,
    } = req.body as z.infer<typeof Patient>;

    const { id } = await prisma.patient.create({
      data: {
        firstName,
        middleName: middleName ?? '',
        lastName,
        userId,
        dateOfBirth,
        status,
        addresses: {
          createMany: {
            data: addresses,
          },
        },
        patientCustomFields: customFields
          ? {
              createMany: {
                data: customFields?.map(({ id, value }) => ({
                  customFieldId: id,
                  value,
                })),
              },
            }
          : undefined,
      },
    });

    return { id };
  },
};
