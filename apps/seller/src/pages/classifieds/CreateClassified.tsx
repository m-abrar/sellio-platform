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

// Studio Components
import MediaStudio from '../../components/studio/MediaStudio';
import PageHeader from '../../components/layout/PageHeader';
import ActionPill from '../../utils/ActionPill';

export default function CreateClassified() {
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
    price: '',
    location: '',
    description: '',
    condition: 'Used - Good',
    is_published: true,
  });

  useEffect(() => {
    if (isEditMode && slug) {
      setIsLoading(true);
      // Simulate fetching data
      setTimeout(() => {
        setForm({
          title: 'Vintage Record Player',
          price: '120',
          location: 'Portland, OR',
          description: 'A beautiful vintage record player in great condition.',
          condition: 'Used - Excellent',
          is_published: true,
        });
        setFiles([
          { id: 1, url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400', preview: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400', isMain: true, existing: true }
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [slug, isEditMode]);

  const updateForm = useCallback((field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const progress = useMemo(() => {
    let score = 0;
    if (form.title.length > 5) score += 25;
    if (files.some(f => f.isMain)) score += 25;
    if (Number(form.price) > 0) score += 25;
    if (form.location.length > 3) score += 25;
    return score;
  }, [form, files]);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Publishing your listing...');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${form.title || 'Classified'} saved successfully.`, { id: toastId });
      setIsSaving(false);
      await triggerCelebration();
      setTimeout(() => navigate('/dashboard/classifieds'), 3500);
    } catch (err: any) {
      setIsSaving(false);
      toast.error('Failed to save listing.', { id: toastId });
    }
  };

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Community Exchange"
        title={isEditMode ? "Modify" : "Post"}
        subtitle="Classified"
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
            {[1, 2].map((i) => (
              <div key={i} className={`${containerClass} h-[300px] animate-pulse`} />
            ))}
          </div>
          <div className="lg:col-span-4 space-y-10">
             <div className="bg-slate-900 rounded-[3rem] h-[200px] animate-pulse" />
             <div className={`${containerClass} h-[400px] animate-pulse`} />
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Listing Details.
            </h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className={labelClass}>What are you selling?</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className={`${inputClass} text-2xl italic tracking-tighter`}
                    placeholder="e.g. Vintage Record Player"
                  />
                </div>
                <div>
                  <label className={labelClass}>Price (USD)</label>
                  <div className="relative">
                    <HiOutlineCurrencyDollar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => updateForm('price', e.target.value)}
                      className={`${inputClass} pl-14`}
                      placeholder="0.00"
                    />
                  </div>
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
                      placeholder="City, State"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Item Condition</label>
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
                </div>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Media Studio.
            </h3>
            <div className="mt-4">
              <MediaStudio files={files} setFiles={setFiles} />
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8">Item Narrative.</h3>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={6}
              className={`${inputClass} resize-none`}
              placeholder="Tell buyers more about the item..."
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Listing Readiness</p>
              <span className="text-7xl font-black italic tracking-tighter">{progress}%</span>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-[#6610f2] transition-all duration-1000 shadow-[0_0_15px_#6610f2]" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineTag className="w-32 h-32" />
            </div>
          </div>

          <div className="hidden lg:block">
            <ActionPill
              isSaving={isSaving}
              isEditMode={isEditMode}
              onSave={handleSave}
              label="Listing"
              variant="docked"
            />
          </div>

          <div className={containerClass}>
            <h4 className={labelClass}>Visibility</h4>
            <div className="space-y-4 mt-6">
              <label className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group">
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
      </div>
      )}

      {!isLoading && (
      <ActionPill
        isSaving={isSaving}
        isEditMode={isEditMode}
        onSave={handleSave}
        label="Listing"
        variant="floating"
      />
      )}
    </div>
  );
}
