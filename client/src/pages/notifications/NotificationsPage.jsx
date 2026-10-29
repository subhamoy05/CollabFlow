import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  Trash2,
  ExternalLink,
  Filter,
  CheckCheck
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';

export function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loading
  } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const navigate = useNavigate();

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#A31C1B]" /> Notifications
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time updates regarding task assignments, comments, and project invitations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="crimson"
              icon={CheckCheck}
              onClick={markAllAsRead}
            >
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-[#A31C1B]/15 text-rose-300 border border-[#A31C1B]/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'unread'
              ? 'bg-[#A31C1B]/15 text-rose-300 border border-[#A31C1B]/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description={
            filter === 'unread'
              ? "You have caught up with all incoming notifications."
              : "You haven't received any notifications yet."
          }
        />
      ) : (
        <div className="bg-[#171717] border border-white/10 rounded-2xl overflow-hidden shadow-2xl divide-y divide-white/10">
          {filtered.map((item) => (
            <div
              key={item._id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                !item.isRead ? 'bg-[#A31C1B]/10' : 'hover:bg-white/5'
              }`}
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => {
                  if (!item.isRead) markAsRead(item._id);
                  if (item.link) navigate(item.link);
                }}
              >
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-100">
                    {item.title}
                  </h4>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#A31C1B] inline-block shadow-glow-crimson" />
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {item.message}
                </p>
                <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-2">
                  <span>
                    {new Date(item.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {item.link && (
                    <span className="text-rose-400 font-medium flex items-center gap-0.5">
                      Open <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {!item.isRead && (
                  <button
                    onClick={() => markAsRead(item._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-300 rounded-lg hover:bg-white/5 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(item._id)}
                  className="p-1.5 text-slate-400 hover:text-[#A31C1B] rounded-lg hover:bg-white/5 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
