import 'server-only';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getUserOrRedirect(nextPath: string = '/todos') {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const userId = claims?.sub; // ✅ Supabase JWT의 user id
  if (error || !userId) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return { userId, claims };
}
