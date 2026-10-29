import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export function RegisterPage() {
  const { register } = useAuth();
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
    <div className="min-h-screen bg-[#06110C] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-[#A31C1B] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <img src="/logo.svg" alt="CollabFlow" className="w-10 h-10 rounded-xl shadow-md shadow-[#A31C1B]/20" />
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Collab<span className="text-[#A31C1B]">Flow</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Create your account
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Get started with free real-time Kanban boards and team collaboration.
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

              {/* Password strength meters */}
              {password && (
                <div className="mt-2.5 space-y-1.5 p-2.5 rounded-xl bg-[#06110C] border border-white/10 text-[11px]">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full ${
                          strengthScore >= step
                            ? step > 2
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <span className={hasLength ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                      {hasLength ? '✓' : '•'} 8+ characters
                    </span>
                    <span className={hasUpper ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                      {hasUpper ? '✓' : '•'} 1 Uppercase
                    </span>
                    <span className={hasLower ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                      {hasLower ? '✓' : '•'} 1 Lowercase
                    </span>
                    <span className={hasNumber ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                      {hasNumber ? '✓' : '•'} 1 Number
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm password"
              type="password"
              icon={Lock}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''}
              required
            />

            <Button
              type="submit"
              variant="crimson"
              size="md"
              className="w-full mt-2 shadow-glow-crimson"
              loading={loading}
              disabled={strengthScore < 4 || !passwordsMatch}
            >
              Create Account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-rose-400 hover:text-rose-300 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
