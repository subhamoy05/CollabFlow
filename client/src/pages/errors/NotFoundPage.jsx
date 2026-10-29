import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '../../components/common/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#06110C] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <div className="pointer-events-none absolute w-[400px] h-[400px] rounded-full bg-[#A31C1B]/15 blur-[120px]" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-[#171717] border border-[#A31C1B]/40 text-[#A31C1B] shadow-glow-crimson flex items-center justify-center mb-4 animate-float">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#A31C1B]">
          404
        </h1>
        <h2 className="text-base font-bold text-slate-100 mt-1">
          Page Not Found
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mt-2 mb-6">
          The destination you requested does not exist or may have been relocated.
        </p>
        <Button variant="crimson" icon={ArrowLeft} onClick={() => navigate('/app/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
