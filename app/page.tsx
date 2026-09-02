'use client';

import { AuthProvider } from '@/lib/auth-context';
import { Dashboard } from '@/components/dashboard';

export default function HomePage() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}
