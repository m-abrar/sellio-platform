import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import { HiOutlinePlus } from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';
import RecentListingsTable from './RecentListingsTable';
import AnalyticsChartWidget from './AnalyticsChartWidget';
import { 
  HiOutlineHome, 
  HiOutlineBell, 
  HiOutlineChartBar, 
  HiOutlineCurrencyDollar, 
  HiOutlineArrowUpRight,
  HiOutlineChevronRight 
} from 'react-icons/hi2';
import { getDashboardData, getLiveInteractions } from '../../api/dashboard';
import { ApiError } from '../../lib/apiError';
import UpgradePlanModal from '../../components/modals/UpgradePlanModal';
import { PLACEHOLDER_AVATAR, PLACEHOLDER_LISTING } from '../../constants/placeholders';

export default function DashboardHome() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInventoryDropdownOpen, setIsInventoryDropdownOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, activitiesRes] = await Promise.all([
          getDashboardData(),
          getLiveInteractions()
        ]);
        setData(dashboardRes.data);
        if (activitiesRes && activitiesRes.recentActivity) {
          setActivities(activitiesRes.recentActivity);
        }
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

  const { stats, recentListings, healthScore, earningChange, verticalsData, subscriptionLimits } = data || { stats: {}, recentListings: [], verticalsData: null, subscriptionLimits: null };

  const displayActivities = activities.slice(0, 6).map((item) => ({
    name: item.user || 'Anon',
    actionText: item.type || 'Activity',
    listingName: item.description || item.title || 'Interaction',
    avatar: item.avatar || PLACEHOLDER_AVATAR,
    listingImage: item.image || PLACEHOLDER_LISTING,
    time: item.time || 'just now',
    route: item.route || '/dashboard/live-interactions',
  }));

  return (
    <div className="space-y-10 md:space-y-16 pb-20">
        {/* // highlight={user?.name?.split(' ')[0] || 'Partner'} */}

      <PageHeader 
        badge={subscriptionLimits?.is_limit_exceeded ? "Limit Exceeded ⚠️" : "Seller Account"} 
        title="Welcome," 
        subtitle="Partner"
      >
        <div className="relative flex-1 md:flex-none">
          <button 
            onClick={() => {
              if (subscriptionLimits?.is_limit_exceeded) {
                setIsUpgradeModalOpen(true);
              } else {
                setIsCreateDropdownOpen(!isCreateDropdownOpen);
              }
            }}
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
          color={subscriptionLimits?.is_limit_exceeded ? "text-red-500 bg-red-50" : "text-[#6610f2] bg-[#6610f2]/5"} 
          trend={subscriptionLimits?.is_limit_exceeded ? "Limit Reached" : undefined}
          detailColumns={2}
          details={[
            { label: 'Props', value: stats.moduleCounts?.properties || 0 },
            { label: 'Autos', value: stats.moduleCounts?.autos || 0 },
            { label: 'Prods', value: stats.moduleCounts?.products || 0 },
            { label: 'Events', value: stats.moduleCounts?.events || 0 },
            { label: 'Servs', value: stats.moduleCounts?.services || 0 },
            { label: 'Class', value: stats.moduleCounts?.classifieds || 0 },
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

      {/* PERFORMANCE METRICS CHART */}
      <AnalyticsChartWidget verticalsData={verticalsData} />

      {/* 2. ACTIVITY & HUD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LIVE INTERACTIONS */}
        <div className={`lg:col-span-8 p-8 md:p-12 ${containerClass}`}>
          <div className="flex justify-between items-center mb-10">
            <div className="min-w-0">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight italic">Live Interactions.</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-2 uppercase tracking-[0.3em]">Real-time buyer activity</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/live-interactions')}
              className="text-[10px] font-black text-[#6610f2] uppercase hover:underline hover:scale-105 active:scale-95 transition-all tracking-widest"
            >
              View All
            </button>
          </div>
          
          {displayActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mx-auto">
                <HiOutlineArrowUpRight className="w-7 h-7" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">No interactions yet</p>
              <p className="text-xs text-slate-400 font-medium max-w-xs">Buyer activity will appear here once your listings go live.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayActivities.map((interaction, i) => (
                <div
                  key={i}
                  onClick={() => navigate(interaction.route)}
                  className="group flex items-center p-5 rounded-[1.8rem] bg-slate-50/50 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer"
                >
                  <img
                    src={interaction.avatar}
                    className="shrink-0 w-12 h-12 rounded-xl object-cover shadow-xs border border-slate-100"
                    alt={interaction.name}
                  />
                  <div className="ms-5 flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="text-sm font-black text-slate-900 leading-none group-hover:text-[#6610f2] transition-colors">{interaction.name}</p>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{interaction.time}</span>
                    </div>
                    <p className="text-[10px] font-bold text-[#6610f2] uppercase tracking-widest mt-1.5 opacity-80 leading-none truncate max-w-lg">
                      {interaction.actionText}: <span className="text-slate-500 font-medium normal-case font-sans text-xs ml-1">{interaction.listingName}</span>
                    </p>
                  </div>
                  <div className="shrink-0 relative w-16 h-10 rounded-lg overflow-hidden border border-slate-100 shadow-xs mr-4 group-hover:scale-105 transition-transform duration-300">
                    <img src={interaction.listingImage} className="w-full h-full object-cover" alt="preview" />
                    <div className="absolute inset-0 bg-black/5" />
                  </div>
                  <HiOutlineArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-[#6610f2] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FINANCIAL HUD */}
        <div className="lg:col-span-4 space-y-10 flex flex-col">
          <div className="bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden flex-1 flex flex-col justify-center min-w-0">
            <div className="relative z-10 min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Available Payout</p>
                <div className="flex items-baseline gap-1 text-white mb-10 min-w-0">
                    <h4 
                      className="text-3xl sm:text-4xl xl:text-5xl font-black italic tracking-tighter shrink-0"
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

          {/* COMPACT SUBSCRIPTION QUOTA PREVIEW */}
          {subscriptionLimits && (
            <div 
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:border-[#6610f2]/20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 duration-500" 
              onClick={() => navigate('/dashboard/memberships')}
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-[#6610f2]" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1.5">Active Quota Preview</h4>
                  <p className="text-xs font-bold text-slate-500">{subscriptionLimits.plan_title}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${subscriptionLimits.is_limit_exceeded ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-[#6610f2]'}`}>
                  {subscriptionLimits.is_limit_exceeded ? 'Limit Hit ⚠️' : 'Active'}
                </span>
              </div>

              {/* Progress and numbers */}
              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-baseline text-[10px] font-bold">
                  <span className="text-slate-400">Quota Consumed</span>
                  <span className="text-slate-900 font-black">
                    {subscriptionLimits.current_listings_count} <span className="text-slate-400 font-medium">/ {subscriptionLimits.max_listings === 999 ? 'Unlimited' : subscriptionLimits.max_listings}</span>
                  </span>
                </div>

                {/* Progress Bar */}
                {subscriptionLimits.max_listings > 0 && subscriptionLimits.max_listings !== 999 ? (
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${Math.min(100, (subscriptionLimits.current_listings_count / subscriptionLimits.max_listings) * 100)}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${subscriptionLimits.is_limit_exceeded ? 'from-red-500 to-[#6610f2]' : 'from-[#6610f2] to-purple-500'}`}
                    />
                  </div>
                ) : (
                  <div className="w-full h-2 bg-purple-50 rounded-full flex items-center">
                    <div className="w-full h-1 bg-[#6610f2] rounded-full" />
                  </div>
                )}
              </div>
            </div>
          )}
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
      {subscriptionLimits && (
        <UpgradePlanModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)} 
          limits={subscriptionLimits} 
        />
      )}
    </div>
  );
}
