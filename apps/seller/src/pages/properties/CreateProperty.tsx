import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageHeader from '../../components/layout/PageHeader';
import MediaStudio from '../../components/studio/MediaStudio';
import ActionPill from '../../utils/ActionPill';
import { HiOutlineChevronLeft, HiOutlineMapPin, HiOutlineCurrencyDollar } from 'react-icons/hi2';

export default function CreateProperty() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    is_active: true
  });

  const containerClass = "bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block ml-2";
  const inputClass = "w-full bg-slate-50 border-2 border-transparent focus:border-[#6610f2] focus:bg-white rounded-[1.5rem] px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300";

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Syncing property data...');
    
    setTimeout(() => {
      toast.success('Property registered successfully.', { id: toastId });
      setIsSaving(false);
      navigate('/dashboard/properties');
    }, 2000);
  };

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Asset Protocol"
        title={isEditMode ? "Modify" : "Register"}
        subtitle="Property"
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
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Property Identity.
            </h3>
            <div className="space-y-8">
              <div>
                <label className={labelClass}>Property Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={`${inputClass} text-2xl italic tracking-tighter`}
                  placeholder="e.g. Skyline Luxury Penthouse"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Location / Address</label>
                  <div className="relative">
                    <HiOutlineMapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className={`${inputClass} pl-14`}
                      placeholder="City, State"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Asking Price (USD)</label>
                  <div className="relative">
                    <HiOutlineCurrencyDollar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className={`${inputClass} pl-14`}
                      placeholder="0.00"
                    />
                  </div>
                </div>
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
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8">Property Narrative.</h3>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={6}
              className={`${inputClass} resize-none`}
              placeholder="Describe the architectural highlights and amenities..."
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Asset Status</p>
              <span className="text-4xl font-black italic tracking-tighter">{form.is_active ? 'LIVE' : 'DRAFT'}</span>
              <div className="flex items-center gap-4 mt-8">
                <button 
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                  className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${form.is_active ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                  {form.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>

          <ActionPill
            isSaving={isSaving}
            isEditMode={isEditMode}
            onSave={handleSave}
            label="Property"
            variant="docked"
          />
        </div>
      </div>

      <ActionPill
        isSaving={isSaving}
        isEditMode={isEditMode}
        onSave={handleSave}
        label="Property"
        variant="floating"
      />
    </div>
  );
}
