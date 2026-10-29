import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export function QuickTaskModal({ isOpen, onClose, onTaskCreated }) {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Todo');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      projectService
        .getProjects({ limit: 100 })
        .then((res) => {
          const list = res?.data || [];
          setProjects(list);
          if (list.length > 0 && !projectId) {
            setProjectId(list[0]._id);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    try {
      setLoading(true);
      setError('');
      const res = await taskService.createTask({
        title: title.trim(),
        description: description.trim(),
        project: projectId,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null
      });

      setTitle('');
      setDescription('');
      setDueDate('');
      onClose();
      if (onTaskCreated) onTaskCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description="Quickly capture and assign work to keep momentum moving."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs rounded-xl bg-[#A31C1B]/20 text-rose-300 border border-[#A31C1B]/50">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Project
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="w-full text-sm rounded-xl bg-[#06110C] border border-white/10 px-3.5 py-2 text-white focus:outline-none focus:border-[#A31C1B] focus:ring-2 focus:ring-[#A31C1B]/25"
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title} ({p.key})
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Task Title"
          placeholder="e.g. Implement authentication middleware"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Add relevant acceptance criteria or notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm rounded-xl bg-[#06110C] border border-white/10 p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#A31C1B] focus:ring-2 focus:ring-[#A31C1B]/25"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full text-sm rounded-xl bg-[#06110C] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#A31C1B] focus:ring-2 focus:ring-[#A31C1B]/25"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-sm rounded-xl bg-[#06110C] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#A31C1B] focus:ring-2 focus:ring-[#A31C1B]/25"
            >
              <option value="Backlog">Backlog</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm rounded-xl bg-[#06110C] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-[#A31C1B] focus:ring-2 focus:ring-[#A31C1B]/25"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
          <Button variant="charcoal" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="crimson"
            size="sm"
            loading={loading}
            disabled={!title.trim() || !projectId}
            className="shadow-glow-crimson"
          >
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
