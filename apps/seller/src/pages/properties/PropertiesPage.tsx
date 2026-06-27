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
            toast.success(`${title} deleted successfully.`);
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
          className="bg-brand text-white px-8 py-4.5 rounded-card font-black text-caption uppercase tracking-caps shadow-xl hover:bg-brand-hover transition-all active:scale-95 flex items-center gap-2"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Property
        </button>
      </PageHeader>

      <ListingCountCards entityLabel="Properties" counts={propertyCounts} isLoading={isLoading} />

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-label font-black uppercase tracking-caps-xl text-slate-300 animate-pulse">Syncing Portfolio...</span>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-container border border-slate-100">
          <p className="text-label font-black uppercase tracking-caps-xl text-slate-300">No properties found</p>
        </div>
      ) : (
        <>
          {/* Mobile — all rows grouped inside one card */}
          <div className="lg:hidden bg-white rounded-card border border-slate-100 overflow-hidden shadow-card divide-y divide-slate-50">
            {properties.map((property) => (
              <div key={property.id} className="flex items-center gap-4 px-5 py-4 group hover:bg-slate-50/40 transition-colors">
                <div
                  className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer"
                  onClick={() => navigate(`/dashboard/properties/view/${property.slug}`)}
                >
                  <img src={property.media[0]?.original_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={property.title} loading="lazy" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-bold tracking-tight text-slate-900 truncate italic cursor-pointer hover:text-brand transition-colors"
                    onClick={() => navigate(`/dashboard/properties/view/${property.slug}`)}
                  >
                    {property.title}
                  </p>
                  <span className="text-label font-bold px-2 py-0.5 bg-brand/5 text-brand rounded-full uppercase tracking-widest">{property.location}</span>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-base font-black text-slate-900 tracking-tighter">{property.price || 'N/A'}</p>
                  <span className={`text-tiny font-black uppercase tracking-widest ${property.is_active ? 'text-green-500' : property.is_published ? 'text-amber-500' : 'text-slate-400'}`}>
                    {property.is_active ? 'Live' : property.is_published ? 'Pending' : 'Draft'}
                  </span>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => navigate(`/dashboard/properties/edit/${property.slug}`)} className="p-2.5 text-slate-400 hover:bg-brand hover:text-white rounded-xl transition-all">
                    <HiOutlinePencilSquare className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(property.id, property.title)} className="p-2.5 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop — all rows grouped inside one card */}
          <div className="hidden lg:block bg-white rounded-card border border-slate-100 overflow-hidden shadow-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-8 py-4 text-left text-caption font-black uppercase tracking-caps-wide text-slate-400">Asset Identity</th>
                  <th className="px-8 py-4 text-left text-caption font-black uppercase tracking-caps-wide text-slate-400">Valuation</th>
                  <th className="px-8 py-4 text-right text-caption font-black uppercase tracking-caps-wide text-slate-400">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {properties.map((property) => (
                  <tr key={property.id} className="group hover:bg-slate-50/40 transition-colors duration-150">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-6">
                        <div
                          className="w-20 h-16 rounded-inner overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0 cursor-pointer"
                          onClick={() => navigate(`/dashboard/properties/view/${property.slug}`)}
                        >
                          <img src={property.media[0]?.original_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" loading="lazy" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-lg font-black tracking-tighter mb-1 truncate pr-1 text-slate-900 italic cursor-pointer hover:text-brand transition-colors"
                            onClick={() => navigate(`/dashboard/properties/view/${property.slug}`)}
                          >
                            {property.title}
                          </p>
                          <span className="text-label font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-brand/5 text-brand border border-brand/10">{property.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{property.price || 'N/A'}</span>
                      <p className="text-micro font-black text-slate-400 uppercase tracking-widest mt-1">Market Value</p>
                    </td>
                    <td className="px-8 py-5 text-right relative overflow-hidden">
                      <div className="relative h-16 flex items-center justify-end">
                        <div className="flex flex-col items-end transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-caption font-black uppercase tracking-widest ${property.is_active ? 'text-green-500' : property.is_published ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`}>
                              {property.is_active ? 'Live' : property.is_published ? 'Pending' : 'Draft'}
                            </span>
                            <span className={`w-2 h-2 rounded-full ${property.is_active ? 'bg-green-500 animate-pulse' : property.is_published ? 'bg-amber-400' : 'bg-slate-400'}`} />
                          </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center gap-3 opacity-0 translate-y-[-20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <button onClick={() => navigate(`/dashboard/properties/edit/${property.slug}`)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:bg-brand hover:text-white hover:shadow-xl transition-all"><HiOutlinePencilSquare className="w-5 h-5" /></button>
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
