import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FolderKanban, CheckSquare, Users, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';

export function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], tasks: [], members: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], tasks: [], members: [] });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get('/search', { params: { q: query.trim() } });
        if (res.data?.data) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Clean up input on modal open/close
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults({ projects: [], tasks: [], members: [] });
    }
  }, [isOpen]);

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  const hasResults =
    results.projects.length > 0 || results.tasks.length > 0 || results.members.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl" showClose={false}>
      <div className="-mx-6 -my-5">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-[#A31C1B] mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search projects, tasks, or members (e.g. CF-1, Kanban, Sarah)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-[#06110C] text-slate-400 rounded border border-white/10">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-xs text-slate-400">Searching workspace...</div>
          )}

          {!loading && query.trim() && !hasResults && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching results found for "{query}".
            </div>
          )}

          {!loading && !query.trim() && (
            <div className="py-8 text-center text-xs text-slate-400">
              Type to search across authorized projects, tasks, and colleagues.
            </div>
          )}

          {/* Projects Results */}
          {results.projects.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Projects</span>
              </div>
              <div className="space-y-1">
                {results.projects.map((proj) => (
                  <div
                    key={proj._id}
                    onClick={() => handleSelect(`/app/projects/${proj._id}/board`)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs"
                        style={{ backgroundColor: proj.color || '#A31C1B' }}
                      >
                        {proj.key}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {proj.title}
                        </div>
                        <div className="text-[11px] text-slate-400">{proj.key}</div>
                      </div>
                    </div>
                    <Badge size="xs">{proj.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Results */}
          {results.tasks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Tasks</span>
              </div>
              <div className="space-y-1">
                {results.tasks.map((task) => (
                  <div
                    key={task._id}
                    onClick={() =>
                      handleSelect(`/app/projects/${task.project?._id || task.project}/board?task=${task._id}`)
                    }
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="font-mono text-xs font-semibold text-rose-400 flex-shrink-0">
                        {task.key}
                      </span>
                      <span className="text-xs text-slate-800 dark:text-slate-200 truncate">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge size="xs">{task.status}</Badge>
                      <Badge size="xs">{task.priority}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members Results */}
          {results.members.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <Users className="w-3.5 h-3.5" />
                <span>Team Members</span>
              </div>
              <div className="space-y-1">
                {results.members.map((mem) => (
                  <div
                    key={mem._id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar user={mem} size="sm" />
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {mem.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{mem.email}</div>
                      </div>
                    </div>
                    <Badge size="xs">{mem.role}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
