import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  CornerDownRight,
  Trash2,
  Edit2,
  Users,
  FolderKanban,
  Paperclip,
  Check,
  X
} from 'lucide-react';
import { chatService } from '../../services/chatService';
import { projectService } from '../../services/projectService';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';

export function ChatPage() {
  const { projectId: routeProjectId } = useParams();
  const { user } = useAuth();
  const { socket, joinProject, leaveProject, projectPresence } = useSocket();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(routeProjectId || '');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const [typingUsers, setTypingUsers] = useState(new Map()); // userId -> name
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Load user's projects
  useEffect(() => {
    async function loadProjects() {
      try {
        setLoadingProjects(true);
        const res = await projectService.getProjects({ limit: 50 });
        const list = res.data || [];
        setProjects(list);
        if (!selectedProjectId && list.length > 0) {
          setSelectedProjectId(list[0]._id);
        }
      } catch (err) {
        console.error('Failed to load projects for chat:', err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  // Sync selectedProjectId with route parameter
  useEffect(() => {
    if (routeProjectId && routeProjectId !== selectedProjectId) {
      setSelectedProjectId(routeProjectId);
    }
  }, [routeProjectId]);

  // Join project room and load message history
  useEffect(() => {
    if (!selectedProjectId) return;

    joinProject(selectedProjectId);

    async function loadHistory() {
      try {
        setLoading(true);
        const res = await chatService.getMessages(selectedProjectId, { limit: 100 });
        setMessages(res.data || []);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();

    return () => {
      leaveProject(selectedProjectId);
    };
  }, [selectedProjectId, joinProject, leaveProject]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // Real-time socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      if (msg.project === selectedProjectId || msg.project?._id === selectedProjectId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleEdited = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    };

    const handleDeleted = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, isDeleted: true, content: '[Message deleted]' } : m))
      );
    };

    const handleTyping = ({ projectId, user: typingUser, isTyping }) => {
      if (projectId !== selectedProjectId || typingUser.id === user?._id) return;

      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (isTyping) {
          next.set(typingUser.id, typingUser.name);
        } else {
          next.delete(typingUser.id);
        }
        return next;
      });
    };

    socket.on('chat:message', handleMessage);
    socket.on('chat:edited', handleEdited);
    socket.on('chat:deleted', handleDeleted);
    socket.on('chat:typing', handleTyping);

    return () => {
      socket.off('chat:message', handleMessage);
      socket.off('chat:edited', handleEdited);
      socket.off('chat:deleted', handleDeleted);
      socket.off('chat:typing', handleTyping);
    };
  }, [socket, selectedProjectId, user]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (socket && selectedProjectId) {
      socket.emit('chat:typing:start', { projectId: selectedProjectId });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('chat:typing:stop', { projectId: selectedProjectId });
      }, 1500);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedProjectId) return;

    const content = newMessage.trim();
    setNewMessage('');

    if (socket && selectedProjectId) {
      socket.emit('chat:typing:stop', { projectId: selectedProjectId });
    }

    try {
      await chatService.sendMessage(selectedProjectId, {
        content,
        replyTo: replyTo?._id || null
      });
      setReplyTo(null);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleSaveEdit = async (messageId) => {
    if (!editText.trim()) return;
    try {
      await chatService.editMessage(messageId, editText.trim());
      setEditingMessageId(null);
      setEditText('');
    } catch (err) {
      console.error('Failed to edit message:', err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await chatService.deleteMessage(messageId);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const selectedProject = projects.find((p) => p._id === selectedProjectId);
  const typingNames = Array.from(typingUsers.values());

  return (
    <div className="h-[calc(100vh-7rem)] flex rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-subtle">
      {/* Channels/Projects List (Left Sidebar) */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40">
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Project Channels
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingProjects ? (
            <div className="p-4 flex justify-center">
              <Spinner size="sm" />
            </div>
          ) : projects.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">No projects found.</div>
          ) : (
            projects.map((proj) => (
              <button
                key={proj._id}
                type="button"
                onClick={() => {
                  setSelectedProjectId(proj._id);
                  navigate(`/app/projects/${proj._id}/chat`);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                  selectedProjectId === proj._id
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: proj.color || '#6366F1' }}
                  />
                  <span className="truncate">{proj.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{proj.key}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Messages and Input Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
        {/* Chat Header */}
        <div className="h-14 border-b border-slate-200/80 dark:border-slate-800 px-5 flex items-center justify-between bg-slate-50/30 dark:bg-slate-950/20">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {selectedProject?.title || 'Select a Channel'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="outline"
              onClick={() => navigate(`/app/projects/${selectedProjectId}/board`)}
            >
              Open Board
            </Button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Spinner size="md" />
            </div>
          ) : messages.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-400">
              No messages in this channel yet. Say hello to kick off team collaboration!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
              const isEditing = editingMessageId === msg._id;

              return (
                <div
                  key={msg._id}
                  className={`group flex items-start gap-3 text-xs ${
                    msg.isDeleted ? 'opacity-60 italic' : ''
                  }`}
                >
                  <Avatar user={msg.sender} size="sm" />
                  <div className="flex-1 overflow-hidden">
                    {/* Sender & timestamp */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {msg.sender?.name || 'Teammate'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {msg.isEdited && (
                        <span className="text-[10px] text-slate-400 italic">(edited)</span>
                      )}
                    </div>

                    {/* Reply quote preview */}
                    {msg.replyTo && (
                      <div className="mb-1.5 pl-2 border-l-2 border-indigo-400 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 flex items-center gap-1">
                        <CornerDownRight className="w-3 h-3 text-indigo-400" />
                        <strong className="text-slate-700 dark:text-slate-300">
                          {msg.replyTo.sender?.name}:
                        </strong>{' '}
                        {msg.replyTo.content}
                      </div>
                    )}

                    {/* Content or Edit Form */}
                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                          className="flex-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-indigo-500 px-3 py-1.5 text-slate-900 dark:text-slate-100"
                        />
                        <button
                          onClick={() => handleSaveEdit(msg._id)}
                          className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingMessageId(null)}
                          className="p-1.5 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    )}
                  </div>

                  {/* Actions hover: Reply, Edit, Delete */}
                  {!msg.isDeleted && !isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        onClick={() => setReplyTo(msg)}
                        className="p-1 text-slate-400 hover:text-indigo-600"
                        title="Reply"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                      </button>
                      {isMe && (
                        <>
                          <button
                            onClick={() => {
                              setEditingMessageId(msg._id);
                              setEditText(msg.content);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {typingNames.length > 0 && (
            <div className="text-[11px] text-slate-400 italic flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping inline-block" />
              <span>
                {typingNames.join(', ')} {typingNames.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Form */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20">
          {/* Active Reply Banner */}
          {replyTo && (
            <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-lg mb-2 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <CornerDownRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span className="text-slate-500">Replying to</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {replyTo.sender?.name}:
                </strong>
                <span className="text-slate-600 dark:text-slate-400 truncate">
                  {replyTo.content}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Message #${selectedProject?.key || 'channel'}...`}
              value={newMessage}
              onChange={handleInputChange}
              className="flex-1 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              size="md"
              icon={Send}
              disabled={!newMessage.trim() || !selectedProjectId}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
