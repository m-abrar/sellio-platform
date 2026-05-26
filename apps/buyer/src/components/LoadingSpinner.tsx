import React from 'react';
import { cn } from '../lib/utils';

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
      <div className="w-8 h-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
};
