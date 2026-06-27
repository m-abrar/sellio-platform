import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBell } from 'react-icons/hi2';

export default function PageHeader({
  badge,
  title,
  subtitle,
  children,
}: {
  badge: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6 pb-8 mb-8 border-b border-slate-100">
      {/* Left: title block */}
      <div className="min-w-0 flex-1">
        {badge && (
          <p className="text-label font-semibold text-brand uppercase tracking-label-caps mb-2 opacity-75">
            {badge}
          </p>
        )}
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {title}
          {subtitle && (
            <span className="font-light text-slate-300 ml-2">{subtitle}</span>
          )}
        </h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={() => navigate('/dashboard/notifications')}
          className="relative w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand hover:border-brand/20 hover:bg-brand/5 transition-all duration-200 group shrink-0"
        >
          <HiOutlineBell className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-400 rounded-full" />
        </button>

        {children}
      </div>
    </header>
  );
}
