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
  Workflow,
  Code2,
  Flame,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';
import { GlassCard } from '../components/common/GlassCard';
import { AmbientBlobs, CursorSpotlight, ParticleNetwork } from '../components/common/BackgroundEffects';
import { BlurTextReveal, Typewriter } from '../components/common/HeroEffects';
import { Tilt3D, Magnetic, TechMarquee } from '../components/common/InteractiveEffects';
import {
  ScrollProgressBar,
  ScrollToTopButton,
  ScrollReveal,
  CountUp,
  SkillBar,
  useActiveSection
} from '../components/common/ScrollEffects';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeConsoleTab, setActiveConsoleTab] = useState('kanban');
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active section tracking for sticky nav scrollspy
  const activeSection = useActiveSection(
    ['hero', 'console', 'architecture', 'workflow', 'skills', 'comparison', 'faq'],
    140
  );

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const navLinks = [
    { id: 'console', label: 'Live Console' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'skills', label: 'Capabilities' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'faq', label: 'Security & FAQ' }
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

  const capabilitySkills = [
    {
      label: 'Room-Partitioned WebSocket Broadcasts',
      percentage: 99,
      badge: '< 12ms Latency',
      color: 'from-[#A31C1B] via-rose-500 to-amber-500'
    },
    {
      label: 'High-Concurrency Kanban Drag & Reorder',
      percentage: 96,
      badge: 'Zero-Lag State',
      color: 'from-[#A31C1B] to-rose-600'
    },
    {
      label: 'Cryptographic 4-Tier RBAC Guard',
      percentage: 100,
      badge: 'Hardened Boundary',
      color: 'from-amber-600 to-[#A31C1B]'
    },
    {
      label: 'Sprint Velocity & Burndown Modeling',
      percentage: 92,
      badge: 'Agile Engine',
      color: 'from-rose-500 to-indigo-600'
    },
    {
      label: 'Anti-Formula CSV Injection Sanitizer',
      percentage: 100,
      badge: 'Security Certified',
      color: 'from-emerald-500 to-[#A31C1B]'
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
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#06110C] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-[#A31C1B] selection:text-white overflow-x-hidden transition-colors duration-300">
      {/* 1. SCROLL EFFECT: Top Real-time Multi-stop Gradient Progress Bar */}
      <ScrollProgressBar height={3.5} />

      {/* 2. BACKGROUND EFFECTS:
          - Three blurred colour blobs that drift and shift as you scroll
          - Cursor spotlight following mouse
          - Interactive particle network linking nearby dots and cursor */}
      <AmbientBlobs />
      <CursorSpotlight radius={650} color={isDark ? 'rgba(163, 28, 27, 0.12)' : 'rgba(163, 28, 27, 0.08)'} />
      <ParticleNetwork particleCount={48} connectDistance={115} />

      {/* FLOATING MODERN NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 px-4 sm:px-8 py-3.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto rounded-2xl bg-white/75 dark:bg-[#171717]/85 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-xl px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo with 3D tilt & magnetic feel */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => navigate('/')}
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#A31C1B] to-[#5E1817] flex items-center justify-center p-1.5 shadow-md shadow-[#A31C1B]/30 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-200">
              <div className="w-full h-full rounded-lg border border-white/30 flex items-center justify-center">
                <Workflow className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                Collab<span className="text-[#A31C1B]">Flow</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Obsidian Engine
              </span>
            </div>
          </div>

          {/* SCROLL EFFECTS: Center Nav with Dynamic Section Highlighting */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold tracking-wide uppercase">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`relative px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-[#A31C1B] dark:text-rose-400 font-bold bg-[#A31C1B]/10 dark:bg-white/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#A31C1B] shadow-[0_0_8px_#A31C1B]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Hub: Theme ◐ Toggle & Auth CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* THEME TOGGLE: designated ◐ button switching dark and light */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode (◐)' : 'Switch to dark mode (◐)'}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base leading-none transition-all duration-300 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#171717] text-slate-800 dark:text-slate-200 hover:border-[#A31C1B]/60 hover:text-[#A31C1B] hover:scale-105 active:scale-95 shadow-sm"
            >
              <span className="transition-transform duration-500 inline-block hover:rotate-180 select-none">
                ◐
              </span>
            </button>

            {isAuthenticated ? (
              <Magnetic strength={0.3}>
                <Button
                  variant="crimson"
                  size="sm"
                  onClick={() => navigate('/app/dashboard')}
                  className="shadow-glow-crimson"
                >
                  Go to App <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Magnetic>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-block text-xs font-semibold px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Magnetic strength={0.3}>
                  <Button
                    variant="crimson"
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="shadow-glow-crimson"
                  >
                    Launch Free
                  </Button>
                </Magnetic>
              </>
            )}

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 max-w-7xl mx-auto p-4 rounded-2xl bg-white/95 dark:bg-[#171717]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl animate-scale-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activeSection === link.id
                      ? 'bg-[#A31C1B]/15 text-[#A31C1B] font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-slate-200 dark:border-white/10 pt-3 mt-1 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl text-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5"
                >
                  Sign in
                </Link>
                <Button
                  variant="crimson"
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="w-full text-xs font-bold"
                >
                  Launch Free
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative z-10">
        {/* HERO SECTION */}
        <section id="hero" className="pt-8 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Telemetry Status Pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#171717] border border-slate-200 dark:border-[#A31C1B]/40 text-xs font-mono font-medium shadow-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A31C1B] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A31C1B]"></span>
                </span>
                <span className="text-slate-800 dark:text-slate-200">COLLABFLOW ENGINE ACTIVE</span>
                <span className="text-slate-300 dark:text-white/20">|</span>
                <span className="text-[#A31C1B] dark:text-rose-400 font-bold">12ms LATENCY</span>
              </div>

              {/* HERO EFFECT 1: Name/Title blurs in letter by letter */}
              <div className="space-y-1">
                <BlurTextReveal
                  text="ORCHESTRATE SQUADS."
                  tag="h1"
                  delay={40}
                  initialDelay={100}
                  className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] block"
                />
                <span className="block text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#A31C1B] via-rose-500 to-amber-500">
                  EXECUTE AT WARP SPEED.
                </span>
              </div>

              {/* HERO EFFECT 2: The roles type and delete on a loop */}
              <div className="flex items-center gap-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 py-1">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Architected for:</span>
                <Typewriter
                  words={[
                    'Real-Time Squad Orchestration',
                    'Sub-15ms WebSocket Kanban Sync',
                    'Cryptographic 4-Tier RBAC Guards',
                    'Agile Sprint Velocity & Burndown',
                    'Formula-Safe CSV Pipeline Defense'
                  ]}
                  typingSpeed={70}
                  deletingSpeed={35}
                  pauseTime={1600}
                  className="text-[#A31C1B] dark:text-rose-400 font-bold"
                />
              </div>

              {/* High-Impact Description */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                A hyper-responsive collaborative command platform. Uniting real-time Kanban room sync, sprint burndown velocity, and cryptographic RBAC isolation in a nocturnal obsidian workspace.
              </p>

              {/* INTERACTION EFFECT: Buttons pull toward cursor (Magnetic) */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Magnetic strength={0.25}>
                  <Button
                    variant="crimson"
                    size="lg"
                    magnetic={true}
                    onClick={() => navigate(isAuthenticated ? '/app/dashboard' : '/register')}
                    className="shadow-glow-crimson group text-sm font-bold px-7"
                  >
                    Deploy Free Workspace
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Magnetic>

                <Magnetic strength={0.2}>
                  <a href="#console">
                    <Button
                      variant="secondary"
                      size="lg"
                      magnetic={true}
                      className="w-full sm:w-auto text-sm font-semibold border-slate-200 dark:border-white/10 hover:border-[#A31C1B]/60"
                    >
                      Explore Live Console
                    </Button>
                  </a>
                </Magnetic>
              </div>

              {/* Micro telemetry badges */}
              <div className="pt-3 flex flex-wrap items-center gap-2.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-[#171717] border border-slate-200 dark:border-white/10 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A31C1B]" /> 4-Tier RBAC Guard
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-[#171717] border border-slate-200 dark:border-white/10 shadow-xs">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" /> Room-Partitioned Sockets
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-[#171717] border border-slate-200 dark:border-white/10 shadow-xs">
                  <Lock className="w-3.5 h-3.5 text-amber-500" /> Anti-Formula Injection
                </span>
              </div>
            </div>

            {/* Right Hero Column: GLASSMORPHISM & 3D ON HOVER Interactive Live Workspace Simulator */}
            <div className="lg:col-span-5" id="console">
              <Tilt3D maxTilt={10} scale={1.02} glare={true}>
                <GlassCard
                  lightEdge={true}
                  className="shadow-2xl shadow-[#A31C1B]/15 dark:shadow-[#A31C1B]/25 overflow-hidden"
                >
                  {/* Simulated Window Titlebar */}
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-100/90 dark:bg-[#111111]/90 border-b border-slate-200 dark:border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#A31C1B] inline-block shadow-xs" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-xs" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-xs" />
                      <span className="ml-2 font-mono text-[10px] text-slate-500 dark:text-slate-300">
                        CF-CORE // WAR-ROOM
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      SYNCED
                    </div>
                  </div>

                  {/* Simulated Console Switcher Tabs */}
                  <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#141414] text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setActiveConsoleTab('kanban')}
                      className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
                        activeConsoleTab === 'kanban'
                          ? 'bg-white dark:bg-[#171717] text-[#A31C1B] dark:text-white border-b-2 border-[#A31C1B] font-bold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <FolderKanban className="w-3.5 h-3.5 text-[#A31C1B]" /> Kanban Stream
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveConsoleTab('velocity')}
                      className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
                        activeConsoleTab === 'velocity'
                          ? 'bg-white dark:bg-[#171717] text-[#A31C1B] dark:text-white border-b-2 border-[#A31C1B] font-bold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Velocity Gauge
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveConsoleTab('squad')}
                      className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors ${
                        activeConsoleTab === 'squad'
                          ? 'bg-white dark:bg-[#171717] text-[#A31C1B] dark:text-white border-b-2 border-[#A31C1B] font-bold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-rose-500" /> Squad Radar
                    </button>
                  </div>

                  {/* Console Active Content View */}
                  <div className="p-4 min-h-[300px] flex flex-col justify-between">
                    {activeConsoleTab === 'kanban' && (
                      <div className="space-y-3 animate-fade-in text-left">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          <span>STAGE: IN PROGRESS [ACTIVE SPRINT]</span>
                          <span className="text-[#A31C1B] font-bold">BURNDOWN: 82%</span>
                        </div>

                        {/* Card 1 */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#06110C] border border-slate-200 dark:border-[#A31C1B]/40 hover:border-[#A31C1B] transition-all shadow-sm">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-mono text-[#A31C1B] font-bold">CF-108</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#A31C1B]/15 text-[#A31C1B] dark:text-rose-300 border border-[#A31C1B]/40">
                              URGENT
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">
                            WebSocket Room Migration & Zero-Cross Leak Test
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-[#171717] rounded-full h-1.5 mt-2.5 overflow-hidden">
                            <div className="bg-[#A31C1B] h-1.5 rounded-full w-4/5 animate-pulse" />
                          </div>
                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200 dark:border-white/10 text-[10px] text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <Clock className="w-3 h-3 text-[#A31C1B]" /> Today 5:00 PM
                            </span>
                            <span className="font-mono">Assigned: Alex R.</span>
                          </div>
                        </div>

                        {/* Card 2 */}
                        <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-[#06110C]/80 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">CF-109</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/40">
                              HIGH
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            CSV Sanitize Pipe: Strip = / + / @ Prefixes
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 dark:border-white/5 text-[10px] text-slate-500 dark:text-slate-400">
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Security Verified</span>
                            <span className="font-mono">Assigned: Sarah K.</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeConsoleTab === 'velocity' && (
                      <div className="space-y-4 animate-fade-in text-left">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          <span>SPRINT CYCLE: #04 (14 DAYS)</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">VELOCITY: 48 PTS</span>
                        </div>

                        <div className="h-32 w-full bg-slate-50 dark:bg-[#06110C] rounded-xl p-3 border border-slate-200 dark:border-white/10 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
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
                              stroke="#888888"
                              strokeWidth="1.5"
                              strokeDasharray="4"
                            />
                          </svg>
                          <div className="flex justify-between text-[9px] font-mono text-slate-400 dark:text-slate-500">
                            <span>Day 1</span>
                            <span>Day 7</span>
                            <span>Day 14</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#06110C] border border-slate-200 dark:border-white/10">
                            <span className="text-slate-500 dark:text-slate-400 text-[10px]">COMPLETION RATE</span>
                            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">88.0%</div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#06110C] border border-[#A31C1B]/40">
                            <span className="text-[#A31C1B] dark:text-rose-400 text-[10px]">AVG CYCLE TIME</span>
                            <div className="text-lg font-bold text-[#A31C1B] mt-0.5">1.8 Days</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeConsoleTab === 'squad' && (
                      <div className="space-y-3 animate-fade-in text-left">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          <span>CONNECTED SQUAD: 4 MEMBERS</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">ALL ROOMS SECURE</span>
                        </div>

                        <div className="space-y-2">
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#06110C] border border-slate-200 dark:border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="relative">
                                <div className="w-7 h-7 rounded-full bg-[#A31C1B] flex items-center justify-center font-bold text-xs text-white">
                                  AR
                                </div>
                                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-black" />
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">Alex Rivera</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">Project Lead • Editing Kanban Board</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Online</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#06110C] border border-slate-200 dark:border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="relative">
                                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                                  SK
                                </div>
                                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-black" />
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-slate-900 dark:text-white">Sarah Kovac</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">Backend Eng • Typing in Project Chat...</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-[#A31C1B] dark:text-rose-400 flex items-center gap-1 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#A31C1B] animate-pulse" /> Active
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50/80 dark:bg-[#06110C]/80 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <Radio className="w-4 h-4 text-[#A31C1B] animate-pulse" />
                          <span>Room Event Broadcast Latency: 11.4 ms</span>
                        </div>
                      </div>
                    )}

                    {/* Window Bottom Action */}
                    <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        WebSocket: wss://collabflow.io
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="text-[11px] font-bold text-[#A31C1B] hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
                      >
                        Connect Live Room <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </Tilt3D>
            </div>
          </div>
        </section>

        {/* INTERACTION EFFECT: TECH STACK MARQUEE THAT PAUSES ON HOVER */}
        <section className="py-6 border-y border-slate-200/90 dark:border-white/10 bg-white/40 dark:bg-[#121212]/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                // ENTERPRISE REAL-TIME TECHNOLOGY STACK
              </span>
            </div>
            <TechMarquee />
          </div>
        </section>

        {/* SCROLL EFFECT: STATS THAT COUNT UP */}
        <section className="border-b border-slate-200/90 dark:border-white/10 bg-slate-100/70 dark:bg-[#171717] py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            <ScrollReveal delay={50}>
              <div className="text-center sm:text-left sm:pl-4">
                <div className="text-3xl sm:text-5xl font-extrabold text-[#A31C1B] font-mono">
                  &lt; <CountUp end={12} duration={1600} suffix="ms" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                  WebSocket Sync
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Sub-frame room event broadcast
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="text-center sm:text-left sm:border-l sm:border-slate-200 dark:sm:border-white/10 sm:pl-6">
                <div className="text-3xl sm:text-5xl font-extrabold text-[#A31C1B] font-mono">
                  <CountUp end={99.99} decimals={2} duration={2000} suffix="%" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Uptime Reliability
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Continuous socket connectivity
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={180}>
              <div className="text-center sm:text-left sm:border-l sm:border-slate-200 dark:sm:border-white/10 sm:pl-6">
                <div className="text-3xl sm:text-5xl font-extrabold text-[#A31C1B] font-mono">
                  <CountUp end={4} duration={1400} suffix="-Tier" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Cryptographic RBAC
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Admin, PM, Member, Viewer
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="text-center sm:text-left sm:border-l sm:border-slate-200 dark:sm:border-white/10 sm:pl-6">
                <div className="text-3xl sm:text-5xl font-extrabold text-[#A31C1B] font-mono">
                  <CountUp end={100} duration={1800} suffix="%" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Injection Sanitized
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Strict CSV formula protection
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* SCROLL EFFECT: SECTIONS THAT FADE IN FROM BLUR & BENTO ARCHITECTURE */}
        <section id="architecture" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ScrollReveal blur={true} className="text-left mb-14">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#A31C1B]">
              // SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
              ENGINEERED FOR SUPREMACY.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              Every component is constructed with uncompromising performance, cryptographic boundary enforcement, and instant feedback.
            </p>
          </ScrollReveal>

          {/* Bento Grid with GlassCard + Cursor Shine */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bento Card 1: 2-column wide Room Socket Engine */}
            <ScrollReveal blur={true} className="md:col-span-2">
              <Tilt3D maxTilt={6}>
                <GlassCard className="p-7 h-full flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/15 text-[#A31C1B] border border-[#A31C1B]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Radio className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase text-[#A31C1B] font-bold">
                      Core Capability 01
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                      Room-Isolated Real-Time WebSocket Engine
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                      When cards are dragged across board columns, mutations are saved to MongoDB and dispatched solely to authenticated subscribers in that project’s room. Zero global broadcasts, zero socket crossover.
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-3 gap-3 text-center font-mono text-[11px]">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#06110C] border border-slate-200 dark:border-white/10">
                      <div className="text-slate-500 dark:text-slate-400 text-[10px]">PROTOCOL</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">WSS Socket.IO</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#06110C] border border-[#A31C1B]/40">
                      <div className="text-[#A31C1B] dark:text-rose-400 text-[10px]">SYNC SPEED</div>
                      <div className="font-bold text-[#A31C1B] mt-0.5">&lt; 15 ms</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#06110C] border border-slate-200 dark:border-white/10">
                      <div className="text-slate-500 dark:text-slate-400 text-[10px]">FALLBACK</div>
                      <div className="font-bold text-slate-900 dark:text-white mt-0.5">Auto Reconnect</div>
                    </div>
                  </div>
                </GlassCard>
              </Tilt3D>
            </ScrollReveal>

            {/* Bento Card 2: 1-column RBAC Fortress */}
            <ScrollReveal blur={true} delay={100}>
              <Tilt3D maxTilt={7}>
                <GlassCard className="p-7 h-full flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/15 text-[#A31C1B] border border-[#A31C1B]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase text-[#A31C1B] font-bold">
                      Core Capability 02
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                      Cryptographic 4-Tier RBAC
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Granular permissions for Administrators, Project Managers, Team Members, and Viewers. Strict authorization verified on every socket payload and REST endpoint.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span>Admin</span>
                      <span className="text-[#A31C1B] font-bold">Full Authority</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span>Project Manager</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">Sprint Control</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span>Team Member</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Card Execution</span>
                    </div>
                  </div>
                </GlassCard>
              </Tilt3D>
            </ScrollReveal>

            {/* Bento Card 3: 1-column Sanitized CSV Pipeline */}
            <ScrollReveal blur={true} delay={150}>
              <Tilt3D maxTilt={7}>
                <GlassCard className="p-7 h-full flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/15 text-[#A31C1B] border border-[#A31C1B]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase text-[#A31C1B] font-bold">
                      Core Capability 03
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                      Formula-Safe CSV Export
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Spreadsheet formula injection exploits are neutralized by escaping rogue formula trigger symbols before CSV serialization.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 p-3 rounded-xl bg-slate-50 dark:bg-[#06110C] font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">SAFE:</span> '=+SUM(1+1) escaped with leading single quote.
                  </div>
                </GlassCard>
              </Tilt3D>
            </ScrollReveal>

            {/* Bento Card 4: 2-column wide Agile Sprints & Velocity Diagnostics */}
            <ScrollReveal blur={true} delay={200} className="md:col-span-2">
              <Tilt3D maxTilt={6}>
                <GlassCard className="p-7 h-full flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#A31C1B]/15 text-[#A31C1B] border border-[#A31C1B]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase text-[#A31C1B] font-bold">
                      Core Capability 04
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                      Agile Sprint Planning & Burndown Velocity
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                      Define sprint objectives, link tasks to target iterations, and measure team velocity with live milestone completion ratios and overdue flags.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-2 text-xs font-mono">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#06110C] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold">
                      ✓ 2-Week Sprints
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#06110C] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold">
                      ✓ Story Points & Weights
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#06110C] border border-[#A31C1B]/40 text-[#A31C1B] dark:text-rose-300 font-semibold">
                      ✓ Automated Burndown Charts
                    </span>
                  </div>
                </GlassCard>
              </Tilt3D>
            </ScrollReveal>
          </div>
        </section>

        {/* WORKFLOW PIPELINE SECTION */}
        <section id="workflow" className="py-20 border-t border-slate-200/90 dark:border-white/10 bg-slate-100/60 dark:bg-[#0c1813] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal blur={true} className="text-left mb-14">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#A31C1B]">
                // OPERATIONAL RUNBOOK
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                FOUR STEPS TO AUTONOMOUS FLOW.
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {workflowSteps.map((step, idx) => (
                <ScrollReveal blur={true} key={idx} delay={idx * 80}>
                  <Tilt3D maxTilt={8}>
                    <GlassCard className="p-6 h-full flex flex-col justify-between group hover:-translate-y-1">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-mono font-extrabold text-[#A31C1B]">
                            {step.num}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#06110C] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold">
                            {step.badge}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </GlassCard>
                  </Tilt3D>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* SCROLL EFFECT: SKILL BARS THAT FILL ON VIEWPORT ENTER */}
        <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <ScrollReveal blur={true} className="lg:col-span-5 space-y-4 text-left">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#A31C1B]">
                // PERFORMANCE METRICS & BENCHMARKS
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                POWERED BY HIGH-CALIBER ENGINEERING.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Watch the engine bars synchronize as they enter your view. Every capability is optimized for mission-critical reliability and millisecond-level responsiveness.
              </p>
              <div className="pt-2">
                <Magnetic strength={0.3}>
                  <Button
                    variant="crimson"
                    size="md"
                    onClick={() => navigate('/register')}
                    className="shadow-glow-crimson font-bold text-xs"
                  >
                    Test Live Platform
                  </Button>
                </Magnetic>
              </div>
            </ScrollReveal>

            <div className="lg:col-span-7">
              <GlassCard className="p-6 sm:p-8 space-y-6">
                <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-white/10">
                  REAL-TIME SUBSYSTEM STATUS
                </div>
                {capabilitySkills.map((skill, idx) => (
                  <SkillBar
                    key={idx}
                    label={skill.label}
                    percentage={skill.percentage}
                    badge={skill.badge}
                    color={skill.color}
                  />
                ))}
              </GlassCard>
            </div>
          </div>
        </section>

        {/* SPLIT GRID: TECH COMPARISON & SECURITY FAQ */}
        <section id="comparison" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/90 dark:border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 6 cols: Tech Comparison Matrix */}
            <ScrollReveal blur={true} className="lg:col-span-6 space-y-6 text-left">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#A31C1B]">
                  // ARCHITECTURAL BENCHMARK
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                  WHY COLLABFLOW DOMINATES.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
                  No bloated third-party dependencies, no paid plugin walls, and no sluggish polling loops.
                </p>
              </div>

              <GlassCard className="overflow-hidden shadow-2xl p-0">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/90 dark:bg-[#111111] border-b border-slate-200 dark:border-white/10 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="p-4">PIPELINE CRITERIA</th>
                      <th className="p-4 text-[#A31C1B]">COLLABFLOW</th>
                      <th className="p-4 text-slate-400 dark:text-slate-500">LEGACY TOOLS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-white/10 font-mono text-xs">
                    <tr>
                      <td className="p-4 font-sans font-semibold text-slate-800 dark:text-slate-200">Real-time WebSocket Sync</td>
                      <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold">&lt; 15ms Native</td>
                      <td className="p-4 text-slate-400 dark:text-slate-500">Manual Refresh</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-sans font-semibold text-slate-800 dark:text-slate-200">4-Tier Role Governance</td>
                      <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold">Default Zero Cost</td>
                      <td className="p-4 text-slate-400 dark:text-slate-500">Enterprise Addon</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-sans font-semibold text-slate-800 dark:text-slate-200">Project War-Room Chat</td>
                      <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold">Built-In Context</td>
                      <td className="p-4 text-slate-400 dark:text-slate-500">Fragmented Slack</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-sans font-semibold text-slate-800 dark:text-slate-200">Formula Sanitized CSV</td>
                      <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold">100% Sanitized</td>
                      <td className="p-4 text-slate-400 dark:text-slate-500">Vulnerable</td>
                    </tr>
                  </tbody>
                </table>
              </GlassCard>
            </ScrollReveal>

            {/* Right 6 cols: Security & FAQ Accordion */}
            <ScrollReveal blur={true} delay={100} className="lg:col-span-6 space-y-6 text-left" id="faq">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#A31C1B]">
                  // PROTOCOL QUESTIONS
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                  SECURITY & FAQ.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Technical clarity on cryptographic data boundaries and operational governance.
                </p>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl backdrop-blur-xl border transition-all duration-200 overflow-hidden bg-white/70 dark:bg-[#171717]/80 ${
                      openFaq === idx
                        ? 'border-[#A31C1B] shadow-glow-crimson'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-3 ${
                          openFaq === idx ? 'rotate-180 text-[#A31C1B]' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-white/10 pt-3 animate-fade-in font-sans">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* HIGH-OCTANE OBSIDIAN / CRIMSON CALL TO ACTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Tilt3D maxTilt={4} scale={1.01}>
            <div className="relative rounded-3xl bg-gradient-to-br from-white/90 via-slate-50/80 to-white/90 dark:from-[#171717] dark:via-[#1c1c1c] dark:to-[#171717] border border-slate-200 dark:border-[#A31C1B]/40 p-8 sm:p-14 text-center overflow-hidden shadow-2xl shadow-[#A31C1B]/10 dark:shadow-[#A31C1B]/20">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#A31C1B]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <span className="inline-block px-3 py-1 rounded-full bg-[#A31C1B]/15 text-[#A31C1B] border border-[#A31C1B]/40 text-xs font-mono font-bold">
                  INSTANT ONBOARDING
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  READY TO EXPERIENCE TRUE REAL-TIME FLOW?
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Empower your engineers, managers, and stakeholders with lightning-fast synchronized project intelligence.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Magnetic strength={0.35}>
                    <Button
                      variant="crimson"
                      size="lg"
                      magnetic={true}
                      onClick={() => navigate(isAuthenticated ? '/app/dashboard' : '/register')}
                      className="shadow-glow-crimson px-8 text-sm font-bold"
                    >
                      Create Your Organization Now
                    </Button>
                  </Magnetic>
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Already have an account? Sign in →
                  </Link>
                </div>
              </div>
            </div>
          </Tilt3D>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-100 dark:bg-[#040b08] border-t border-slate-200/90 dark:border-white/10 py-10 px-4 sm:px-8 text-xs text-slate-500 dark:text-slate-400 relative z-10 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-[#A31C1B] flex items-center justify-center shadow-xs">
              <Workflow className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">CollabFlow</span>
            <span className="text-slate-400 dark:text-slate-500">| Obsidian Edition</span>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px]">
            <a href="#console" className="hover:text-slate-900 dark:hover:text-white transition-colors">Console</a>
            <a href="#architecture" className="hover:text-slate-900 dark:hover:text-white transition-colors">Architecture</a>
            <a href="#workflow" className="hover:text-slate-900 dark:hover:text-white transition-colors">Workflow</a>
            <a href="#skills" className="hover:text-slate-900 dark:hover:text-white transition-colors">Capabilities</a>
            <a href="#comparison" className="hover:text-slate-900 dark:hover:text-white transition-colors">Benchmark</a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">Security</a>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} CollabFlow Core. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Scroll to top button */}
      <ScrollToTopButton threshold={300} />
    </div>
  );
}
