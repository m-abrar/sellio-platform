import React, { useState, useEffect } from 'react';
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
import { getAnalytics } from '../../api/analytics';

const COLORS = ['#6610f2', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

export default function AnalyticsPage() {
  const [chartData, setChartData] = useState<Array<{ name: string; views: number; leads: number }>>([]);
  const [summary, setSummary] = useState({
    totalViews: 0,
    totalLeads: 0,
    conversionRate: '0',
    totalEarnings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getAnalytics(30);
        setChartData(response.data.chartPoints);
        setSummary({
          totalViews: response.data.performanceData?.total_views ?? 0,
          totalLeads: response.data.performanceData?.total_leads ?? 0,
          conversionRate: response.data.performanceData?.conversion_rate ?? '0',
          totalEarnings: response.data.totalEarnings ?? 0,
        });
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">
          Syncing Analytics...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Performance" title="Market" subtitle="Intelligence" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-premium">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Views</p>
          <h4 className="text-3xl font-black text-slate-900 tracking-tight">{summary.totalViews.toLocaleString()}</h4>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-premium">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Leads</p>
          <h4 className="text-3xl font-black text-slate-900 tracking-tight">{summary.totalLeads.toLocaleString()}</h4>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-premium">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Conversion</p>
          <h4 className="text-3xl font-black text-slate-900 tracking-tight">{summary.conversionRate}%</h4>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-premium">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Earnings (30d)</p>
          <h4 className="text-3xl font-black text-slate-900 tracking-tight">${summary.totalEarnings.toLocaleString()}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Lead Stream.</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Daily lead volume</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6610f2" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6610f2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="leads" stroke="#6610f2" strokeWidth={4} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Traffic Volume.</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Asset visibility index</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="views" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
