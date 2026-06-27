import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi2';
import { toast } from 'sonner';
import { deleteEvent, getEvents } from '../../api/events';
import { getDashboardData } from '../../api/dashboard';
import UpgradePlanModal from '../../components/modals/UpgradePlanModal';
import ListingCountCards from '../../components/listings/ListingCountCards';
import { triggerDeletion } from '../../utils/animations';
import { getListingCounts } from '../../utils/listingCounts';

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limits, setLimits] = useState<any>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const [eventsResponse, dashboardResponse] = await Promise.all([
        getEvents(),
        getDashboardData().catch(() => null)
      ]);
      setEvents(eventsResponse.data);
      if (dashboardResponse) {
        setLimits(dashboardResponse.data.subscriptionLimits);
      }
    } catch (error) {
      console.error('Failed to fetch events', error);
      toast.error('Failed to synchronize calendar.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateClick = () => {
    if (limits?.is_limit_exceeded) {
      setIsUpgradeModalOpen(true);
    } else {
      navigate('/dashboard/events/create');
    }
  };

  const handleDelete = (id: number, title: string) => {
    toast(`Decommission "${title}"?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Confirm',
        onClick: async () => {
          try {
            await deleteEvent(id);
            triggerDeletion();
            setEvents((prev) => prev.filter((e) => e.id !== id));
            toast.success(`${title} deleted successfully.`);
          } catch (err: any) {
            toast.error(err.message || 'Failed to delete event.');
          }
        },
      },
    });
  };

  const eventCounts = getListingCounts(events);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader 
        badge="Events" 
        title="Event" 
        subtitle="Calendar"
      >
        <button 
          onClick={handleCreateClick}
          className="bg-brand text-white px-8 py-4.5 rounded-card font-black text-caption uppercase tracking-caps shadow-xl hover:bg-brand-hover transition-all active:scale-95 flex items-center gap-2"
        >
          <HiOutlinePlus className="w-4 h-4" /> Create Event
        </button>
      </PageHeader>

      <ListingCountCards entityLabel="Events" counts={eventCounts} isLoading={isLoading} />
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-label font-black uppercase tracking-caps-xl text-slate-300 animate-pulse">Syncing Calendar...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-container border border-slate-100">
          <p className="text-label font-black uppercase tracking-caps-xl text-slate-300">No events found</p>
        </div>
      ) : (
        <>
          <div className="lg:hidden space-y-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-8 rounded-container border border-slate-100 shadow-premium relative overflow-hidden group">
                <div className="absolute top-8 right-8">
                  <span className={`px-3 py-1.5 rounded-full text-tiny font-black uppercase tracking-widest ${event.is_active ? 'bg-green-500 text-white' : event.is_published ? 'bg-amber-400 text-white animate-pulse' : 'bg-slate-500 text-white'}`}>
                    {event.is_active ? 'Live' : event.is_published ? 'Pending' : 'Draft'}
                  </span>
                </div>
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-card-lg overflow-hidden bg-slate-50 shrink-0 border-4 border-white shadow-md cursor-pointer" onClick={() => navigate(`/dashboard/events/view/${event.slug}`)}>
                    <img src={event.media[0]?.original_url} className="w-full h-full object-cover" alt={event.title} loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1 pt-1 pr-16">
                    <span className="text-micro font-black text-brand bg-brand/5 px-3 py-1 rounded-full uppercase tracking-widest">{event.sku}</span>
                    <h3 
                      className="text-lg font-black text-slate-900 truncate pr-1 mt-2 italic tracking-tight cursor-pointer hover:text-brand transition-colors"
                      onClick={() => navigate(`/dashboard/events/view/${event.slug}`)}
                    >
                      {event.title}
                    </h3>
                    <p className="text-2xl font-black text-slate-900 mt-1 tracking-tighter">{event.price || 'Free'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                  <div className="flex flex-col text-left">
                    <span className="text-micro font-black text-slate-300 uppercase tracking-widest mb-1">Location</span>
                    <span className="text-xs font-black uppercase text-slate-600">{event.location}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/dashboard/events/edit/${event.slug}`)}
                      className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-brand hover:text-white transition-all"
                    >
                      <HiOutlinePencilSquare className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(event.id, event.title)} className="p-4 bg-red-50/50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><HiOutlineTrash className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left text-caption font-black uppercase tracking-caps-wide text-slate-400">
                  <th className="px-10 pb-2">Event Identity</th>
                  <th className="px-10 pb-2">Ticket Base</th>
                  <th className="px-10 pb-2 text-right">Controls</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="group">
                    <td className="bg-white group-hover:bg-slate-50/50 border-y border-l border-slate-100 group-hover:border-brand/20 rounded-l-[2rem] px-10 py-6 transition-all duration-300">
                      <div className="flex items-center gap-6">
                        <div 
                          className="w-20 h-16 rounded-inner overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0 cursor-pointer"
                          onClick={() => navigate(`/dashboard/events/view/${event.slug}`)}
                        >
                          <img src={event.media[0]?.original_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" loading="lazy" />
                        </div>
                        <div className="min-w-0">
                          <p 
                            className="text-lg font-black tracking-tighter mb-1 truncate pr-1 text-slate-900 italic cursor-pointer hover:text-brand transition-colors"
                            onClick={() => navigate(`/dashboard/events/view/${event.slug}`)}
                          >
                            {event.title}
                          </p>
                          <span className="text-label font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-brand/5 text-brand border border-brand/10">{event.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="bg-white group-hover:bg-slate-50/50 border-y border-slate-100 group-hover:border-brand/20 px-10 py-6 transition-all duration-300">
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{event.price || 'Free'}</span>
                      <p className="text-micro font-black text-slate-400 uppercase tracking-widest mt-1">Starting From</p>
                    </td>
                    <td className="bg-white group-hover:bg-slate-50/50 border-y border-r border-slate-100 group-hover:border-brand/20 rounded-r-[2rem] px-10 py-6 text-right transition-all duration-300 relative overflow-hidden">
                      <div className="relative h-16 flex items-center justify-end">
                        <div className="flex flex-col items-end transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-caption font-black uppercase tracking-widest ${event.is_active ? 'text-green-500' : event.is_published ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`}>{event.is_active ? 'Live' : event.is_published ? 'Pending' : 'Draft'}</span>
                            <span className={`w-2 h-2 rounded-full ${event.is_active ? 'bg-green-500 animate-pulse' : event.is_published ? 'bg-amber-400' : 'bg-slate-400'}`} />
                          </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center gap-3 opacity-0 translate-y-[-20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <button 
                            onClick={() => navigate(`/dashboard/events/edit/${event.slug}`)}
                            className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:bg-brand hover:text-white hover:shadow-xl transition-all"
                          >
                            <HiOutlinePencilSquare className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(event.id, event.title)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:bg-red-500 hover:text-white hover:shadow-xl transition-all"><HiOutlineTrash className="w-5 h-5" /></button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {limits && (
        <UpgradePlanModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)} 
          limits={limits} 
        />
      )}
    </div>
  );
}
