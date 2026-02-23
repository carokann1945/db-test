import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // 1) downstream(서버 컴포넌트)에서 최신 쿠키를 보게 request에도 반영
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // 2) 응답도 새로 만들고
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          // 3) 브라우저로 내려갈 Set-Cookie도 세팅
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // ✅ getClaims(): JWT 서명을 매번 검증 (Proxy에서 getSession 신뢰 금지) :contentReference[oaicite:12]{index=12}
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const pathname = request.nextUrl.pathname;

  // 미들웨어 경로 보호 코드
  const isProtected = pathname.startsWith('/todos');
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/auth');

  if (!claims && isProtected && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  // 미들웨어 경로 보호 코드 끝

  return supabaseResponse;
}
