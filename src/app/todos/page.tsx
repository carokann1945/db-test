import { prisma } from '@/lib/prisma';
import { getUserOrRedirect } from '@/lib/auth';
import { createTodo, deleteTodo, setTodoDone, updateTodoTitle } from './actions';
import { signOut } from '@/app/auth/actions';

export default async function TodosPage() {
  const { userId, claims } = await getUserOrRedirect('/todos');

  const todos = await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      isDone: true,
      createdAt: true,
    },
  });

  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>Todos</h1>
          <p style={{ margin: '6px 0 0', color: '#666' }}>
            로그인: {claims?.email ?? '(email 없음)'} / userId: {userId}
          </p>
        </div>

        <form action={signOut}>
          <button type="submit">로그아웃</button>
        </form>
      </header>

      <section style={{ marginTop: 18 }}>
        <form action={createTodo} style={{ display: 'flex', gap: 8 }}>
          <input name="title" placeholder="할 일 입력" required style={{ flex: 1, padding: 10 }} />
          <button type="submit">추가</button>
        </form>
      </section>

      <section style={{ marginTop: 22 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {todos.map((t) => (
            <li
              key={t.id}
              style={{
                padding: '12px 0',
                borderBottom: '1px solid #eee',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: 12,
                alignItems: 'center',
              }}>
              {/* 완료 토글 */}
              <form action={setTodoDone}>
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="isDone" value={String(!t.isDone)} />
                <button type="submit" aria-label="toggle">
                  {t.isDone ? '✅' : '⬜️'}
                </button>
              </form>

              {/* 제목 수정 */}
              <form action={updateTodoTitle} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="hidden" name="id" value={t.id} />
                <input
                  name="title"
                  defaultValue={t.title}
                  style={{
                    width: '100%',
                    padding: 8,
                    textDecoration: t.isDone ? 'line-through' : 'none',
                    color: t.isDone ? '#999' : '#111',
                  }}
                />
                <button type="submit">수정</button>
              </form>

              {/* 삭제 */}
              <form action={deleteTodo}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" style={{ color: 'crimson' }}>
                  삭제
                </button>
              </form>
            </li>
          ))}
        </ul>

        {todos.length === 0 && <p style={{ marginTop: 16, color: '#666' }}>아직 할 일이 없습니다.</p>}
      </section>
    </main>
  );
}
