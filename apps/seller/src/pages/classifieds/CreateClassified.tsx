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
import { getWelcomeData } from '../../api/dashboard';
import { ApiError } from '../../lib/apiError';
import { mapConditionToRating, parseLocationParts } from '../../lib/classifiedAdapter';

const containerClass = 'bg-white border border-slate-100 rounded-card-lg shadow-elite p-6 md:p-10';
const labelClass = 'text-label font-black text-slate-400 uppercase tracking-caps mb-3 block ml-2';
const inputClass = 'w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-card-sm px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300';
const fieldHintClass = 'mt-2 ml-2 text-micro font-bold uppercase tracking-label-wide text-slate-300';

const defaultForm = {
  title: '',
  category_id: '',
  type_id: '',
  brand_id: '',
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
  latitude: '',
  longitude: '',
  meta_title: '',
  meta_description: '',
  is_published: true,
  is_featured: false,
  is_for_sale: true,
  is_for_rent: false,
};

export default function CreateClassified() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  const [formMeta, setFormMeta] = useState<any>({ categories: [], types: [], locations: [], brands: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [classifiedId, setClassifiedId] = useState<number | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [limits, setLimits] = useState<any>(null);

  const updateForm = useCallback((field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/,$/, '');
      if (val && !tags.includes(val)) {
        setTags((prev) => [...prev, val]);
      }
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

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
        const [meta, dashboardResponse] = await Promise.all([
          getClassifiedFormMeta(),
          !isEditMode ? getWelcomeData().catch(() => null) : Promise.resolve(null)
        ]);
        setFormMeta(meta);
        if (dashboardResponse) {
          setLimits(dashboardResponse.data.subscriptionLimits);
        }

        if (isEditMode && slug) {
          const { data: classified } = await getClassifiedBySlug(slug);
          setClassifiedId(classified.id);
          setForm({
            title: classified.title || '',
            category_id: classified.category_id ? String(classified.category_id) : '',
            type_id: classified.type_id ? String(classified.type_id) : '',
            brand_id: classified.brand_id ? String(classified.brand_id) : '',
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
            latitude: classified.latitude != null ? String(classified.latitude) : '',
            longitude: classified.longitude != null ? String(classified.longitude) : '',
            meta_title: classified.meta_title || '',
            meta_description: classified.meta_description || '',
            is_published: classified.is_published ?? true,
            is_featured: classified.is_featured ?? false,
            is_for_sale: classified.is_for_sale ?? true,
            is_for_rent: classified.is_for_rent ?? false,
          });

          if (classified.tags) {
            setTags(classified.tags);
          }

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

    if (form.brand_id) formData.append('brand_id', form.brand_id);
    if (form.latitude) formData.append('latitude', form.latitude);
    if (form.longitude) formData.append('longitude', form.longitude);
    if (form.meta_title) formData.append('meta_title', form.meta_title);
    if (form.meta_description) formData.append('meta_description', form.meta_description);
    formData.append('is_for_sale', form.is_for_sale ? '1' : '0');
    formData.append('is_for_rent', form.is_for_rent ? '1' : '0');
    formData.append('is_published', form.is_published ? '1' : '0');
    formData.append('is_featured', form.is_featured ? '1' : '0');

    tags.forEach((tag) => formData.append('tags[]', tag));

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
          <div className="bg-slate-900 rounded-floating h-[200px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isLoading && !isEditMode && limits?.is_limit_exceeded) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <PageHeader badge="Limit Reached" title="Post" subtitle="Classified" />
        <div className="bg-slate-900 rounded-floating p-12 text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="relative z-10 max-w-md space-y-8">
            <div className="w-20 h-20 rounded-3xl bg-brand/20 border border-brand/30 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <span className="text-4xl">🛡️</span>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black italic tracking-tight">Active Limit Reached!</h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                You have reached your subscription active listing limit ({limits.current_listings_count} / {limits.max_listings} listings). 
                Please upgrade your plan to post more classified listings.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => navigate('/dashboard/memberships')}
              className="bg-brand hover:bg-brand-hover px-10 py-5 rounded-card font-black text-xs uppercase tracking-caps transition-all duration-300 shadow-xl shadow-purple-900/40 inline-flex items-center gap-2 cursor-pointer"
            >
              Upgrade Subscription Plan
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand/20 rounded-full blur-[120px]" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-brand/10 rounded-full blur-[120px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Community Exchange"
        title={isEditMode ? 'Edit' : 'Post'}
        subtitle="Classified"
      >
        <button
          onClick={() => navigate(-1)}
          className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-card font-black text-caption uppercase tracking-caps hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <HiOutlineChevronLeft className="w-4 h-4" /> Back
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10">
        <div className="lg:col-span-8 space-y-8 md:space-y-10">
          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-brand rounded-full" /> Listing Details.
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
                  <label className={labelClass}>Company Brand</label>
                  <select
                    value={form.brand_id}
                    onChange={(e) => updateForm('brand_id', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select brand...</option>
                    {formMeta.brands?.map((brand: any) => (
                      <option key={brand.id} value={brand.id}>{brand.title}</option>
                    ))}
                  </select>
                  <p className={fieldHintClass}>Optional</p>
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
              <div className="md:col-span-2 grid grid-cols-2 gap-6 pt-4 border-t border-slate-100/50">
                <div>
                  <label className={labelClass}>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => updateForm('latitude', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 37.7749"
                  />
                </div>
                <div>
                  <label className={labelClass}>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => updateForm('longitude', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. -122.4194"
                  />
                </div>
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
              <span className="w-2 h-8 bg-brand rounded-full" /> Photos & Media.
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

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-teal-500 rounded-full" /> Discoverability Tags.
            </h3>
            <p className="text-label font-black text-slate-400 mb-6 leading-relaxed tracking-wider">
              ADD SEARCH KEYWORDS AND RELEVANT TAGS TO AMPLIFY DISCOVERABILITY ACROSS SEARCH SECTORS (E.G. 'VINTAGE', 'REFURBISHED', 'COLLECTIBLE'). PRESS ENTER OR COMMA TO CAST A TAG CHIP.
            </p>
            <div className="flex flex-wrap gap-2.5 mb-6">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white font-black text-label uppercase tracking-widest px-4.5 py-2.5 rounded-full shadow-sm select-none"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(idx)}
                    className="hover:text-red-400 transition-colors focus:outline-none"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              {tags.length === 0 && (
                <span className="text-label font-bold uppercase tracking-widest text-slate-300 italic py-2">
                  No tags added yet...
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className={inputClass}
                placeholder="Type keyword and press Enter or Comma..."
              />
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-sky-500 rounded-full" /> Discovery Details (SEO).
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="md:col-span-2">
                <label className={labelClass}>Meta Title</label>
                <input
                  type="text"
                  value={form.meta_title}
                  onChange={(e) => updateForm('meta_title', e.target.value)}
                  className={inputClass}
                  placeholder="Search engine result title"
                />
                <p className={fieldHintClass}>Optional</p>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Meta Description</label>
                <textarea
                  value={form.meta_description}
                  onChange={(e) => updateForm('meta_description', e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Short, attractive search snippet for search engines..."
                />
                <p className={fieldHintClass}>Optional</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-10 space-y-8">
          <div className="bg-slate-900 rounded-card-lg p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-label font-black uppercase tracking-widest text-slate-500 mb-6">Listing Readiness</p>
              <span className="text-5xl font-black italic tracking-tighter">{progress}%</span>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-brand transition-all duration-1000 shadow-[0_0_15px_#6610f2]" style={{ width: `${progress}%` }} />
              </div>
              <div className="space-y-4 mt-8">
                <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl cursor-pointer">
                  <span className="text-sm font-bold">Published</span>
                  <input type="checkbox" checked={form.is_published} onChange={(e) => updateForm('is_published', e.target.checked)} className="w-5 h-5 accent-brand" />
                </label>
                <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl cursor-pointer">
                  <span className="text-sm font-bold">Featured</span>
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => updateForm('is_featured', e.target.checked)} className="w-5 h-5 accent-brand" />
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
                  <span className="text-sm font-bold text-slate-700 group-hover:text-brand transition-colors">{item.label}</span>
                  <input type="checkbox" checked={form[item.key as keyof typeof form] as boolean} onChange={(e) => updateForm(item.key, e.target.checked)} className="w-6 h-6 rounded-lg accent-brand cursor-pointer" />
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 border-2 border-dashed border-slate-100 rounded-card-lg bg-white/60">
            <p className="text-label font-black text-slate-500 uppercase tracking-caps mb-4">Listing Checklist</p>
            <div className="space-y-3">
              {[
                { label: 'Title', done: form.title.length > 5 },
                { label: 'Taxonomy', done: Boolean(form.category_id && form.type_id) },
                { label: 'Pricing', done: Number(form.base_price) > 0 },
                { label: 'Location', done: Boolean(form.city && form.country) },
                { label: 'Primary media', done: files.some((f) => f.isMain) },
                { label: 'Narrative', done: form.description.length > 20 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 text-label font-black uppercase tracking-widest">
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
