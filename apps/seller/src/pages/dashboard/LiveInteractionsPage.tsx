import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { 
  HiOutlineUser, 
  HiOutlineChevronRight, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineCalendar, 
  HiOutlineStar, 
  HiOutlineArrowLeft,
  HiOutlineShoppingBag,
  HiOutlineBriefcase,
  HiOutlineTag,
  HiOutlineWrenchScrewdriver,
  HiOutlineTruck
} from 'react-icons/hi2';
import { getLiveInteractions } from '../../api/dashboard';
import { PLACEHOLDER_AVATAR } from '../../constants/placeholders';

const getIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'message': return HiOutlineChatBubbleLeftRight;
    case 'booking':
    case 'appointment': return HiOutlineCalendar;
    case 'review': return HiOutlineStar;
    case 'application': return HiOutlineBriefcase;
    case 'quote': return HiOutlineWrenchScrewdriver;
    case 'inquiry':
      if (type?.toLowerCase().includes('auto')) return HiOutlineTruck;
      if (type?.toLowerCase().includes('classified')) return HiOutlineTag;
      return HiOutlineChatBubbleLeftRight;
    default: return HiOutlineUser;
  }
};

const getColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'message': return 'bg-blue-50 text-blue-600 border border-blue-100';
    case 'booking':
    case 'appointment': return 'bg-purple-50 text-purple-600 border border-purple-100';
    case 'review': return 'bg-pink-50 text-pink-600 border border-pink-100';
    case 'application': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    case 'quote': return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
    default: return 'bg-slate-50 text-slate-600 border border-slate-100';
  }
};

export default function LiveInteractionsPage() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await getLiveInteractions();
        if (response && response.recentActivity) {
          setActivities(response.recentActivity);
        }
      } catch (error) {
        console.error('Failed to fetch live interactions', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInteractions();
  }, []);

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = activities.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader 
        badge="Activity" 
        title="Recent" 
        subtitle="Activity"
      >
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2 shadow-xs"
          >
            <HiOutlineArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Feed Log...</span>
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-slate-100 p-20 text-center space-y-6 shadow-premium max-w-2xl mx-auto animate-in fade-in duration-700">
          <div className="w-20 h-20 bg-purple-50 border border-purple-100 rounded-3xl flex items-center justify-center text-[#6610f2] mx-auto shadow-md">
            <HiOutlineUser className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 italic tracking-tight">No Interactions Logged</h3>
            <p className="text-slate-400 text-xs font-semibold max-w-sm mx-auto leading-relaxed">
              There are currently no buyer activity records found in the database. When users inquire, book, or leave reviews, they will show up here.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="p-8 border-b border-slate-50">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Partner Interactions History ({activities.length})</h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-8 py-5">Customer & Vertical</th>
                  <th className="px-8 py-5">Listing Preview</th>
                  <th className="px-8 py-5">Event Description</th>
                  <th className="px-8 py-5 text-right">Activity Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedActivities.map((item, idx) => {
                  const Icon = getIcon(item.type);
                  return (
                    <tr 
                      key={idx}
                      onClick={() => navigate(item.route || '/dashboard')}
                      className="group hover:bg-slate-50/50 cursor-pointer transition-colors duration-200"
                    >
                      {/* Customer & Icon */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getColor(item.type)}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <img 
                                src={item.avatar || PLACEHOLDER_AVATAR} 
                                className="w-6 h-6 rounded-full object-cover border border-slate-100 shadow-xs shrink-0" 
                                alt="avatar" 
                              />
                              <p className="text-sm font-black text-slate-900 leading-none group-hover:text-[#6610f2] transition-colors">{item.user}</p>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2 inline-block bg-slate-100 px-2.5 py-1 rounded-md">{item.type}</span>
                          </div>
                        </div>
                      </td>

                      {/* Listing Preview Image */}
                      <td className="px-8 py-6">
                        {item.image ? (
                          <div className="shrink-0 relative w-16 h-10 rounded-lg overflow-hidden border border-slate-100 shadow-xs group-hover:scale-105 transition-transform duration-300">
                            <img src={item.image} className="w-full h-full object-cover" alt="preview" />
                            <div className="absolute inset-0 bg-black/5" />
                          </div>
                        ) : (
                          <div className="w-16 h-10 rounded-lg bg-slate-50 border border-slate-100/60 flex items-center justify-center text-slate-300">
                            <span className="text-[8px] font-bold uppercase tracking-wider">No Image</span>
                          </div>
                        )}
                      </td>

                      {/* Event Details */}
                      <td className="px-8 py-6">
                        <p className="text-xs text-slate-600 font-bold leading-relaxed max-w-xl group-hover:text-slate-950 transition-colors">
                          {item.description}
                        </p>
                      </td>

                      {/* Time & Click Action */}
                      <td className="px-8 py-6 text-right relative">
                        <div className="group-hover:opacity-0 transition-opacity">
                          <span className="text-xs font-bold text-slate-400">{item.time}</span>
                        </div>
                        <div className="absolute inset-y-0 right-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-black text-[#6610f2] uppercase tracking-widest flex items-center gap-1.5">
                            View Details <HiOutlineChevronRight className="w-4 h-4 stroke-[2.5px] group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Showing <span className="text-slate-900">{startIndex + 1}</span> to <span className="text-slate-900">{Math.min(startIndex + itemsPerPage, activities.length)}</span> of <span className="text-slate-900">{activities.length}</span> entries
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all shadow-xs"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all flex items-center justify-center ${currentPage === page ? 'bg-[#6610f2] text-white shadow-md shadow-purple-200' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-500 transition-all shadow-xs"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
