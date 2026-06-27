import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LayoutDashboard } from 'lucide-react';

interface PageHeaderProps {
  breadcrumb?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ElementType;
  iconColor?: string;
  iconBg?: string;
}

export const PageHeader = ({
  breadcrumb,
  title,
  description,
  action,
  icon: Icon,
  iconColor = 'text-[var(--primary-color)]',
  iconBg = 'bg-[var(--primary-light)]',
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-1">
      <div className="flex items-start gap-4 min-w-0">
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}>
            <Icon size={22} className={iconColor} strokeWidth={2} />
          </div>
        )}
        <div className="min-w-0">
          {breadcrumb && (
            <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1.5 min-w-0">
              <Link to="/" className="hover:text-[var(--primary-color)] transition-colors flex items-center gap-1 shrink-0">
                <LayoutDashboard size={11} />
                Dashboard
              </Link>
              <ChevronRight size={11} className="text-slate-300 shrink-0" />
              <span className="text-slate-600 truncate">{breadcrumb}</span>
            </nav>
          )}
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">{title}</h1>
          {description && (
            <p className="text-slate-500 text-sm mt-1.5 font-medium leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
