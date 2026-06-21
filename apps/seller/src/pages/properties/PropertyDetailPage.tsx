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
} from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';
import { getPropertyBySlug } from '../../api/properties';
import ListingAnalyticsWidget from '../../components/studio/ListingAnalyticsWidget';
import ListingActivityWidget from '../../components/studio/ListingActivityWidget';
import { toast } from 'sonner';

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const { data } = await getPropertyBySlug(slug);
        setProperty(data);
      } catch (error) {
        console.error('Failed to fetch property', error);
        toast.error('Unable to load property details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
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

  if (!property) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-sm font-bold text-slate-400">Property not found.</p>
      </div>
    );
  }

  const containerClass = 'bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12';
  const features = (property.amenities ?? []).map((item: any) => item.title).filter(Boolean);

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader badge="Property" title={property.title} subtitle="Details">
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
        <div className="lg:col-span-8 space-y-10">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
            <img src={property.media[0]?.original_url} className="w-full aspect-video object-cover" alt={property.title} />
          </div>

          {property.media.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {property.media.slice(1).map((img: any, i: number) => (
                <div key={i} className="rounded-[2rem] overflow-hidden border-2 border-white shadow-md">
                  <img src={img.original_url} className="w-full aspect-square object-cover" alt="" />
                </div>
              ))}
            </div>
          )}

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Narrative.
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">{property.description || 'No description provided.'}</p>
          </div>

          {features.length > 0 && (
            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-green-500 rounded-full" /> Amenities & Features.
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-bold text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Current Valuation</p>
              <h4 className="text-5xl font-black italic tracking-tighter mb-8">{property.price || 'N/A'}</h4>
              <div className={`flex items-center gap-3 font-bold text-sm ${property.is_active ? 'text-green-400' : property.is_published ? 'text-amber-400' : 'text-slate-400'}`}>
                <div className={`w-2 h-2 rounded-full ${property.is_active ? 'bg-green-400 animate-pulse' : property.is_published ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
                {property.is_active ? 'LIVE LISTING' : property.is_published ? 'PENDING MODERATION' : 'DRAFT'}
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineCurrencyDollar className="w-32 h-32" />
            </div>
          </div>

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
                  <span className="text-sm font-bold">Bedrooms</span>
                </div>
                <span className="text-sm font-black text-slate-900">{property.number_of_bedrooms ?? 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineSquare3Stack3D className="w-5 h-5" />
                  <span className="text-sm font-bold">Area</span>
                </div>
                <span className="text-sm font-black text-slate-900">{property.area_sq_ft ? `${property.area_sq_ft} sq ft` : 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineCalendarDays className="w-5 h-5" />
                  <span className="text-sm font-bold">Built</span>
                </div>
                <span className="text-sm font-black text-slate-900">{property.year_built ?? 'N/A'}</span>
              </div>
            </div>
          </div>

          <ListingAnalyticsWidget listingId={property.id} listingType="Property" />
          <ListingActivityWidget listingId={property.id} listingType="Property" />
        </div>
      </div>
    </div>
  );
}
