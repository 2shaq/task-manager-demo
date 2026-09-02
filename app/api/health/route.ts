export const dynamic = 'force-dynamic';

import { jsonResponse } from '@/lib/api-helpers';

export async function GET() {
  return jsonResponse({
    status: 'ok',
    service: 'team-task-hub',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}
