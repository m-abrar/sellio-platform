'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@sellio/api-client';
import type { Product, Category } from '@sellio/types';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const heroEyebrow = useThemeContent('hero.eyebrow', 'UNIVERSAL MINIMALISM');
  const heroTitle = useThemeContent('hero.title', 'Discover the Art\nof Simplicity.');
  const heroHighlight = useThemeContent('hero.highlight', 'Simplicity.');
  const heroDescription = useThemeContent('hero.description', 'Your marketplace, meticulously curated and thoughtfully designed for elegance, clarity, and focus.');
  const heroPrimaryCtaLabel = useThemeContent('hero.primary_cta_label', 'Explore Listings');
  const heroSecondaryCtaLabel = useThemeContent('hero.secondary_cta_label', 'Start Exploring');

  const highlight1Title = useThemeContent('highlight.1_title', 'Precision Design');
  const highlight1Description = useThemeContent('highlight.1_description', 'Every pixel is intentional, ensuring a balanced, distraction-free user journey.');
  const highlight2Title = useThemeContent('highlight.2_title', 'Visual Clarity');
  const highlight2Description = useThemeContent('highlight.2_description', 'Superior typography and ample whitespace highlight what truly matters: your content.');
  const highlight3Title = useThemeContent('highlight.3_title', 'Effortless Flow');
  const highlight3Description = useThemeContent('highlight.3_description', 'From browsing to posting, the process is streamlined and intuitively structured.');

  const collectionTitle = useThemeContent('collection.title', 'Curated Highlights');
  const collectionDescription = useThemeContent('collection.description', 'A selection of premium listings that embody quality and minimalist elegance.');

  const categoriesTitle = useThemeContent('categories.title', 'Explore with Focus');
  const categoriesDescription = useThemeContent('categories.description', 'Navigate our marketplace using clear, icon-driven categories.');

  const quoteText = useThemeContent('quote.text', '"The marketplace we needed—calm, confident, and focused purely on quality."');
  const quoteAuthor = useThemeContent('quote.author', '— A Leading Design Journal');

  const ctaTitle = useThemeContent('cta.title', 'Ready for the Universal Experience?');
  const ctaDescription = useThemeContent('cta.description', 'List your first item or find your next essential.');
  const ctaButtonLabel = useThemeContent('cta.button_label', 'Get Started Today');

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(fetchedProducts || []);
        setCategories(fetchedCategories || []);
      } catch (err) {
        console.error('Failed to load unified minimal data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const defaultListings = [
    { title: "Symmetrical Oak Dining Table", category: "Furniture", price: "$1,850", image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect width='100%' height='100%' fill='%23fafafa'/><path d='M150 350h300v20H150zm30 20v100h20V370zm220 0v100h20V370z' fill='%23d1d5db'/></svg>" },
    { title: "Pure Wool Throw - Charcoal", category: "Textiles", price: "$240", image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect width='100%' height='100%' fill='%23f5f5f5'/><rect x='200' y='200' width='200' height='200' rx='8' fill='%23e5e7eb'/></svg>" },
    { title: "Brushed Brass Wall Sconce", category: "Lighting", price: "$410", image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><rect width='100%' height='100%' fill='%23fafafa'/><circle cx='300' cy='250' r='60' fill='%23e5e7eb'/><path d='M300 310v100' stroke='%23d1d5db' stroke-width='8'/></svg>" }
  ];

  const getProductImage = (product: Product, index: number) => {
    if (product.media?.featured_image || product.image_url) {
      return product.media?.featured_image || product.image_url;
    }
    return defaultListings[index % defaultListings.length].image;
  };

  const defaultCategories = [
    { title: "Furniture", slug: "furniture", icon: (
      <svg className="usm-category-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="36" height="36">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M5.25 19.5h13.5m-13.5-15h13.5m-16.5 3h19.5" />
      </svg>
    )},
    { title: "Textiles", slug: "textiles", icon: (
      <svg className="usm-category-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="36" height="36">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096M9 21h7.5M12 3v13.5m0-13.5L9.813 8.096M12 3l2.188 5.096M12 16.5h.008v.008H12v-.008z" />
      </svg>
    )},
    { title: "Lighting", slug: "lighting", icon: (
      <svg className="usm-category-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="36" height="36">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L7.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    )},
    { title: "Apparel", slug: "apparel", icon: (
      <svg className="usm-category-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="36" height="36">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V9.75M3.75 16.25a5.978 5.978 0 013.375-1.125h9.75c1.235 0 2.404.372 3.375 1.125m-16.5 0v-4.5c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v4.5m-15-4.5h15" />
      </svg>
    )},
    { title: "Products", slug: "products", icon: (
      <svg className="usm-category-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="36" height="36">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    )},
    { title: "Services", slug: "services", icon: (
      <svg className="usm-category-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" width="36" height="36">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A1.5 1.5 0 0020 20l-5.83-5.83m0 0a2.25 2.25 0 10-3.18-3.18m3.18 3.18a2.25 2.25 0 002.24-2.24m-3.23 3.23a3 3 0 10-4-4m4 4a3 3 0 00-4-4M10.5 8.5V3m0 0l-2.5 2.5M10.5 3l2.5 2.5M14.5 12h5.5m0 0l-2.5-2.5m2.5 2.5l-2.5 2.5" />
      </svg>
    )}
  ];

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
            <button 
              className="silent-btn-primary" 
              style={{ backgroundColor: 'transparent', border: '1px solid var(--usm-border)', color: 'var(--usm-ink)' }}
              onClick={() => document.getElementById('usm-explore-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {heroSecondaryCtaLabel}
            </button>
          </div>
        </div>
      </header>

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

      {/* Curated Highlights (Dynamic Products) */}
      <section id="usm-curated-section" style={{ padding: '6rem 6%' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 500, color: 'var(--usm-ink)', marginBottom: '1rem' }}>{collectionTitle}</h2>
          <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: 300, maxWidth: '600px', margin: '0 auto' }}>{collectionDescription}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
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
          ) : products.length > 0 ? (
            products.slice(0, 6).map((product, i) => (
              <a href={`/preview/unifieds_minimal/product/${product.slug}`} key={product.id || i} className="usm-listing-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="usm-card-img-wrap">
                  <img src={getProductImage(product, i)} className="usm-card-img" alt={product.title} />
                </div>
                <div className="usm-card-body">
                  <span className="usm-card-category">
                    {categories.find(c => c.id === product.category_id)?.title || 'Featured Deal'}
                  </span>
                  <h3 className="usm-card-title">{product.title}</h3>
                  <div className="usm-card-price">
                    {product.pricing?.formatted || (product.price ? `$${Number(product.price).toLocaleString()}` : '$980')}
                  </div>
                </div>
              </a>
            ))
          ) : (
            defaultListings.map((item, i) => (
              <div key={i} className="usm-listing-card" onClick={() => alert(`Reviewing: ${item.title}`)}>
                <div className="usm-card-img-wrap">
                  <img src={item.image} className="usm-card-img" alt={item.title} />
                </div>
                <div className="usm-card-body">
                  <span className="usm-card-category">{item.category}</span>
                  <h3 className="usm-card-title">{item.title}</h3>
                  <div className="usm-card-price">{item.price}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Explore with Focus (Dynamic Categories) */}
      <section id="usm-explore-section" style={{ padding: '6rem 6%', background: 'var(--usm-ghost)', borderTop: '1px solid var(--usm-border)', borderBottom: '1px solid var(--usm-border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'var(--usm-font-heading)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 500, color: 'var(--usm-ink)', marginBottom: '1rem' }}>{categoriesTitle}</h2>
          <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: 300, maxWidth: '600px', margin: '0 auto' }}>{categoriesDescription}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', justifyContent: 'center' }}>
          {categories.length > 0 ? (
            categories.slice(0, 8).map((cat, i) => (
              <a href={`/preview/unifieds_minimal/explore/${cat.slug.toLowerCase()}`} key={cat.id || i} className="usm-category-card">
                {defaultCategories[i % defaultCategories.length].icon}
                <h5 className="usm-category-title">{cat.title}</h5>
              </a>
            ))
          ) : (
            defaultCategories.map((cat, i) => (
              <a href={`/preview/unifieds_minimal/explore/${cat.slug.toLowerCase()}`} key={i} className="usm-category-card">
                {cat.icon}
                <h5 className="usm-category-title">{cat.title}</h5>
              </a>
            ))
          )}
        </div>
      </section>

      {/* Mid-Section Journal Quote */}
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
            <button className="silent-btn-primary" onClick={() => alert('Welcome to Universal Marketplace!')}>{ctaButtonLabel}</button>
          </div>
        </div>
      </section>
    </div>
  );
}
