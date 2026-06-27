import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiXMark, HiOutlineSparkles, HiOutlineArrowUpRight } from 'react-icons/hi2';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  limits: {
    plan_title: string;
    max_listings: number;
    current_listings_count: number;
    is_limit_exceeded: boolean;
  };
}

export default function UpgradePlanModal({ isOpen, onClose, limits }: UpgradePlanModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const currentCount = limits?.current_listings_count ?? 0;
  const maxLimit = limits?.max_listings ?? 0;
  
  // Guard against division by zero
  const progressPercent = maxLimit > 0 ? Math.min(100, (currentCount / maxLimit) * 100) : 100;

  const handleUpgrade = () => {
    onClose();
    navigate('/dashboard/memberships');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* 1. Backdrop Blur Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* 2. Glassmorphic Modal Box */}
      <div className="relative bg-white/95 border border-slate-100/80 shadow-2xl rounded-floating w-full max-w-lg p-10 md:p-12 overflow-hidden z-10 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Glow Accent */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all"
        >
          <HiXMark className="w-5 h-5 stroke-[2.5px]" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-18 h-18 rounded-card-lg bg-gradient-to-tr from-brand to-purple-500 flex items-center justify-center text-white shadow-xl shadow-purple-100 mb-8 animate-bounce duration-1000">
            <HiOutlineSparkles className="w-9 h-9" />
          </div>
          
          <h3 className="text-3xl font-black italic tracking-tight text-slate-900 mb-3">
            Listing Limit Reached!
          </h3>
          <p className="text-label font-black uppercase tracking-label-caps text-purple-500 mb-8">
            Active Tier: {limits?.plan_title || 'Basic Tier'}
          </p>
        </div>

        {/* Limits Analysis Bar */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-card-lg p-6 mb-8 relative">
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-label font-black uppercase tracking-widest text-slate-400">Inventory Status</span>
            <span className="text-sm font-black text-slate-900">
              {currentCount} <span className="text-slate-400 font-medium font-sans">/ {maxLimit} Listings</span>
            </span>
          </div>

          {/* Progress Visualizer */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              style={{ width: `${progressPercent}%` }}
              className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${progressPercent >= 100 ? 'from-red-500 to-brand' : 'from-brand to-purple-500'}`}
            />
          </div>

          {progressPercent >= 100 && (
            <p className="text-micro font-bold text-red-500 mt-3 text-right uppercase tracking-wider animate-pulse">
              100% capacity filled
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 text-center leading-relaxed max-w-sm mx-auto mb-10">
          You've reached the maximum listing count allowed under your current plan. Upgrade to our premium **Pro Plan** or **Enterprise Plan** to unlock unlimited slots, advanced analytics, and priority partner branding.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleUpgrade}
            className="w-full bg-brand text-white py-5 rounded-card font-black text-xs uppercase tracking-caps shadow-xl shadow-purple-100 hover:bg-brand-hover hover:shadow-purple-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            Upgrade Plan <HiOutlineArrowUpRight className="w-4 h-4 stroke-[2.5px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          
          <button 
            onClick={onClose}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-5 rounded-card font-black text-caption uppercase tracking-caps transition-all active:scale-[0.98]"
          >
            Review Existing Listings
          </button>
        </div>

      </div>
    </div>
  );
}
