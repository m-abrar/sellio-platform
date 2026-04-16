import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { triggerCelebration } from '../../utils/animations';
import PageHeader from '../../components/layout/PageHeader';
import { 
  HiOutlineHashtag, HiOutlineCurrencyDollar, HiOutlineMapPin, 
  HiOutlineChevronLeft, HiOutlineHomeModern, HiOutlineVideoCamera, 
  HiOutlineCube, HiOutlineUsers, HiOutlineSquare3Stack3D,
  HiOutlineTruck, HiOutlineShieldCheck, HiOutlineGlobeAlt,
  HiOutlineDocumentText, HiOutlineMagnifyingGlassCircle
} from 'react-icons/hi2';

// API Services
import { getPropertyBySlug, createProperty, updateProperty } from '../../api/properties';
import api from '../../api/axios'; // Assuming you have a base axios instance

// Studio Components
import MediaStudio from '../../components/studio/MediaStudio';
import ActionPill from '../../utils/ActionPill';

export default function CreateProperty() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  // Design Constants
  const containerClass = "bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2";
  const inputClass = "w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300 appearance-none";

  const [isLoading, setIsLoading] = useState(true); // Always start true to fetch taxonomies
  const [isSaving, setIsSaving] = useState(false);
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [files, setFiles] = useState<any[]>([]);

  // Taxonomy Lists
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [locations, setLocations] = useState([]);
  
  const [form, setForm] = useState({
    title: '',
    base_price: '',
    hoa: '', 
    description: '',
    category_id: '', 
    type_id: '',     
    brand_id: '',    
    location_id: '', 
    address: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    latitude: '',  
    longitude: '', 
    number_of_bedrooms: '',
    number_of_bathrooms: '',
    maximum_guests: '',
    total_units: '',
    number_of_parking_spots: '', 
    area_sq_ft: '',
    year_built: '',
    minimum_rental_days: '1',    
    video_url: '',
    virtual_tour_url: '',
    rules: '',    
    policies: '', 
    is_published: false,
    is_featured: false,
    is_rental: false, 
    is_sale: true,    
    meta_title: '',       
    meta_description: '', 
  });

  // 1. FETCH TAXONOMIES & INITIAL DATA
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Parallel fetch for speed
        const [catRes, typeRes, brandRes, locRes] = await Promise.all([
          api.get('/categories'),
          api.get('/types'),
          api.get('/brands'),
          api.get('/locations')
        ]);

        setCategories(catRes.data.data);
        setTypes(typeRes.data.data);
        setBrands(brandRes.data.data);
        setLocations(locRes.data.data);

        // If Edit Mode, fetch property
        if (isEditMode) {
          const { data: { data: p } } = await getPropertyBySlug(slug!);
          setPropertyId(p.id);
          setForm({
            title: p.title || '',
            base_price: p.pricing?.base_price || '',
            hoa: p.pricing?.hoa || '',
            category_id: p.category_id || '',
            type_id: p.type_id || '',
            brand_id: p.brand_id || '',
            location_id: p.location_id || '',
            address: p.location?.address || '',
            city: p.location?.city || '',
            state: p.location?.state || '',
            country: p.location?.country || '',
            zip_code: p.location?.zip_code || '',
            latitude: p.location?.latitude || '',
            longitude: p.location?.longitude || '',
            number_of_bedrooms: p.specs?.bedrooms || '',
            number_of_bathrooms: p.specs?.bathrooms || '',
            maximum_guests: p.specs?.max_guests || '',
            total_units: p.specs?.total_units || '1',
            number_of_parking_spots: p.specs?.parking_spots || '',
            area_sq_ft: p.specs?.area_sq_ft || '',
            year_built: p.specs?.year_built || '',
            minimum_rental_days: p.minimum_rental_days || '1',
            description: p.description || '',
            video_url: p.video || '',
            virtual_tour_url: p.virtual_tour || '',
            rules: p.rules || '',
            policies: p.policies || '',
            is_published: p.status?.is_published ?? false,
            is_featured: p.status?.is_featured ?? false,
            is_rental: p.status?.is_rental ?? false,
            is_sale: p.status?.is_sale ?? true,
            meta_title: p.meta_title || '',
            meta_description: p.meta_description || '',
          });

          const existingMedia: any[] = [];
          if (p.featured_image) {
            existingMedia.push({ id: 'feat', url: p.featured_image, preview: p.featured_image, isMain: true, existing: true });
          }
          if (p.gallery && Array.isArray(p.gallery)) {
            p.gallery.forEach((item: any) => {
              existingMedia.push({ id: item.id, url: item.url, preview: item.thumbnail || item.url, isMain: false, existing: true });
            });
          }
          setFiles(existingMedia);
        }
      } catch (err) {
        toast.error("Handshake failed: Asset list unavailable.");
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
    if (Number(form.base_price) > 0) score += 20;
    if (form.address.length > 5) score += 20;
    if (files.length > 0) score += 20;
    if (form.description.length > 20) score += 20;
    return score;
  }, [form, files]);

  // 2. PERSISTENCE
  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading(isEditMode ? 'Updating asset...' : 'Deploying property...');
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      const value = form[key as keyof typeof form];
      formData.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
    });

    files.forEach((f) => {
      if (f.file) {
        if (f.isMain) formData.append('main_image', f.file);
        else formData.append('gallery[]', f.file);
      } else if (f.existing && f.id !== 'feat') {
        formData.append('existing_media_ids[]', String(f.id));
      }
    });

    try {
      if (isEditMode && propertyId) {
        formData.append('_method', 'PUT');
        await updateProperty(propertyId, formData);
      } else {
        await createProperty(formData);
      }
      toast.success(`${form.title} synchronized.`, { id: toastId });
      await triggerCelebration();
      setTimeout(() => navigate('/dashboard/properties'), 2000);
    } catch (err: any) {
      setIsSaving(false);
      toast.error(err.response?.data?.message || 'Sync failed.', { id: toastId });
    }
  };

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader badge="Property Studio" title={isEditMode ? "Edit" : "New"} subtitle="Asset">
        <button onClick={() => navigate(-1)} className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2">
          <HiOutlineChevronLeft className="w-4 h-4" /> Back
        </button>
      </PageHeader>

      {isLoading ? (
        <div className="h-[80vh] bg-white rounded-[3rem] animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            
            {/* CORE IDENTITY & DROPDOWNS */}
            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Identity & Classification.
              </h3>
              <div className="space-y-8">
                <div>
                  <label className={labelClass}>Property Title</label>
                  <input type="text" value={form.title} onChange={(e) => updateForm('title', e.target.value)} className={`${inputClass} text-2xl italic tracking-tighter`} placeholder="Skyline Penthouse" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Dropdown */}
                  <div>
                    <label className={labelClass}>Category</label>
                    <select value={form.category_id} onChange={(e) => updateForm('category_id', e.target.value)} className={inputClass}>
                      <option value="">Select Category</option>
                      {categories.map((item: any) => <option key={item.id} value={item.id}>{item.title || item.name}</option>)}
                    </select>
                  </div>

                  {/* Type Dropdown */}
                  <div>
                    <label className={labelClass}>Type</label>
                    <select value={form.type_id} onChange={(e) => updateForm('type_id', e.target.value)} className={inputClass}>
                      <option value="">Select Type</option>
                      {types.map((item: any) => <option key={item.id} value={item.id}>{item.title || item.name}</option>)}
                    </select>
                  </div>

                  {/* Brand Dropdown */}
                  <div>
                    <label className={labelClass}>Brand</label>
                    <select value={form.brand_id} onChange={(e) => updateForm('brand_id', e.target.value)} className={inputClass}>
                      <option value="">Select Brand</option>
                      {brands.map((item: any) => <option key={item.id} value={item.id}>{item.title || item.name}</option>)}
                    </select>
                  </div>

                  {/* Location Dropdown */}
                  <div>
                    <label className={labelClass}>Location Cluster</label>
                    <select value={form.location_id} onChange={(e) => updateForm('location_id', e.target.value)} className={inputClass}>
                      <option value="">Select Area/Cluster</option>
                      {locations.map((item: any) => <option key={item.id} value={item.id}>{item.title || item.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* FINANCIALS */}
            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Financial Data.
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Base Price (USD)</label>
                  <div className="relative">
                    <HiOutlineCurrencyDollar className="absolute left-6 top-1/2 -translate-y-1/2 text-[#6610f2] w-5 h-5" />
                    <input type="number" value={form.base_price} onChange={(e) => updateForm('base_price', e.target.value)} className={`${inputClass} pl-14`} placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>HOA Fees (Monthly)</label>
                  <div className="relative">
                    <HiOutlineShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="number" value={form.hoa} onChange={(e) => updateForm('hoa', e.target.value)} className={`${inputClass} pl-14`} placeholder="0.00" />
                  </div>
                </div>
              </div>
            </div>

            {/* ARCHITECTURE & RENTAL SPECS */}
            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Asset Specifications.
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div><label className={labelClass}>Bedrooms</label><input type="number" value={form.number_of_bedrooms} onChange={(e) => updateForm('number_of_bedrooms', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Bathrooms</label><input type="number" value={form.number_of_bathrooms} onChange={(e) => updateForm('number_of_bathrooms', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Parking</label><div className="relative"><HiOutlineTruck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" /><input type="number" value={form.number_of_parking_spots} onChange={(e) => updateForm('number_of_parking_spots', e.target.value)} className={`${inputClass} pl-11 text-sm`} /></div></div>
                <div><label className={labelClass}>Min Rental</label><div className="relative"><HiOutlineDocumentText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" /><input type="number" value={form.minimum_rental_days} onChange={(e) => updateForm('minimum_rental_days', e.target.value)} className={`${inputClass} pl-11 text-sm`} placeholder="Days" /></div></div>
                <div><label className={labelClass}>Sq. Ft.</label><input type="number" value={form.area_sq_ft} onChange={(e) => updateForm('area_sq_ft', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Max Guests</label><input type="number" value={form.maximum_guests} onChange={(e) => updateForm('maximum_guests', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Units</label><input type="number" value={form.total_units} onChange={(e) => updateForm('total_units', e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Built Year</label><input type="number" value={form.year_built} onChange={(e) => updateForm('year_built', e.target.value)} className={inputClass} /></div>
              </div>
            </div>

            {/* GEOGRAPHIC DATA */}
            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Geographic Data.
              </h3>
              <div className="space-y-6">
                <div><label className={labelClass}>Street Address</label><input type="text" value={form.address} onChange={(e) => updateForm('address', e.target.value)} className={inputClass} /></div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div><label className={labelClass}>City</label><input type="text" value={form.city} onChange={(e) => updateForm('city', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>State</label><input type="text" value={form.state} onChange={(e) => updateForm('state', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Latitude</label><input type="text" value={form.latitude} onChange={(e) => updateForm('latitude', e.target.value)} className={`${inputClass} text-xs`} placeholder="0.0000" /></div>
                  <div><label className={labelClass}>Longitude</label><input type="text" value={form.longitude} onChange={(e) => updateForm('longitude', e.target.value)} className={`${inputClass} text-xs`} placeholder="0.0000" /></div>
                </div>
              </div>
            </div>

            {/* MEDIA & NARRATIVE */}
            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Visual Studio.
              </h3>
              <MediaStudio files={files} setFiles={setFiles} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                 <div><label className={labelClass}>Video URL</label><div className="relative"><HiOutlineVideoCamera className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" /><input type="url" value={form.video_url} onChange={(e) => updateForm('video_url', e.target.value)} className={`${inputClass} pl-14 text-sm`} /></div></div>
                 <div><label className={labelClass}>Virtual Tour</label><div className="relative"><HiOutlineCube className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" /><input type="url" value={form.virtual_tour_url} onChange={(e) => updateForm('virtual_tour_url', e.target.value)} className={`${inputClass} pl-14 text-sm`} /></div></div>
              </div>
            </div>

            {/* TERMS & PROTOCOL */}
            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Terms & Protocol.
              </h3>
              <div className="space-y-8">
                <div><label className={labelClass}>Property Rules</label><textarea value={form.rules} onChange={(e) => updateForm('rules', e.target.value)} rows={4} className={`${inputClass} resize-none text-sm`} placeholder="No pets..." /></div>
                <div><label className={labelClass}>Cancellation Policies</label><textarea value={form.policies} onChange={(e) => updateForm('policies', e.target.value)} rows={4} className={`${inputClass} resize-none text-sm`} placeholder="Policy details..." /></div>
              </div>
            </div>

            {/* SEO ENGINE */}
            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Search Optimization.
              </h3>
              <div className="space-y-6">
                <div><label className={labelClass}>Meta Title</label><div className="relative"><HiOutlineGlobeAlt className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" /><input type="text" value={form.meta_title} onChange={(e) => updateForm('meta_title', e.target.value)} className={`${inputClass} pl-14 text-sm`} /></div></div>
                <div><label className={labelClass}>Meta Description</label><div className="relative"><HiOutlineMagnifyingGlassCircle className="absolute left-6 top-6 text-slate-400 w-5 h-5" /><textarea value={form.meta_description} onChange={(e) => updateForm('meta_description', e.target.value)} rows={3} className={`${inputClass} pl-14 text-sm resize-none`} /></div></div>
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8">Asset Narrative.</h3>
              <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={8} className={`${inputClass} resize-none`} placeholder="Compelling story..." />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-10 space-y-6">
              {/* STATUS HUD */}
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Readiness</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-black italic tracking-tighter">{progress}%</span>
                    <span className="text-slate-500 font-bold text-xs uppercase">Complete</span>
                  </div>
                  
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-8 overflow-hidden">
                    <div 
                      className="h-full bg-[#6610f2] shadow-[0_0_20px_rgba(102,16,242,0.6)] transition-all duration-1000 ease-out" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>

                  <div className="mt-16 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Deployment Flags</p>
                    {[
                      { key: 'is_published', label: 'Published' }, 
                      { key: 'is_featured', label: 'Featured' },
                      { key: 'is_rental', label: 'For Rent' },
                      { key: 'is_sale', label: 'For Sale' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-white/10 transition-all group">
                        <span className="text-sm font-bold text-slate-400 group-hover:text-white">{item.label}</span>
                        <input 
                          type="checkbox" 
                          checked={form[item.key as keyof typeof form] as boolean} 
                          onChange={(e) => updateForm(item.key, e.target.checked)} 
                          className="w-5 h-5 rounded-lg accent-[#6610f2] cursor-pointer" 
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Background Icon Decoration */}
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] pointer-events-none">
                  <HiOutlineHomeModern className="w-64 h-64" />
                </div>
              </div>

                {/* DOCKED ACTION PILL (Desktop Only) */}
                <div className="hidden lg:block">
                  <ActionPill
                    isSaving={isSaving}
                    isEditMode={isEditMode}
                    onSave={handleSave}
                    label="Property"
                    variant="docked"
                  />
                </div>
                
            </div>
          </div>

        </div>
      )}

      {!isLoading && <ActionPill isSaving={isSaving} isEditMode={isEditMode} onSave={handleSave} label="Property" variant="floating" />}
    </div>
  );
}