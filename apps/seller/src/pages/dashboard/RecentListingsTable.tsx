import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi2';

interface Listing {
  id: number;
  title: string;
  module_type: string;
  is_active: boolean;
  media?: Array<{ original_url: string }>;
}

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <div className="flex items-center gap-2 shrink-0 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
    <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">
      {isActive ? 'Live' : 'Draft'}
    </span>
  </div>
);

const MobileActionBtn = ({ Icon, label, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center gap-3 py-4 w-full rounded-[1.5rem] bg-white border border-slate-100 text-slate-400 transition-all active:scale-[0.96] active:text-white shadow-sm group ${color}`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default function RecentListingsTable({ listings }: { listings: Listing[] }) {
  const navigate = useNavigate();

  const handleEdit = (item: Listing) => {
    const module = item.module_type.toLowerCase() + 's';
    navigate(`/dashboard/${module}/edit/${item.id}`);
  };

  return (
    <div className="w-full">
      {/* MOBILE VIEW */}
      <div className="lg:hidden space-y-6 px-6 pb-12">
        {listings.map((item) => (
          <div key={item.id} className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex gap-6 items-start">
              <img 
                src={item.media?.[0]?.original_url} 
                className="w-24 h-24 object-cover rounded-[2rem] border-4 border-white shadow-lg shrink-0" 
                alt={item.title} 
              />
              <div className="min-w-0 flex-1 pt-2">
                <span className="text-[10px] font-black text-[#6610f2] uppercase tracking-[0.2em] opacity-60">
                  {item.module_type} • ID {item.id}
                </span>
                <h4 className="text-lg font-black text-slate-900 leading-tight italic mt-1 line-clamp-2">
                  {item.title}
                </h4>
                <div className="mt-3">
                  <StatusBadge isActive={item.is_active} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t border-slate-200/50">
              <MobileActionBtn Icon={HiOutlineEye} label="View" color="active:bg-blue-600" onClick={() => handleEdit(item)} />
              <MobileActionBtn Icon={HiOutlinePencilSquare} label="Edit" color="active:bg-[#6610f2]" onClick={() => handleEdit(item)} />
              <MobileActionBtn Icon={HiOutlineTrash} label="Del" color="active:bg-red-500" />
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden lg:block px-12 pb-12">
        <table className="w-full border-separate border-spacing-y-5">
          <thead>
            <tr className="text-left text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              <th className="px-10 pb-2">Asset Identity</th>
              <th className="px-10 pb-2">Classification</th>
              <th className="px-10 pb-2 text-right">Controls</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((item) => (
              <tr key={item.id} className="group">
                {/* ASSET IDENTITY */}
                <td className="bg-slate-50/40 group-hover:bg-white border-y border-l border-slate-100 group-hover:border-[#6610f2]/20 rounded-l-[2rem] px-10 py-8 transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <img 
                      src={item.media?.[0]?.original_url} 
                      className="w-20 h-16 object-cover rounded-[1rem] border-2 border-white shadow-sm group-hover:scale-110 transition-transform" 
                      alt="" 
                    />
                    <div className="min-w-0">
                      <p className="text-xl font-black text-slate-900 truncate tracking-tight">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Primary Entry
                      </p>
                    </div>
                  </div>
                </td>

                {/* CLASSIFICATION */}
                <td className="bg-slate-50/40 group-hover:bg-white border-y border-slate-100 group-hover:border-[#6610f2]/20 px-10 py-8 transition-all duration-300">
                  <span className="text-[11px] font-black text-[#6610f2] bg-[#6610f2]/5 px-6 py-2.5 rounded-full uppercase tracking-widest border border-[#6610f2]/10">
                    {item.module_type}
                  </span>
                </td>

                {/* CONTROLS COLUMN (THE SWAP ZONE) */}
                <td className="bg-slate-50/40 group-hover:bg-white border-y border-r border-slate-100 group-hover:border-[#6610f2]/20 rounded-r-[2rem] px-10 py-8 text-right transition-all duration-300 relative overflow-hidden">
                  <div className="relative h-12 flex items-center justify-end">
                    
                    {/* META DETAILS: Visible by default, hidden on hover */}
                    <div className="flex items-center gap-4 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-4">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest tabular-nums">
                        UID: {item.id}
                      </span>
                      <StatusBadge isActive={item.is_active} />
                    </div>

                    {/* ACTION BUTTONS: Hidden by default, visible on hover */}
                    <div className="absolute inset-y-0 right-0 flex items-center gap-3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      {[
                        { Icon: HiOutlineEye, bg: 'hover:bg-blue-600', hoverText: 'hover:text-white', onClick: () => handleEdit(item) },
                        { Icon: HiOutlinePencilSquare, bg: 'hover:bg-[#6610f2]', hoverText: 'hover:text-white', onClick: () => handleEdit(item) },
                        { Icon: HiOutlineTrash, bg: 'hover:bg-red-500', hoverText: 'hover:text-white', onClick: () => {} }
                      ].map((btn, idx) => (
                        <button 
                          key={idx} 
                          onClick={btn.onClick}
                          className={`p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all active:scale-90 ${btn.bg} ${btn.hoverText}`}
                        >
                          <btn.Icon className="w-5 h-5" />
                        </button>
                      ))}
                    </div>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
