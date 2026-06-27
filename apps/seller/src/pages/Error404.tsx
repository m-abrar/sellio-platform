import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Error404() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fbfcfd] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-9xl font-black text-slate-100 italic tracking-tighter mb-4">404</h1>
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic mb-8">Page Not Found.</h2>
      <p className="text-caption font-black text-slate-400 uppercase tracking-caps-wide max-w-xs leading-relaxed mb-12">
        The page you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-brand text-white px-12 py-6 rounded-full font-black text-xs uppercase tracking-caps-wide shadow-2xl shadow-brand/20 active:scale-90 transition-all"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
