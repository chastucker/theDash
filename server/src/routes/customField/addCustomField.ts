import { z } from 'zod';
import { Route } from '../Route';
import { prisma } from '../prisma';
import { IdSchema } from '../patient/schemas';
import { getUserId } from '../utils';

const customFieldBody = z.object({
  name: z.string(),
  type: z.string(),
  defaultValue: z.string().optional().nullable(),
});

export const addCustomField: Route = {
  method: 'POST',
  url: '/custom-field',
  schema: {
    description: '',
    tags: ['custom-field'],
    body: customFieldBody,
    response: {
      200: IdSchema,
      401: z.string(),
    },
  },
  handler: async (req, res) => {
    const { name, type, defaultValue } = req.body as z.infer<
      typeof customFieldBody
    >;

    const userId = await getUserId(req.headers.authorization);
    if (!userId) {
      res.status(401).send('Unauthorized');
      return;
    }

    return await prisma.$transaction(async (prismaTransaction) => {
      const customField = await prismaTransaction.customField.create({
        data: {
          name,
          type,
          defaultValue: defaultValue ?? null,
          userId,
        },
        select: {
          id: true,
        },
      });

      const patients = await prismaTransaction.patient.findMany({
        where: {
          userId,
        },
      });

      for (const patient of patients) {
        await prismaTransaction.patientCustomField.create({
          data: {
            customFieldId: customField.id,
            patientId: patient.id,
            value: defaultValue,
          },
        });
      }

      return customField;
    });
  },
};
