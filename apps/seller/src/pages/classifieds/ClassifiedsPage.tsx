import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi2';
import { toast } from 'sonner';
import { deleteClassified, getClassifieds } from '../../api/classifieds';
import { triggerDeletion } from '../../utils/animations';
import { getWelcomeData } from '../../api/dashboard';
import UpgradePlanModal from '../../components/modals/UpgradePlanModal';
import ListingCountCards from '../../components/listings/ListingCountCards';
import { getListingCounts } from '../../utils/listingCounts';
import { PLACEHOLDER_LISTING_CLASSIFIEDS } from '../../constants/placeholders';

export default function ClassifiedsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limits, setLimits] = useState<any>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const fetchClassifieds = async () => {
    setIsLoading(true);
    try {
      const [response, dashboardResponse] = await Promise.all([
        getClassifieds(),
        getWelcomeData().catch(() => null)
      ]);
      setItems(response.data);
      if (dashboardResponse) {
        setLimits(dashboardResponse.data.subscriptionLimits);
      }
    } catch (error) {
      console.error('Failed to fetch classifieds', error);
      toast.error('Failed to synchronize listings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassifieds();
  }, []);

  const handleCreateClick = () => {
    if (limits?.is_limit_exceeded) {
      setIsUpgradeModalOpen(true);
    } else {
      navigate('/dashboard/classifieds/create');
    }
  };

  const handleDelete = (id: number, title: string) => {
    toast(`Remove "${title}"?`, {
      description: 'This listing will be permanently deleted.',
      action: {
        label: 'Confirm',
        onClick: async () => {
          try {
            await deleteClassified(id);
            triggerDeletion();
            setItems((prev) => prev.filter((item) => item.id !== id));
            toast.success(`${title} removed successfully.`);
          } catch (err: any) {
            toast.error(err.message || 'Failed to delete listing.');
          }
        },
      },
    });
  };

  const classifiedCounts = getListingCounts(items);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <PageHeader 
        badge="Classifieds" 
        title="Classified" 
        subtitle="Listings"
      >
        <button 
          onClick={handleCreateClick}
          className="bg-brand text-white px-8 py-4.5 rounded-card font-black text-caption uppercase tracking-caps shadow-xl hover:bg-brand-hover transition-all active:scale-95 flex items-center gap-2"
        >
          <HiOutlinePlus className="w-4 h-4" /> Post Classified
        </button>
      </PageHeader>

      <ListingCountCards entityLabel="Classifieds" counts={classifiedCounts} isLoading={isLoading} />

      {isLoading ? (
        <div className="space-y-6">
          <div className="lg:hidden space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white border border-slate-100 rounded-container animate-pulse" />
            ))}
          </div>
          <div className="hidden lg:block h-[600px] overflow-hidden">
             <div className="w-full h-full bg-white border border-slate-100 rounded-container animate-pulse flex items-center justify-center">
                <span className="text-label font-black uppercase tracking-caps-xl text-slate-300 animate-pulse">Syncing Classifieds...</span>
             </div>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile — all rows grouped inside one card */}
          <div className="lg:hidden bg-white rounded-card border border-slate-100 overflow-hidden shadow-card divide-y divide-slate-50">
            {items.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-label font-black uppercase tracking-caps-xl text-slate-300">No listings found</p>
              </div>
            ) : items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4 group hover:bg-slate-50/40 transition-colors">
                <div
                  className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer"
                  onClick={() => navigate(`/dashboard/classifieds/view/${item.slug}`)}
                >
                  <img src={item.media?.[0]?.original_url || PLACEHOLDER_LISTING_CLASSIFIEDS} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} loading="lazy" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-bold tracking-tight text-slate-900 truncate italic cursor-pointer hover:text-brand transition-colors"
                    onClick={() => navigate(`/dashboard/classifieds/view/${item.slug}`)}
                  >
                    {item.title}
                  </p>
                  <span className="text-label font-bold px-2 py-0.5 bg-brand/5 text-brand rounded-full uppercase tracking-widest">{item.sku || 'NO-SKU'}</span>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-base font-black text-slate-900 tracking-tighter">{item.price}</p>
                  <span className={`text-tiny font-black uppercase tracking-widest ${item.is_active ? 'text-green-500' : 'text-amber-500'}`}>{item.is_active ? 'Live' : 'Draft'}</span>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => navigate(`/dashboard/classifieds/edit/${item.slug}`)} className="p-2.5 text-slate-400 hover:bg-brand hover:text-white rounded-xl transition-all"><HiOutlinePencilSquare className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id, item.title)} className="p-2.5 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><HiOutlineTrash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop — all rows grouped inside one card */}
          <div className="hidden lg:block bg-white rounded-card border border-slate-100 overflow-hidden shadow-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-8 py-4 text-left text-caption font-black uppercase tracking-caps-wide text-slate-400">Listing Identity</th>
                  <th className="px-8 py-4 text-left text-caption font-black uppercase tracking-caps-wide text-slate-400">Valuation</th>
                  <th className="px-8 py-4 text-right text-caption font-black uppercase tracking-caps-wide text-slate-400">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/40 transition-colors duration-150">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-6">
                        <div
                          className="w-20 h-16 rounded-inner overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0 cursor-pointer"
                          onClick={() => navigate(`/dashboard/classifieds/view/${item.slug}`)}
                        >
                          <img src={item.media?.[0]?.original_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" loading="lazy" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-lg font-black tracking-tighter mb-1 truncate pr-1 text-slate-900 italic cursor-pointer hover:text-brand transition-colors"
                            onClick={() => navigate(`/dashboard/classifieds/view/${item.slug}`)}
                          >
                            {item.title}
                          </p>
                          <span className="text-label font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-brand/5 text-brand border border-brand/10">{item.sku || 'NO-SKU'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{item.price}</span>
                      <p className="text-micro font-black text-slate-400 uppercase tracking-widest mt-1">{item.location}</p>
                    </td>
                    <td className="px-8 py-5 text-right relative overflow-hidden">
                      <div className="relative h-16 flex items-center justify-end">
                        <div className="flex flex-col items-end transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-caption font-black uppercase tracking-widest ${item.is_active ? 'text-green-500' : 'text-slate-400'}`}>{item.is_active ? 'Live' : 'Draft'}</span>
                            <span className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
                          </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center gap-3 opacity-0 translate-y-[-20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <button onClick={() => navigate(`/dashboard/classifieds/edit/${item.slug}`)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:bg-brand hover:text-white hover:shadow-xl transition-all"><HiOutlinePencilSquare className="w-5 h-5" /></button>
                          <button onClick={() => handleDelete(item.id, item.title)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:bg-red-500 hover:text-white hover:shadow-xl transition-all"><HiOutlineTrash className="w-5 h-5" /></button>
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
