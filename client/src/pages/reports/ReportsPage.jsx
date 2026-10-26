import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  Users,
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
import { reportService } from '../../services/reportService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { Avatar } from '../../components/common/Avatar';

const PRIORITY_COLORS = {
  Low: '#94A3B8',
  Medium: '#3B82F6',
  High: '#F59E0B',
  Urgent: '#EF4444'
};

const STATUS_COLORS = {
  Backlog: '#94A3B8',
  Todo: '#64748B',
  'In Progress': '#6366F1',
  'In Review': '#A855F7',
  Done: '#10B981'
};

export function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        const res = await reportService.getOverview();
        setReport(res.data);
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await reportService.downloadCsv();
    } catch (err) {
      alert('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const metrics = report?.metrics || {
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    completionRate: 0
  };

  const byStatus = report?.byStatus || [];
  const byPriority = report?.byPriority || [];
  const memberWorkload = report?.memberWorkload || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" /> Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time project completion velocity, workload distribution, and performance metrics.
          </p>
        </div>

        <Button
          size="sm"
          icon={Download}
          loading={exporting}
          onClick={handleExportCsv}
        >
          Export CSV
        </Button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Completion Rate
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {metrics.completionRate}%
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Completed Tasks
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
              {metrics.completedTasks} / {metrics.totalTasks}
            </div>
          </div>
        </Card>

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

      {/* Two Column Charts: By Status & By Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
            Tasks by Status
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  {byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#6366F1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
            Tasks by Priority
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPriority} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="priority" tick={{ fontSize: 11 }} stroke="#94A3B8" />
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
                  {byPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || '#6366F1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Member Workload Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Team Member Workload
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Task assignment count and delivery status per collaborator.
            </p>
          </div>
        </div>

        {memberWorkload.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">No team workload recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="p-3 font-semibold">Member</th>
                  <th className="p-3 font-semibold text-center">Total Assigned</th>
                  <th className="p-3 font-semibold text-center">Completed</th>
                  <th className="p-3 font-semibold text-center">Pending</th>
                  <th className="p-3 font-semibold text-center">Overdue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {memberWorkload.map((m) => (
                  <tr key={m.userId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={m.userName} avatarUrl={m.avatarUrl} size="xs" />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {m.userName}
                          </div>
                          <div className="text-[10px] text-slate-400">{m.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">
                      {m.totalTasks}
                    </td>
                    <td className="p-3 text-center text-emerald-600 font-semibold">
                      {m.completedTasks}
                    </td>
                    <td className="p-3 text-center text-slate-600 dark:text-slate-400">
                      {m.pendingTasks}
                    </td>
                    <td className="p-3 text-center">
                      {m.overdueTasks > 0 ? (
                        <span className="font-bold text-rose-500">{m.overdueTasks}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
