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
import MediaStudio from '../../components/studio/MediaStudio';
import PageHeader from '../../components/layout/PageHeader';
import ActionPill from '../../utils/ActionPill';
import { createJob, getJobBySlug, getJobFormMeta, updateJob } from '../../api/jobs';
import { getWelcomeData } from '../../api/dashboard';
import { ApiError } from '../../lib/apiError';
import { mapExperienceToFormValue, mapJobTypeFlags, parseSalaryRange, resolveWorkplaceType } from '../../lib/jobAdapter';

const containerClass = 'bg-white border border-slate-100 rounded-container shadow-elite p-8 md:p-12';
const labelClass = 'text-label font-black text-slate-400 uppercase tracking-caps mb-3 block ml-2';
const inputClass = 'w-full bg-slate-50 border-2 border-transparent focus:border-brand focus:bg-white rounded-card-sm px-6 py-5 text-slate-900 font-bold transition-all outline-none placeholder:text-slate-300';

const defaultForm = {
  title: '',
  company: '',
  brand_id: '',
  category_id: '',
  job_type: '',
  salary_range: '',
  location: '',
  address: '',
  city: '',
  state: '',
  country: '',
  zip_code: '',
  latitude: '',
  longitude: '',
  experience_level: '',
  skills: '',
  description: '',
  meta_description: '',
  is_published: true,
};

export default function CreateJob() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(slug);

  const [formMeta, setFormMeta] = useState<any>({ categories: [], types: [], locations: [], brands: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [jobId, setJobId] = useState<number | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [limits, setLimits] = useState<any>(null);

  const updateForm = useCallback((field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const progress = useMemo(() => {
    let score = 0;
    if (form.title.length > 5) score += 15;
    if (form.company !== '') score += 10;
    if (form.category_id !== '') score += 15;
    if (form.salary_range !== '') score += 15;
    if (form.location !== '') score += 15;
    if (form.job_type !== '') score += 10;
    if (form.experience_level !== '') score += 10;
    if (form.description.length > 20) score += 10;
    return score;
  }, [form]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const [meta, dashboardResponse] = await Promise.all([
          getJobFormMeta(),
          !isEditMode ? getWelcomeData().catch(() => null) : Promise.resolve(null)
        ]);
        setFormMeta(meta);
        if (dashboardResponse) {
          setLimits(dashboardResponse.data.subscriptionLimits);
        }

        if (isEditMode && slug) {
          const { data: job } = await getJobBySlug(slug);
          setJobId(job.id);
          setForm({
            title: job.title || '',
            company: job.company || '',
            brand_id: job.brand_id ? String(job.brand_id) : '',
            category_id: job.category_id ? String(job.category_id) : '',
            job_type: job.job_type || '',
            salary_range:
              job.salary_min != null && job.salary_max != null
                ? `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}`
                : '',
            location: job.location || '',
            address: job.address || '',
            city: job.city || '',
            state: job.state || '',
            country: job.country || '',
            zip_code: job.zip_code || '',
            latitude: job.latitude != null ? String(job.latitude) : '',
            longitude: job.longitude != null ? String(job.longitude) : '',
            experience_level: mapExperienceToFormValue(
              (job.employment?.experience_level ?? job.experience_level) as string | number | null | undefined
            ),
            skills: job.skills || '',
            description: job.description || '',
            meta_description: job.meta_description || '',
            is_published: job.is_published ?? true,
          });

          if (job.tags) {
            setTags(job.tags);
          }

          const initialMedia: any[] = [];
          if (job.featured_image) {
            initialMedia.push({
              id: job.gallery[0]?.id,
              url: job.featured_image,
              preview: job.featured_image,
              isMain: true,
              existing: true,
            });
          }
          job.gallery.forEach((item: any) => {
            if (item.url !== job.featured_image) {
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
        console.error('Failed to initialize job form', error);
        toast.error('Failed to load job data.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [isEditMode, slug]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags((prev) => [...prev, val]);
      }
      setTagInput('');
    }
  };

  const buildFormData = () => {
    const formData = new FormData();
    const { min, max } = parseSalaryRange(form.salary_range);
    const typeFlags = mapJobTypeFlags(form.job_type);
    const workplaceType = resolveWorkplaceType(form.location || form.city);
    const locationParts = (form.location || '').split(',').map((part: string) => part.trim());
    const city = form.city || locationParts[0] || 'Remote';
    const country = form.country || (locationParts.length > 1 ? locationParts[locationParts.length - 1] : 'Global');

    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category_id', form.category_id);
    formData.append('salary_min', String(min));
    formData.append('salary_max', String(max));
    formData.append('salary_frequency', 'yearly');
    formData.append('experience_level', form.experience_level || 'mid');
    formData.append('workplace_type', String(workplaceType));
    formData.append('city', city);
    formData.append('country', country);

    if (form.brand_id) formData.append('brand_id', form.brand_id);
    if (form.address) formData.append('address', form.address);
    if (form.state) formData.append('state', form.state);
    if (form.zip_code) formData.append('zip_code', form.zip_code);
    if (form.latitude) formData.append('latitude', form.latitude);
    if (form.longitude) formData.append('longitude', form.longitude);
    if (form.meta_description) formData.append('meta_description', form.meta_description);

    formData.append('is_published', form.is_published ? '1' : '0');
    formData.append('is_full_time', typeFlags.is_full_time ? '1' : '0');
    formData.append('is_contract', typeFlags.is_contract ? '1' : '0');

    if (form.company) formData.append('meta_title', form.company);
    if (form.skills) formData.append('required_education', form.skills);

    files.forEach((fileObj) => {
      if (fileObj.file) {
        if (fileObj.isMain) formData.append('main_image', fileObj.file);
        else formData.append('gallery[]', fileObj.file);
      } else if (fileObj.existing) {
        if (fileObj.id == null) return;
        formData.append('existing_media_ids[]', String(fileObj.id));
      }
    });

    tags.forEach((tag) => formData.append('tags[]', tag));

    return formData;
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.category_id || !form.job_type) {
      toast.error('Please complete the required job fields.');
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Posting job listing...');

    try {
      const formData = buildFormData();

      if (isEditMode && jobId) {
        await updateJob(jobId, formData);
      } else {
        await createJob(formData);
      }

      toast.success(`${form.title || 'Job'} saved successfully.`, { id: toastId });
      await triggerCelebration();
      navigate('/dashboard/joblistings');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to post job.';
      toast.error(message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-label font-black uppercase tracking-caps-xl text-slate-300 animate-pulse">Loading...</span>
      </div>
    );
  }

  if (!isLoading && !isEditMode && limits?.is_limit_exceeded) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <PageHeader badge="Limit Reached" title="Post" subtitle="Job" />
        <div className="bg-slate-900 rounded-floating p-12 text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="relative z-10 max-w-md space-y-8">
            <div className="w-20 h-20 rounded-3xl bg-brand/20 border border-brand/30 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <span className="text-4xl">🛡️</span>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black italic tracking-tight">Active Limit Reached!</h3>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                You have reached your subscription active listing limit ({limits.current_listings_count} / {limits.max_listings} listings). 
                Please upgrade your plan to post more job listings.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => navigate('/dashboard/memberships')}
              className="bg-brand hover:bg-brand-hover px-10 py-5 rounded-card font-black text-xs uppercase tracking-caps transition-all duration-300 shadow-xl shadow-purple-900/40 inline-flex items-center gap-2 cursor-pointer"
            >
              Upgrade Subscription Plan
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand/20 rounded-full blur-[120px]" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-brand/10 rounded-full blur-[120px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Jobs"
        title={isEditMode ? 'Edit' : 'Post'}
        subtitle="Job"
      >
        <button
          onClick={() => navigate(-1)}
          className="bg-white border border-slate-100 text-slate-900 px-4 sm:px-8 py-3 sm:py-4.5 rounded-card font-black text-caption uppercase tracking-caps hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <HiOutlineChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back</span>
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-10 flex items-center gap-3">
              <span className="w-2 h-8 bg-brand rounded-full" /> Role Identity.
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
                      placeholder="e.g. Your Company"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Company Brand</label>
                  <select
                    value={form.brand_id}
                    onChange={(e) => updateForm('brand_id', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select hiring brand...</option>
                    {formMeta.brands?.map((brand: any) => (
                      <option key={brand.id} value={brand.id}>{brand.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => updateForm('category_id', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select category...</option>
                    {formMeta.categories.map((category: any) => (
                      <option key={category.id} value={category.id}>{category.title}</option>
                    ))}
                  </select>
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
              <span className="w-2 h-8 bg-blue-500 rounded-full" /> Geographic Location.
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className={labelClass}>Street Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateForm('address', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 100 Main Street"
                />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateForm('city', e.target.value)}
                  className={inputClass}
                  placeholder="City"
                />
              </div>
              <div>
                <label className={labelClass}>State / Region</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => updateForm('state', e.target.value)}
                  className={inputClass}
                  placeholder="State"
                />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => updateForm('country', e.target.value)}
                  className={inputClass}
                  placeholder="Country"
                />
              </div>
              <div>
                <label className={labelClass}>Zip Code</label>
                <input
                  type="text"
                  value={form.zip_code}
                  onChange={(e) => updateForm('zip_code', e.target.value)}
                  className={inputClass}
                  placeholder="Zip Code"
                />
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-6 pt-4 border-t border-slate-100/50">
                <div>
                  <label className={labelClass}>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => updateForm('latitude', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 37.7749"
                  />
                </div>
                <div>
                  <label className={labelClass}>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => updateForm('longitude', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. -122.4194"
                  />
                </div>
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
              <span className="w-2 h-8 bg-brand rounded-full" /> Photos & Media.
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
              placeholder="Describe the role — what they'll do, what you need, and why someone would want to work here..."
            />

            {/* Discoverability Tags manager */}
            <div className="space-y-4 pt-8 border-t border-slate-100 mt-8">
              <label className={labelClass}>Discoverability Keywords / Tags</label>
              <div className="flex flex-wrap gap-2.5 p-5 bg-slate-50 border-2 border-slate-100/50 rounded-card-lg min-h-[72px] items-center">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 bg-brand/5 text-brand text-xs font-bold pl-4 pr-3 py-2 rounded-xl border border-brand/10"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((_, idx) => idx !== i))}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-label font-black hover:bg-brand hover:text-white transition-colors text-brand/60"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? "Type a tag (e.g. React, Remote) and press Enter..." : "Add tag..."}
                  className="flex-1 bg-transparent border-none outline-none text-xs font-bold px-2 py-1 placeholder:text-slate-300 text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-sky-500 rounded-full" /> Discovery Details (SEO).
            </h3>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Meta Title Override</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => updateForm('company', e.target.value)}
                  className={inputClass}
                  placeholder="Override search title (default: Company Name)"
                />
              </div>
              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea
                  value={form.meta_description}
                  onChange={(e) => updateForm('meta_description', e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Short, attractive search snippet for search engines..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-floating p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-label font-black uppercase tracking-widest text-slate-500 mb-6">Listing Readiness</p>
              <span className="text-7xl font-black italic tracking-tighter">{progress}%</span>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-brand transition-all duration-1000 shadow-[0_0_15px_#6610f2]" style={{ width: `${progress}%` }} />
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
              <span className="text-sm font-bold text-slate-700 group-hover:text-brand transition-colors">Public Listing</span>
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => updateForm('is_published', e.target.checked)}
                className="w-6 h-6 rounded-lg accent-brand cursor-pointer"
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
