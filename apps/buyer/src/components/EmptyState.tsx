import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  iconColor?: string;
  iconBg?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  iconColor = 'text-slate-400',
  iconBg = 'bg-slate-100',
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-8 bg-white rounded-3xl border border-dashed border-slate-200">
      <div className={`w-16 h-16 ${iconBg} rounded-3xl flex items-center justify-center mb-5 shadow-sm`}>
        <Icon size={30} className={iconColor} strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-black text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-6 font-medium">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
