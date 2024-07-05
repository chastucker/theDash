import { z } from 'zod';
import { Route } from '../Route';
import { prisma } from '../prisma';
import { getUserId } from '../utils';

export const removePatient: Route = {
  method: 'POST',
  url: '/remove-patient',
  schema: {
    description: 'Remove patients from the current user.',
    tags: ['patient'],
    body: z.object({
      ids: z.array(z.string()),
    }),
    response: {
      200: z.void(),
      401: z.string(),
    },
  },
  handler: async (req, res) => {
    const userId = await getUserId(req.headers.authorization);

    if (!userId) {
      res.status(401).send('Unauthorized');
      return;
    }

    const { ids } = req.body as { ids: string[] };

    await prisma.patient.deleteMany({
      where: {
        id: {
          in: ids,
        },
        userId,
      },
    });
  },
};
