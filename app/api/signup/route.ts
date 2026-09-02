export const dynamic = 'force-dynamic';

// Alias for /api/auth/register — re-exports the same handler
import { POST } from '@/app/api/auth/register/route';
export { POST };
