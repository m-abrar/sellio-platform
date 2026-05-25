import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBell } from 'react-icons/hi2';

export default function PageHeader({ badge, title, subtitle, children }: { badge: string; title: string; subtitle: string; children?: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6">
      <div className="min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-[3px] bg-[#6610f2] rounded-full" />
          <span className="text-[10px] font-black text-[#6610f2] uppercase tracking-[0.4em]">
            {badge}
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic leading-none">
          {title} <span className="text-slate-400 font-light not-italic">{subtitle}</span>
        </h1>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Global Notification Bell - Integrated into flex layout */}
        <button 
          onClick={() => navigate('/dashboard/notifications')}
          className="relative p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 shadow-sm hover:text-[#6610f2] transition-all group shrink-0"
        >
          <HiOutlineBell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        
        {/* This is where page-specific buttons (like "Create Property") will go */}
        {children}
      </div>
    </header>
  );
}
