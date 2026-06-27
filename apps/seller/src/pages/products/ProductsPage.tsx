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
import { PLACEHOLDER_LISTING } from '../../constants/placeholders';

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
            toast.success(`${title} deleted successfully.`);
          } catch (err: any) {
            toast.error(err.message || "Could not delete. This item may be linked to an existing order.");
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
        badge="Products" 
        title="Product" 
        subtitle="Inventory"
      >
        <button 
          onClick={handleCreateClick}
          className="bg-brand text-white px-8 py-4.5 rounded-card font-black text-caption uppercase tracking-caps shadow-xl hover:bg-brand-hover transition-all active:scale-95 flex items-center gap-2"
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
              <div key={i} className="h-40 bg-white border border-slate-100 rounded-container animate-pulse" />
            ))}
          </div>
          <div className="hidden lg:block h-[600px] overflow-hidden">
             <div className="w-full h-full bg-white border border-slate-100 rounded-container animate-pulse flex items-center justify-center">
                <span className="text-label font-black uppercase tracking-caps-xl text-slate-300 animate-pulse">Syncing Inventory...</span>
             </div>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile — all rows grouped inside one card */}
          <div className="lg:hidden bg-white rounded-card border border-slate-100 overflow-hidden shadow-card divide-y divide-slate-50">
            {products.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-label font-black uppercase tracking-caps-xl text-slate-300">No assets found</p>
              </div>
            ) : products.map((product) => (
              <div key={product.id} className="flex items-center gap-4 px-5 py-4 group hover:bg-slate-50/40 transition-colors">
                <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer" onClick={() => navigate(`/dashboard/products/view/${product.slug}`)}>
                  <img src={product.featured_image || PLACEHOLDER_LISTING} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.title} loading="lazy" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-bold tracking-tight text-slate-900 truncate italic cursor-pointer hover:text-brand transition-colors"
                    onClick={() => navigate(`/dashboard/products/view/${product.slug}`)}
                  >
                    {product.title}
                  </p>
                  <span className="text-label font-bold px-2 py-0.5 bg-brand/5 text-brand rounded-full uppercase tracking-widest">{product.sku || 'NO-SKU'}</span>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-base font-black text-slate-900 tracking-tighter">{product.pricing?.formatted || `$${product.pricing?.base_price ?? '0.00'}`}</p>
                  <span className={`text-tiny font-black uppercase tracking-widest ${(product.inventory?.stock_quantity ?? 0) === 0 ? 'text-slate-400' : (product.inventory?.stock_quantity ?? 0) <= 5 ? 'text-red-500' : 'text-green-500'}`}>
                    {(product.inventory?.stock_quantity ?? 0) === 0 ? 'No Stock' : `${product.inventory?.stock_quantity} Units`}
                  </span>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => navigate(`/dashboard/products/edit/${product.slug}`)} className="p-2.5 text-slate-400 hover:bg-brand hover:text-white rounded-xl transition-all"><HiOutlinePencilSquare className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(product.id, product.title)} className="p-2.5 text-slate-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><HiOutlineTrash className="w-4 h-4" /></button>
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
                {products.map((product) => {
                  const stockCount = product.inventory?.stock_quantity ?? 0;
                  const isLowStock = stockCount > 0 && stockCount <= 5;
                  const isOutOfStock = stockCount === 0;

                  return (
                    <tr key={product.id} className="group hover:bg-slate-50/40 transition-colors duration-150">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-6">
                          <div
                            className="w-20 h-16 rounded-inner overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0 cursor-pointer"
                            onClick={() => navigate(`/dashboard/products/view/${product.slug}`)}
                          >
                            <img src={product.featured_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" loading="lazy" />
                          </div>
                          <div className="min-w-0">
                            <p
                              className="text-lg font-black tracking-tighter mb-1 truncate pr-1 text-slate-900 italic cursor-pointer hover:text-brand transition-colors"
                              onClick={() => navigate(`/dashboard/products/view/${product.slug}`)}
                            >
                              {product.title}
                            </p>
                            <span className="text-label font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-brand/5 text-brand border border-brand/10">{product.sku || 'NO-SKU'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xl font-black text-slate-900 tracking-tighter">{product.pricing?.formatted || `$${product.pricing?.base_price ?? '0.00'}`}</span>
                        <p className="text-micro font-black text-slate-400 uppercase tracking-widest mt-1">MSRP Base</p>
                      </td>
                      <td className="px-8 py-5 text-right relative overflow-hidden">
                        <div className="relative h-16 flex items-center justify-end">
                          <div className="flex flex-col items-end transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-caption font-black uppercase tracking-widest ${isOutOfStock ? 'text-slate-400' : isLowStock ? 'text-red-500' : 'text-slate-600'}`}>{isOutOfStock ? 'Out of Stock' : `${stockCount} In Stock`}</span>
                              <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-slate-300' : isLowStock ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
                            </div>
                          </div>
                          <div className="absolute inset-y-0 right-0 flex items-center gap-3 opacity-0 translate-y-[-20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                            <button onClick={() => navigate(`/dashboard/products/edit/${product.slug}`)} className="p-4 text-slate-400 bg-white rounded-2xl border border-slate-100 hover:bg-brand hover:text-white hover:shadow-xl transition-all"><HiOutlinePencilSquare className="w-5 h-5" /></button>
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
