import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import {
  HiOutlinePlus,
  HiOutlineHome,
  HiOutlineBell,
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineArrowUpRight,
  HiOutlineChevronRight,
  HiOutlineArrowTrendingUp,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';
import RecentListingsTable from './RecentListingsTable';
import AnalyticsChartWidget from './AnalyticsChartWidget';
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
          getLiveInteractions(),
        ]);
        setData(dashboardRes.data);
        if (activitiesRes?.recentActivity) setActivities(activitiesRes.recentActivity);
        setLoadError(null);
      } catch (error) {
        setLoadError(error instanceof ApiError ? error.message : 'Failed to load dashboard.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-label font-semibold uppercase tracking-caps-xl text-slate-300 animate-pulse">
          Loading...
        </span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-sm font-semibold text-red-500">{loadError}</p>
      </div>
    );
  }

  const { stats, recentListings, healthScore, earningChange, verticalsData, subscriptionLimits } =
    data || { stats: {}, recentListings: [], verticalsData: null, subscriptionLimits: null };

  const displayActivities = activities.slice(0, 6).map((item) => ({
    name: item.user || 'Anon',
    actionText: item.type || 'Activity',
    listingName: item.description || item.title || 'Interaction',
    avatar: item.avatar || PLACEHOLDER_AVATAR,
    listingImage: item.image || PLACEHOLDER_LISTING,
    time: item.time || 'just now',
    route: item.route || '/dashboard/live-interactions',
  }));

  const CREATE_ITEMS = [
    { label: 'Property Listing', to: '/dashboard/properties/create' },
    { label: 'Vehicle / Auto', to: '/dashboard/autos/create' },
    { label: 'Market Product', to: '/dashboard/products/create' },
    { label: 'Event Booking', to: '/dashboard/events/create' },
    { label: 'Professional Service', to: '/dashboard/services/create' },
    { label: 'Classified Ad', to: '/dashboard/classifieds/create' },
    { label: 'Job Opening', to: '/dashboard/joblistings/create' },
  ];

  const INVENTORY_ITEMS = [
    { label: 'Properties', to: '/dashboard/properties' },
    { label: 'Vehicles / Autos', to: '/dashboard/autos' },
    { label: 'Market Products', to: '/dashboard/products' },
    { label: 'Event Tickets', to: '/dashboard/events' },
    { label: 'Client Services', to: '/dashboard/services' },
    { label: 'General Classifieds', to: '/dashboard/classifieds' },
    { label: 'Job Listings', to: '/dashboard/joblistings' },
  ];

  return (
    <div className="space-y-10 md:space-y-14 pb-24">
      {/* ── Page Header ───────────────────────────── */}
      <PageHeader
        badge={subscriptionLimits?.is_limit_exceeded ? 'Limit Reached ⚠️' : 'Dashboard'}
        title="Welcome,"
        subtitle="back"
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
            className="w-full md:w-auto bg-brand text-white px-6 py-3 rounded-2xl font-bold text-caption uppercase tracking-label-sm shadow-lg shadow-brand/25 hover:bg-brand-hover hover:shadow-brand/35 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
          >
            <HiOutlinePlus className={`w-4 h-4 stroke-[2.5px] transition-transform duration-300 ${isCreateDropdownOpen ? 'rotate-45' : ''}`} />
            Create Listing
          </button>

          {isCreateDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsCreateDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-micro font-semibold text-slate-400 uppercase tracking-widest">What are you listing?</p>
                </div>
                {CREATE_ITEMS.map((item) => (
                  <button
                    key={item.to}
                    onClick={() => { setIsCreateDropdownOpen(false); navigate(item.to); }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-brand hover:bg-slate-50 transition-colors flex items-center justify-between group"
                  >
                    {item.label}
                    <HiOutlinePlus className="w-3 h-3 text-slate-300 group-hover:text-brand transition-colors" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </PageHeader>

      {/* ── KPI Grid — asymmetric 5-col on desktop ── */}
      <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">

        {/* Your Listings — wider, has the most detail */}
        <div className="col-span-2 lg:col-span-4">
          <StatCard
            title="Your Listings"
            value={stats.activeInventory?.toString() || '0'}
            icon={HiOutlineHome}
            color={subscriptionLimits?.is_limit_exceeded ? 'text-red-500 bg-red-50' : 'text-brand bg-brand/8'}
            trend={subscriptionLimits?.is_limit_exceeded ? 'Limit Reached' : undefined}
            detailColumns={2}
            details={[
              { label: 'Props',  value: stats.moduleCounts?.properties || 0 },
              { label: 'Autos',  value: stats.moduleCounts?.autos || 0 },
              { label: 'Prods',  value: stats.moduleCounts?.products || 0 },
              { label: 'Events', value: stats.moduleCounts?.events || 0 },
              { label: 'Servs',  value: stats.moduleCounts?.services || 0 },
              { label: 'Class',  value: stats.moduleCounts?.classifieds || 0 },
              { label: 'Jobs',   value: stats.moduleCounts?.jobs || 0 },
            ]}
          />
        </div>

        {/* Needs Attention */}
        <div className="col-span-1 lg:col-span-2">
          <StatCard
            title="Needs Attention"
            value={stats.urgentAlerts?.toString() || '0'}
            icon={HiOutlineBell}
            color="text-red-500 bg-red-50"
            trend="+2 New"
            details={[
              { label: 'Msgs',   value: stats.alerts?.messages || 0 },
              { label: 'Notifs', value: stats.alerts?.notifications || 0 },
            ]}
          />
        </div>

        {/* Total Views */}
        <div className="col-span-1 lg:col-span-2">
          <StatCard
            title="Total Views"
            value={stats.marketViews?.toLocaleString() || '0'}
            icon={HiOutlineChartBar}
            color="text-blue-500 bg-blue-50"
            details={[
              { label: 'Unique', value: Math.round(Number(stats.marketViews || 0) * 0.58) },
              { label: 'Direct', value: Number(stats.marketViews || 0) - Math.round(Number(stats.marketViews || 0) * 0.58) },
            ]}
          />
        </div>

        {/* Revenue — also wider */}
        <div className="col-span-2 lg:col-span-4">
          <StatCard
            title="Total Revenue"
            value={`$${Number(stats.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={HiOutlineCurrencyDollar}
            color="text-emerald-500 bg-emerald-50"
            details={[
              { label: 'Earned', value: `$${Number(stats.revenue?.earnings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
              { label: 'Paid out', value: `$${Number(stats.revenue?.payouts || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
            ]}
          />
        </div>

      </div>

      {/* ── Analytics Chart ───────────────────────── */}
      <AnalyticsChartWidget verticalsData={verticalsData} />

      {/* ── Activity + Financial HUD ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8">

        {/* Live Interactions */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-card p-5 sm:p-8 md:p-10">
          <div className="flex justify-between items-start mb-5 sm:mb-8">
            <div>
              <h3 className="text-2xl md:text-title font-black text-slate-900 tracking-tight italic leading-tight">
                Recent Activity.
              </h3>
              <p className="text-label font-semibold text-slate-400 uppercase tracking-label-wide mt-1.5">
                What's happening right now
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/live-interactions')}
              className="text-label font-semibold text-brand uppercase tracking-widest hover:opacity-70 transition-opacity shrink-0 flex items-center gap-1"
            >
              View All <HiOutlineChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {displayActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-200 mx-auto">
                <HiOutlineArrowUpRight className="w-6 h-6" />
              </div>
              <p className="text-label font-semibold uppercase tracking-label-caps text-slate-300">No interactions yet</p>
              <p className="text-xs text-slate-400 font-medium max-w-xs leading-relaxed">
                Buyer activity will appear here once your listings go live.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayActivities.map((interaction, i) => (
                <div
                  key={i}
                  onClick={() => navigate(interaction.route)}
                  className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50/80 transition-all cursor-pointer"
                >
                  <img
                    src={interaction.avatar}
                    className="shrink-0 w-10 h-10 rounded-xl object-cover border border-slate-100"
                    alt={interaction.name}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <p className="text-nav font-semibold text-slate-900 leading-none truncate group-hover:text-brand transition-colors">
                        {interaction.name}
                      </p>
                      <span className="text-micro font-medium text-slate-400 shrink-0">{interaction.time}</span>
                    </div>
                    <p className="text-label font-medium text-slate-500 truncate">
                      <span className="text-brand font-semibold">{interaction.actionText}</span>
                      {' — '}
                      {interaction.listingName}
                    </p>
                  </div>
                  <div className="hidden sm:block shrink-0 w-14 h-9 rounded-lg overflow-hidden border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                    <img src={interaction.listingImage} className="w-full h-full object-cover" alt="" />
                  </div>
                  <HiOutlineArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Financial HUD */}
        <div className="lg:col-span-4 flex flex-col gap-5">

          {/* Payout card */}
          <div className="bg-slate-900 rounded-card p-8 relative overflow-hidden flex-1 flex flex-col justify-between min-h-[200px]">
            <div className="relative z-10">
              <p className="text-micro font-semibold uppercase tracking-caps text-slate-500 mb-3">Available Payout</p>
              <p
                className="text-4xl xl:text-5xl font-black text-white tracking-tight italic leading-none mb-8"
                title={`${earningChange?.currency_symbol ?? '$'}${Number(earningChange?.total ?? 0).toLocaleString()}`}
              >
                {earningChange?.currency_symbol ?? '$'}{Number(earningChange?.total ?? 0).toLocaleString()}
              </p>
              <button
                onClick={() => navigate('/dashboard/wallet')}
                className="w-full bg-brand text-white py-3.5 rounded-xl font-bold text-caption uppercase tracking-label-sm hover:bg-brand-hover active:scale-[0.98] transition-all shadow-lg shadow-brand/30 flex items-center justify-center gap-2"
              >
                <HiOutlineArrowUpRight className="w-4 h-4" />
                Instant Withdraw
              </button>
            </div>
            {/* Background glow */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-brand/25 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-12 -left-6 w-32 h-32 bg-violet-900/40 rounded-full blur-[60px] pointer-events-none" />
          </div>

          {/* Trust Index */}
          <div className="bg-white rounded-card border border-slate-100 p-6 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-400 rounded-l-[1.75rem]" />
            <div className="flex items-start gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <HiOutlineSparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-label font-semibold text-slate-900 uppercase tracking-widest mb-1">Your Rating</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Listing Health:{' '}
                  <span className="text-slate-900 font-semibold">
                    {healthScore?.statusText ?? 'N/A'}
                  </span>{' '}
                  <span className="text-slate-400">({healthScore?.score ?? 0}%)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Quota */}
          {subscriptionLimits && (
            <div
              className="bg-white rounded-card border border-slate-100 p-6 relative overflow-hidden cursor-pointer hover:border-brand/20 hover:shadow-brand-glow transition-all duration-300 group"
              onClick={() => navigate('/dashboard/memberships')}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand rounded-l-[1.75rem]" />
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-label font-semibold text-slate-900 uppercase tracking-widest mb-1">Plan Usage</p>
                  <p className="text-xs font-medium text-slate-500">{subscriptionLimits.plan_title}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-micro font-semibold ${
                  subscriptionLimits.is_limit_exceeded ? 'bg-red-50 text-red-500' : 'bg-violet-50 text-brand'
                }`}>
                  {subscriptionLimits.is_limit_exceeded ? '⚠️ Limit' : 'Active'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-label font-medium">
                  <span className="text-slate-400">Used</span>
                  <span className="text-slate-900 font-bold">
                    {subscriptionLimits.current_listings_count}
                    <span className="text-slate-400 font-medium"> / {subscriptionLimits.max_listings === 999 ? '∞' : subscriptionLimits.max_listings}</span>
                  </span>
                </div>
                {subscriptionLimits.max_listings > 0 && subscriptionLimits.max_listings !== 999 ? (
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (subscriptionLimits.current_listings_count / subscriptionLimits.max_listings) * 100)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${subscriptionLimits.is_limit_exceeded ? 'bg-red-500' : 'bg-brand'}`}
                    />
                  </div>
                ) : (
                  <div className="h-1.5 bg-violet-100 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-brand rounded-full" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Assets Table ───────────────────── */}
      <div className="bg-white border border-slate-100 rounded-card overflow-hidden">
        <div className="px-5 sm:px-8 md:px-12 py-5 sm:py-7 md:py-9 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50">
          <div>
            <h3 className="text-2xl md:text-title font-black text-slate-900 tracking-tight italic leading-tight">
              Your Listings.
            </h3>
            <p className="text-label font-semibold text-slate-400 uppercase tracking-label-wide mt-1.5">
              Latest additions
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsInventoryDropdownOpen(!isInventoryDropdownOpen)}
              className="flex items-center gap-2 text-caption font-semibold text-brand uppercase tracking-label-sm bg-violet-50/80 hover:bg-violet-100/60 px-5 py-2.5 rounded-full transition-all"
            >
              View Inventory
              <HiOutlineChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isInventoryDropdownOpen ? 'rotate-90' : ''}`} />
            </button>

            {isInventoryDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsInventoryDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-micro font-semibold text-slate-400 uppercase tracking-widest">Go to...</p>
                  </div>
                  {INVENTORY_ITEMS.map((item) => (
                    <button
                      key={item.to}
                      onClick={() => { setIsInventoryDropdownOpen(false); navigate(item.to); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-brand hover:bg-slate-50 transition-colors flex items-center justify-between group"
                    >
                      {item.label}
                      <HiOutlineChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
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
