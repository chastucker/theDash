import { z } from 'zod';
import { Route } from '../Route';
import { prisma } from '../prisma';
import { getUserId } from '../utils';

const updatePatientBody = z
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

export const updatePatient: Route = {
  method: 'PUT',
  url: '/update-patient',
  schema: {
    description: '',
    tags: ['patient'],
    body: updatePatientBody,
    response: {
      200: z.object({
        id: z.string(),
      }),
    },
  },
  handler: async (req, res) => {
    const userId = await getUserId(req.headers.authorization);

    if (!userId) {
      res.status(401).send('Unauthorized');
      return;
    }

    const {
      id,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      status,
      addresses,
      customFields,
    } = req.body as z.infer<typeof updatePatientBody>;

    if (!id) {
      res.code(400);
      return {
        error_message: 'id is required',
        message: 'id is required',
      };
    }

    return await prisma.$transaction(async (prismaTransaction) => {
      if (addresses) {
        await prismaTransaction.address.deleteMany({
          where: {
            patientId: id,
          },
        });
      }

      if (customFields && customFields.length > 0) {
        await prismaTransaction.patientCustomField.deleteMany({
          where: {
            patientId: id,
          },
        });
      }

      const patient = await prismaTransaction.patient.update({
        where: {
          id,
        },
        data: {
          firstName,
          middleName: middleName ?? '',
          lastName,
          dateOfBirth,
          status,
          addresses: addresses
            ? {
                createMany: {
                  data: addresses,
                },
              }
            : undefined,
          patientCustomFields: customFields
            ? {
                createMany: {
                  data: customFields.map(({ id, value }) => ({
                    customFieldId: id,
                    value,
                  })),
                },
              }
            : undefined,
        },
        select: { id: true },
      });

      return { id: patient.id };
    });
  },
};
