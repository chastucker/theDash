import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

export const supabaseAdmin = createClient(
  getSupabaseUrl(),
  getSupabaseApiKey(),
);

function getSupabaseApiKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_SECRET) {
    return process.env.SUPABASE_SERVICE_ROLE_SECRET;
  }
  throw new Error('SUPABASE_SERVICE_ROLE_SECRET not defined');
}
export function getSupabaseAnonKey() {
  if (process.env.SUPABASE_ANON_KEY) {
    return process.env.SUPABASE_ANON_KEY;
  }
  throw new Error('SUPABASE_ANON_KEY not defined');
}

export function getSupabaseUrl() {
  if (process.env.SUPABASE_URL) {
    return process.env.SUPABASE_URL;
  }
  throw new Error('SUPABASE_URL not defined');
}
