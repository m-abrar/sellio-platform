import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { triggerCelebration } from '../../utils/animations';
import {
  HiOutlineTag,
  HiOutlineCurrencyDollar,
  HiOutlineMapPin,
  HiOutlineChevronLeft
} from 'react-icons/hi2';
import MediaStudio from '../../components/studio/MediaStudio';
import PageHeader from '../../components/layout/PageHeader';
import ActionPill from '../../utils/ActionPill';
import { createClassified, getClassifiedBySlug, getClassifiedFormMeta, updateClassified } from '../../api/classifieds';
import { ApiError } from '../../lib/apiError';
import { mapConditionToRating, parseLocationParts } from '../../lib/classifiedAdapter';

const containerClass = 'bg-white border border-slate-100 rounded-[2rem] shadow-[0_18px_44px_rgba(0,0,0,0.035)] p-6 md:p-10';
const labelClass = 'text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2';
const inputClass = 'w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300';
const fieldHintClass = 'mt-2 ml-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300';

const defaultForm = {
  title: '',
  category_id: '',
  type_id: '',
  location_id: '',
  base_price: '',
  sale_price: '',
  description: '',
  condition: 'Used - Good',
  item_year_age: '',
  item_quantity: '1',
  item_dimensions: '',
  warranty_months: '',
  min_ad_duration: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zip_code: '',
  is_published: true,
  is_featured: false,
  is_for_sale: true,
  is_for_rent: false,
};

export default function CreateClassified() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  const [formMeta, setFormMeta] = useState<any>({ categories: [], types: [], locations: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [classifiedId, setClassifiedId] = useState<number | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [form, setForm] = useState(defaultForm);

  const updateForm = useCallback((field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const progress = useMemo(() => {
    let score = 0;
    if (form.title.length > 5) score += 20;
    if (files.some((f) => f.isMain)) score += 20;
    if (Number(form.base_price) > 0) score += 20;
    if (form.category_id !== '' && form.type_id !== '') score += 15;
    if (form.city.length > 1 && form.country.length > 1) score += 10;
    if (form.description.length > 20) score += 15;
    return score;
  }, [form, files]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const meta = await getClassifiedFormMeta();
        setFormMeta(meta);

        if (isEditMode && slug) {
          const { data: classified } = await getClassifiedBySlug(slug);
          setClassifiedId(classified.id);
          setForm({
            title: classified.title || '',
            category_id: classified.category_id ? String(classified.category_id) : '',
            type_id: classified.type_id ? String(classified.type_id) : '',
            location_id: classified.location_id ? String(classified.location_id) : '',
            base_price: classified.base_price != null ? String(classified.base_price) : '',
            sale_price: classified.sale_price != null ? String(classified.sale_price) : '',
            description: classified.description || '',
            condition: classified.condition || 'Used - Good',
            item_year_age: classified.item_year_age != null ? String(classified.item_year_age) : '',
            item_quantity: classified.item_quantity != null ? String(classified.item_quantity) : '1',
            item_dimensions: classified.item_dimensions != null ? String(classified.item_dimensions) : '',
            warranty_months: classified.warranty_months != null ? String(classified.warranty_months) : '',
            min_ad_duration: classified.min_ad_duration != null ? String(classified.min_ad_duration) : '',
            address: classified.address || '',
            city: classified.city || '',
            state: classified.state || '',
            country: classified.country || '',
            zip_code: classified.zip_code || '',
            is_published: classified.is_published ?? true,
            is_featured: classified.is_featured ?? false,
            is_for_sale: classified.is_for_sale ?? true,
            is_for_rent: classified.is_for_rent ?? false,
          });

          const initialMedia: any[] = [];
          if (classified.featured_image) {
            initialMedia.push({
              id: classified.main_photo_id,
              url: classified.featured_image,
              preview: classified.featured_image,
              isMain: true,
              existing: true,
            });
          }
          (classified.gallery ?? []).forEach((item: any) => {
            if (item.url !== classified.featured_image) {
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
        console.error('Failed to initialize classified form', error);
        toast.error('Failed to load listing data.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [isEditMode, slug]);

  const buildFormData = () => {
    const formData = new FormData();
    const fallbackLocation = parseLocationParts(`${form.city}, ${form.country}`);

    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category_id', form.category_id);
    formData.append('type_id', form.type_id);
    formData.append('location_id', form.location_id);
    formData.append('base_price', form.base_price || '0');
    formData.append('sale_price', form.sale_price);
    formData.append('item_condition', String(mapConditionToRating(form.condition)));
    formData.append('item_year_age', form.item_year_age);
    formData.append('item_quantity', form.item_quantity);
    formData.append('item_dimensions', form.item_dimensions);
    formData.append('warranty_months', form.warranty_months);
    formData.append('min_ad_duration', form.min_ad_duration);
    formData.append('address', form.address);
    formData.append('city', form.city || fallbackLocation.city);
    formData.append('state', form.state);
    formData.append('country', form.country || fallbackLocation.country);
    formData.append('zip_code', form.zip_code);
    formData.append('is_for_sale', form.is_for_sale ? '1' : '0');
    formData.append('is_for_rent', form.is_for_rent ? '1' : '0');
    formData.append('is_published', form.is_published ? '1' : '0');
    formData.append('is_featured', form.is_featured ? '1' : '0');

    formData.append('sync_existing_media', '1');
    files.forEach((fileObj) => {
      if (fileObj.file) {
        if (fileObj.isMain) formData.append('main_image', fileObj.file);
        else formData.append('gallery[]', fileObj.file);
      } else if (fileObj.existing) {
        if (fileObj.id == null) return;
        if (fileObj.isMain) formData.append('existing_main_media_id', String(fileObj.id));
        else formData.append('existing_media_ids[]', String(fileObj.id));
      }
    });

    return formData;
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.category_id || !form.type_id) {
      toast.error('Please complete the required listing fields.');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Publishing your listing...');

    try {
      const formData = buildFormData();

      if (isEditMode && classifiedId) {
        await updateClassified(classifiedId, formData);
      } else {
        await createClassified(formData);
      }

      toast.success(`${form.title || 'Classified'} saved successfully.`, { id: toastId });
      await triggerCelebration();
      navigate('/dashboard/classifieds');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to save listing.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 opacity-60 p-10">
        <div className="lg:col-span-8 space-y-10">
          {[1, 2].map((i) => (
            <div key={i} className={`${containerClass} h-[300px] animate-pulse`} />
          ))}
        </div>
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[3rem] h-[200px] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Community Exchange"
        title={isEditMode ? 'Modify' : 'Post'}
        subtitle="Classified"
      >
        <button
          onClick={() => navigate(-1)}
          className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <HiOutlineChevronLeft className="w-4 h-4" /> Back
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10">
        <div className="lg:col-span-8 space-y-8 md:space-y-10">
          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Listing Details.
            </h3>
            <div className="space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>What are you selling?</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className={`${inputClass} text-2xl italic tracking-tighter`}
                    placeholder="e.g. Vintage Record Player"
                  />
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => updateForm('category_id', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select category...</option>
                    {formMeta.categories.map((category: any) => (
                      <option key={category.id} value={category.id}>{category.title}</option>
                    ))}
                  </select>
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select
                    value={form.type_id}
                    onChange={(e) => updateForm('type_id', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select type...</option>
                    {formMeta.types.map((type: any) => (
                      <option key={type.id} value={type.id}>{type.title}</option>
                    ))}
                  </select>
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>Base Price</label>
                  <div className="relative">
                    <HiOutlineCurrencyDollar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      value={form.base_price}
                      onChange={(e) => updateForm('base_price', e.target.value)}
                      className={`${inputClass} pl-14`}
                      placeholder="0.00"
                    />
                  </div>
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>Sale Price</label>
                  <input
                    type="number"
                    value={form.sale_price}
                    onChange={(e) => updateForm('sale_price', e.target.value)}
                    className={inputClass}
                    placeholder="Optional"
                  />
                  <p className={fieldHintClass}>Optional</p>
                </div>
                <div>
                  <label className={labelClass}>Condition</label>
                  <select
                    value={form.condition}
                    onChange={(e) => updateForm('condition', e.target.value)}
                    className={inputClass}
                  >
                    <option>New</option>
                    <option>Used - Like New</option>
                    <option>Used - Excellent</option>
                    <option>Used - Good</option>
                    <option>Used - Fair</option>
                  </select>
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>Quantity</label>
                  <input type="number" min="1" value={form.item_quantity} onChange={(e) => updateForm('item_quantity', e.target.value)} className={inputClass} />
                  <p className={fieldHintClass}>Required</p>
                </div>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <HiOutlineMapPin className="w-6 h-6 text-slate-300" /> Location.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Location Zone</label>
                <select value={form.location_id} onChange={(e) => updateForm('location_id', e.target.value)} className={inputClass}>
                  <option value="">Select...</option>
                  {formMeta.locations.map((location: any) => (
                    <option key={location.id} value={location.id}>{location.title}</option>
                  ))}
                </select>
                <p className={fieldHintClass}>Optional</p>
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
                <label className={labelClass}>State</label>
                <input type="text" value={form.state} onChange={(e) => updateForm('state', e.target.value)} className={inputClass} placeholder="State" />
                <p className={fieldHintClass}>Optional</p>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Address</label>
                  <div className="relative">
                    <HiOutlineMapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => updateForm('address', e.target.value)}
                      className={`${inputClass} pl-14`}
                      placeholder="Street address"
                    />
                  </div>
                <p className={fieldHintClass}>Optional</p>
              </div>
              <div>
                <label className={labelClass}>Zip Code</label>
                <input type="text" value={form.zip_code} onChange={(e) => updateForm('zip_code', e.target.value)} className={inputClass} />
                <p className={fieldHintClass}>Optional</p>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-500 rounded-full" /> Item Specs.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className={labelClass}>Year</label>
                <input type="number" value={form.item_year_age} onChange={(e) => updateForm('item_year_age', e.target.value)} className={inputClass} placeholder="Optional" />
              </div>
              <div>
                <label className={labelClass}>Dimensions</label>
                <input type="number" value={form.item_dimensions} onChange={(e) => updateForm('item_dimensions', e.target.value)} className={inputClass} placeholder="Optional" />
              </div>
              <div>
                <label className={labelClass}>Warranty</label>
                <input type="number" value={form.warranty_months} onChange={(e) => updateForm('warranty_months', e.target.value)} className={inputClass} placeholder="Months" />
              </div>
              <div>
                <label className={labelClass}>Ad Duration</label>
                <input type="number" value={form.min_ad_duration} onChange={(e) => updateForm('min_ad_duration', e.target.value)} className={inputClass} placeholder="Days" />
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Media Studio.
            </h3>
            <MediaStudio files={files} setFiles={setFiles} />
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8">Item Narrative.</h3>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={6}
              className={`${inputClass} resize-none`}
              placeholder="Tell buyers more about the item..."
            />
            <p className={fieldHintClass}>Required</p>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-10 space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Listing Readiness</p>
              <span className="text-5xl font-black italic tracking-tighter">{progress}%</span>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-[#6610f2] transition-all duration-1000 shadow-[0_0_15px_#6610f2]" style={{ width: `${progress}%` }} />
              </div>
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
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineTag className="w-32 h-32" />
            </div>
          </div>

          <div className={containerClass}>
            <h4 className={labelClass}>Listing Options</h4>
            <div className="space-y-4 mt-6">
              {[
                { key: 'is_for_sale', label: 'For Sale' },
                { key: 'is_for_rent', label: 'For Rent' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-[#6610f2] transition-colors">{item.label}</span>
                  <input type="checkbox" checked={form[item.key as keyof typeof form] as boolean} onChange={(e) => updateForm(item.key, e.target.checked)} className="w-6 h-6 rounded-lg accent-[#6610f2] cursor-pointer" />
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] bg-white/60">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Listing Checklist</p>
            <div className="space-y-3">
              {[
                { label: 'Title', done: form.title.length > 5 },
                { label: 'Taxonomy', done: Boolean(form.category_id && form.type_id) },
                { label: 'Pricing', done: Number(form.base_price) > 0 },
                { label: 'Location', done: Boolean(form.city && form.country) },
                { label: 'Primary media', done: files.some((f) => f.isMain) },
                { label: 'Narrative', done: form.description.length > 20 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">{item.label}</span>
                  <span className={item.done ? 'text-green-500' : 'text-slate-300'}>{item.done ? 'Ready' : 'Missing'}</span>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>

      <ActionPill
        isSaving={isSaving}
        isEditMode={isEditMode}
        onSave={handleSave}
        label="Listing"
        variant="floating"
        showOnDesktop
      />
    </div>
  );
}
