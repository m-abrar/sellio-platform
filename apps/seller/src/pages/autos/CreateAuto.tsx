import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { triggerCelebration } from '../../utils/animations';
import {
  HiOutlineTruck,
  HiOutlineCurrencyDollar,
  HiOutlineHashtag,
  HiOutlineChevronLeft,
  HiOutlineCalendar,
  HiOutlineMapPin,
} from 'react-icons/hi2';
import MediaStudio from '../../components/studio/MediaStudio';
import PageHeader from '../../components/layout/PageHeader';
import ActionPill from '../../utils/ActionPill';
import { createAuto, getAutoBySlug, getAutoFormMeta, updateAuto } from '../../api/autos';
import { ApiError } from '../../lib/apiError';

const containerClass = 'bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12';
const labelClass = 'text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2';
const inputClass = 'w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300';

const defaultForm = {
  title: '',
  description: '',
  category_id: '',
  brand_id: '',
  type_id: '',
  location_id: '',
  base_price: '',
  sale_price: '',
  year: '',
  make: '',
  model: '',
  vin_number: '',
  engine_type: '',
  transmission: '',
  fuel_economy: '',
  drivetrain: '',
  exterior_color: '',
  mileage_value: '',
  mileage_units: 'mi',
  condition_rating: '8',
  warranty_months: '',
  stock_quantity: '1',
  address: '',
  city: '',
  state: '',
  country: '',
  zip_code: '',
  is_published: true,
  is_featured: false,
  is_lease: false,
  is_selling: true,
};

export default function CreateAuto() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  const [formMeta, setFormMeta] = useState<any>({ categories: [], brands: [], types: [], locations: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [autoId, setAutoId] = useState<number | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [form, setForm] = useState(defaultForm);

  const updateForm = useCallback((field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const progress = useMemo(() => {
    let score = 0;
    if (form.title.length > 5) score += 15;
    if (files.some((f) => f.isMain)) score += 15;
    if (form.base_price !== '') score += 15;
    if (form.make !== '' && form.model !== '') score += 15;
    if (form.category_id !== '') score += 10;
    if (form.city !== '' && form.country !== '') score += 15;
    if (form.engine_type && form.transmission && form.drivetrain) score += 15;
    return score;
  }, [form, files]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const meta = await getAutoFormMeta();
        setFormMeta(meta);

        if (isEditMode && slug) {
          const { data: auto } = await getAutoBySlug(slug);
          setAutoId(auto.id);
          setForm({
            title: auto.title || '',
            description: auto.description || '',
            category_id: auto.category_id ? String(auto.category_id) : '',
            brand_id: auto.brand_id ? String(auto.brand_id) : '',
            type_id: auto.type_id ? String(auto.type_id) : '',
            location_id: auto.location_id ? String(auto.location_id) : '',
            base_price: auto.base_price != null ? String(auto.base_price) : '',
            sale_price: auto.sale_price != null ? String(auto.sale_price) : '',
            year: auto.year != null ? String(auto.year) : '',
            make: auto.make || '',
            model: auto.model || '',
            vin_number: auto.vin_number || '',
            engine_type: auto.engine_type || '',
            transmission: auto.transmission || '',
            fuel_economy: auto.fuel_economy || '',
            drivetrain: auto.drivetrain || '',
            exterior_color: auto.exterior_color || '',
            mileage_value: auto.mileage_value != null ? String(auto.mileage_value) : '',
            mileage_units: auto.mileage_units || 'mi',
            condition_rating: auto.condition_rating != null ? String(auto.condition_rating) : '8',
            warranty_months: auto.warranty_months != null ? String(auto.warranty_months) : '',
            stock_quantity: auto.stock_quantity != null ? String(auto.stock_quantity) : '1',
            address: auto.address || '',
            city: auto.city || '',
            state: auto.state || '',
            country: auto.country || '',
            zip_code: auto.zip_code || '',
            is_published: auto.is_published ?? true,
            is_featured: auto.is_featured ?? false,
            is_lease: auto.is_lease ?? false,
            is_selling: auto.is_selling ?? true,
          });

          const initialMedia: any[] = [];
          if (auto.featured_image) {
            initialMedia.push({
              id: auto.gallery[0]?.id,
              url: auto.featured_image,
              preview: auto.featured_image,
              isMain: true,
              existing: true,
            });
          }
          auto.gallery.forEach((item: any) => {
            if (item.url !== auto.featured_image) {
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
        console.error('Failed to initialize auto form', error);
        toast.error('Failed to load vehicle data.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [isEditMode, slug]);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Registering vehicle asset...');

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else if (value !== '') {
        formData.append(key, String(value));
      }
    });

    files.forEach((fileObj) => {
      if (fileObj.file) {
        if (fileObj.isMain) formData.append('main_image', fileObj.file);
        else formData.append('gallery[]', fileObj.file);
      } else if (fileObj.existing) {
        formData.append('existing_media_ids[]', String(fileObj.id));
      }
    });

    try {
      if (isEditMode && autoId) {
        await updateAuto(autoId, formData);
      } else {
        await createAuto(formData);
      }

      toast.success(`${form.title || 'Vehicle'} saved successfully.`, { id: toastId });
      await triggerCelebration();
      setTimeout(() => navigate('/dashboard/autos'), 1500);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to save vehicle.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader badge="Automotive Protocol" title={isEditMode ? 'Modify' : 'Register'} subtitle="Vehicle">
        <button onClick={() => navigate(-1)} className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2">
          <HiOutlineChevronLeft className="w-4 h-4" /> Back
        </button>
      </PageHeader>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Loading Vehicle Form...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Vehicle Identity.
              </h3>
              <div className="space-y-8">
                <div>
                  <label className={labelClass}>Listing Title</label>
                  <input type="text" value={form.title} onChange={(e) => updateForm('title', e.target.value)} className={`${inputClass} text-2xl italic tracking-tighter`} placeholder="e.g. 2024 Mercedes-Benz G-Class AMG" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Make</label>
                    <input type="text" value={form.make} onChange={(e) => updateForm('make', e.target.value)} className={inputClass} placeholder="Mercedes-Benz" />
                  </div>
                  <div>
                    <label className={labelClass}>Model</label>
                    <input type="text" value={form.model} onChange={(e) => updateForm('model', e.target.value)} className={inputClass} placeholder="G-Class" />
                  </div>
                  <div>
                    <label className={labelClass}>Year</label>
                    <div className="relative">
                      <HiOutlineCalendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input type="number" value={form.year} onChange={(e) => updateForm('year', e.target.value)} className={`${inputClass} pl-14`} placeholder="2024" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>VIN</label>
                    <div className="relative">
                      <HiOutlineHashtag className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input type="text" value={form.vin_number} onChange={(e) => updateForm('vin_number', e.target.value)} className={`${inputClass} pl-14 uppercase tracking-widest`} placeholder="VIN Number" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { key: 'category_id', label: 'Category', options: formMeta.categories },
                    { key: 'brand_id', label: 'Brand', options: formMeta.brands },
                    { key: 'type_id', label: 'Type', options: formMeta.types },
                    { key: 'location_id', label: 'Location Zone', options: formMeta.locations },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className={labelClass}>{field.label}</label>
                      <select value={(form as any)[field.key]} onChange={(e) => updateForm(field.key, e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                        <option value="">Select...</option>
                        {field.options.map((option: any) => (
                          <option key={option.id} value={option.id}>{option.title}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-500 rounded-full" /> Technical Specs.
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Mileage</label>
                  <input type="number" value={form.mileage_value} onChange={(e) => updateForm('mileage_value', e.target.value)} className={inputClass} placeholder="5000" />
                </div>
                <div>
                  <label className={labelClass}>Mileage Units</label>
                  <select value={form.mileage_units} onChange={(e) => updateForm('mileage_units', e.target.value)} className={inputClass}>
                    <option value="mi">Miles</option>
                    <option value="km">Kilometers</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Engine Type</label>
                  <select value={form.engine_type} onChange={(e) => updateForm('engine_type', e.target.value)} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Transmission</label>
                  <select value={form.transmission} onChange={(e) => updateForm('transmission', e.target.value)} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Drivetrain</label>
                  <select value={form.drivetrain} onChange={(e) => updateForm('drivetrain', e.target.value)} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="FWD">FWD</option>
                    <option value="RWD">RWD</option>
                    <option value="AWD">AWD</option>
                    <option value="4WD">4WD</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Exterior Color</label>
                  <input type="text" value={form.exterior_color} onChange={(e) => updateForm('exterior_color', e.target.value)} className={inputClass} placeholder="Obsidian Black" />
                </div>
                <div>
                  <label className={labelClass}>Fuel Economy</label>
                  <input type="text" value={form.fuel_economy} onChange={(e) => updateForm('fuel_economy', e.target.value)} className={inputClass} placeholder="25 mpg city / 32 mpg highway" />
                </div>
                <div>
                  <label className={labelClass}>Condition (1-10)</label>
                  <input type="number" min="1" max="10" value={form.condition_rating} onChange={(e) => updateForm('condition_rating', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <HiOutlineMapPin className="w-6 h-6 text-slate-300" /> Location.
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>Address</label>
                  <input type="text" value={form.address} onChange={(e) => updateForm('address', e.target.value)} className={inputClass} placeholder="Street address" />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" value={form.city} onChange={(e) => updateForm('city', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input type="text" value={form.state} onChange={(e) => updateForm('state', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <input type="text" value={form.country} onChange={(e) => updateForm('country', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Zip Code</label>
                  <input type="text" value={form.zip_code} onChange={(e) => updateForm('zip_code', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
                <span className="w-2 h-8 bg-green-500 rounded-full" /> Valuation.
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClass}>Base Price (USD)</label>
                  <div className="relative">
                    <HiOutlineCurrencyDollar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="number" value={form.base_price} onChange={(e) => updateForm('base_price', e.target.value)} className={`${inputClass} pl-14`} placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Sale Price</label>
                  <input type="number" value={form.sale_price} onChange={(e) => updateForm('sale_price', e.target.value)} className={inputClass} placeholder="Optional" />
                </div>
                <div>
                  <label className={labelClass}>Stock Quantity</label>
                  <input type="number" min="1" value={form.stock_quantity} onChange={(e) => updateForm('stock_quantity', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Media Studio.
              </h3>
              <MediaStudio files={files} setFiles={setFiles} />
            </div>

            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8">Vehicle Narrative.</h3>
              <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={6} className={`${inputClass} resize-none`} placeholder="Describe the condition, history, and features..." />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Asset Readiness</p>
                <span className="text-7xl font-black italic tracking-tighter">{progress}%</span>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-[#6610f2] transition-all duration-1000 shadow-[0_0_15px_#6610f2]" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <HiOutlineTruck className="w-32 h-32" />
              </div>
            </div>

            <div className="hidden lg:block">
              <ActionPill isSaving={isSaving} isEditMode={isEditMode} onSave={handleSave} label="Vehicle" variant="docked" />
            </div>

            <div className={containerClass}>
              <h4 className={labelClass}>Listing Options</h4>
              <div className="space-y-4 mt-6">
                {[
                  { key: 'is_published', label: 'Published' },
                  { key: 'is_featured', label: 'Featured' },
                  { key: 'is_selling', label: 'For Sale' },
                  { key: 'is_lease', label: 'For Lease' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-[#6610f2] transition-colors">{item.label}</span>
                    <input type="checkbox" checked={form[item.key as keyof typeof form] as boolean} onChange={(e) => updateForm(item.key, e.target.checked)} className="w-6 h-6 rounded-lg accent-[#6610f2] cursor-pointer" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <ActionPill isSaving={isSaving} isEditMode={isEditMode} onSave={handleSave} label="Vehicle" variant="floating" />
      )}
    </div>
  );
}
