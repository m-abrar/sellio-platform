import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlinePencilSquare, 
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineWrenchScrewdriver,
  HiOutlineStar,
  HiOutlineShieldCheck,
  HiOutlineUser
} from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setService({
        id: 1,
        title: 'Full-Stack Web Development',
        slug: 'full-stack-web-development',
        price: 'From $2,500',
        description: 'Elevate your digital presence with high-performance, scalable web applications. Our full-stack development service covers everything from intuitive UI/UX design to robust backend architecture. We specialize in React, Node.js, and cloud-native solutions tailored to your business needs.',
        is_active: true,
        category: 'Development',
        delivery_time: '14-30 Days',
        rating: 4.9,
        reviews_count: 128,
        provider: 'PixelCraft Solutions',
        expertise: ['React & Next.js', 'Node.js Backend', 'Cloud Infrastructure', 'UI/UX Design', 'API Integration'],
        features: ['Source Code Access', '3 Months Support', 'Responsive Design', 'SEO Optimization', 'Database Setup'],
        media: [
          { original_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200' },
          { original_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800' },
          { original_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800' }
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
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Loading Service Portfolio...</span>
        </div>
      </div>
    );
  }

  const containerClass = "bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12";

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Service Brief"
        title={service.title}
        subtitle="Service Detail"
      >
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <HiOutlineChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => navigate(`/dashboard/services/edit/${service.slug}`)}
            className="bg-[#6610f2] text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#7b2dfd] transition-all flex items-center gap-2"
          >
            <HiOutlinePencilSquare className="w-4 h-4" /> Edit Service
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: MEDIA & DESCRIPTION */}
        <div className="lg:col-span-8 space-y-10">
          {/* MAIN IMAGE */}
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={service.media[0].original_url} 
              className="w-full aspect-video object-cover" 
              alt={service.title} 
            />
          </div>

          {/* GALLERY GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {service.media.slice(1).map((img: any, i: number) => (
              <div key={i} className="rounded-[2rem] overflow-hidden border-2 border-white shadow-md">
                <img src={img.original_url} className="w-full aspect-square object-cover" alt="" />
              </div>
            ))}
          </div>

          {/* DESCRIPTION */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Service Narrative.
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">
              {service.description}
            </p>
          </div>

          {/* EXPERTISE */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-pink-500 rounded-full" /> Core Expertise.
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {service.expertise.map((skill: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <HiOutlineShieldCheck className="w-5 h-5 text-pink-500" />
                  <span className="text-sm font-bold text-slate-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS & PROVIDER */}
        <div className="lg:col-span-4 space-y-10">
          {/* PRICE CARD */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Starting Valuation</p>
              <h4 className="text-5xl font-black italic tracking-tighter mb-8">{service.price}</h4>
              <div className="flex items-center gap-3 text-pink-400 font-bold text-sm">
                <HiOutlineStar className="w-5 h-5 fill-pink-400" />
                {service.rating} ({service.reviews_count} Reviews)
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineWrenchScrewdriver className="w-32 h-32" />
            </div>
          </div>

          {/* QUICK STATS */}
          <div className={containerClass}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Service Parameters</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineClock className="w-5 h-5" />
                  <span className="text-sm font-bold">Delivery</span>
                </div>
                <span className="text-sm font-black text-slate-900">{service.delivery_time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineWrenchScrewdriver className="w-5 h-5" />
                  <span className="text-sm font-bold">Category</span>
                </div>
                <span className="text-sm font-black text-slate-900">{service.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-bold">Status</span>
                </div>
                <span className="text-sm font-black text-green-500 uppercase tracking-widest">Accepting Orders</span>
              </div>
            </div>
          </div>

          {/* PROVIDER INFO */}
          <div className={containerClass}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Service Provider</h4>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-pink-600 border-2 border-white shadow-sm">
                <HiOutlineUser className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 leading-none mb-1">{service.provider}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Agency</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600">
                hello@pixelcraft.com
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600">
                +1 (888) 555-0144
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
