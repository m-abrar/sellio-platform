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
  HiOutlineLink
} from 'react-icons/hi2';
import MediaStudio from '../../components/studio/MediaStudio';
import PageHeader from '../../components/layout/PageHeader';
import ActionPill from '../../utils/ActionPill';
import { createService, getServiceBySlug, getServiceFormMeta, updateService } from '../../api/services';
import { ApiError } from '../../lib/apiError';

const containerClass = 'bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12';
const labelClass = 'text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2';
const inputClass = 'w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300';

const defaultForm = {
  title: '',
  category_id: '',
  rate_type: 'fixed',
  price: '',
  duration: '',
  availability: '',
  portfolio_url: '',
  description: '',
  is_published: true,
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
    if (form.price !== '') score += 15;
    if (form.category_id !== '') score += 15;
    if (form.description.length > 15) score += 20;
    if (form.duration !== '') score += 10;
    if (form.availability !== '') score += 10;
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
            rate_type: service.rate_type || 'fixed',
            price: service.base_price != null ? String(service.base_price) : '',
            duration: service.operating_hours || '',
            availability: service.operating_days_label || '',
            portfolio_url: service.licenses_certs || '',
            description: service.description || '',
            is_published: service.is_published ?? true,
          });

          const initialMedia: any[] = [];
          if (service.featured_image) {
            initialMedia.push({
              id: service.gallery[0]?.id,
              url: service.featured_image,
              preview: service.featured_image,
              isMain: true,
              existing: true,
            });
          }
          service.gallery.forEach((item: any) => {
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
    formData.append('base_price', form.price || '0');
    formData.append('operating_hours', form.duration);
    formData.append('operating_days_label', form.availability);
    formData.append('is_project_based', isProjectBased ? '1' : '0');
    formData.append('is_subscription', '0');
    formData.append('is_published', form.is_published ? '1' : '0');
    formData.append('expertise_level', '3');
    formData.append('availability_schedule', '1');
    formData.append('city', 'Remote');
    formData.append('country', 'Global');

    if (form.portfolio_url) {
      formData.append('licenses_certs', form.portfolio_url);
    }

    files.forEach((fileObj) => {
      if (fileObj.file) {
        if (fileObj.isMain) formData.append('main_image', fileObj.file);
        else formData.append('gallery[]', fileObj.file);
      } else if (fileObj.existing) {
        formData.append('existing_media_ids[]', String(fileObj.id));
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
      setTimeout(() => navigate('/dashboard/services'), 1500);
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Service Identity.
            </h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className={labelClass}>Service Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className={`${inputClass} text-2xl italic tracking-tighter`}
                    placeholder="e.g. Professional Architectural Photography"
                  />
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
                </div>
                <div>
                  <label className={labelClass}>Portfolio / External Link</label>
                  <div className="relative">
                    <HiOutlineLink className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="url"
                      value={form.portfolio_url}
                      onChange={(e) => updateForm('portfolio_url', e.target.value)}
                      className={`${inputClass} pl-14`}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-amber-500 rounded-full" /> Rates & Availability.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <label className={labelClass}>Price (USD)</label>
                <div className="relative">
                  <HiOutlineCurrencyDollar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => updateForm('price', e.target.value)}
                    className={`${inputClass} pl-14`}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Typical Duration</label>
                <div className="relative">
                  <HiOutlineClock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => updateForm('duration', e.target.value)}
                    className={`${inputClass} pl-14`}
                    placeholder="e.g. 2-4 Hours"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Availability</label>
                <div className="relative">
                  <HiOutlineShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.availability}
                    onChange={(e) => updateForm('availability', e.target.value)}
                    className={`${inputClass} pl-14`}
                    placeholder="e.g. Mon-Fri, 9am-5pm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Media Studio.
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">Upload samples of your work or promotional material.</p>
            <MediaStudio files={files} setFiles={setFiles} />
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8">Service Narrative.</h3>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={8}
              className={`${inputClass} resize-none`}
              placeholder="Describe what's included in the service, your expertise, and the value you provide..."
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Service Readiness</p>
              <span className="text-7xl font-black italic tracking-tighter">{progress}%</span>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-[#6610f2] transition-all duration-1000 shadow-[0_0_15px_#6610f2]" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineWrenchScrewdriver className="w-32 h-32" />
            </div>
          </div>

          <div className="hidden lg:block">
            <ActionPill
              isSaving={isSaving}
              isEditMode={isEditMode}
              onSave={handleSave}
              label="Service"
              variant="docked"
            />
          </div>

          <div className={containerClass}>
            <h4 className={labelClass}>Visibility</h4>
            <label className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group mt-6">
              <span className="text-sm font-bold text-slate-700 group-hover:text-[#6610f2] transition-colors">Public Offering</span>
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => updateForm('is_published', e.target.checked)}
                className="w-6 h-6 rounded-lg accent-[#6610f2] cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      <ActionPill
        isSaving={isSaving}
        isEditMode={isEditMode}
        onSave={handleSave}
        label="Service"
        variant="floating"
      />
    </div>
  );
}
