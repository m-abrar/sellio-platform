import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Error404() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fbfcfd] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-9xl font-black text-slate-100 italic tracking-tighter mb-4">404</h1>
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic mb-8">Coordinates Lost.</h2>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] max-w-xs leading-relaxed mb-12">
        The requested asset or module is currently offline or has been decommissioned.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-[#6610f2] text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#6610f2]/20 active:scale-90 transition-all"
      >
        Return to Command
      </button>
    </div>
  );
}
