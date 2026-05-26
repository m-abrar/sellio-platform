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
import { ApiError } from '../../lib/apiError';

const containerClass = 'bg-white border border-slate-100 rounded-[2rem] shadow-[0_18px_44px_rgba(0,0,0,0.035)] p-6 md:p-10';
const labelClass = 'text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2';
const inputClass = 'w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300';
const fieldHintClass = 'mt-2 ml-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300';

const defaultForm = {
  title: '',
  description: '',
  category_id: '',
  type_id: '',
  location_id: '',
  address: '',
  city: '',
  country: '',
  zip_code: '',
  base_price: '',
  sale_price: '',
  price_per_night: '',
  is_sale: true,
  is_rental: false,
  number_of_bedrooms: '',
  number_of_bathrooms: '',
  maximum_guests: '',
  area_sq_ft: '',
  year_built: '',
  is_published: true,
  is_featured: false,
};

export default function CreateProperty() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  const [formMeta, setFormMeta] = useState<any>({ categories: [], types: [], locations: [], amenities: [] });
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [form, setForm] = useState(defaultForm);

  const updateForm = useCallback((field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const meta = await getPropertyFormMeta();
        setFormMeta(meta);

        if (isEditMode && slug) {
          const { data: property } = await getPropertyBySlug(slug);
          setPropertyId(property.id);
          setForm({
            title: property.title || '',
            description: property.description || '',
            category_id: property.category_id ? String(property.category_id) : '',
            type_id: property.type_id ? String(property.type_id) : '',
            location_id: property.location_id ? String(property.location_id) : '',
            address: property.address || '',
            city: property.city || '',
            country: property.country || '',
            zip_code: property.zip_code || '',
            base_price: property.base_price != null ? String(property.base_price) : '',
            sale_price: property.sale_price != null ? String(property.sale_price) : '',
            price_per_night: property.price_per_night != null ? String(property.price_per_night) : '',
            is_sale: property.is_sale ?? true,
            is_rental: property.is_rental ?? false,
            number_of_bedrooms: property.number_of_bedrooms != null ? String(property.number_of_bedrooms) : '',
            number_of_bathrooms: property.number_of_bathrooms != null ? String(property.number_of_bathrooms) : '',
            maximum_guests: property.maximum_guests != null ? String(property.maximum_guests) : '',
            area_sq_ft: property.area_sq_ft != null ? String(property.area_sq_ft) : '',
            year_built: property.year_built != null ? String(property.year_built) : '',
            is_published: property.is_active ?? true,
            is_featured: property.status?.is_featured ?? false,
          });
          setSelectedAmenities((property.amenities ?? []).map((item: any) => item.id));

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { key: 'category_id', label: 'Category', options: formMeta.categories, hint: 'Required' },
                    { key: 'type_id', label: 'Type', options: formMeta.types, hint: 'Required' },
                    { key: 'location_id', label: 'Location Zone', options: formMeta.locations, hint: 'Required' },
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
                  <label className={labelClass}>Country</label>
                  <input type="text" value={form.country} onChange={(e) => updateForm('country', e.target.value)} className={inputClass} placeholder="Country" />
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>Zip Code</label>
                  <input type="text" value={form.zip_code} onChange={(e) => updateForm('zip_code', e.target.value)} className={inputClass} placeholder="Zip" />
                  <p className={fieldHintClass}>Optional</p>
                </div>
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <HiOutlineCurrencyDollar className="w-6 h-6 text-slate-300" /> Pricing.
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <HiOutlineHome className="w-6 h-6 text-slate-300" /> Specs.
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[
                  { key: 'number_of_bedrooms', label: 'Bedrooms' },
                  { key: 'number_of_bathrooms', label: 'Bathrooms' },
                  { key: 'maximum_guests', label: 'Max Guests' },
                  { key: 'area_sq_ft', label: 'Area (sq ft)' },
                  { key: 'year_built', label: 'Year Built' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className={labelClass}>{field.label}</label>
                    <input type="number" value={(form as any)[field.key]} onChange={(e) => updateForm(field.key, e.target.value)} className={`${inputClass} px-4`} />
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

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Media Studio.
              </h3>
              <MediaStudio files={files} setFiles={setFiles} />
            </div>

            <div className={containerClass}>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8">Property Narrative.</h3>
              <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={6} className={`${inputClass} resize-none`} placeholder="Describe the architectural highlights and amenities..." />
              <p className={fieldHintClass}>Required</p>
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
