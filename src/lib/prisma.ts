import 'server-only';

import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString,

      // ✅ 서버리스(Vercel 등)에서 연결 폭발 방지용으로 보수적으로 시작
      // Prisma v7 pg 어댑터의 풀 옵션은 max가 기본 10입니다. :contentReference[oaicite:20]{index=20}
      max: 1,

      // (선택) 타임아웃/유휴 설정 - 필요 시 조절
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 300_000,

      // (문제 발생 시) SSL 인증서 검증 이슈가 나오면 아래를 켜서 해결되는 경우가 있습니다.
      // 다만 보안적으로는 CA를 설정하는 게 더 안전합니다.
      // ssl: { rejectUnauthorized: false },
    }),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
