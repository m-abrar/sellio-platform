import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import { HiOutlinePlus } from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';
import RecentListingsTable from './RecentListingsTable';
import { 
  HiOutlineHome, 
  HiOutlineBell, 
  HiOutlineChartBar, 
  HiOutlineCurrencyDollar, 
  HiOutlineArrowUpRight,
  HiOutlineChevronRight 
} from 'react-icons/hi2';
import { getDashboardData } from '../../api/dashboard';
import { ApiError } from '../../lib/apiError';

export default function DashboardHome() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInventoryDropdownOpen, setIsInventoryDropdownOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        setData(response.data);
        setLoadError(null);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setLoadError(error instanceof ApiError ? error.message : 'Failed to load dashboard.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerClass = "bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-300";

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Dashboard...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-sm font-bold text-red-500">{loadError}</p>
      </div>
    );
  }

  const { stats, recentListings, healthScore, earningChange } = data || { stats: {}, recentListings: [] };

  return (
    <div className="space-y-10 md:space-y-16 pb-20">
        {/* // highlight={user?.name?.split(' ')[0] || 'Partner'} */}

      <PageHeader 
        badge="Partner Ecosystem" 
        title="Welcome," 
        subtitle="Partner"
      >
        <div className="relative flex-1 md:flex-none">
          <button 
            onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
            className="w-full md:w-auto bg-[#6610f2] text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#7b2dfd] transition-all flex items-center justify-center group"
          >
            <HiOutlinePlus className={`w-4 h-4 mr-3 stroke-[3px] transition-transform duration-300 ${isCreateDropdownOpen ? 'rotate-45' : ''}`} /> Create Listing
          </button>
          
          {isCreateDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsCreateDropdownOpen(false)} />
              <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-2 border-b border-slate-50 mb-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Category</p>
                </div>
                {[
                  { label: 'Property Listing', to: '/dashboard/properties/create' },
                  { label: 'Vehicle / Auto', to: '/dashboard/autos/create' },
                  { label: 'Market Product', to: '/dashboard/products/create' },
                  { label: 'Event Booking', to: '/dashboard/events/create' },
                  { label: 'Professional Service', to: '/dashboard/services/create' },
                  { label: 'Classified Ad', to: '/dashboard/classifieds/create' },
                  { label: 'Job Opening', to: '/dashboard/joblistings/create' }
                ].map((item) => (
                  <button
                    key={item.to}
                    onClick={() => {
                      setIsCreateDropdownOpen(false);
                      navigate(item.to);
                    }}
                    className="w-full text-left px-6 py-3 text-xs font-black text-slate-700 hover:text-[#6610f2] hover:bg-slate-50 transition-colors flex items-center justify-between group"
                  >
                    {item.label}
                    <HiOutlinePlus className="w-3 h-3 text-slate-300 group-hover:text-[#6610f2] transition-colors" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </PageHeader>
      
      {/* 1. KPI GRID */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-10">
        <StatCard 
          title="Active Inventory" 
          value={stats.activeInventory?.toString() || "0"} 
          icon={HiOutlineHome} 
          color="text-[#6610f2] bg-[#6610f2]/5" 
          detailColumns={2}
          details={[
            { label: 'Props', value: stats.moduleCounts?.properties || 0 },
            { label: 'Autos', value: stats.moduleCounts?.autos || 0 },
            { label: 'Prods', value: stats.moduleCounts?.products || 0 },
            { label: 'Jobs', value: stats.moduleCounts?.jobs || 0 }
          ]}
        />
        <StatCard 
          title="Urgent Alerts" 
          value={stats.urgentAlerts?.toString() || "0"} 
          icon={HiOutlineBell} 
          color="text-red-500 bg-red-50" 
          trend="+2 New" 
          details={[
            { label: 'Msgs', value: stats.alerts?.messages || 0 },
            { label: 'Notifs', value: stats.alerts?.notifications || 0 }
          ]}
        />
        <StatCard 
          title="Market Views" 
          value={stats.marketViews?.toLocaleString() || "0"} 
          icon={HiOutlineChartBar} 
          color="text-blue-500 bg-blue-50" 
          details={[
            { label: 'Unique', value: Math.round(Number(stats.marketViews || 0) * 0.58) },
            { label: 'Direct', value: Number(stats.marketViews || 0) - Math.round(Number(stats.marketViews || 0) * 0.58) }
          ]}
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${Number(stats.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={HiOutlineCurrencyDollar} 
          color="text-green-500 bg-green-50" 
          details={[
            { label: 'Earn', value: `$${Number(stats.revenue?.earnings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
            { label: 'Paid', value: `$${Number(stats.revenue?.payouts || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }
          ]}
        />
      </div>

      {/* 2. ACTIVITY & HUD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LIVE INTERACTIONS */}
        <div className={`lg:col-span-8 p-8 md:p-12 ${containerClass}`}>
          <div className="flex justify-between items-center mb-10">
            <div className="min-w-0">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight italic">Live Interactions.</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-2 uppercase tracking-[0.3em]">Real-time buyer activity</p>
            </div>
            <button className="text-[10px] font-black text-slate-300 uppercase hover:text-[#6610f2] transition-colors">Clear All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                name: 'Julian Vance', 
                actionText: 'Viewing',
                listingName: 'Azure Bay Villa', 
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
                listingImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=120&h=80&q=80',
                time: '2m ago'
              },
              { 
                name: 'Sarah Connor', 
                actionText: 'Inquired',
                listingName: 'Tesla Model S Plaid', 
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
                listingImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=120&h=80&q=80',
                time: '15m ago'
              },
              { 
                name: 'Michael Ross', 
                actionText: 'Saved',
                listingName: 'Modern Glass Office Space', 
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
                listingImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=120&h=80&q=80',
                time: '1h ago'
              }
            ].map((interaction, i) => (
              <div key={i} className="group flex items-center p-5 rounded-[1.8rem] bg-slate-50/50 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer">
                {/* 1. User Avatar */}
                <img 
                  src={interaction.avatar} 
                  className="shrink-0 w-12 h-12 rounded-xl object-cover shadow-xs border border-slate-100" 
                  alt={interaction.name} 
                />
                
                {/* 2. Interaction Details */}
                <div className="ms-5 flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-black text-slate-900 leading-none">{interaction.name}</p>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{interaction.time}</span>
                  </div>
                  <p className="text-[10px] font-bold text-[#6610f2] uppercase tracking-widest mt-1.5 opacity-80 leading-none">
                    {interaction.actionText}: <span className="text-slate-500 font-medium normal-case font-sans text-xs ml-1">{interaction.listingName}</span>
                  </p>
                </div>
                
                {/* 3. Listing Thumbnail Preview */}
                <div className="shrink-0 relative w-16 h-10 rounded-lg overflow-hidden border border-slate-100 shadow-xs mr-4 group-hover:scale-105 transition-transform duration-300">
                  <img src={interaction.listingImage} className="w-full h-full object-cover" alt="preview" />
                  <div className="absolute inset-0 bg-black/5" />
                </div>
                
                {/* 4. Action Arrow */}
                <HiOutlineArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-[#6610f2] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* FINANCIAL HUD */}
        <div className="lg:col-span-4 space-y-10 flex flex-col">
          <div className="bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden flex-1 flex flex-col justify-center min-w-0">
            <div className="relative z-10 min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Available Payout</p>
                <div className="flex items-baseline gap-1 text-white mb-10 min-w-0">
                    <h4 
                      className="text-3xl sm:text-4xl xl:text-5xl font-black italic tracking-tighter truncate max-w-full"
                      title={`${earningChange?.currency_symbol ?? '$'}${Number(earningChange?.total ?? 0).toLocaleString()}`}
                    >
                      {earningChange?.currency_symbol ?? '$'}{Number(earningChange?.total ?? 0).toLocaleString()}
                    </h4>
                </div>
                <button 
                  onClick={() => navigate('/dashboard/wallet')}
                  className="w-full bg-[#6610f2] text-white py-5 rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#7b2dfd] active:scale-95 transition-all shadow-lg shadow-purple-900/40"
                >
                    Instant Withdraw
                </button>
            </div>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#6610f2]/20 rounded-full blur-[100px]" />
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#ffc107]" />
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Trust Index</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Listing Health: <span className="text-slate-900 font-bold underline decoration-[#ffc107] decoration-4 underline-offset-4">{healthScore?.statusText ?? 'N/A'}</span> ({healthScore?.score ?? 0}%).
            </p>
          </div>
        </div>
      </div>

      {/* 3. ASSET TABLE SECTION */}
      <div className={`${containerClass} !p-0 overflow-hidden`}>
        <div className="p-10 md:p-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="min-w-0">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight italic leading-none">Recent Assets.</h3>
            <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-3 uppercase tracking-[0.3em]">Inventory Management</p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsInventoryDropdownOpen(!isInventoryDropdownOpen)}
              className="flex items-center gap-3 text-[12px] font-black text-[#6610f2] uppercase tracking-[0.25em] group bg-purple-50/50 hover:bg-purple-50 px-6 py-3 rounded-full transition-all"
            >
              View Inventory <HiOutlineChevronRight className={`w-4 h-4 transition-transform duration-300 ${isInventoryDropdownOpen ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
            </button>
            
            {isInventoryDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsInventoryDropdownOpen(false)} />
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-2 border-b border-slate-50 mb-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Vertical</p>
                  </div>
                  {[
                    { label: 'Properties', to: '/dashboard/properties' },
                    { label: 'Vehicles / Autos', to: '/dashboard/autos' },
                    { label: 'Market Products', to: '/dashboard/products' },
                    { label: 'Event Tickets', to: '/dashboard/events' },
                    { label: 'Client Services', to: '/dashboard/services' },
                    { label: 'General Classifieds', to: '/dashboard/classifieds' },
                    { label: 'Job Listings', to: '/dashboard/joblistings' }
                  ].map((item) => (
                    <button
                      key={item.to}
                      onClick={() => {
                        setIsInventoryDropdownOpen(false);
                        navigate(item.to);
                      }}
                      className="w-full text-left px-6 py-3 text-xs font-black text-slate-700 hover:text-[#6610f2] hover:bg-slate-50 transition-colors flex items-center justify-between group"
                    >
                      {item.label}
                      <HiOutlineChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#6610f2] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        <RecentListingsTable listings={recentListings} />
      </div>
    </div>
  );
}
