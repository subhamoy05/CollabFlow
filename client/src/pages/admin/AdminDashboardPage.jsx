import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  FolderKanban,
  Building,
  FileText,
  Settings,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  UserX,
  Search,
  Lock,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { Avatar } from '../../components/common/Avatar';

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'projects' | 'audit' | 'settings'
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOverview();
      setOverview(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await adminService.getUsers({
        search: userSearch || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await adminService.getProjects();
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const res = await adminService.getAuditLogs();
      setAuditLogs(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await adminService.getSettings();
      setSettings(res.data || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') loadOverview();
    else if (activeTab === 'users') loadUsers();
    else if (activeTab === 'projects') loadProjects();
    else if (activeTab === 'audit') loadAuditLogs();
    else if (activeTab === 'settings') loadSettings();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [userSearch, roleFilter, statusFilter]);

  const handleToggleUserStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to change ${user.name}'s status to ${newStatus}?`)) {
      return;
    }
    try {
      await adminService.updateUserStatus(user._id, newStatus);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to update status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to update role');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateSettings(settings);
      alert('Platform settings updated successfully.');
    } catch (err) {
      alert('Failed to update settings');
    }
  };

  const stats = overview?.stats || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#A31C1B]" /> Platform Administration
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Global user directory, role governance, audit trails, and platform configurations.
        </p>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'System Overview', icon: Shield },
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'projects', label: 'Projects Registry', icon: FolderKanban },
          { id: 'audit', label: 'Audit Logs', icon: FileText },
          { id: 'settings', label: 'System Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#A31C1B]/15 text-rose-300 border border-[#A31C1B]/40 shadow-glow-crimson'
                  : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                  <div className="text-xs font-semibold text-slate-400">Registered Users</div>
                  <div className="text-2xl font-extrabold text-slate-100 mt-1">
                    {stats.totalUsers || 0}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">
                    {stats.activeUsers || 0} active • {stats.suspendedUsers || 0} suspended
                  </div>
                </Card>

                <Card>
                  <div className="text-xs font-semibold text-slate-400">Organizations</div>
                  <div className="text-2xl font-extrabold text-slate-100 mt-1">
                    {stats.totalOrgs || 0}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Active workspaces</div>
                </Card>

                <Card>
                  <div className="text-xs font-semibold text-slate-400">Projects</div>
                  <div className="text-2xl font-extrabold text-slate-100 mt-1">
                    {stats.totalProjects || 0}
                  </div>
                  <div className="text-[10px] text-rose-400 mt-1">
                    {stats.activeProjects || 0} active • {stats.completedProjects || 0} completed
                  </div>
                </Card>

                <Card>
                  <div className="text-xs font-semibold text-slate-400">Platform Tasks</div>
                  <div className="text-2xl font-extrabold text-slate-100 mt-1">
                    {stats.totalTasks || 0}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">
                    {stats.completedTasks || 0} done • {stats.overdueTasks || 0} overdue
                  </div>
                </Card>
              </div>

              {/* Recent Audit Logs Snapshot */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-100">
                    Recent Security & Audit Events
                  </h3>
                  <Button size="xs" variant="ghost" onClick={() => setActiveTab('audit')}>
                    View all
                  </Button>
                </div>

                <div className="divide-y divide-white/10 text-xs">
                  {overview?.recentAuditLogs?.length === 0 ? (
                    <p className="text-slate-500 py-3 italic">No recent events logged.</p>
                  ) : (
                    overview?.recentAuditLogs?.map((log) => (
                      <div key={log._id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Avatar user={log.actor} size="xs" />
                          <div>
                            <span className="font-semibold text-slate-100">
                              {log.actor?.name || 'System'}:
                            </span>{' '}
                            <span className="text-slate-400">{log.details}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeTab === 'users' && (
        <Card className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#06110C] border border-white/10 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#A31C1B]"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs rounded-xl bg-[#06110C] border border-white/10 px-3 py-1.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#A31C1B]"
              >
                <option value="all" className="bg-[#171717]">All Roles</option>
                <option value="Admin" className="bg-[#171717]">Admin</option>
                <option value="Project Manager" className="bg-[#171717]">Project Manager</option>
                <option value="Team Member" className="bg-[#171717]">Team Member</option>
                <option value="Viewer" className="bg-[#171717]">Viewer</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs rounded-xl bg-[#06110C] border border-white/10 px-3 py-1.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#A31C1B]"
              >
                <option value="all" className="bg-[#171717]">All Statuses</option>
                <option value="active" className="bg-[#171717]">Active</option>
                <option value="suspended" className="bg-[#171717]">Suspended</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121212] border-b border-white/10 text-slate-400">
                <tr>
                  <th className="p-3 font-semibold">User</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Registered</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar user={u} size="xs" />
                        <div>
                          <div className="font-semibold text-slate-100">{u.name}</div>
                          <div className="text-[10px] text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="text-xs rounded bg-[#06110C] border border-white/10 px-2 py-1 text-slate-200 focus:ring-1 focus:ring-[#A31C1B]"
                      >
                        <option value="Admin" className="bg-[#171717]">Admin</option>
                        <option value="Project Manager" className="bg-[#171717]">Project Manager</option>
                        <option value="Team Member" className="bg-[#171717]">Team Member</option>
                        <option value="Viewer" className="bg-[#171717]">Viewer</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <Badge variant={u.status === 'active' ? 'success' : 'danger'} size="xs">
                        {u.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="xs"
                        variant={u.status === 'active' ? 'danger' : 'secondary'}
                        onClick={() => handleToggleUserStatus(u)}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: PROJECTS */}
      {activeTab === 'projects' && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121212] border-b border-white/10 text-slate-400">
              <tr>
                <th className="p-3 font-semibold">Project</th>
                <th className="p-3 font-semibold">Workspace</th>
                <th className="p-3 font-semibold">Manager</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-slate-100">
                    <span className="font-mono text-rose-400 mr-2">[{p.key}]</span>
                    {p.title}
                  </td>
                  <td className="p-3 text-slate-400">{p.organization?.name || 'Personal'}</td>
                  <td className="p-3 text-slate-300">{p.manager?.name}</td>
                  <td className="p-3"><Badge size="xs">{p.status}</Badge></td>
                  <td className="p-3 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121212] border-b border-white/10 text-slate-400">
              <tr>
                <th className="p-3 font-semibold">Timestamp</th>
                <th className="p-3 font-semibold">Actor</th>
                <th className="p-3 font-semibold">Action</th>
                <th className="p-3 font-semibold">Entity Type</th>
                <th className="p-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {auditLogs.map((log) => (
                <tr key={log._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 text-slate-500 font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 font-medium text-slate-100">
                    {log.actor?.name || 'System'}
                  </td>
                  <td className="p-3">
                    <Badge size="xs">{log.action}</Badge>
                  </td>
                  <td className="p-3 text-slate-400">{log.entityType}</td>
                  <td className="p-3 text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* TAB 5: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <Card className="max-w-2xl">
          <h3 className="text-sm font-bold text-slate-100 mb-4">
            Platform Configuration
          </h3>
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#06110C] border border-white/10">
              <div>
                <div className="font-semibold text-slate-100">
                  Allow Public User Registration
                </div>
                <div className="text-slate-400 text-[11px]">
                  Permit new users to self-register via the landing page
                </div>
              </div>
              <input
                type="checkbox"
                checked={!!settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                className="w-4 h-4 text-[#A31C1B] accent-[#A31C1B] rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#06110C] border border-white/10">
              <div>
                <div className="font-semibold text-slate-100">
                  Enable Task Comments
                </div>
                <div className="text-slate-400 text-[11px]">
                  Allow collaborators to post comments on task threads
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableTaskComments !== false}
                onChange={(e) => setSettings({ ...settings, enableTaskComments: e.target.checked })}
                className="w-4 h-4 text-[#A31C1B] accent-[#A31C1B] rounded"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#06110C] border border-white/10 space-y-2">
              <label className="block font-semibold text-slate-100">
                Max File Upload Size (MB)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.maxUploadSizeMb || 10}
                onChange={(e) =>
                  setSettings({ ...settings, maxUploadSizeMb: parseInt(e.target.value, 10) })
                }
                className="w-32 text-xs rounded-lg bg-[#171717] border border-white/10 px-3 py-1.5 text-slate-100 focus:ring-1 focus:ring-[#A31C1B]"
              />
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" variant="crimson" size="sm">
                Save Platform Settings
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
