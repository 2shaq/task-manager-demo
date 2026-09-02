export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { jsonResponse, errorResponse } from '@/lib/api-helpers';
import bcrypt from 'bcryptjs';

// Intentionally no rate limiting — for Replay QA demo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body ?? {};

    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return errorResponse('Invalid email or password', 401);
    }

    const token = signToken({ userId: user.id, email: user.email });

    return jsonResponse({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return errorResponse('Internal server error', 500);
  }
}
