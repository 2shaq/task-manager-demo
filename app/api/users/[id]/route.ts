export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { jsonResponse, errorResponse } from '@/lib/api-helpers';

// INTENTIONAL IDOR: Returns ANY user's profile data as long as
// the requester is authenticated — no ownership check.

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
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        tasks: {
          select: { id: true, title: true, status: true, priority: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return jsonResponse({ user });
  } catch (err: any) {
    console.error('Get user error:', err);
    return errorResponse('Internal server error', 500);
  }
}
