import { z } from 'zod';
import { Route } from '../Route';
import { prisma } from '../prisma';
import { IdSchema } from '../patient/schemas';
import { getUserId } from '../utils';

export const removeCustomField: Route = {
  method: 'POST',
  url: '/custom-field/delete',
  schema: {
    description: 'Delete a custom field',
    tags: ['custom-field'],
    body: IdSchema,
    response: {
      200: z.void(),
      401: z.string(),
    },
  },
  handler: async (req, res) => {
    const { id } = req.body as z.infer<typeof IdSchema>;

    const userId = await getUserId(req.headers.authorization);
    if (!userId) {
      res.status(401).send('Unauthorized');
      return;
    }

    await prisma.customField.delete({
      where: {
        id,
        userId,
      },
    });
  },
};
