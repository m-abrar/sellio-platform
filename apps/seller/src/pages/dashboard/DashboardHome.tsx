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
        <button 
          onClick={() => navigate('/dashboard/products/create')}
          className="flex-1 md:flex-none bg-[#6610f2] text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#7b2dfd] transition-all flex items-center justify-center group"
        >
          <HiOutlinePlus className="w-4 h-4 mr-3 stroke-[3px]" /> Create Listing
        </button>
      </PageHeader>
      
      {/* 1. KPI GRID */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-10">
        <StatCard 
          title="Active Inventory" 
          value={stats.activeInventory?.toString() || "0"} 
          icon={HiOutlineHome} 
          color="text-[#6610f2] bg-[#6610f2]/5" 
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
            { label: 'Unique', value: 1240 },
            { label: 'Direct', value: 890 }
          ]}
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`} 
          icon={HiOutlineCurrencyDollar} 
          color="text-green-500 bg-green-50" 
          details={[
            { label: 'Earn', value: stats.revenue?.earnings || 0 },
            { label: 'Paid', value: stats.revenue?.payouts || 0 }
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
              { name: 'John Doe', action: 'Viewing: Modern Asset', initial: 'J' },
              { name: 'Sarah Smith', action: 'Inquired: G-Wagon', initial: 'S' },
              { name: 'Mike Ross', action: 'Saved: Penthouse', initial: 'M' }
            ].map((user, i) => (
              <div key={i} className="group flex items-center p-6 rounded-[1.5rem] bg-slate-50/50 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer">
                <div className="shrink-0 w-14 h-14 rounded-[1.2rem] bg-white shadow-sm flex items-center justify-center font-black text-[#6610f2] border border-slate-100 text-lg">{user.initial}</div>
                <div className="ms-6 flex-1 min-w-0">
                  <p className="text-base font-black text-slate-900">{user.name}</p>
                  <p className="text-[11px] font-bold text-[#6610f2] uppercase tracking-widest opacity-70">{user.action}</p>
                </div>
                <HiOutlineArrowUpRight className="w-6 h-6 text-slate-300 group-hover:text-[#6610f2] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            ))}
          </div>
        </div>

        {/* FINANCIAL HUD */}
        <div className="lg:col-span-4 space-y-10 flex flex-col">
          <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden flex-1 flex flex-col justify-center">
            <div className="relative z-10">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Available Payout</p>
                <div className="flex items-baseline gap-1 text-white mb-12">
                    <h4 className="text-5xl md:text-6xl font-black italic tracking-tighter">
                      {earningChange?.currency_symbol ?? '$'}{Number(earningChange?.total ?? 0).toLocaleString()}
                    </h4>
                </div>
                <button 
                  onClick={() => navigate('/dashboard/analytics')}
                  className="w-full bg-[#6610f2] text-white py-6 rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#7b2dfd] active:scale-95 transition-all shadow-lg shadow-purple-900/40"
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
          <button 
            onClick={() => navigate('/dashboard/products')}
            className="flex items-center gap-3 text-[12px] font-black text-[#6610f2] uppercase tracking-[0.25em] group"
          >
            View Inventory <HiOutlineChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
        
        <RecentListingsTable listings={recentListings} />
      </div>
    </div>
  );
}
