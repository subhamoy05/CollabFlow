import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Zap,
  MessageSquare,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Users,
  Check,
  Layers,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const features = [
    {
      icon: FolderKanban,
      title: 'Real-Time Kanban Boards',
      description: 'Move cards with fluid drag-and-drop. Column changes instantly sync to your team over WebSockets.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Role-based permissions (Admin, PM, Member, Viewer) with workspace and project-level isolation.'
    },
    {
      icon: MessageSquare,
      title: 'Project Chat & Presence',
      description: 'Contextual project discussions with live typing indicators, replies, and online status.'
    },
    {
      icon: CheckCircle2,
      title: 'Task Assignments & Checklists',
      description: 'Granular subtasks, priority weights, estimated effort, and checklist completion tracking.'
    },
    {
      icon: Clock,
      title: 'Deadline & Overdue Alerts',
      description: 'Never miss a delivery date with proactive color-coded indicators and background reminders.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & CSV Export',
      description: 'Completion rate formulas, member workload breakdowns, and formula-injection-safe CSV reports.'
    },
    {
      icon: Bell,
      title: 'Instant In-App Notifications',
      description: 'Receive real-time alerts when assigned to tasks, mentioned in comments, or invited to projects.'
    },
    {
      icon: Zap,
      title: 'Agile Sprint Planning',
      description: 'Organize project milestones, define sprint objectives, and measure velocity with burndown stats.'
    }
  ];

  const steps = [
    { num: '01', title: 'Create your workspace', desc: 'Set up an organization for your company, department, or squad in seconds.' },
    { num: '02', title: 'Invite your team', desc: 'Add colleagues with cryptographically secure single-use invitation tokens.' },
    { num: '03', title: 'Organize projects & tasks', desc: 'Create projects, configure custom color keys, and prioritize your backlog.' },
    { num: '04', title: 'Collaborate in real time', desc: 'Drag tasks on Kanban boards and discuss implementations in project chat.' },
    { num: '05', title: 'Track results', desc: 'Monitor live completion rates, member workload, and export sanitized reports.' }
  ];

  const useCases = [
    {
      title: 'Software Engineering Teams',
      desc: 'Run 2-week sprints, link pull requests, assign bug tickets, and collaborate without context switching.',
      tags: ['Sprints', 'Kanban', 'Real-time Sync']
    },
    {
      title: 'Students & Academic Projects',
      desc: 'Coordinate capstone projects, track submission milestones, and divide workloads transparently.',
      tags: ['Deadlines', 'Checklists', 'Free Forever']
    },
    {
      title: 'Agencies & Small Businesses',
      desc: 'Deliver client initiatives on schedule with read-only Viewer links and comprehensive audit trails.',
      tags: ['RBAC', 'CSV Reports', 'Multi-tenant']
    }
  ];

  const faqs = [
    {
      q: 'How does real-time synchronization work in CollabFlow?',
      a: 'CollabFlow uses Socket.IO with server-managed project rooms. When a team member creates, moves, or updates a task, the changes are persisted to MongoDB and broadcasted only to authorized members in that project room.'
    },
    {
      q: 'What roles and permissions are supported?',
      a: 'We support four distinct roles: Global Admin (system-wide governance), Project Manager (project configuration and member management), Team Member (creating and updating tasks, comments, and chat), and Viewer (read-only audit and progress tracking).'
    },
    {
      q: 'Can I export tasks and analytics to Excel or Google Sheets?',
      a: 'Yes. CollabFlow provides a 1-click CSV export that implements strict formula injection sanitization to protect against spreadsheet formula execution exploits.'
    },
    {
      q: 'Is my team data secure?',
      a: 'All passwords use bcrypt hashing, cookies use HTTP-only SameSite protection, database queries prevent NoSQL injection, and API endpoints enforce strict authorization checks on every operation.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="CollabFlow" className="w-8 h-8 rounded-lg" />
            <span className="font-extrabold text-xl tracking-tight">
              Collab<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              How It Works
            </a>
            <a href="#solutions" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Solutions
            </a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              title="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {isAuthenticated ? (
              <Button onClick={() => navigate('/app/dashboard')}>
                Go to App <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3 py-2 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Sign in
                </Link>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Get started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CollabFlow 2.0 Real-Time Engine Active</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Great Teams Build Better Things <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">Together.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Plan projects, manage tasks, and collaborate in real time. Keep your entire team aligned from the first idea to the final delivery.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate(isAuthenticated ? '/app/dashboard' : '/register')}>
              Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <a href="#features">
              <Button size="lg" variant="secondary">
                Explore Features
              </Button>
            </a>
          </div>

          {/* Interactive Application-Style Preview */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-slate-900 p-2 sm:p-4 shadow-2xl border border-slate-800 text-left">
            <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-slate-300">CollabFlow Core / Board</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" /> Live Sync
                </span>
              </div>
            </div>

            {/* Kanban Preview Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3">
              {/* Column 1: Todo */}
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300">Todo</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">2</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 shadow-xs">
                    <span className="text-[10px] font-mono text-indigo-400">CF-14</span>
                    <div className="text-xs font-medium text-slate-200 mt-1">Design dark mode palette</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300">Medium</span>
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[9px]">JD</div>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 shadow-xs">
                    <span className="text-[10px] font-mono text-indigo-400">CF-15</span>
                    <div className="text-xs font-medium text-slate-200 mt-1">Audit log filter pagination</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">High</span>
                      <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[9px]">SC</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: In Progress */}
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300">In Progress</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">1</span>
                </div>
                <div className="bg-slate-900 border border-indigo-500/40 rounded-lg p-2.5 shadow-xs ring-1 ring-indigo-500/20">
                  <span className="text-[10px] font-mono text-indigo-400">CF-12</span>
                  <div className="text-xs font-medium text-slate-200 mt-1">Real-time WebSocket Kanban rooms</div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-indigo-500 h-1.5 rounded-full w-3/4"></div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300">Urgent</span>
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px]">AM</div>
                  </div>
                </div>
              </div>

              {/* Column 3: In Review */}
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300">In Review</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400">1</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 shadow-xs">
                  <span className="text-[10px] font-mono text-indigo-400">CF-11</span>
                  <div className="text-xs font-medium text-slate-200 mt-1">CSV Formula injection sanitizer</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">High</span>
                    <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[9px]">DK</div>
                  </div>
                </div>
              </div>

              {/* Column 4: Done */}
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300">Done</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-semibold">12</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 opacity-80">
                  <span className="text-[10px] font-mono text-emerald-400">CF-9</span>
                  <div className="text-xs font-medium text-slate-300 line-through mt-1">User auth & JWT cookies</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400">Done</span>
                    <div className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-[9px]">OV</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Complete Capabilities
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Everything Your Team Needs Under One Roof
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm">
              CollabFlow brings modern project boards, team chat, agile sprints, and productivity metrics together without bloat or paid API hurdles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400/40 transition-all shadow-subtle"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Streamlined Flow
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Five Simple Steps to High Velocity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle">
                <span className="text-2xl font-black text-indigo-500/40 dark:text-indigo-400/30 block mb-3 font-mono">
                  {st.num}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions / Use Cases */}
      <section id="solutions" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Tailored Solutions
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Designed for Teams of Every Scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {uc.desc}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {uc.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Feature Comparison
            </h2>
            <p className="text-xs text-slate-500 mt-2">Transparent architecture built for professional delivery.</p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-subtle">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4 font-bold text-slate-900 dark:text-slate-100">Core Capability</th>
                  <th className="p-4 font-bold text-indigo-600 dark:text-indigo-400">CollabFlow</th>
                  <th className="p-4 font-bold text-slate-500">Legacy Boards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-4 font-medium">Real-Time Socket Room Sync</td>
                  <td className="p-4 text-emerald-600 font-semibold"><Check className="w-4 h-4" /></td>
                  <td className="p-4 text-slate-400">Manual Refresh</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Role-Based Access Control (4 Tier)</td>
                  <td className="p-4 text-emerald-600 font-semibold"><Check className="w-4 h-4" /></td>
                  <td className="p-4 text-slate-400">Paid Add-on</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Built-in Project Chat & Presence</td>
                  <td className="p-4 text-emerald-600 font-semibold"><Check className="w-4 h-4" /></td>
                  <td className="p-4 text-slate-400">Separate App</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Formula-Safe CSV Export</td>
                  <td className="p-4 text-emerald-600 font-semibold"><Check className="w-4 h-4" /></td>
                  <td className="p-4 text-slate-400">Vulnerable</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Agile Sprints & Burndown Rate</td>
                  <td className="p-4 text-emerald-600 font-semibold"><Check className="w-4 h-4" /></td>
                  <td className="p-4 text-slate-400">Enterprise Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              Questions & Answers
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-slate-950 to-indigo-950 text-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Accelerate Your Team's Flow?
          </h2>
          <p className="mt-4 text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Join thousands of productive engineers, managers, and creators planning, collaborating, and tracking in real time.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" onClick={() => navigate(isAuthenticated ? '/app/dashboard' : '/register')}>
              Get Started with CollabFlow
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="CollabFlow" className="w-5 h-5 rounded" />
            <span className="font-bold text-white">CollabFlow</span>
            <span className="text-slate-600">| Plan. Collaborate. Track. Complete.</span>
          </div>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#solutions" className="hover:text-white">Solutions</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <Link to="/login" className="hover:text-white">Sign In</Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} CollabFlow Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
