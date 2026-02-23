'use client';

import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/todos';

  const signInWithGoogle = async () => {
    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }, // 이 URL이 Supabase Redirect allow list에 있어야 함 :contentReference[oaicite:15]{index=15}
    });

    if (error) {
      console.error(error);
      alert('구글 로그인 시작 실패. 콘솔을 확인하세요.');
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <button onClick={signInWithGoogle}>Google로 로그인</button>
    </main>
  );
}
