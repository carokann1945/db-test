'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getUserOrRedirect } from '@/lib/auth';

const TodoIdSchema = z.coerce.number().int().positive();
const TitleSchema = z.string().trim().min(1, '제목을 입력하세요').max(200, '최대 200자');

const BoolStringSchema = z.enum(['true', 'false']).transform((v) => v === 'true');

export async function createTodo(formData: FormData) {
  const { userId } = await getUserOrRedirect('/todos');

  const parsed = TitleSchema.safeParse(formData.get('title'));
  if (!parsed.success) return;

  await prisma.todo.create({
    data: {
      userId,
      title: parsed.data,
    },
  });

  revalidatePath('/todos');
}

// ✅ 완료/미완료 설정 (토글도 이 액션으로 처리 가능)
export async function setTodoDone(formData: FormData) {
  const { userId } = await getUserOrRedirect('/todos');

  const parsed = z
    .object({
      id: TodoIdSchema,
      isDone: BoolStringSchema,
    })
    .safeParse({
      id: formData.get('id'),
      isDone: formData.get('isDone'),
    });

  if (!parsed.success) return;

  // ✅ updateMany로 userId 조건을 쿼리 자체에 박아둠 (가장 안전한 패턴)
  await prisma.todo.updateMany({
    where: { id: parsed.data.id, userId },
    data: { isDone: parsed.data.isDone },
  });

  revalidatePath('/todos');
}

export async function updateTodoTitle(formData: FormData) {
  const { userId } = await getUserOrRedirect('/todos');

  const parsed = z
    .object({
      id: TodoIdSchema,
      title: TitleSchema,
    })
    .safeParse({
      id: formData.get('id'),
      title: formData.get('title'),
    });

  if (!parsed.success) return;

  await prisma.todo.updateMany({
    where: { id: parsed.data.id, userId },
    data: { title: parsed.data.title },
  });

  revalidatePath('/todos');
}

export async function deleteTodo(formData: FormData) {
  const { userId } = await getUserOrRedirect('/todos');

  const parsed = z.object({ id: TodoIdSchema }).safeParse({ id: formData.get('id') });

  if (!parsed.success) return;

  await prisma.todo.deleteMany({
    where: { id: parsed.data.id, userId },
  });

  revalidatePath('/todos');
}
