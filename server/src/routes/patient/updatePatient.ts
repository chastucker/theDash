import { z } from 'zod';
import { Route } from '../Route';
import { prisma } from '../prisma';
import { getUserId } from '../utils';
import { UpdatePatientBody } from './schemas';

export const updatePatient: Route = {
  method: 'PUT',
  url: '/update-patient',
  schema: {
    description: '',
    tags: ['patient'],
    body: UpdatePatientBody,
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
    } = req.body as z.infer<typeof UpdatePatientBody>;

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
