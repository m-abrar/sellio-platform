'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { ChronicleBar, HeritageGrid } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';

export default function Page() {
  const router = useRouter();
  const themeLink = useUnifiedThemeLink();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);

  const heroEyebrow = useThemeContent('hero.eyebrow', 'TRADITION_OF_EXCELLENCE');
  const heroTitle = useThemeContent('hero.title', 'The Heritage of\nDistribution.');
  const heroHighlight = useThemeContent('hero.highlight', 'Heritage');
  const heroDescription = useThemeContent('hero.description', 'A high-fidelity foundational node for multi-vertical commerce. Established on the principles of structural integrity and global reliability.');
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'ENTER THE ARCHIVE');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'READ THE CHRONICLES');

  const collectionEyebrow = useThemeContent('collection.eyebrow', 'LIVE_HERITAGE_REGISTRY');
  const collectionTitle = useThemeContent('collection.title', 'The Catalog Archive.');
  const collectionDescription = useThemeContent('collection.description', 'Live product records preserved inside the Legacy Registry for dignified marketplace discovery.');

  const syncOfflineKicker = useThemeContent('sync.offline_kicker', 'ARCHIVE_OFFLINE');
  const syncOfflineTitle = useThemeContent('sync.offline_title', 'Listings could not be synchronized.');
  const emptyKicker = useThemeContent('empty.kicker', 'EMPTY_ARCHIVE');
  const emptyTitle = useThemeContent('empty.title', 'No live listings are available yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add product records in the backend and this archive will hydrate automatically.');

  const midSectionImage = useThemeMedia('mid_section.image', '/themes/unifieds/classic/1.webp');
  const midSectionEyebrow = useThemeContent('mid_section.eyebrow', 'TIME_HONORED_PRECISION');
  const midSectionTitle = useThemeContent('mid_section.title', 'Structural\nElegance.');
  const midSectionDescription = useThemeContent('mid_section.description', 'The Legacy Node protocol is built on a foundation of reliability. By blending traditional structural integrity with modern distribution logic, we ensure that your high-fidelity assets remain secure and accessible across the global network.');
  const midSectionMetric1Value = useThemeContent('mid_section.metric_1_value', '30yr+');
  const midSectionMetric1Label = useThemeContent('mid_section.metric_1_label', 'CORE_LOGIC_AGE');
  const midSectionMetric2Value = useThemeContent('mid_section.metric_2_value', '100%');
  const midSectionMetric2Label = useThemeContent('mid_section.metric_2_label', 'ASSET_PROVENANCE');

  const ctaTitle = useThemeContent('cta.title', 'Establish Your\nLegacy.');
  const ctaDescription = useThemeContent('cta.description', "Connect your core node to the Legacy Registry and join the world's most trusted high-fidelity distribution network. Institutional authority, guaranteed.");
  const ctaButtonLabel = useThemeContent('cta.button_label', 'CONNECT LEGACY NODE');

  const placeholderImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='720' height='520' viewBox='0 0 720 520'><rect width='100%' height='100%' fill='%23fbfbfb'/><g transform='translate(328,214)' stroke='%23d1d5db' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='2' width='60' height='60' rx='8'/><circle cx='20' cy='20' r='6'/><path d='M58 46L42 30 12 60'/></g><text x='50%' y='61%' dominant-baseline='middle' text-anchor='middle' font-family='Georgia, serif' font-size='13' font-weight='700' letter-spacing='2' fill='%239ca3af'>LEGACY RECORD</text></svg>";

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      try {
        const fetchedProducts = await api.getProducts();
        if (!isMounted) {
          return;
        }

        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        setListingError(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load unified classic listings:', error);
        setListingError(error instanceof Error ? error.message : 'Listings are temporarily unavailable.');
      } finally {
        if (isMounted) {
          setLoadingListings(false);
        }
      }
    }

    loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  const getProductImage = (product: Product) => (
    product.media?.featured_image || product.image_url || placeholderImage
  );

  const formatPrice = (product: Product) => (
    product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : 'Inquire for legacy rate')
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="legacy-hero" aria-labelledby="uc-hero-title">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '3rem' }}>{heroEyebrow}</div>
              <h1 className="uc-heading-xl" id="uc-hero-title">
                {heroTitle.split('\n').map((line, index, lines) => {
                  const parts = heroHighlight ? line.split(new RegExp(`(${heroHighlight})`, 'g')) : [line];
                  return (
                    <React.Fragment key={`${line}-${index}`}>
                      {parts.map((part, pIdx) => 
                        part === heroHighlight ? (
                          <span key={pIdx} className="uc-italic" style={{ color: 'var(--uc-gold)' }}>{part}</span>
                        ) : (
                          part
                        )
                      )}
                      {index < lines.length - 1 ? <br /> : null}
                    </React.Fragment>
                  );
                })}
              </h1>
              <p style={{ maxWidth: '700px', margin: '3rem auto 6rem', fontSize: '1.25rem', color: '#666', lineHeight: 1.8 }}>
                {heroDescription}
              </p>
              <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }} className="uc-hero-buttons">
                  <button className="legacy-btn-primary" id="uc-btn-explore" onClick={() => router.push(themeLink('/explore'))}>
                    {heroPrimaryCtaLabel}
                  </button>
                  <button style={{ 
                      background: 'transparent', 
                      border: '2px solid var(--uc-burgundy)', 
                      padding: '1.5rem 5rem', 
                      fontFamily: 'var(--uc-font-heading)', 
                      fontWeight: 700, 
                      fontSize: '1.1rem', 
                      cursor: 'pointer',
                      color: 'var(--uc-burgundy)',
                      transition: 'all 0.3s ease'
                  }} id="uc-btn-chronicles" onClick={() => router.push(themeLink('/explore'))}>
                      {heroSecondaryCtaLabel}
                  </button>
              </div>
          </div>
      </section>

      {/* Chronicle Bar */}
      <ChronicleBar />

      {/* Heritage Grid Section */}
      <HeritageGrid />

      {/* Live Listings */}
      <section className="uc-listings-section" id="uc-heritage-registry" aria-labelledby="uc-registry-title">
          <div className="uc-listings-header">
              <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '1.5rem' }}>{collectionEyebrow}</div>
              <h2 id="uc-registry-title">{collectionTitle}</h2>
              <p>{collectionDescription}</p>
          </div>

          {loadingListings ? (
              <div className="uc-listings-grid" aria-label="Loading live listings">
                  {[1, 2, 3].map((item) => (
                      <div className="uc-listing-card uc-listing-skeleton" key={item}>
                          <div className="uc-listing-image-wrap" />
                          <div className="uc-listing-body">
                              <span />
                              <strong />
                              <em />
                          </div>
                      </div>
                  ))}
              </div>
          ) : listingError ? (
              <div className="uc-listing-state" role="status">
                  <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '1rem' }}>{syncOfflineKicker}</div>
                  <h3>{syncOfflineTitle}</h3>
                  <p>{listingError}</p>
              </div>
          ) : products.length === 0 ? (
              <div className="uc-listing-state" role="status">
                  <div className="uc-mono" style={{ color: 'var(--uc-gold)', marginBottom: '1rem' }}>{emptyKicker}</div>
                  <h3>{emptyTitle}</h3>
                  <p>{emptyDescription}</p>
              </div>
          ) : (
              <div className="uc-listings-grid">
                  {products.slice(0, 6).map((product) => (
                      <a href={themeLink(`/product/${product.slug}`)} className="uc-listing-card" key={product.id}>
                          <div className="uc-listing-image-wrap">
                              <img src={getProductImage(product)} alt={product.title} />
                          </div>
                          <div className="uc-listing-body">
                              <div className="uc-mono">ARCHIVE_{product.id}</div>
                              <h3>{product.title}</h3>
                              <p>{product.description || 'Verified marketplace record preserved inside the Legacy Registry.'}</p>
                              <div className="uc-listing-meta">
                                  <span>{formatPrice(product)}</span>
                                  <span>View Provenance</span>
                              </div>
                          </div>
                      </a>
                  ))}
              </div>
          )}
      </section>

      {/* Mid-Section: Time-Honored Precision */}
      <section className="uc-precision-grid" aria-labelledby="uc-precision-title">
          <div style={{ position: 'relative' }}>
              <div style={{ height: '700px', background: 'white', border: '1px solid var(--uc-border)', overflow: 'hidden' }}>
                  <img src={midSectionImage} alt="Historical Architecture Provenance" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', width: '200px', height: '200px', borderBottom: '3px solid var(--uc-gold)', borderLeft: '3px solid var(--uc-gold)' }} className="uc-gold-accent-bracket"></div>
          </div>
          <div>
              <span className="uc-mono" style={{ color: 'var(--uc-gold)' }}>{midSectionEyebrow}</span>
              <h2 style={{ fontFamily: 'var(--uc-font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, color: 'var(--uc-burgundy)', marginTop: '2.5rem', marginBottom: '3rem', letterSpacing: '-2px', lineHeight: 1.1 }} id="uc-precision-title">
                {midSectionTitle.split('\n').map((line, index, lines) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {line}
                    {index < lines.length - 1 ? <br /> : null}
                  </React.Fragment>
                ))}
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                {midSectionDescription}
              </p>
              <div style={{ display: 'flex', gap: '5rem' }}>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--uc-font-heading)', color: 'var(--uc-burgundy)' }}>{midSectionMetric1Value}</div>
                      <div className="uc-mono" style={{ color: '#aaa', fontSize: '0.65rem' }}>{midSectionMetric1Label}</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--uc-font-heading)', color: 'var(--uc-burgundy)' }}>{midSectionMetric2Value}</div>
                      <div className="uc-mono" style={{ color: '#aaa', fontSize: '0.65rem' }}>{midSectionMetric2Label}</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '12rem 6%', textAlign: 'center', background: 'var(--uc-cream)' }} aria-labelledby="uc-cta-title">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--uc-font-heading)', fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, color: 'var(--uc-burgundy)', marginBottom: '4rem', letterSpacing: '-3px', lineHeight: 1.1 }} id="uc-cta-title">
                {ctaTitle.split('\n').map((line, index, lines) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {line}
                    {index < lines.length - 1 ? <br /> : null}
                  </React.Fragment>
                ))}
              </h2>
              <p style={{ fontSize: '1.4rem', color: '#666', lineHeight: 1.8, marginBottom: '6rem' }}>
                {ctaDescription}
              </p>
              <button className="legacy-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.35rem' }} id="uc-btn-cta-handshake" onClick={() => router.push(themeLink('/explore'))}>{ctaButtonLabel}</button>
          </div>
      </section>
    </div>
  );
}
