'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TechJobCard } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import { fetchJobsHome, resolveJobsFailure } from '@/themes/jobs/shared/catalog';
import {
  translateJobListingToTechJob,
  type TechJobCardData,
} from '@/themes/jobs/shared/job-utils';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

type TechJob = TechJobCardData;

export default function Page() {
  const router = useRouter();
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroTitle = useThemeContent('hero.title', 'Find the best tech jobs\nfor your stack.');
  const heroHighlight = useThemeContent('hero.highlight', 'best tech jobs');
  const heroDescription = useThemeContent(
    'hero.description',
    'Connecting world-class developers with top-tier tech companies. Skip the recruiters and apply directly to the engineering team.',
  );
  const searchPlaceholder = useThemeContent('search.placeholder', "grep -i 'React OR Go OR Rust'");
  const searchButtonLabel = useThemeContent('search.button_label', 'Search');
  const stackTitle = useThemeContent('filters.stack_title', 'Tech Stack');
  const typeTitle = useThemeContent('filters.type_title', 'Job Type');
  const locationTitle = useThemeContent('filters.location_title', 'Location');
  const collectionCountLabel = useThemeContent('collection.count_label', 'developer opportunities');
  const emptyTitle = useThemeContent('empty.title', 'No Developer Jobs Found');
  const emptyDescription = useThemeContent('empty.description', 'Try different filters or search terms to find relevant roles.');
  const exploreAllLabel = useThemeContent('collection.refresh_label', 'Browse all roles');

  const [jobs, setJobs] = useState<TechJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<TechJob[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStack, setActiveStack] = useState<string | null>(null);
  const [typeFullTime, setTypeFullTime] = useState(true);
  const [typeContract, setTypeContract] = useState(false);
  const [typeFreelance, setTypeFreelance] = useState(false);
  const [locRemote, setLocRemote] = useState(true);
  const [locUS, setLocUS] = useState(false);
  const [locEMEA, setLocEMEA] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const renderHighlightedTitle = (title: string, highlight: string) =>
    title.split('\n').map((line, lineIndex) => {
      const parts = highlight ? line.split(highlight) : [line];

      return (
        <React.Fragment key={`${line}-${lineIndex}`}>
          {parts.map((part, partIndex) => (
            <React.Fragment key={`${part}-${partIndex}`}>
              {part}
              {partIndex < parts.length - 1 ? <span className="jt-text-purple">{highlight}</span> : null}
            </React.Fragment>
          ))}
          {lineIndex < title.split('\n').length - 1 ? <br /> : null}
        </React.Fragment>
      );
    });

  const applyRefinements = (
    query: string,
    stack: string | null,
    ft: boolean,
    ct: boolean,
    fl: boolean,
    remote: boolean,
    us: boolean,
    emea: boolean,
    source: TechJob[] = jobs,
  ) => {
    let result = [...source];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }

    if (stack) {
      const s = stack.toLowerCase();
      result = result.filter((j) => j.skills.some((sk) => sk.toLowerCase() === s));
    }

    const allowedTypes: string[] = [];
    if (ft) allowedTypes.push('full-time');
    if (ct) allowedTypes.push('contract');
    if (fl) allowedTypes.push('freelance');

    if (allowedTypes.length > 0) {
      result = result.filter((j) => allowedTypes.includes(j.type.toLowerCase()));
    }

    const locQueries: string[] = [];
    if (remote) locQueries.push('remote', 'worldwide');
    if (us) locQueries.push('us', 'canada', 'san francisco');
    if (emea) locQueries.push('emea', 'europe', 'london');

    if (locQueries.length > 0) {
      result = result.filter((j) => locQueries.some((l) => j.location.toLowerCase().includes(l)));
    }

    setFilteredJobs(result);
  };

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      const result = await fetchJobsHome(20);

      if (result.ok && result.response.data?.length) {
        const translated = result.response.data.map(translateJobListingToTechJob);
        setJobs(translated);
        applyRefinements(searchQuery, activeStack, typeFullTime, typeContract, typeFreelance, locRemote, locUS, locEMEA, translated);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No jobs returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobsFailure(allowDemo, 'tech');

        if (resolution.mode === 'demo') {
          const translated = resolution.jobs.map(translateJobListingToTechJob);
          setJobs(translated);
          applyRefinements(searchQuery, activeStack, typeFullTime, typeContract, typeFreelance, locRemote, locUS, locEMEA, translated);
          setUseFallback(true);
        } else {
          setJobs([]);
          setFilteredJobs([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowDemo]);

  const goToExplore = (query?: string) => {
    const path = query ? `/explore?q=${encodeURIComponent(query)}` : '/explore';
    router.push(themeLink(path));
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
      <section className="jt-hero">
        <div className="jt-hero-content">
            <h1 className="jt-hero-title">{renderHighlightedTitle(heroTitle, heroHighlight)}</h1>
            <p className="jt-hero-subtitle" style={{ marginTop: '2rem' }}>{heroDescription}</p>
            
            <div className="jt-search-box" style={{ marginTop: '3.5rem' }}>
                <div style={{ padding: '1rem', color: 'var(--jt-text-muted)', fontFamily: 'var(--jt-font-mono)' }}>$</div>
                <input 
                  type="text" 
                  className="jt-search-input" 
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') goToExplore(searchQuery);
                  }}
                />
                <button 
                  type="button"
                  className="jt-btn jt-btn-primary" 
                  style={{ margin: '0.25rem' }}
                  onClick={() => goToExplore(searchQuery)}
                >
                  {searchButtonLabel}
                </button>
            </div>
        </div>
      </section>

      {apiError && useFallback && (
        <div className="jt-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="jt" />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="jt-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="jt" />
        </div>
      )}

      <div className="jt-layout">
          <aside className="jt-sidebar">
              <div style={{ marginBottom: '2.5rem' }}>
                  <h4 className="jt-sidebar-title">{stackTitle}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Go', 'Rust', 'GraphQL'].map((tag) => (
                          <span 
                            key={tag} 
                            className="jt-tag"
                            style={{ 
                              background: activeStack === tag ? 'var(--jt-purple)' : 'var(--jt-bg-light)',
                              color: activeStack === tag ? 'white' : 'var(--jt-text-main)',
                              borderColor: activeStack === tag ? 'var(--jt-purple)' : 'var(--jt-border)',
                              cursor: 'pointer',
                              fontWeight: 700,
                            }}
                            onClick={() => handleStackTagClick(tag)}
                          >
                            {tag}
                          </span>
                      ))}
                  </div>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                  <h4 className="jt-sidebar-title">{typeTitle}</h4>
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
                  <h4 className="jt-sidebar-title">{locationTitle}</h4>
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

          <main>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--jt-border)', paddingBottom: '1rem' }}>
                  <div style={{ fontFamily: 'var(--jt-font-mono)', color: 'var(--jt-text-muted)' }}>
                    Found <span className="jt-text-purple" style={{ fontWeight: 800 }}>{filteredJobs.length}</span> {collectionCountLabel}
                  </div>
                  <select 
                    style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--jt-text-purple)', fontFamily: 'var(--jt-font-mono)', outline: 'none', cursor: 'pointer', fontWeight: 800 }}
                    onChange={(e) => {
                      if (e.target.value === 'Highest Paid') {
                        const sorted = [...filteredJobs].sort((a, b) => {
                          const valA = Number(a.salary.replace(/[^\d]/g, ''));
                          const valB = Number(b.salary.replace(/[^\d]/g, ''));
                          return valB - valA;
                        });
                        setFilteredJobs(sorted);
                      } else {
                        applyRefinements(searchQuery, activeStack, typeFullTime, typeContract, typeFreelance, locRemote, locUS, locEMEA);
                      }
                    }}
                    defaultValue="Latest"
                  >
                      <option>Latest</option>
                      <option>Highest Paid</option>
                  </select>
              </div>

              {loading ? (
                <div className="jt-job-list">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="jt-job-card" 
                      style={{ height: '140px', opacity: 0.6, background: 'var(--jt-bg-light)', animation: 'pulse 1.5s infinite ease-in-out' }} 
                    />
                  ))}
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="jt-job-list">
                    {filteredJobs.map((job) => (
                        <TechJobCard 
                          key={job.slug} 
                          {...job} 
                          onClick={() => router.push(themeLink(`/product/${job.slug}`))}
                        />
                    ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '6rem 2rem', border: '1px dashed var(--jt-border)', borderRadius: '16px', background: 'var(--jt-bg-light)' }}>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--jt-text-main)' }}>{emptyTitle}</h4>
                  <p style={{ color: 'var(--jt-text-muted)', fontSize: '0.9rem' }}>{emptyDescription}</p>
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <button type="button" className="jt-btn jt-btn-outline" onClick={() => goToExplore()}>{exploreAllLabel}</button>
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
