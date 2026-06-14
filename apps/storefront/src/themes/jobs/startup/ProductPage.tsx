'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { JobListing } from '@sellio/types';
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
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/storefront-api';

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
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      setFormError(axiosError.response?.data?.message ?? 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="growth-details-header" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="growth-skeleton" style={{ width: '120px', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
        <div className="growth-skeleton" style={{ width: '40%', height: '50px', marginTop: '2rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}></div>
        <div className="growth-skeleton" style={{ width: '20%', height: '30px', marginTop: '1.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}></div>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="p-20 text-center" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
            <Link
              href={themeLink('/explore')}
              style={{ color: 'var(--growth-neon)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px' }}
            >
              &larr; Back to Jobs
            </Link>
            <span style={{ color: 'var(--growth-dim)' }}>/</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--growth-dim)', letterSpacing: '2px', fontWeight: 600 }}>
              {job.taxonomy?.category?.toUpperCase() || 'ENGINEERING'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="venture-logo" style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--growth-purple)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>
              {job.company?.name ? job.company.name[0] : 'V'}
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 700, color: 'white', margin: 0, letterSpacing: '-2px' }}>
                {job.title}
              </h1>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--growth-neon)', marginTop: '0.5rem' }}>
                {job.company?.name || 'Venture Startup'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="growth-details-grid">
        <div className="growth-detail-main">
          <div className="growth-panel" style={{ padding: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--growth-border)', paddingBottom: '1rem' }}>
              MISSION_OBJECTIVE
            </h2>
            <p style={{ color: 'var(--growth-dim)', fontSize: '1.1rem', lineHeight: 1.8, margin: 0 }}>
              {job.description}
            </p>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
              NODE_SPECIFICATIONS
            </h2>
            <div className="growth-spec-grid">
              <div className="growth-spec-card growth-panel">
                <div className="growth-spec-title">Workplace Model</div>
                <div className="growth-spec-value">{job.employment?.workplace || 'Remote'}</div>
              </div>
              <div className="growth-spec-card growth-panel">
                <div className="growth-spec-title">Employment Arrangement</div>
                <div className="growth-spec-value">{job.employment?.type || 'Full-time'}</div>
              </div>
              <div className="growth-spec-card growth-panel">
                <div className="growth-spec-title">Experience Level</div>
                <div className="growth-spec-value">{job.employment?.experience_level || 'Senior Level'}</div>
              </div>
              <div className="growth-spec-card growth-panel">
                <div className="growth-spec-title">Required Education</div>
                <div className="growth-spec-value">{job.employment?.education || 'Equiv Experience'}</div>
              </div>
            </div>
          </div>

          {job.taxonomy?.tags && job.taxonomy.tags.length > 0 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.2rem', marginBottom: '1rem', letterSpacing: '1px' }}>
                TECHNOLOGY_TAGS
              </h2>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {job.taxonomy.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.8rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--growth-border)',
                      padding: '0.5rem 1.25rem',
                      borderRadius: '8px',
                      color: 'var(--growth-neon)',
                      fontWeight: 600,
                    }}
                  >
                    #{tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="growth-detail-sidebar">
          <div className="growth-panel" style={{ padding: '2.5rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--growth-dim)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Financial Package
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
                {formatJobCompensation(job)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--growth-dim)', fontWeight: 600, marginTop: '0.25rem' }}>
                LIVE_BASE_SALARY ({job.compensation?.frequency?.toUpperCase() || 'YEARLY'})
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--growth-border)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--growth-dim)' }}>EQUITY_SHARE_GAGE</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--growth-neon)' }}>{equityShareRange}</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ width: percentFill, height: '100%', background: 'linear-gradient(to right, var(--growth-purple), var(--growth-neon))', borderRadius: '100px' }}></div>
              </div>
            </div>
          </div>

          <div className="growth-panel growth-apply-desk">
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
              Initialize Growth Node
            </h3>
            <p style={{ color: 'var(--growth-dim)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '2rem' }}>
              Submit your candidate node details to initialize live contract negotiations.
            </p>

            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--growth-neon)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                  TALENT_NODE_SYNCHRONIZED
                </h4>
                <p style={{ color: 'var(--growth-dim)', fontSize: '0.8rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  {useFallback
                    ? 'Application saved in demo mode.'
                    : `Application #${applicationId ?? '—'} submitted. The hiring team will follow up by email.`}
                </p>
                <button type="button" className="growth-btn-outline" style={{ marginTop: '1.5rem', width: '100%', padding: '0.8rem' }} onClick={() => { setIsSubmitted(false); setApplicationId(null); }}>
                  SUBMIT_ANOTHER
                </button>
              </div>
            ) : !useFallback && !user ? (
              <form onSubmit={handleAuthSubmit}>
                <p style={{ color: 'var(--growth-dim)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                  Sign in to apply for this role.
                </p>
                <div className="growth-form-group">
                  <label>Full Name</label>
                  <input type="text" className="growth-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="growth-form-group">
                  <label>Email</label>
                  <input type="email" className="growth-input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <button type="button" className="growth-btn-outline" onClick={() => setAuthMode('login')} disabled={authMode === 'login'}>Login</button>
                  <button type="button" className="growth-btn-outline" onClick={() => setAuthMode('register')} disabled={authMode === 'register'}>Register</button>
                </div>
                <div className="growth-form-group">
                  <label>Password</label>
                  <input type="password" className="growth-input" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
                </div>
                {formError && <p className="gr-form-error" role="alert">{formError}</p>}
                <button type="submit" className="growth-btn-primary" disabled={authBusy} style={{ width: '100%', padding: '1.25rem', fontSize: '0.9rem', marginTop: '1rem' }}>
                  {authBusy ? 'PLEASE_WAIT...' : authMode === 'login' ? 'SIGN_IN_TO_APPLY' : 'CREATE_ACCOUNT'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleApplySubmit}>
                <div className="growth-form-group">
                  <label>Full Name</label>
                  <input type="text" className="growth-input" required placeholder="Candidate Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="growth-form-group">
                  <label>Candidate Email</label>
                  <input type="email" className="growth-input" required placeholder="name@node.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="growth-form-group">
                  <label>GitHub or Portfolio URL</label>
                  <input type="url" className="growth-input" placeholder="https://github.com/nodal" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} />
                </div>
                <div className="growth-form-group">
                  <label>Cover Note (Mission Specs)</label>
                  <textarea className="growth-textarea" placeholder="Describe your technical capabilities..." value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                </div>
                {formError && <p className="gr-form-error" role="alert">{formError}</p>}
                <button type="submit" className="growth-btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '1.25rem', fontSize: '0.9rem', marginTop: '1rem' }}>
                  {isSubmitting ? 'INITIALIZING...' : 'INITIALIZE_GROWTH_NODE'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {relatedJobs.length > 0 && (
        <section style={{ padding: '6rem 6%', borderTop: '1px solid var(--growth-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '2.5rem', fontWeight: 700, marginBottom: '3rem', letterSpacing: '-1px' }}>
            Related Nodes.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {relatedJobs.map((relatedJob) => (
              <OpportunityCard key={relatedJob.id} job={relatedJob} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
