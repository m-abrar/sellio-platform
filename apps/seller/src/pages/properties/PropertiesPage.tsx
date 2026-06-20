import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi2';
import { toast } from 'sonner';
import { deleteProperty, getProperties } from '../../api/properties';
import { getDashboardData } from '../../api/dashboard';
import UpgradePlanModal from '../../components/modals/UpgradePlanModal';
import ListingCountCards from '../../components/listings/ListingCountCards';
import { triggerDeletion } from '../../utils/animations';
import { getListingCounts } from '../../utils/listingCounts';

export default function PropertiesPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limits, setLimits] = useState<any>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const [propResponse, dashboardResponse] = await Promise.all([
        getProperties(),
        getDashboardData().catch(() => null)
      ]);
      setProperties(propResponse.data);
      if (dashboardResponse) {
        setLimits(dashboardResponse.data.subscriptionLimits);
      }
    } catch (error) {
      console.error('Failed to fetch properties', error);
      toast.error('Failed to synchronize portfolio.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleCreateClick = () => {
    if (limits?.is_limit_exceeded) {
      setIsUpgradeModalOpen(true);
    } else {
      navigate('/dashboard/properties/create');
    }
  };

  const handleDelete = (id: number, title: string) => {
    toast(`Decommission "${title}"?`, {
      description: 'This action cannot be undone.',
      action: {
        label: 'Confirm',
        onClick: async () => {
          try {
            await deleteProperty(id);
            triggerDeletion();
            setProperties((prev) => prev.filter((p) => p.id !== id));
            toast.success(`${title} decommissioned successfully.`);
          } catch (err: any) {
            toast.error(err.message || 'Failed to delete property.');
          }
        },
      },
    });
  };

  const propertyCounts = getListingCounts(properties);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageHeader badge="Real Estate" title="Property" subtitle="Portfolio">
        <button
          onClick={handleCreateClick}
          className="bg-[#6610f2] text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#7b2dfd] transition-all active:scale-95 flex items-center gap-2"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Property
        </button>
      </PageHeader>

      <ListingCountCards entityLabel="Properties" counts={propertyCounts} isLoading={isLoading} />

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Portfolio...</span>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">No properties found</p>
        </div>
      ) : (
        <>
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden group">
                <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => navigate(`/dashboard/properties/view/${property.slug}`)}>
                  <img src={property.media[0]?.original_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={property.title} />
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${property.is_active ? 'bg-green-500 text-white' : property.is_published ? 'bg-amber-400 text-white animate-pulse' : 'bg-slate-500 text-white'}`}>
                      {property.is_active ? 'Live' : property.is_published ? 'Pending' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <span className="text-[10px] font-black text-[#6610f2] uppercase tracking-widest">{property.location}</span>
                  <h3
                    className="text-xl font-black text-slate-900 mt-2 italic tracking-tight truncate pr-1 cursor-pointer hover:text-[#6610f2] transition-colors"
                    onClick={() => navigate(`/dashboard/properties/view/${property.slug}`)}
                  >
                    {property.title}
                  </h3>
                  <p className="text-2xl font-black text-slate-900 mt-4 tracking-tighter">{property.price || 'N/A'}</p>

                  <div className="flex gap-3 mt-8 pt-8 border-t border-slate-50">
                    <button onClick={() => navigate(`/dashboard/properties/edit/${property.slug}`)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#6610f2] hover:text-white transition-all flex items-center justify-center gap-2">
                      <HiOutlinePencilSquare className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => handleDelete(property.id, property.title)} className="p-4 bg-red-50/50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
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
                {properties.map((property) => (
                  <tr key={property.id} className="group">
                    <td className="bg-white group-hover:bg-slate-50/50 border-y border-l border-slate-100 group-hover:border-[#6610f2]/20 rounded-l-[2rem] px-10 py-6 transition-all duration-300">
                      <div className="flex items-center gap-6">
                        <div
                          className="w-20 h-16 rounded-[1.2rem] overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0 cursor-pointer"
                          onClick={() => navigate(`/dashboard/properties/view/${property.slug}`)}
                        >
                          <img src={property.media[0]?.original_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-lg font-black tracking-tighter mb-1 truncate pr-1 text-slate-900 italic cursor-pointer hover:text-[#6610f2] transition-colors"
                            onClick={() => navigate(`/dashboard/properties/view/${property.slug}`)}
                          >
                            {property.title}
                          </p>
                          <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-[#6610f2]/5 text-[#6610f2] border border-[#6610f2]/10">{property.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="bg-white group-hover:bg-slate-50/50 border-y border-slate-100 group-hover:border-[#6610f2]/20 px-10 py-6 transition-all duration-300">
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{property.price || 'N/A'}</span>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Market Value</p>
                    </td>
                    <td className="bg-white group-hover:bg-slate-50/50 border-y border-r border-slate-100 group-hover:border-[#6610f2]/20 rounded-r-[2rem] px-10 py-6 text-right transition-all duration-300 relative overflow-hidden">
                      <div className="relative h-16 flex items-center justify-end">
                        <div className="flex flex-col items-end transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-black uppercase tracking-widest ${property.is_active ? 'text-green-500' : property.is_published ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`}>
                              {property.is_active ? 'Live' : property.is_published ? 'Pending' : 'Draft'}
                            </span>
                            <span className={`w-2 h-2 rounded-full ${property.is_active ? 'bg-green-500 animate-pulse' : property.is_published ? 'bg-amber-400' : 'bg-slate-400'}`} />
                          </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center gap-3 opacity-0 translate-y-[-20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <button onClick={() => navigate(`/dashboard/properties/edit/${property.slug}`)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:bg-[#6610f2] hover:text-white hover:shadow-xl transition-all"><HiOutlinePencilSquare className="w-5 h-5" /></button>
                          <button onClick={() => handleDelete(property.id, property.title)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:bg-red-500 hover:text-white hover:shadow-xl transition-all"><HiOutlineTrash className="w-5 h-5" /></button>
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
