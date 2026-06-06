import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { triggerCelebration } from '../../utils/animations';
import {
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineHashtag,
  HiOutlineChevronLeft
} from 'react-icons/hi2';

// API Services
import { getProductBySlug, createProduct, updateProduct } from '../../api/products';
import { getCategories, getBrands, getProductTypes, getProductFeatures } from '../../api/categories';
import { getWelcomeData } from '../../api/dashboard';
import { ApiError } from '../../lib/apiError';

// Studio Components
import MediaStudio from '../../components/studio/MediaStudio';
import PageHeader from '../../components/layout/PageHeader';
import ActionPill from '../../utils/ActionPill';

export default function CreateProduct() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  // Design Constants (Mirroring Create Property)
  const containerClass = "bg-white border border-slate-100 rounded-[2rem] shadow-[0_18px_44px_rgba(0,0,0,0.035)] p-6 md:p-10";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2";
  const inputClass = "w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300";
  const fieldHintClass = "mt-2 ml-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300";

  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [allFeatures, setAllFeatures] = useState<any[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [limits, setLimits] = useState<any>(null);

  const [form, setForm] = useState<any>({
    title: '',
    sku: '',
    category_id: '',
    brand_id: '',
    type_id: '',
    description: '',
    short_description: '',
    base_price: '',
    sale_price: '',
    cost_price: '',
    on_sale: false,
    stock_quantity: 0,
    low_stock_threshold: '',
    manage_stock: true,
    weight: '',
    length: '',
    width: '',
    height: '',
    video: '',
    is_published: false,
    is_featured: false,
    is_digital: false,
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Categories & Features
        const [flatCategories, flatBrands, flatTypes, flatFeatures, dashboardResponse] = await Promise.all([
          getCategories(),
          getBrands(),
          getProductTypes(),
          getProductFeatures(),
          !isEditMode ? getWelcomeData().catch(() => null) : Promise.resolve(null)
        ]);
        setCategories(flatCategories);
        setBrands(flatBrands);
        setTypes(flatTypes);
        setAllFeatures(flatFeatures);
        if (dashboardResponse) {
          setLimits(dashboardResponse.data.subscriptionLimits);
        }

        if (isEditMode && slug) {
          const { data: p } = await getProductBySlug(slug);

          setProductId(p.id);

          // Handle Dimensions
          const hasDims = p.specs?.dimensions && p.specs.dimensions !== 'N/A';
          const dims = hasDims ? p.specs.dimensions.replace(' cm', '').split('x') : ['', '', ''];

          setForm({
            title: p.title || '',
            sku: p.sku || '',
            category_id: p.category?.id || '',
            brand_id: p.brand?.id || '',
            type_id: p.type?.id || '',
            description: p.description || '',
            short_description: p.short_description || '',
            base_price: p.pricing?.base_price || '',
            sale_price: p.pricing?.sale_price || '',
            cost_price: p.pricing?.cost_price || '',
            on_sale: p.pricing?.on_sale ?? Boolean(p.pricing?.sale_price),
            stock_quantity: p.inventory?.stock_quantity || 0,
            low_stock_threshold: p.inventory?.low_stock_threshold ?? '',
            manage_stock: p.inventory?.manage_stock ?? true,
            weight: p.specs?.weight_value ?? String(p.specs?.weight || '').replace(' kg', ''),
            length: p.specs?.length ?? dims[0] ?? '',
            width: p.specs?.width ?? dims[1] ?? '',
            height: p.specs?.height ?? dims[2] ?? '',
            video: p.video_url || '',
            is_published: p.status?.is_published ?? true,
            is_featured: p.status?.is_featured ?? p.is_featured ?? false,
            is_digital: p.inventory?.is_digital ?? false,
            meta_title: p.meta?.title || '',
            meta_description: p.meta?.description || '',
          });

          if (p.features && Array.isArray(p.features)) {
            setSelectedFeatures(p.features.map((f: any) => f.id));
          } else if (p.specs?.features && Array.isArray(p.specs.features)) {
            setSelectedFeatures(p.specs.features.map((f: any) => f.id));
          }
          if (p.tags && Array.isArray(p.tags)) {
            setTags(p.tags);
          }

          // Handle Spatie Media Integration
          const initialMedia: any[] = [];
          if (p.featured_image) {
            initialMedia.push({
              id: p.featured_image_id,
              url: p.featured_image,
              preview: p.featured_image,
              isMain: true,
              existing: true
            });
          }

          if (p.gallery && Array.isArray(p.gallery)) {
            p.gallery.forEach((item: any) => {
              if (item.url !== p.featured_image) {
                initialMedia.push({
                  id: item.id,
                  url: item.url,
                  preview: item.thumbnail || item.url,
                  isMain: false,
                  existing: true
                });
              }
            });
          }
          setFiles(initialMedia);
        }
      } catch (err) {
        console.error("Initialization failed", err);
        toast.error("Failed to load product data.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [slug, isEditMode]);

  const updateForm = useCallback((field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const toggleFeature = useCallback((id: number) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  }, []);

  const handleTagKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags((prev) => [...prev, val]);
      }
      setTagInput('');
    }
  }, [tagInput, tags]);

  const removeTag = useCallback((idx: number) => {
    setTags((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const progress = useMemo(() => {
    let score = 0;
    if (form.title.length > 5) score += 20;
    if (files.some(f => f.isMain)) score += 20;
    if (Number(form.base_price) > 0) score += 20;
    if (form.category_id !== '') score += 20;
    if (form.sku !== '') score += 20;
    return score;
  }, [form, files]);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Syncing media and saving product...');

    const formData = new FormData();
    Object.keys(form).forEach(key =>
      formData.append(key, String(form[key as keyof typeof form]))
    );
    formData.set('on_sale', String(Boolean(form.sale_price) && Number(form.sale_price) > 0));

    files.forEach((fileObj) => {
      if (fileObj.file) {
        if (fileObj.isMain) formData.append('main_image', fileObj.file);
        else formData.append('gallery[]', fileObj.file);
      } else if (fileObj.existing) {
        formData.append('existing_media_ids[]', String(fileObj.id));
      }
    });

    selectedFeatures.forEach((id) => formData.append('features[]', String(id)));
    tags.forEach((tag) => formData.append('tags[]', tag));

    try {
      if (isEditMode && productId) {
        await updateProduct(productId, formData);
      } else {
        await createProduct(formData);
      }

      toast.success(`${form.title || 'Product'} saved successfully.`, { id: toastId });
      setIsSaving(false);
      await triggerCelebration();
      navigate('/dashboard/products');
    } catch (err: unknown) {
      setIsSaving(false);
      const errorMessage = err instanceof ApiError ? err.message : 'Validation failed.';
      toast.error(errorMessage, { id: toastId });
      throw err;
    }
  };

  if (!isLoading && !isEditMode && limits?.is_limit_exceeded) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <PageHeader badge="Limit Guard" title="Register" subtitle="Product" />
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="relative z-10 max-w-md space-y-8">
            <div className="w-20 h-20 rounded-3xl bg-[#6610f2]/20 border border-[#6610f2]/30 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <span className="text-4xl">🛡️</span>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black italic tracking-tight">Active Limit Reached!</h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                You have reached your subscription active listing limit ({limits.current_listings_count} / {limits.max_listings} listings). 
                Please upgrade your plan to register more products.
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
      <PageHeader
        badge="Asset Protocol"
        title={isEditMode ? "Modify" : "Register"}
        subtitle="Product"
      >
        <button
          onClick={() => navigate(-1)}
          className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <HiOutlineChevronLeft className="w-4 h-4" /> Back
        </button>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 opacity-60">
          <div className="lg:col-span-8 space-y-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${containerClass} h-[300px] animate-pulse flex flex-col justify-center items-center`}>
                <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#6610f2] animate-progress-loading" />
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4 space-y-10">
             <div className="bg-slate-900 rounded-[3rem] h-[200px] animate-pulse" />
             <div className={`${containerClass} h-[400px] animate-pulse`} />
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10">
        <div className="lg:col-span-8 space-y-8 md:space-y-10">
          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Primary Identity.
            </h3>
            <div className="space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="md:col-span-2">
                  <label className={labelClass}>Product Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className={`${inputClass} text-2xl italic tracking-tighter`}
                    placeholder="e.g. Titanium Executive Watch"
                  />
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>Asset Classification (Category)</label>
                  <div className="relative">
                    <select
                      value={form.category_id}
                      onChange={(e) => updateForm('category_id', e.target.value)}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="" disabled>Select Classification...</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>Product Type</label>
                  <select
                    value={form.type_id}
                    onChange={(e) => updateForm('type_id', e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="">Select Type...</option>
                    {types.map((type: any) => (
                      <option key={type.id} value={type.id}>{type.title}</option>
                    ))}
                  </select>
                  <p className={fieldHintClass}>Optional</p>
                </div>
                <div>
                  <label className={labelClass}>Universal SKU</label>
                  <div className="relative">
                    <HiOutlineHashtag className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => updateForm('sku', e.target.value)}
                      className={`${inputClass} pl-14 uppercase tracking-widest`}
                      placeholder="SKU-0000"
                    />
                  </div>
                  <p className={fieldHintClass}>Optional</p>
                </div>
                <div>
                  <label className={labelClass}>Brand Identifier</label>
                  <select
                    value={form.brand_id}
                    onChange={(e) => updateForm('brand_id', e.target.value)}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="">Select Brand...</option>
                    {brands.map((brand: any) => (
                      <option key={brand.id} value={brand.id}>{brand.title}</option>
                    ))}
                  </select>
                  <p className={fieldHintClass}>Optional</p>
                </div>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full" /> Commercial & Stock.
            </h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div>
                  <label className={labelClass}>Base Valuation (USD)</label>
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
                  <label className={labelClass}>Sale/Offer Price (USD)</label>
                  <div className="relative">
                    <HiOutlineCurrencyDollar className="absolute left-6 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                    <input
                      type="number"
                      value={form.sale_price}
                      onChange={(e) => updateForm('sale_price', e.target.value)}
                      className={`${inputClass} pl-14 border-green-100 focus:border-green-500`}
                      placeholder="Optional"
                    />
                  </div>
                  <p className={fieldHintClass}>Optional</p>
                </div>
                <div>
                  <label className={labelClass}>Cost Price (USD)</label>
                  <div className="relative">
                    <HiOutlineCurrencyDollar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      value={form.cost_price}
                      onChange={(e) => updateForm('cost_price', e.target.value)}
                      className={`${inputClass} pl-14`}
                      placeholder="Optional"
                    />
                  </div>
                  <p className={fieldHintClass}>Optional (Internal Cost)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className={labelClass}>Stock Quantity</label>
                  <div className="relative">
                    <HiOutlineCube className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      value={form.stock_quantity}
                      onChange={(e) => updateForm('stock_quantity', Number(e.target.value))}
                      className={`${inputClass} pl-14 bg-white`}
                      placeholder="0"
                    />
                  </div>
                  <p className={fieldHintClass}>Required when tracking</p>
                </div>
                <div>
                  <label className={labelClass}>Low Stock Alert</label>
                  <div className="relative">
                    <HiOutlineCube className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5" />
                    <input
                      type="number"
                      value={form.low_stock_threshold}
                      onChange={(e) => updateForm('low_stock_threshold', e.target.value)}
                      className={`${inputClass} pl-14 bg-white`}
                      placeholder="Optional"
                    />
                  </div>
                  <p className={fieldHintClass}>Optional</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center justify-between min-h-[72px] p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:shadow-sm transition-all group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-[#6610f2]">Track Inventory</span>
                  <input
                    type="checkbox"
                    checked={form.manage_stock}
                    onChange={(e) => updateForm('manage_stock', e.target.checked)}
                    className="w-5 h-5 rounded accent-[#6610f2]"
                  />
                </label>
                <label className="flex items-center justify-between min-h-[72px] p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:shadow-sm transition-all group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-[#6610f2]">Digital Product</span>
                  <input
                    type="checkbox"
                    checked={form.is_digital}
                    onChange={(e) => updateForm('is_digital', e.target.checked)}
                    className="w-5 h-5 rounded accent-[#6610f2]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Media Studio.
            </h3>
            <div className="mt-4">
              <MediaStudio files={files} setFiles={setFiles} />
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <HiOutlineCube className="w-6 h-6 text-slate-300" /> Physical Specs.
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { key: 'weight', label: 'Weight (kg)' },
                { key: 'length', label: 'Length (cm)' },
                { key: 'width', label: 'Width (cm)' },
                { key: 'height', label: 'Height (cm)' }
              ].map((dim) => (
                <div key={dim.key}>
                  <label className={labelClass}>{dim.label}</label>
                  <input
                    type="number"
                    value={form[dim.key]}
                    onChange={(e) => updateForm(dim.key, e.target.value)}
                    className={`${inputClass} py-4 px-4 text-left md:text-center`}
                    placeholder="0.0"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Specification Features.
            </h3>
            <p className="text-[10px] font-black text-slate-400 mb-8 leading-relaxed tracking-wider">
              SELECT ALL RELEVANT SPECIFICATIONS AND FEATURES TO DECORATE THE E-COMMERCE LISTING PAGE (E.G. 'WARRANTY INCLUDED', 'ECO-FRIENDLY').
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {allFeatures.map((feat) => {
                const isChecked = selectedFeatures.includes(feat.id);
                return (
                  <button
                    key={feat.id}
                    type="button"
                    onClick={() => toggleFeature(feat.id)}
                    className={`flex items-center justify-between p-5 rounded-2xl border text-left transition-all group ${
                      isChecked
                        ? 'bg-[#6610f2]/5 border-[#6610f2] shadow-[0_4px_20px_rgba(102,16,242,0.08)]'
                        : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <span
                      className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                        isChecked ? 'text-[#6610f2]' : 'text-slate-500 group-hover:text-[#6610f2]'
                      }`}
                    >
                      {feat.title}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isChecked ? 'border-[#6610f2] bg-[#6610f2]' : 'border-slate-300'
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
              {allFeatures.length === 0 && (
                <div className="col-span-full py-6 text-center text-[10px] font-bold uppercase tracking-widest text-slate-300 italic">
                  No features available in metadata...
                </div>
              )}
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8">Asset Narrative.</h3>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={6}
              className={`${inputClass} resize-none`}
              placeholder="Describe the unique value proposition..."
            />
            <p className={fieldHintClass}>Required</p>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-teal-500 rounded-full" /> Discoverability Tags.
            </h3>
            <p className="text-[10px] font-black text-slate-400 mb-6 leading-relaxed tracking-wider">
              ADD SEARCH KEYWORDS AND RELEVANT TAGS TO AMPLIFY DISCOVERABILITY ACROSS SEARCH SECTORS (E.G. 'NEW ARRIVAL', 'LIMITED EDITION'). PRESS ENTER OR COMMA TO CAST A TAG CHIP.
            </p>
            <div className="flex flex-wrap gap-2.5 mb-6">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-4.5 py-2.5 rounded-full shadow-sm select-none"
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 italic py-2">
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
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8">Discovery Details.</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="md:col-span-2">
                <label className={labelClass}>Demo Video URL</label>
                <input
                  type="url"
                  value={form.video}
                  onChange={(e) => updateForm('video', e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
                <p className={fieldHintClass}>Optional</p>
              </div>
              <div>
                <label className={labelClass}>Meta Title</label>
                <input
                  type="text"
                  value={form.meta_title}
                  onChange={(e) => updateForm('meta_title', e.target.value)}
                  className={inputClass}
                  placeholder="Search result title"
                />
                <p className={fieldHintClass}>Optional</p>
              </div>
              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea
                  value={form.meta_description}
                  onChange={(e) => updateForm('meta_description', e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Short search result description"
                />
                <p className={fieldHintClass}>Optional</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-10 space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Readiness Score</p>
              <span className="text-7xl font-black italic tracking-tighter">{progress}%</span>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-[#6610f2] transition-all duration-1000 shadow-[0_0_15px_#6610f2]" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineCube className="w-32 h-32" />
            </div>
          </div>

          <div className={containerClass}>
            <h4 className={labelClass}>Visibility & Promotion</h4>
            <div className="space-y-4 mt-6">
              {[
                { key: 'is_published', label: 'Public Listing' },
                { key: 'is_featured', label: 'Featured Asset' }
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-[#6610f2] transition-colors">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={form[item.key] as boolean}
                    onChange={(e) => updateForm(item.key, e.target.checked)}
                    className="w-6 h-6 rounded-lg accent-[#6610f2] cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] bg-white/60">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
              Listing Checklist
            </p>
            <div className="space-y-3">
              {[
                { label: 'Title', done: form.title.length > 5 },
                { label: 'Primary media', done: files.some(f => f.isMain) },
                { label: 'Price', done: Number(form.base_price) > 0 },
                { label: 'Category', done: form.category_id !== '' },
                { label: 'SKU', done: form.sku !== '' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">{item.label}</span>
                  <span className={item.done ? 'text-green-500' : 'text-slate-300'}>
                    {item.done ? 'Ready' : 'Missing'}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">
              Upload high-resolution assets and complete the required fields before publishing.
            </p>
          </div>
          </div>
        </div>
      </div>
      )}

      {!isLoading && (
      <ActionPill
        isSaving={isSaving}
        isEditMode={isEditMode}
        onSave={handleSave}
        label="Product"
        variant="floating"
        showOnDesktop
      />
      )}
    </div>
  );
}
