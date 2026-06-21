import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiOutlineChevronLeft, 
  HiOutlinePencilSquare, 
  HiOutlineCurrencyDollar,
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineUserGroup,
} from 'react-icons/hi2';
import PageHeader from '../../components/layout/PageHeader';
import { getJobBySlug } from '../../api/jobs';
import ListingAnalyticsWidget from '../../components/studio/ListingAnalyticsWidget';
import ListingActivityWidget from '../../components/studio/ListingActivityWidget';
import { toast } from 'sonner';

export default function JobDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const { data } = await getJobBySlug(slug);
        setJob(data);
      } catch (error) {
        console.error('Failed to fetch job', error);
        toast.error('Failed to load job details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#6610f2] animate-progress-loading" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Retrieving Opportunity Data...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Job not found</span>
      </div>
    );
  }

  const containerClass = 'bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12';
  const skills = job.skills ? job.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-10 md:space-y-16 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <PageHeader
        badge="Job"
        title={job.title}
        subtitle="Job Detail"
      >
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white border border-slate-100 text-slate-900 px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <HiOutlineChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => navigate(`/dashboard/joblistings/edit/${job.slug}`)}
            className="bg-[#6610f2] text-white px-8 py-4.5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#7b2dfd] transition-all flex items-center gap-2"
          >
            <HiOutlinePencilSquare className="w-4 h-4" /> Edit Listing
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={job.media[0]?.original_url} 
              className="w-full aspect-video object-cover" 
              alt={job.title} 
            />
          </div>

          <div className={containerClass}>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#6610f2] rounded-full" /> Role Narrative.
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">
              {job.description}
            </p>
          </div>

          {skills.length > 0 && (
            <div className={containerClass}>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-emerald-500 rounded-full" /> Required Skills.
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill: string) => (
                  <span key={skill} className="px-4 py-2 bg-slate-50 rounded-full text-sm font-bold text-slate-700 border border-slate-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Annual Compensation</p>
              <h4 className="text-4xl font-black italic tracking-tighter mb-8">{job.price || 'Negotiable'}</h4>
              <div className="flex items-center gap-3 text-emerald-400 font-bold text-sm">
                <HiOutlineUserGroup className="w-5 h-5" />
                {job.applicants_count ?? 0} ACTIVE APPLICANTS
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <HiOutlineCurrencyDollar className="w-32 h-32" />
            </div>
          </div>

          <div className={containerClass}>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Role Parameters</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineBriefcase className="w-5 h-5" />
                  <span className="text-sm font-bold">Type</span>
                </div>
                <span className="text-sm font-black text-slate-900 capitalize">{job.job_type || job.employment?.type || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineMapPin className="w-5 h-5" />
                  <span className="text-sm font-bold">Location</span>
                </div>
                <span className="text-sm font-black text-slate-900 text-right max-w-[150px]">{job.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <HiOutlineBuildingOffice2 className="w-5 h-5" />
                  <span className="text-sm font-bold">Experience</span>
                </div>
                <span className="text-sm font-black text-slate-900">{job.experience_level || 'N/A'}</span>
              </div>
            </div>
          </div>

          {job.company && (
            <div className={containerClass}>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Hiring Entity</h4>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-emerald-600 border-2 border-white shadow-sm">
                  <HiOutlineBuildingOffice2 className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900 leading-none mb-1">{job.company}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Employer</p>
                </div>
              </div>
            </div>
          )}

          <ListingAnalyticsWidget listingId={job.id} listingType="JobListing" />
          <ListingActivityWidget listingId={job.id} listingType="JobListing" />
        </div>
      </div>
    </div>
  );
}
