import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics, type DetailedListingPerformance } from '../../api/analytics';
import { 
  HiOutlinePresentationChartLine,
  HiOutlineEye,
  HiOutlineUser,
  HiOutlineArrowTrendingUp,
  HiOutlineBanknotes
} from 'react-icons/hi2';


interface ListingAnalyticsWidgetProps {
  listingId: number;
  listingType: 'Property' | 'Auto' | 'Product' | 'Event' | 'Service' | 'JobListing' | 'Classified';
}

export default function ListingAnalyticsWidget({ listingId, listingType }: ListingAnalyticsWidgetProps) {
  const navigate = useNavigate();
  const [performance, setPerformance] = useState<DetailedListingPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await getAnalytics(30);
        const detailedListings = response.data.detailedPerformance ?? [];
        const item = detailedListings.find(
          (l) => Number(l.id) === Number(listingId) && l.type === listingType
        );
        if (item) {
          setPerformance(item);
        }
      } catch (error) {
        console.error('Failed to load listing analytics', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformance();
  }, [listingId, listingType]);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-container p-8 shadow-sm flex flex-col items-center justify-center min-h-[220px]">
        <span className="text-micro font-black uppercase tracking-caps-wide text-slate-300 animate-pulse">Syncing Metrics...</span>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="bg-white border border-slate-100 rounded-container p-8 shadow-sm text-center">
        <p className="text-label font-black text-slate-400 uppercase tracking-widest">No 30-Day Metrics Registered</p>
        <p className="text-micro font-bold text-slate-400 mt-2 leading-relaxed max-w-[200px] mx-auto">This asset has not accumulated traffic or conversion logs within the last 30 days.</p>
      </div>
    );
  }

  const containerClass = 'bg-white border border-slate-100 rounded-container shadow-elite p-8 md:p-10';

  return (
    <div className={`${containerClass} bg-brand/5 border-brand/10 relative overflow-hidden group animate-in fade-in zoom-in-95 duration-500`}>
      <h4 className="text-label font-black text-brand uppercase tracking-label-caps mb-8 flex items-center gap-2">
        <HiOutlinePresentationChartLine className="w-4 h-4 stroke-[2.5px]" /> Performance Metrics (30d)
      </h4>
      
      <div className="grid grid-cols-2 gap-5 relative z-10">
        {/* Views */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <HiOutlineEye className="w-5 h-5 stroke-[2.5px]" />
          </div>
          <div>
            <p className="text-tiny font-black text-slate-400 uppercase tracking-widest mb-0.5">Views</p>
            <p className="text-lg font-black text-slate-900 leading-none">{performance.views.toLocaleString()}</p>
          </div>
        </div>

        {/* Leads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
            <HiOutlineUser className="w-5 h-5 stroke-[2.5px]" />
          </div>
          <div>
            <p className="text-tiny font-black text-slate-400 uppercase tracking-widest mb-0.5">Leads</p>
            <p className="text-lg font-black text-slate-900 leading-none">{performance.leads.toLocaleString()}</p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
            <HiOutlineArrowTrendingUp className="w-5 h-5 stroke-[2.5px]" />
          </div>
          <div>
            <p className="text-tiny font-black text-slate-400 uppercase tracking-widest mb-0.5">Conversion</p>
            <p className="text-lg font-black text-slate-900 leading-none">{performance.conversion_rate}%</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <HiOutlineBanknotes className="w-5 h-5 stroke-[2.5px]" />
          </div>
          <div>
            <p className="text-tiny font-black text-slate-400 uppercase tracking-widest mb-0.5">Revenue</p>
            <p className="text-lg font-black text-slate-900 leading-none">
              ${Number(performance.revenue).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-brand/10 flex justify-center relative z-10">
        <button 
          onClick={() => navigate(`/dashboard/analytics/${listingType}/${listingId}`)}
          className="text-label font-black text-brand uppercase tracking-caps hover:underline flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-102"
        >
          View Daily Charts & Trends
        </button>
      </div>

      <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-brand/10 rounded-full blur-[80px] group-hover:bg-brand/20 transition-all duration-700 pointer-events-none" />
    </div>
  );
}
