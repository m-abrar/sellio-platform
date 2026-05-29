import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { HiOutlineChartBar, HiOutlineUsers, HiOutlineArrowTrendingUp } from 'react-icons/hi2';

interface ChartPoint {
  name: string;
  views: number;
  leads: number;
}

interface VerticalData {
  views: number;
  leads: number;
  conversion_rate: string;
  chartPoints: ChartPoint[];
}

interface AnalyticsChartWidgetProps {
  verticalsData: Record<string, VerticalData> | null;
}

const VERTICAL_METADATA: Record<string, { label: string; icon: string; theme: string }> = {
  All: { label: 'All Verticals', icon: '⚡', theme: 'text-purple-600 bg-purple-50 border-purple-100' },
  Property: { label: 'Real Estate', icon: '🏠', theme: 'text-blue-600 bg-blue-50 border-blue-100' },
  Auto: { label: 'Automotive', icon: '🚗', theme: 'text-amber-600 bg-amber-50 border-amber-100' },
  Product: { label: 'Market Products', icon: '📦', theme: 'text-rose-600 bg-rose-50 border-rose-100' },
  Event: { label: 'Event Bookings', icon: '🎟️', theme: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  Service: { label: 'Client Services', icon: '💼', theme: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
  Job: { label: 'Job Openings', icon: '🤝', theme: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  Classified: { label: 'Classified Ads', icon: '🏷️', theme: 'text-slate-600 bg-slate-50 border-slate-100' },
};

export default function AnalyticsChartWidget({ verticalsData }: AnalyticsChartWidgetProps) {
  const [selectedVertical, setSelectedVertical] = useState<string>('All');

  // 1. Resolve daily points for All Verticals dynamically to ensure 100% data consistency
  const allChartPoints = useMemo(() => {
    if (!verticalsData) return [];
    
    const datesMap: Record<string, { name: string; views: number; leads: number }> = {};
    
    Object.keys(verticalsData).forEach((key) => {
      const points = verticalsData[key].chartPoints ?? [];
      points.forEach((pt) => {
        if (!datesMap[pt.name]) {
          datesMap[pt.name] = { name: pt.name, views: 0, leads: 0 };
        }
        datesMap[pt.name].views += pt.views;
        datesMap[pt.name].leads += pt.leads;
      });
    });

    return Object.values(datesMap);
  }, [verticalsData]);

  // 2. Resolve summary totals for "All" vs specific vertical
  const metrics = useMemo(() => {
    if (!verticalsData) {
      return { views: 0, leads: 0, conversionRate: '0.00' };
    }

    if (selectedVertical === 'All') {
      const views = allChartPoints.reduce((sum, pt) => sum + pt.views, 0);
      const leads = allChartPoints.reduce((sum, pt) => sum + pt.leads, 0);
      const rate = views > 0 ? (leads / views) * 100 : 0;
      return { views, leads, conversionRate: rate.toFixed(2) };
    }

    const data = verticalsData[selectedVertical] ?? { views: 0, leads: 0, conversion_rate: '0.00' };
    return {
      views: data.views,
      leads: data.leads,
      conversionRate: data.conversion_rate,
    };
  }, [verticalsData, selectedVertical, allChartPoints]);

  // 3. Resolve active chart data stream
  const activeChartData = useMemo(() => {
    if (selectedVertical === 'All') return allChartPoints;
    return verticalsData?.[selectedVertical]?.chartPoints ?? [];
  }, [verticalsData, selectedVertical, allChartPoints]);

  if (!verticalsData || activeChartData.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] h-96 flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Visual Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-300">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight italic">Performance Trends.</h3>
          <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-2 uppercase tracking-[0.3em]">Market insights & conversion</p>
        </div>

        {/* Dropdown Selector */}
        <div className="relative w-full sm:w-64">
          <select
            value={selectedVertical}
            onChange={(e) => setSelectedVertical(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6610f2]/20 cursor-pointer appearance-none shadow-sm"
          >
            {Object.keys(VERTICAL_METADATA).map((key) => (
              <option key={key} value={key} className="text-xs font-bold font-sans">
                {VERTICAL_METADATA[key].icon} {VERTICAL_METADATA[key].label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Mini KPI HUD Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Metric Card 1: Views */}
        <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl flex items-center gap-5 group hover:bg-white hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <HiOutlineChartBar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Traffic Impressions</p>
            <h4 className="text-xl font-black text-slate-900 tracking-tight">{metrics.views.toLocaleString()}</h4>
          </div>
        </div>

        {/* Metric Card 2: Leads */}
        <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl flex items-center gap-5 group hover:bg-white hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <HiOutlineUsers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Conversion Leads</p>
            <h4 className="text-xl font-black text-slate-900 tracking-tight">{metrics.leads.toLocaleString()}</h4>
          </div>
        </div>

        {/* Metric Card 3: Conversion Rate */}
        <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl flex items-center gap-5 group hover:bg-white hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <HiOutlineArrowTrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Lead Conversion Rate</p>
            <h4 className="text-xl font-black text-slate-900 tracking-tight">{metrics.conversionRate}%</h4>
          </div>
        </div>
      </div>

      {/* 3. High Fidelity Multi-Series Area Chart */}
      <div className="h-96 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Traffic / Views Gradient */}
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6610f2" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6610f2" stopOpacity={0.0} />
              </linearGradient>
              {/* Conversion / Leads Gradient */}
              <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
              dy={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ChartPoint;
                  return (
                    <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-5 rounded-2xl shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{data.name}</p>
                      <div className="flex items-center gap-4 justify-between">
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6610f2]" /> Views
                        </span>
                        <span className="text-xs font-black text-slate-900">{data.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-4 justify-between">
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Leads
                        </span>
                        <span className="text-xs font-black text-slate-900">{data.leads.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Views Area Series */}
            <Area
              type="monotone"
              dataKey="views"
              stroke="#6610f2"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#viewsGrad)"
            />
            {/* Leads Area Series */}
            <Area
              type="monotone"
              dataKey="leads"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#leadsGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
