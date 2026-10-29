import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError('');
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06110C] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#A31C1B]/15 blur-[120px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <img src="/logo.svg" alt="CollabFlow" className="w-10 h-10 rounded-xl" />
          <span className="font-extrabold text-2xl tracking-tight text-slate-100">
            Collab<span className="text-[#A31C1B]">Flow</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">
          Reset your password
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter your account email and we'll dispatch a secure recovery link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-[#171717] py-8 px-6 sm:px-10 shadow-2xl border border-white/10 rounded-2xl">
          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-100">
                Recovery Link Dispatched
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                If an account matches <strong className="text-slate-200">{email}</strong>, you will receive password reset instructions.
              </p>
              <div className="mt-6">
                <Link to="/login">
                  <Button variant="secondary" size="sm" className="w-full">
                    Return to sign in
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-[#A31C1B]/20 border border-[#A31C1B]/40 text-xs text-rose-300">
                  {error}
                </div>
              )}

              <Input
                label="Registered email"
                type="email"
                icon={Mail}
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />

              <Button type="submit" variant="crimson" size="md" className="w-full" loading={loading}>
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
