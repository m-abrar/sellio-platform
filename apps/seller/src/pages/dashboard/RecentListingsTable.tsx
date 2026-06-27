import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi2';

interface Listing {
  id: number;
  slug?: string;
  title: string;
  module_type: string;
  module_slug?: string;
  is_active: boolean;
  media?: Array<{ original_url: string }>;
}

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 text-micro font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
    isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/80' : 'bg-amber-50 text-amber-600 border border-amber-100/80'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-emerald-500' : 'bg-amber-400'}`} />
    {isActive ? 'Live' : 'Draft'}
  </span>
);

const MobileActionBtn = ({ Icon, label, color, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 py-3 w-full rounded-xl bg-slate-50 border border-slate-100 text-slate-400 transition-all active:scale-[0.96] active:bg-slate-100 text-label font-semibold uppercase tracking-wider ${color}`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

export default function RecentListingsTable({ listings }: { listings: Listing[] }) {
  const navigate = useNavigate();

  const handleView = (item: Listing) => {
    const module = item.module_slug || `${item.module_type.toLowerCase()}s`;
    navigate(`/dashboard/${module}/view/${item.slug || item.id}`);
  };

  const handleEdit = (item: Listing) => {
    const module = item.module_slug || `${item.module_type.toLowerCase()}s`;
    navigate(`/dashboard/${module}/edit/${item.slug || item.id}`);
  };

  if (!listings?.length) {
    return (
      <div className="px-8 py-16 text-center">
        <p className="text-label font-semibold uppercase tracking-label-caps text-slate-300">No listings yet</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile cards */}
      <div className="lg:hidden space-y-4 p-5">
        {listings.map((item) => (
          <div
            key={`${item.module_type}-${item.id}`}
            className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5"
          >
            <div className="flex gap-4 items-start mb-5">
              <img
                src={item.media?.[0]?.original_url}
                className="w-20 h-16 object-cover rounded-xl border-2 border-white shadow-sm shrink-0"
                alt={item.title}
              />
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-micro font-semibold text-brand uppercase tracking-label-sm opacity-70 mb-1">
                  {item.module_type} · #{item.id}
                </p>
                <h4 className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-2 italic">{item.title}</h4>
                <div className="mt-2.5">
                  <StatusBadge isActive={item.is_active} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100/80">
              <MobileActionBtn Icon={HiOutlineEye} label="View" color="hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50" onClick={() => handleView(item)} />
              <MobileActionBtn Icon={HiOutlinePencilSquare} label="Edit" color="hover:text-brand hover:border-purple-100 hover:bg-purple-50" onClick={() => handleEdit(item)} />
              <MobileActionBtn Icon={HiOutlineTrash} label="Del" color="hover:text-red-500 hover:border-red-100 hover:bg-red-50" onClick={() => {}} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block px-8 pb-8">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="text-left text-micro font-semibold uppercase tracking-caps text-slate-400 px-5 pb-3">Asset</th>
              <th className="text-left text-micro font-semibold uppercase tracking-caps text-slate-400 px-5 pb-3">Type</th>
              <th className="text-right text-micro font-semibold uppercase tracking-caps text-slate-400 px-5 pb-3">Status / Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((item) => (
              <tr key={`${item.module_type}-${item.id}`} className="group">
                {/* Asset identity */}
                <td className="bg-slate-50/50 group-hover:bg-slate-50 border-y border-l border-slate-100/80 group-hover:border-slate-200/60 rounded-l-2xl px-5 py-4 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-11 rounded-xl overflow-hidden border border-slate-100 shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={item.media?.[0]?.original_url}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-nav font-semibold text-slate-900 truncate leading-tight">
                        {item.title}
                      </p>
                      <p className="text-micro font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                        ID {item.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Type badge */}
                <td className="bg-slate-50/50 group-hover:bg-slate-50 border-y border-slate-100/80 group-hover:border-slate-200/60 px-5 py-4 transition-all duration-200">
                  <span className="text-label font-semibold text-brand bg-brand/6 border border-brand/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {item.module_type}
                  </span>
                </td>

                {/* Actions / Status */}
                <td className="bg-slate-50/50 group-hover:bg-slate-50 border-y border-r border-slate-100/80 group-hover:border-slate-200/60 rounded-r-2xl px-5 py-4 text-right transition-all duration-200 relative overflow-hidden">
                  <div className="relative h-10 flex items-center justify-end">
                    {/* Default: status badge */}
                    <div className="flex items-center gap-3 transition-all duration-200 group-hover:opacity-0 group-hover:-translate-x-3 pointer-events-none">
                      <StatusBadge isActive={item.is_active} />
                    </div>
                    {/* Hover: action buttons */}
                    <div className="absolute inset-y-0 right-0 flex items-center gap-2 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                      {[
                        { Icon: HiOutlineEye, tip: 'View', cls: 'hover:bg-blue-500 hover:text-white hover:border-blue-500', fn: () => handleView(item) },
                        { Icon: HiOutlinePencilSquare, tip: 'Edit', cls: 'hover:bg-brand hover:text-white hover:border-brand', fn: () => handleEdit(item) },
                        { Icon: HiOutlineTrash, tip: 'Delete', cls: 'hover:bg-red-500 hover:text-white hover:border-red-500', fn: () => {} },
                      ].map((btn, idx) => (
                        <button
                          key={idx}
                          onClick={btn.fn}
                          title={btn.tip}
                          className={`w-9 h-9 flex items-center justify-center text-slate-400 bg-white rounded-xl border border-slate-100 shadow-sm transition-all duration-150 active:scale-90 ${btn.cls}`}
                        >
                          <btn.Icon className="w-4 h-4" />
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
