import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  CheckCircle2,
  FolderKanban
} from 'lucide-react';
import api from '../../services/api';
import { projectService } from '../../services/projectService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { TaskDetailModal } from '../../components/tasks/TaskDetailModal';

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    projectService.getProjects({ limit: 100 }).then((res) => {
      setProjects(res.data || []);
    });
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedProjectId !== 'all') {
        params.projectId = selectedProjectId;
      }
      const res = await api.get('/calendar/events', { params });
      setEvents(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [selectedProjectId]);

  // Calendar Math for Monthly View
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const prevMonthPadding = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: prevMonthDays - firstDayOfMonth + i + 1,
    isCurrentMonth: false,
    date: new Date(year, month - 1, prevMonthDays - firstDayOfMonth + i + 1)
  }));

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: true,
    date: new Date(year, month, i + 1)
  }));

  const totalSlots = Math.ceil((prevMonthPadding.length + currentMonthDays.length) / 7) * 7;
  const nextMonthPadding = Array.from(
    { length: totalSlots - (prevMonthPadding.length + currentMonthDays.length) },
    (_, i) => ({
      day: i + 1,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i + 1)
    })
  );

  const calendarDays = [...prevMonthPadding, ...currentMonthDays, ...nextMonthPadding];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Map events to day
  const getDayEvents = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter((e) => {
      if (!e.dueDate) return false;
      return new Date(e.dueDate).toISOString().split('T')[0] === dateStr;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" /> Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Deliverable deadlines, release dates, and project milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>

          <Button size="sm" variant="secondary" onClick={handleToday}>
            Today
          </Button>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Month Label */}
      <div className="text-base font-bold text-slate-800 dark:text-slate-200">
        {monthNames[month]} {year}
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-subtle">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-center py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
          {calendarDays.map((cell, idx) => {
            const dayEvents = getDayEvents(cell.date);
            const isCurrentDay = isToday(cell.date);

            return (
              <div
                key={idx}
                className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/40 dark:bg-slate-950/20 opacity-50'
                    : 'bg-white dark:bg-slate-900'
                }`}
              >
                {/* Day number */}
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                      isCurrentDay
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cell.day}
                  </span>
                </div>

                {/* Event pills on this day */}
                <div className="space-y-1 overflow-y-auto max-h-[85px]">
                  {dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => {
                        if (evt.taskId) setSelectedTaskId(evt.taskId);
                      }}
                      className="px-2 py-1 rounded text-[10px] font-medium truncate cursor-pointer transition-transform hover:scale-102 flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800"
                      title={evt.title}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            evt.priority === 'Urgent'
                              ? '#F43F5E'
                              : evt.priority === 'High'
                              ? '#F59E0B'
                              : '#6366F1'
                        }}
                      />
                      <span className="truncate">{evt.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onTaskUpdated={() => loadEvents()}
        onTaskDeleted={() => {
          setSelectedTaskId(null);
          loadEvents();
        }}
      />
    </div>
  );
}
