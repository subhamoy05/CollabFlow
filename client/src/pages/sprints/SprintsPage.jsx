import React, { useState, useEffect } from 'react';
import {
  Zap,
  Plus,
  Play,
  CheckCircle,
  Calendar,
  FolderKanban,
  CheckSquare,
  Clock
} from 'lucide-react';
import { sprintService } from '../../services/sprintService';
import { projectService } from '../../services/projectService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';

export function SprintsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Load projects list
  useEffect(() => {
    projectService.getProjects({ limit: 50 }).then((res) => {
      const list = res.data || [];
      setProjects(list);
      if (list.length > 0) setSelectedProjectId(list[0]._id);
    });
  }, []);

  const loadSprints = async () => {
    if (!selectedProjectId) return;
    try {
      setLoading(true);
      const res = await sprintService.getSprints(selectedProjectId);
      setSprints(res.data || []);
    } catch (err) {
      console.error('Failed to load sprints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSprints();
  }, [selectedProjectId]);

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    if (!name || !startDate || !endDate || !selectedProjectId) return;

    try {
      setCreating(true);
      setError('');
      await sprintService.createSprint({
        name,
        goal,
        project: selectedProjectId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString()
      });
      setIsCreateModalOpen(false);
      setName('');
      setGoal('');
      setStartDate('');
      setEndDate('');
      loadSprints();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create sprint');
    } finally {
      setCreating(false);
    }
  };

  const handleStartSprint = async (sprintId) => {
    try {
      await sprintService.startSprint(sprintId);
      loadSprints();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to start sprint');
    }
  };

  const handleCompleteSprint = async (sprintId) => {
    if (!window.confirm('Mark this sprint as completed?')) return;
    try {
      await sprintService.completeSprint(sprintId);
      loadSprints();
    } catch (err) {
      alert('Failed to complete sprint');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#A31C1B]" /> Sprints & Iterations
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Plan focused development cycles, burndown objectives, and velocity tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs rounded-xl bg-[#171717] border border-white/10 px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#A31C1B] focus:border-[#A31C1B]"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id} className="bg-[#171717] text-slate-100">
                {p.title} ({p.key})
              </option>
            ))}
          </select>

          <Button icon={Plus} size="sm" variant="crimson" onClick={() => setIsCreateModalOpen(true)}>
            New Sprint
          </Button>
        </div>
      </div>

      {/* Sprints List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : sprints.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No sprints scheduled"
          description="Create your first agile sprint to organize deliverables into milestones."
          actionLabel="Create Sprint"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {sprints.map((sprint) => {
            const stats = sprint.stats || { totalTasks: 0, completedTasks: 0, progress: 0 };
            return (
              <Card key={sprint._id} className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {sprint.name}
                      </h3>
                      <Badge
                        variant={
                          sprint.status === 'Active'
                            ? 'brand'
                            : sprint.status === 'Completed'
                            ? 'success'
                            : 'default'
                        }
                      >
                        {sprint.status}
                      </Badge>
                    </div>
                    {sprint.goal && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        🎯 {sprint.goal}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(sprint.startDate).toLocaleDateString()} -{' '}
                        {new Date(sprint.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {sprint.status === 'Planned' && (
                      <Button
                        size="sm"
                        variant="crimson"
                        icon={Play}
                        onClick={() => handleStartSprint(sprint._id)}
                      >
                        Start Sprint
                      </Button>
                    )}
                    {sprint.status === 'Active' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={CheckCircle}
                        onClick={() => handleCompleteSprint(sprint._id)}
                      >
                        Complete Sprint
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress bar & Workload breakdown */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
                    <span>
                      {stats.completedTasks} of {stats.totalTasks} tasks completed
                    </span>
                    <span className="font-bold text-rose-300">{stats.progress}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                    <div
                      className="bg-[#A31C1B] shadow-[0_0_8px_rgba(163,28,27,0.5)] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.progress}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal: Create Sprint */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Sprint"
        description="Set sprint objectives, planned duration, and associating goals."
      >
        <form onSubmit={handleCreateSprint} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#A31C1B]/20 text-rose-300 text-xs border border-[#A31C1B]/40">
              {error}
            </div>
          )}

          <Input
            label="Sprint Name"
            placeholder="e.g. Sprint 1 - Core Foundations"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Sprint Goal
            </label>
            <textarea
              rows={2}
              placeholder="What is the objective of this sprint?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full text-xs rounded-xl bg-[#06110C] border border-white/10 p-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#A31C1B] focus:border-[#A31C1B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full text-xs rounded-lg bg-[#06110C] border border-white/10 px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#A31C1B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full text-xs rounded-lg bg-[#06110C] border border-white/10 px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#A31C1B]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <Button variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="crimson" size="sm" loading={creating} disabled={!name.trim() || !startDate || !endDate}>
              Create Sprint
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
