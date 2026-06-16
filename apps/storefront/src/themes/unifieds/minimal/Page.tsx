'use client';
import React, { useEffect, useMemo, useState } from 'react';
import type { Category } from '@sellio/types';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { useUnifiedThemeLink } from '@/themes/unifieds/shared/useUnifiedThemeLink';
import { fetchAllVerticals, VERTICALS, type ExploreListing } from '@/themes/unifieds/shared/multiVertical';

export default function Page() {
  const [listings, setListings] = useState<ExploreListing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventoryTotal, setInventoryTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);
  const themeLink = useUnifiedThemeLink();

  const heroEyebrow = useThemeContent('hero.eyebrow', 'One marketplace, every category');
  const heroTitle = useThemeContent('hero.title', 'Find it, sell it,\nwithout the clutter.');
  const heroHighlight = useThemeContent('hero.highlight', 'without the clutter.');
  const heroDescription = useThemeContent('hero.description', 'Browse properties, autos, jobs, services, events, and classifieds side by side, or list your own in minutes — no noise, no distractions.');
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'Browse listings');
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

  return (
    <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
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
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <button
              className="silent-btn-primary"
              onClick={() => document.getElementById('usm-curated-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {heroPrimaryCtaLabel}
            </button>
            <a
              href={themeLink('/explore')}
              className="silent-btn-primary"
              style={{ backgroundColor: 'transparent', border: '1px solid var(--usm-border)', color: 'var(--usm-ink)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {heroSecondaryCtaLabel}
            </a>
          </div>
        </div>
      </header>

      {/* Live marketplace metrics */}
      <section style={{ padding: '4rem 6% 0' }} aria-label="Catalog metrics">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--usm-font-heading)', fontSize: '2.25rem', fontWeight: 600, color: 'var(--usm-ink)' }}>{liveStats.inventory.toLocaleString()}</div>
            <div className="usm-mono" style={{ color: '#888' }}>Live listings</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--usm-font-heading)', fontSize: '2.25rem', fontWeight: 600, color: 'var(--usm-ink)' }}>{liveStats.categories.toLocaleString()}</div>
            <div className="usm-mono" style={{ color: '#888' }}>Active categories</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--usm-font-heading)', fontSize: '2.25rem', fontWeight: 600, color: 'var(--usm-ink)' }}>{liveStats.verticals.toLocaleString()}</div>
            <div className="usm-mono" style={{ color: '#888' }}>Marketplace verticals</div>
          </div>
        </div>
      </section>

      {/* Trust & Precision Highlights */}
      <section style={{ padding: '6rem 6% 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
          <div style={{ padding: '2rem', border: '1px solid var(--usm-border)', borderRadius: '12px', background: '#fff' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <svg fill="none" stroke="var(--usm-primary)" strokeWidth="1.5" viewBox="0 0 24 24" width="30" height="30">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m0 15v2.25m6.75-12h-2.25m-9 0H3m2.586-2.586l1.591 1.591m10.606 10.606l1.591 1.591M18.364 5.636l-1.591 1.591m-10.606 10.606l-1.591 1.591" />
              </svg>
            </div>
            <h4 style={{ fontFamily: 'var(--usm-font-heading)', fontWeight: 600, fontSize: '1.2rem', marginBottom: '1rem' }}>{highlight1Title}</h4>
            <p style={{ color: '#666', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.6 }}>{highlight1Description}</p>
          </div>

          <div style={{ padding: '2rem', border: '1px solid var(--usm-border)', borderRadius: '12px', background: '#fff' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <svg fill="none" stroke="var(--usm-primary)" strokeWidth="1.5" viewBox="0 0 24 24" width="30" height="30">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
            </div>
            <h4 style={{ fontFamily: 'var(--usm-font-heading)', fontWeight: 600, fontSize: '1.2rem', marginBottom: '1rem' }}>{highlight2Title}</h4>
            <p style={{ color: '#666', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.6 }}>{highlight2Description}</p>
          </div>

          <div style={{ padding: '2rem', border: '1px solid var(--usm-border)', borderRadius: '12px', background: '#fff' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <svg fill="none" stroke="var(--usm-primary)" strokeWidth="1.5" viewBox="0 0 24 24" width="30" height="30">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h4 style={{ fontFamily: 'var(--usm-font-heading)', fontWeight: 600, fontSize: '1.2rem', marginBottom: '1rem' }}>{highlight3Title}</h4>
            <p style={{ color: '#666', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.6 }}>{highlight3Description}</p>
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
                  <img src={listing.image} className="usm-card-img" alt={listing.title} />
                </div>
                <div className="usm-card-body">
                  <span className="usm-card-category">{listing.category}</span>
                  <h3 className="usm-card-title">{listing.title}</h3>
                  <div className="usm-card-price">
                    {listing.price}
                  </div>
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
          {VERTICALS.map((vertical) => (
            <a href={themeLink(`/explore?vertical=${vertical.key}`)} key={vertical.key} className="usm-category-card">
              <h5 className="usm-category-title">{vertical.label}</h5>
              <p style={{ color: '#888', fontWeight: 300, fontSize: '0.85rem', margin: 0 }}>{vertical.description}</p>
            </a>
          ))}
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
