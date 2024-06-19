import { z } from 'zod';
import { Route } from '../Route';

export const addCustomField: Route = {
  method: 'POST',
  url: '/custom-field',
  schema: {
    description: '',
    tags: [''],
    body: z.object({}),
    response: {
      200: z.object({
        access_token: z.string().optional(),
        refresh_token: z.string().optional(),
      }),
      400: z.object({
        error_message: z.string(),
        message: z.string(),
      }),
    },
  },
  handler: async (req, res) => {},
};
