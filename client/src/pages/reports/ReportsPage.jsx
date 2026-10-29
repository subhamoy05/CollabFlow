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
  Low: '#525252',
  Medium: '#A31C1B',
  High: '#F59E0B',
  Urgent: '#E11D48'
};

const STATUS_COLORS = {
  Backlog: '#525252',
  Todo: '#737373',
  'In Progress': '#A31C1B',
  'In Review': '#E11D48',
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
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#A31C1B]" /> Reports & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time project completion velocity, workload distribution, and performance metrics.
          </p>
        </div>

        <Button
          size="sm"
          variant="crimson"
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
          <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/15 text-rose-400 border border-[#A31C1B]/30 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">
              Completion Rate
            </div>
            <div className="text-2xl font-extrabold text-slate-100 mt-0.5">
              {metrics.completionRate}%
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/30 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">
              Completed Tasks
            </div>
            <div className="text-2xl font-extrabold text-slate-100 mt-0.5">
              {metrics.completedTasks} / {metrics.totalTasks}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/20 text-rose-300 border border-[#A31C1B]/40 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">
              In Progress
            </div>
            <div className="text-2xl font-extrabold text-slate-100 mt-0.5">
              {metrics.inProgressTasks}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400">
              Overdue Tasks
            </div>
            <div className="text-2xl font-extrabold text-rose-400 mt-0.5">
              {metrics.overdueTasks}
            </div>
          </div>
        </Card>
      </div>

      {/* Two Column Charts: By Status & By Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <h3 className="text-sm font-bold text-slate-100 mb-4">
            Tasks by Status
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="status" tick={{ fontSize: 11 }} stroke="#64748B" />
                <YAxis tick={{ fontSize: 11 }} stroke="#64748B" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#F8FAFC'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#A31C1B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <h3 className="text-sm font-bold text-slate-100 mb-4">
            Tasks by Priority
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPriority} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="priority" tick={{ fontSize: 11 }} stroke="#64748B" />
                <YAxis tick={{ fontSize: 11 }} stroke="#64748B" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#F8FAFC'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {byPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || '#A31C1B'} />
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
            <h3 className="text-sm font-bold text-slate-100">
              Team Member Workload
            </h3>
            <p className="text-xs text-slate-400">
              Task assignment count and delivery status per collaborator.
            </p>
          </div>
        </div>

        {memberWorkload.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">No team workload recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121212] border-b border-white/10 text-slate-400">
                <tr>
                  <th className="p-3 font-semibold">Member</th>
                  <th className="p-3 font-semibold text-center">Total Assigned</th>
                  <th className="p-3 font-semibold text-center">Completed</th>
                  <th className="p-3 font-semibold text-center">Pending</th>
                  <th className="p-3 font-semibold text-center">Overdue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {memberWorkload.map((m) => (
                  <tr key={m.userId} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={m.userName} avatarUrl={m.avatarUrl} size="xs" />
                        <div>
                          <div className="font-semibold text-slate-100">
                            {m.userName}
                          </div>
                          <div className="text-[10px] text-slate-500">{m.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-200">
                      {m.totalTasks}
                    </td>
                    <td className="p-3 text-center text-emerald-400 font-semibold">
                      {m.completedTasks}
                    </td>
                    <td className="p-3 text-center text-slate-400">
                      {m.pendingTasks}
                    </td>
                    <td className="p-3 text-center">
                      {m.overdueTasks > 0 ? (
                        <span className="font-bold text-rose-400">{m.overdueTasks}</span>
                      ) : (
                        <span className="text-slate-500">0</span>
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
