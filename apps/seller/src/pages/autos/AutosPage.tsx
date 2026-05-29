import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi2';
import { toast } from 'sonner';
import { deleteAuto, getAutos } from '../../api/autos';
import { triggerDeletion } from '../../utils/animations';
import { getWelcomeData } from '../../api/dashboard';
import UpgradePlanModal from '../../components/modals/UpgradePlanModal';

export default function AutosPage() {
  const navigate = useNavigate();
  const [autos, setAutos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limits, setLimits] = useState<any>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const fetchAutos = async () => {
    setIsLoading(true);
    try {
      const [response, dashboardResponse] = await Promise.all([
        getAutos(),
        getWelcomeData().catch(() => null)
      ]);
      setAutos(response.data);
      if (dashboardResponse) {
        setLimits(dashboardResponse.data.subscriptionLimits);
      }
    } catch (error) {
      console.error('Failed to fetch autos', error);
      toast.error('Failed to synchronize inventory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAutos();
  }, []);

  const handleCreateClick = () => {
    if (limits?.is_limit_exceeded) {
      setIsUpgradeModalOpen(true);
    } else {
      navigate('/dashboard/autos/create');
    }
  };

  const handleDelete = (id: number, title: string) => {
    toast(`Decommission "${title}"?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Confirm',
        onClick: async () => {
          try {
            await deleteAuto(id);
            triggerDeletion();
            setAutos((prev) => prev.filter((a) => a.id !== id));
            toast.success(`${title} decommissioned successfully.`);
          } catch (err: any) {
            toast.error(err.message || 'Failed to delete vehicle.');
          }
        },
      },
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Automotive" title="Vehicle" subtitle="Inventory">
        <button
          onClick={handleCreateClick}
          className="bg-[#6610f2] text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#7b2dfd] transition-all active:scale-95 flex items-center gap-2"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Vehicle
        </button>
      </PageHeader>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Inventory...</span>
        </div>
      ) : autos.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">No vehicles found</p>
        </div>
      ) : (
        <>
          <div className="lg:hidden space-y-6">
            {autos.map((auto) => (
              <div key={auto.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium relative overflow-hidden group">
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-50 shrink-0 border-4 border-white shadow-md cursor-pointer" onClick={() => navigate(`/dashboard/autos/view/${auto.slug}`)}>
                    <img src={auto.media[0]?.original_url} className="w-full h-full object-cover" alt={auto.title} />
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <span className="text-[9px] font-black text-[#6610f2] bg-[#6610f2]/5 px-3 py-1 rounded-full uppercase tracking-widest">{auto.sku}</span>
                    <h3 className="text-lg font-black text-slate-900 truncate mt-2 italic tracking-tight cursor-pointer hover:text-[#6610f2] transition-colors" onClick={() => navigate(`/dashboard/autos/view/${auto.slug}`)}>
                      {auto.title}
                    </h3>
                    <p className="text-2xl font-black text-slate-900 mt-1 tracking-tighter">{auto.price || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Location</span>
                    <span className="text-xs font-black uppercase text-slate-600">{auto.location}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/dashboard/autos/edit/${auto.slug}`)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-[#6610f2] hover:text-white transition-all">
                      <HiOutlinePencilSquare className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(auto.id, auto.title)} className="p-4 bg-red-50/50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                  <th className="px-10 pb-2">Asset Identity</th>
                  <th className="px-10 pb-2">Valuation</th>
                  <th className="px-10 pb-2 text-right">Controls</th>
                </tr>
              </thead>
              <tbody>
                {autos.map((auto) => (
                  <tr key={auto.id} className="group">
                    <td className="bg-white group-hover:bg-slate-50/50 border-y border-l border-slate-100 group-hover:border-[#6610f2]/20 rounded-l-[2rem] px-10 py-6 transition-all duration-300">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-16 rounded-[1.2rem] overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0 cursor-pointer" onClick={() => navigate(`/dashboard/autos/view/${auto.slug}`)}>
                          <img src={auto.media[0]?.original_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-lg font-black tracking-tighter mb-1 truncate text-slate-900 italic cursor-pointer hover:text-[#6610f2] transition-colors" onClick={() => navigate(`/dashboard/autos/view/${auto.slug}`)}>
                            {auto.title}
                          </p>
                          <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-[#6610f2]/5 text-[#6610f2] border border-[#6610f2]/10">{auto.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="bg-white group-hover:bg-slate-50/50 border-y border-slate-100 group-hover:border-[#6610f2]/20 px-10 py-6 transition-all duration-300">
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{auto.price || 'N/A'}</span>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Market Value</p>
                    </td>
                    <td className="bg-white group-hover:bg-slate-50/50 border-y border-r border-slate-100 group-hover:border-[#6610f2]/20 rounded-r-[2rem] px-10 py-6 text-right transition-all duration-300 relative overflow-hidden">
                      <div className="relative h-16 flex items-center justify-end">
                        <div className="flex flex-col items-end transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-black uppercase tracking-widest ${auto.is_active ? 'text-green-500' : 'text-amber-500'}`}>{auto.is_active ? 'Live' : 'Draft'}</span>
                            <span className={`w-2 h-2 rounded-full ${auto.is_active ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
                          </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center gap-3 opacity-0 translate-y-[-20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <button onClick={() => navigate(`/dashboard/autos/edit/${auto.slug}`)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:bg-[#6610f2] hover:text-white hover:shadow-xl transition-all">
                            <HiOutlinePencilSquare className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDelete(auto.id, auto.title)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:bg-red-500 hover:text-white hover:shadow-xl transition-all">
                            <HiOutlineTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {limits && (
        <UpgradePlanModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)} 
          limits={limits} 
        />
      )}
    </div>
  );
}
