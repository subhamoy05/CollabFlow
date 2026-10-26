import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  Clock,
  Calendar,
  AlertTriangle,
  FolderKanban
} from 'lucide-react';
import { taskService } from '../../services/taskService';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';

export function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const loadMyTasks = async () => {
    try {
      setLoading(true);
      const res = await taskService.getTasks({
        assignee: 'me',
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        search: search || undefined,
        limit: 100
      });
      setTasks(res?.data || []);
    } catch (err) {
      console.error('Failed to load my tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyTasks();
  }, [statusFilter, priorityFilter, search]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-indigo-600" /> My Tasks
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Work items assigned to you across all authorized project workspaces.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your assigned tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="Backlog">Backlog</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks assigned"
          description="You don't have any matching assigned tasks at the moment."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-subtle divide-y divide-slate-100 dark:divide-slate-800">
          {tasks.map((task) => {
            const isOverdue =
              task.dueDate && new Date() > new Date(task.dueDate) && task.status !== 'Done';
            return (
              <div
                key={task._id}
                onClick={() => setSelectedTaskId(task._id)}
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 flex-shrink-0">
                    {task.key}
                  </span>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{task.project?.title || 'Project'}</span>
                      {task.dueDate && (
                        <>
                          <span>•</span>
                          <span className={`flex items-center gap-1 ${isOverdue ? 'text-rose-500 font-bold' : ''}`}>
                            <Clock className="w-3 h-3" />
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  {isOverdue && <Badge variant="overdue" size="xs">Overdue</Badge>}
                  <Badge size="xs">{task.status}</Badge>
                  <Badge size="xs">{task.priority}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onTaskUpdated={() => loadMyTasks()}
        onTaskDeleted={() => {
          setSelectedTaskId(null);
          loadMyTasks();
        }}
      />
    </div>
  );
}
