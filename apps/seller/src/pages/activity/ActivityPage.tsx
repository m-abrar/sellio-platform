import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineUser, HiOutlineChevronRight } from 'react-icons/hi2';
import { getActivities } from '../../api/activity';
import { PLACEHOLDER_AVATAR, listingPlaceholderForModule } from '../../constants/placeholders';

export default function ActivityPage() {
  const { type, module } = useParams();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const response = await getActivities(module, type);
        setActivities(response.data.data);
      } catch (error) {
        console.error("Failed to fetch activities", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, [module, type]);

  const getTitle = () => {
    switch(type) {
      case 'bookings': return 'Reservations';
      case 'inquiries': return 'Inquiries';
      case 'applications': return 'Applications';
      case 'orders': return 'Orders';
      default: return 'Activity';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Live Feed" title="Recent" subtitle={getTitle()} />
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Feed...</span>
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-16 text-center space-y-6 shadow-premium max-w-2xl mx-auto animate-in fade-in duration-700">
          <div className="w-20 h-20 bg-[#6610f2]/10 border border-[#6610f2]/20 rounded-3xl flex items-center justify-center text-[#6610f2] mx-auto shadow-md">
            <HiOutlineUser className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 italic tracking-tight">No {getTitle()} Found.</h3>
            <p className="text-slate-400 text-xs font-semibold max-w-sm mx-auto leading-relaxed">
              There are currently no active {type || 'interactions'} registered under this vertical. Please check back later or verify your active listings.
            </p>
          </div>
          <div className="pt-4 flex justify-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-102 active:scale-98 shadow-md"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => navigate(module ? `/dashboard/${module}` : '/dashboard')}
              className="bg-[#6610f2] hover:bg-[#520dc2] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-102 active:scale-98 shadow-md shadow-purple-200"
            >
              View Listings
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden lg:block">
          <table className="w-full border-separate border-spacing-y-4">
            <thead>
              <tr className="text-left text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                <th className="px-10 pb-2">Asset & Customer</th>
                <th className="px-10 pb-2">Status</th>
                <th className="px-10 pb-2 text-right">Date / Amount</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((item) => (
                <tr 
                  key={item.id} 
                  className="group cursor-pointer"
                  onClick={() => navigate(`/dashboard/${module}/${type}/${item.id}`)}
                >
                  <td className="bg-white group-hover:bg-slate-50/50 border-y border-l border-slate-100 group-hover:border-[#6610f2]/20 rounded-l-[2rem] px-10 py-6 transition-all duration-300">
                    <div className="flex items-center gap-6">
                      {(((module === 'properties' || module === 'events') && type === 'bookings') || 
                        (module === 'autos' && type === 'inquiries') || 
                        (module === 'joblistings' && type === 'applications') || 
                        (module === 'services' && type === 'inquiries') ||
                        (module === 'classifieds' && type === 'inquiries')) ? (
                        <img 
                          src={(module === 'properties' ? item.raw.property?.primary_image_url 
                               : module === 'events' ? item.raw.event?.primary_image_url 
                               : module === 'autos' ? item.raw.auto?.primary_image_url 
                               : module === 'joblistings' ? item.raw.job?.primary_image_url 
                               : module === 'services' ? item.raw.service?.primary_image_url 
                               : module === 'classifieds' ? item.raw.classified?.primary_image_url 
                               : null) || 
                               listingPlaceholderForModule(module || '')} 
                          className="shrink-0 w-16 h-10 rounded-lg object-cover border border-slate-100 shadow-xs group-hover:scale-105 transition-transform duration-300"
                          alt="preview"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:text-[#6610f2] group-hover:border-[#6610f2]/20 transition-all shrink-0">
                          <HiOutlineUser className="w-6 h-6" />
                        </div>
                      )}

                      <div className="min-w-0">
                        {(((module === 'properties' || module === 'events') && type === 'bookings') || 
                          (module === 'autos' && type === 'inquiries') || 
                          (module === 'joblistings' && type === 'applications') || 
                          (module === 'services' && type === 'inquiries') ||
                          (module === 'classifieds' && type === 'inquiries')) ? (
                          <>
                            <p className="text-sm font-black tracking-tight text-slate-900 leading-tight italic group-hover:text-[#6610f2] transition-colors">{item.asset}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <img 
                                src={item.raw.user?.avatar_url || PLACEHOLDER_AVATAR} 
                                className="w-5 h-5 rounded-full object-cover border border-slate-100 shrink-0" 
                                alt="avatar" 
                              />
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                {type === 'bookings' ? 'Guest' : type === 'applications' ? 'Candidate' : 'Lead'}: <span className="text-slate-600 font-medium normal-case font-sans text-xs ml-0.5">{item.customer}</span>
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-lg font-black tracking-tighter text-slate-900 italic group-hover:text-[#6610f2] transition-colors">{item.asset}</p>
                            <p className="text-[10px] font-black text-[#6610f2] uppercase tracking-widest mt-1">From: {item.customer}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="bg-white group-hover:bg-slate-50/50 border-y border-slate-100 group-hover:border-[#6610f2]/20 px-10 py-6 transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.status === 'Confirmed' || item.status === 'Shipped' ? 'bg-green-500' : 'bg-amber-400'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{item.status}</span>
                    </div>
                  </td>
                  <td className="bg-white group-hover:bg-slate-50/50 border-y border-r border-slate-100 group-hover:border-[#6610f2]/20 rounded-r-[2rem] px-10 py-6 text-right transition-all duration-300 relative">
                    <div className="flex flex-col items-end group-hover:opacity-0 transition-opacity">
                      <p className="text-sm font-black text-slate-900 tracking-tight">{item.amount || item.resume || 'N/A'}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.date}</p>
                    </div>
                    <div className="absolute inset-y-0 right-10 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black text-[#6610f2] uppercase tracking-widest flex items-center gap-2">
                        View Details <HiOutlineChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
