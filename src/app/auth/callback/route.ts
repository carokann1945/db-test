import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // next 파라미터는 상대경로만 허용 (오픈 리다이렉트 방지)
  let next = searchParams.get('next') ?? '/';
  if (!next.startsWith('/')) next = '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // (안전장치) supabase-js@2.91.0 계열 이슈 회피용.
    // 2.91.1에서 SSR OAuth 복구됨. :contentReference[oaicite:17]{index=17}
    await new Promise((r) => setTimeout(r, 0));

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host'); // 로드밸런서 이전 호스트 :contentReference[oaicite:18]{index=18}
      const isLocalEnv = process.env.NODE_ENV === 'development';

      // 로컬 개발 환경
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 실패 시 에러 페이지로
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
