import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  Lock,
  Archive,
  ArrowRight
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { useOrganization } from '../../context/OrganizationContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Avatar } from '../../components/common/Avatar';

const COLOR_PRESETS = [
  '#A31C1B', // Crimson
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4'  // Cyan
];

export function ProjectsPage() {
  const { currentOrg } = useOrganization();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // New project form state
  const [title, setTitle] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#A31C1B');
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (currentOrg?._id) params.organizationId = currentOrg._id;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search) params.search = search;

      const res = await projectService.getProjects(params);
      setProjects(res?.data || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [currentOrg, statusFilter, search]);

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!key || key.length <= 4) {
      // Auto-generate key from title initials/first chars
      const autoKey = val
        .trim()
        .split(/\s+/)
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 4);
      if (autoKey.length >= 2) setKey(autoKey);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim() || !key.trim() || !currentOrg?._id) return;

    try {
      setCreating(true);
      setError('');
      const res = await projectService.createProject({
        title: title.trim(),
        key: key.trim().toUpperCase(),
        description: description.trim(),
        organization: currentOrg._id,
        color,
        isPrivate
      });

      setIsCreateModalOpen(false);
      setTitle('');
      setKey('');
      setDescription('');
      navigate(`/app/projects/${res.data._id}/board`);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">
            Projects
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize work streams, Kanban boards, sprint cycles, and deliverables.
          </p>
        </div>
        <Button variant="crimson" icon={Plus} size="sm" onClick={() => setIsCreateModalOpen(true)} className="shadow-glow-crimson">
          New Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, key, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-[#171717] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#A31C1B] focus:ring-2 focus:ring-[#A31C1B]/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl bg-[#171717] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#A31C1B] focus:ring-2 focus:ring-[#A31C1B]/20"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Planning">Planning</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Create your first project to start organizing team tasks and Kanban workflows."
          actionLabel="Create Project"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const stats = proj.taskStats || { totalTasks: 0, completedTasks: 0, overdueTasks: 0, progress: 0 };
            return (
              <Card
                key={proj._id}
                hover
                onClick={() => navigate(`/app/projects/${proj._id}/board`)}
                className="flex flex-col justify-between"
              >
                <div>
                  {/* Top: Icon & status badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs"
                        style={{ backgroundColor: proj.color || '#A31C1B' }}
                      >
                        {proj.key}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-100 line-clamp-1">
                          {proj.title}
                        </h3>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {proj.key} {proj.isPrivate && <Lock className="w-2.5 h-2.5 inline ml-1 text-slate-400" />}
                        </div>
                      </div>
                    </div>
                    <Badge size="xs">{proj.status}</Badge>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {proj.description || 'No description provided.'}
                  </p>
                </div>

                {/* Progress bar and metrics */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                    <span>Progress ({stats.completedTasks}/{stats.totalTasks} tasks)</span>
                    <span className="font-semibold text-rose-300">
                      {stats.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(163,28,27,0.5)]"
                      style={{
                        width: `${stats.progress}%`,
                        backgroundColor: proj.color || '#A31C1B'
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Avatar user={proj.manager} size="xs" />
                      <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                        {proj.manager?.name || 'Unassigned'}
                      </span>
                    </div>
                    {stats.overdueTasks > 0 && (
                      <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {stats.overdueTasks} overdue
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal: Create Project */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        description="Configure your project title, short key prefix, and initial settings."
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Project Title"
                placeholder="e.g. Website Redesign, Mobile API"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <Input
                label="Key (Prefix)"
                placeholder="e.g. WEB"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                maxLength={6}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Provide context regarding the project goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs rounded-xl bg-[#06110C] border border-white/10 p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#A31C1B] focus:ring-2 focus:ring-[#A31C1B]/20"
            />
          </div>

          {/* Color Preset Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Project Accent Color
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-lg transition-transform ${
                    color === c ? 'scale-110 ring-2 ring-[#A31C1B] ring-offset-2 ring-offset-[#171717]' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Privacy Switch */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded accent-[#A31C1B] w-4 h-4 bg-[#06110C] border-white/10"
            />
            <label htmlFor="isPrivate" className="text-xs text-slate-300 select-none">
              Make this project private (accessible only to invited members)
            </label>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-white/10">
            <Button variant="charcoal" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="crimson"
              size="sm"
              loading={creating}
              disabled={!title.trim() || !key.trim()}
              className="shadow-glow-crimson"
            >
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
