'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { JobListing } from '@/types';
import { OpportunityCard } from './components/OpportunityGrid';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import { fetchJobDetail, resolveJobFailure } from '@/themes/jobs/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';
import {
  formatJobCompensation,
  getStartupEquityFill,
  getStartupEquityRange,
} from '@/themes/jobs/shared/job-utils';
import {
  saveJobApplicationSnapshot,
  redirectToJobApplicationConfirmation,
} from '@/themes/jobs/shared/job-application-confirmation';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/storefront-api';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

interface ProductPageProps {
  slug: string;
}

interface JobApplicationForm {
  name: string;
  email: string;
  portfolio: string;
  note: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const labelMissionHeading = useThemeContent('detail.mission_heading', 'Mission Overview');
  const labelSpecsHeading = useThemeContent('detail.specs_heading', 'Role Specifications');
  const labelTagsHeading = useThemeContent('detail.tags_heading', 'Tech Stack');
  const labelCompensationLabel = useThemeContent('detail.compensation_label', 'Financial Package');
  const labelApplyHeading = useThemeContent('detail.apply_heading', 'Initialize Growth Node');
  const labelApplyDescription = useThemeContent('detail.apply_description', 'Submit your candidate node details to initialize live contract negotiations.');
  const labelRelatedHeading = useThemeContent('detail.related_heading', 'Related Nodes.');
  const [job, setJob] = useState<JobListing | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const { user, login, register } = useAuth();
  const [form, setForm] = useState<JobApplicationForm>({ name: '', email: '', portfolio: '', note: '' });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authPassword, setAuthPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobDetails() {
      setLoading(true);
      setNotFound(false);
      const result = await fetchJobDetail(slug);

      if (result.ok && result.response.data) {
        setJob(result.response.data);
        setRelatedJobs(result.response.related_jobs?.slice(0, 3) || []);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'Job not found or API returned no data.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobFailure(slug, allowDemo, 'startup');

        if (resolution.mode === 'demo') {
          setJob(resolution.job);
          setRelatedJobs(resolution.related);
          setUseFallback(true);
        } else if (resolution.mode === 'notFound') {
          setJob(null);
          setNotFound(true);
          setUseFallback(false);
        } else {
          setJob(null);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadJobDetails();
  }, [slug, allowDemo]);

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.email) {
      setFormError('Please enter your name and email before signing in.');
      return;
    }

    setAuthBusy(true);
    setFormError(null);

    try {
      if (authMode === 'login') {
        await login(form.email, authPassword);
      } else {
        await register(form.name, form.email, authPassword);
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setFormError(axiosError.response?.data?.message ?? 'Authentication failed.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !form.name || !form.email) {
      setFormError('Please enter your name and email to apply.');
      return;
    }

    setFormError(null);

    if (useFallback) {
      setIsSubmitting(true);
      setTimeout(() => {
        const storedApplications = JSON.parse(localStorage.getItem('sellio_jobs_startup_applications') || '[]');
        storedApplications.push({
          id: Date.now(),
          job_id: job.id,
          job_title: job.title,
          company: job.company?.name,
          candidate_name: form.name,
          candidate_email: form.email,
          portfolio: form.portfolio,
          cover_note: form.note,
          submitted_at: new Date().toISOString(),
        });
        localStorage.setItem('sellio_jobs_startup_applications', JSON.stringify(storedApplications));
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1200);
      return;
    }

    if (!user) {
      setFormError('Sign in to submit your application.');
      return;
    }

    const coverLetter = form.note.trim() || 'Application submitted via Sellio storefront.';

    setIsSubmitting(true);
    try {
      const application = await api.createJobApplication(slug, {
        cover_letter: coverLetter,
        portfolio_url: form.portfolio.trim() || undefined,
      });
      setApplicationId(application.id);
      setIsSubmitted(true);
      saveJobApplicationSnapshot({
        id: application.id,
        jobId: job.id,
        jobTitle: job.title,
        jobSlug: job.slug,
        applicantName: form.name,
        applicantEmail: form.email,
        status: 'pending',
      });
      redirectToJobApplicationConfirmation(themeLink, application.id);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setFormError(axiosError.response?.data?.message ?? 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="growth-loading-state">
        <div className="growth-shimmer" style={{ width: '120px', height: '24px', borderRadius: '4px' }}></div>
        <div className="growth-shimmer" style={{ width: '40%', height: '50px', marginTop: '2rem', borderRadius: '8px' }}></div>
        <div className="growth-shimmer" style={{ width: '20%', height: '30px', marginTop: '1.5rem', borderRadius: '4px' }}></div>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="growth-notfound-state">
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white' }}>Job Not Found</h2>
        <p style={{ color: 'var(--growth-dim)' }}>This job listing could not be found or may have been removed.</p>
        <Link href={themeLink('/explore')} className="growth-btn-outline" style={{ display: 'inline-block', margin: '2rem auto', textDecoration: 'none' }}>
          &larr; Back to Jobs
        </Link>
      </div>
    );
  }

  const equityShareRange = getStartupEquityRange(job);
  const percentFill = getStartupEquityFill(job);
  const cleanSpec = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div>
      <header className="growth-details-header">
        <div className="growth-details-glow"></div>

        {apiError && useFallback && (
          <div className="gr-alert-slot" style={{ position: 'relative', zIndex: 10 }}>
            <CatalogSyncAlert variant="demo" error={apiError} classPrefix="gr" />
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="growth-detail-breadcrumb">
            <Link href={themeLink('/explore')} className="growth-detail-breadcrumb-link">
              &larr; Back to Jobs
            </Link>
            <span className="growth-detail-breadcrumb-sep">/</span>
            <span className="growth-detail-breadcrumb-cat">
              {job.taxonomy?.category?.replace(/_/g, ' ').toUpperCase() || 'ENGINEERING'}
            </span>
          </div>

          <div className="growth-detail-title-row">
            <div className="venture-logo-box">
              {job.company?.name ? job.company.name[0] : 'V'}
            </div>
            <div>
              <h1 className="growth-detail-heading">
                {job.title}
              </h1>
              <div className="growth-detail-company">
                {job.company?.name || 'Venture Startup'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="growth-details-grid">
        <div className="growth-detail-main">
          <div className="growth-panel" style={{ padding: '3rem' }}>
            <h2 className="growth-panel-section-heading">{labelMissionHeading}</h2>
            <p className="growth-detail-description">
              {job.description}
            </p>
          </div>

          <div>
            <h2 className="growth-section-heading">{labelSpecsHeading}</h2>
            <div className="growth-spec-grid">
              <div className="growth-spec-card growth-panel">
                <div className="growth-spec-title">Workplace Model</div>
                <div className="growth-spec-value">{cleanSpec(job.employment?.workplace || 'Remote')}</div>
              </div>
              <div className="growth-spec-card growth-panel">
                <div className="growth-spec-title">Employment Arrangement</div>
                <div className="growth-spec-value">{cleanSpec(job.employment?.type || 'Full-time')}</div>
              </div>
              <div className="growth-spec-card growth-panel">
                <div className="growth-spec-title">Experience Level</div>
                <div className="growth-spec-value">{cleanSpec(job.employment?.experience_level || 'Senior Level')}</div>
              </div>
              <div className="growth-spec-card growth-panel">
                <div className="growth-spec-title">Required Education</div>
                <div className="growth-spec-value">{cleanSpec(job.employment?.education || 'Equiv Experience')}</div>
              </div>
            </div>
          </div>

          {job.taxonomy?.tags && job.taxonomy.tags.length > 0 && (
            <div>
              <h2 className="growth-section-heading-sm">{labelTagsHeading}</h2>
              <div className="growth-detail-tags">
                {job.taxonomy.tags.map((tag) => (
                  <span key={tag} className="growth-tag-chip">
                    #{tag.replace(/_/g, ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="growth-detail-sidebar">
          <div className="growth-panel" style={{ padding: '2.5rem' }}>
            <div className="growth-sidebar-section-label">{labelCompensationLabel}</div>
            <div style={{ marginBottom: '2rem' }}>
              <div className="growth-salary-value">{formatJobCompensation(job)}</div>
              <div className="growth-salary-period">
                Base Salary ({job.compensation?.frequency || 'Yearly'})
              </div>
            </div>
            <div className="growth-equity-row">
              <div className="growth-equity-header">
                <span className="growth-equity-label">Equity Range</span>
                <span className="growth-equity-value">{equityShareRange}</span>
              </div>
              <div className="growth-equity-bar-wrap">
                <div className="growth-equity-bar-fill" style={{ width: percentFill }}></div>
              </div>
            </div>
          </div>

          <div className="growth-panel growth-apply-desk">
            <h3 className="growth-apply-heading">{labelApplyHeading}</h3>
            <p className="growth-apply-description">{labelApplyDescription}</p>

            {isSubmitted ? (
              <div className="growth-apply-success-center">
                <div className="growth-apply-success-emoji" aria-hidden="true">🎉</div>
                <h4 className="growth-apply-success-heading">Application Submitted!</h4>
                <p className="growth-apply-success-note">
                  {useFallback
                    ? 'Application saved in demo mode.'
                    : `Application #${applicationId ?? '—'} submitted. The hiring team will follow up by email.`}
                </p>
                <button type="button" className="growth-btn-outline" style={{ marginTop: '1.5rem', width: '100%', padding: '0.8rem' }} onClick={() => { setIsSubmitted(false); setApplicationId(null); }}>
                  Submit Another Application
                </button>
              </div>
            ) : !useFallback && !user ? (
              <form onSubmit={handleAuthSubmit}>
                <p className="growth-auth-sign-in-note">Sign in to apply for this role.</p>
                <div className="growth-form-group">
                  <label htmlFor="auth-name">Full Name</label>
                  <input id="auth-name" type="text" className="growth-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="growth-form-group">
                  <label htmlFor="auth-email">Email</label>
                  <input id="auth-email" type="email" className="growth-input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="growth-auth-toggle-row">
                  <button type="button" className="growth-btn-outline" onClick={() => setAuthMode('login')} disabled={authMode === 'login'}>Login</button>
                  <button type="button" className="growth-btn-outline" onClick={() => setAuthMode('register')} disabled={authMode === 'register'}>Register</button>
                </div>
                <div className="growth-form-group">
                  <label htmlFor="auth-password">Password</label>
                  <input id="auth-password" type="password" className="growth-input" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
                </div>
                {formError && <p className="gr-form-error" role="alert">{formError}</p>}
                <button type="submit" className="growth-btn-primary growth-form-btn-full" disabled={authBusy}>
                  {authBusy ? 'Please wait...' : authMode === 'login' ? 'Sign In to Apply' : 'Create Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleApplySubmit}>
                <div className="growth-form-group">
                  <label htmlFor="apply-name">Full Name</label>
                  <input id="apply-name" type="text" className="growth-input" required placeholder="Candidate Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="growth-form-group">
                  <label htmlFor="apply-email">Candidate Email</label>
                  <input id="apply-email" type="email" className="growth-input" required placeholder="name@node.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="growth-form-group">
                  <label htmlFor="apply-portfolio">GitHub or Portfolio URL</label>
                  <input id="apply-portfolio" type="url" className="growth-input" placeholder="https://github.com/nodal" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} />
                </div>
                <div className="growth-form-group">
                  <label htmlFor="apply-note">Cover Note (Mission Specs)</label>
                  <textarea id="apply-note" className="growth-textarea" placeholder="Describe your technical capabilities..." value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                </div>
                {formError && <p className="gr-form-error" role="alert">{formError}</p>}
                <button type="submit" className="growth-btn-primary growth-form-btn-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {relatedJobs.length > 0 && (
        <section className="growth-related-section">
          <h2 className="growth-related-heading">{labelRelatedHeading}</h2>
          <div className="growth-related-grid">
            {relatedJobs.map((relatedJob) => (
              <OpportunityCard key={relatedJob.id} job={relatedJob} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
