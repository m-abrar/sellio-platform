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
          {/* MOBILE VIEW */}
          <div className="lg:hidden space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-container border border-slate-100">
                <p className="text-label font-black uppercase tracking-caps-xl text-slate-300">No listings found</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-container border border-slate-100 shadow-premium relative overflow-hidden group">
                  <div className="flex gap-6">
                    <div 
                      className="w-24 h-24 rounded-card-lg overflow-hidden bg-slate-50 shrink-0 border-4 border-white shadow-md cursor-pointer"
                      onClick={() => navigate(`/dashboard/classifieds/view/${item.slug}`)}
                    >
                      <img src={item.media?.[0]?.original_url || PLACEHOLDER_LISTING_CLASSIFIEDS} className="w-full h-full object-cover" alt={item.title} loading="lazy" />
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <span className="text-micro font-black text-brand bg-brand/5 px-3 py-1 rounded-full uppercase tracking-widest">{item.sku || 'NO-SKU'}</span>
                      <h3 
                        className="text-lg font-black text-slate-900 truncate pr-1 mt-2 italic tracking-tight cursor-pointer hover:text-brand transition-colors"
                        onClick={() => navigate(`/dashboard/classifieds/view/${item.slug}`)}
                      >
                        {item.title}
                      </h3>
                      <p className="text-2xl font-black text-slate-900 mt-1 tracking-tighter">
                        {item.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                    <div className="flex flex-col text-left">
                      <span className="text-micro font-black text-slate-300 uppercase tracking-widest mb-1">Location</span>
                      <span className="text-xs font-black text-slate-600 uppercase">{item.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/dashboard/classifieds/edit/${item.slug}`)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-brand hover:text-white transition-all"><HiOutlinePencilSquare className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(item.id, item.title)} className="p-4 bg-red-50/50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><HiOutlineTrash className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden lg:block">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left text-caption font-black uppercase tracking-caps-wide text-slate-400">
                  <th className="px-10 pb-2">Listing Identity</th>
                  <th className="px-10 pb-2">Valuation</th>
                  <th className="px-10 pb-2 text-right">Controls</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="group">
                    <td className="bg-white group-hover:bg-slate-50/50 border-y border-l border-slate-100 group-hover:border-brand/20 rounded-l-[2rem] px-10 py-6 transition-all duration-300">
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
                    <td className="bg-white group-hover:bg-slate-50/50 border-y border-slate-100 group-hover:border-brand/20 px-10 py-6 transition-all duration-300">
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{item.price}</span>
                      <p className="text-micro font-black text-slate-400 uppercase tracking-widest mt-1">{item.location}</p>
                    </td>
                    <td className="bg-white group-hover:bg-slate-50/50 border-y border-r border-slate-100 group-hover:border-brand/20 rounded-r-[2rem] px-10 py-6 text-right transition-all duration-300 relative overflow-hidden">
                      <div className="relative h-16 flex items-center justify-end">
                        <div className="flex flex-col items-end transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-caption font-black uppercase tracking-widest ${item.is_active ? 'text-slate-600' : 'text-slate-400'}`}>{item.is_active ? 'Live' : 'Draft'}</span>
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
