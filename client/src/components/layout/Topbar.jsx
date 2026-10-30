import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Check,
  Trash2,
  ExternalLink,
  LogOut,
  User,
  Shield,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

export function Topbar({ setMobileOpen, onOpenSearch, onOpenQuickTask }) {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  // Build breadcrumb label from current route
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/app/dashboard') return 'Overview';
    if (path === '/app/tasks') return 'My Tasks';
    if (path.startsWith('/app/projects')) {
      if (path.includes('/board')) return 'Kanban Board';
      if (path.includes('/chat')) return 'Project Chat';
      return 'Projects';
    }
    if (path === '/app/calendar') return 'Calendar';
    if (path === '/app/chat') return 'Team Chat';
    if (path === '/app/sprints') return 'Sprints';
    if (path === '/app/reports') return 'Reports & Analytics';
    if (path.startsWith('/app/admin')) return 'Administration';
    if (path === '/app/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#06110C]/90 backdrop-blur-xl border-b border-slate-200/90 dark:border-white/10 flex items-center justify-between px-4 lg:px-6 transition-colors duration-300 shadow-sm text-slate-800 dark:text-slate-100">
      {/* Left section: Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation sidebar"
          className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#171717] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">CollabFlow</span>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
          <span className="text-slate-900 dark:text-white font-semibold tracking-tight">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Right section: Search trigger, Quick Add, Theme, Notifications, Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search trigger */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="group flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#171717] hover:bg-slate-200 dark:hover:bg-[#202020] border border-slate-200 dark:border-white/10 hover:border-[#A31C1B]/50 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs transition-all duration-200 shadow-xs"
        >
          <Search className="w-3.5 h-3.5 group-hover:text-[#A31C1B] transition-colors" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#06110C] border border-slate-200 dark:border-white/10 rounded-md text-slate-500 dark:text-slate-400 shadow-xs">
            ⌘K
          </kbd>
        </button>

        {/* Quick Task creation button */}
        <Button
          size="sm"
          variant="crimson"
          icon={Plus}
          onClick={onOpenQuickTask}
          className="hidden sm:inline-flex shadow-glow-crimson"
        >
          Task
        </Button>

        {/* ◐ Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode (◐)' : 'Switch to dark mode (◐)'}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base leading-none transition-all duration-300 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#171717] text-slate-700 dark:text-slate-200 hover:border-[#A31C1B]/50 hover:text-[#A31C1B] hover:scale-105 active:scale-95 shadow-xs"
        >
          <span className="transition-transform duration-500 inline-block hover:rotate-180 select-none">
            ◐
          </span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            aria-label="View notifications"
            className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#171717] transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A31C1B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#A31C1B] ring-2 ring-white dark:ring-[#06110C]"></span>
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#171717] backdrop-blur-xl border border-slate-200 dark:border-white/15 shadow-2xl z-50 overflow-hidden animate-scale-in text-slate-800 dark:text-slate-100">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#A31C1B]/20 text-[#A31C1B] dark:text-rose-300 border border-[#A31C1B]/40">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-[#A31C1B] dark:text-rose-400 hover:text-rose-500 flex items-center gap-1 font-medium"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-white/10">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    No notifications yet. You're all caught up!
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n._id}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${
                        !n.isRead ? 'bg-[#A31C1B]/5 dark:bg-[#A31C1B]/10' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => {
                            if (!n.isRead) markAsRead(n._id);
                            if (n.link) navigate(n.link);
                            setNotifDropdownOpen(false);
                          }}
                        >
                          <div className="font-medium text-slate-900 dark:text-slate-200">{n.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</div>
                        </div>
                        <button
                          onClick={() => deleteNotification(n._id)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-slate-200 dark:border-white/10 text-center bg-slate-50 dark:bg-[#111111]">
                <button
                  onClick={() => {
                    navigate('/app/notifications');
                    setNotifDropdownOpen(false);
                  }}
                  className="text-xs font-medium text-[#A31C1B] dark:text-rose-400 hover:underline"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center focus:outline-none"
          >
            <Avatar user={user} size="sm" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#171717] border border-slate-200 dark:border-white/15 shadow-2xl py-1 z-50 text-slate-800 dark:text-slate-200">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/10">
                <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                  {user?.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {user?.email}
                </div>
                <div className="mt-1">
                  <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 dark:bg-[#06110C] border border-slate-200 dark:border-white/10 text-[#A31C1B] dark:text-rose-300 uppercase">
                    {user?.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigate('/app/settings');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-left"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Profile</span>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    navigate('/app/admin');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#A31C1B] dark:text-rose-400 hover:bg-[#A31C1B]/10 transition-colors text-left font-medium"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </button>
              )}

              <div className="border-t border-slate-100 dark:border-white/10 my-1" />

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-[#A31C1B]/15 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
