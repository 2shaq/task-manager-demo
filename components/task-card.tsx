'use client';

import { AlertCircle, ArrowUp, ArrowRight, ArrowDown, Clock, CheckCircle2, Circle, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: string;
  status: string;
  assignee?: string | null;
  createdAt: string;
}

const priorityConfig: Record<string, { icon: React.ElementType; label: string; className: string }> = {
  high: { icon: ArrowUp, label: 'High', className: 'bg-red-500/15 text-red-400 border-red-500/20' },
  medium: { icon: ArrowRight, label: 'Medium', className: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  low: { icon: ArrowDown, label: 'Low', className: 'bg-green-500/15 text-green-400 border-green-500/20' },
};

const statusConfig: Record<string, { icon: React.ElementType; label: string; next: string }> = {
  todo: { icon: Circle, label: 'To Do', next: 'in_progress' },
  in_progress: { icon: Clock, label: 'In Progress', next: 'done' },
  done: { icon: CheckCircle2, label: 'Done', next: 'todo' },
};

export function TaskCard({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const prio = priorityConfig[task?.priority ?? 'medium'] ?? priorityConfig.medium;
  const stat = statusConfig[task?.status ?? 'todo'] ?? statusConfig.todo;
  const PrioIcon = prio.icon;
  const StatIcon = stat.icon;

  return (
    <div className="group rounded-lg border border-border/50 bg-card p-4 transition-all duration-normal hover:border-primary/30 hover:shadow-lg" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-card-foreground truncate">{task?.title ?? 'Untitled'}</h3>
          {task?.description ? (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          ) : null}
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          title="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${prio.className}`}>
          <PrioIcon className="h-3 w-3" />
          {prio.label}
        </span>

        <button
          onClick={() => onStatusChange(task.id, stat.next)}
          className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
          title={`Move to ${statusConfig[stat.next]?.label ?? 'next status'}`}
        >
          <StatIcon className="h-3 w-3" />
          {stat.label}
        </button>

        {task?.assignee ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {task.assignee}
          </span>
        ) : null}
      </div>
    </div>
  );
}
