import React from 'react';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  breadcrumb?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader = ({ breadcrumb, title, description, action }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-3">
      <div>
        {breadcrumb && (
          <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium mb-2">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-zinc-900">{breadcrumb}</span>
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{title}</h1>
        {description && <p className="text-zinc-500 mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
