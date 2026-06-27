import React, { useState, useMemo, useRef } from 'react';
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
import { CHART_COLORS } from '../../lib/tokens';

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

const VERTICAL_METADATA: Record<string, { label: string; icon: string }> = {
  All:        { label: 'All',        icon: '⚡' },
  Property:   { label: 'Properties', icon: '🏠' },
  Auto:       { label: 'Automotive', icon: '🚗' },
  Product:    { label: 'Products',   icon: '📦' },
  Event:      { label: 'Events',     icon: '🎟️' },
  Service:    { label: 'Services',   icon: '💼' },
  Job:        { label: 'Jobs',       icon: '🤝' },
  Classified: { label: 'Classifieds',icon: '🏷️' },
};

const KPI_CARDS = [
  {
    key: 'views',
    label: 'Impressions',
    icon: HiOutlineChartBar,
    iconBg: 'bg-violet-50 text-violet-600',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'leads',
    label: 'Leads Generated',
    icon: HiOutlineUsers,
    iconBg: 'bg-emerald-50 text-emerald-600',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'conversionRate',
    label: 'Conversion Rate',
    icon: HiOutlineArrowTrendingUp,
    iconBg: 'bg-amber-50 text-amber-600',
    format: (v: number) => `${v}%`,
  },
];

export default function AnalyticsChartWidget({ verticalsData }: AnalyticsChartWidgetProps) {
  const [selectedVertical, setSelectedVertical] = useState<string>('All');
  const tabsRef = useRef<HTMLDivElement>(null);

  const allChartPoints = useMemo(() => {
    if (!verticalsData) return [];
    const map: Record<string, { name: string; views: number; leads: number }> = {};
    Object.values(verticalsData).forEach(({ chartPoints = [] }) => {
      chartPoints.forEach((pt) => {
        if (!map[pt.name]) map[pt.name] = { name: pt.name, views: 0, leads: 0 };
        map[pt.name].views += pt.views;
        map[pt.name].leads += pt.leads;
      });
    });
    return Object.values(map);
  }, [verticalsData]);

  const metrics = useMemo(() => {
    if (!verticalsData) return { views: 0, leads: 0, conversionRate: '0.00' };
    if (selectedVertical === 'All') {
      const views = allChartPoints.reduce((s, p) => s + p.views, 0);
      const leads = allChartPoints.reduce((s, p) => s + p.leads, 0);
      return { views, leads, conversionRate: views > 0 ? ((leads / views) * 100).toFixed(2) : '0.00' };
    }
    const d = verticalsData[selectedVertical] ?? { views: 0, leads: 0, conversion_rate: '0.00' };
    return { views: d.views, leads: d.leads, conversionRate: d.conversion_rate };
  }, [verticalsData, selectedVertical, allChartPoints]);

  const activeChartData = useMemo(
    () => (selectedVertical === 'All' ? allChartPoints : verticalsData?.[selectedVertical]?.chartPoints ?? []),
    [verticalsData, selectedVertical, allChartPoints],
  );

  const kpiValues: Record<string, number> = {
    views: metrics.views,
    leads: metrics.leads,
    conversionRate: parseFloat(metrics.conversionRate),
  };

  if (!verticalsData || activeChartData.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-card p-12 h-96 flex items-center justify-center">
        <span className="text-label font-semibold uppercase tracking-caps-wide text-slate-300 animate-pulse">
          Loading performance data…
        </span>
      </div>
    );
  }

  const availableVerticals = Object.keys(VERTICAL_METADATA).filter(
    (k) => k === 'All' || (verticalsData && k in verticalsData),
  );

  return (
    <div className="bg-white border border-slate-100 rounded-card p-8 md:p-10 transition-all duration-300">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-6 mb-8">
        <div>
          <h3 className="text-2xl md:text-title font-black text-slate-900 tracking-tight italic leading-tight">
            Performance Trends.
          </h3>
          <p className="text-label font-semibold text-slate-400 uppercase tracking-caps mt-1.5">
            Market insights &amp; conversion
          </p>
        </div>

        {/* Scrollable pill-tab vertical selector */}
        <div
          ref={tabsRef}
          className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5 flex-wrap sm:flex-nowrap sm:max-w-md"
        >
          {availableVerticals.map((key) => {
            const meta = VERTICAL_METADATA[key];
            const isActive = selectedVertical === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedVertical(key)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-badge text-label font-bold uppercase tracking-wider transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <span className="text-xs">{meta.icon}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI mini-cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {KPI_CARDS.map(({ key, label, icon: CardIcon, iconBg, format }) => (
          <div
            key={key}
            className="flex items-center gap-4 bg-slate-50/60 border border-slate-100/80 rounded-2xl p-5 group hover:bg-white hover:shadow-card-hover hover:border-slate-200/60 transition-all duration-300"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
              <CardIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-micro font-semibold uppercase tracking-widest text-slate-400 mb-1 truncate">{label}</p>
              <p className="text-xl font-black text-slate-900 tracking-tight leading-none">
                {format(kpiValues[key])}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeChartData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={CHART_COLORS.views} stopOpacity={0.12} />
                <stop offset="95%" stopColor={CHART_COLORS.views} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={CHART_COLORS.leads} stopOpacity={0.12} />
                <stop offset="95%" stopColor={CHART_COLORS.leads} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 600, fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 600, fill: '#94a3b8' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as ChartPoint;
                return (
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xl space-y-2">
                    <p className="text-micro font-bold uppercase tracking-widest text-slate-400 mb-2">{d.name}</p>
                    <div className="flex items-center gap-3 justify-between">
                      <span className="text-caption font-medium text-slate-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" /> Views
                      </span>
                      <span className="text-xs font-black text-slate-900">{d.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 justify-between">
                      <span className="text-caption font-medium text-slate-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> Leads
                      </span>
                      <span className="text-xs font-black text-slate-900">{d.leads.toLocaleString()}</span>
                    </div>
                  </div>
                );
              }}
            />
            <Area type="monotone" dataKey="views" stroke={CHART_COLORS.views} strokeWidth={2.5} fillOpacity={1} fill="url(#viewsGrad)" dot={false} />
            <Area type="monotone" dataKey="leads" stroke={CHART_COLORS.leads} strokeWidth={2.5} fillOpacity={1} fill="url(#leadsGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-5 justify-center">
        <span className="flex items-center gap-2 text-label font-medium text-slate-500">
          <span className="w-5 h-0.5 rounded-full bg-brand" /> Views
        </span>
        <span className="flex items-center gap-2 text-label font-medium text-slate-500">
          <span className="w-5 h-0.5 rounded-full bg-emerald-500" /> Leads
        </span>
      </div>
    </div>
  );
}
