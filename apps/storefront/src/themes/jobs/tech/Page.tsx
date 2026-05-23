'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TechJobCard } from './components';
import { api } from '@sellio/api-client';
import type { JobListing } from '@sellio/types';

// High-fidelity local developer jobs fallback
const FALLBACK_JOBS = [
  { id: 1, slug: "senior-react-engineer", title: "Senior React Engineer", company: "Vercel", location: "Remote - Worldwide", type: "Full-Time", salary: "$140k - $180k", time: "2h ago", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vercel_logo_black.svg/512px-Vercel_logo_black.svg.png", skills: ["React", "Next.js", "TypeScript"], description: "Join Vercel's core framework team to innovate Next.js and frontend delivery systems. Optimize compilation streams, hydration metrics, and SSR edge rendering." },
  { id: 2, slug: "backend-systems-developer", title: "Backend Systems Developer", company: "Stripe", location: "Remote - US/Canada", type: "Full-Time", salary: "$160k - $210k", time: "5h ago", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png", skills: ["Go", "Ruby", "PostgreSQL", "AWS"], description: "Architect robust transactional APIs and secure ledger databases that route global trade and multi-currency billing networks with absolute uptime compliance." },
  { id: 3, slug: "frontend-architect", title: "Frontend Architect", company: "Linear", location: "San Francisco, CA", type: "Full-Time", salary: "$180k - $220k", time: "1d ago", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Linear_Logo_1.svg/512px-Linear_Logo_1.svg.png", skills: ["React", "GraphQL", "MobX"], description: "Craft highly interactive, responsive toolings for task management workflows. Master absolute visual fluidity, localized storage query state sync, and keyboard-first navigation." },
  { id: 4, slug: "devops-engineer", title: "DevOps Engineer", company: "Discord", location: "Remote - US", type: "Full-Time", salary: "$150k - $190k", time: "1d ago", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Discord_logo.svg/512px-Discord_logo.svg.png", skills: ["Kubernetes", "Rust", "GCP"], description: "Manage highly scalable orchestration nodes routing voice and socket data. Optimize low-latency pipelines and configure secure multi-cloud clusters." },
  { id: 5, slug: "full-stack-developer", title: "Full Stack Developer", company: "Supabase", location: "Remote - EMEA", type: "Full-Time", salary: "$120k - $150k", time: "2d ago", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Supabase_logo.svg/512px-Supabase_logo.svg.png", skills: ["TypeScript", "PostgreSQL", "Elixir"], description: "Develop and scale open-source database client abstractions and serverless edge functions. Support developer onboarding with high-quality tech documentation." },
];

export default function Page() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStack, setActiveStack] = useState<string | null>(null);
  
  // Checkbox filters
  const [typeFullTime, setTypeFullTime] = useState(true);
  const [typeContract, setTypeContract] = useState(false);
  const [typeFreelance, setTypeFreelance] = useState(false);

  const [locRemote, setLocRemote] = useState(true);
  const [locUS, setLocUS] = useState(false);
  const [locEMEA, setLocEMEA] = useState(false);

  // Hydration status
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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

  const fetchLiveJobs = async () => {
    setLoading(true);
    try {
      const response = await api.getJobs({ per_page: 20 });
      console.log("Jobs Tech Theme: Successfully loaded database items:", response);
      
      if (response && response.data && response.data.length > 0) {
        const translated = response.data.map((j: any) => translateJob(j));
        setJobs(translated);
        setFilteredJobs(translated);
        setUseFallback(false);
        setApiError(null);
      } else {
        console.warn("Jobs Tech Theme: Live registry returned empty. Initializing backups.");
        setApiError("Database returned no listings. Ensure recruiting seeds have run.");
        triggerLocalFallbacks();
      }
    } catch (error) {
      console.error("Jobs Tech Theme: Connection failure querying database nodes. Engaging fallback.", error);
      setApiError(error instanceof Error ? error.message : String(error));
      triggerLocalFallbacks();
    } finally {
      setLoading(false);
    }
  };

  const triggerLocalFallbacks = () => {
    setUseFallback(true);
    setJobs(FALLBACK_JOBS);
    setFilteredJobs(FALLBACK_JOBS);
  };

  useEffect(() => {
    fetchLiveJobs();
  }, []);

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        return `/preview/jobs_tech${path}`;
      }
    }
    return path;
  };

  // Perform search and checkbox modifications statefully
  const applyRefinements = (query: string, stack: string | null, ft: boolean, ct: boolean, fl: boolean, remote: boolean, us: boolean, emea: boolean) => {
    let result = [...jobs];

    // Filter by Stack text query
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(j => 
        j.title.toLowerCase().includes(q) || 
        j.company.toLowerCase().includes(q) ||
        j.skills.some((s: string) => s.toLowerCase().includes(q))
      );
    }

    // Filter by tech stack tags
    if (stack) {
      const s = stack.toLowerCase();
      result = result.filter(j => j.skills.some((sk: string) => sk.toLowerCase() === s));
    }

    // Filter by Job Types
    const allowedTypes: string[] = [];
    if (ft) allowedTypes.push('full-time');
    if (ct) allowedTypes.push('contract');
    if (fl) allowedTypes.push('freelance');

    if (allowedTypes.length > 0) {
      result = result.filter(j => allowedTypes.includes(j.type.toLowerCase()));
    }

    // Filter by Locations
    const locQueries: string[] = [];
    if (remote) locQueries.push('remote', 'worldwide');
    if (us) locQueries.push('us', 'canada', 'san francisco');
    if (emea) locQueries.push('emea', 'europe', 'london');

    if (locQueries.length > 0) {
      result = result.filter(j => 
        locQueries.some(l => j.location.toLowerCase().includes(l))
      );
    }

    setFilteredJobs(result);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    applyRefinements(e.target.value, activeStack, typeFullTime, typeContract, typeFreelance, locRemote, locUS, locEMEA);
  };

  const handleStackTagClick = (tag: string) => {
    const nextStack = activeStack === tag ? null : tag;
    setActiveStack(nextStack);
    applyRefinements(searchQuery, nextStack, typeFullTime, typeContract, typeFreelance, locRemote, locUS, locEMEA);
  };

  return (
    <div className="jt-layout-base" style={{ padding: '0 6% 8rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Hero Section */}
      <section className="jt-hero">
        <div className="jt-hero-content">
            <h1 className="jt-hero-title">Find the <span className="jt-text-purple">best tech jobs</span><br/>for your stack.</h1>
            <p className="jt-hero-subtitle" style={{ marginTop: '2rem' }}>Connecting world-class developers with top-tier tech companies. Skip the recruiters and apply directly to the engineering team.</p>
            
            <div className="jt-search-box" style={{ marginTop: '3.5rem' }}>
                <div style={{ padding: '1rem', color: 'var(--jt-text-muted)', fontFamily: 'var(--jt-font-mono)' }}>$</div>
                <input 
                  type="text" 
                  className="jt-search-input" 
                  placeholder="grep -i 'React OR Go OR Rust'" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button 
                  className="jt-btn jt-btn-primary" 
                  style={{ margin: '0.25rem' }}
                  onClick={() => applyRefinements(searchQuery, activeStack, typeFullTime, typeContract, typeFreelance, locRemote, locUS, locEMEA)}
                >
                  Search
                </button>
            </div>
        </div>
      </section>

      {/* Database Offline Diagnostics warning block */}
      {useFallback && apiError && (
        <div style={{
          background: '#090d16',
          border: '1px dashed var(--jt-purple)',
          borderLeft: '4px solid var(--jt-purple)',
          padding: '2.5rem',
          borderRadius: '16px',
          marginBottom: '5rem',
          color: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite'
            }}></span>
            <span className="jt-mono" style={{ color: 'var(--jt-purple)', fontSize: '0.75rem', fontFamily: 'var(--jt-font-mono)', fontWeight: 800 }}>
              DATABASE_OFFLINE_DIAGNOSTICS_TRACE
            </span>
          </div>
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 1rem 0', letterSpacing: '-0.5px' }}>
              Recruiting Registry Offline // Engaging Local Backup
            </h3>
            <p style={{ color: 'var(--jt-text-muted)', fontSize: '0.95rem', margin: '0 0 2rem 0', lineHeight: '1.8' }}>
              A network latency exception was encountered while querying the active recruiting databases. dev_jobs_ has activated localized mock seeds to guarantee uninterrupted professional routing.
            </p>
          </div>
          <div style={{
            background: 'rgba(168, 85, 247, 0.05)',
            padding: '1.5rem',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            color: 'var(--jt-purple)',
            borderLeft: '2px solid var(--jt-purple)',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            Traceback Exception details: {apiError}
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="jt-layout">
          {/* Sidebar Filters */}
          <aside className="jt-sidebar">
              <div style={{ marginBottom: '2.5rem' }}>
                  <h4 className="jt-sidebar-title">Tech Stack</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Go', 'Rust', 'GraphQL'].map(tag => (
                          <span 
                            key={tag} 
                            className="jt-tag"
                            style={{ 
                              background: activeStack === tag ? 'var(--jt-purple)' : 'var(--jt-bg-light)',
                              color: activeStack === tag ? 'white' : 'var(--jt-text-main)',
                              borderColor: activeStack === tag ? 'var(--jt-purple)' : 'var(--jt-border)',
                              cursor: 'pointer',
                              fontWeight: 700
                            }}
                            onClick={() => handleStackTagClick(tag)}
                          >
                            {tag}
                          </span>
                      ))}
                  </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                  <h4 className="jt-sidebar-title">Job Type</h4>
                  <label style={{ display: 'block', color: 'var(--jt-text-muted)', marginBottom: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={typeFullTime} 
                      onChange={(e) => {
                        setTypeFullTime(e.target.checked);
                        applyRefinements(searchQuery, activeStack, e.target.checked, typeContract, typeFreelance, locRemote, locUS, locEMEA);
                      }}
                      style={{ accentColor: 'var(--jt-purple)', marginRight: '0.5rem' }}
                    /> 
                    Full-Time
                  </label>
                  <label style={{ display: 'block', color: 'var(--jt-text-muted)', marginBottom: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={typeContract}
                      onChange={(e) => {
                        setTypeContract(e.target.checked);
                        applyRefinements(searchQuery, activeStack, typeFullTime, e.target.checked, typeFreelance, locRemote, locUS, locEMEA);
                      }}
                      style={{ accentColor: 'var(--jt-purple)', marginRight: '0.5rem' }}
                    /> 
                    Contract
                  </label>
                  <label style={{ display: 'block', color: 'var(--jt-text-muted)', marginBottom: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={typeFreelance}
                      onChange={(e) => {
                        setTypeFreelance(e.target.checked);
                        applyRefinements(searchQuery, activeStack, typeFullTime, typeContract, e.target.checked, locRemote, locUS, locEMEA);
                      }}
                      style={{ accentColor: 'var(--jt-purple)', marginRight: '0.5rem' }}
                    /> 
                    Freelance
                  </label>
              </div>

              <div>
                  <h4 className="jt-sidebar-title">Location</h4>
                  <label style={{ display: 'block', color: 'var(--jt-text-muted)', marginBottom: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={locRemote}
                      onChange={(e) => {
                        setLocRemote(e.target.checked);
                        applyRefinements(searchQuery, activeStack, typeFullTime, typeContract, typeFreelance, e.target.checked, locUS, locEMEA);
                      }}
                      style={{ accentColor: 'var(--jt-purple)', marginRight: '0.5rem' }}
                    /> 
                    Remote Worldwide
                  </label>
                  <label style={{ display: 'block', color: 'var(--jt-text-muted)', marginBottom: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={locUS}
                      onChange={(e) => {
                        setLocUS(e.target.checked);
                        applyRefinements(searchQuery, activeStack, typeFullTime, typeContract, typeFreelance, locRemote, e.target.checked, locEMEA);
                      }}
                      style={{ accentColor: 'var(--jt-purple)', marginRight: '0.5rem' }}
                    /> 
                    Remote US/CA
                  </label>
                  <label style={{ display: 'block', color: 'var(--jt-text-muted)', marginBottom: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={locEMEA}
                      onChange={(e) => {
                        setLocEMEA(e.target.checked);
                        applyRefinements(searchQuery, activeStack, typeFullTime, typeContract, typeFreelance, locRemote, locUS, e.target.checked);
                      }}
                      style={{ accentColor: 'var(--jt-purple)', marginRight: '0.5rem' }}
                    /> 
                    Remote EMEA
                  </label>
              </div>
          </aside>

          {/* Job Listings Column */}
          <main>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--jt-border)', paddingBottom: '1rem' }}>
                  <div style={{ fontFamily: 'var(--jt-font-mono)', color: 'var(--jt-text-muted)' }}>
                    Found <span className="jt-text-purple" style={{ fontWeight: 800 }}>{filteredJobs.length}</span> developer opportunities
                  </div>
                  <select 
                    style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--jt-text-purple)', fontFamily: 'var(--jt-font-mono)', outline: 'none', cursor: 'pointer', fontWeight: 800 }}
                    onChange={(e) => {
                      if (e.target.value === 'Highest Paid') {
                        const sorted = [...filteredJobs].sort((a,b) => {
                          const valA = Number(a.salary.replace(/[^\d]/g, ''));
                          const valB = Number(b.salary.replace(/[^\d]/g, ''));
                          return valB - valA;
                        });
                        setFilteredJobs(sorted);
                      } else {
                        applyRefinements(searchQuery, activeStack, typeFullTime, typeContract, typeFreelance, locRemote, locUS, locEMEA);
                      }
                    }}
                  >
                      <option>Latest</option>
                      <option>Highest Paid</option>
                  </select>
              </div>

              {loading ? (
                /* Shimmer pulsing layout */
                <div className="jt-job-list">
                  {[1, 2, 3].map(i => (
                    <div 
                      key={i} 
                      className="jt-job-card" 
                      style={{ 
                        height: '140px', 
                        opacity: 0.6, 
                        background: 'var(--jt-bg-light)', 
                        animation: 'pulse 1.5s infinite ease-in-out' 
                      }} 
                    />
                  ))}
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="jt-job-list">
                    {filteredJobs.map((job, i) => (
                        <TechJobCard 
                          key={i} 
                          {...job} 
                          onClick={() => router.push(getThemeLink(`/product/${job.slug}`))}
                        />
                    ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', border: '1px dashed var(--jt-border)', borderRadius: '16px', background: 'var(--jt-bg-light)' }}>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--jt-text-main)' }}>No Developer Jobs Found</h4>
                  <p style={{ color: 'var(--jt-text-muted)', fontSize: '0.9rem' }}>Adjust your grep filters or tags to search alternative developer channels.</p>
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <button className="jt-btn jt-btn-outline" onClick={() => fetchLiveJobs()}>./refresh_catalog.sh</button>
              </div>
          </main>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}} />
    </div>
  );
}
