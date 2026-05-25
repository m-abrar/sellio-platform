import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlinePencilSquare, 
  HiOutlineCurrencyDollar,
  HiOutlineMapPin,
  HiOutlineTag,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';
import { getClassifiedBySlug } from '../../api/classifieds';
import { toast } from 'sonner';

export default function ClassifiedDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [classified, setClassified] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClassified = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const { data } = await getClassifiedBySlug(slug);
        setClassified(data);
      } catch (error) {
        console.error('Failed to fetch classified', error);
        toast.error('Failed to load listing details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassified();
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

  if (!classified) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Listing not found</span>
      </div>
    );
  }

  const containerClass = 'bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12';

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Community Listing"
        title={classified.title}
        subtitle="Classified Detail"
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
        <div className="lg:col-span-8 space-y-10">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={classified.media[0]?.original_url} 
              className="w-full aspect-video object-cover" 
              alt={classified.title} 
            />
          </div>

          {classified.media.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {classified.media.slice(1).map((img: any, i: number) => (
                <div key={i} className="rounded-[2rem] overflow-hidden border-2 border-white shadow-md">
                  <img src={img.original_url} className="w-full aspect-square object-cover" alt="" />
                </div>
              ))}
            </div>
          )}

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Item Narrative.
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">
              {classified.description}
            </p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Asking Price</p>
              <h4 className="text-5xl font-black italic tracking-tighter mb-8">{classified.price || '$0.00'}</h4>
              <div className="flex items-center gap-3 text-pink-400 font-bold text-sm">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                {classified.is_active ? 'LIVE LISTING' : 'DRAFT'}
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineCurrencyDollar className="w-32 h-32" />
            </div>
          </div>

          <div className={containerClass}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Listing Details</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineMapPin className="w-5 h-5" />
                  <span className="text-sm font-bold">Location</span>
                </div>
                <span className="text-sm font-black text-slate-900">{classified.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-bold">Condition</span>
                </div>
                <span className="text-sm font-black text-slate-900">{classified.condition}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineTag className="w-5 h-5" />
                  <span className="text-sm font-bold">SKU</span>
                </div>
                <span className="text-sm font-black text-slate-900">{classified.sku}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
