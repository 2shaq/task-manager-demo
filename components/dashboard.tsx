'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { TaskCard } from '@/components/task-card';
import { AddTaskForm } from '@/components/add-task-form';
import { LayoutDashboard, ListTodo, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  status: string;
  assignee?: string | null;
  createdAt: string;
}

export function Dashboard() {
  const { user, token, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      const data = await res.json();
      setTasks(data?.tasks ?? []);
    } catch (err: any) {
      console.error('Fetch tasks error:', err);
      toast.error('Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  }, [token, logout]);

  useEffect(() => {
    if (token) fetchTasks();
  }, [token, fetchTasks]);

  const handleAddTask = async (taskData: { title: string; description: string; priority: string; assignee: string }) => {
    if (!token) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d?.error ?? 'Failed to create task');
      }
      toast.success('Task created');
      fetchTasks();
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to create task');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setTasks((prev) =>
        (prev ?? []).map((t: Task) => (t?.id === id ? { ...(t ?? {}), status: newStatus } : t))
      );
      toast.success('Status updated');
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      setTasks((prev) => (prev ?? []).filter((t: Task) => t?.id !== id));
      toast.success('Task deleted');
    } catch (err: any) {
      toast.error('Failed to delete task');
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const filtered = filter === 'all' ? tasks : (tasks ?? []).filter((t: Task) => t?.status === filter);
  const todoCount = (tasks ?? []).filter((t: Task) => t?.status === 'todo').length;
  const inProgressCount = (tasks ?? []).filter((t: Task) => t?.status === 'in_progress').length;
  const doneCount = (tasks ?? []).filter((t: Task) => t?.status === 'done').length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        {/* Hero */}
        <div className="mb-8 hero-gradient rounded-xl p-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="h-7 w-7 text-primary" />
            <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Manage your team's tasks and track progress in one place.</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total', count: tasks?.length ?? 0, icon: LayoutDashboard, color: 'text-primary' },
            { label: 'To Do', count: todoCount, icon: ListTodo, color: 'text-yellow-400' },
            { label: 'In Progress', count: inProgressCount, icon: Clock, color: 'text-blue-400' },
            { label: 'Done', count: doneCount, icon: CheckCircle2, color: 'text-green-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border/50 bg-card p-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                {s.label}
              </div>
              <p className="mt-1 text-2xl font-bold font-mono">{s.count}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Tasks' },
            { key: 'todo', label: 'To Do' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'done', label: 'Done' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Add task */}
        <div className="mb-6">
          <AddTaskForm onAdd={handleAddTask} />
        </div>

        {/* Task list */}
        {loadingTasks ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (filtered?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">No tasks found. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {(filtered ?? []).map((task: Task) => (
              <TaskCard
                key={task?.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
