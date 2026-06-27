import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getListingAnalytics, type ListingAnalyticsPayload } from '../../api/analytics';
import { 
  HiOutlineArrowLeft, 
  HiOutlineEye, 
  HiOutlineUser, 
  HiOutlineArrowTrendingUp, 
  HiOutlineBanknotes,
  HiOutlineArrowPath,
  HiOutlinePencilSquare,
  HiOutlineHomeModern,
  HiOutlineListBullet
} from 'react-icons/hi2';
import { toast } from 'sonner';

interface VerticalConfig {
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  gradId: string;
  module: string;
}

const VERTICALS: Record<string, VerticalConfig> = {
  Property: { label: 'Real Estate', icon: '🏠', color: '#3b82f6', bg: 'bg-blue-50/50', border: 'border-blue-100', gradId: 'singlePropGrad', module: 'properties' },
  Auto: { label: 'Automotive', icon: '🚗', color: '#f59e0b', bg: 'bg-amber-50/50', border: 'border-amber-100', gradId: 'singleAutoGrad', module: 'autos' },
  Product: { label: 'Market Product', icon: '📦', color: '#f43f5e', bg: 'bg-rose-50/50', border: 'border-rose-100', gradId: 'singleProdGrad', module: 'products' },
  Event: { label: 'Event Booking', icon: '🎟️', color: '#10b981', bg: 'bg-emerald-50/50', border: 'border-emerald-100', gradId: 'singleEventGrad', module: 'events' },
  Service: { label: 'Client Service', icon: '💼', color: '#06b6d4', bg: 'bg-cyan-50/50', border: 'border-cyan-100', gradId: 'singleServGrad', module: 'services' },
  JobListing: { label: 'Job Opening', icon: '🤝', color: '#6366f1', bg: 'bg-indigo-50/50', border: 'border-indigo-100', gradId: 'singleJobGrad', module: 'joblistings' },
  Classified: { label: 'Classified Ad', icon: '🏷️', color: '#64748b', bg: 'bg-slate-50/50', border: 'border-slate-100', gradId: 'singleClassGrad', module: 'classifieds' },
};

export default function ListingAnalyticsPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ListingAnalyticsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [period, setPeriod] = useState<number>(30);

  const config = useMemo(() => {
    if (!type) return VERTICALS.Property;
    return VERTICALS[type] || VERTICALS.Property;
  }, [type]);

  const fetchListingData = async (activePeriod = period) => {
    if (!type || !id) return;
    try {
      const payload = await getListingAnalytics(type, id, activePeriod);
      setData(payload);
    } catch (error) {
      console.error('Failed to load listing analytics', error);
      toast.error('Failed to load analytical workspace.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchListingData();
  }, [type, id, period]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchListingData();
      toast.success('Listing stats synced successfully!');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-label font-black uppercase tracking-caps-xl text-slate-300 animate-pulse">
          Calibrating Listing Cockpit...
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-6">
        <p className="text-label font-black uppercase tracking-caps-xl text-slate-300">Listing Metrics Not Found</p>
        <button 
          onClick={() => navigate('/dashboard/analytics')} 
          className="text-brand font-black uppercase text-xs tracking-widest flex items-center gap-2"
        >
          <HiOutlineArrowLeft className="w-4 h-4" /> Back to Analytics
        </button>
      </div>
    );
  }

  const kpis = [
    { label: 'Views', value: data.performanceData.total_views.toLocaleString(), desc: 'Total views over this period', icon: HiOutlineEye, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Inquiries', value: data.performanceData.total_leads.toLocaleString(), desc: 'People who reached out', icon: HiOutlineUser, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Lead Rate', value: `${data.performanceData.conversion_rate}%`, desc: 'Views that became inquiries', icon: HiOutlineArrowTrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Earnings', value: `$${data.performanceData.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, desc: 'Total earned this period', icon: HiOutlineBanknotes, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-10 md:space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Back button row */}
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/dashboard/analytics')} 
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-brand hover:border-brand/20 transition-all cursor-pointer"
        >
          <HiOutlineArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-label font-black text-slate-400 uppercase tracking-caps-wide">Back to Hub</span>
      </div>

      {/* Header Row */}
      <PageHeader 
        badge={`${config.icon} ${config.label} Metrics`} 
        title={data.listing.title} 
        subtitle={`ID: #${data.listing.id}`}
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-brand hover:border-brand/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shadow-sm"
          >
            <HiOutlineArrowPath className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-brand' : ''}`} />
          </button>

          {/* Period selector */}
          <div className="flex bg-slate-50 border border-slate-100 p-1.5 rounded-2xl">
            {[30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setPeriod(days)}
                className={`px-4 py-2 rounded-xl text-micro font-black uppercase tracking-wider transition-all cursor-pointer ${
                  period === days
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      {/* KPI Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              className="bg-white p-8 rounded-card-lg border border-slate-100 shadow-elite-soft transition-all duration-500 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-label font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 stroke-[2.2px]" />
                </div>
              </div>
              <h4 className="text-3xl font-black text-slate-900 tracking-tight italic">{kpi.value}</h4>
              <p className="text-micro font-bold text-slate-400 uppercase tracking-wider mt-3">{kpi.desc}</p>
            </div>
          );
        })}
      </div>

      {/* MAIN PLOT & SIDEBAR PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Daily Leads/Views Trends Plot */}
        <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-container border border-slate-100 shadow-elite-soft flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight mb-2">Trend Velocity.</h3>
            <p className="text-label font-black text-slate-400 uppercase tracking-caps-wide mb-10">Concurrent Views vs. Leads logs</p>
          </div>

          <div className="h-96 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={config.gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const viewsPt = payload.find(p => p.name === 'Views' || p.dataKey === 'views');
                      const leadsPt = payload.find(p => p.name === 'Leads' || p.dataKey === 'leads');
                      return (
                        <div className="bg-white/95 backdrop-blur-md border border-slate-100 p-5 rounded-2xl shadow-xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                          <p className="text-micro font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">{payload[0].payload.name}</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-4 justify-between min-w-[100px]">
                              <span className="text-label font-bold text-slate-500 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} /> Views
                              </span>
                              <span className="text-xs font-black text-slate-900">{viewsPt?.value ?? 0}</span>
                            </div>
                            <div className="flex items-center gap-4 justify-between min-w-[100px]">
                              <span className="text-label font-bold text-slate-500 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Leads
                              </span>
                              <span className="text-xs font-black text-slate-900">{leadsPt?.value ?? 0}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" name="Views" dataKey="views" stroke={config.color} strokeWidth={4} fillOpacity={1} fill={`url(#${config.gradId})`} />
                <Area type="monotone" name="Leads" dataKey="leads" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#leadsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SIDEBAR ACTION PANEL */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Actions Panel */}
          <div className="bg-slate-900 p-10 rounded-container text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div>
              <h4 className="text-caption font-black uppercase tracking-caps-wide text-slate-500 mb-8">Asset Cockpit</h4>
              
              <div className="space-y-4">
                <button 
                  onClick={() => navigate(`/dashboard/${config.module}/view/${data.listing.slug || data.listing.id}`)}
                  className="w-full bg-white/10 hover:bg-white/20 py-4.5 rounded-2xl font-black text-label uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HiOutlineHomeModern className="w-4 h-4" /> View Asset Details
                </button>
                <button 
                  onClick={() => navigate(`/dashboard/${config.module}/edit/${data.listing.slug || data.listing.id}`)}
                  className="w-full bg-white/10 hover:bg-white/20 py-4.5 rounded-2xl font-black text-label uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HiOutlinePencilSquare className="w-4 h-4" /> Edit Listing
                </button>
                <button 
                  onClick={() => navigate(`/dashboard/${config.module}`)}
                  className="w-full bg-white/10 hover:bg-white/20 py-4.5 rounded-2xl font-black text-label uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HiOutlineListBullet className="w-4 h-4" /> View All Listings
                </button>
              </div>
            </div>

            <div className="text-micro font-black text-slate-600 uppercase tracking-widest mt-8 border-t border-white/5 pt-4">
              Category: {type}
            </div>

            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-brand/10 rounded-full blur-[80px]" />
          </div>

          {/* Quick Context Card */}
          <div className="bg-white p-10 rounded-container border border-slate-100 shadow-premium">
            <h4 className="text-caption font-black uppercase tracking-caps-wide text-slate-400 mb-6">Quick Overview</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Asset ID</span>
                <span className="text-slate-900 font-extrabold">#{data.listing.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Vertical category</span>
                <span className="text-slate-900 font-extrabold uppercase tracking-wider">{type === 'JobListing' ? 'Job' : type}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Total Views</span>
                <span className="text-slate-900 font-extrabold">{data.performanceData.total_views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Lead Rate</span>
                <span className="text-slate-900 font-extrabold">{data.performanceData.conversion_rate}%</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
