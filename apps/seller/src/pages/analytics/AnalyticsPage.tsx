import React from 'react';
import PageHeader from '../../components/layout/PageHeader';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';

const data = [
  { name: 'Jan', sales: 4000, views: 2400 },
  { name: 'Feb', sales: 3000, views: 1398 },
  { name: 'Mar', sales: 2000, views: 9800 },
  { name: 'Apr', sales: 2780, views: 3908 },
  { name: 'May', sales: 1890, views: 4800 },
  { name: 'Jun', sales: 2390, views: 3800 },
  { name: 'Jul', sales: 3490, views: 4300 },
];

const COLORS = ['#6610f2', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader 
        badge="Performance" 
        title="Market" 
        subtitle="Intelligence"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* REVENUE OVERVIEW */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Revenue Stream.</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Monthly performance metrics</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6610f2" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6610f2" stopOpacity={0}/>
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
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6610f2" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TRAFFIC ANALYSIS */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Traffic Volume.</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Asset visibility index</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="views" radius={[10, 10, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
