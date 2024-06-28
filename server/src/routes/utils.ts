import { supabaseAnon } from '../supabaseAdmin';

export async function getUserId(authToken: string | undefined) {
  if (!authToken) {
    return null;
  }

  const { data, error } = await supabaseAnon.auth.getUser(authToken.slice(7));

  if (data.user) {
    return data.user.id;
  }

  return null;
}
