'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@/types';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { fetchAllVerticals, VERTICALS, type ExploreListing, type Vertical } from '@/themes/unifieds/shared/multiVertical';

export default function Page() {
  const [listings, setListings] = useState<ExploreListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [verticalTotals, setVerticalTotals] = useState<Partial<Record<Vertical, number>>>({});
  const [loading, setLoading] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const themeLink = useUnifiedThemeLink();
  const router = useRouter();

  const heroEyebrow = useThemeContent('hero.eyebrow', 'One marketplace, every category');
  const heroTitle = useThemeContent('hero.title', 'Find it, sell it,\nwithout the clutter.');
  const heroHighlight = useThemeContent('hero.highlight', 'without the clutter.');
  const heroDescription = useThemeContent('hero.description', 'Browse properties, autos, jobs, services, events, and classifieds side by side, or list your own in minutes — no noise, no distractions.');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'Explore everything');

  const highlight1Title = useThemeContent('highlight.1_title', 'Search less, find faster');
  const highlight1Description = useThemeContent('highlight.1_description', 'Every category lives in one searchable feed, so you stop juggling tabs and start finding what you need.');
  const highlight2Title = useThemeContent('highlight.2_title', 'Clear pricing, no surprises');
  const highlight2Description = useThemeContent('highlight.2_description', 'Prices, availability, and seller details are front and center on every listing — what you see is what you get.');
  const highlight3Title = useThemeContent('highlight.3_title', 'List in minutes');
  const highlight3Description = useThemeContent('highlight.3_description', 'Post a product, property, job, or service in a few steps and reach buyers across the whole marketplace.');

  const collectionTitle = useThemeContent('collection.title', 'Live right now');
  const collectionDescription = useThemeContent('collection.description', 'A snapshot of what buyers are looking at across the marketplace today.');

  const categoriesTitle = useThemeContent('categories.title', 'Shop by category');
  const categoriesDescription = useThemeContent('categories.description', 'Jump straight to the listings that matter to you.');

  const quoteText = useThemeContent('quote.text', '"I listed my apartment and a job opening in the same afternoon — both got responses within a day."');
  const quoteAuthor = useThemeContent('quote.author', '— Verified seller');

  const ctaTitle = useThemeContent('cta.title', 'Ready to buy or sell?');
  const ctaDescription = useThemeContent('cta.description', 'Create your first listing or browse what is already available.');
  const ctaButtonLabel = useThemeContent('cta.button_label', 'Get started');

  useEffect(() => {
    let isMounted = true;

    async function loadListings() {
      setLoading(true);
      const result = await fetchAllVerticals({ per_page: 1 });

      if (!isMounted) {
        return;
      }

      if (result.listings.length > 0 || result.failedVerticals.length < VERTICALS.length) {
        setListings(result.listings.slice(0, 6));
        setInventoryTotal(result.total || result.listings.length);
        setCategories(result.categories);
        setVerticalTotals(result.totals || {});
        setListingError(null);
      } else {
        setListings([]);
        setCategories([]);
        setInventoryTotal(null);
        setListingError('Listings are temporarily unavailable.');
      }

      setLoading(false);
    }

    loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  const liveStats = useMemo(
    () => ({
      inventory: inventoryTotal ?? listings.length,
      categories: categories.length,
      verticals: VERTICALS.length,
    }),
    [categories.length, inventoryTotal, listings.length],
  );

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    router.push(themeLink(q ? `/explore?search=${encodeURIComponent(q)}` : '/explore'));
  };

  const VERTICAL_ICONS: Record<string, React.ReactNode> = {
    products: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    properties: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    autos: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    services: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    jobs: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    events: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    classifieds: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  };

  return (
    <div>
      {/* Hero Section */}
      <header className="silent-hero" aria-labelledby="usm-hero-title">
        <div>
          <span className="usm-mono" style={{ color: 'var(--usm-primary)', marginBottom: '2.5rem', display: 'inline-block', fontWeight: 600 }}>{heroEyebrow}</span>
          <h1 className="usm-heading-xl" id="usm-hero-title" style={{ fontFamily: 'var(--usm-font-heading)', fontWeight: 700, margin: '1rem 0 2rem' }}>
            {heroTitle.split('\n').map((line, index, lines) => {
              const parts = heroHighlight ? line.split(new RegExp(`(${heroHighlight})`, 'g')) : [line];
              return (
                <React.Fragment key={`${line}-${index}`}>
                  {parts.map((part, pIdx) =>
                    part === heroHighlight ? (
                      <span key={pIdx}>{part}</span>
                    ) : (
                      part
                    )
                  )}
                  {index < lines.length - 1 ? <br /> : null}
                </React.Fragment>
              );
            })}
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto 4rem', fontSize: '1.2rem', color: '#666', lineHeight: 1.8, fontWeight: 300 }}>
            {heroDescription}
          </p>
          <form className="usm-hero-search" onSubmit={handleHeroSearch} style={{ marginBottom: '1.5rem' }}>
            <input
              type="search"
              className="usm-hero-search-input"
              placeholder="Search listings — properties, jobs, vehicles, services..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="Search marketplace"
            />
            <button type="submit" className="silent-btn-primary" style={{ flexShrink: 0, padding: '0.75rem 1.75rem', fontSize: '0.82rem', letterSpacing: '1.5px' }}>
              Search
            </button>
          </form>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            <a
              href={themeLink('/explore')}
              style={{ color: '#888', fontSize: '0.9rem', fontWeight: 400, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              {heroSecondaryCtaLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      </header>

      {/* Live marketplace metrics */}
      <section style={{ padding: '4rem 6% 0' }} aria-label="Catalog metrics">
        <div className="usm-stats-row">
          <div className="usm-stat-cell">
            <div className="usm-stat-value">{liveStats.inventory.toLocaleString()}</div>
            <div className="usm-stat-unit">Live listings</div>
          </div>
          <div className="usm-stat-cell">
            <div className="usm-stat-value">{liveStats.categories.toLocaleString()}</div>
            <div className="usm-stat-unit">Active categories</div>
          </div>
          <div className="usm-stat-cell">
            <div className="usm-stat-value">{liveStats.verticals.toLocaleString()}</div>
            <div className="usm-stat-unit">Marketplace verticals</div>
          </div>
        </div>
      </section>

      {/* Trust & Precision Highlights */}
      <section style={{ padding: '6rem 6% 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
          <div className="usm-feature-card">
            <div className="usm-feature-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h4 style={{ fontFamily: 'var(--usm-font-heading)', fontWeight: 600, fontSize: '1.15rem', marginBottom: '0.75rem', marginTop: 0 }}>{highlight1Title}</h4>
            <p style={{ color: '#666', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{highlight1Description}</p>
          </div>

          <div className="usm-feature-card">
            <div className="usm-feature-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h4 style={{ fontFamily: 'var(--usm-font-heading)', fontWeight: 600, fontSize: '1.15rem', marginBottom: '0.75rem', marginTop: 0 }}>{highlight2Title}</h4>
            <p style={{ color: '#666', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{highlight2Description}</p>
          </div>

          <div className="usm-feature-card">
            <div className="usm-feature-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h4 style={{ fontFamily: 'var(--usm-font-heading)', fontWeight: 600, fontSize: '1.15rem', marginBottom: '0.75rem', marginTop: 0 }}>{highlight3Title}</h4>
            <p style={{ color: '#666', fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{highlight3Description}</p>
          </div>
        </div>
      </section>

      {/* Curated Highlights (Live multi-vertical listings) */}
      <section id="usm-curated-section" style={{ padding: '6rem 6%' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 500, color: 'var(--usm-ink)', marginBottom: '1rem' }}>{collectionTitle}</h2>
          <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: 300, maxWidth: '600px', margin: '0 auto' }}>{collectionDescription}</p>
        </div>

        <div className="usm-listings-grid">
          {loading ? (
            // Skeleton Loader
            [1, 2, 3].map((n) => (
              <div key={n} className="usm-listing-card" style={{ opacity: 0.6 }}>
                <div className="usm-card-img-wrap" style={{ background: '#eee' }}></div>
                <div className="usm-card-body">
                  <div style={{ height: '12px', background: '#ddd', width: '30%', borderRadius: '4px' }}></div>
                  <div style={{ height: '20px', background: '#ddd', width: '80%', borderRadius: '4px', marginTop: '10px' }}></div>
                  <div style={{ height: '16px', background: '#ddd', width: '40%', borderRadius: '4px', marginTop: '10px' }}></div>
                </div>
              </div>
            ))
          ) : listingError ? (
            <div className="usm-listing-state" role="status">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem' }}>Listings could not be loaded.</h3>
              <p style={{ color: '#888', fontWeight: 300 }}>Check your API connection and confirm listings are published in the admin panel.</p>
            </div>
          ) : listings.length > 0 ? (
            listings.map((listing) => (
              <a href={themeLink(listing.href)} key={listing.id} className="usm-listing-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="usm-card-img-wrap">
                  <img src={listing.image} className="usm-card-img" alt={listing.title} loading="lazy" />
                  <span className="usm-card-vertical-badge">{listing.vertical}</span>
                </div>
                <div className="usm-card-body">
                  <span className="usm-card-category">{listing.category}</span>
                  <h3 className="usm-card-title">{listing.title}</h3>
                  <div className="usm-card-price">{listing.price}</div>
                </div>
              </a>
            ))
          ) : (
            <div className="usm-listing-state" role="status">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem' }}>No live listings are available yet.</h3>
              <p style={{ color: '#888', fontWeight: 300 }}>Add listings in the admin panel and they will appear here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Shop by category */}
      <section id="usm-explore-section" style={{ padding: '6rem 6%', background: 'var(--usm-ghost)', borderTop: '1px solid var(--usm-border)', borderBottom: '1px solid var(--usm-border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 500, color: 'var(--usm-ink)', marginBottom: '1rem' }}>{categoriesTitle}</h2>
          <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: 300, maxWidth: '600px', margin: '0 auto' }}>{categoriesDescription}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', justifyContent: 'center' }}>
          {VERTICALS.map((vertical) => {
            const count = verticalTotals[vertical.key as Vertical];
            return (
              <a href={themeLink(`/explore?vertical=${vertical.key}`)} key={vertical.key} className="usm-category-card">
                <div className="usm-vertical-icon">{VERTICAL_ICONS[vertical.key]}</div>
                <h5 className="usm-category-title">{vertical.label}</h5>
                {count != null ? (
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--usm-primary)' }}>
                    {count.toLocaleString()} listings
                  </span>
                ) : (
                  <p style={{ color: '#888', fontWeight: 300, fontSize: '0.85rem', margin: 0 }}>{vertical.description}</p>
                )}
              </a>
            );
          })}
        </div>
      </section>

      {/* Mid-Section Testimonial */}
      <section style={{ padding: '10rem 6% 8rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span style={{ fontSize: '3rem', color: 'var(--usm-primary)', opacity: 0.3, display: 'block', lineHeight: 1, fontFamily: 'serif', marginBottom: '2rem' }}>“</span>
          <h3 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, lineHeight: 1.4, color: 'var(--usm-ink)', marginBottom: '2.5rem', fontStyle: 'italic' }}>
            {quoteText.split('\n').map((line, index, lines) => (
              <React.Fragment key={`${line}-${index}`}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h3>
          <p style={{ fontSize: '1.1rem', color: '#666', fontWeight: 400 }}>{quoteAuthor}</p>
        </div>
      </section>

      {/* Action CTA Panel */}
      <section style={{ padding: '4rem 6% 6rem' }}>
        <div style={{
          background: '#fff',
          border: '1px solid var(--usm-border)',
          borderRadius: '16px',
          padding: '4rem 5%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.01)'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--usm-ink)', marginBottom: '0.5rem' }}>
              {ctaTitle}
            </h3>
            <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: 300 }}>{ctaDescription}</p>
          </div>
          <div>
            <a href={themeLink('/explore')} className="silent-btn-primary" style={{ textDecoration: 'none' }}>{ctaButtonLabel}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
