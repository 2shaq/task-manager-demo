import { NextResponse } from 'next/server';

export function jsonResponse(data: unknown, status = 200) {
  // Intentionally missing security headers for Replay QA demo:
  // No Content-Security-Policy
  // No X-Frame-Options
  // No Strict-Transport-Security
  return NextResponse.json(data, {
    status,
    headers: {
      'X-Powered-By': 'Team Task Hub',
    },
  });
}

export function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}
