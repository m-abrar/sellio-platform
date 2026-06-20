import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HiOutlineChevronLeft,
  HiOutlinePencilSquare,
  HiOutlineCurrencyDollar,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';
import { getProductBySlug } from '../../api/products';
import ListingAnalyticsWidget from '../../components/studio/ListingAnalyticsWidget';
import ListingActivityWidget from '../../components/studio/ListingActivityWidget';
import { PLACEHOLDER_LISTING } from '../../constants/placeholders';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const { data } = await getProductBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product', error);
        toast.error('Unable to load product details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#6610f2] animate-progress-loading" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Syncing Inventory Data...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-sm font-bold text-slate-400">Product not found.</p>
      </div>
    );
  }

  const containerClass = 'bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12';
  const gallery = [
    ...(product.featured_image ? [{ original_url: product.featured_image }] : []),
    ...(product.gallery ?? []).map((item: any) => ({ original_url: item.url })),
  ];

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Inventory Preview"
        title={product.title}
        subtitle="Product Detail"
      >
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <HiOutlineChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => navigate(`/dashboard/products/edit/${product.slug}`)}
            className="bg-[#6610f2] text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#7b2dfd] transition-all flex items-center gap-2"
          >
            <HiOutlinePencilSquare className="w-4 h-4" /> Edit Product
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className={`${containerClass} !p-0 overflow-hidden`}>
            <img
              src={product.featured_image || gallery[0]?.original_url || PLACEHOLDER_LISTING}
              alt={product.title}
              className="w-full h-[420px] object-cover"
            />
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {gallery.slice(1, 4).map((item: any, index: number) => (
                <img
                  key={index}
                  src={item.original_url}
                  alt=""
                  className="w-full h-28 object-cover rounded-[1.5rem] border border-slate-100"
                />
              ))}
            </div>
          )}

          <div className={containerClass}>
            <h3 className="text-xl font-black text-slate-900 italic mb-4">Description</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{product.description || 'No description provided.'}</p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className={containerClass}>
            <div className="flex items-center gap-3 mb-6">
              <HiOutlineCurrencyDollar className="w-6 h-6 text-green-500" />
              <span className="text-4xl font-black text-slate-900 tracking-tighter">
                {product.pricing?.formatted || `$${product.pricing?.base_price ?? '0.00'}`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">SKU</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{product.sku || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{product.inventory?.stock_quantity ?? 0} units</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{product.category?.title || 'Uncategorized'}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brand</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{product.brand?.title || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl font-black text-slate-900 italic mb-4 flex items-center gap-2">
              <HiOutlineCube className="w-5 h-5 text-slate-400" /> Specifications
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p><HiOutlineTruck className="inline w-4 h-4 mr-2 text-slate-400" />Weight: {product.specs?.weight || 'N/A'}</p>
              <p><HiOutlineTag className="inline w-4 h-4 mr-2 text-slate-400" />Dimensions: {product.specs?.dimensions || 'N/A'}</p>
              <p><HiOutlineShieldCheck className="inline w-4 h-4 mr-2 text-slate-400" />Status: {product.status?.is_published ? 'Published' : 'Draft'}</p>
            </div>
          </div>

          <ListingAnalyticsWidget listingId={product.id} listingType="Product" />
          <ListingActivityWidget listingId={product.id} listingType="Product" />
        </div>
      </div>
    </div>
  );
}
