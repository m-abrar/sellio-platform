import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlinePencilSquare, 
  HiOutlineMapPin, 
  HiOutlineCurrencyDollar,
  HiOutlineHome,
  HiOutlineSquare3Stack3D,
  HiOutlineCalendarDays,
  HiOutlineUser
} from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setProperty({
        id: 1,
        title: 'Luxury Penthouse',
        slug: 'luxury-penthouse',
        price: '$2,500,000',
        location: 'Downtown Metropolis',
        description: 'Experience the pinnacle of urban living in this breathtaking luxury penthouse. Featuring floor-to-ceiling windows, a private rooftop terrace, and state-of-the-art smart home integration, this residence offers unparalleled views of the city skyline.',
        is_active: true,
        type: 'Residential',
        status: 'For Sale',
        bedrooms: 4,
        bathrooms: 3.5,
        area: '3,200 sqft',
        year_built: 2023,
        features: ['Rooftop Pool', 'Private Elevator', 'Smart Home System', 'Wine Cellar', '24/7 Concierge'],
        media: [
          { original_url: 'https://picsum.photos/seed/penthouse1/1200/800' },
          { original_url: 'https://picsum.photos/seed/penthouse2/800/600' },
          { original_url: 'https://picsum.photos/seed/penthouse3/800/600' }
        ],
        owner: {
          name: 'Alexander Pierce',
          email: 'alex.pierce@example.com',
          phone: '+1 (555) 123-4567'
        }
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
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Loading Asset Data...</span>
        </div>
      </div>
    );
  }

  const containerClass = "bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12";

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Property Preview"
        title={property.title}
        subtitle="Asset Detail"
      >
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <HiOutlineChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => navigate(`/dashboard/properties/edit/${property.slug}`)}
            className="bg-[#6610f2] text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#7b2dfd] transition-all flex items-center gap-2"
          >
            <HiOutlinePencilSquare className="w-4 h-4" /> Edit Asset
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: MEDIA & DESCRIPTION */}
        <div className="lg:col-span-8 space-y-10">
          {/* MAIN IMAGE */}
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={property.media[0].original_url} 
              className="w-full aspect-video object-cover" 
              alt={property.title} 
            />
          </div>

          {/* GALLERY GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {property.media.slice(1).map((img: any, i: number) => (
              <div key={i} className="rounded-[2rem] overflow-hidden border-2 border-white shadow-md">
                <img src={img.original_url} className="w-full aspect-square object-cover" alt="" />
              </div>
            ))}
          </div>

          {/* DESCRIPTION */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Narrative.
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">
              {property.description}
            </p>
          </div>

          {/* FEATURES */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full" /> Amenities & Features.
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-bold text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS & OWNER */}
        <div className="lg:col-span-4 space-y-10">
          {/* PRICE CARD */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Current Valuation</p>
              <h4 className="text-5xl font-black italic tracking-tighter mb-8">{property.price}</h4>
              <div className="flex items-center gap-3 text-green-400 font-bold text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                ACTIVE LISTING
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineCurrencyDollar className="w-32 h-32" />
            </div>
          </div>

          {/* QUICK STATS */}
          <div className={containerClass}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Asset Specifications</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineMapPin className="w-5 h-5" />
                  <span className="text-sm font-bold">Location</span>
                </div>
                <span className="text-sm font-black text-slate-900">{property.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineHome className="w-5 h-5" />
                  <span className="text-sm font-bold">Type</span>
                </div>
                <span className="text-sm font-black text-slate-900">{property.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineSquare3Stack3D className="w-5 h-5" />
                  <span className="text-sm font-bold">Area</span>
                </div>
                <span className="text-sm font-black text-slate-900">{property.area}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineCalendarDays className="w-5 h-5" />
                  <span className="text-sm font-bold">Built</span>
                </div>
                <span className="text-sm font-black text-slate-900">{property.year_built}</span>
              </div>
            </div>
          </div>

          {/* OWNER INFO */}
          <div className={containerClass}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Asset Custodian</h4>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-[#6610f2] border-2 border-white shadow-sm">
                <HiOutlineUser className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 leading-none mb-1">{property.owner.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Partner</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600">
                {property.owner.email}
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-600">
                {property.owner.phone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
