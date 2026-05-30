import React from 'react';
import { cn } from '../lib/utils';
import { Rocket } from 'lucide-react';

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] p-8", className)}>
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer pulsing glow ring */}
        <div className="absolute w-16 h-16 rounded-full border-2 border-[var(--primary-color)] opacity-20 animate-ping" />
        
        {/* Middle slow-spinning dashed ring */}
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-[var(--primary-color)] opacity-40 animate-[spin_3s_linear_infinite]" />
        
        {/* Inner fast-spinning spinner */}
        <div className="absolute w-10 h-10 rounded-full border-2 border-[var(--primary-color)] border-t-transparent animate-spin" />
        
        {/* Bouncing rocket icon in the center */}
        <div className="absolute text-[var(--primary-color)] animate-bounce flex items-center justify-center">
          <Rocket size={18} className="fill-[var(--primary-light)]" />
        </div>
      </div>
      
      {/* Capitalized tracking loading label */}
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 animate-pulse">
        Retrieving dashboard records...
      </span>
    </div>
  );
};

