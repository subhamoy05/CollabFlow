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
  TrendingUp,
  Sparkles
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
import { GlassCard } from '../../components/common/GlassCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { CountUp } from '../../components/common/ScrollEffects';
import { Tilt3D, Magnetic } from '../../components/common/InteractiveEffects';

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
    <div className="space-y-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-100 transition-colors">
      {/* Welcome Banner with Frosted Glass & Ambient Glow */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-[#171717] dark:via-[#241212] dark:to-[#171717] p-6 sm:p-7 rounded-2xl text-slate-900 dark:text-white shadow-xl dark:shadow-glow-crimson border border-slate-200 dark:border-[#A31C1B]/35">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#A31C1B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#A31C1B]/15 text-[#A31C1B] dark:text-rose-300 text-xs font-medium mb-2 border border-[#A31C1B]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A31C1B] animate-ping inline-block" /> Live Workspace
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
            Here's what is happening across your active projects and deliverables today.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-2.5">
          <Magnetic strength={0.2}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate('/app/tasks')}
            >
              My Tasks
            </Button>
          </Magnetic>
          <Magnetic strength={0.25}>
            <Button
              size="sm"
              variant="crimson"
              onClick={() => navigate('/app/projects')}
              className="shadow-glow-crimson font-semibold"
            >
              All Projects <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Magnetic>
        </div>
      </div>

      {/* 4 Summary Cards with 3D Tilt and Animated CountUp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assigned Tasks */}
        <Tilt3D maxTilt={8}>
          <GlassCard className="p-5 flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/app/tasks')}>
            <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/15 text-[#A31C1B] border border-[#A31C1B]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Assigned to Me
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5 font-mono">
                <CountUp end={assignedCount} duration={1200} />
              </div>
            </div>
          </GlassCard>
        </Tilt3D>

        {/* Card 2: Completed Tasks */}
        <Tilt3D maxTilt={8}>
          <GlassCard className="p-5 flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/app/tasks')}>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Completed Tasks
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                <CountUp end={metrics.completedTasks} duration={1400} />
              </div>
            </div>
          </GlassCard>
        </Tilt3D>

        {/* Card 3: In Progress */}
        <Tilt3D maxTilt={8}>
          <GlassCard className="p-5 flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/app/tasks')}>
            <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/15 text-[#A31C1B] border border-[#A31C1B]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                In Progress
              </div>
              <div className="text-2xl font-extrabold text-[#A31C1B] dark:text-rose-400 mt-0.5 font-mono">
                <CountUp end={metrics.inProgressTasks} duration={1300} />
              </div>
            </div>
          </GlassCard>
        </Tilt3D>

        {/* Card 4: Overdue Tasks */}
        <Tilt3D maxTilt={8}>
          <GlassCard className="p-5 flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/app/tasks')}>
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Overdue Tasks
              </div>
              <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5 font-mono">
                <CountUp end={metrics.overdueTasks} duration={1100} />
              </div>
            </div>
          </GlassCard>
        </Tilt3D>
      </div>

      {/* Main Grid: Charts & Project Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Task Distribution Chart & My Upcoming Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card with Glassmorphism */}
          <GlassCard className="p-6">
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
                        backgroundColor: 'rgba(23, 23, 23, 0.9)',
                        backdropFilter: 'blur(12px)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#F8FAFC',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
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
          </GlassCard>

          {/* Assigned Tasks Table */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
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
              <div className="divide-y divide-slate-200/80 dark:divide-white/10">
                {myTasks.map((t) => {
                  const isOverdue = t.dueDate && new Date() > new Date(t.dueDate) && t.status !== 'Done';
                  return (
                    <div
                      key={t._id}
                      onClick={() =>
                        navigate(`/app/projects/${t.project?._id || t.project}/board?task=${t._id}`)
                      }
                      className="py-3 flex items-center justify-between hover:bg-slate-100/70 dark:hover:bg-white/5 px-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="font-mono text-xs font-semibold text-[#A31C1B] dark:text-rose-400 flex-shrink-0">
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
          </GlassCard>
        </div>

        {/* Right 1 Col: Recent Projects & Upcoming Deadlines */}
        <div className="space-y-6">
          {/* Projects Card */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
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
                      className="p-3.5 rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-50/70 dark:bg-[#06110C]/80 hover:border-[#A31C1B]/50 hover:shadow-lg dark:hover:shadow-glow-crimson hover:-translate-y-0.5 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-[11px] flex-shrink-0 shadow-xs"
                            style={{ backgroundColor: proj.color || '#A31C1B' }}
                          >
                            {proj.key}
                          </div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {proj.title}
                          </span>
                        </div>
                        <Badge size="xs">{proj.status}</Badge>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 dark:bg-[#171717] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#A31C1B] h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(163,28,27,0.6)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                        <span>{proj.taskStats?.totalTasks || 0} tasks</span>
                        <span className="font-semibold text-[#A31C1B] dark:text-rose-300">{progress}% complete</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

          {/* Quick Calendar Access */}
          <Tilt3D maxTilt={6}>
            <GlassCard className="p-6 bg-gradient-to-br from-white/90 via-slate-50/80 to-white/90 dark:from-[#171717] dark:via-[#251010] dark:to-[#171717] border border-slate-200 dark:border-[#A31C1B]/35 shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#A31C1B] text-white flex items-center justify-center shadow-md shadow-[#A31C1B]/40">
                  <Calendar className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Deadline Calendar
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3.5 leading-relaxed">
                Track delivery milestones and due dates in month and week timeline views.
              </p>
              <Magnetic strength={0.25} className="w-full">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-center hover:shadow-sm"
                  onClick={() => navigate('/app/calendar')}
                >
                  Open Calendar
                </Button>
              </Magnetic>
            </GlassCard>
          </Tilt3D>
        </div>
      </div>
    </div>
  );
}
