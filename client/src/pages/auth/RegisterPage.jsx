import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Check, AlertCircle, ArrowRight, Workflow } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GlassCard } from '../../components/common/GlassCard';
import { AmbientBlobs, CursorSpotlight } from '../../components/common/BackgroundEffects';
import { Tilt3D, Magnetic } from '../../components/common/InteractiveEffects';

export function RegisterPage() {
  const { register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Password strength checks
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const strengthScore = [hasLength, hasUpper, hasLower, hasNumber].filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch || strengthScore < 4) {
      setError('Please ensure your password meets all requirements and matches.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register({ name, email, password, confirmPassword });
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
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
          Create your account
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Get started with free real-time Kanban boards and team collaboration.
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
                label="Full name"
                icon={User}
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />

              <Input
                label="Work email"
                type="email"
                icon={Mail}
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div>
                <Input
                  label="Password"
                  type="password"
                  icon={Lock}
                  placeholder="At least 8 characters..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {/* Password strength indicators */}
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 rounded-full transition-colors ${
                        strengthScore >= level
                          ? strengthScore === 4
                            ? 'bg-emerald-500'
                            : strengthScore >= 2
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                          : 'bg-slate-200 dark:bg-white/10'
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className={hasLength ? 'text-emerald-500' : ''}>• 8+ chars</span>
                  <span className={hasUpper ? 'text-emerald-500' : ''}>• Uppercase</span>
                  <span className={hasLower ? 'text-emerald-500' : ''}>• Lowercase</span>
                  <span className={hasNumber ? 'text-emerald-500' : ''}>• Number</span>
                </div>
              </div>

              <Input
                label="Confirm password"
                type="password"
                icon={Lock}
                placeholder="Repeat password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Magnetic strength={0.25} className="w-full">
                <Button
                  type="submit"
                  variant="crimson"
                  size="md"
                  magnetic={true}
                  className="w-full shadow-glow-crimson font-bold mt-2"
                  loading={loading}
                >
                  Create Account <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Magnetic>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/10 pt-5">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#A31C1B] dark:text-rose-400 hover:underline">
                Sign in →
              </Link>
            </div>
          </GlassCard>
        </Tilt3D>
      </div>
    </div>
  );
}
