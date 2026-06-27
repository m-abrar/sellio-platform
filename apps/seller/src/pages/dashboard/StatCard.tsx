import React from 'react';
import type { IconType } from 'react-icons';
import { HiOutlineArrowTrendingUp, HiOutlineExclamationTriangle } from 'react-icons/hi2';

interface StatCardProps {
  title: string;
  value: string;
  icon: IconType;
  color: string;
  trend?: string;
  details?: { label: string; value: number | string }[];
  detailColumns?: number;
}

export default function StatCard({ title, value, icon: Icon, color, trend, details, detailColumns = 1 }: StatCardProps) {
  const isWarning = color.includes('red-');

  return (
    <div className="relative bg-white rounded-card-sm border border-slate-100 p-6 md:p-7 flex flex-col h-full overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-slate-200/60">
      {/* Subtle gradient shimmer on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-slate-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Row 1: Icon + Trend badge */}
      <div className="relative z-10 flex items-start justify-between mb-5">
        <div className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>

        {trend && (
          <span className={`inline-flex items-center gap-1 text-micro font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
            isWarning
              ? 'bg-red-50 text-red-500 border border-red-100/80'
              : 'bg-emerald-50 text-emerald-600 border border-emerald-100/80'
          }`}>
            {isWarning
              ? <HiOutlineExclamationTriangle className="w-3 h-3" />
              : <HiOutlineArrowTrendingUp className="w-3 h-3" />
            }
            {trend}
          </span>
        )}
      </div>

      {/* Row 2: Label + Hero Number */}
      <div className="relative z-10 flex-1 mb-5">
        <p className="text-label font-semibold uppercase tracking-label text-slate-400 mb-2">{title}</p>
        <p
          className="text-2xl sm:text-3xl xl:text-hero-num font-black text-slate-900 tracking-tight leading-none"
          title={value}
        >
          {value}
        </p>
      </div>

      {/* Row 3: Detail breakdown */}
      {details && details.length > 0 && (
        <div className={`relative z-10 pt-4 border-t border-slate-50 ${
          detailColumns === 2 ? 'grid grid-cols-2 gap-x-4 gap-y-2.5' : 'space-y-2.5'
        }`}>
          {details.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-1 min-w-0">
              <span className="text-micro font-semibold uppercase tracking-wider text-slate-400 shrink-0">{item.label}</span>
              <span className="text-label font-black text-slate-700 shrink-0 text-right" title={String(item.value)}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
