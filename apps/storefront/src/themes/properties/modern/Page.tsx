'use client';

import React, { useEffect, useState } from 'react';
import { StructureGrid, SkylineSyncBar, HeroSearchBar, CatalogRegistryAlert } from './components';
import { scrollToSection } from './utils';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { useModernThemeLink } from './hooks/useModernThemeLink';
import { useDemoFallbackAllowed } from './hooks/useDemoFallbackAllowed';
import { fetchPropertyCatalogPage, resolveCatalogFailure } from './catalog';
import { mapPropertyToStructure, getPropertyFallbackImage } from './property-utils';

export default function Page() {
  const themeLink = useModernThemeLink();
  const allowDemoCatalog = useDemoFallbackAllowed();

  const [structureItems, setStructureItems] = useState<ReturnType<typeof mapPropertyToStructure>[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [propertyError, setPropertyError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [nodeCount, setNodeCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadProperties() {
      const result = await fetchPropertyCatalogPage(1, {}, 6);

      if (!isMounted) return;

      if (result.ok) {
        const items = result.data.slice(0, 6).map(mapPropertyToStructure);
        setStructureItems(items);
        setNodeCount(result.data.length);
        setPropertyError(null);
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError(result.error);
        const resolution = resolveCatalogFailure({}, allowDemoCatalog);
        if (resolution.mode === 'demo') {
          const items = resolution.estates.slice(0, 6).map(mapPropertyToStructure);
          setStructureItems(items);
          setNodeCount(resolution.estates.length);
          setPropertyError(null);
          setUseFallback(true);
        } else {
          setStructureItems([]);
          setNodeCount(0);
          setPropertyError(result.error);
          setUseFallback(false);
        }
      }

      setLoadingProperties(false);
    }

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, [allowDemoCatalog]);

  const heroImage = useThemeMedia(
    'hero.image',
    structureItems[0]?.image || getPropertyFallbackImage(0),
  );

  return (
    <div>
      <section className="urban-hero" id="urban-hero-section">
        <div className="urban-hero-copy">
          <div className="urban-hero-kicker">
            {useThemeContent('hero.kicker', 'Premium urban properties')}
          </div>
          <h1>
            {useThemeContent('hero.title', 'Find your next \nhome.')
              .split('\n')
              .map((line, i, arr) => {
                const highlight = useThemeContent('hero.highlight', 'home');
                const hasHighlight = line.includes(highlight);
                return (
                  <React.Fragment key={i}>
                    {hasHighlight ? (
                      <>
                        {line.split(highlight).map((part, pIdx, pArr) => (
                          <React.Fragment key={pIdx}>
                            {part}
                            {pIdx < pArr.length - 1 && <span>{highlight}</span>}
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
          <p className="urban-hero-description">
            {useThemeContent(
              'hero.description',
              'Browse curated homes, apartments, and commercial listings in leading cities. Compare prices, amenities, and locations in one place.',
            )}
          </p>

          <HeroSearchBar
            placeholder={useThemeContent(
              'hero.search_placeholder',
              'Search by city, neighborhood, or property name...',
            )}
          />

          <div className="urban-hero-actions">
            <a href={themeLink('/explore')} className="urban-btn-primary urban-hero-cta-link">
              {useThemeContent('hero.primary_cta_label', 'Browse properties')}
            </a>
            <button
              type="button"
              className="urban-btn-secondary"
              onClick={() => scrollToSection('urban-structure-grid')}
            >
              {useThemeContent('hero.secondary_cta_label', 'View featured listings')}
            </button>
          </div>
        </div>
        <div className="urban-hero-visual">
          <div className="urban-hero-image-frame">
            <img src={heroImage} alt="High-rise building skyline" className="urban-hero-image" />
          </div>
          <div className="urban-hero-stat-card">
            <div className="urban-hero-stat-value">
              {loadingProperties ? '...' : nodeCount || structureItems.length}
            </div>
            <div className="urban-hero-stat-label">
              {useThemeContent('hero.stat_label', 'Properties listed')}
            </div>
          </div>
        </div>
      </section>

      <SkylineSyncBar nodeCount={nodeCount || structureItems.length} />

      <section className="urban-feature-band" aria-label="Property search advantages">
        {[
          ['Verified pricing', 'Compare rent, sale price, and key listing terms before opening a detail page.'],
          ['Useful shortlists', 'Start with a curated homepage edit, then move into the full archive when ready.'],
          ['Agent-ready details', 'Each property detail page is built around inquiry, booking, and next-step context.'],
        ].map(([title, description]) => (
          <article className="urban-feature-card" key={title}>
            <span className="urban-feature-card__mark" aria-hidden="true" />
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>

      {apiError && useFallback && (
        <div className="pm-home-alert-slot">
          <CatalogRegistryAlert variant="demo" error={apiError} />
        </div>
      )}
      {apiError && !useFallback && (
        <div className="pm-home-alert-slot">
          <CatalogRegistryAlert variant="production" error={apiError} />
        </div>
      )}

      {!(apiError && !useFallback) && (
        <StructureGrid
          items={structureItems}
          loading={loadingProperties}
          error={propertyError}
        />
      )}

      <section className="urban-precision-section" id="urban-precision-section">
        <div className="urban-precision-visual">
          <div className="urban-precision-image-frame">
            <img
              src={useThemeMedia('precision.image', getPropertyFallbackImage(1))}
              alt="Modern architecture detail"
              className="urban-precision-image"
            />
          </div>
          <div className="urban-precision-accent" aria-hidden="true" />
        </div>
        <div className="urban-precision-copy">
          <span className="urban-section-kicker">
            {useThemeContent('precision.kicker', 'Why choose us')}
          </span>
          <h2>
            {useThemeContent('precision.title', 'Trusted \nlistings.')
              .split('\n')
              .map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
          </h2>
          <p>
            {useThemeContent(
              'precision.description',
              'Every listing includes clear pricing, photos, and property details. Our platform helps buyers and renters find the right space faster, with accurate data you can trust.',
            )}
          </p>
          <div className="urban-precision-stats">
            <div>
              <div className="urban-stat-value">
                {useThemeContent('precision.stat_1_value', '100%')}
              </div>
              <div className="urban-stat-label">
                {useThemeContent('precision.stat_1_label', 'Verified listings')}
              </div>
            </div>
            <div>
              <div className="urban-stat-value">
                {useThemeContent('precision.stat_2_value', 'Global')}
              </div>
              <div className="urban-stat-label">
                {useThemeContent('precision.stat_2_label', 'Global coverage')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="urban-final-cta" id="urban-final-cta">
        <div className="urban-final-cta-inner">
          <h2>
            {useThemeContent('cta.title', 'Ready to \nexplore?')
              .split('\n')
              .map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
          </h2>
          <p>
            {useThemeContent(
              'cta.description',
              'Search thousands of properties for sale and rent. Save your favorites and send inquiries to agents or hosts in a few clicks.',
            )}
          </p>
          <a href={themeLink('/explore')} className="urban-btn-primary urban-final-cta-btn urban-hero-cta-link">
            {useThemeContent('cta.button_label', 'Search properties')}
          </a>
          <a href={themeLink('/explore?mode=rental')} className="urban-final-cta-secondary">
            View rentals
          </a>
        </div>
      </section>
    </div>
  );
}
