import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckSquare,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  ChevronRight,
  FolderKanban,
  AlertTriangle
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { Spinner } from '../../components/common/Spinner';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';

const COLUMNS = [
  { id: 'Backlog', label: 'Backlog', color: '#94A3B8' },
  { id: 'Todo', label: 'Todo', color: '#64748B' },
  { id: 'In Progress', label: 'In Progress', color: '#6366F1' },
  { id: 'In Review', label: 'In Review', color: '#A855F7' },
  { id: 'Done', label: 'Done', color: '#10B981' }
];

export function ProjectBoardPage() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const { socket, joinProject, leaveProject, isConnected, projectPresence } = useSocket();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [quickCreateColumn, setQuickCreateColumn] = useState(null);
  const [quickTitle, setQuickTitle] = useState('');
  const navigate = useNavigate();

  // Load project details and tasks
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [projRes, taskRes] = await Promise.all([
        projectService.getProject(projectId),
        taskService.getTasks({ projectId, limit: 200 })
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data || []);
    } catch (err) {
      console.error('Failed to load board data:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Join project socket room
  useEffect(() => {
    if (projectId) {
      joinProject(projectId);
    }
    return () => {
      if (projectId) leaveProject(projectId);
    };
  }, [projectId, joinProject, leaveProject]);

  // Socket event listeners for real-time board updates
  useEffect(() => {
    if (!socket) return;

    const handleTaskCreated = (newTask) => {
      setTasks((prev) => {
        if (prev.some((t) => t._id === newTask._id)) return prev;
        return [...prev, newTask];
      });
    };

    const handleTaskUpdated = (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? { ...t, ...updatedTask } : t))
      );
    };

    const handleTaskMoved = ({ taskId, status, order, task }) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? (task || { ...t, status, order }) : t))
      );
    };

    const handleTaskDeleted = ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    };

    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:moved', handleTaskMoved);
    socket.on('task:deleted', handleTaskDeleted);

    return () => {
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:moved', handleTaskMoved);
      socket.off('task:deleted', handleTaskDeleted);
    };
  }, [socket]);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (search) {
      const matchText = `${t.title} ${t.key} ${t.description || ''}`.toLowerCase();
      if (!matchText.includes(search.toLowerCase())) return false;
    }
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (assigneeFilter !== 'all') {
      if (assigneeFilter === 'me' && t.assignee?._id !== user?._id) return false;
      if (assigneeFilter === 'unassigned' && t.assignee) return false;
      if (assigneeFilter !== 'me' && assigneeFilter !== 'unassigned' && t.assignee?._id !== assigneeFilter) return false;
    }
    return true;
  });

  // Group tasks by column status
  const tasksByColumn = {};
  for (const col of COLUMNS) {
    tasksByColumn[col.id] = filteredTasks
      .filter((t) => t.status === col.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  // Drag and drop handler with optimistic UI updates
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    // Snapshot for rollback on failure
    const originalTasks = [...tasks];

    // Calculate new order
    const destColumnTasks = [...(tasksByColumn[destStatus] || [])];
    if (sourceStatus === destStatus) {
      destColumnTasks.splice(source.index, 1);
    }
    const movedTask = tasks.find((t) => t._id === draggableId);
    if (!movedTask) return;

    // Optimistic local update
    const updatedTask = { ...movedTask, status: destStatus, order: destination.index };
    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? updatedTask : t))
    );

    try {
      await taskService.moveTask(draggableId, {
        status: destStatus,
        order: destination.index
      });
    } catch (err) {
      console.error('Failed to move task:', err);
      // Rollback on failure
      setTasks(originalTasks);
    }
  };

  const handleQuickCreate = async (e, columnStatus) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    try {
      const res = await taskService.createTask({
        title: quickTitle.trim(),
        project: projectId,
        status: columnStatus,
        priority: 'Medium'
      });
      setQuickTitle('');
      setQuickCreateColumn(null);
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to create task');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full">
      {/* Project Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-5 h-5 rounded-md flex items-center justify-center text-white font-bold text-[10px]"
              style={{ backgroundColor: project?.color || '#6366F1' }}
            >
              {project?.key}
            </span>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              {project?.title}
            </h1>
            <Badge size="xs">{project?.status}</Badge>
            {isConnected && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {project?.description || 'Real-time Kanban collaboration board.'}
          </p>
        </div>

        {/* Project Action Links (Board, Chat, Sprints, Analytics, Settings) */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={MessageSquare}
            onClick={() => navigate(`/app/projects/${projectId}/chat`)}
          >
            Chat
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon={BarChart3}
            onClick={() => navigate(`/app/reports`)}
          >
            Reports
          </Button>
          <Button
            size="sm"
            icon={Plus}
            onClick={() => setQuickCreateColumn('Todo')}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter tasks by title or key..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Assignees</option>
            <option value="me">Assigned to Me</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      {/* Drag & Drop Kanban Columns Area */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1">
          {COLUMNS.map((column) => {
            const columnTasks = tasksByColumn[column.id] || [];
            return (
              <div
                key={column.id}
                className="w-72 flex-shrink-0 flex flex-col bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {column.label}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuickCreateColumn(column.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Add Form inside column */}
                {quickCreateColumn === column.id && (
                  <form
                    onSubmit={(e) => handleQuickCreate(e, column.id)}
                    className="mb-3 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-300 dark:border-indigo-700 shadow-sm space-y-2"
                  >
                    <input
                      type="text"
                      placeholder="Task title..."
                      value={quickTitle}
                      onChange={(e) => setQuickTitle(e.target.value)}
                      autoFocus
                      className="w-full text-xs bg-transparent border-0 focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    />
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => {
                          setQuickCreateColumn(null);
                          setQuickTitle('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" size="xs" disabled={!quickTitle.trim()}>
                        Add Card
                      </Button>
                    </div>
                  </form>
                )}

                {/* Droppable Task Cards Container */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-2.5 min-h-[300px] transition-colors rounded-xl p-1 ${
                        snapshot.isDraggingOver ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => {
                        const isOverdue =
                          task.dueDate && new Date() > new Date(task.dueDate) && task.status !== 'Done';
                        const completedChecklist =
                          task.checklist?.filter((i) => i.completed).length || 0;
                        const totalChecklist = task.checklist?.length || 0;

                        return (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                onClick={() => setSelectedTaskId(task._id)}
                                className={`p-3 rounded-xl bg-white dark:bg-slate-900 border text-xs shadow-xs cursor-pointer select-none transition-all ${
                                  dragSnapshot.isDragging
                                    ? 'shadow-xl ring-2 ring-indigo-500 scale-102 border-indigo-400'
                                    : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                }`}
                              >
                                {/* Key and Priority */}
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                  <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                    {task.key}
                                  </span>
                                  <Badge size="xs">{task.priority}</Badge>
                                </div>

                                {/* Task Title */}
                                <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 mb-2.5 leading-snug">
                                  {task.title}
                                </div>

                                {/* Meta details: Due date, checklist count, comments */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400">
                                  <div className="flex items-center gap-2">
                                    {task.dueDate && (
                                      <span
                                        className={`flex items-center gap-1 ${
                                          isOverdue
                                            ? 'text-rose-600 dark:text-rose-400 font-bold'
                                            : 'text-slate-400'
                                        }`}
                                      >
                                        <Clock className="w-3 h-3" />
                                        {new Date(task.dueDate).toLocaleDateString([], {
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    )}
                                    {totalChecklist > 0 && (
                                      <span className="flex items-center gap-1 text-slate-400">
                                        <CheckSquare className="w-3 h-3" />
                                        {completedChecklist}/{totalChecklist}
                                      </span>
                                    )}
                                  </div>

                                  {/* Assignee Avatar */}
                                  <Avatar user={task.assignee} size="xs" />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Task Detail Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onTaskUpdated={(updated) => {
          setTasks((prev) => prev.map((t) => (t._id === updated._id ? { ...t, ...updated } : t)));
        }}
        onTaskDeleted={(deletedId) => {
          setTasks((prev) => prev.filter((t) => t._id !== deletedId));
        }}
      />
    </div>
  );
}
