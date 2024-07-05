import { createClient } from '@supabase/supabase-js';
import { getSupabaseAnonKey, getSupabaseUrl } from '../../supabaseAdmin';
import { z } from 'zod';
import { Route } from '../Route';

const body = z.object({
  refreshToken: z.string(),
});

export const refresh: Route = {
  method: 'POST',
  url: '/refresh',
  schema: {
    description: 'Refresh the access token with the refresh token',
    tags: ['auth'],
    body: z.object({
      refreshToken: z.string(),
    }),
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
  handler: async (req, res) => {
    const { refreshToken } = req.body as { refreshToken: string };
    const supabaseClient = createClient(getSupabaseUrl(), getSupabaseAnonKey());

    const client = await supabaseClient.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (
      !client.data.session?.access_token ||
      !client.data.session?.refresh_token ||
      client.error
    ) {
      res.code(400);
      return {
        error_message: client.error?.message ?? 'Error in signing up',
        message: 'Error in signing up',
      };
    }

    return {
      access_token: client.data.session?.access_token,
      refresh_token: client.data.session?.refresh_token,
    };
  },
};
