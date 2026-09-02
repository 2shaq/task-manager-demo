export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { jsonResponse, errorResponse } from '@/lib/api-helpers';

export async function GET(request: Request) {
  const payload = getUserFromRequest(request);
  if (!payload) {
    return errorResponse('Unauthorized', 401);
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
    });

    return jsonResponse({ tasks });
  } catch (err: any) {
    console.error('List tasks error:', err);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: Request) {
  const payload = getUserFromRequest(request);
  if (!payload) {
    return errorResponse('Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const { title, description, priority, status, assignee } = body ?? {};

    if (!title) {
      return errorResponse('Title is required', 400);
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? '',
        priority: priority ?? 'medium',
        status: status ?? 'todo',
        assignee: assignee ?? '',
        userId: payload.userId,
      },
    });

    return jsonResponse({ task }, 201);
  } catch (err: any) {
    console.error('Create task error:', err);
    return errorResponse('Internal server error', 500);
  }
}
