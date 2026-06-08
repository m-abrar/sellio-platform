'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { PortfolioAssetCard, YieldAnalyticsHUD } from './components';
import { getAdminBaseUrl } from '@/lib/admin-urls';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';

const assetTypes = ['Residential', 'Commercial', 'Industrial', 'Retail', 'Specialty', 'Development', 'Infrastructure', 'Commercial'];
const statusLabels = ['VERIFIED', 'ACTIVE', 'PREMIUM', 'INSTITUTIONAL'];

function getPropertyPrice(property: Property) {
  return property.pricing?.price_formatted || (
    property.base_price ? `$${Number(property.base_price).toLocaleString()}` : 'Price on request'
  );
}

function mapPropertyToAsset(property: Property, index: number) {
  const yieldRate = `${((property.id % 8) + 6 + (index % 3) * 0.5).toFixed(1)}% ARR`;
  const type = property.specs?.property_type || property.specs?.category || assetTypes[index % assetTypes.length];

  return {
    title: property.title,
    yield: yieldRate,
    price: getPropertyPrice(property),
    type: typeof type === 'string' ? type : assetTypes[index % assetTypes.length],
    status: property.is_featured ? 'PREMIUM' : statusLabels[index % statusLabels.length],
    slug: property.slug,
  };
}

export default function Page() {
  const router = useRouter();
  const themeLink = usePropertyThemeLink();
  const adminCreatePropertyUrl = `${getAdminBaseUrl()}/admin/properties/create`;
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [propertyError, setPropertyError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProperties() {
      try {
        const response = await api.getProperties({ per_page: 9 });
        if (!isMounted) {
          return;
        }

        setProperties(Array.isArray(response.data) ? response.data : []);
        setPropertyError(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load properties investment listings:', error);
        setPropertyError(error instanceof Error ? error.message : 'Properties are temporarily unavailable.');
      } finally {
        if (isMounted) {
          setLoadingProperties(false);
        }
      }
    }

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="pi-section">
      {/* Financial Terminal Hero */}
      <section className="pi-hero">
        <div>
          <div className="pi-mono" style={{ marginBottom: '2.5rem' }}>{useThemeContent('hero.kicker', 'PORTFOLIO_SYNC_V8_ACTIVE')}</div>
          <h1 className="pi-heading-xl">
            {useThemeContent('hero.title', 'Capital \nDistribution \nSynchronized.').split('\n').map((line, i, arr) => {
              const highlight = useThemeContent('hero.highlight', 'Synchronized.');
              const hasHighlight = line.includes(highlight);
              return (
                <React.Fragment key={i}>
                  {hasHighlight ? (
                    <>
                      {line.split(highlight).map((part, pIdx, pArr) => (
                        <React.Fragment key={pIdx}>
                          {part}
                          {pIdx < pArr.length - 1 && <span style={{ color: 'var(--pi-emerald)' }}>{highlight}</span>}
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    line
                  )}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </h1>
          <p style={{ marginTop: '4rem', fontSize: '1.25rem', color: 'var(--pi-slate)', lineHeight: 1.8, maxWidth: '600px' }}>
            {useThemeContent('hero.description', 'The global high-fidelity terminal for institutional real estate investment. Deploy capital across verified asset nodes with performance-driven precision.')}
          </p>
          <div style={{ marginTop: '6rem', display: 'flex', gap: '3rem' }}>
            <button className="pi-btn-primary">{useThemeContent('hero.primary_cta_label', 'Execute_Investment')}</button>
            <button style={{ background: 'transparent', border: '2px solid var(--pi-midnight)', color: 'var(--pi-midnight)', padding: '1.5rem 4rem', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>{useThemeContent('hero.secondary_cta_label', 'View_Reports')}</button>
          </div>
        </div>
        <div className="pi-hero-terminal">
          <div className="pi-mono" style={{ marginBottom: '3rem', borderBottom: '1px solid var(--pi-border)', paddingBottom: '1.5rem' }}>{useThemeContent('terminal.metrics_label', 'NETWORK_PERFORMANCE_METRICS')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <YieldAnalyticsHUD label={useThemeContent('hud.total_volume_label', 'TOTAL_NETWORK_VOLUME')} value={useThemeContent('hud.total_volume_value', '$4.2B+')} color="var(--pi-emerald)" />
            <YieldAnalyticsHUD label={useThemeContent('hud.avg_yield_label', 'AVERAGE_YIELD_ARR')} value={useThemeContent('hud.avg_yield_value', '8.4%')} />
            <YieldAnalyticsHUD label={useThemeContent('hud.liquidity_label', 'LIQUIDITY_INDEX')} value={useThemeContent('hud.liquidity_value', '0.82')} />
            <YieldAnalyticsHUD label={useThemeContent('hud.volatility_label', 'VOLATILITY_HEDGE')} value={useThemeContent('hud.volatility_value', 'ACTIVE')} color="var(--pi-gold)" />
          </div>
        </div>
      </section>

      {/* Logic Bar */}
      <div style={{ padding: '3rem 6%', background: 'white', borderBottom: '1px solid var(--pi-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {useThemeContent('logic.items', 'MARKET_STATUS: STABLE|NODAL_VERIFICATION: 100%|INSTITUTIONAL_AUTH: VERIFIED|SETTLEMENT: INSTANT').split('|').map(logic => (
              <div key={logic} className="pi-mono" style={{ fontSize: '0.65rem' }}>{logic}</div>
          ))}
      </div>

      {/* Asset Performance Grid */}
      <section style={{ marginTop: '10rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="pi-mono" style={{ marginBottom: '1.5rem' }}>{useThemeContent('grid.kicker', 'YIELD_REGISTRY')}</div>
                  <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-2px', textTransform: 'uppercase' }}>
                      {useThemeContent('grid.title', 'Asset \nPerformance.').split('\n').map((line, i, arr) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                  </h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--pi-slate)', lineHeight: 1.8 }}>
                  {useThemeContent('grid.description', 'Our unified protocol synchronizes real-time performance metadata from residential, commercial, and industrial yield nodes.')}
              </div>
          </div>

          <div className="pi-asset-grid">
            {loadingProperties ? (
              [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <div className="pi-asset-card prop-listing-skeleton" key={item}>
                  <div className="prop-skeleton-line prop-skeleton-line-title" />
                  <div className="prop-skeleton-line" />
                  <div className="prop-skeleton-line prop-skeleton-line-short" />
                </div>
              ))
            ) : propertyError ? (
              <div className="prop-listing-state">
                <div className="prop-listing-kicker">{useThemeContent('offline.kicker', 'Property Sync Offline')}</div>
                <h3>{useThemeContent('offline.title', 'Asset performance registry could not be loaded.')}</h3>
                <p>{propertyError}</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="prop-listing-state">
                <div className="prop-listing-kicker">{useThemeContent('empty.kicker', 'Empty Property Registry')}</div>
                <h3>{useThemeContent('empty.title', 'No live properties are published yet.')}</h3>
                <p>{useThemeContent('empty.description', 'Add property records in the backend and this investment grid will hydrate automatically.')}</p>
              </div>
            ) : (
              properties.slice(0, 9).map((property, index) => {
                const asset = mapPropertyToAsset(property, index);
                return (
                  <a className="pi-asset-link" href={themeLink(`/product/${asset.slug}`)} key={property.id}>
                    <PortfolioAssetCard {...asset} />
                  </a>
                );
              })
            )}
          </div>
      </section>

      {/* Institutional CTA */}
      <section style={{ marginTop: '15rem', padding: '12rem 8%', background: 'var(--pi-midnight)', color: 'white', borderRadius: '4px', textAlign: 'center' }}>
          <div className="pi-mono" style={{ color: 'var(--pi-emerald)', marginBottom: '3rem' }}>{useThemeContent('cta.kicker', 'INSTITUTIONAL_GRADE_LOGIC')}</div>
          <h2 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-4px', textTransform: 'uppercase', marginBottom: '4rem', lineHeight: 1 }}>
              {useThemeContent('cta.title', 'Scale Your \nPortfolio Yield.').split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
          </h2>
          <p style={{ maxWidth: '800px', margin: '0 auto 8rem', opacity: 0.5, fontSize: '1.25rem', lineHeight: 1.8 }}>
              {useThemeContent('cta.description', 'Our investment nodes are built on a foundation of verified financial metadata. Connect your capital node to the Sellio network for high-fidelity asset distribution.')}
          </p>
          <button className="pi-btn-primary" style={{ background: 'var(--pi-emerald)', padding: '2.5rem 8rem', fontSize: '1.25rem' }}>
              {useThemeContent('cta.button_label', 'Connect_Capital_Node')}
          </button>
      </section>

      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
