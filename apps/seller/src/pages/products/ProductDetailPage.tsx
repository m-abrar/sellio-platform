import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlinePencilSquare, 
  HiOutlineCurrencyDollar,
  HiOutlineCube,
  HiOutlineTag,
  HiOutlineTruck,
  HiOutlineShieldCheck
} from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setProduct({
        id: 1,
        title: 'Titanium Executive Watch',
        slug: 'titanium-executive-watch',
        price: '$1,200.00',
        sku: 'WATCH-TITAN-001',
        description: 'The Titanium Executive Watch is a masterpiece of precision engineering and elegant design. Crafted from aerospace-grade titanium, it features a scratch-resistant sapphire crystal, automatic movement, and a 72-hour power reserve. Perfect for the modern professional who values both style and substance.',
        is_active: true,
        category: 'Luxury Goods',
        brand: 'Chronos Elite',
        stock: 42,
        weight: '0.15 kg',
        dimensions: '42mm x 12mm',
        features: ['Water Resistant 100m', 'Luminous Hands', 'Date Display', 'Titanium Bracelet', 'Swiss Movement'],
        media: [
          { original_url: 'https://picsum.photos/seed/watch1/1200/800' },
          { original_url: 'https://picsum.photos/seed/watch2/800/600' },
          { original_url: 'https://picsum.photos/seed/watch3/800/600' }
        ]
      });
      setIsLoading(false);
    }, 800);
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

  const containerClass = "bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12";

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
        {/* LEFT COLUMN: MEDIA & DESCRIPTION */}
        <div className="lg:col-span-8 space-y-10">
          {/* MAIN IMAGE */}
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-50">
            <img 
              src={product.media[0].original_url} 
              className="w-full aspect-square md:aspect-video object-contain p-10" 
              alt={product.title} 
            />
          </div>

          {/* GALLERY GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {product.media.slice(1).map((img: any, i: number) => (
              <div key={i} className="rounded-[2rem] overflow-hidden border-2 border-white shadow-md bg-slate-50">
                <img src={img.original_url} className="w-full aspect-square object-contain p-6" alt="" />
              </div>
            ))}
          </div>

          {/* DESCRIPTION */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Product Narrative.
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">
              {product.description}
            </p>
          </div>

          {/* FEATURES */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-indigo-500 rounded-full" /> Technical Specs.
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <HiOutlineShieldCheck className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS & LOGISTICS */}
        <div className="lg:col-span-4 space-y-10">
          {/* PRICE CARD */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">MSRP Valuation</p>
              <h4 className="text-5xl font-black italic tracking-tighter mb-8">{product.price}</h4>
              <div className="flex items-center gap-3 text-emerald-400 font-bold text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                IN STOCK: {product.stock} UNITS
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineCurrencyDollar className="w-32 h-32" />
            </div>
          </div>

          {/* QUICK STATS */}
          <div className={containerClass}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Inventory Metadata</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineTag className="w-5 h-5" />
                  <span className="text-sm font-bold">SKU</span>
                </div>
                <span className="text-sm font-black text-slate-900 uppercase tracking-widest">{product.sku}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineCube className="w-5 h-5" />
                  <span className="text-sm font-bold">Category</span>
                </div>
                <span className="text-sm font-black text-slate-900">{product.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineTruck className="w-5 h-5" />
                  <span className="text-sm font-bold">Weight</span>
                </div>
                <span className="text-sm font-black text-slate-900">{product.weight}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-bold">Brand</span>
                </div>
                <span className="text-sm font-black text-slate-900">{product.brand}</span>
              </div>
            </div>
          </div>

          {/* LOGISTICS INFO */}
          <div className={containerClass}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Logistics Hub</h4>
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#6610f2] shadow-sm">
                  <HiOutlineTruck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Standard Shipping</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">2-4 Business Days</p>
                </div>
              </div>
              <div className="h-px bg-slate-200/50" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-500 shadow-sm">
                  <HiOutlineShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Quality Assured</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Certified Inspection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
