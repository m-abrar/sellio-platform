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
import { PLACEHOLDER_AVATAR, PLACEHOLDER_LISTING } from '../../constants/placeholders';
import { toast } from 'sonner';

export default function ActivityDetailPage() {
  const { module, type, id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await getActivityById(module, type, id);
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
  }, [module, type, id]);

  const handleStatusUpdate = (newStatus: string) => {
    toast.success(`Status updated to ${newStatus}`);
    setActivity((prev: any) => ({ ...prev, status: newStatus }));
  };

  const getAssetUrl = () => {
    if (!activity?.raw) return `/dashboard/${module}`;
    const raw = activity.raw;
    let slug = null;
    if (module === 'properties') slug = raw.property?.slug;
    else if (module === 'autos') slug = raw.auto?.slug;
    else if (module === 'events') slug = raw.event?.slug;
    else if (module === 'services') slug = raw.service?.slug;
    else if (module === 'joblistings') slug = raw.job?.slug || raw.job_listing?.slug;
    else if (module === 'classifieds') slug = raw.classified?.slug || raw.classifiedad?.slug;
    else if (module === 'products') slug = raw.product?.slug;

    return slug ? `/dashboard/${module}/view/${slug}` : `/dashboard/${module}`;
  };

  const assetUrl = getAssetUrl();

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
            
            {module === 'properties' && type === 'bookings' ? (
              <div className="space-y-10 animate-in fade-in duration-500">
                {/* 1. Stay Schedule Grid */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Reservation Timeline</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Check In</p>
                      <p className="text-xs font-black text-slate-900 leading-none">{activity.raw.check_in_date ? new Date(activity.raw.check_in_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Check Out</p>
                      <p className="text-xs font-black text-slate-900 leading-none">{activity.raw.check_out_date ? new Date(activity.raw.check_out_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Duration</p>
                      <p className="text-xs font-black text-slate-900 leading-none">{activity.raw.duration_nights || 1} {Number(activity.raw.duration_nights) === 1 ? 'Night' : 'Nights'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Guests</p>
                      <p className="text-xs font-black text-slate-900 leading-none">{activity.raw.guests || 1} {Number(activity.raw.guests) === 1 ? 'Guest' : 'Guests'}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Customer Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                  <div className="flex items-start gap-4">
                    <img 
                      src={activity.raw.user?.avatar_url || PLACEHOLDER_AVATAR} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0" 
                      alt="guest" 
                    />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Guest Identity</p>
                      <p className="text-base font-black text-slate-900 leading-tight">{activity.customer}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.raw.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#6610f2] border border-slate-100 shrink-0">
                      <HiOutlineCheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reservation Status</p>
                      <span className={`inline-block mt-1 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${activity.status === 'Confirmed' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-amber-50 text-amber-500 border border-amber-100'}`}>
                        {activity.status}
                      </span>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.raw.phone || 'No phone provided'}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Detailed Financial Statement */}
                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 pt-6 mt-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Financial Statement</p>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>Base Rental Amount</span>
                      <span className="text-slate-900">${Number(activity.raw.base_rental_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>Taxes & Service Fees</span>
                      <span className="text-slate-900">${Number(activity.raw.fees_and_taxes_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    {Number(activity.raw.addons_total_price) > 0 && (
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                        <span>Add-on Services</span>
                        <span className="text-slate-900">${Number(activity.raw.addons_total_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200/60 my-2 pt-4 flex justify-between items-baseline">
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Total Stay Price</span>
                      <span className="text-2xl font-black text-[#6610f2] italic tracking-tight">${Number(activity.raw.total_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : module === 'events' && type === 'bookings' ? (
              <div className="space-y-10 animate-in fade-in duration-500">
                {/* 1. Event Timeline Grid */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Event Admission Timeline</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Date & Time</p>
                      <p className="text-xs font-black text-slate-900 leading-none">
                        {activity.raw.occurrence?.start_date_time 
                          ? new Date(activity.raw.occurrence.start_date_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) 
                          : activity.raw.created_at 
                            ? new Date(activity.raw.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
                            : '—'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Starting At</p>
                      <p className="text-xs font-black text-slate-900 leading-none">
                        {activity.raw.occurrence?.start_date_time 
                          ? new Date(activity.raw.occurrence.start_date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) 
                          : '7:00 PM'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Ticket Tier</p>
                      <p className="text-xs font-black text-slate-900 leading-none truncate">{activity.raw.ticket_type?.name || 'General Admission'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Quantity</p>
                      <p className="text-xs font-black text-slate-900 leading-none">{activity.raw.quantity || 1} {Number(activity.raw.quantity) === 1 ? 'Ticket' : 'Tickets'}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Customer Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                  <div className="flex items-start gap-4">
                    <img 
                      src={activity.raw.user?.avatar_url || PLACEHOLDER_AVATAR} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0" 
                      alt="attendee" 
                    />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendee Identity</p>
                      <p className="text-base font-black text-slate-900 leading-tight">{activity.customer}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.raw.email || 'No email provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#6610f2] border border-slate-100 shrink-0">
                      <HiOutlineCheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Registration Status</p>
                      <span className={`inline-block mt-1 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${activity.status === 'Confirmed' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-amber-50 text-amber-500 border border-amber-100'}`}>
                        {activity.status}
                      </span>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.raw.phone || 'No phone provided'}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Detailed Financial Statement */}
                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 pt-6 mt-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Financial Ticket Summary</p>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>Ticket Price ({activity.raw.ticket_type?.name || 'General Admission'})</span>
                      <span className="text-slate-900">
                        ${Number(activity.raw.ticket_type?.price || (Number(activity.raw.total_price || 0) / (activity.raw.quantity || 1))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>Quantity</span>
                      <span className="text-slate-900">x{activity.raw.quantity || 1}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>Service Charge & Taxes</span>
                      <span className="text-slate-900">Included</span>
                    </div>
                    <div className="border-t border-slate-200/60 my-2 pt-4 flex justify-between items-baseline">
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Total Transaction Price</span>
                      <span className="text-2xl font-black text-[#6610f2] italic tracking-tight">${Number(activity.raw.total_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : module === 'autos' && type === 'inquiries' ? (
              <div className="space-y-10 animate-in fade-in duration-500">
                {/* 1. Vehicle Preference Timeline Grid */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Preference & Viewing Schedule</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Viewing Date</p>
                      <p className="text-xs font-black text-slate-900 leading-none">
                        {activity.raw.preferred_date 
                          ? new Date(activity.raw.preferred_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) 
                          : 'Flexible / Not set'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Viewing Time</p>
                      <p className="text-xs font-black text-slate-900 leading-none">
                        {activity.raw.preferred_time || 'Flexible'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Vehicle Year</p>
                      <p className="text-xs font-black text-slate-900 leading-none">{activity.raw.auto?.year || '—'}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Transmission</p>
                      <p className="text-xs font-black text-slate-900 leading-none truncate">{activity.raw.auto?.transmission || 'Automatic'}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Customer Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                  <div className="flex items-start gap-4">
                    <img 
                      src={activity.raw.user?.avatar_url || PLACEHOLDER_AVATAR} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0" 
                      alt="lead" 
                    />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead Identity</p>
                      <p className="text-base font-black text-slate-900 leading-tight">{activity.customer}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.raw.email || 'No email provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#6610f2] border border-slate-100 shrink-0">
                      <HiOutlineCheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Inquiry Status</p>
                      <span className={`inline-block mt-1 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${activity.status === 'Resolved' || activity.status === 'Contacted' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-amber-50 text-amber-500 border border-amber-100'}`}>
                        {activity.status}
                      </span>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.raw.phone || 'No phone provided'}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Detailed Financial Statement / Financing Estimate */}
                {(() => {
                  const autoPrice = Number(activity.raw.auto?.sale_price > 0 ? activity.raw.auto.sale_price : (activity.raw.auto?.base_price || 24900));
                  const downPayment = autoPrice * 0.10;
                  const loanAmount = autoPrice - downPayment;
                  const monthlyInterestRate = 0.055 / 12; // 5.5% annual rate
                  const loanTermMonths = 60;
                  const estimatedMonthlyPayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

                  return (
                    <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 pt-6 mt-8">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Estimated Vehicle Valuation & Finance Proposal</p>
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>Vehicle Selling Price</span>
                          <span className="text-slate-900">${autoPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>10% Est. Down Payment</span>
                          <span className="text-slate-900">${downPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>Estimated Term / Rate</span>
                          <span className="text-slate-900">60 Months @ 5.5% APR</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-t border-slate-200/40 pt-3">
                          <span>Est. Monthly Payment</span>
                          <span className="text-slate-900 font-extrabold">${estimatedMonthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo</span>
                        </div>
                        <div className="border-t border-slate-200/60 my-2 pt-4 flex justify-between items-baseline">
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Total Valuation</span>
                          <span className="text-2xl font-black text-[#6610f2] italic tracking-tight">${autoPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : module === 'joblistings' && type === 'applications' ? (
              <div className="space-y-10 animate-in fade-in duration-500">
                {/* 1. Job Details & Preferences Timeline Grid */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Job Specs & Placement details</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Workplace</p>
                      <p className="text-xs font-black text-slate-900 leading-none">
                        {activity.raw.job?.workplace_type === 1 
                          ? 'Remote' 
                          : activity.raw.job?.workplace_type === 3 
                            ? 'Hybrid' 
                            : 'On-Site'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Salary Range</p>
                      <p className="text-xs font-black text-slate-900 leading-none truncate">
                        {activity.raw.job?.salary_min 
                          ? `$${(activity.raw.job.salary_min / 1000).toFixed(0)}k – $${(activity.raw.job.salary_max / 1000).toFixed(0)}k` 
                          : 'Not disclosed'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Applied On</p>
                      <p className="text-xs font-black text-slate-900 leading-none">
                        {activity.raw.created_at ? new Date(activity.raw.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Position</p>
                      <p className="text-xs font-black text-slate-900 leading-none truncate">{activity.raw.job?.title || 'Job Opening'}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Customer Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                  <div className="flex items-start gap-4">
                    <img 
                      src={activity.raw.user?.avatar_url || PLACEHOLDER_AVATAR} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0" 
                      alt="candidate" 
                    />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Candidate Identity</p>
                      <p className="text-base font-black text-slate-900 leading-tight">{activity.customer}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.raw.email || 'No email provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#6610f2] border border-slate-100 shrink-0">
                      <HiOutlineCheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hiring Status</p>
                      <span className={`inline-block mt-1 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${activity.status === 'Hired' || activity.status === 'Interviewing' || activity.status === 'Shortlisted' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-amber-50 text-amber-500 border border-amber-100'}`}>
                        {activity.status}
                      </span>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.raw.phone || 'No phone provided'}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Applicant Summary Statement (Cover Letter, Portfolio, Resume) */}
                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 pt-6 mt-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Application Attachments & Statement</p>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Cover Letter Introduction</span>
                      <p className="text-slate-600 font-medium italic text-xs leading-relaxed bg-white p-6 rounded-2xl border border-slate-100">
                        "{activity.raw.cover_letter || "Greetings, I am highly interested in this role and look forward to discussing how my experience aligns with your team's goals."}"
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="bg-white p-5 rounded-2xl border border-slate-100/60 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Candidate Resume</p>
                          <p className="text-xs font-black text-slate-900 leading-none">
                            {activity.raw.resume_path ? activity.raw.resume_path.split('/').pop() : 'CV_Document.pdf'}
                          </p>
                        </div>
                        <a 
                          href={activity.raw.resume_path ? `file:///${activity.raw.resume_path}` : '#'} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-[#6610f2]/10 hover:bg-[#6610f2]/20 text-[#6610f2] px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                          View CV
                        </a>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-slate-100/60 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Portfolio & Links</p>
                          <p className="text-xs font-black text-slate-900 leading-none">
                            {activity.raw.portfolio_url ? new URL(activity.raw.portfolio_url).hostname : 'portfolio.website.com'}
                          </p>
                        </div>
                        <a 
                          href={activity.raw.portfolio_url || '#'} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                        >
                          Portfolio
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : module === 'services' && (type === 'inquiries' || type === 'quotes' || type === 'appointments') ? (
              <div className="space-y-10 animate-in fade-in duration-500">
                {/* 1. Service Details Timeline Grid */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Service Schedule & Preferences</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Desired Start</p>
                      <p className="text-xs font-black text-slate-900 leading-none">
                        {activity.raw.requested_date || activity.raw.scheduled_at 
                          ? new Date((activity.raw.requested_date || activity.raw.scheduled_at) as string).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) 
                          : 'Flexible / Asap'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Project Scope</p>
                      <p className="text-xs font-black text-slate-900 leading-none truncate">
                        {activity.raw.scope_size || 'Standard'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Inquiry Date</p>
                      <p className="text-xs font-black text-slate-900 leading-none">
                        {activity.raw.created_at ? new Date(activity.raw.created_at as string).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Service</p>
                      <p className="text-xs font-black text-slate-900 leading-none truncate">{activity.raw.service?.title || 'Custom Service'}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Customer Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                  <div className="flex items-start gap-4">
                    <img 
                      src={activity.raw.user?.avatar_url || PLACEHOLDER_AVATAR} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0" 
                      alt="client" 
                    />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Client Identity</p>
                      <p className="text-base font-black text-slate-900 leading-tight">{activity.customer}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.raw.email || 'No email provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#6610f2] border border-slate-100 shrink-0">
                      <HiOutlineCheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Quote Status</p>
                      <span className={`inline-block mt-1 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${activity.status === 'Accepted' || activity.status === 'Quoted' || activity.status === 'Sent' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-amber-50 text-amber-500 border border-amber-100'}`}>
                        {activity.status}
                      </span>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.raw.phone || 'No phone provided'}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Detailed Financial Statement / Pricing Quote */}
                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 pt-6 mt-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Estimated Service Quote proposal</p>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>Quoted Service Rate</span>
                      <span className="text-slate-900">${Number(activity.raw.quoted_price || activity.raw.total_price || activity.raw.price || 150).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>Scope / Size multiplier</span>
                      <span className="text-slate-900">{activity.raw.scope_size || 'Standard package'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>Taxes & Administrative Fees</span>
                      <span className="text-slate-900">Included</span>
                    </div>
                    <div className="border-t border-slate-200/60 my-2 pt-4 flex justify-between items-baseline">
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Estimated Project Total</span>
                      <span className="text-2xl font-black text-[#6610f2] italic tracking-tight">${Number(activity.raw.quoted_price || activity.raw.total_price || activity.raw.price || 150).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : module === 'classifieds' && type === 'inquiries' ? (
              <div className="space-y-10 animate-in fade-in duration-500">
                {/* 1. Item Specifics Timeline Grid */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Item Condition & Specifics</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Condition</p>
                      <p className="text-xs font-black text-slate-900 leading-none">
                        {activity.raw.classified?.condition_label || 'Unspecified'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Brand</p>
                      <p className="text-xs font-black text-slate-900 leading-none truncate">
                        {activity.raw.classified?.brand?.name || 'Generic'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Inquiry Date</p>
                      <p className="text-xs font-black text-slate-900 leading-none">
                        {activity.raw.created_at ? new Date(activity.raw.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/60">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Quantity</p>
                      <p className="text-xs font-black text-slate-900 leading-none">{activity.raw.classified?.item_quantity || 1} Available</p>
                    </div>
                  </div>
                </div>

                {/* 2. Customer Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                  <div className="flex items-start gap-4">
                    <img 
                      src={activity.raw.user?.avatar_url || PLACEHOLDER_AVATAR} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0" 
                      alt="client" 
                    />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead Identity</p>
                      <p className="text-base font-black text-slate-900 leading-tight">{activity.customer}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.raw.email || 'No email provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#6610f2] border border-slate-100 shrink-0">
                      <HiOutlineCheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Inquiry Status</p>
                      <span className={`inline-block mt-1 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${activity.status === 'Resolved' || activity.status === 'Contacted' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-amber-50 text-amber-500 border border-amber-100'}`}>
                        {activity.status}
                      </span>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">{activity.raw.phone || 'No phone provided'}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Detailed Financial Statement / Pricing Classified */}
                {(() => {
                  const basePrice = Number(activity.raw.classified?.base_price || 0);
                  const salePrice = Number(activity.raw.classified?.sale_price || 0);
                  const activePrice = salePrice > 0 ? salePrice : basePrice;

                  return (
                    <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 pt-6 mt-8">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Item Pricing & Proposed Valuation</p>
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>Original Base Price</span>
                          <span className="text-slate-900">${basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        {salePrice > 0 && (
                          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                            <span>Active Sale Price</span>
                            <span className="text-slate-900 text-green-600 font-extrabold">${salePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>Item Condition Status</span>
                          <span className="text-slate-900">{activity.raw.classified?.condition_label || 'Good'}</span>
                        </div>
                        <div className="border-t border-slate-200/60 my-2 pt-4 flex justify-between items-baseline">
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Target Value</span>
                          <span className="text-2xl font-black text-[#6610f2] italic tracking-tight">${activePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
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
            )}

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
                <img 
                  src={activity.raw.user?.avatar_url || PLACEHOLDER_AVATAR} 
                  className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0 shadow-xs" 
                  alt="customer" 
                />
                <div className="bg-slate-50 p-6 rounded-2xl rounded-tl-none border border-slate-100 max-w-[80%]">
                  <p className="text-sm text-slate-600 font-medium">{activity.raw.message || "Hello, I would love to check the details and proceed with this booking."}</p>
                </div>
              </div>
              <div className="flex gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-xl bg-[#6610f2]/10 border border-[#6610f2]/20 flex items-center justify-center text-[#6610f2] font-black text-xs shrink-0 select-none">
                  ME
                </div>
                <div className="bg-[#6610f2] p-6 rounded-2xl rounded-tr-none text-white max-w-[80%] shadow-lg shadow-purple-200">
                  <p className="text-sm font-medium">Greetings! Yes, it is fully active. Let me know if you would like to proceed with the arrangements.</p>
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
          <div 
            onClick={() => navigate(assetUrl)}
            className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden cursor-pointer border border-transparent hover:border-[#6610f2]/50 hover:shadow-[0_20px_50px_rgba(102,16,242,0.15)] group transition-all duration-300"
          >
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">Asset Details</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 rounded-xl bg-white/10 border border-white/10 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={(module === 'properties' ? activity.raw.property?.primary_image_url 
                          : module === 'events' ? activity.raw.event?.primary_image_url 
                          : module === 'autos' ? activity.raw.auto?.primary_image_url 
                          : module === 'joblistings' ? activity.raw.job?.primary_image_url 
                          : module === 'services' ? activity.raw.service?.primary_image_url 
                          : module === 'classifieds' ? activity.raw.classified?.primary_image_url 
                          : null) || PLACEHOLDER_LISTING} 
                    className="w-full h-full object-cover" 
                    alt="asset-preview" 
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black italic truncate group-hover:text-[#9b51e0] transition-colors">{activity.asset}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                    Ref: #ASSET-{(module === 'properties' ? activity.raw.property?.id 
                                  : module === 'events' ? activity.raw.event?.id 
                                  : module === 'autos' ? activity.raw.auto?.id 
                                  : module === 'joblistings' ? activity.raw.job?.id 
                                  : module === 'services' ? activity.raw.service?.id 
                                  : module === 'classifieds' ? activity.raw.classified?.id 
                                  : null) || activity.id}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(assetUrl);
                }}
                className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 group-hover:border-[#6610f2]/40"
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
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{activity.date} • 10:30 AM</p>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#6610f2] border-4 border-white shadow-sm flex items-center justify-center">
                  <HiOutlineChatBubbleLeftRight className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Partner Responded</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{activity.date} • 11:15 AM</p>
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
