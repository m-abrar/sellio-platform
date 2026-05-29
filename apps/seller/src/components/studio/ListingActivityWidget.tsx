import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivities } from '../../api/activity';
import { 
  HiOutlineUser, 
  HiOutlineCalendarDays, 
  HiOutlineChevronRight,
  HiOutlineClipboardDocumentList,
  HiOutlineCurrencyDollar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineMapPin,
  HiOutlineClock
} from 'react-icons/hi2';

interface ListingActivityWidgetProps {
  listingId: number;
  listingType: 'Property' | 'Auto' | 'Product' | 'Event' | 'Service' | 'JobListing' | 'Classified';
}

const VERTICAL_CONFIGS: Record<string, { module: string; types: string[] }> = {
  Property: { module: 'properties', types: ['bookings', 'visits'] },
  Auto: { module: 'autos', types: ['inquiries'] },
  Event: { module: 'events', types: ['bookings'] },
  Service: { module: 'services', types: ['quotes', 'appointments'] },
  JobListing: { module: 'joblistings', types: ['applications'] },
  Classified: { module: 'classifieds', types: ['inquiries'] },
};

export default function ListingActivityWidget({ listingId, listingType }: ListingActivityWidgetProps) {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const config = VERTICAL_CONFIGS[listingType];

  useEffect(() => {
    const fetchRelatedActivities = async () => {
      if (!config) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const promises = config.types.map(async (type) => {
          try {
            const response = await getActivities(config.module, type);
            const items = response.data?.data ?? [];
            
            // Filter client-side by checking association IDs
            return items.filter((item: any) => {
              const raw = item.raw || {};
              if (config.module === 'properties') {
                return Number(raw.property_id || raw.property?.id) === Number(listingId);
              }
              if (config.module === 'autos') {
                return Number(raw.auto_id || raw.auto?.id) === Number(listingId);
              }
              if (config.module === 'events') {
                return Number(raw.event_id || raw.event?.id) === Number(listingId);
              }
              if (config.module === 'services') {
                return Number(raw.service_id || raw.service?.id) === Number(listingId);
              }
              if (config.module === 'joblistings') {
                return Number(raw.job_listing_id || raw.job?.id || raw.job_listing?.id) === Number(listingId);
              }
              if (config.module === 'classifieds') {
                return Number(raw.classified_ad_id || raw.classified?.id || raw.classifiedad?.id) === Number(listingId);
              }
              return false;
            }).map((item: any) => ({
              ...item,
              activityType: type,
            }));
          } catch (e) {
            console.error(`Failed to fetch ${type} activities`, e);
            return [];
          }
        });

        const results = await Promise.all(promises);
        const allItems = results.flat().sort((a, b) => {
          return new Date(b.raw?.created_at || 0).getTime() - new Date(a.raw?.created_at || 0).getTime();
        });

        setActivities(allItems);
      } catch (error) {
        console.error('Failed to load related activities', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedActivities();
  }, [listingId, listingType, config]);

  if (!config) return null;

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center justify-center min-h-[200px]">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 animate-pulse">Syncing Activities...</span>
      </div>
    );
  }

  const containerClass = 'bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-10';

  if (activities.length === 0) {
    return (
      <div className={containerClass}>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
          <HiOutlineClipboardDocumentList className="w-4 h-4 stroke-[2.5px]" /> Recent Activity
        </h4>
        <div className="text-center py-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Recent Bookings or Inquiries</p>
          <p className="text-[9px] font-bold text-slate-400 mt-2 leading-relaxed max-w-[220px] mx-auto">
            This asset has not registered any guest bookings, viewing appointments, or buyer inquiries yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClass} relative overflow-hidden group animate-in fade-in zoom-in-95 duration-500`}>
      <h4 className="text-[10px] font-black text-[#6610f2] uppercase tracking-[0.25em] mb-8 flex items-center justify-between gap-3 flex-wrap">
        <span className="flex items-center gap-2">
          <HiOutlineClipboardDocumentList className="w-4 h-4 stroke-[2.5px]" /> Related Bookings & Inquiries
        </span>
        <span className="bg-[#6610f2]/10 px-3 py-1 rounded-full text-[9px] font-extrabold text-[#6610f2] tracking-normal">
          {activities.length} {activities.length === 1 ? 'record' : 'records'}
        </span>
      </h4>

      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
        {activities.map((activity) => {
          const isConfirmed = activity.status === 'Confirmed' || activity.status === 'Accepted' || activity.status === 'Resolved' || activity.status === 'Hired';
          const isPending = activity.status === 'Pending' || activity.status === 'Quoted' || activity.status === 'Interviewing' || activity.status === 'Shortlisted';
          
          const activityMeta = (() => {
            switch(activity.activityType) {
              case 'bookings':
                return { icon: HiOutlineCalendarDays, color: 'text-indigo-500 bg-indigo-50/50 border-indigo-100/50', label: 'Booking' };
              case 'visits':
                return { icon: HiOutlineMapPin, color: 'text-sky-500 bg-sky-50/50 border-sky-100/50', label: 'Visit Request' };
              case 'inquiries':
                return { icon: HiOutlineChatBubbleLeftRight, color: 'text-purple-500 bg-purple-50/50 border-purple-100/50', label: 'Inquiry' };
              case 'quotes':
                return { icon: HiOutlineCurrencyDollar, color: 'text-emerald-500 bg-emerald-50/50 border-emerald-100/50', label: 'Quote Request' };
              case 'appointments':
                return { icon: HiOutlineClock, color: 'text-amber-500 bg-amber-50/50 border-amber-100/50', label: 'Appointment' };
              case 'applications':
                return { icon: HiOutlineUser, color: 'text-rose-500 bg-rose-50/50 border-rose-100/50', label: 'Application' };
              default:
                return { icon: HiOutlineUser, color: 'text-slate-500 bg-slate-50/50 border-slate-100/50', label: activity.activityType };
            }
          })();

          const IconComponent = activityMeta.icon;
          
          return (
            <div 
              key={activity.id}
              onClick={() => navigate(`/dashboard/${config.module}/${activity.activityType}/${activity.id}`)}
              className="group/item flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-[#6610f2]/20 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_30px_rgba(102,16,242,0.03)]"
            >
              <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover/item:scale-105 ${activityMeta.color}`}>
                  <IconComponent className="w-5 h-5 stroke-[2.2px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-slate-800 truncate leading-snug mb-1 group-hover/item:text-[#6610f2] transition-colors">{activity.customer}</p>
                  <div className="flex items-center gap-x-2 gap-y-1 flex-wrap leading-none">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100/50 leading-none">
                      {activityMeta.label}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 shrink-0 flex items-center gap-1 leading-none">
                      <HiOutlineCalendarDays className="w-3 h-3 text-slate-300 shrink-0" /> {activity.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0 w-full sm:w-auto border-t border-slate-50 sm:border-none pt-3.5 sm:pt-0">
                <div className="flex flex-col items-start sm:items-end gap-1.5 leading-none">
                  {activity.amount && activity.amount !== '—' && (
                    <p className="text-xs font-black text-[#6610f2] italic leading-none tracking-tight">{activity.amount}</p>
                  )}
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border transition-all duration-300 ${
                    isConfirmed ? 'bg-green-50 text-green-500 border-green-100/60 group-hover/item:bg-green-100/40' :
                    isPending ? 'bg-amber-50 text-amber-500 border-amber-100/60 group-hover/item:bg-amber-100/40' :
                    'bg-slate-50 text-slate-400 border border-slate-200/50'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isConfirmed ? 'bg-green-400 animate-pulse' :
                      isPending ? 'bg-amber-400 animate-pulse' :
                      'bg-slate-300'
                    }`} />
                    {activity.status}
                  </span>
                </div>
                
                <div className="w-8 h-8 bg-slate-50 border border-slate-100/80 rounded-lg flex items-center justify-center text-slate-300 group-hover/item:text-[#6610f2] group-hover/item:bg-purple-50 group-hover/item:border-purple-100/50 transition-all duration-300">
                  <HiOutlineChevronRight className="w-3.5 h-3.5 stroke-[2.8px] group-hover/item:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
