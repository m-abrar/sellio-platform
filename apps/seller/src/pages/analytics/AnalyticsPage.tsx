import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getAnalytics, type DetailedListingPerformance } from '../../api/analytics';
import { HiOutlineMagnifyingGlass, HiOutlineArrowDownTray } from 'react-icons/hi2';

interface VerticalMetadata {
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  gradId: string;
  bg: string;
  border: string;
}

const VERTICALS: Record<string, VerticalMetadata> = {
  All: { label: 'All Categories', shortLabel: 'All', icon: '⚡', color: '#6610f2', gradId: 'allGrad', bg: 'bg-purple-50/50', border: 'border-purple-100' },
  Property: { label: 'Real Estate', shortLabel: 'Property', icon: '🏠', color: '#3b82f6', gradId: 'propertyGrad', bg: 'bg-blue-50/50', border: 'border-blue-100' },
  Auto: { label: 'Automotive', shortLabel: 'Auto', icon: '🚗', color: '#f59e0b', gradId: 'autoGrad', bg: 'bg-amber-50/50', border: 'border-amber-100' },
  Product: { label: 'Market Products', shortLabel: 'Product', icon: '📦', color: '#f43f5e', gradId: 'productGrad', bg: 'bg-rose-50/50', border: 'border-rose-100' },
  Event: { label: 'Event Bookings', shortLabel: 'Event', icon: '🎟️', color: '#10b981', gradId: 'eventGrad', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
  Service: { label: 'Client Services', shortLabel: 'Service', icon: '💼', color: '#06b6d4', gradId: 'serviceGrad', bg: 'bg-cyan-50/50', border: 'border-cyan-100' },
  Job: { label: 'Job Openings', shortLabel: 'Job', icon: '🤝', color: '#6366f1', gradId: 'jobGrad', bg: 'bg-indigo-50/50', border: 'border-indigo-100' },
  Classified: { label: 'Classified Ads', shortLabel: 'Classified', icon: '🏷️', color: '#64748b', gradId: 'classifiedGrad', bg: 'bg-slate-50/50', border: 'border-slate-100' },
};

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [selectedVertical, setSelectedVertical] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getListingPath = (type: string, id: number) => {
    const mapping: Record<string, string> = {
      Property: 'properties',
      Auto: 'autos',
      Product: 'products',
      Event: 'events',
      Service: 'services',
      JobListing: 'joblistings',
      Classified: 'classifieds',
    };
    const module = mapping[type] || 'properties';
    return `/dashboard/${module}/view/${id}`;
  };
  
  const [payload, setPayload] = useState<any>(null);
  const [detailedListings, setDetailedListings] = useState<DetailedListingPerformance[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getAnalytics(30);
        setPayload(response.data);
        setDetailedListings(response.data.detailedPerformance ?? []);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // 1. Resolve daily points for All Verticals dynamically to ensure 100% data consistency
  const allChartPoints = useMemo(() => {
    if (!payload?.verticalsData) return [];
    
    const datesMap: Record<string, { name: string; views: number; leads: number }> = {};
    
    Object.keys(payload.verticalsData).forEach((key) => {
      const points = payload.verticalsData[key].chartPoints ?? [];
      points.forEach((pt) => {
        if (!datesMap[pt.name]) {
          datesMap[pt.name] = { name: pt.name, views: 0, leads: 0 };
        }
        datesMap[pt.name].views += pt.views;
        datesMap[pt.name].leads += pt.leads;
      });
    });

    return Object.values(datesMap);
  }, [payload]);

  // 2. Resolve active chart data stream
  const activeChartData = useMemo(() => {
    if (selectedVertical === 'All') return allChartPoints;
    return payload?.verticalsData?.[selectedVertical]?.chartPoints ?? [];
  }, [payload, selectedVertical, allChartPoints]);

  // 3. Resolve dynamic summary KPIs based on selected vertical
  const summary = useMemo(() => {
    if (!payload) {
      return { views: 0, leads: 0, conversionRate: '0.00', earnings: 0 };
    }

    if (selectedVertical === 'All') {
      const views = allChartPoints.reduce((sum, pt) => sum + pt.views, 0);
      const leads = allChartPoints.reduce((sum, pt) => sum + pt.leads, 0);
      const rate = views > 0 ? (leads / views) * 100 : 0;
      return {
        views: views > 0 ? views : payload.performanceData?.total_views ?? 0,
        leads: leads > 0 ? leads : payload.performanceData?.total_leads ?? 0,
        conversionRate: rate > 0 ? rate.toFixed(2) : payload.performanceData?.conversion_rate ?? '0.00',
        earnings: payload.totalEarnings ?? 0,
      };
    }

    const vData = payload.verticalsData?.[selectedVertical] ?? { views: 0, leads: 0, conversion_rate: '0.00' };
    
    // Sum vertical-specific listing revenues
    const matchType = selectedVertical === 'Job' ? 'JobListing' : selectedVertical;
    const verticalRevenue = detailedListings
      .filter((l) => l.type === matchType)
      .reduce((sum, l) => sum + Number(l.revenue ?? 0), 0);

    return {
      views: vData.views,
      leads: vData.leads,
      conversionRate: vData.conversion_rate,
      earnings: verticalRevenue,
    };
  }, [payload, selectedVertical, allChartPoints, detailedListings]);

  // 4. Resolve and filter detailed listing metrics
  const filteredListings = useMemo(() => {
    let list = detailedListings;
    if (selectedVertical !== 'All') {
      const matchType = selectedVertical === 'Job' ? 'JobListing' : selectedVertical;
      list = list.filter((l) => l.type === matchType);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter((l) => l.title.toLowerCase().includes(query));
    }
    return list;
  }, [detailedListings, selectedVertical, searchQuery]);

  const activeMeta = VERTICALS[selectedVertical] ?? VERTICALS.All;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">
          Syncing Analytics Hub...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 1. Header Row */}
      <PageHeader badge="Performance" title="Market" subtitle="Intelligence" />

      {/* 2. Responsive Symmetrical Grid Slicer (Zero Horizontal Scroll) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5 w-full bg-slate-50/50 p-3 rounded-[2.5rem] border border-slate-100/75 shadow-xs">
        {Object.keys(VERTICALS).map((key) => {
          const meta = VERTICALS[key];
          const isActive = selectedVertical === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedVertical(key)}
              className={`px-3 py-4 sm:px-5 sm:py-4.5 rounded-[1.5rem] sm:rounded-[1.8rem] text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 border shadow-sm cursor-pointer ${
                isActive
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.03] translate-y-[-1px]'
                  : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-900 hover:scale-[1.01]'
              }`}
            >
              <span className="text-xs sm:text-sm leading-none">{meta.icon}</span>
              <span className="leading-none text-center">{meta.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Poly-Themed KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Impressions', value: summary.views.toLocaleString(), labelDesc: 'Total Views' },
          { label: 'Conversion Leads', value: summary.leads.toLocaleString(), labelDesc: 'Total Leads' },
          { label: 'Conversion Rate', value: `${summary.conversionRate}%`, labelDesc: 'Ratio views/leads' },
          { label: 'Period Earnings', value: `$${summary.earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, labelDesc: 'Earning change (30d)' },
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            className={`p-8 rounded-[2rem] border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 bg-white ${activeMeta.border}`}
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{kpi.label}</p>
            <h4 
              className="text-3xl font-black tracking-tight italic"
              style={{ color: activeMeta.color }}
            >
              {kpi.value}
            </h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-3">{kpi.labelDesc}</p>
          </div>
        ))}
      </div>

      {/* 3. Dual Recharts Visual Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Daily Leads Area Chart */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Lead Stream.</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Daily lead volume</p>
          </div>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={activeMeta.gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeMeta.color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={activeMeta.color} stopOpacity={0} />
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
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/95 backdrop-blur-md border border-slate-100 p-5 rounded-2xl shadow-xl space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{data.name}</p>
                          <div className="flex items-center gap-4 justify-between">
                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeMeta.color }} /> Leads
                            </span>
                            <span className="text-xs font-black text-slate-900">{data.leads}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="leads" stroke={activeMeta.color} strokeWidth={4} fillOpacity={1} fill={`url(#${activeMeta.gradId})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Views Bar Chart */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Traffic Volume.</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Asset visibility index</p>
          </div>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/95 backdrop-blur-md border border-slate-100 p-5 rounded-2xl shadow-xl space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{data.name}</p>
                          <div className="flex items-center gap-4 justify-between">
                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeMeta.color }} /> Views
                            </span>
                            <span className="text-xs font-black text-slate-900">{data.views.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="views" radius={[8, 8, 0, 0]}>
                  {activeChartData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={activeMeta.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Detailed Listings Performance Ledger */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
        <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight italic leading-none">Listing Analytics.</h3>
            <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-3 uppercase tracking-[0.3em]">Detailed item conversions</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-80">
              <HiOutlineMagnifyingGlass className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 stroke-[3px]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listing by title..."
                className="w-full bg-slate-50 border border-slate-100 rounded-full pl-14 pr-8 py-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20 shadow-inner"
              />
            </div>
            {/* Export CSV Button (Sleek placeholder CTA) */}
            <button className="flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-6 py-4.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 active:scale-95 transition-all">
              <HiOutlineArrowDownTray className="w-4 h-4 stroke-[3px]" /> Export
            </button>
          </div>
        </div>

        {/* Listings Ledger Grid/Table */}
        <div className="overflow-x-auto px-8 md:px-12 pb-12">
          {filteredListings.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold text-sm">
              No active listings found in this category.
            </div>
          ) : (
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  <th className="pb-3 px-6">Asset Title</th>
                  <th className="pb-3 px-6">Vertical</th>
                  <th className="pb-3 px-6 text-center">Impressions</th>
                  <th className="pb-3 px-6 text-center">Leads</th>
                  <th className="pb-3 px-6 text-center">Earnings</th>
                  <th className="pb-3 px-6 text-right">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((item) => (
                  <tr 
                    key={`${item.type}-${item.id}`} 
                    onClick={() => navigate(`/dashboard/analytics/${item.type}/${item.id}`)}
                    className="group cursor-pointer hover:scale-[1.002] transition-all"
                  >
                    {/* Title */}
                    <td className="bg-slate-50/45 group-hover:bg-slate-50/20 border-y border-l border-slate-100 rounded-l-2xl px-6 py-6 transition-all duration-300">
                      <p className="text-sm font-black text-slate-900 line-clamp-1 leading-snug group-hover:text-[#6610f2] transition-colors">{item.title}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">ID: {item.id}</p>
                    </td>

                    {/* Vertical Category */}
                    <td className="bg-slate-50/45 group-hover:bg-slate-50/20 border-y border-slate-100 px-6 py-6 transition-all duration-300">
                      <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full uppercase tracking-widest border border-slate-200">
                        {item.type === 'JobListing' ? 'Job' : item.type}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="bg-slate-50/45 group-hover:bg-slate-50/20 border-y border-slate-100 px-6 py-6 text-center font-bold text-xs text-slate-700 transition-all duration-300">
                      {item.views.toLocaleString()}
                    </td>

                    {/* Leads */}
                    <td className="bg-slate-50/45 group-hover:bg-slate-50/20 border-y border-slate-100 px-6 py-6 text-center font-bold text-xs text-slate-700 transition-all duration-300">
                      {item.leads.toLocaleString()}
                    </td>

                    {/* Revenue */}
                    <td className="bg-slate-50/45 group-hover:bg-slate-50/20 border-y border-slate-100 px-6 py-6 text-center font-black text-xs text-slate-900 transition-all duration-300">
                      ${Number(item.revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Conversion Rate */}
                    <td className="bg-slate-50/45 group-hover:bg-slate-50/20 border-y border-r border-slate-100 rounded-r-2xl px-6 py-6 text-right transition-all duration-300">
                      <span 
                        className="text-[11px] font-black italic px-4 py-1.5 rounded-full"
                        style={{
                          backgroundColor: `${activeMeta.color}0a`,
                          color: activeMeta.color,
                        }}
                      >
                        {item.conversion_rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
