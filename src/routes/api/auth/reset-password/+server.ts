
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, request }) => {

  const { password, token } = await request.json();

  const { data, error } = await locals.supabase.auth.updateUser({
    password
  });

  if (error) {
    return json({ success: false, error: error.message }, { status: 400 });
  }

  return json({ success: true, message: 'Password has been reset successfully.' });
};