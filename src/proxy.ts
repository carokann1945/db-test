import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

// 들어오는 요청을 받아서 updateSession에 전달
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /* 정적 파일은  세션 확인 제외 */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
