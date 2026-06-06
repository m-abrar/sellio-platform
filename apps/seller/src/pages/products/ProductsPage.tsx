import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi2';
import { toast } from 'sonner';
import { getProducts, deleteProduct } from '../../api/products';
import { triggerDeletion } from '../../utils/animations';
import { getWelcomeData } from '../../api/dashboard';
import UpgradePlanModal from '../../components/modals/UpgradePlanModal';
import ListingCountCards from '../../components/listings/ListingCountCards';
import { getListingCounts } from '../../utils/listingCounts';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limits, setLimits] = useState<any>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const [response, dashboardResponse] = await Promise.all([
        getProducts(),
        getWelcomeData().catch(() => null)
      ]);
      setProducts(response.data);
      if (dashboardResponse) {
        setLimits(dashboardResponse.data.subscriptionLimits);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("Failed to synchronize inventory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleCreateClick = () => {
    if (limits?.is_limit_exceeded) {
      setIsUpgradeModalOpen(true);
    } else {
      navigate('/dashboard/products/create');
    }
  };

  const handleDelete = async (id: number, title: string) => {
    toast(`Decommission "${title}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await deleteProduct(id);
            triggerDeletion();
            setProducts(prev => prev.filter(p => p.id !== id));
            toast.success(`${title} decommissioned successfully.`);
          } catch (err: any) {
            toast.error(err.message || "Protocol failed: Asset locked.");
          }
        },
      },
    });
  };

  const productCounts = getListingCounts(products);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 1. HEADER SECTION - ALWAYS VISIBLE */}
      <PageHeader 
        badge="Global Catalog" 
        title="Product" 
        subtitle="Inventory"
      >
        <button 
          onClick={handleCreateClick}
          className="bg-[#6610f2] text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#7b2dfd] transition-all active:scale-95 flex items-center gap-2"
        >
          <HiOutlinePlus className="w-4 h-4" /> Add Product
        </button>
      </PageHeader>

      <ListingCountCards entityLabel="Products" counts={productCounts} isLoading={isLoading} />

      {/* 2. LOADING SKELETON STATE */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="lg:hidden space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
          <div className="hidden lg:block h-[600px] overflow-hidden">
             <div className="w-full h-full bg-white border border-slate-100 rounded-[2.5rem] animate-pulse flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Syncing Inventory...</span>
             </div>
          </div>
        </div>
      ) : (
        <>
          {/* 3. MOBILE CARD VIEW */}
          <div className="lg:hidden space-y-6">
            {products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">No assets found</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-premium relative overflow-hidden group">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-50 shrink-0 border-4 border-white shadow-md cursor-pointer" onClick={() => navigate(`/dashboard/products/view/${product.slug}`)}>
                      <img src={product.featured_image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt={product.title} />
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <span className="text-[9px] font-black text-[#6610f2] bg-[#6610f2]/5 px-3 py-1 rounded-full uppercase tracking-widest">{product.sku || 'NO-SKU'}</span>
                      <h3 
                        className="text-lg font-black text-slate-900 truncate mt-2 italic tracking-tight cursor-pointer hover:text-[#6610f2] transition-colors"
                        onClick={() => navigate(`/dashboard/products/view/${product.slug}`)}
                      >
                        {product.title}
                      </h3>
                      <p className="text-2xl font-black text-slate-900 mt-1 tracking-tighter">
                        {product.pricing?.formatted || `$${product.pricing?.base_price ?? '0.00'}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Stock Position</span>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${product.inventory?.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-xs font-black uppercase ${(product.inventory?.stock_quantity ?? 0) <= 5 ? 'text-red-500' : 'text-slate-600'}`}>
                          {product.inventory?.stock_quantity ?? 0} Units
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/dashboard/products/edit/${product.slug}`)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-[#6610f2] hover:text-white transition-all"><HiOutlinePencilSquare className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(product.id, product.title)} className="p-4 bg-red-50/50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><HiOutlineTrash className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 4. DESKTOP TABLE VIEW */}
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
                {products.map((product) => {
                  const stockCount = product.inventory?.stock_quantity ?? 0;
                  const isLowStock = stockCount > 0 && stockCount <= 5;
                  const isOutOfStock = stockCount === 0;

                  return (
                    <tr key={product.id} className="group">
                      <td className="bg-white group-hover:bg-slate-50/50 border-y border-l border-slate-100 group-hover:border-[#6610f2]/20 rounded-l-[2rem] px-10 py-6 transition-all duration-300">
                        <div className="flex items-center gap-6">
                        <div 
                          className="w-20 h-16 rounded-[1.2rem] overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0 cursor-pointer"
                          onClick={() => navigate(`/dashboard/products/view/${product.slug}`)}
                        >
                          <img src={product.featured_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        </div>
                        <div className="min-w-0">
                          <p 
                            className="text-lg font-black tracking-tighter mb-1 truncate text-slate-900 italic cursor-pointer hover:text-[#6610f2] transition-colors"
                            onClick={() => navigate(`/dashboard/products/view/${product.slug}`)}
                          >
                            {product.title}
                          </p>
                          <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-[#6610f2]/5 text-[#6610f2] border border-[#6610f2]/10">{product.sku || 'NO-SKU'}</span>
                        </div>
                        </div>
                      </td>
                      <td className="bg-white group-hover:bg-slate-50/50 border-y border-slate-100 group-hover:border-[#6610f2]/20 px-10 py-6 transition-all duration-300">
                        <span className="text-xl font-black text-slate-900 tracking-tighter">{product.pricing?.formatted || `$${product.pricing?.base_price ?? '0.00'}`}</span>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">MSRP Base</p>
                      </td>
                      <td className="bg-white group-hover:bg-slate-50/50 border-y border-r border-slate-100 group-hover:border-[#6610f2]/20 rounded-r-[2rem] px-10 py-6 text-right transition-all duration-300 relative overflow-hidden">
                        <div className="relative h-16 flex items-center justify-end">
                          <div className="flex flex-col items-end transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-slate-400' : isLowStock ? 'text-red-500' : 'text-slate-600'}`}>{isOutOfStock ? 'Out of Stock' : `${stockCount} In Stock`}</span>
                              <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-slate-300' : isLowStock ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
                            </div>
                          </div>
                          <div className="absolute inset-y-0 right-0 flex items-center gap-3 opacity-0 translate-y-[-20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                            <button onClick={() => navigate(`/dashboard/products/edit/${product.slug}`)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:bg-[#6610f2] hover:text-white hover:shadow-xl transition-all"><HiOutlinePencilSquare className="w-5 h-5" /></button>
                            <button onClick={() => handleDelete(product.id, product.title)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:bg-red-500 hover:text-white hover:shadow-xl transition-all"><HiOutlineTrash className="w-5 h-5" /></button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
