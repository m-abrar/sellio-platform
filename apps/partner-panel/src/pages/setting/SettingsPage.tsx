import { HiOutlineAdjustmentsHorizontal, HiOutlineBellAlert, HiOutlineGlobeAlt, HiOutlineBanknotes } from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';

export default function SettingsPage() {
  const cardStyle = "bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group";

  return (
    <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader 
        badge="Engine Control" 
        title="System" 
        subtitle="Preferences"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* NOTIFICATIONS */}
        <div className={cardStyle}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
              <HiOutlineBellAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black italic tracking-tight">Alert Protocol</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Push & Email Sync</p>
            </div>
          </div>
          <div className="space-y-6">
            {['Inventory Low Alerts', 'New Interaction Toasts', 'Weekly Market Report'].map((toggle) => (
              <div key={toggle} className="flex justify-between items-center py-2">
                <span className="text-sm font-bold text-slate-600">{toggle}</span>
                <div className="w-12 h-6 bg-[#6610f2] rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REGIONAL */}
        <div className={cardStyle}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <HiOutlineGlobeAlt className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black italic tracking-tight">Localization</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Regional Standards</p>
            </div>
          </div>
          <div className="space-y-4">
            <select className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-[#6610f2]/20">
              <option>Currency: USD ($)</option>
              <option>Currency: EUR (€)</option>
              <option>Currency: AED (د.إ)</option>
            </select>
            <select className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-[#6610f2]/20">
              <option>Timezone: UTC +04:00 (Dubai)</option>
              <option>Timezone: UTC +00:00 (London)</option>
            </select>
          </div>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="bg-red-50/50 border border-red-100 p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h4 className="text-lg font-black text-red-600 uppercase tracking-tighter italic">Decommission Account</h4>
          <p className="text-xs text-red-400 font-medium">Permanently remove all assets and inventory from the global catalog.</p>
        </div>
        <button className="px-10 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-200">
          Terminate
        </button>
      </div>
    </div>
  );
}