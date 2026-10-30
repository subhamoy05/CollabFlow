import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  MessageSquare,
  Zap,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronDown,
  Plus,
  ChevronsLeft,
  ChevronsRight,
  Briefcase,
  Workflow
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, isAdmin } = useAuth();
  const { organizations, currentOrg, switchOrg, createOrg } = useOrganization();
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [createOrgModalOpen, setCreateOrgModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDesc, setNewOrgDesc] = useState('');
  const [creatingOrg, setCreatingOrg] = useState(false);
  const navigate = useNavigate();

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    try {
      setCreatingOrg(true);
      await createOrg({ name: newOrgName, description: newOrgDesc });
      setNewOrgName('');
      setNewOrgDesc('');
      setCreateOrgModalOpen(false);
      setOrgDropdownOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingOrg(false);
    }
  };

  const navItems = [
    { label: 'Overview', path: '/app/dashboard', icon: LayoutDashboard },
    { label: 'My Tasks', path: '/app/tasks', icon: CheckSquare },
    { label: 'Projects', path: '/app/projects', icon: FolderKanban },
    { label: 'Calendar', path: '/app/calendar', icon: Calendar },
    { label: 'Team Chat', path: '/app/chat', icon: MessageSquare },
    { label: 'Sprints', path: '/app/sprints', icon: Zap },
    { label: 'Reports', path: '/app/reports', icon: BarChart3 }
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Dashboard', path: '/app/admin', icon: ShieldCheck, admin: true });
  }

  navItems.push({ label: 'Settings', path: '/app/settings', icon: Settings });

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white/95 dark:bg-[#06110C]/95 backdrop-blur-xl border-r border-slate-200/90 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200/90 dark:border-white/10">
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden group select-none"
            onClick={() => navigate('/app/dashboard')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#A31C1B] to-[#5E1817] flex items-center justify-center shadow-md shadow-[#A31C1B]/30 group-hover:scale-105 transition-transform flex-shrink-0">
              <Workflow className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Collab<span className="text-[#A31C1B]">Flow</span>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace selector */}
        <div className="p-3 border-b border-slate-200/90 dark:border-white/10 relative">
          <button
            type="button"
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
            className={`w-full flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-[#171717] hover:bg-slate-200 dark:hover:bg-[#202020] text-left transition-colors border border-slate-200 dark:border-white/10 ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#A31C1B] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm shadow-[#A31C1B]/40">
                {currentOrg?.name ? currentOrg.name.charAt(0).toUpperCase() : 'W'}
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {currentOrg?.name || 'My Workspace'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate capitalize">
                    {currentOrg?.userRole || 'Workspace'}
                  </div>
                </div>
              )}
            </div>
            {!collapsed && <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-1" />}
          </button>

          {/* Org Dropdown */}
          {orgDropdownOpen && (
            <div className="absolute left-3 right-3 top-16 z-50 mt-1 bg-white dark:bg-[#171717] border border-slate-200 dark:border-white/15 rounded-xl shadow-2xl py-1 text-slate-700 dark:text-slate-200 backdrop-blur-xl">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                Workspaces
              </div>
              {organizations.map((org) => (
                <button
                  key={org._id}
                  onClick={() => {
                    switchOrg(org._id);
                    setOrgDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ${
                    currentOrg?._id === org._id ? 'text-[#A31C1B] font-semibold bg-[#A31C1B]/10 dark:bg-[#A31C1B]/15' : ''
                  }`}
                >
                  <span className="truncate">{org.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase">{org.userRole}</span>
                </button>
              ))}
              <div className="border-t border-slate-200 dark:border-white/10 my-1" />
              <button
                type="button"
                onClick={() => {
                  setOrgDropdownOpen(false);
                  setCreateOrgModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#A31C1B] dark:text-rose-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#A31C1B]" />
                <span>Create Workspace</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 select-none ${
                    isActive
                      ? 'bg-gradient-to-r from-[#A31C1B] to-[#721716] text-white shadow-md shadow-[#A31C1B]/35 font-semibold translate-x-0.5'
                      : item.admin
                      ? 'text-[#A31C1B] dark:text-rose-400 hover:bg-[#A31C1B]/10 dark:hover:bg-[#A31C1B]/15 hover:text-[#A31C1B] dark:hover:text-rose-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hover:translate-x-0.5'
                  } ${collapsed ? 'justify-center px-0' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Mini Profile in Sidebar Footer */}
        <div className="p-3 border-t border-slate-200/90 dark:border-white/10">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-slate-100 dark:bg-[#171717] hover:bg-slate-200 dark:hover:bg-[#202020] border border-slate-200 dark:border-white/10 transition-colors cursor-pointer ${
              collapsed ? 'justify-center p-1' : ''
            }`}
            onClick={() => navigate('/app/settings')}
          >
            <div className="w-8 h-8 rounded-full bg-[#A31C1B]/15 dark:bg-[#A31C1B]/20 text-[#A31C1B] dark:text-rose-300 border border-[#A31C1B]/40 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.role}</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Modal: Create Workspace */}
      <Modal
        isOpen={createOrgModalOpen}
        onClose={() => setCreateOrgModalOpen(false)}
        title="Create New Workspace"
        description="A workspace allows you to organize projects and collaborate with team members."
      >
        <form onSubmit={handleCreateOrg} className="space-y-4">
          <Input
            label="Workspace Name"
            placeholder="e.g. Acme Corp, Design Team"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Description (Optional)"
            placeholder="What does your team work on?"
            value={newOrgDesc}
            onChange={(e) => setNewOrgDesc(e.target.value)}
          />
          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCreateOrgModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              loading={creatingOrg}
              disabled={!newOrgName.trim()}
            >
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
