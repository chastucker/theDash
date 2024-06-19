import { z } from 'zod';
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  supabaseAdmin,
} from '../../supabaseAdmin';
import { createClient } from '@supabase/supabase-js';
import { Route } from '../Route';

export const signUp: Route = {
  method: 'POST',
  url: '/sign-up',
  schema: {
    description: 'Sign up for toast',
    tags: ['auth'],
    body: z.object({
      email: z.string().email(),
      password: z.string(),
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
    const { email, password } = req.body as { email: string; password: string };

    const { error } = await supabaseAdmin.auth.signUp({
      email,
      password,
    });

    if (error) {
      res.code(400);
      return {
        error_message: error.message,
        message: 'Error in signing up',
      };
    }

    const supabaseClient = createClient(getSupabaseUrl(), getSupabaseAnonKey());
    const client = await supabaseClient.auth.signInWithPassword({
      email,
      password,
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
