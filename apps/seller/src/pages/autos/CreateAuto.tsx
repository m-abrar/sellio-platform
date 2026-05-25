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
  HiOutlineMapPin
} from 'react-icons/hi2';

// Studio Components
import MediaStudio from '../../components/studio/MediaStudio';
import PageHeader from '../../components/layout/PageHeader';
import ActionPill from '../../utils/ActionPill';

export default function CreateAuto() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  const containerClass = "bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2";
  const inputClass = "w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300";

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [files, setFiles] = useState<any[]>([]);

  const [form, setForm] = useState<any>({
    title: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    fuel_type: '',
    transmission: '',
    vin: '',
    price: '',
    location: '',
    description: '',
    is_published: true,
  });

  const updateForm = useCallback((field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const progress = useMemo(() => {
    let score = 0;
    if (form.title.length > 5) score += 20;
    if (files.length > 0) score += 20;
    if (form.price !== '') score += 20;
    if (form.make !== '' && form.model !== '') score += 20;
    if (form.vin !== '') score += 20;
    return score;
  }, [form, files]);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Registering vehicle asset...');
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${form.title || 'Vehicle'} saved successfully.`, { id: toastId });
      setIsSaving(false);
      await triggerCelebration();
      setTimeout(() => navigate('/dashboard/autos'), 2000);
    } catch (err) {
      setIsSaving(false);
      toast.error("Failed to save vehicle.", { id: toastId });
    }
  };

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Automotive Protocol"
        title={isEditMode ? "Modify" : "Register"}
        subtitle="Vehicle"
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
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Vehicle Identity.
            </h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className={labelClass}>Listing Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className={`${inputClass} text-2xl italic tracking-tighter`}
                    placeholder="e.g. 2024 Mercedes-Benz G-Class AMG"
                  />
                </div>
                <div>
                  <label className={labelClass}>Make</label>
                  <input
                    type="text"
                    value={form.make}
                    onChange={(e) => updateForm('make', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Mercedes-Benz"
                  />
                </div>
                <div>
                  <label className={labelClass}>Model</label>
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) => updateForm('model', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. G-Class"
                  />
                </div>
                <div>
                  <label className={labelClass}>Year</label>
                  <div className="relative">
                    <HiOutlineCalendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      value={form.year}
                      onChange={(e) => updateForm('year', e.target.value)}
                      className={`${inputClass} pl-14`}
                      placeholder="2024"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>VIN (Vehicle ID)</label>
                  <div className="relative">
                    <HiOutlineHashtag className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={form.vin}
                      onChange={(e) => updateForm('vin', e.target.value)}
                      className={`${inputClass} pl-14 uppercase tracking-widest`}
                      placeholder="VIN Number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-500 rounded-full" /> Technical Specs.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Mileage (km/mi)</label>
                <input
                  type="text"
                  value={form.mileage}
                  onChange={(e) => updateForm('mileage', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 5,000"
                />
              </div>
              <div>
                <label className={labelClass}>Fuel Type</label>
                <select
                  value={form.fuel_type}
                  onChange={(e) => updateForm('fuel_type', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select Fuel...</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Transmission</label>
                <select
                  value={form.transmission}
                  onChange={(e) => updateForm('transmission', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select Transmission...</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <div className="relative">
                  <HiOutlineMapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateForm('location', e.target.value)}
                    className={`${inputClass} pl-14`}
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full" /> Valuation.
            </h3>
            <div>
              <label className={labelClass}>Asking Price (USD)</label>
              <div className="relative">
                <HiOutlineCurrencyDollar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => updateForm('price', e.target.value)}
                  className={`${inputClass} pl-14 text-3xl`}
                  placeholder="0.00"
                />
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
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={6}
              className={`${inputClass} resize-none`}
              placeholder="Describe the condition, history, and features..."
            />
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
            <ActionPill
              isSaving={isSaving}
              isEditMode={isEditMode}
              onSave={handleSave}
              label="Vehicle"
              variant="docked"
            />
          </div>

          <div className={containerClass}>
            <h4 className={labelClass}>Visibility</h4>
            <label className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group mt-6">
              <span className="text-sm font-bold text-slate-700 group-hover:text-[#6610f2] transition-colors">Public Listing</span>
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
        label="Vehicle"
        variant="floating"
      />
    </div>
  );
}
