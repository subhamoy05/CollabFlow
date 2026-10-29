import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export function LoginPage() {
  const { login } = useAuth();
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
    <div className="min-h-screen bg-[#06110C] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-[#A31C1B] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <img src="/logo.svg" alt="CollabFlow" className="w-10 h-10 rounded-xl shadow-md shadow-[#A31C1B]/20" />
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Collab<span className="text-[#A31C1B]">Flow</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Welcome back! Access your workspaces, Kanban boards, and chats.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#171717] py-8 px-6 sm:px-10 shadow-2xl border border-white/10 rounded-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-[#A31C1B]/20 border border-[#A31C1B]/50 text-xs text-rose-300">
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
                <label htmlFor="login-password" className="text-xs font-semibold text-slate-200">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-rose-400 hover:text-rose-300 hover:underline"
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

            <Button type="submit" variant="crimson" size="md" className="w-full shadow-glow-crimson" loading={loading}>
              Sign In
            </Button>
          </form>

          {/* Quick Demo Logins for Fast Review */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3 font-mono">
              Quick Demo Logins
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin@collabflow.dev')}
                className="p-2 text-xs rounded-xl border border-white/10 bg-[#06110C] hover:border-[#A31C1B]/50 text-left font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#A31C1B]" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('alex.pm@collabflow.dev')}
                className="p-2 text-xs rounded-xl border border-white/10 bg-[#06110C] hover:border-[#A31C1B]/50 text-left font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Manager</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('sarah.dev@collabflow.dev')}
                className="p-2 text-xs rounded-xl border border-white/10 bg-[#06110C] hover:border-[#A31C1B]/50 text-left font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Developer</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('olivia.view@collabflow.dev')}
                className="p-2 text-xs rounded-xl border border-white/10 bg-[#06110C] hover:border-[#A31C1B]/50 text-left font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Viewer</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-rose-400 hover:text-rose-300 hover:underline"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
