import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { triggerCelebration } from '../../utils/animations';
import {
  HiOutlineWrenchScrewdriver,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineChevronLeft,
  HiOutlineShieldCheck,
  HiOutlineLink,
  HiOutlineMapPin,
} from 'react-icons/hi2';
import MediaStudio from '../../components/studio/MediaStudio';
import PageHeader from '../../components/layout/PageHeader';
import ActionPill from '../../utils/ActionPill';
import { createService, getServiceBySlug, getServiceFormMeta, updateService } from '../../api/services';
import { ApiError } from '../../lib/apiError';

const containerClass = 'bg-white border border-slate-100 rounded-[2rem] shadow-[0_18px_44px_rgba(0,0,0,0.035)] p-6 md:p-10';
const labelClass = 'text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2';
const inputClass = 'w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300';
const fieldHintClass = 'mt-2 ml-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300';

const defaultForm = {
  title: '',
  category_id: '',
  type_id: '',
  location_id: '',
  rate_type: 'fixed',
  base_price: '',
  sale_price: '',
  operating_hours: '',
  operating_days_label: '',
  licenses_certs: '',
  expertise_level: '3',
  availability_schedule: '1',
  service_radius: '',
  min_contract_months: '',
  max_client_slots: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zip_code: '',
  description: '',
  is_published: true,
  is_featured: false,
  is_subscription: false,
  is_project_based: true,
};

export default function CreateService() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  const [formMeta, setFormMeta] = useState<any>({ categories: [], types: [], locations: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [serviceId, setServiceId] = useState<number | null>(null);
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
    if (form.category_id !== '' && form.type_id !== '') score += 15;
    if (form.description.length > 15) score += 20;
    if (form.operating_hours !== '') score += 10;
    if (form.operating_days_label !== '') score += 10;
    return score;
  }, [form, files]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const meta = await getServiceFormMeta();
        setFormMeta(meta);

        if (isEditMode && slug) {
          const { data: service } = await getServiceBySlug(slug);
          setServiceId(service.id);
          setForm({
            title: service.title || '',
            category_id: service.category_id ? String(service.category_id) : '',
            type_id: service.type_id ? String(service.type_id) : '',
            location_id: service.location_id ? String(service.location_id) : '',
            rate_type: service.rate_type || 'fixed',
            base_price: service.base_price != null ? String(service.base_price) : '',
            sale_price: service.sale_price != null ? String(service.sale_price) : '',
            operating_hours: service.operating_hours || '',
            operating_days_label: service.operating_days_label || '',
            licenses_certs: service.licenses_certs || '',
            expertise_level: service.expertise_level != null ? String(service.expertise_level) : '3',
            availability_schedule: service.availability_schedule != null ? String(service.availability_schedule) : '1',
            service_radius: service.service_radius != null ? String(service.service_radius) : '',
            min_contract_months: service.min_contract_months != null ? String(service.min_contract_months) : '',
            max_client_slots: service.max_client_slots != null ? String(service.max_client_slots) : '',
            address: service.address || '',
            city: service.city || '',
            state: service.state || '',
            country: service.country || '',
            zip_code: service.zip_code || '',
            description: service.description || '',
            is_published: service.is_published ?? true,
            is_featured: service.is_featured ?? false,
            is_subscription: service.is_subscription ?? false,
            is_project_based: service.is_project_based ?? true,
          });

          const initialMedia: any[] = [];
          if (service.featured_image) {
            initialMedia.push({
              id: service.main_photo_id,
              url: service.featured_image,
              preview: service.featured_image,
              isMain: true,
              existing: true,
            });
          }
          (service.gallery ?? []).forEach((item: any) => {
            if (item.url !== service.featured_image) {
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
        console.error('Failed to initialize service form', error);
        toast.error('Failed to load service data.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [isEditMode, slug]);

  const buildFormData = () => {
    const formData = new FormData();
    const isProjectBased = form.rate_type === 'fixed';

    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category_id', form.category_id);
    formData.append('type_id', form.type_id);
    formData.append('location_id', form.location_id);
    formData.append('base_price', form.base_price || '0');
    formData.append('sale_price', form.sale_price);
    formData.append('operating_hours', form.operating_hours);
    formData.append('operating_days_label', form.operating_days_label);
    formData.append('is_project_based', isProjectBased ? '1' : '0');
    formData.append('is_subscription', form.is_subscription ? '1' : '0');
    formData.append('is_published', form.is_published ? '1' : '0');
    formData.append('is_featured', form.is_featured ? '1' : '0');
    formData.append('expertise_level', form.expertise_level || '3');
    formData.append('availability_schedule', form.availability_schedule || '1');
    formData.append('service_radius', form.service_radius);
    formData.append('min_contract_months', form.min_contract_months);
    formData.append('max_client_slots', form.max_client_slots);
    formData.append('licenses_certs', form.licenses_certs);
    formData.append('address', form.address);
    formData.append('city', form.city || 'Remote');
    formData.append('state', form.state);
    formData.append('country', form.country || 'Global');
    formData.append('zip_code', form.zip_code);

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
    if (!form.title || !form.description || !form.category_id) {
      toast.error('Please complete the required service fields.');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Registering service offering...');

    try {
      const formData = buildFormData();

      if (isEditMode && serviceId) {
        await updateService(serviceId, formData);
      } else {
        await createService(formData);
      }

      toast.success(`${form.title || 'Service'} saved successfully.`, { id: toastId });
      await triggerCelebration();
      navigate('/dashboard/services');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to register service.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 animate-pulse">Loading Service Studio...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Service Protocol"
        title={isEditMode ? 'Modify' : 'Register'}
        subtitle="Service"
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
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Service Identity.
            </h3>
            <div className="space-y-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>Service Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className={`${inputClass} text-2xl italic tracking-tighter`}
                    placeholder="e.g. Professional Architectural Photography"
                  />
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>Service Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => updateForm('category_id', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select category</option>
                    {formMeta.categories.map((category: any) => (
                      <option key={category.id} value={category.id}>{category.title}</option>
                    ))}
                  </select>
                  <p className={fieldHintClass}>Required</p>
                </div>
                <div>
                  <label className={labelClass}>Service Type</label>
                  <select
                    value={form.type_id}
                    onChange={(e) => updateForm('type_id', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select type</option>
                    {formMeta.types.map((type: any) => (
                      <option key={type.id} value={type.id}>{type.title}</option>
                    ))}
                  </select>
                  <p className={fieldHintClass}>Optional</p>
                </div>
                <div>
                  <label className={labelClass}>Portfolio / External Link</label>
                  <div className="relative">
                    <HiOutlineLink className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="url"
                      value={form.licenses_certs}
                      onChange={(e) => updateForm('licenses_certs', e.target.value)}
                      className={`${inputClass} pl-14`}
                      placeholder="https://..."
                    />
                  </div>
                  <p className={fieldHintClass}>Optional</p>
                </div>
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
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-amber-500 rounded-full" /> Rates & Availability.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Rate Type</label>
                <div className="flex gap-4">
                  {['fixed', 'hourly'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateForm('rate_type', type)}
                      className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                        form.rate_type === type 
                        ? 'bg-[#6610f2] text-white border-[#6610f2]' 
                        : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-200'
                      }`}
                    >
                      {type} Price
                    </button>
                  ))}
                </div>
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
                <label className={labelClass}>Deposit / Sale Price</label>
                <input type="number" value={form.sale_price} onChange={(e) => updateForm('sale_price', e.target.value)} className={inputClass} placeholder="Optional" />
                <p className={fieldHintClass}>Optional</p>
              </div>
              <div>
                <label className={labelClass}>Operating Hours</label>
                <div className="relative">
                  <HiOutlineClock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.operating_hours}
                    onChange={(e) => updateForm('operating_hours', e.target.value)}
                    className={`${inputClass} pl-14`}
                    placeholder="09:00 AM - 06:00 PM"
                  />
                </div>
                <p className={fieldHintClass}>Optional</p>
              </div>
              <div>
                <label className={labelClass}>Operating Days</label>
                <div className="relative">
                  <HiOutlineShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.operating_days_label}
                    onChange={(e) => updateForm('operating_days_label', e.target.value)}
                    className={`${inputClass} pl-14`}
                    placeholder="Monday - Friday"
                  />
                </div>
                <p className={fieldHintClass}>Optional</p>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-500 rounded-full" /> Operations.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className={labelClass}>Expertise</label>
                <input type="number" min="1" max="5" value={form.expertise_level} onChange={(e) => updateForm('expertise_level', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Availability</label>
                <input type="number" min="1" max="5" value={form.availability_schedule} onChange={(e) => updateForm('availability_schedule', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Radius</label>
                <input type="number" value={form.service_radius} onChange={(e) => updateForm('service_radius', e.target.value)} className={inputClass} placeholder="km" />
              </div>
              <div>
                <label className={labelClass}>Client Slots</label>
                <input type="number" value={form.max_client_slots} onChange={(e) => updateForm('max_client_slots', e.target.value)} className={inputClass} placeholder="Optional" />
              </div>
              <div>
                <label className={labelClass}>Min Contract</label>
                <input type="number" value={form.min_contract_months} onChange={(e) => updateForm('min_contract_months', e.target.value)} className={inputClass} placeholder="Months" />
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <HiOutlineMapPin className="w-6 h-6 text-slate-300" /> Location.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Address</label>
                <input type="text" value={form.address} onChange={(e) => updateForm('address', e.target.value)} className={inputClass} placeholder="Street address" />
                <p className={fieldHintClass}>Optional</p>
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input type="text" value={form.city} onChange={(e) => updateForm('city', e.target.value)} className={inputClass} placeholder="Remote" />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input type="text" value={form.country} onChange={(e) => updateForm('country', e.target.value)} className={inputClass} placeholder="Global" />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input type="text" value={form.state} onChange={(e) => updateForm('state', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Zip Code</label>
                <input type="text" value={form.zip_code} onChange={(e) => updateForm('zip_code', e.target.value)} className={inputClass} />
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
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight italic mb-8">Service Narrative.</h3>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={8}
              className={`${inputClass} resize-none`}
              placeholder="Describe what's included in the service, your expertise, and the value you provide..."
            />
            <p className={fieldHintClass}>Required</p>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-10 space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Service Readiness</p>
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
              <HiOutlineWrenchScrewdriver className="w-32 h-32" />
            </div>
          </div>

          <div className={containerClass}>
            <h4 className={labelClass}>Billing Options</h4>
            <div className="space-y-4 mt-6">
              {[
                { key: 'is_subscription', label: 'Subscription' },
                { key: 'is_project_based', label: 'Project Based' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-[#6610f2] transition-colors">{item.label}</span>
                  <input type="checkbox" checked={form[item.key as keyof typeof form] as boolean} onChange={(e) => updateForm(item.key, e.target.checked)} className="w-6 h-6 rounded-lg accent-[#6610f2] cursor-pointer" />
                </label>
              ))}
            </div>
          </div>

          <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] bg-white/60">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Service Checklist</p>
            <div className="space-y-3">
              {[
                { label: 'Title', done: form.title.length > 5 },
                { label: 'Taxonomy', done: Boolean(form.category_id) },
                { label: 'Pricing', done: Boolean(form.base_price) },
                { label: 'Media', done: files.some((f) => f.isMain) },
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
        label="Service"
        variant="floating"
        showOnDesktop
      />
    </div>
  );
}
