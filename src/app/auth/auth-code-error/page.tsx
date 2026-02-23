export default function AuthCodeErrorPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>로그인에 실패했어요</h1>
      <p>다시 로그인해 주세요. (redirect URL/Google 설정을 확인하세요)</p>
      <a href="/login">로그인으로</a>
    </main>
  );
}
