import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { triggerCelebration } from '../../utils/animations';
import {
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineMapPin,
  HiOutlineChevronLeft,
  HiOutlineAcademicCap,
  HiOutlineUserCircle
} from 'react-icons/hi2';

// Studio Components
import MediaStudio from '../../components/studio/MediaStudio';
import PageHeader from '../../components/layout/PageHeader';
import ActionPill from '../../utils/ActionPill';

export default function CreateJob() {
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
    company: '',
    job_type: '',
    salary_range: '',
    location: '',
    experience_level: '',
    skills: '',
    description: '',
    is_published: true,
  });

  const updateForm = useCallback((field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  }, []);

  const progress = useMemo(() => {
    let score = 0;
    if (form.title.length > 5) score += 20;
    if (form.company !== '') score += 20;
    if (form.salary_range !== '') score += 20;
    if (form.location !== '') score += 20;
    if (form.description.length > 20) score += 20;
    return score;
  }, [form]);

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Posting job listing...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`${form.title || 'Job'} posted successfully.`, { id: toastId });
      setIsSaving(false);
      await triggerCelebration();
      setTimeout(() => navigate('/dashboard/joblistings'), 2000);
    } catch (err) {
      setIsSaving(false);
      toast.error("Failed to post job.", { id: toastId });
    }
  };

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Human Capital Protocol"
        title={isEditMode ? "Modify" : "Post"}
        subtitle="Job"
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
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Role Identity.
            </h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className={labelClass}>Job Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className={`${inputClass} text-2xl italic tracking-tighter`}
                    placeholder="e.g. Senior Product Designer"
                  />
                </div>
                <div>
                  <label className={labelClass}>Company Name</label>
                  <div className="relative">
                    <HiOutlineUserCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => updateForm('company', e.target.value)}
                      className={`${inputClass} pl-14`}
                      placeholder="e.g. Sellio Studio"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Job Type</label>
                  <select
                    value={form.job_type}
                    onChange={(e) => updateForm('job_type', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Type...</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-emerald-500 rounded-full" /> Qualifications & Perks.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Experience Level</label>
                <div className="relative">
                  <HiOutlineAcademicCap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <select
                    value={form.experience_level}
                    onChange={(e) => updateForm('experience_level', e.target.value)}
                    className={`${inputClass} pl-14`}
                  >
                    <option value="">Select Level...</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead / Manager</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Location (City or Remote)</label>
                <div className="relative">
                  <HiOutlineMapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => updateForm('location', e.target.value)}
                    className={`${inputClass} pl-14`}
                    placeholder="e.g. Remote or San Francisco, CA"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => updateForm('skills', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. React, TypeScript, Figma, Tailwind"
                />
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-green-500 rounded-full" /> Compensation.
            </h3>
            <div>
              <label className={labelClass}>Salary Range / Compensation (USD)</label>
              <div className="relative">
                <HiOutlineCurrencyDollar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={form.salary_range}
                  onChange={(e) => updateForm('salary_range', e.target.value)}
                  className={`${inputClass} pl-14 text-3xl`}
                  placeholder="e.g. $120k - $160k"
                />
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Media Studio.
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">Upload company logo or office culture photos.</p>
            <MediaStudio files={files} setFiles={setFiles} />
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8">Role Description.</h3>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              rows={10}
              className={`${inputClass} resize-none`}
              placeholder="Detail the responsibilities, requirements, and company culture..."
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
              <HiOutlineBriefcase className="w-32 h-32" />
            </div>
          </div>

          <div className="hidden lg:block">
            <ActionPill
              isSaving={isSaving}
              isEditMode={isEditMode}
              onSave={handleSave}
              label="Job"
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
        label="Job"
        variant="floating"
      />
    </div>
  );
}
