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
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return jsonResponse({ user });
  } catch (err: any) {
    console.error('Me error:', err);
    return errorResponse('Internal server error', 500);
  }
}
