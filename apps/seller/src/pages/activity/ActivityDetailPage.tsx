import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { 
  HiOutlineUser, 
  HiOutlineCalendar, 
  HiOutlineMapPin, 
  HiOutlineCurrencyDollar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowLeft
} from 'react-icons/hi2';
import { getActivityById } from '../../api/activity';
import { toast } from 'sonner';

export default function ActivityDetailPage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await getActivityById(id);
        if (response && response.data) {
          setActivity(response.data);
        } else {
          setActivity(null);
        }
      } catch (error) {
        console.error("Failed to fetch activity details", error);
        setActivity(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  const handleStatusUpdate = (newStatus: string) => {
    toast.success(`Status updated to ${newStatus}`);
    setActivity((prev: any) => ({ ...prev, status: newStatus }));
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Loading Details...</span>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-6">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Activity not found</p>
        <button onClick={() => navigate(-1)} className="text-[#6610f2] font-black uppercase text-xs tracking-widest flex items-center gap-2">
          <HiOutlineArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#6610f2] hover:border-[#6610f2]/20 transition-all">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Back to {type}</span>
      </div>

      <PageHeader 
        badge={type?.toUpperCase()} 
        title={activity.asset} 
        subtitle={`ID: #${activity.id}`}
      >
        <div className="flex gap-3">
          <button 
            onClick={() => handleStatusUpdate('Confirmed')}
            className="bg-green-500 text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-green-600 transition-all active:scale-95 flex items-center gap-2"
          >
            <HiOutlineCheckCircle className="w-4 h-4" /> Approve
          </button>
          <button 
            onClick={() => handleStatusUpdate('Rejected')}
            className="bg-white text-red-500 border border-red-100 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-sm hover:bg-red-50 transition-all active:scale-95 flex items-center gap-2"
          >
            <HiOutlineXCircle className="w-4 h-4" /> Reject
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* MAIN DETAILS */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-premium">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight mb-10">Interaction Overview.</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#6610f2] border border-slate-100">
                    <HiOutlineUser className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                    <p className="text-lg font-black text-slate-900 italic">{activity.customer}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#6610f2] border border-slate-100">
                    <HiOutlineCalendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule / Date</p>
                    <p className="text-lg font-black text-slate-900 italic">{activity.date}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#6610f2] border border-slate-100">
                    <HiOutlineCurrencyDollar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Financial Value</p>
                    <p className="text-lg font-black text-slate-900 italic">{activity.amount || 'Quote Requested'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#6610f2] border border-slate-100">
                    <HiOutlineCheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                    <span className={`inline-block mt-1 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${activity.status === 'Confirmed' || activity.status === 'Shipped' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-amber-50 text-amber-500 border border-amber-100'}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {activity.message && (
              <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Message from Customer</p>
                <p className="text-slate-600 font-medium italic leading-relaxed">"{activity.message}"</p>
              </div>
            )}
          </div>

          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-premium">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Communication.</h3>
              <button className="text-[10px] font-black text-[#6610f2] uppercase tracking-widest flex items-center gap-2">
                <HiOutlineChatBubbleLeftRight className="w-4 h-4" /> Open Full Chat
              </button>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
                <div className="bg-slate-50 p-6 rounded-2xl rounded-tl-none border border-slate-100 max-w-[80%]">
                  <p className="text-sm text-slate-600 font-medium">Hello, I'm interested in this listing. Is it still available for the dates mentioned?</p>
                </div>
              </div>
              <div className="flex gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-xl bg-[#6610f2] shrink-0" />
                <div className="bg-[#6610f2] p-6 rounded-2xl rounded-tr-none text-white max-w-[80%] shadow-lg shadow-purple-200">
                  <p className="text-sm font-medium">Yes, it is! We can proceed with the booking if you're ready.</p>
                </div>
              </div>
            </div>
            <div className="mt-10 flex gap-4">
              <input 
                type="text" 
                placeholder="Type your response..." 
                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20 transition-all"
              />
              <button className="bg-[#6610f2] text-white px-8 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-purple-200">Send</button>
            </div>
          </div>
        </div>

        {/* SIDEBAR INFO */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Asset Details</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-xl bg-white/10 border border-white/10 overflow-hidden">
                  <img src="https://picsum.photos/seed/asset/200/150" className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <p className="text-sm font-black italic">{activity.asset}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Ref: #ASSET-992</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/dashboard/properties')}
                className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
              >
                View Asset Listing
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#6610f2]/20 rounded-full blur-[60px]" />
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Timeline</h4>
            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow-sm flex items-center justify-center">
                  <HiOutlineCheckCircle className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Interaction Created</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Feb 24, 2026 • 10:30 AM</p>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#6610f2] border-4 border-white shadow-sm flex items-center justify-center">
                  <HiOutlineChatBubbleLeftRight className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Partner Responded</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Feb 24, 2026 • 11:15 AM</p>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-200 border-4 border-white shadow-sm" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-tight">Awaiting Approval</p>
                <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-widest">Current Stage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
