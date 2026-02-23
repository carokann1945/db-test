import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2', // 폰트 파일 경로 설정
  variable: '--font-pretendard', // css 변수명을 정의하여 Tailwind CSS 등에서 사용할 수 있음
});

export const metadata: Metadata = {
  title: 'db-test',
  description: 'nestjs prisma supabase',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
