import { z } from 'zod';
import { Route } from '../Route';
import { prisma } from '../prisma';
import { IdSchema, AddPatientBody } from './schemas';
import { getUserId } from '../utils';

export const addPatient: Route = {
  method: 'POST',
  url: '/add-patient',
  schema: {
    description: 'Add a patient for the current user',
    tags: ['patient'],
    body: AddPatientBody,
    response: {
      200: IdSchema,
      401: z.string(),
      400: z.string(),
    },
  },
  handler: async (req, res) => {
    const userId = await getUserId(req.headers.authorization);

    if (!userId) {
      res.status(401).send('Unauthorized');
      return;
    }

    const { firstName, middleName, lastName, dateOfBirth, status, addresses } =
      req.body as z.infer<typeof AddPatientBody>;

    let { customFields } = req.body as z.infer<typeof AddPatientBody>;

    let usersCustomFields = await prisma.customField.findMany({
      where: {
        userId,
      },
    });

    customFields = customFields ?? [];

    for (const field of customFields ?? []) {
      if (!usersCustomFields.find((f) => f.id === field.id)) {
        res.status(400).send('Invalid custom field');
        return;
      } else {
        usersCustomFields = usersCustomFields.filter((f) => f.id !== field.id);
      }
    }

    for (const field of usersCustomFields) {
      customFields?.push({
        id: field.id,
        value: field.defaultValue ?? '',
      });
    }

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
