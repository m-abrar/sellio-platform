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

const DUMMY_DATA = [
  { id: 452, title: 'Grand Mediterranean Villa', module_type: 'Property', is_active: true, media: [{ original_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400' }] },
  { id: 453, title: 'Mercedes Benz G-Wagon', module_type: 'Auto', is_active: true, media: [{ original_url: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?w=400' }] },
  { id: 454, title: 'Penthouse Apartment', module_type: 'Property', is_active: false, media: [{ original_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' }] },
];

export default function DashboardHome() {
  const containerClass = "bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-300";

  return (
    <div className="space-y-10 md:space-y-16 pb-20">
        {/* // highlight={user?.name?.split(' ')[0] || 'Partner'} */}

      <PageHeader 
        badge="Partner Ecosystem" 
        title="Welcome," 
        subtitle={'Abrar'}
      >
        <button className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#6610f2] transition-all flex items-center justify-center group">
          <HiOutlinePlus className="w-4 h-4 mr-3 stroke-[3px]" /> Create Listing
        </button>
      </PageHeader>
      
      {/* 1. KPI GRID */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-10">
        <StatCard title="Active Inventory" value="42" icon={HiOutlineHome} color="text-[#6610f2] bg-[#6610f2]/5" />
        <StatCard title="Urgent Alerts" value="09" icon={HiOutlineBell} color="text-red-500 bg-red-50" trend="+2 New" />
        <StatCard title="Market Views" value="3,120" icon={HiOutlineChartBar} color="text-blue-500 bg-blue-50" />
        <StatCard title="Total Revenue" value="$12.4k" icon={HiOutlineCurrencyDollar} color="text-green-500 bg-green-50" />
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="group flex items-center p-6 rounded-[1.5rem] bg-slate-50/50 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer">
                <div className="shrink-0 w-14 h-14 rounded-[1.2rem] bg-white shadow-sm flex items-center justify-center font-black text-[#6610f2] border border-slate-100 text-lg">J</div>
                <div className="ms-6 flex-1 min-w-0">
                  <p className="text-base font-black text-slate-900">John Doe</p>
                  <p className="text-[11px] font-bold text-[#6610f2] uppercase tracking-widest opacity-70">Viewing: Modern Asset</p>
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
                    <h4 className="text-5xl md:text-6xl font-black italic tracking-tighter">$2,140</h4>
                    <span className="text-2xl font-bold text-slate-500">.50</span>
                </div>
                <button className="w-full bg-[#6610f2] text-white py-6 rounded-[1.8rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#7b2dfd] active:scale-95 transition-all shadow-lg shadow-purple-900/40">
                    Instant Withdraw
                </button>
            </div>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#6610f2]/20 rounded-full blur-[100px]" />
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#ffc107]" />
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Trust Index</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Status: <span className="text-slate-900 font-bold underline decoration-[#ffc107] decoration-4 underline-offset-4">Verified</span>. Your account is eligible for 0% processing fees.
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
          <button className="flex items-center gap-3 text-[12px] font-black text-[#6610f2] uppercase tracking-[0.25em] group">
            View Inventory <HiOutlineChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
        
        <RecentListingsTable listings={DUMMY_DATA} />
      </div>
    </div>
  );
}