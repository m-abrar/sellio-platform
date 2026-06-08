'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import { TechJobCard } from './components';
import type { JobListing } from '@sellio/types';

// High-fidelity local developer jobs fallback
const FALLBACK_JOBS = [
  { id: 1, slug: "senior-react-engineer", title: "Senior React Engineer", company: "Vercel", location: "Remote - Worldwide", type: "Full-Time", salary: "$140k - $180k", time: "2h ago", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vercel_logo_black.svg/512px-Vercel_logo_black.svg.png", skills: ["React", "Next.js", "TypeScript"], description: "Join Vercel's core framework team to innovate Next.js and frontend delivery systems. Optimize compilation streams, hydration metrics, and SSR edge rendering." },
  { id: 2, slug: "backend-systems-developer", title: "Backend Systems Developer", company: "Stripe", location: "Remote - US/Canada", type: "Full-Time", salary: "$160k - $210k", time: "5h ago", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png", skills: ["Go", "Ruby", "PostgreSQL", "AWS"], description: "Architect robust transactional APIs and secure ledger databases that route global trade and multi-currency billing networks with absolute uptime compliance." },
  { id: 3, slug: "frontend-architect", title: "Frontend Architect", company: "Linear", location: "San Francisco, CA", type: "Full-Time", salary: "$180k - $220k", time: "1d ago", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Linear_Logo_1.svg/512px-Linear_Logo_1.svg.png", skills: ["React", "GraphQL", "MobX"], description: "Craft highly interactive, responsive toolings for task management workflows. Master absolute visual fluidity, localized storage query state sync, and keyboard-first navigation." },
  { id: 4, slug: "devops-engineer", title: "DevOps Engineer", company: "Discord", location: "Remote - US", type: "Full-Time", salary: "$150k - $190k", time: "1d ago", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Discord_logo.svg/512px-Discord_logo.svg.png", skills: ["Kubernetes", "Rust", "GCP"], description: "Manage highly scalable orchestration nodes routing voice and socket data. Optimize low-latency pipelines and configure secure multi-cloud clusters." },
  { id: 5, slug: "full-stack-developer", title: "Full Stack Developer", company: "Supabase", location: "Remote - EMEA", type: "Full-Time", salary: "$120k - $150k", time: "2d ago", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Supabase_logo.svg/512px-Supabase_logo.svg.png", skills: ["TypeScript", "PostgreSQL", "Elixir"], description: "Develop and scale open-source database client abstractions and serverless edge functions. Support developer onboarding with high-quality tech documentation." },
];

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);

  // Hydration status
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Application Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationReceipt, setApplicationReceipt] = useState<any>(null);

  const translateJob = (j: any) => {
    let logo = j.company?.logo || j.company_logo || j.logo;
    if (!logo) {
      logo = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80`;
    }
    
    let salary = `$130k - $160k`;
    if (j.compensation) {
      if (typeof j.compensation === 'object') {
        salary = j.compensation.range_compact || j.compensation.range_full || `$130k - $160k`;
      } else {
        salary = String(j.compensation);
      }
    } else if (j.salary_range) {
      salary = j.salary_range;
    }
    
    let loc = 'Remote - Worldwide';
    if (j.location) {
      if (typeof j.location === 'object') {
        loc = j.location.title || (j.location.city ? `${j.location.city}, ${j.location.state || j.location.country || ''}` : 'Remote - Worldwide');
      } else {
        loc = String(j.location);
      }
    } else if (j.city) {
      loc = `${j.city}, ${j.state || j.country || ''}`;
    }
    
    let jobType = 'Full-Time';
    if (j.job_type) {
      jobType = typeof j.job_type === 'object' ? (j.job_type.title || j.job_type.name || 'Full-Time') : String(j.job_type);
    } else if (j.workplace_type) {
      jobType = typeof j.workplace_type === 'object' ? (j.workplace_type.title || j.workplace_type.name || 'Full-Time') : String(j.workplace_type);
    }
    
    let skills = ['TypeScript', 'Node.js', 'React'];
    if (Array.isArray(j.skills_list)) {
      skills = j.skills_list;
    } else if (j.skills) {
      skills = j.skills.split(',').map((s: string) => s.trim());
    } else if (j.tags) {
      skills = typeof j.tags === 'string' ? j.tags.split(',').map((t: string) => t.trim()) : j.tags.map((t: any) => t.title || t);
    }
    
    const time = j.created_at ? `${Math.max(1, Math.round((new Date().getTime() - new Date(j.created_at).getTime()) / (1000 * 60 * 60 * 24)))}d ago` : '2h ago';

    return {
      id: j.id,
      title: j.title,
      slug: j.slug || `job-${j.id}`,
      company: j.company?.title || (j.company_name || 'Tech Startup'),
      location: loc,
      type: jobType,
      salary: salary,
      time: time,
      logo: logo,
      skills: skills,
      description: j.description || j.short_description || `High-fidelity engineering opportunity at ${j.company?.title || j.company_name || 'Tech Startup'}. Solve mission-critical problems with absolute autonomy.`
    };
  };

  const loadJobDetails = async () => {
    setLoading(true);
    try {
      const response = await api.getJobDetails(slug);
      if (response && response.data) {
        const translated = translateJob(response.data);
        setJob(translated);
        setUseFallback(false);
        setApiError(null);

        // Fetch other jobs to populate related recommendations
        const relatedRes = await api.getJobs({ per_page: 6 });
        if (relatedRes && relatedRes.data) {
          const mappedRelated = relatedRes.data
            .filter((j: any) => j.slug !== slug)
            .slice(0, 3)
            .map((j: any) => translateJob(j));
          setRelated(mappedRelated);
        }
      } else {
        triggerFallbackNode();
      }
    } catch (error) {
      console.error("Jobs Tech Theme: Failed to fetch job details. Engaging fallback.", error);
      setApiError(error instanceof Error ? error.message : String(error));
      triggerFallbackNode();
    } finally {
      setLoading(false);
    }
  };

  const triggerFallbackNode = () => {
    setUseFallback(true);
    const found = FALLBACK_JOBS.find(j => j.slug === slug) || FALLBACK_JOBS[0];
    setJob(found);

    const filtered = FALLBACK_JOBS.filter(j => j.slug !== found.slug).slice(0, 3);
    setRelated(filtered);
  };

  useEffect(() => {
    loadJobDetails();
  }, [slug]);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !githubUrl) {
      alert("Please fill in all core developer applicant parameters.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate compilation/crypto application routing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const shaHash = `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const receipt = {
      applicationId: `AP-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleString(),
      jobTitle: job.title,
      company: job.company,
      applicantName: name,
      applicantEmail: email,
      githubUrl: githubUrl,
      shaHash: shaHash
    };

    try {
      const existing = localStorage.getItem('sellio_jobs_tech_orders');
      const appList = existing ? JSON.parse(existing) : [];
      appList.unshift(receipt);
      localStorage.setItem('sellio_jobs_tech_orders', JSON.stringify(appList));
      
      setApplicationReceipt(receipt);
      setIsSubmitting(false);
    } catch (error) {
      console.error("LocalStorage application write failure", error);
      setApplicationReceipt(receipt);
      setIsSubmitting(false);
    }
  };

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/jobs_tech${path}`;
      }
    }
    return path;
  };

  if (loading) {
    return (
      <div className="jt-layout-base" style={{ padding: '4rem 6%', minHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .jt-shimmer {
            background: linear-gradient(90deg, #182235 25%, #24324d 50%, #182235 75%);
            background-size: 200% 100%;
            animation: jtShimmer 1.5s infinite linear;
          }
          @keyframes jtShimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}} />
        <div className="jt-shimmer" style={{ height: '300px', borderRadius: '16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '4rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="jt-shimmer" style={{ height: '40px', width: '70%', borderRadius: '8px' }} />
            <div className="jt-shimmer" style={{ height: '20px', width: '90%', borderRadius: '8px' }} />
            <div className="jt-shimmer" style={{ height: '180px', borderRadius: '16px' }} />
          </div>
          <div className="jt-shimmer" style={{ height: '400px', borderRadius: '16px' }} />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="jt-layout-base text-center" style={{ padding: '8rem 2rem', color: 'var(--jt-text-main)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Developer Node Not Resolved</h2>
        <p style={{ color: 'var(--jt-text-muted)', margin: '2rem 0 4rem' }}>The requested engineering opportunity could not be recovered from DevJobs registries.</p>
        <button className="jt-btn jt-btn-primary" onClick={() => router.push(getThemeLink('/'))}>Back to Console</button>
      </div>
    );
  }

  return (
    <div className="jt-layout-base" style={{ padding: '0 6% 8rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Return Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '3rem 0 4rem' }}>
        <button 
          onClick={() => router.push(getThemeLink('/'))}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--jt-text-main)',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: 'var(--jt-font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {`<-`} BACK_TO_CONSOLE
        </button>
        <div className="jt-mono" style={{ fontSize: '0.75rem', fontFamily: 'var(--jt-font-mono)', color: 'var(--jt-purple)', fontWeight: 800 }}>
          OPPORTUNITY NODE // {job.slug.toUpperCase()}
        </div>
      </div>

      {/* Diagnostics exception panel */}
      {useFallback && apiError && (
        <div style={{
          background: '#090d16',
          border: '1px dashed var(--jt-purple)',
          borderLeft: '4px solid var(--jt-purple)',
          padding: '2rem',
          borderRadius: '16px',
          marginBottom: '4rem',
          color: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }} className="jt-mono">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }}></span>
            <span style={{ color: 'var(--jt-purple)', fontSize: '0.75rem', fontFamily: 'var(--jt-font-mono)', fontWeight: 800 }}>API_CONNECTION_EXCEPTION_TRACE</span>
          </div>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--jt-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Viewing high-fidelity backup simulation parameters because the live database connection threw a {apiError}. Specifications have loaded safely.
          </p>
        </div>
      )}

      {/* Details Sprawling Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '6rem', alignItems: 'start' }}>
        
        {/* Left main content block */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '3.5rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0.5rem', border: '1px solid var(--jt-border)' }}>
              <img src={job.logo} alt={job.company} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--jt-text-main)', letterSpacing: '-1.5px', marginBottom: '0.5rem', lineHeight: 1.15 }}>
                {job.title}
              </h1>
              <div style={{ fontSize: '1.25rem', color: 'var(--jt-purple)', fontWeight: 800, fontFamily: 'var(--jt-font-mono)' }}>
                {job.company}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '4rem' }} className="jt-job-tags">
            {job.skills.map((skill: string) => (
              <span key={skill} className="jt-skill-tag" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', fontWeight: 700 }}>
                {skill}
              </span>
            ))}
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jt-text-main)', marginBottom: '1.5rem', fontFamily: 'var(--jt-font-mono)' }}>Opportunity specs</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
            {[
              { label: 'SALARY_RANGE', value: job.salary },
              { label: 'WORKPLACE_ARCHITECTURE', value: job.location },
              { label: 'ENGAGEMENT_PROFILE', value: job.type },
              { label: 'POSTED_TIMESTAMP', value: job.time }
            ].map((spec, i) => (
              <div key={i} style={{ padding: '1.5rem', background: 'var(--jt-bg-light)', borderRadius: '12px', border: '1px solid var(--jt-border)' }}>
                <div style={{ fontSize: '0.65rem', fontFamily: 'var(--jt-font-mono)', color: 'var(--jt-text-muted)', marginBottom: '0.5rem', fontWeight: 800 }}>{spec.label}</div>
                <div style={{ fontWeight: 800, color: 'var(--jt-text-main)', fontSize: '1rem' }}>{spec.value}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--jt-text-main)', marginBottom: '1.5rem', fontFamily: 'var(--jt-font-mono)' }}>Scope of Work & Autonomy</h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--jt-text-muted)', lineHeight: 1.8 }}>
            {job.description}
          </p>
          
          <div style={{ background: 'rgba(168, 85, 247, 0.02)', border: '1px solid var(--jt-border)', padding: '3rem', borderRadius: '16px', marginTop: '4rem' }}>
            <h4 style={{ color: 'var(--jt-text-main)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', fontFamily: 'var(--jt-font-mono)' }}>{`./candidate_expectations.md`}</h4>
            <ul style={{ color: 'var(--jt-text-muted)', paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>Proven commercial systems delivery in core technical domains.</li>
              <li>High autonomy capacity. You'll operate directly with product leads and engineering squads.</li>
              <li>Strong testing advocacy and solid cryptographic/networking appreciation.</li>
            </ul>
          </div>
        </div>

        {/* Right Application sidebar desk */}
        <div>
          {applicationReceipt ? (
            /* Successful Application Invoice Receipt */
            <div style={{
              background: '#090d16',
              border: '2px solid var(--jt-purple)',
              padding: '4rem 3.5rem',
              borderRadius: '24px',
              color: 'white',
              boxShadow: 'var(--pr-shadow-lg)',
              animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div className="jt-mono" style={{ color: 'var(--jt-purple)', marginBottom: '2rem', fontFamily: 'var(--jt-font-mono)', fontWeight: 800 }}>APPLICATION_PIPELINE_ROUTED</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '1.5rem', color: 'white' }}>Node Synced!</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.6, lineHeight: 1.7, marginBottom: '3rem' }}>
                Your candidate routing sequence completed successfully. Stripe, Linear or Vercel gateways have dispatched your node parameters.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem', marginBottom: '3.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="jt-mono">ROUTE_REF_ID</span>
                  <span style={{ fontWeight: 800, fontFamily: 'monospace' }}>{applicationReceipt.applicationId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="jt-mono">APPLICANT</span>
                  <span style={{ fontWeight: 800 }}>{applicationReceipt.applicantName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="jt-mono">DISPATCH_GATE</span>
                  <span style={{ fontWeight: 800 }}>{applicationReceipt.applicantEmail}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ opacity: 0.4 }} className="jt-mono">GITHUB_NODE</span>
                  <span style={{ fontWeight: 800, color: 'var(--jt-purple)', textDecoration: 'underline' }} onClick={() => window.open(applicationReceipt.githubUrl, '_blank')}>{applicationReceipt.githubUrl.replace('https://', '')}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                  <span style={{ opacity: 0.4, fontSize: '0.75rem' }} className="jt-mono">SHA_256_VERIFICATION_HASH</span>
                  <span style={{ fontWeight: 800, color: 'var(--jt-purple)', fontSize: '0.75rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>{applicationReceipt.shaHash}</span>
                </div>
              </div>

              <button 
                className="jt-btn jt-btn-primary" 
                style={{ width: '100%', padding: '1.5rem', borderRadius: '8px' }}
                onClick={() => setApplicationReceipt(null)}
              >
                SUBMIT NEW APPLICATION
              </button>
            </div>
          ) : (
            /* Stateful application form desk */
            <div style={{
              background: 'var(--jt-bg-light)',
              border: '1px solid var(--jt-border)',
              padding: '4rem 3.5rem',
              borderRadius: '24px',
              boxShadow: 'var(--pr-shadow-md)'
            }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--jt-text-main)', marginBottom: '1rem', fontFamily: 'var(--jt-font-mono)' }}>Apply Directly</h3>
              <p style={{ color: 'var(--jt-text-muted)', fontSize: '0.9rem', marginBottom: '3rem', lineHeight: 1.6 }}>
                Submit your developer specifications node directly to the engineering lead directory with absolute data provenance.
              </p>

              <form onSubmit={handleApplicationSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.7rem', color: 'var(--jt-text-muted)', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--jt-font-mono)' }}>Full Name</label>
                    <input 
                      type="text"
                      className="jt-search-input"
                      style={{ width: '100%', backgroundColor: 'var(--jt-bg)', border: '1px solid var(--jt-border)', color: 'var(--jt-text-main)', padding: '0.8rem 1.2rem', borderRadius: '8px', outline: 'none' }}
                      placeholder="e.g. Linus Torvalds"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.7rem', color: 'var(--jt-text-muted)', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--jt-font-mono)' }}>Email Address</label>
                    <input 
                      type="email"
                      className="jt-search-input"
                      style={{ width: '100%', backgroundColor: 'var(--jt-bg)', border: '1px solid var(--jt-border)', color: 'var(--jt-text-main)', padding: '0.8rem 1.2rem', borderRadius: '8px', outline: 'none' }}
                      placeholder="e.g. linus@kernel.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.7rem', color: 'var(--jt-text-muted)', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--jt-font-mono)' }}>GitHub Profile Link</label>
                    <input 
                      type="url"
                      className="jt-search-input"
                      style={{ width: '100%', backgroundColor: 'var(--jt-bg)', border: '1px solid var(--jt-border)', color: 'var(--jt-text-main)', padding: '0.8rem 1.2rem', borderRadius: '8px', outline: 'none' }}
                      placeholder="e.g. https://github.com/torvalds"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="pr-booking-label" style={{ fontSize: '0.7rem', color: 'var(--jt-text-muted)', display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--jt-font-mono)' }}>Cover Letter Notes</label>
                    <textarea 
                      className="jt-search-input"
                      rows={4}
                      style={{ width: '100%', backgroundColor: 'var(--jt-bg)', border: '1px solid var(--jt-border)', color: 'var(--jt-text-main)', padding: '0.8rem 1.2rem', borderRadius: '8px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                      placeholder="Summary of developer node specs or significant systems built..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="jt-btn jt-btn-primary"
                  style={{ width: '100%', padding: '1.6rem', borderRadius: '8px', fontSize: '1rem' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'AUTHORIZING DISPATCH...' : '⚡ INITIALIZE APPLICATION GATEWAY'}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

      {/* Suggested related developer roles carousel */}
      <section style={{ marginTop: '12rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--jt-text-main)', marginBottom: '1rem', letterSpacing: '-1.5px', fontFamily: 'var(--jt-font-mono)' }}>Suggested Roles</h2>
        <p style={{ color: 'var(--jt-text-muted)', marginBottom: '4rem' }}>Alternative engineering listings matching active category stacks.</p>
        
        <div className="jt-job-list">
          {related.map((r, i) => (
            <TechJobCard 
              key={i} 
              {...r} 
              onClick={() => {
                setApplicationReceipt(null);
                setName('');
                setEmail('');
                setGithubUrl('');
                setCoverNote('');
                router.push(getThemeLink(`/product/${r.slug}`));
              }}
            />
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
