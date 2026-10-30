import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Workflow } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GlassCard } from '../../components/common/GlassCard';
import { AmbientBlobs, CursorSpotlight } from '../../components/common/BackgroundEffects';
import { Tilt3D, Magnetic } from '../../components/common/InteractiveEffects';

export function LoginPage() {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/app/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      setError('');
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#06110C] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-100 selection:bg-[#A31C1B] selection:text-white transition-colors duration-300 overflow-hidden">
      {/* Background Ambience */}
      <AmbientBlobs />
      <CursorSpotlight radius={600} color={isDark ? 'rgba(163, 28, 27, 0.12)' : 'rgba(163, 28, 27, 0.08)'} />

      {/* Floating Theme ◐ Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode (◐)' : 'Switch to dark mode (◐)'}
          className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base leading-none transition-all duration-300 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#171717]/80 backdrop-blur-xl text-slate-700 dark:text-slate-200 hover:border-[#A31C1B]/50 hover:text-[#A31C1B] hover:scale-105 active:scale-95 shadow-md"
        >
          <span className="transition-transform duration-500 inline-block hover:rotate-180 select-none">
            ◐
          </span>
        </button>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A31C1B] to-[#5E1817] flex items-center justify-center shadow-lg shadow-[#A31C1B]/30 group-hover:scale-105 transition-transform duration-200">
            <Workflow className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            Collab<span className="text-[#A31C1B]">Flow</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Welcome back! Access your workspaces, Kanban boards, and chats.
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Tilt3D maxTilt={6} scale={1.01}>
          <GlassCard className="py-8 px-6 sm:px-10 shadow-2xl">
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-[#A31C1B]/15 border border-[#A31C1B]/40 text-xs text-[#A31C1B] dark:text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-[#A31C1B] dark:text-rose-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Magnetic strength={0.25} className="w-full">
                <Button
                  type="submit"
                  variant="crimson"
                  size="md"
                  magnetic={true}
                  className="w-full shadow-glow-crimson font-bold"
                  loading={loading}
                >
                  Sign In <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Magnetic>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                <span>Quick Demo Logins</span>
                <span className="text-[10px] text-[#A31C1B]">PASS: Password123!</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillDemo('admin@collabflow.io')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#A31C1B]/50 text-slate-700 dark:text-slate-300 text-left transition-all hover:scale-[1.02] flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A31C1B]" />
                  <span className="truncate">Admin Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('lead@collabflow.io')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#A31C1B]/50 text-slate-700 dark:text-slate-300 text-left transition-all hover:scale-[1.02] flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span className="truncate">PM Demo</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[#A31C1B] dark:text-rose-400 hover:underline">
                Create one now →
              </Link>
            </div>
          </GlassCard>
        </Tilt3D>
      </div>
    </div>
  );
}
