import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageHeader from '../../components/layout/PageHeader';
import MediaStudio from '../../components/studio/MediaStudio';
import ActionPill from '../../utils/ActionPill';
import { HiOutlineChevronLeft, HiOutlineMapPin, HiOutlineCurrencyDollar, HiOutlineHome } from 'react-icons/hi2';
import {
  createProperty,
  getPropertyBySlug,
  getPropertyFormMeta,
  updateProperty,
} from '../../api/properties';
import { getWelcomeData } from '../../api/dashboard';
import { ApiError } from '../../lib/apiError';

const containerClass = 'bg-white border border-slate-100 rounded-[2rem] shadow-[0_18px_44px_rgba(0,0,0,0.035)] p-6 md:p-10';
const labelClass = 'text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2';
const inputClass = 'w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300';
const tableInputClass = 'w-full min-w-[120px] bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-xl px-4 py-3.5 text-slate-900 font-semibold text-sm transition-all outline-none placeholder:text-slate-300 min-h-[48px]';
const fieldHintClass = 'mt-2 ml-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300';

const SCORE_PRESETS = [
  { title: 'Walk Score', units: '/100' },
  { title: 'Transit Score', units: '/100' },
  { title: 'Bike Score', units: '/100' },
  { title: 'School Rating', units: '/10' },
  { title: 'Safety Index', units: '/10' },
];

const defaultForm = {
  title: '',
  description: '',
  category_id: '',
  type_id: '',
  location_id: '',
  brand_id: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zip_code: '',
  latitude: '',
  longitude: '',
  base_price: '',
  sale_price: '',
  price_per_night: '',
  hoa: '',
  is_sale: true,
  is_rental: false,
  total_units: '1',
  number_of_bedrooms: '',
  number_of_bathrooms: '',
  maximum_guests: '',
  minimum_rental_days: '1',
  maximum_rental_days: '',
  number_of_parking_spots: '',
  area_sq_ft: '',
  year_built: '',
  video: '',
  virtual_tour: '',
  rules: '',
  policies: '',
  is_published: true,
  is_featured: false,
};

export default function CreateProperty() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  const [formMeta, setFormMeta] = useState<any>({ categories: [], types: [], locations: [], amenities: [], brands: [], features: [] });
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [seasonalPrices, setSeasonalPrices] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [activePricingTab, setActivePricingTab] = useState<'seasonal' | 'addons' | 'fees'>('seasonal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [limits, setLimits] = useState<any>(null);

  const updateForm = useCallback((field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const [meta, dashboardResponse] = await Promise.all([
          getPropertyFormMeta(),
          !isEditMode ? getWelcomeData().catch(() => null) : Promise.resolve(null)
        ]);
        setFormMeta(meta);
        if (dashboardResponse) {
          setLimits(dashboardResponse.data.subscriptionLimits);
        }

        if (isEditMode && slug) {
          const { data: property } = await getPropertyBySlug(slug);
          setPropertyId(property.id);
          setForm({
            title: property.title || '',
            description: property.description || '',
            category_id: property.category_id ? String(property.category_id) : '',
            type_id: property.type_id ? String(property.type_id) : '',
            location_id: property.location_id ? String(property.location_id) : '',
            brand_id: property.brand_id ? String(property.brand_id) : '',
            address: property.address || '',
            city: property.city || '',
            state: property.state || '',
            country: property.country || '',
            zip_code: property.zip_code || '',
            latitude: property.latitude != null ? String(property.latitude) : '',
            longitude: property.longitude != null ? String(property.longitude) : '',
            base_price: property.base_price != null ? String(property.base_price) : '',
            sale_price: property.sale_price != null ? String(property.sale_price) : '',
            price_per_night: property.price_per_night != null ? String(property.price_per_night) : '',
            hoa: property.hoa != null ? String(property.hoa) : '',
            is_sale: property.is_sale ?? true,
            is_rental: property.is_rental ?? false,
            total_units: property.total_units != null ? String(property.total_units) : '1',
            number_of_bedrooms: property.number_of_bedrooms != null ? String(property.number_of_bedrooms) : '',
            number_of_bathrooms: property.number_of_bathrooms != null ? String(property.number_of_bathrooms) : '',
            maximum_guests: property.maximum_guests != null ? String(property.maximum_guests) : '',
            minimum_rental_days: property.minimum_rental_days != null ? String(property.minimum_rental_days) : '1',
            maximum_rental_days: property.maximum_rental_days != null ? String(property.maximum_rental_days) : '',
            number_of_parking_spots: property.number_of_parking_spots || '',
            area_sq_ft: property.area_sq_ft != null ? String(property.area_sq_ft) : '',
            year_built: property.year_built != null ? String(property.year_built) : '',
            video: property.video || '',
            virtual_tour: property.virtual_tour || '',
            rules: property.rules || '',
            policies: property.policies || '',
            is_published: property.is_active ?? true,
            is_featured: property.status?.is_featured ?? false,
          });
          setSelectedAmenities((property.amenities ?? []).map((item: any) => item.id));
          setSelectedFeatures((property.features ?? []).map((item: any) => item.id));
          setTags(property.tags ?? []);
          setNeighborhoods(property.neighborhoods ?? []);
          setSeasonalPrices(property.seasonal_prices ?? []);
          setAddons(property.addons ?? []);
          setFees(property.fees ?? []);
          setScores(property.scores ?? []);

          const initialMedia: any[] = [];
          if (property.featured_image) {
            initialMedia.push({
              id: property.featured_image_id,
              url: property.featured_image,
              preview: property.featured_image,
              isMain: true,
              existing: true,
            });
          }
          property.gallery.forEach((item: any) => {
            if (item.url !== property.featured_image) {
              initialMedia.push({
                id: item.id,
                url: item.url,
                preview: item.thumbnail || item.url,
                isMain: false,
                existing: true,
              });
            }
          });
          setFiles(initialMedia);
        }
      } catch (error) {
        console.error('Failed to initialize property form', error);
        toast.error('Failed to load property data.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [isEditMode, slug]);

  const toggleAmenity = (id: number) => {
    setSelectedAmenities((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Syncing property data...');

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else {
        formData.append(key, String(value));
      }
    });

    selectedAmenities.forEach((amenityId) => {
      formData.append('amenities[]', String(amenityId));
    });

    selectedFeatures.forEach((featureId) => {
      formData.append('features[]', String(featureId));
    });

    tags.forEach((tag) => {
      formData.append('tags[]', tag);
    });

    neighborhoods.forEach((nb, index) => {
      formData.append(`neighborhoods[${index}][title]`, nb.title);
      formData.append(`neighborhoods[${index}][description]`, nb.description || '');
      formData.append(`neighborhoods[${index}][distance_miles]`, String(nb.distance_miles ?? 0));
    });

    seasonalPrices.forEach((sp, index) => {
      formData.append(`seasonal_prices[${index}][season_name]`, sp.season_name);
      formData.append(`seasonal_prices[${index}][start_date]`, sp.start_date);
      formData.append(`seasonal_prices[${index}][end_date]`, sp.end_date);
      formData.append(`seasonal_prices[${index}][price]`, String(sp.price));
    });

    addons.forEach((addon, index) => {
      formData.append(`addons[${index}][title]`, addon.title);
      formData.append(`addons[${index}][description]`, addon.description || '');
      formData.append(`addons[${index}][price]`, String(addon.price));
    });

    fees.forEach((fee, index) => {
      formData.append(`fees[${index}][title]`, fee.title);
      formData.append(`fees[${index}][amount]`, String(fee.amount ?? 0));
      formData.append(`fees[${index}][type]`, fee.type || 'fixed');
      formData.append(`fees[${index}][rate]`, fee.rate != null ? String(fee.rate) : '');
      formData.append(`fees[${index}][charge_type]`, fee.charge_type || 'per_stay');
    });

    scores.forEach((score, index) => {
      formData.append(`scores[${index}][title]`, score.title);
      formData.append(`scores[${index}][score]`, String(score.score ?? 0));
      formData.append(`scores[${index}][units]`, score.units || '');
      formData.append(`scores[${index}][description]`, score.description || '');
    });

    formData.append('sync_existing_media', '1');
    files.forEach((fileObj) => {
      if (fileObj.file) {
        if (fileObj.isMain) formData.append('main_image', fileObj.file);
        else formData.append('gallery[]', fileObj.file);
      } else if (fileObj.existing) {
        if (fileObj.isMain) formData.append('existing_main_media_id', String(fileObj.id));
        else formData.append('existing_media_ids[]', String(fileObj.id));
      }
    });

    try {
      if (isEditMode && propertyId) {
        await updateProperty(propertyId, formData);
      } else {
        await createProperty(formData);
      }

      toast.success('Property saved successfully.', { id: toastId });
      navigate('/dashboard/properties');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Validation failed.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoading && !isEditMode && limits?.is_limit_exceeded) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <PageHeader badge="Limit Guard" title="Register" subtitle="Property" />
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="relative z-10 max-w-md space-y-8">
            <div className="w-20 h-20 rounded-3xl bg-[#6610f2]/20 border border-[#6610f2]/30 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <span className="text-4xl">🛡️</span>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black italic tracking-tight">Active Limit Reached!</h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                You have reached your subscription active listing limit ({limits.current_listings_count} / {limits.max_listings} listings). 
                Please upgrade your plan to register more assets.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => navigate('/dashboard/memberships')}
              className="bg-[#6610f2] hover:bg-[#7b2dfd] px-10 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-purple-900/40 inline-flex items-center gap-2 cursor-pointer"
            >
              Upgrade Subscription Plan
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#6610f2]/20 rounded-full blur-[120px]" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#6610f2]/10 rounded-full blur-[120px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-14 pb-64 lg:pb-48 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader badge="Asset Protocol" title={isEditMode ? 'Modify' : 'Register'} subtitle="Property">
        <button
          onClick={() => navigate(-1)}
          className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <HiOutlineChevronLeft className="w-4 h-4" /> Back
        </button>
      </PageHeader>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Loading Property Form...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10">
          <div className="lg:col-span-8 space-y-8 md:space-y-10">
            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Property Identity.
              </h3>
              <div className="space-y-7">
                <div>
                  <label className={labelClass}>Property Title</label>
                  <input type="text" value={form.title} onChange={(e) => updateForm('title', e.target.value)} className={`${inputClass} text-2xl italic tracking-tighter`} placeholder="e.g. Skyline Luxury Penthouse" />
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { key: 'category_id', label: 'Category', options: formMeta.categories, hint: 'Required' },
                    { key: 'type_id', label: 'Type', options: formMeta.types, hint: 'Required' },
                    { key: 'location_id', label: 'Location Zone', options: formMeta.locations, hint: 'Required' },
                    { key: 'brand_id', label: 'Developer Brand', options: formMeta.brands || [], hint: 'Optional' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className={labelClass}>{field.label}</label>
                      <select value={(form as any)[field.key]} onChange={(e) => updateForm(field.key, e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value="">Select...</option>
                        {field.options.map((option: any) => (
                          <option key={option.id} value={option.id}>{option.title}</option>
                        ))}
                      </select>
                      <p className={fieldHintClass}>{field.hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <HiOutlineMapPin className="w-6 h-6 text-slate-300" /> Location.
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>Street Address</label>
                  <input type="text" value={form.address} onChange={(e) => updateForm('address', e.target.value)} className={inputClass} placeholder="123 Main Street" />
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" value={form.city} onChange={(e) => updateForm('city', e.target.value)} className={inputClass} placeholder="City" />
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>State / Region</label>
                  <input type="text" value={form.state} onChange={(e) => updateForm('state', e.target.value)} className={inputClass} placeholder="State / Province" />
                  <p className={fieldHintClass}>Optional</p>
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input type="text" value={form.country} onChange={(e) => updateForm('country', e.target.value)} className={inputClass} placeholder="Country" />
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>Zip Code</label>
                  <input type="text" value={form.zip_code} onChange={(e) => updateForm('zip_code', e.target.value)} className={inputClass} placeholder="Zip Code" />
                  <p className={fieldHintClass}>Optional</p>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-6 pt-4 border-t border-slate-100/50">
                  <div>
                    <label className={labelClass}>Latitude</label>
                    <input type="number" step="any" value={form.latitude} onChange={(e) => updateForm('latitude', e.target.value)} className={inputClass} placeholder="e.g. 40.7128" />
                    <p className={fieldHintClass}>Optional (Map Coordinate)</p>
                  </div>
                  <div>
                    <label className={labelClass}>Longitude</label>
                    <input type="number" step="any" value={form.longitude} onChange={(e) => updateForm('longitude', e.target.value)} className={inputClass} placeholder="e.g. -74.0060" />
                    <p className={fieldHintClass}>Optional (Map Coordinate)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <HiOutlineCurrencyDollar className="w-6 h-6 text-slate-300" /> Pricing & Rental Terms.
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <label className="flex items-center justify-between min-h-[72px] p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:shadow-sm transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">For Sale</span>
                  <input type="checkbox" checked={form.is_sale} onChange={(e) => updateForm('is_sale', e.target.checked)} className="w-5 h-5 accent-[#6610f2]" />
                </label>
                <label className="flex items-center justify-between min-h-[72px] p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:shadow-sm transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">For Rent</span>
                  <input type="checkbox" checked={form.is_rental} onChange={(e) => updateForm('is_rental', e.target.checked)} className="w-5 h-5 accent-[#6610f2]" />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className={labelClass}>Base Price</label>
                  <input type="number" value={form.base_price} onChange={(e) => updateForm('base_price', e.target.value)} className={inputClass} placeholder="0.00" />
                  <p className={fieldHintClass}>Optional</p>
                </div>
                <div>
                  <label className={labelClass}>Sale Price</label>
                  <input type="number" value={form.sale_price} onChange={(e) => updateForm('sale_price', e.target.value)} className={inputClass} placeholder="Optional" />
                  <p className={fieldHintClass}>Optional</p>
                </div>
                <div>
                  <label className={labelClass}>Price Per Night</label>
                  <input type="number" value={form.price_per_night} onChange={(e) => updateForm('price_per_night', e.target.value)} className={inputClass} placeholder="Optional" />
                  <p className={fieldHintClass}>Optional</p>
                </div>
                <div>
                  <label className={labelClass}>Monthly HOA Fee ($)</label>
                  <input type="number" value={form.hoa} onChange={(e) => updateForm('hoa', e.target.value)} className={inputClass} placeholder="Optional" />
                  <p className={fieldHintClass}>HOA Dues / Month</p>
                </div>
              </div>

              {form.is_rental && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div>
                    <label className={labelClass}>Minimum Rental Days</label>
                    <input type="number" min="1" value={form.minimum_rental_days} onChange={(e) => updateForm('minimum_rental_days', e.target.value)} className={inputClass} placeholder="1" />
                    <p className={fieldHintClass}>Required for rent listings</p>
                  </div>
                  <div>
                    <label className={labelClass}>Maximum Rental Days</label>
                    <input type="number" min="1" value={form.maximum_rental_days} onChange={(e) => updateForm('maximum_rental_days', e.target.value)} className={inputClass} placeholder="No Limit" />
                    <p className={fieldHintClass}>Optional Limit</p>
                  </div>
                </div>
              )}
            </div>

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <HiOutlineHome className="w-6 h-6 text-slate-300" /> Specs.
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[
                  { key: 'number_of_bedrooms', label: 'Bedrooms', type: 'number' },
                  { key: 'number_of_bathrooms', label: 'Bathrooms', type: 'number' },
                  { key: 'maximum_guests', label: 'Max Guests', type: 'number' },
                  { key: 'total_units', label: 'Total Units', type: 'number' },
                  { key: 'number_of_parking_spots', label: 'Parking Spots', type: 'text', placeholder: 'e.g. 2 Spaces' },
                  { key: 'area_sq_ft', label: 'Area (sq ft)', type: 'number' },
                  { key: 'year_built', label: 'Year Built', type: 'number' },
                ].map((field) => (
                  <div key={field.key} className={field.key === 'number_of_parking_spots' ? 'col-span-2 sm:col-span-1' : ''}>
                    <label className={labelClass}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder} value={(form as any)[field.key]} onChange={(e) => updateForm(field.key, e.target.value)} className={`${inputClass} px-4`} />
                  </div>
                ))}
              </div>
            </div>

            {formMeta.amenities?.length > 0 && (
              <div className={containerClass}>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8">Amenities.</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formMeta.amenities.map((amenity: any) => (
                    <label key={amenity.id} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${selectedAmenities.includes(amenity.id) ? 'border-[#6610f2] bg-[#6610f2]/5' : 'border-slate-100 bg-slate-50'}`}>
                      <input type="checkbox" checked={selectedAmenities.includes(amenity.id)} onChange={() => toggleAmenity(amenity.id)} className="accent-[#6610f2]" />
                      <span className="text-sm font-bold text-slate-700">{amenity.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {formMeta.features?.length > 0 && (
              <div className={containerClass}>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8">Specification Features.</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formMeta.features.map((feature: any) => (
                    <label key={feature.id} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${selectedFeatures.includes(feature.id) ? 'border-[#6610f2] bg-[#6610f2]/5' : 'border-slate-100 bg-slate-50'}`}>
                      <input type="checkbox" checked={selectedFeatures.includes(feature.id)} onChange={() => setSelectedFeatures(prev => prev.includes(feature.id) ? prev.filter(id => id !== feature.id) : [...prev, feature.id])} className="accent-[#6610f2]" />
                      <span className="text-sm font-bold text-slate-700">{feature.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Media Studio.
              </h3>
              <MediaStudio files={files} setFiles={setFiles} />
            </div>

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Tours & Media Embeds.
              </h3>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Video Tour Link / Embed Code</label>
                  <textarea value={form.video} onChange={(e) => updateForm('video', e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Paste YouTube/Vimeo URL or <iframe> embed code..." />
                  <p className={fieldHintClass}>Enhance visibility with a high-fidelity video walk-through</p>
                </div>
                <div>
                  <label className={labelClass}>360° Virtual Tour Link / Embed Code</label>
                  <textarea value={form.virtual_tour} onChange={(e) => updateForm('virtual_tour', e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Paste Matterport, Metareal, or custom 3D iframe/URL..." />
                  <p className={fieldHintClass}>Allow prospective buyers/renters to tour the space virtually</p>
                </div>
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8">Property Narrative.</h3>
              <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={6} className={`${inputClass} resize-none`} placeholder="Describe the architectural highlights and amenities..." />
              <p className={fieldHintClass}>Required</p>

              <div className="mt-8 border-t border-slate-100 pt-8">
                <label className={labelClass}>Discoverability Tags</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-2 bg-[#6610f2]/5 text-[#6610f2] border border-[#6610f2]/10 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-wider">
                      {tag}
                      <button type="button" onClick={() => setTags(prev => prev.filter(t => t !== tag))} className="text-red-500 hover:text-red-700 font-bold ml-1">×</button>
                    </span>
                  ))}
                  {tags.length === 0 && (
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-2">No tags added yet.</span>
                  )}
                </div>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                          setTags(prev => [...prev, tagInput.trim()]);
                          setTagInput('');
                        }
                      }
                    }}
                    className={`${inputClass} !py-3 !px-4 !rounded-full text-xs font-bold w-full max-w-xs`}
                    placeholder="Type keyword and press Enter..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                        setTags(prev => [...prev, tagInput.trim()]);
                        setTagInput('');
                      }
                    }}
                    className="bg-[#6610f2] text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-wider hover:bg-[#520dc2] transition-colors"
                  >
                    Add
                  </button>
                </div>
                <p className={fieldHintClass}>Type keywords like "sea view" or "central" and press Enter to tag the property listing</p>
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full" /> Neighborhood POIs (Points of Interest).
              </h3>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-4">Landmark Title</th>
                        <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-4">Description</th>
                        <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32 pr-4">Distance (miles)</th>
                        <th className="pb-3 w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {neighborhoods.map((nb, index) => (
                        <tr key={index} className="border-b border-slate-50 last:border-0">
                          <td className="py-3 pr-4">
                            <input
                              type="text"
                              value={nb.title}
                              onChange={(e) => {
                                const newNbs = [...neighborhoods];
                                newNbs[index].title = e.target.value;
                                setNeighborhoods(newNbs);
                              }}
                              className={tableInputClass}
                              placeholder="e.g. Metro Station"
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <input
                              type="text"
                              value={nb.description || ''}
                              onChange={(e) => {
                                const newNbs = [...neighborhoods];
                                newNbs[index].description = e.target.value;
                                setNeighborhoods(newNbs);
                              }}
                              className={tableInputClass}
                              placeholder="e.g. Central line station"
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <input
                              type="number"
                              step="0.1"
                              value={nb.distance_miles}
                              onChange={(e) => {
                                const newNbs = [...neighborhoods];
                                newNbs[index].distance_miles = Number(e.target.value);
                                setNeighborhoods(newNbs);
                              }}
                              className={`${tableInputClass} text-center`}
                              placeholder="0.0"
                            />
                          </td>
                          <td className="py-3 text-center">
                            <button
                              type="button"
                              onClick={() => setNeighborhoods(prev => prev.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700 font-bold text-lg"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                      {neighborhoods.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                            No landmarks added yet. Click '+ Add Landmark' below to add nearby landmarks.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => setNeighborhoods(prev => [...prev, { title: '', description: '', distance_miles: 0.5 }])}
                  className="bg-slate-50 border border-slate-100 text-slate-800 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-slate-100 transition-colors"
                >
                  + Add Landmark
                </button>
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-emerald-500 rounded-full" /> Livability & Accessibility Scores.
              </h3>
              <div className="space-y-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Walk Score, transit ratings, school ratings, and other lifestyle metrics shown on the property detail page.
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {SCORE_PRESETS.map((preset) => (
                    <button
                      key={preset.title}
                      type="button"
                      onClick={() => setScores((prev) => [...prev, { title: preset.title, score: '', units: preset.units, description: '' }])}
                      className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-emerald-100 transition-colors"
                    >
                      + {preset.title}
                    </button>
                  ))}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-4">Metric</th>
                        <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-28 pr-4">Score</th>
                        <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-24 pr-4">Units</th>
                        <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-4">Label</th>
                        <th className="pb-3 w-16"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((score, index) => (
                        <tr key={index} className="border-b border-slate-50 last:border-0">
                          <td className="py-3 pr-4">
                            <input
                              type="text"
                              value={score.title}
                              onChange={(e) => {
                                const next = [...scores];
                                next[index].title = e.target.value;
                                setScores(next);
                              }}
                              className={tableInputClass}
                              placeholder="e.g. Walk Score"
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={score.score}
                              onChange={(e) => {
                                const next = [...scores];
                                next[index].score = e.target.value;
                                setScores(next);
                              }}
                              className={`${tableInputClass} text-center`}
                              placeholder="85"
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <input
                              type="text"
                              value={score.units || ''}
                              onChange={(e) => {
                                const next = [...scores];
                                next[index].units = e.target.value;
                                setScores(next);
                              }}
                              className={`${tableInputClass} text-center`}
                              placeholder="/100"
                            />
                          </td>
                          <td className="py-3 pr-4">
                            <input
                              type="text"
                              value={score.description || ''}
                              onChange={(e) => {
                                const next = [...scores];
                                next[index].description = e.target.value;
                                setScores(next);
                              }}
                              className={tableInputClass}
                              placeholder="e.g. Excellent"
                            />
                          </td>
                          <td className="py-3 text-center">
                            <button
                              type="button"
                              onClick={() => setScores((prev) => prev.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700 font-bold text-lg"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                      {scores.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                            No scores added yet. Use a preset above or add a custom metric.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => setScores((prev) => [...prev, { title: '', score: '', units: '/100', description: '' }])}
                  className="bg-slate-50 border border-slate-100 text-slate-800 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-slate-100 transition-colors"
                >
                  + Add Custom Score
                </button>
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-amber-500 rounded-full" /> Pricing Adjustments & Overrides.
              </h3>
              
              <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4 mb-6">
                {[
                  { id: 'seasonal', label: 'Seasonal Rates' },
                  { id: 'addons', label: 'Auxiliary Addons' },
                  { id: 'fees', label: 'Additional Fees' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActivePricingTab(tab.id as any)}
                    className={`px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activePricingTab === tab.id ? 'bg-[#6610f2] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activePricingTab === 'seasonal' && (
                <div className="space-y-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Override base price per night for short term rental seasons</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-4">Season Name</th>
                          <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-4">Start Date</th>
                          <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-4">End Date</th>
                          <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-36 pr-4">Override Price ($)</th>
                          <th className="pb-3 w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {seasonalPrices.map((sp, index) => (
                          <tr key={index} className="border-b border-slate-50 last:border-0">
                            <td className="py-3 pr-4">
                              <input
                                type="text"
                                value={sp.season_name}
                                onChange={(e) => {
                                  const newSps = [...seasonalPrices];
                                  newSps[index].season_name = e.target.value;
                                  setSeasonalPrices(newSps);
                                }}
                                className={tableInputClass}
                                placeholder="e.g. Christmas Peak"
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <input
                                type="date"
                                value={sp.start_date}
                                onChange={(e) => {
                                  const newSps = [...seasonalPrices];
                                  newSps[index].start_date = e.target.value;
                                  setSeasonalPrices(newSps);
                                }}
                                className={tableInputClass}
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <input
                                type="date"
                                value={sp.end_date}
                                onChange={(e) => {
                                  const newSps = [...seasonalPrices];
                                  newSps[index].end_date = e.target.value;
                                  setSeasonalPrices(newSps);
                                }}
                                className={tableInputClass}
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <input
                                type="number"
                                value={sp.price}
                                onChange={(e) => {
                                  const newSps = [...seasonalPrices];
                                  newSps[index].price = Number(e.target.value);
                                  setSeasonalPrices(newSps);
                                }}
                                className={`${tableInputClass} text-center`}
                                placeholder="0.00"
                              />
                            </td>
                            <td className="py-3 text-center">
                              <button
                                type="button"
                                onClick={() => setSeasonalPrices(prev => prev.filter((_, i) => i !== index))}
                                className="text-red-500 hover:text-red-700 font-bold text-lg"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                        {seasonalPrices.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                              No seasonal overrides defined yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSeasonalPrices(prev => [...prev, { season_name: '', start_date: '', end_date: '', price: 0 }])}
                    className="bg-slate-50 border border-slate-100 text-slate-800 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-slate-100 transition-colors"
                  >
                    + Add Season Price
                  </button>
                </div>
              )}

              {activePricingTab === 'addons' && (
                <div className="space-y-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Add optional up-sell services (daily cleaning, car rental, tour guide)</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-4">Addon Service</th>
                          <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-4">Description</th>
                          <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-36 pr-4">Addon Cost ($)</th>
                          <th className="pb-3 w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {addons.map((ad, index) => (
                          <tr key={index} className="border-b border-slate-50 last:border-0">
                            <td className="py-3 pr-4">
                              <input
                                type="text"
                                value={ad.title}
                                onChange={(e) => {
                                  const newAds = [...addons];
                                  newAds[index].title = e.target.value;
                                  setAddons(newAds);
                                }}
                                className={tableInputClass}
                                placeholder="e.g. Airport Shuttle"
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <input
                                type="text"
                                value={ad.description || ''}
                                onChange={(e) => {
                                  const newAds = [...addons];
                                  newAds[index].description = e.target.value;
                                  setAddons(newAds);
                                }}
                                className={tableInputClass}
                                placeholder="e.g. Standard one-way pickup"
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <input
                                type="number"
                                value={ad.price}
                                onChange={(e) => {
                                  const newAds = [...addons];
                                  newAds[index].price = Number(e.target.value);
                                  setAddons(newAds);
                                }}
                                className={`${tableInputClass} text-center`}
                                placeholder="0.00"
                              />
                            </td>
                            <td className="py-3 text-center">
                              <button
                                type="button"
                                onClick={() => setAddons(prev => prev.filter((_, i) => i !== index))}
                                className="text-red-500 hover:text-red-700 font-bold text-lg"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                        {addons.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                              No auxiliary addons defined yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddons(prev => [...prev, { title: '', description: '', price: 0 }])}
                    className="bg-slate-50 border border-slate-100 text-slate-800 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-slate-100 transition-colors"
                  >
                    + Add Addon Service
                  </button>
                </div>
              )}

              {activePricingTab === 'fees' && (
                <div className="space-y-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Set additional fees (taxes, cleanings) with dynamic multipliers</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-4">Fee Title</th>
                          <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-36 pr-4">Calculation</th>
                          <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-32 pr-4">Amount ($/%)</th>
                          <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-36 pr-4">Charge Multiplier</th>
                          <th className="pb-3 w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {fees.map((fee, index) => (
                          <tr key={index} className="border-b border-slate-50 last:border-0">
                            <td className="py-3 pr-4">
                              <input
                                type="text"
                                value={fee.title}
                                onChange={(e) => {
                                  const newFees = [...fees];
                                  newFees[index].title = e.target.value;
                                  setFees(newFees);
                                }}
                                className={tableInputClass}
                                placeholder="e.g. Tourism Tax"
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <select
                                value={fee.type}
                                onChange={(e) => {
                                  const newFees = [...fees];
                                  newFees[index].type = e.target.value as any;
                                  setFees(newFees);
                                }}
                                className={tableInputClass}
                              >
                                <option value="fixed">Fixed cost ($)</option>
                                <option value="percentage">Percentage (%)</option>
                              </select>
                            </td>
                            <td className="py-3 pr-4">
                              <input
                                type="number"
                                value={fee.type === 'percentage' ? (fee.rate ?? 0) : fee.amount}
                                onChange={(e) => {
                                  const newFees = [...fees];
                                  const val = Number(e.target.value);
                                  if (fee.type === 'percentage') {
                                    newFees[index].rate = val;
                                    newFees[index].amount = 0;
                                  } else {
                                    newFees[index].amount = val;
                                    newFees[index].rate = null;
                                  }
                                  setFees(newFees);
                                }}
                                className={`${tableInputClass} text-center`}
                                placeholder="0.00"
                              />
                            </td>
                            <td className="py-3 pr-4">
                              <select
                                value={fee.charge_type}
                                onChange={(e) => {
                                  const newFees = [...fees];
                                  newFees[index].charge_type = e.target.value;
                                  setFees(newFees);
                                }}
                                className={tableInputClass}
                              >
                                <option value="per_stay">Per Stay</option>
                                <option value="per_night">Per Night</option>
                                <option value="per_guest">Per Guest</option>
                              </select>
                            </td>
                            <td className="py-3 text-center">
                              <button
                                type="button"
                                onClick={() => setFees(prev => prev.filter((_, i) => i !== index))}
                                className="text-red-500 hover:text-red-700 font-bold text-lg"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                        {fees.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                              No additional fees defined yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFees(prev => [...prev, { title: '', amount: 0, type: 'fixed', rate: null, charge_type: 'per_stay' }])}
                    className="bg-slate-50 border border-slate-100 text-slate-800 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-slate-100 transition-colors"
                  >
                    + Add Charge Fee
                  </button>
                </div>
              )}
            </div>

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Terms & Regulations.
              </h3>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Property Rules</label>
                  <textarea value={form.rules} onChange={(e) => updateForm('rules', e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="e.g. No smoking inside, Quiet hours after 10 PM, Pets allowed under 25lbs..." />
                  <p className={fieldHintClass}>Establish guidelines for guests, renters, or visitors</p>
                </div>
                <div>
                  <label className={labelClass}>Cancellation & Booking Policies</label>
                  <textarea value={form.policies} onChange={(e) => updateForm('policies', e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="e.g. Free cancellation up to 48 hours prior to check-in, 50% refund afterwards..." />
                  <p className={fieldHintClass}>Specify cancellation, security deposit, and refund structures</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-10 space-y-8">
              <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Asset Status</p>
                  <span className="text-4xl font-black italic tracking-tighter">{form.is_published ? 'LIVE' : 'DRAFT'}</span>
                  <div className="space-y-4 mt-8">
                    <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl cursor-pointer">
                      <span className="text-sm font-bold">Published</span>
                      <input type="checkbox" checked={form.is_published} onChange={(e) => updateForm('is_published', e.target.checked)} className="w-5 h-5 accent-[#6610f2]" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl cursor-pointer">
                      <span className="text-sm font-bold">Featured</span>
                      <input type="checkbox" checked={form.is_featured} onChange={(e) => updateForm('is_featured', e.target.checked)} className="w-5 h-5 accent-[#6610f2]" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] bg-white/60">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                  Listing Checklist
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Title', done: form.title.length > 5 },
                    { label: 'Location', done: Boolean(form.address && form.city && form.country) },
                    { label: 'Taxonomy', done: Boolean(form.category_id && form.type_id && form.location_id) },
                    { label: 'Primary media', done: files.some(f => f.isMain) },
                    { label: 'Narrative', done: form.description.length > 20 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">{item.label}</span>
                      <span className={item.done ? 'text-green-500' : 'text-slate-300'}>{item.done ? 'Ready' : 'Missing'}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">
                  Complete taxonomy, address, media, and narrative before publishing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <ActionPill isSaving={isSaving} isEditMode={isEditMode} onSave={handleSave} label="Property" variant="floating" showOnDesktop />
      )}
    </div>
  );
}
