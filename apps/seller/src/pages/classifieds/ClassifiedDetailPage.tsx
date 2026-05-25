import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlinePencilSquare, 
  HiOutlineCurrencyDollar,
  HiOutlineMapPin,
  HiOutlineTag,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineUser
} from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';

export default function ClassifiedDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [classified, setClassified] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setClassified({
        id: 1,
        title: 'Vintage 1970s Record Player',
        slug: 'vintage-1970s-record-player',
        price: '$350.00',
        location: 'Brooklyn, NY',
        description: 'Beautifully restored 1970s vintage record player. Features a solid wood cabinet, built-in speakers, and a fully functional turntable. Perfect for vinyl enthusiasts looking for that authentic warm sound. Minor cosmetic wear consistent with age, but electronically perfect.',
        is_active: true,
        condition: 'Excellent (Restored)',
        category: 'Electronics',
        posted_at: '3 hours ago',
        views: 156,
        seller: {
          name: 'Retro Finds',
          member_since: '2021',
          rating: 5.0
        },
        features: ['Built-in Speakers', 'Auto-Stop Function', '33/45 RPM Support', 'RCA Output', 'New Stylus Included'],
        media: [
          { original_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=1200' },
          { original_url: 'https://images.unsplash.com/photo-1539186607619-df476afe3ff1?w=800' }
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
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Fetching Community Listing...</span>
        </div>
      </div>
    );
  }

  const containerClass = "bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12";

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Classified Preview"
        title={classified.title}
        subtitle="Listing Detail"
      >
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <HiOutlineChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => navigate(`/dashboard/classifieds/edit/${classified.slug}`)}
            className="bg-[#6610f2] text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#7b2dfd] transition-all flex items-center gap-2"
          >
            <HiOutlinePencilSquare className="w-4 h-4" /> Edit Listing
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: MEDIA & DESCRIPTION */}
        <div className="lg:col-span-8 space-y-10">
          {/* MAIN IMAGE */}
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={classified.media[0].original_url} 
              className="w-full aspect-video object-cover" 
              alt={classified.title} 
            />
          </div>

          {/* GALLERY GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {classified.media.slice(1).map((img: any, i: number) => (
              <div key={i} className="rounded-[2rem] overflow-hidden border-2 border-white shadow-md">
                <img src={img.original_url} className="w-full aspect-square object-cover" alt="" />
              </div>
            ))}
          </div>

          {/* DESCRIPTION */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Item Narrative.
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">
              {classified.description}
            </p>
          </div>

          {/* FEATURES */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-amber-500 rounded-full" /> Key Features.
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {classified.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <HiOutlineShieldCheck className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS & SELLER */}
        <div className="lg:col-span-4 space-y-10">
          {/* PRICE CARD */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Asking Price</p>
              <h4 className="text-5xl font-black italic tracking-tighter mb-8">{classified.price}</h4>
              <div className="flex items-center gap-3 text-amber-400 font-bold text-sm">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                ACTIVE LISTING
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineTag className="w-32 h-32" />
            </div>
          </div>

          {/* QUICK STATS */}
          <div className={containerClass}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Listing Metadata</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineTag className="w-5 h-5" />
                  <span className="text-sm font-bold">Condition</span>
                </div>
                <span className="text-sm font-black text-slate-900">{classified.condition}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineMapPin className="w-5 h-5" />
                  <span className="text-sm font-bold">Location</span>
                </div>
                <span className="text-sm font-black text-slate-900">{classified.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineClock className="w-5 h-5" />
                  <span className="text-sm font-bold">Posted</span>
                </div>
                <span className="text-sm font-black text-slate-900">{classified.posted_at}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-bold">Category</span>
                </div>
                <span className="text-sm font-black text-slate-900">{classified.category}</span>
              </div>
            </div>
          </div>

          {/* SELLER INFO */}
          <div className={containerClass}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Community Member</h4>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-amber-600 border-2 border-white shadow-sm">
                <HiOutlineUser className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 leading-none mb-1">{classified.seller.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member since {classified.seller.member_since}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600 text-center">
                Message Seller
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600 text-center">
                View Other Listings
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
