import React from 'react';
import type { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  value: string;
  icon: IconType;
  color: string;
  trend?: string;
  details?: { label: string; value: number }[];
}

export default function StatCard({ title, value, icon: Icon, color, trend, details }: StatCardProps) {
  return (
    <div className="bg-white p-6 md:p-10 rounded-[2rem] xl:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1.5 group flex flex-col justify-between h-full relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-slate-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Top Row: Icon and Trend */}
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-500 ${color} group-hover:bg-slate-900 group-hover:text-white shrink-0 shadow-sm`}>
          <Icon className="w-7 h-7 md:w-8 md:h-8" />
        </div>
        
        {trend && (
          <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 uppercase tracking-widest shadow-inner">
            {trend}
          </span>
        )}
      </div>
      
      {/* Bottom Row: Text content */}
      <div className="min-w-0 relative z-10">
        <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase mb-2 truncate">
          {title}
        </p>
        <div className="flex items-baseline gap-1 mb-4">
           <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter italic leading-none">
             {value}
           </h3>
           <span className="w-2 h-2 rounded-full bg-[#6610f2] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {details && details.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-4 border-t border-slate-50">
            {details.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</span>
                <span className="text-[10px] font-black text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
