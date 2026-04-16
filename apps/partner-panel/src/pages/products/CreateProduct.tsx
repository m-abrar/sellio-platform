import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { triggerCelebration } from '../../utils/animations';
import {
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineHashtag,
  HiOutlineCloudArrowUp,
  HiOutlineChevronLeft
} from 'react-icons/hi2';

// API Services
import { getProductBySlug, createProduct, updateProduct } from '../../api/products';
import { getCategories } from '../../api/categories';

// Studio Components
import MediaStudio from '../../components/studio/MediaStudio';
import PageHeader from '../../components/layout/PageHeader';
import ActionPill from '../../utils/ActionPill';

export default function CreateProduct() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  // Design Constants (Mirroring Create Property)
  const containerClass = "bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2";
  const inputClass = "w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300";

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [files, setFiles] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: '',
    sku: '',
    category_id: '',
    brand_id: '',
    description: '',
    short_description: '',
    base_price: '',
    sale_price: '',
    stock_quantity: 0,
    manage_stock: true,
    weight: '',
    length: '',
    width: '',
    height: '',
    is_published: false,
    is_featured: false,
  });

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Categories
        const flatCategories = await getCategories();
        setCategories(flatCategories);

        // 2. Fetch Product if in Edit Mode
        if (isEditMode && slug) {
          const { data: { data: p } } = await getProductBySlug(slug);

          setProductId(p.id);

          // Handle Dimensions
          const hasDims = p.specs?.dimensions && p.specs.dimensions !== 'N/A';
          const dims = hasDims ? p.specs.dimensions.replace(' cm', '').split('x') : ['', '', ''];

          setForm({
            title: p.title || '',
            sku: p.sku || '',
            category_id: p.category?.id || '',
            brand_id: p.brand?.id || '',
            description: p.description || '',
            short_description: p.short_description || '',
            base_price: p.pricing?.base_price || '',
            sale_price: p.pricing?.sale_price || '',
            stock_quantity: p.inventory?.stock_quantity || 0,
            manage_stock: p.inventory?.manage_stock ?? true,
            weight: p.specs?.weight || '',
            length: dims[0] || '',
            width: dims[1] || '',
            height: dims[2] || '',
            is_published: true,
            is_featured: p.is_featured ?? false,
          });

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
    setForm(prev => ({ ...prev, [field]: value }));
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
  // 1. Start the loading toast manually and capture its ID
  const toastId = toast.loading('Syncing media and saving product...');

  const formData = new FormData();
  Object.keys(form).forEach(key =>
    formData.append(key, String(form[key as keyof typeof form]))
  );

  files.forEach((fileObj) => {
    if (fileObj.file) {
      if (fileObj.isMain) formData.append('main_image', fileObj.file);
      else formData.append('gallery[]', fileObj.file);
    } else if (fileObj.existing) {
      formData.append('existing_media_ids[]', String(fileObj.id));
    }
  });

  try {
    // 2. Perform the actual API call
    const response = isEditMode && productId
      ? await updateProduct(productId, formData)
      : await createProduct(formData);

    // 3. SUCCESS GATE: Only runs if API returns 2xx
    // Update the toast to success
    toast.success(`${form.title || 'Product'} saved successfully.`, { id: toastId });
    
    setIsSaving(false);
    
    // Now it is safe to celebrate
    await triggerCelebration();

    // Redirect after celebration
    setTimeout(() => navigate('/dashboard/products'), 3500);

    return response;

  } catch (err: any) {
    // 4. ERROR GATE: This block triggers on 422, 500, etc.
    setIsSaving(false);

    // Extract message
    const errorMessage = err.response?.data?.message || 'Validation failed.';

    // Update the existing toast to an error state
    toast.error(errorMessage, { id: toastId });

    // CRITICAL: We return null or throw. 
    // Because we 'return' or 'throw' here, the code ABOVE (celebration/navigate) is skipped.
    throw err; 
  }
};













  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">

      {/* 1. UNIFIED HEADER */}
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
            {/* Simple Skeleton Cards */}
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* LEFT COLUMN: 8-SPAN (CORE DATA & MEDIA) */}
        <div className="lg:col-span-8 space-y-10">

          {/* SECTION: PRIMARY IDENTITY */}

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Primary Identity.
            </h3>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className={labelClass}>Product Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className={`${inputClass} text-2xl italic tracking-tighter`}
                    placeholder="e.g. Titanium Executive Watch"
                  />
                </div>

                <div className="md:col-span-2">
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
                </div>

                <div>
                  <label className={labelClass}>Brand Identifier</label>
                  <input
                    type="text"
                    value={form.brand_id}
                    onChange={(e) => updateForm('brand_id', e.target.value)}
                    className={inputClass}
                    placeholder="Brand Reference"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* NEW SECTION: FINANCIAL & INVENTORY PROTOCOL */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full" /> Commercial & Stock.
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Pricing Block */}
              <div className="space-y-6">
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
                </div>
              </div>

              {/* Inventory Block */}
              <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
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
                </div>
                <label className="flex items-center justify-between p-4 bg-white rounded-xl cursor-pointer hover:shadow-sm transition-all group">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-[#6610f2]">Track Inventory</span>
                  <input
                    type="checkbox"
                    checked={form.manage_stock}
                    onChange={(e) => updateForm('manage_stock', e.target.checked)}
                    className="w-5 h-5 rounded accent-[#6610f2]"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* SECTION: MEDIA STUDIO (Moved from Sidebar for space) */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Media Studio.
            </h3>
            
            <div className="mt-4">
              {/* Spatie Media integration now has room to breathe */}
              <MediaStudio files={files} setFiles={setFiles} />
            </div>
          </div>

          {/* SECTION: LOGISTICS & SPECS */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <HiOutlineCube className="w-6 h-6 text-slate-300" /> Physical Specs.
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { key: 'weight', label: 'Weight (kg)' },
                { key: 'length', label: 'Length (cm)' },
                { key: 'width', label: 'Width (cm)' },
                { key: 'height', label: 'Height (cm)' }
              ].map((dim) => (
                <div key={dim.key}>
                  <label className={labelClass}>{dim.label}</label>
                  <input
                    type="text"
                    value={form[dim.key as keyof typeof form]}
                    onChange={(e) => updateForm(dim.key, e.target.value)}
                    className={`${inputClass} py-4 px-5 text-center`}
                    placeholder="0.0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: DESCRIPTION */}
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8">Asset Narrative.</h3>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={6}
              className={`${inputClass} resize-none`}
              placeholder="Describe the unique value proposition..."
            />
          </div>
        </div>

        {/* RIGHT COLUMN: 4-SPAN (HUD & CONFIG) */}
        <div className="lg:col-span-4 space-y-10">

          {/* READINESS HUD */}
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
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



          {/* 2. DOCKED ACTION PILL (Desktop Only) */}
          <div className="hidden lg:block">
            <ActionPill
              isSaving={isSaving}
              isEditMode={isEditMode}
              onSave={handleSave}
              label="Product"
              variant="docked"
            />
          </div>

          {/* STATUS CONTROL (Moved to Sidebar) */}
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
                    checked={form[item.key as keyof typeof form] as boolean}
                    onChange={(e) => updateForm(item.key, e.target.checked)}
                    className="w-6 h-6 rounded-lg accent-[#6610f2] cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
            <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">
              * Ensure all high-resolution assets are uploaded to the Media Studio for optimal storefront display.
            </p>
          </div>

        </div>
      </div>
      )}

      {/* 4. FLOATING ACTION PILL (Mobile Only) */}

      {!isLoading && (
      <ActionPill
        isSaving={isSaving}
        isEditMode={isEditMode}
        onSave={handleSave}
        label="Product"
        variant="floating"
      />
      )}
    </div>
  );

}