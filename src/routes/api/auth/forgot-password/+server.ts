
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, request }) => {
  const { email } = await request.json();

  const { error } = await locals.supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${request.headers.get('origin')}/reset-password`
  });

  if (error) {
    return json({ error: error.message }, { status: 400 });
  }

  return json({ message: 'Password reset email sent' });
}