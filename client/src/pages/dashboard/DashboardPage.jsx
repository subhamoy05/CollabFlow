import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  Calendar,
  ArrowRight,
  Plus,
  Activity,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { reportService } from '../../services/reportService';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';

const STATUS_COLORS = {
  Backlog: '#94A3B8',
  Todo: '#64748B',
  'In Progress': '#6366F1',
  'In Review': '#A855F7',
  Done: '#10B981'
};

export function DashboardPage() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [repRes, taskRes, projRes] = await Promise.all([
          reportService.getOverview().catch(() => ({ data: null })),
          taskService.getTasks({ assignee: 'me', limit: 8, sort: 'dueDate' }).catch(() => ({ data: [] })),
          projectService.getProjects({ limit: 4, sort: '-updatedAt' }).catch(() => ({ data: [] }))
        ]);

        if (repRes?.data) setReport(repRes.data);
        if (taskRes?.data) setMyTasks(taskRes.data);
        if (projRes?.data) setProjects(projRes.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const metrics = report?.metrics || {
    totalProjects: projects.length,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    completionRate: 0
  };

  const statusData = report?.byStatus || [];
  const assignedCount = myTasks.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-elevated">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Here's what is happening across your active projects and deliverables today.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={() => navigate('/app/tasks')}
          >
            My Tasks
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/app/projects')}
          >
            All Projects <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned Tasks */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Assigned to Me
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {assignedCount}
            </div>
          </div>
        </Card>

        {/* Card 2: Completed Tasks */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Completed Tasks
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {metrics.completedTasks}
            </div>
          </div>
        </Card>

        {/* Card 3: In Progress */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              In Progress
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {metrics.inProgressTasks}
            </div>
          </div>
        </Card>

        {/* Card 4: Overdue Tasks */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Overdue Tasks
            </div>
            <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
              {metrics.overdueTasks}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid: Charts & Project Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Task Distribution Chart & My Upcoming Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Task Completion & Status Overview
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live distribution across project pipelines (Completion Rate: {metrics.completionRate}%)
                </p>
              </div>
              <Badge variant={metrics.completionRate > 50 ? 'success' : 'brand'}>
                {metrics.completionRate}% Done
              </Badge>
            </div>

            {statusData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="status" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#F8FAFC'
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#6366F1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="No tasks recorded yet"
                description="Create projects and tasks to see live completion velocity charts."
              />
            )}
          </Card>

          {/* Assigned Tasks Table */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-600" /> My Assigned Tasks
              </h3>
              <Button size="xs" variant="ghost" onClick={() => navigate('/app/tasks')}>
                View all
              </Button>
            </div>

            {myTasks.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="All caught up!"
                description="You currently have no outstanding tasks assigned to you."
              />
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {myTasks.map((t) => {
                  const isOverdue = t.dueDate && new Date() > new Date(t.dueDate) && t.status !== 'Done';
                  return (
                    <div
                      key={t._id}
                      onClick={() =>
                        navigate(`/app/projects/${t.project?._id || t.project}/board?task=${t._id}`)
                      }
                      className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                          {t.key}
                        </span>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {t.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isOverdue && <Badge variant="overdue" size="xs">Overdue</Badge>}
                        <Badge size="xs">{t.status}</Badge>
                        <Badge size="xs">{t.priority}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Recent Projects & Upcoming Deadlines */}
        <div className="space-y-6">
          {/* Projects Card */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-indigo-600" /> Active Projects
              </h3>
              <Button size="xs" variant="ghost" onClick={() => navigate('/app/projects')}>
                See all
              </Button>
            </div>

            {projects.length === 0 ? (
              <EmptyState
                icon={FolderKanban}
                title="No projects found"
                description="Start by creating a collaborative project workspace."
                actionLabel="Create Project"
                onAction={() => navigate('/app/projects')}
              />
            ) : (
              <div className="space-y-3">
                {projects.map((proj) => {
                  const progress = proj.taskStats?.progress || 0;
                  return (
                    <div
                      key={proj._id}
                      onClick={() => navigate(`/app/projects/${proj._id}/board`)}
                      className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xs cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0"
                            style={{ backgroundColor: proj.color || '#6366F1' }}
                          >
                            {proj.key}
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {proj.title}
                          </span>
                        </div>
                        <Badge size="xs">{proj.status}</Badge>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
                        <span>{proj.taskStats?.totalTasks || 0} tasks</span>
                        <span>{progress}% complete</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Quick Calendar Access */}
          <Card className="bg-gradient-to-br from-indigo-50/50 to-slate-50 dark:from-slate-900 dark:to-slate-900 border-indigo-100 dark:border-indigo-950">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Deadline Calendar
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Track delivery milestones and due dates in month and week timeline views.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-center"
              onClick={() => navigate('/app/calendar')}
            >
              Open Calendar
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
