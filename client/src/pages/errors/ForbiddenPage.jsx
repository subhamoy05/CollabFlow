import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">403</h1>
      <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">
        Access Denied
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 mb-6">
        You do not possess the required permissions or role to view this restricted resource.
      </p>
      <Button icon={ArrowLeft} onClick={() => navigate('/app/dashboard')}>
        Return to Safety
      </Button>
    </div>
  );
}
