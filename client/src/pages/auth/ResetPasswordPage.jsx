import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Missing or invalid password reset token.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await authService.resetPassword(token, password, confirmPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Password reset failed. Token may be expired.');
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
          Create New Password
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter your new password below to regain account access.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-[#171717] py-8 px-6 sm:px-10 shadow-2xl border border-white/10 rounded-2xl">
          {success ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-100">
                Password Successfully Reset
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Your password has been securely updated. You can now log in.
              </p>
              <div className="mt-6">
                <Button variant="crimson" size="md" className="w-full" onClick={() => navigate('/login')}>
                  Proceed to Sign In
                </Button>
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
                label="New Password"
                type="password"
                icon={Lock}
                placeholder="At least 8 characters..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />

              <Input
                label="Confirm New Password"
                type="password"
                icon={Lock}
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''}
                required
              />

              <Button
                type="submit"
                variant="crimson"
                size="md"
                className="w-full"
                loading={loading}
                disabled={!passwordsMatch || password.length < 8}
              >
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
