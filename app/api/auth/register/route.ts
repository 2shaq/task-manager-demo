export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { jsonResponse, errorResponse } from '@/lib/api-helpers';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body ?? {};

    if (!email || !password || !name) {
      return errorResponse('Email, password, and name are required', 400);
    }

    if (typeof password !== 'string' || password.length < 6) {
      return errorResponse('Password must be at least 6 characters', 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return errorResponse('A user with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });

    const token = signToken({ userId: user.id, email: user.email });

    return jsonResponse({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    }, 201);
  } catch (err: any) {
    console.error('Register error:', err);
    return errorResponse('Internal server error', 500);
  }
}
