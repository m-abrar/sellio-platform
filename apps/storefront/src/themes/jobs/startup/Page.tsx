'use client';

import React, { useEffect, useState } from 'react';
import type { JobListing } from '@sellio/types';
import { OpportunityGrid, MissionControlSection } from './components';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/jobs/shared/CatalogSyncAlert';
import { fetchJobsHome, resolveJobsFailure } from '@/themes/jobs/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/jobs/shared/useDemoFallbackAllowed';
import { useJobsThemeLink } from '@/themes/jobs/shared/useJobsThemeLink';

export default function Page() {
  const themeLink = useJobsThemeLink();
  const allowDemo = useDemoFallbackAllowed();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const heroEyebrow = useThemeContent('hero.eyebrow', 'Startup Jobs');
  const heroTitle = useThemeContent('hero.title', 'Join the\nHypergrowth.');
  const heroDescription = useThemeContent(
    'hero.description',
    "Connect with the world's most innovative startups. Discover venture-backed opportunities, equity roles, and mission-driven careers."
  );
  const heroPrimaryCta = useThemeContent('hero.primary_cta_label', 'Browse Jobs');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label', 'View Opportunities');
  const trustLeft = useThemeContent('trust.left_text', 'Funded Startups');
  const trustNewRoles = useThemeContent('trust.new_roles_text', 'New Roles Daily');
  const trustRight = useThemeContent('trust.right_text', 'Equity Verified');
  const trustNetwork = useThemeContent('trust.network_text', 'Top-Rated Network');
  const statsStartupsValue = useThemeContent('stats.startups_value', '450+');
  const statsStartupsLabel = useThemeContent('stats.startups_label', 'Verified Startups');
  const statsEquityValue = useThemeContent('stats.equity_value', '$1.2B+');
  const statsEquityLabel = useThemeContent('stats.equity_label', 'Total Equity');
  const statsConnectionsValue = useThemeContent('stats.connections_value', '12k+');
  const statsConnectionsLabel = useThemeContent('stats.connections_label', 'Connections Made');
  const ctaTitle = useThemeContent('cta.title', 'Accelerate\nYour Future.');
  const ctaDescription = useThemeContent(
    'cta.description',
    'Explore venture-backed roles, equity opportunities, and mission-driven careers across top startups.'
  );
  const ctaButtonLabel = useThemeContent('cta.button_label', 'Browse Opportunities');

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      const result = await fetchJobsHome(6);

      if (result.ok && result.response.data) {
        setJobs(result.response.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        const errorMsg = result.ok ? 'No jobs returned from API.' : result.error;
        setApiError(errorMsg);
        const resolution = resolveJobsFailure(allowDemo, 'startup');

        if (resolution.mode === 'demo') {
          setJobs(resolution.jobs);
          setUseFallback(true);
        } else {
          setJobs([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadJobs();
  }, [allowDemo]);

  return (
    <div>
      <section className="growth-hero">
          <div className="growth-hero-glow"></div>
          <div className="growth-hero-eyebrow">{heroEyebrow}</div>
          <h1>
            {heroTitle.split('\n').map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br />}
                {index === heroTitle.split('\n').length - 1 ? <span>{line}</span> : line}
              </React.Fragment>
            ))}
          </h1>
          <p className="growth-hero-description">
              {heroDescription}
          </p>
          <div className="growth-hero-actions">
              <a href={themeLink('/explore')} className="growth-btn-primary">
                {heroPrimaryCta}
              </a>
              <a href={themeLink('/explore?workplace=remote')} className="growth-btn-outline">
                {heroSecondaryCta}
              </a>
          </div>
      </section>

      <section className="growth-trust-band">
          <span>{trustLeft}</span>
          <span>{trustNewRoles}</span>
          <span>{trustRight}</span>
          <span>{trustNetwork}</span>
      </section>

      <section className="growth-stats-row">
          <div className="growth-stat-item">
              <div className="growth-stat-value">{statsStartupsValue}</div>
              <div className="growth-stat-label">{statsStartupsLabel}</div>
          </div>
          <div className="growth-stat-item">
              <div className="growth-stat-value">{statsEquityValue}</div>
              <div className="growth-stat-label">{statsEquityLabel}</div>
          </div>
          <div className="growth-stat-item">
              <div className="growth-stat-value">{statsConnectionsValue}</div>
              <div className="growth-stat-label">{statsConnectionsLabel}</div>
          </div>
      </section>

      {apiError && useFallback && (
        <div style={{ padding: '0 6%' }} className="gr-alert-slot">
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="gr" />
        </div>
      )}
      {apiError && !useFallback && (
        <div style={{ padding: '0 6%' }} className="gr-alert-slot">
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="gr" />
        </div>
      )}

      <OpportunityGrid jobs={jobs} loading={loading} />

      <MissionControlSection />

      <section className="growth-cta-section">
          <div className="growth-cta-glow" aria-hidden="true"></div>
          <h2 className="growth-cta-heading">
            {ctaTitle.split('\n').map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {index > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </h2>
          <p className="growth-cta-description">
              {ctaDescription}
          </p>
          <a href={themeLink('/explore')} className="growth-btn-primary growth-cta-btn">
            {ctaButtonLabel}
          </a>
      </section>
    </div>
  );
}
