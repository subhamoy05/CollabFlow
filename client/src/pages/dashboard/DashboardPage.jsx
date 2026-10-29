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
  Backlog: '#6B7280',
  Todo: '#9CA3AF',
  'In Progress': '#A31C1B',
  'In Review': '#C084FC',
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
    <div className="space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#171717] via-[#241212] to-[#171717] p-6 sm:p-7 rounded-2xl text-white shadow-glow-crimson border border-[#A31C1B]/35">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A31C1B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#A31C1B]/20 text-rose-300 text-xs font-medium mb-2 border border-[#A31C1B]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A31C1B] animate-ping inline-block" /> Live Workspace
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Here's what is happening across your active projects and deliverables today.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-2.5">
          <Button
            size="sm"
            variant="charcoal"
            onClick={() => navigate('/app/tasks')}
          >
            My Tasks
          </Button>
          <Button
            size="sm"
            variant="crimson"
            onClick={() => navigate('/app/projects')}
            className="shadow-glow-crimson"
          >
            All Projects <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned Tasks */}
        <Card variant="default" hover={true} className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/20 text-[#A31C1B] border border-[#A31C1B]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">
              Assigned to Me
            </div>
            <div className="text-2xl font-extrabold text-white mt-0.5 font-mono">
              {assignedCount}
            </div>
          </div>
        </Card>

        {/* Card 2: Completed Tasks */}
        <Card variant="default" hover={true} className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">
              Completed Tasks
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5 font-mono">
              {metrics.completedTasks}
            </div>
          </div>
        </Card>

        {/* Card 3: In Progress */}
        <Card variant="default" hover={true} className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/20 text-rose-300 border border-[#A31C1B]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">
              In Progress
            </div>
            <div className="text-2xl font-extrabold text-rose-400 mt-0.5 font-mono">
              {metrics.inProgressTasks}
            </div>
          </div>
        </Card>

        {/* Card 4: Overdue Tasks */}
        <Card variant="default" hover={true} className="flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">
              Overdue Tasks
            </div>
            <div className="text-2xl font-extrabold text-rose-400 mt-0.5 font-mono">
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
          <Card variant="glass">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Task Completion & Status Overview
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live distribution across project pipelines (Completion Rate: {metrics.completionRate}%)
                </p>
              </div>
              <Badge variant={metrics.completionRate > 50 ? 'success' : 'brand'} dot={true}>
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
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(12px)',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#F8FAFC',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#A31C1B'} />
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
          <Card variant="default">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#A31C1B]" /> My Assigned Tasks
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
              <div className="divide-y divide-white/10">
                {myTasks.map((t) => {
                  const isOverdue = t.dueDate && new Date() > new Date(t.dueDate) && t.status !== 'Done';
                  return (
                    <div
                      key={t._id}
                      onClick={() =>
                        navigate(`/app/projects/${t.project?._id || t.project}/board?task=${t._id}`)
                      }
                      className="py-3 flex items-center justify-between hover:bg-white/5 px-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="font-mono text-xs font-semibold text-rose-400 flex-shrink-0">
                          {t.key}
                        </span>
                        <span className="text-xs font-medium text-slate-200 truncate">
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
          <Card variant="default">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#A31C1B]" /> Active Projects
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
                      className="p-3.5 rounded-xl border border-white/10 bg-[#06110C]/80 hover:border-[#A31C1B]/50 hover:shadow-glow-crimson hover:-translate-y-0.5 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0 shadow-xs"
                            style={{ backgroundColor: proj.color || '#A31C1B' }}
                          >
                            {proj.key}
                          </div>
                          <span className="text-xs font-bold text-white truncate">
                            {proj.title}
                          </span>
                        </div>
                        <Badge size="xs">{proj.status}</Badge>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-[#171717] rounded-full h-1.5 overflow-hidden border border-white/5">
                        <div
                          className="bg-[#A31C1B] h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(163,28,27,0.6)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                        <span>{proj.taskStats?.totalTasks || 0} tasks</span>
                        <span className="font-semibold text-rose-300">{progress}% complete</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Quick Calendar Access */}
          <Card className="bg-gradient-to-br from-[#171717] to-[#251010] border border-[#A31C1B]/35 shadow-glow-crimson text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#A31C1B] text-white flex items-center justify-center shadow-md shadow-[#A31C1B]/40">
                <Calendar className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">
                Deadline Calendar
              </h4>
            </div>
            <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
              Track delivery milestones and due dates in month and week timeline views.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-center hover:shadow-sm"
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
