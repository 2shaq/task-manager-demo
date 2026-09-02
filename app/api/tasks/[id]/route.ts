export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { jsonResponse, errorResponse } from '@/lib/api-helpers';

// INTENTIONAL IDOR: These endpoints check that the user is authenticated
// but do NOT verify the task belongs to the requesting user.
// Any authenticated user can read/update/delete ANY task by ID.

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = getUserFromRequest(request);
  if (!payload) {
    return errorResponse('Unauthorized', 401);
  }

  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!task) {
      return errorResponse('Task not found', 404);
    }

    // NOTE: No ownership check — IDOR vulnerability for demo
    return jsonResponse({ task });
  } catch (err: any) {
    console.error('Get task error:', err);
    return errorResponse('Internal server error', 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = getUserFromRequest(request);
  if (!payload) {
    return errorResponse('Unauthorized', 401);
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, priority, status, assignee } = body ?? {};

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Task not found', 404);
    }

    // NOTE: No ownership check — IDOR vulnerability for demo
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(priority !== undefined && { priority }),
        ...(status !== undefined && { status }),
        ...(assignee !== undefined && { assignee }),
      },
    });

    return jsonResponse({ task });
  } catch (err: any) {
    console.error('Update task error:', err);
    return errorResponse('Internal server error', 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = getUserFromRequest(request);
  if (!payload) {
    return errorResponse('Unauthorized', 401);
  }

  try {
    const { id } = await params;
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Task not found', 404);
    }

    // NOTE: No ownership check — IDOR vulnerability for demo
    await prisma.task.delete({ where: { id } });

    return jsonResponse({ message: 'Task deleted' });
  } catch (err: any) {
    console.error('Delete task error:', err);
    return errorResponse('Internal server error', 500);
  }
}
