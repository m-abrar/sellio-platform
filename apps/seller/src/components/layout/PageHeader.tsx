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
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 md:gap-8 mb-10 md:mb-14">
      <div className="min-w-0">
        {/* Badge / breadcrumb */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
          <span className="text-label font-semibold text-slate-400 uppercase tracking-label-wide">
            {badge}
          </span>
        </div>

        {/* Page title */}
        <h1 className="text-display md:text-display font-black text-slate-900 tracking-tight leading-[1.02]">
          {title} <span className="font-light text-slate-300">{subtitle}</span>
        </h1>
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
        <button
          onClick={() => navigate('/dashboard/notifications')}
          className="relative w-11 h-11 bg-white border border-slate-100 rounded-interactive flex items-center justify-center text-slate-400 hover:text-brand hover:border-purple-100 hover:bg-purple-50/40 transition-all duration-200 shrink-0 group"
        >
          <HiOutlineBell className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand rounded-full" />
        </button>

        {children}
      </div>
    </header>
  );
}
