import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Tag,
  Paperclip,
  MessageSquare,
  CheckSquare,
  Trash2,
  Send,
  AlertCircle,
  Download,
  Upload
} from 'lucide-react';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Spinner } from '../common/Spinner';

export function TaskDetailModal({ taskId, isOpen, onClose, onTaskUpdated, onTaskDeleted }) {
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (!taskId || !isOpen) return;

    async function loadTask() {
      try {
        setLoading(true);
        const res = await taskService.getTask(taskId);
        const taskData = res.data;
        setTask(taskData);

        if (taskData?.project?._id || taskData?.project) {
          const projId = taskData.project._id || taskData.project;
          const memRes = await projectService.getMembers(projId);
          setMembers(memRes?.data || []);
        }
      } catch (err) {
        console.error('Failed to load task details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [taskId, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = async (field, value) => {
    if (!task) return;
    const updated = { ...task, [field]: value };
    setTask(updated);

    try {
      setSaving(true);
      const res = await taskService.updateTask(task._id, { [field]: value });
      if (onTaskUpdated) onTaskUpdated(res.data);
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !task) return;

    try {
      setSubmittingComment(true);
      const res = await taskService.addComment(task._id, newComment.trim());
      setTask((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), res.data]
      }));
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleToggleChecklist = async (itemId) => {
    try {
      const res = await taskService.toggleChecklistItem(task._id, itemId);
      setTask((prev) => ({ ...prev, checklist: res.data }));
      if (onTaskUpdated) onTaskUpdated({ ...task, checklist: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddChecklistItem = async (e) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    try {
      const res = await taskService.addChecklistItem(task._id, newChecklistText.trim());
      setTask((prev) => ({ ...prev, checklist: res.data }));
      setNewChecklistText('');
      if (onTaskUpdated) onTaskUpdated({ ...task, checklist: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveChecklistItem = async (itemId) => {
    try {
      const res = await taskService.removeChecklistItem(task._id, itemId);
      setTask((prev) => ({ ...prev, checklist: res.data }));
      if (onTaskUpdated) onTaskUpdated({ ...task, checklist: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !task) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', task.project?._id || task.project);
    formData.append('taskId', task._id);

    try {
      setUploadingFile(true);
      const res = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTask((prev) => ({
        ...prev,
        attachments: [res.data.data, ...(prev.attachments || [])]
      }));
    } catch (err) {
      alert(err.response?.data?.error?.message || 'File upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm(`Are you sure you want to delete task ${task.key}? This action cannot be undone.`)) {
      return;
    }
    try {
      await taskService.deleteTask(task._id);
      onClose();
      if (onTaskDeleted) onTaskDeleted(task._id);
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#06110C]/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-left">
        <div className="relative w-full max-w-4xl rounded-2xl bg-[#171717] shadow-2xl border border-white/10 border-t-2 border-t-[#A31C1B] overflow-hidden flex flex-col max-h-[90vh]">
          {loading ? (
            <div className="py-24 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : !task ? (
            <div className="p-8 text-center text-xs text-slate-400">Task details unavailable.</div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111111]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-rose-300 px-2 py-0.5 rounded bg-[#A31C1B]/20 border border-[#A31C1B]/40">
                    {task.key}
                  </span>
                  <span className="text-xs text-slate-400">
                    in project <strong className="text-slate-200">{task.project?.title}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeleteTask}
                    className="p-1.5 text-slate-400 hover:text-[#A31C1B] rounded-lg hover:bg-white/5 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Title, Description, Checklists, Attachments, Comments */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Task Title Editable */}
                  <div>
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => setTask({ ...task, title: e.target.value })}
                      onBlur={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full text-lg font-bold text-slate-100 bg-transparent border-0 border-b border-transparent hover:border-white/20 focus:border-[#A31C1B] focus:outline-none transition-colors pb-1"
                    />
                  </div>

                  {/* Task Description Editable */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Add detailed task instructions, notes, or links..."
                      value={task.description || ''}
                      onChange={(e) => setTask({ ...task, description: e.target.value })}
                      onBlur={(e) => handleFieldChange('description', e.target.value)}
                      className="w-full text-xs rounded-xl bg-[#06110C] border border-white/10 p-3 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#A31C1B] focus:border-[#A31C1B]"
                    />
                  </div>

                  {/* Checklist Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-[#A31C1B]" />
                        <span>Checklist</span>
                      </h4>
                      {task.checklist?.length > 0 && (
                        <span className="text-[10px] text-slate-400">
                          {task.checklist.filter((i) => i.completed).length}/{task.checklist.length} completed
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 mb-3">
                      {task.checklist?.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#06110C] border border-white/10 text-xs"
                        >
                          <label className="flex items-center gap-2 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => handleToggleChecklist(item._id)}
                              className="rounded text-[#A31C1B] accent-[#A31C1B] focus:ring-[#A31C1B]"
                            />
                            <span
                              className={`${
                                item.completed ? 'line-through text-slate-500' : 'text-slate-200'
                              }`}
                            >
                              {item.text}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveChecklistItem(item._id)}
                            className="text-slate-500 hover:text-[#A31C1B] p-1 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddChecklistItem} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add checklist item..."
                        value={newChecklistText}
                        onChange={(e) => setNewChecklistText(e.target.value)}
                        className="flex-1 text-xs rounded-lg bg-[#06110C] border border-white/10 px-3 py-1.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#A31C1B]"
                      />
                      <Button type="submit" size="xs" variant="crimson" disabled={!newChecklistText.trim()}>
                        Add
                      </Button>
                    </form>
                  </div>

                  {/* Attachments Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <Paperclip className="w-4 h-4 text-[#A31C1B]" />
                        <span>Attachments</span>
                      </h4>
                      <label className="cursor-pointer text-xs font-medium text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingFile ? 'Uploading...' : 'Upload File'}</span>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          disabled={uploadingFile}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {task.attachments?.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No files attached yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {task.attachments?.map((att) => (
                          <div
                            key={att._id}
                            className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-[#06110C] text-xs"
                          >
                            <div className="truncate mr-2">
                              <div className="font-semibold text-slate-200 truncate">
                                {att.originalName}
                              </div>
                              <span className="text-[10px] text-slate-500">
                                {(att.fileSize / 1024).toFixed(1)} KB
                              </span>
                            </div>
                            <a
                              href={`/api/v1/files/${att._id}/download`}
                              download={att.originalName}
                              className="p-1.5 text-slate-400 hover:text-rose-300 rounded-lg hover:bg-white/5 transition-colors"
                              title="Download attachment"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Comments Feed */}
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-xs font-bold text-slate-100 mb-3 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-[#A31C1B]" />
                      <span>Comments & Activity</span>
                    </h4>

                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {task.comments?.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No comments yet. Start the conversation!</p>
                      ) : (
                        task.comments?.map((c) => (
                          <div key={c._id} className="flex items-start gap-2.5 text-xs">
                            <Avatar user={c.author} size="sm" />
                            <div className="flex-1 bg-[#06110C] p-3 rounded-xl border border-white/10">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-slate-100">
                                  {c.author?.name}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {new Date(c.createdAt).toLocaleDateString([], {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {c.content}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 text-xs rounded-xl bg-[#06110C] border border-white/10 px-3.5 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#A31C1B]"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant="crimson"
                        icon={Send}
                        loading={submittingComment}
                        disabled={!newComment.trim()}
                      >
                        Send
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Right 1 Col: Status, Priority, Assignee, Dates, Sprints Meta */}
                <div className="space-y-4 bg-[#111111] p-4 rounded-xl border border-white/10 text-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Attributes
                  </div>

                  {/* Status Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      value={task.status}
                      onChange={(e) => handleFieldChange('status', e.target.value)}
                      className="w-full text-xs rounded-lg bg-[#171717] border border-white/10 px-2.5 py-1.5 text-slate-100 focus:ring-1 focus:ring-[#A31C1B]"
                    >
                      <option value="Backlog" className="bg-[#171717]">Backlog</option>
                      <option value="Todo" className="bg-[#171717]">Todo</option>
                      <option value="In Progress" className="bg-[#171717]">In Progress</option>
                      <option value="In Review" className="bg-[#171717]">In Review</option>
                      <option value="Done" className="bg-[#171717]">Done</option>
                    </select>
                  </div>

                  {/* Priority Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={task.priority}
                      onChange={(e) => handleFieldChange('priority', e.target.value)}
                      className="w-full text-xs rounded-lg bg-[#171717] border border-white/10 px-2.5 py-1.5 text-slate-100 focus:ring-1 focus:ring-[#A31C1B]"
                    >
                      <option value="Low" className="bg-[#171717]">Low</option>
                      <option value="Medium" className="bg-[#171717]">Medium</option>
                      <option value="High" className="bg-[#171717]">High</option>
                      <option value="Urgent" className="bg-[#171717]">Urgent</option>
                    </select>
                  </div>

                  {/* Assignee Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Assignee
                    </label>
                    <select
                      value={task.assignee?._id || task.assignee || ''}
                      onChange={(e) => handleFieldChange('assignee', e.target.value || null)}
                      className="w-full text-xs rounded-lg bg-[#171717] border border-white/10 px-2.5 py-1.5 text-slate-100 focus:ring-1 focus:ring-[#A31C1B]"
                    >
                      <option value="" className="bg-[#171717]">Unassigned</option>
                      {members.map((m) => (
                        <option key={m.user?._id || m.id} value={m.user?._id || m.id} className="bg-[#171717]">
                          {m.user?.name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) =>
                        handleFieldChange(
                          'dueDate',
                          e.target.value ? new Date(e.target.value).toISOString() : null
                        )
                      }
                      className="w-full text-xs rounded-lg bg-[#171717] border border-white/10 px-2.5 py-1.5 text-slate-100 focus:ring-1 focus:ring-[#A31C1B]"
                    />
                  </div>

                  {/* Effort */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Estimated Effort (Hours)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={task.estimatedEffort || 0}
                      onChange={(e) => handleFieldChange('estimatedEffort', parseFloat(e.target.value) || 0)}
                      className="w-full text-xs rounded-lg bg-[#171717] border border-white/10 px-2.5 py-1.5 text-slate-100 focus:ring-1 focus:ring-[#A31C1B]"
                    />
                  </div>

                  {/* Creator and Metadata */}
                  <div className="pt-3 border-t border-white/10 space-y-1.5 text-[11px] text-slate-400">
                    <div>
                      Created by <strong className="text-slate-200">{task.creator?.name}</strong>
                    </div>
                    <div>
                      Created {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                    {task.completedAt && (
                      <div className="text-emerald-400">
                        Completed {new Date(task.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
