import { signOut } from '@/app/auth/actions';

export default function Home() {
  return (
    <div>
      <form action={signOut}>
        <button type="submit">로그아웃</button>
      </form>
    </div>
  );
}
