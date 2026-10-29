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
  Bell,
  Sun,
  Moon,
  TrendingUp,
  Lock,
  MousePointer2,
  Radio,
  Cpu,
  ShieldAlert,
  FileSpreadsheet,
  Terminal,
  Activity,
  Workflow
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';
import { ScrollProgressBar, ScrollToTopButton, ScrollReveal } from '../components/common/ScrollEffects';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeConsoleTab, setActiveConsoleTab] = useState('kanban');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const metrics = [
    { value: '< 12ms', label: 'WebSocket Sync', desc: 'Sub-frame room event broadcast' },
    { value: '99.99%', label: 'Uptime Reliability', desc: 'Continuous socket connectivity' },
    { value: '4-Tier', label: 'Cryptographic RBAC', desc: 'Admin, PM, Member, Viewer' },
    { value: '100%', label: 'Injection Sanitized', desc: 'Strict CSV formula protection' }
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Initialize Workspace',
      desc: 'Deploy an isolated organization partition with tenant cryptographic separation in seconds.',
      badge: 'Organization'
    },
    {
      num: '02',
      title: 'Provision Member Tokens',
      desc: 'Issue single-use cryptographically signed invite tokens mapped to strict RBAC roles.',
      badge: 'Security'
    },
    {
      num: '03',
      title: 'Structure Kanban Streams',
      desc: 'Set custom sprint color keys, subtasks, priority weights, and burndown delivery quotas.',
      badge: 'Agile'
    },
    {
      num: '04',
      title: 'Real-Time Squad Sync',
      desc: 'Move cards with zero manual refreshes. Broadcast card changes to room participants instantly.',
      badge: 'Live Sync'
    }
  ];

  const faqs = [
    {
      q: 'How does CollabFlow guarantee real-time room isolation?',
      a: 'CollabFlow operates on WebSocket room-partitioning architecture. Sockets authenticate on handshake via JWT cookies and are strictly joined to verified project channels. State updates never leak into neighboring workspaces.'
    },
    {
      q: 'What role governance and permission tiers exist?',
      a: 'We provide four distinct enforcement levels: Global Administrator (system governance), Project Manager (sprint & member orchestration), Team Member (card execution, checklists & contextual chat), and Viewer (audit & progress tracking).'
    },
    {
      q: 'How is CSV formula injection prevented in exports?',
      a: 'All task exports parse spreadsheet string fields through a sanitization filter that intercepts characters such as =, +, -, and @ with leading single quotes, eliminating arbitrary command execution in Excel and Google Sheets.'
    },
    {
      q: 'Can CollabFlow handle large agile sprint cycles?',
      a: 'Yes. The sprint engine tracks milestone targets, velocity metrics, automated burndown computations, and priority-weighted workload distributions across active contributors.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#06110C] text-slate-100 flex flex-col font-sans selection:bg-[#A31C1B] selection:text-white overflow-x-hidden">
      {/* Top Real-time Scroll Progress Bar */}
      <ScrollProgressBar height={3} />

      {/* Ambient background glow orbs (#A31C1B crimson and #171717 deep hues) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#A31C1B]/12 blur-[130px] animate-pulse-slow" />
        <div className="absolute top-[35%] -right-40 w-[650px] h-[650px] rounded-full bg-[#A31C1B]/10 blur-[150px] animate-float" />
        <div className="absolute bottom-[10%] left-[25%] w-[550px] h-[550px] rounded-full bg-[#171717]/80 blur-[120px] animate-float-delayed" />
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      {/* Floating Modern Header */}
      <header className="sticky top-0 z-50 px-4 sm:px-8 py-3.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto rounded-2xl bg-[#171717]/90 backdrop-blur-xl border border-white/10 shadow-2xl px-5 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#A31C1B] to-[#5E1817] flex items-center justify-center p-1.5 shadow-md shadow-[#A31C1B]/30 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full rounded-lg border border-white/30 flex items-center justify-center">
                <Workflow className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white leading-none">
                Collab<span className="text-[#A31C1B]">Flow</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono mt-0.5">
                Obsidian Engine
              </span>
            </div>
          </div>

          {/* Center Navigation Anchors */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide uppercase text-slate-300">
            <a href="#console" className="hover:text-white hover:text-[#A31C1B] transition-colors py-1">
              Live Console
            </a>
            <a href="#architecture" className="hover:text-white hover:text-[#A31C1B] transition-colors py-1">
              Architecture
            </a>
            <a href="#workflow" className="hover:text-white hover:text-[#A31C1B] transition-colors py-1">
              Workflow
            </a>
            <a href="#comparison" className="hover:text-white hover:text-[#A31C1B] transition-colors py-1">
              Comparison
            </a>
            <a href="#faq" className="hover:text-white hover:text-[#A31C1B] transition-colors py-1">
              Security & FAQ
            </a>
          </nav>

          {/* Right Action Hub */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="crimson"
                size="sm"
                onClick={() => navigate('/app/dashboard')}
                className="shadow-glow-crimson"
              >
                Go to App <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Button
                  variant="crimson"
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="shadow-glow-crimson"
                >
                  Launch Free
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {/* HERO SECTION: Asymmetric Command Center Stage */}
        <section className="pt-10 sm:pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Column: Value Proposition & Trigger */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Telemetry Status Pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#171717] border border-[#A31C1B]/40 text-xs font-mono font-medium shadow-md shadow-[#A31C1B]/15">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A31C1B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A31C1B]"></span>
                </span>
                <span className="text-slate-200">COLLABFLOW ENGINE ACTIVE</span>
                <span className="text-white/20">|</span>
                <span className="text-rose-400 font-bold">12ms LATENCY</span>
              </div>

              {/* Bold Editorial Headline */}
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                ORCHESTRATE SQUADS.{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#A31C1B] via-rose-500 to-amber-500">
                  EXECUTE AT WARP SPEED.
                </span>
              </h1>

              {/* High-Impact Description */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                A hyper-responsive collaborative command platform. Uniting real-time Kanban room sync, sprint burndown velocity, and cryptographic RBAC isolation in a nocturnal obsidian workspace.
              </p>

              {/* Action Buttons Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Button
                  variant="crimson"
                  size="lg"
                  onClick={() => navigate(isAuthenticated ? '/app/dashboard' : '/register')}
                  className="shadow-glow-crimson group text-sm font-bold px-7"
                >
                  Deploy Free Workspace
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
                <a href="#console">
                  <Button
                    variant="charcoal"
                    size="lg"
                    className="w-full sm:w-auto text-sm font-semibold border-white/10 hover:border-[#A31C1B]/60"
                  >
                    Explore Live Console
                  </Button>
                </a>
              </div>

              {/* Telemetry Micro-Pills */}
              <div className="pt-4 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#171717] border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A31C1B]" /> 4-Tier RBAC Guard
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#171717] border border-white/10">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Room-Partitioned Sockets
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#171717] border border-white/10">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Anti-Formula Injection
                </span>
              </div>
            </div>

            {/* Right Hero Column: Interactive Live Workspace Simulator */}
            <div className="lg:col-span-5" id="console">
              <div className="rounded-2xl bg-[#171717] border border-[#A31C1B]/35 shadow-2xl shadow-[#A31C1B]/20 overflow-hidden">
                {/* Simulated Window Titlebar */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#111111] border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#A31C1B] inline-block shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm" />
                    <span className="ml-2 font-mono text-[10px] text-slate-300">CF-CORE // WAR-ROOM</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    SYNCED
                  </div>
                </div>

                {/* Simulated Console Switcher Tabs */}
                <div className="flex border-b border-white/10 bg-[#141414] text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveConsoleTab('kanban')}
                    className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
                      activeConsoleTab === 'kanban'
                        ? 'bg-[#171717] text-white border-b-2 border-[#A31C1B] font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FolderKanban className="w-3.5 h-3.5 text-[#A31C1B]" /> Kanban Stream
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveConsoleTab('velocity')}
                    className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
                      activeConsoleTab === 'velocity'
                        ? 'bg-[#171717] text-white border-b-2 border-[#A31C1B] font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Velocity Gauge
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveConsoleTab('squad')}
                    className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
                      activeConsoleTab === 'squad'
                        ? 'bg-[#171717] text-white border-b-2 border-[#A31C1B] font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 text-rose-400" /> Squad Radar
                  </button>
                </div>

                {/* Console Active Content View */}
                <div className="p-4 min-h-[300px] flex flex-col justify-between">
                  {activeConsoleTab === 'kanban' && (
                    <div className="space-y-3 animate-fade-in text-left">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>STAGE: IN PROGRESS [ACTIVE SPRINT]</span>
                        <span className="text-[#A31C1B]">BURNDOWN: 82%</span>
                      </div>

                      {/* Card 1 */}
                      <div className="p-3 rounded-xl bg-[#06110C] border border-[#A31C1B]/40 hover:border-[#A31C1B] transition-all shadow-md">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono text-[#A31C1B] font-bold">CF-108</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#A31C1B]/20 text-rose-300 border border-[#A31C1B]/50">
                            URGENT
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-white">
                          WebSocket Room Migration & Zero-Cross Leak Test
                        </div>
                        <div className="w-full bg-[#171717] rounded-full h-1.5 mt-2.5 overflow-hidden">
                          <div className="bg-[#A31C1B] h-1.5 rounded-full w-4/5 animate-pulse" />
                        </div>
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Clock className="w-3 h-3 text-[#A31C1B]" /> Today 5:00 PM
                          </span>
                          <span className="text-slate-300 font-mono">Assigned: Alex R.</span>
                        </div>
                      </div>

                      {/* Card 2 */}
                      <div className="p-3 rounded-xl bg-[#06110C]/80 border border-white/10 hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-slate-400">CF-109</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800/40">
                            HIGH
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-200">
                          CSV Sanitize Pipe: Strip = / + / @ Prefixes
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                          <span className="text-emerald-400">✓ Security Verified</span>
                          <span className="text-slate-400 font-mono">Assigned: Sarah K.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeConsoleTab === 'velocity' && (
                    <div className="space-y-4 animate-fade-in text-left">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>SPRINT CYCLE: #04 (14 DAYS)</span>
                        <span className="text-emerald-400">VELOCITY: 48 PTS</span>
                      </div>

                      {/* SVG Velocity Chart */}
                      <div className="h-32 w-full bg-[#06110C] rounded-xl p-3 border border-white/10 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>Target: 50 Pts</span>
                          <span className="text-[#A31C1B] font-bold">Current: 44 Pts</span>
                        </div>
                        <svg className="w-full h-16" viewBox="0 0 300 60" preserveAspectRatio="none">
                          <path
                            d="M 0 50 Q 50 45, 100 35 T 200 20 T 300 8"
                            fill="none"
                            stroke="#A31C1B"
                            strokeWidth="3"
                          />
                          <path
                            d="M 0 50 L 300 15"
                            fill="none"
                            stroke="#555555"
                            strokeWidth="1.5"
                            strokeDasharray="4"
                          />
                        </svg>
                        <div className="flex justify-between text-[9px] font-mono text-slate-500">
                          <span>Day 1</span>
                          <span>Day 7</span>
                          <span>Day 14</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-lg bg-[#06110C] border border-white/10">
                          <span className="text-slate-400 text-[10px]">COMPLETION RATE</span>
                          <div className="text-lg font-bold text-white mt-0.5">88.0%</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#06110C] border border-[#A31C1B]/40">
                          <span className="text-rose-400 text-[10px]">AVG CYCLE TIME</span>
                          <div className="text-lg font-bold text-[#A31C1B] mt-0.5">1.8 Days</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeConsoleTab === 'squad' && (
                    <div className="space-y-3 animate-fade-in text-left">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>CONNECTED SQUAD: 4 MEMBERS</span>
                        <span className="text-emerald-400">ALL ROOMS SECURE</span>
                      </div>

                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-[#06110C] border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <div className="w-7 h-7 rounded-full bg-[#A31C1B] flex items-center justify-center font-bold text-xs text-white">
                                AR
                              </div>
                              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-black" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-white">Alex Rivera</div>
                              <div className="text-[10px] text-slate-400">Project Lead • Editing Kanban Board</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">Online</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-[#06110C] border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                                SK
                              </div>
                              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-black" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-white">Sarah Kovac</div>
                              <div className="text-[10px] text-slate-400">Backend Eng • Typing in Project Chat...</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A31C1B] animate-pulse" /> Active
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#06110C]/80 border border-white/10 text-[11px] font-mono text-slate-400 flex items-center gap-2">
                        <Radio className="w-4 h-4 text-[#A31C1B] animate-pulse" />
                        <span>Room Event Broadcast Latency: 11.4 ms</span>
                      </div>
                    </div>
                  )}

                  {/* Window Bottom Action */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-slate-400">
                      WebSocket Protocol: wss://collabflow.io
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="text-[11px] font-bold text-[#A31C1B] hover:text-rose-400 flex items-center gap-1 transition-colors"
                    >
                      Connect Live Room <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: HIGH-VELOCITY METRIC TICKER */}
        <section className="border-y border-white/10 bg-[#171717] py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((m, idx) => (
              <div key={idx} className="text-center sm:text-left sm:border-l sm:border-white/10 sm:pl-6 first:border-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#A31C1B] font-mono">
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-1">
                  {m.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {m.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: BENTO GRID ARCHITECTURE (Repositioned Layout) */}
        <section id="architecture" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-left mb-14">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#A31C1B]">
              // SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
              ENGINEERED FOR SUPREMACY.
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Every component is constructed with uncompromising performance, cryptographic boundary enforcement, and instant feedback.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bento Card 1: 2-column wide Room Socket Engine */}
            <ScrollReveal className="md:col-span-2">
              <div className="rounded-2xl bg-[#171717] border border-white/10 hover:border-[#A31C1B]/50 p-7 h-full flex flex-col justify-between transition-all duration-300 shadow-xl group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/20 text-[#A31C1B] border border-[#A31C1B]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Radio className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono uppercase text-[#A31C1B] font-bold">
                    Core Capability 01
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                    Room-Isolated Real-Time WebSocket Engine
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                    When cards are dragged across board columns, mutations are saved to MongoDB and dispatched solely to authenticated subscribers in that project’s room. Zero global broadcasts, zero socket crossover.
                  </p>
                </div>

                {/* Micro Visual inside card */}
                <div className="mt-8 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center font-mono text-[11px]">
                  <div className="p-3 rounded-xl bg-[#06110C] border border-white/10">
                    <div className="text-slate-400 text-[10px]">PROTOCOL</div>
                    <div className="font-bold text-white mt-0.5">WSS Socket.IO</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#06110C] border border-[#A31C1B]/40">
                    <div className="text-rose-400 text-[10px]">SYNC SPEED</div>
                    <div className="font-bold text-[#A31C1B] mt-0.5">&lt; 15 ms</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#06110C] border border-white/10">
                    <div className="text-slate-400 text-[10px]">FALLBACK</div>
                    <div className="font-bold text-white mt-0.5">Auto Reconnect</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Bento Card 2: 1-column RBAC Fortress */}
            <ScrollReveal delay={100}>
              <div className="rounded-2xl bg-[#171717] border border-white/10 hover:border-[#A31C1B]/50 p-7 h-full flex flex-col justify-between transition-all duration-300 shadow-xl group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/20 text-[#A31C1B] border border-[#A31C1B]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono uppercase text-[#A31C1B] font-bold">
                    Core Capability 02
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                    Cryptographic 4-Tier RBAC
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Granular permissions for Administrators, Project Managers, Team Members, and Viewers. Strict authorization verified on every socket payload and REST endpoint.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Admin</span>
                    <span className="text-[#A31C1B] font-bold">Full Authority</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Project Manager</span>
                    <span className="text-amber-400">Sprint Control</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Team Member</span>
                    <span className="text-emerald-400">Card Execution</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Bento Card 3: 1-column Sanitized CSV Pipeline */}
            <ScrollReveal delay={150}>
              <div className="rounded-2xl bg-[#171717] border border-white/10 hover:border-[#A31C1B]/50 p-7 h-full flex flex-col justify-between transition-all duration-300 shadow-xl group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/20 text-[#A31C1B] border border-[#A31C1B]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono uppercase text-[#A31C1B] font-bold">
                    Core Capability 03
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                    Formula-Safe CSV Export
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Spreadsheet formula injection exploits are neutralized by escaping rogue formula trigger symbols before CSV serialization.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 p-3 rounded-xl bg-[#06110C] font-mono text-[11px] text-slate-400">
                  <span className="text-emerald-400">SAFE:</span> '=+SUM(1+1) escaped with leading single quote.
                </div>
              </div>
            </ScrollReveal>

            {/* Bento Card 4: 2-column wide Agile Sprints & Velocity Diagnostics */}
            <ScrollReveal delay={200} className="md:col-span-2">
              <div className="rounded-2xl bg-[#171717] border border-white/10 hover:border-[#A31C1B]/50 p-7 h-full flex flex-col justify-between transition-all duration-300 shadow-xl group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/20 text-[#A31C1B] border border-[#A31C1B]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono uppercase text-[#A31C1B] font-bold">
                    Core Capability 04
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                    Agile Sprint Planning & Burndown Velocity
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                    Define sprint objectives, link tasks to target iterations, and measure team velocity with live milestone completion ratios and overdue flags.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-3 py-1.5 rounded-lg bg-[#06110C] border border-white/10 text-slate-200">
                    ✓ 2-Week Sprints
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#06110C] border border-white/10 text-slate-200">
                    ✓ Story Points & Weights
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#06110C] border border-[#A31C1B]/40 text-rose-300">
                    ✓ Automated Burndown Charts
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* SECTION 4: WORKFLOW PIPELINE (Repositioned Horizontal Roadmap) */}
        <section id="workflow" className="py-20 border-t border-white/10 bg-[#0c1813] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-left mb-14">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#A31C1B]">
                // OPERATIONAL RUNBOOK
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight">
                FOUR STEPS TO AUTONOMOUS FLOW.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {workflowSteps.map((step, idx) => (
                <ScrollReveal key={idx} delay={idx * 80}>
                  <div className="rounded-2xl bg-[#171717] border border-white/10 hover:border-[#A31C1B]/50 p-6 h-full flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-mono font-extrabold text-[#A31C1B]">
                          {step.num}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#06110C] border border-white/10 text-slate-300">
                          {step.badge}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: SPLIT GRID - TECH COMPARISON & SECURITY FAQ */}
        <section id="comparison" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 6 cols: Tech Comparison Matrix */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#A31C1B]">
                  // ARCHITECTURAL BENCHMARK
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
                  WHY COLLABFLOW DOMINATES.
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  No bloated third-party dependencies, no paid plugin walls, and no sluggish polling loops.
                </p>
              </div>

              <div className="rounded-2xl bg-[#171717] border border-white/10 overflow-hidden shadow-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111111] border-b border-white/10 font-mono text-[11px] text-slate-400">
                    <tr>
                      <th className="p-4">PIPELINE CRITERIA</th>
                      <th className="p-4 text-[#A31C1B]">COLLABFLOW</th>
                      <th className="p-4 text-slate-500">LEGACY TOOLS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 font-mono text-xs">
                    <tr>
                      <td className="p-4 font-sans font-semibold text-slate-200">Real-time WebSocket Sync</td>
                      <td className="p-4 text-emerald-400 font-bold">&lt; 15ms Native</td>
                      <td className="p-4 text-slate-500">Manual Refresh</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-sans font-semibold text-slate-200">4-Tier Role Governance</td>
                      <td className="p-4 text-emerald-400 font-bold">Default Zero Cost</td>
                      <td className="p-4 text-slate-500">Enterprise Addon</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-sans font-semibold text-slate-200">Project War-Room Chat</td>
                      <td className="p-4 text-emerald-400 font-bold">Built-In Context</td>
                      <td className="p-4 text-slate-500">Fragmented Slack</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-sans font-semibold text-slate-200">Formula Sanitized CSV</td>
                      <td className="p-4 text-emerald-400 font-bold">100% Sanitized</td>
                      <td className="p-4 text-slate-500">Vulnerable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 6 cols: Security & FAQ Accordion */}
            <div className="lg:col-span-6 space-y-6 text-left" id="faq">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#A31C1B]">
                  // PROTOCOL QUESTIONS
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
                  SECURITY & FAQ.
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  Technical clarity on cryptographic data boundaries and operational governance.
                </p>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl bg-[#171717] border transition-all duration-200 overflow-hidden ${
                      openFaq === idx
                        ? 'border-[#A31C1B] shadow-glow-crimson'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-white focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-3 ${
                          openFaq === idx ? 'rotate-180 text-[#A31C1B]' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 sm:px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3 animate-fade-in font-sans">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: HIGH-OCTANE OBSIDIAN CRIMSON CALL TO ACTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl bg-[#171717] border border-[#A31C1B]/40 p-8 sm:p-14 text-center overflow-hidden shadow-2xl shadow-[#A31C1B]/20">
            {/* Background radiant ambient glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#A31C1B]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[#A31C1B]/20 text-[#A31C1B] border border-[#A31C1B]/40 text-xs font-mono font-bold">
                INSTANT ONBOARDING
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                READY TO EXPERIENCE TRUE REAL-TIME FLOW?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Empower your engineers, managers, and stakeholders with lightning-fast synchronized project intelligence.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="crimson"
                  size="lg"
                  onClick={() => navigate(isAuthenticated ? '/app/dashboard' : '/register')}
                  className="shadow-glow-crimson px-8 text-sm font-bold"
                >
                  Create Your Organization Now
                </Button>
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Already have an account? Sign in →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-[#040b08] border-t border-white/10 py-10 px-4 sm:px-8 text-xs text-slate-400 relative z-10 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-[#A31C1B] flex items-center justify-center">
              <Workflow className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">CollabFlow</span>
            <span className="text-slate-500">| Obsidian Edition</span>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px]">
            <a href="#console" className="hover:text-white transition-colors">Console</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#comparison" className="hover:text-white transition-colors">Benchmark</a>
            <a href="#faq" className="hover:text-white transition-colors">Security</a>
          </div>

          <div className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} CollabFlow Core. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Scroll to top button */}
      <ScrollToTopButton threshold={300} />
    </div>
  );
}
