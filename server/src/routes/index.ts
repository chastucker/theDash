import { z } from 'zod';
import { signIn, signUp } from './auth';
import { Route } from './Route';

const s: Route = {
  method: 'GET',
  url: '/test-me',
  schema: {
    description: 'A test route for me',
    tags: ['my-tag'],

    response: {
      200: z.object({ thisWorks: z.string() }),
    },
  },
  handler: async () => {
    return { thisWorks: 'yes' };
  },
};

export const routes = [signIn, signUp, s];
