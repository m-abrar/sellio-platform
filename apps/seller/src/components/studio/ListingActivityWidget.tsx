import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivities } from '../../api/activity';
import { 
  HiOutlineUser, 
  HiOutlineCalendarDays, 
  HiOutlineChevronRight,
  HiOutlineClipboardDocumentList,
  HiOutlineCurrencyDollar,
  HiOutlineChatBubbleLeftRight
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
      <h4 className="text-[10px] font-black text-[#6610f2] uppercase tracking-[0.25em] mb-8 flex items-center justify-between">
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
          
          return (
            <div 
              key={activity.id}
              onClick={() => navigate(`/dashboard/${config.module}/${activity.activityType}/${activity.id}`)}
              className="bg-slate-50 hover:bg-slate-100/75 p-5 rounded-2xl border border-slate-100/50 hover:border-[#6610f2]/20 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 hover:shadow-xs group/item"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 shadow-2xs group-hover/item:border-[#6610f2]/10 group-hover/item:text-[#6610f2] transition-colors">
                  <HiOutlineUser className="w-5 h-5 stroke-[2px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-800 truncate mb-1">{activity.customer}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 shrink-0">
                      {activity.activityType === 'bookings' ? 'Booking' 
                       : activity.activityType === 'visits' ? 'Visit Request' 
                       : activity.activityType === 'inquiries' ? 'Inquiry' 
                       : activity.activityType === 'quotes' ? 'Quote Request' 
                       : activity.activityType === 'appointments' ? 'Appointment' 
                       : activity.activityType === 'applications' ? 'Application' 
                       : activity.activityType}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[8px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
                      <HiOutlineCalendarDays className="w-3 h-3 shrink-0" /> {activity.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  {activity.amount && activity.amount !== '—' && (
                    <p className="text-xs font-black text-[#6610f2] italic mb-1">{activity.amount}</p>
                  )}
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${
                    isConfirmed ? 'bg-green-50 text-green-500 border border-green-100' :
                    isPending ? 'bg-amber-50 text-amber-500 border border-amber-100' :
                    'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {activity.status}
                  </span>
                </div>
                <HiOutlineChevronRight className="w-4 h-4 text-slate-300 group-hover/item:text-[#6610f2] group-hover/item:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
