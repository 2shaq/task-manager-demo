'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/navbar';
import { ArrowLeft, CheckSquare, Clock, Circle, CheckCircle2, ArrowUp, ArrowRight, ArrowDown, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { SafeDate } from '@/components/safe-format';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  status: string;
  assignee?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; email: string } | null;
}

const statusLabels: Record<string, string> = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };
const priorityLabels: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High' };

function TaskDetail({ taskId }: { taskId: string }) {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!token || !taskId) return;
    const fetchTask = async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const d = await res.json();
          setError(d?.error ?? 'Task not found');
          return;
        }
        const data = await res.json();
        setTask(data?.task ?? null);
      } catch {
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [token, taskId]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  if (error || !task) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-[1200px] px-4 py-16 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground">{error || 'Task not found'}</p>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  const PrioIcon = task?.priority === 'high' ? ArrowUp : task?.priority === 'low' ? ArrowDown : ArrowRight;
  const StatIcon = task?.status === 'done' ? CheckCircle2 : task?.status === 'in_progress' ? Clock : Circle;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="rounded-xl border border-border/50 bg-card p-6 md:p-8" style={{ boxShadow: 'var(--shadow-md)' }}>
          <div className="flex items-start gap-3">
            <CheckSquare className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">{task?.title ?? 'Untitled'}</h1>
              {task?.description ? (
                <p className="mt-2 text-muted-foreground">{task.description}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
              <div className="mt-1 flex items-center gap-1.5">
                <StatIcon className="h-4 w-4" />
                <span className="font-medium">{statusLabels[task?.status ?? ''] ?? task?.status}</span>
              </div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Priority</p>
              <div className="mt-1 flex items-center gap-1.5">
                <PrioIcon className="h-4 w-4" />
                <span className="font-medium">{priorityLabels[task?.priority ?? ''] ?? task?.priority}</span>
              </div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Assignee</p>
              <p className="mt-1 font-medium">{task?.assignee || 'Unassigned'}</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Created By</p>
              <p className="mt-1 font-medium">{task?.user?.name ?? 'Unknown'}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Created</p>
              <p className="mt-1 font-mono text-sm">
                <SafeDate date={task?.createdAt} options={{ dateStyle: 'medium', timeStyle: 'short' }} />
              </p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Updated</p>
              <p className="mt-1 font-mono text-sm">
                <SafeDate date={task?.updatedAt} options={{ dateStyle: 'medium', timeStyle: 'short' }} />
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <AuthProvider>
      <TaskDetail taskId={resolvedParams?.id ?? ''} />
    </AuthProvider>
  );
}
