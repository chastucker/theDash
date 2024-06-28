import { z } from 'zod';
import { Route } from '../Route';
import { prisma } from '../prisma';
import { IdSchema } from '../patient/schemas';
import { getUserId } from '../utils';

const editCustomFieldBody = z.object({
  id: z.string(),
  name: z.string().optional(),
  defaultValue: z.string().optional(),
});

export const editCustomField: Route = {
  method: 'PUT',
  url: '/custom-field',
  schema: {
    description: 'Edit a custom field',
    tags: ['custom-field'],
    body: editCustomFieldBody,
    response: {
      200: IdSchema,
      401: z.string(),
    },
  },
  handler: async (req, res) => {
    const { id, name, defaultValue } = req.body as z.infer<
      typeof editCustomFieldBody
    >;

    const userId = await getUserId(req.headers.authorization);
    if (!userId) {
      res.status(401).send('Unauthorized');
      return;
    }

    const customField = await prisma.customField.update({
      where: {
        id,
        userId,
      },
      data: {
        name,
        defaultValue,
      },
      select: {
        id: true,
      },
    });

    return customField;
  },
};
