'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Product } from '@sellio/types';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchProductsCatalog, resolveProductsFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import { B2BProductCard } from './components';

const capabilities = [
  [
    'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    'ISO Certified Quality',
    'Every product is manufactured to ISO 9001 and IATF 16949 standards. Dimensional inspection, material traceability, and functional testing on every batch before dispatch.',
  ],
  [
    'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    'Custom & OEM Manufacturing',
    'We manufacture to your drawings and specifications. Tolerances from ±0.001 mm achievable. MOQ negotiable from prototype quantities through full-volume contracts.',
  ],
  [
    'M13 10V3L4 14h7v7l9-11h-7z',
    '48-Hour Quote Response',
    'Submit your technical requirements and our sales engineering team responds within 48 business hours with pricing, lead time, and material certification options.',
  ],
  [
    'M3 15a4 4 0 0 0 4 4h9a5 5 0 0 0 1.8-9.7 6 6 0 0 0-11.8-1A4 4 0 0 0 3 15z',
    'Global Export Logistics',
    'EXW, FOB, and CIF terms available. We handle export clearance, MSDS documentation, and third-party inspection for all international shipments.',
  ],
];

const testimonials = [
  {
    quote: 'Their component tolerances are consistent batch after batch. We have been sourcing from them for seven years and they have never failed a quality audit.',
    name: 'Michael Torres',
    role: 'Supply Chain Director, AeroFab Systems',
    initials: 'MT',
  },
  {
    quote: 'Lead times are reliable and the technical support team actually understands our application requirements. That level of engineering depth is rare in a supplier.',
    name: 'Yuki Sato',
    role: 'Engineering Manager, Sumitomo Heavy Industries',
    initials: 'YS',
  },
  {
    quote: 'We consolidated from three different suppliers to this single source. The cost savings and quality consistency alone justified the switch.',
    name: 'Fatima Al-Rashid',
    role: 'Head of Procurement, Gulf Energy Corporation',
    initials: 'FA',
  },
];

const processSteps = [
  ['01', 'Find your part', 'Browse by category, material grade, or specification code. Download datasheets, 3D models, and tolerance sheets directly from each product page.'],
  ['02', 'Submit your requirements', 'Tell us your quantity, tolerance, material grade, delivery timeline, and certification needs. Our sales engineers review every enquiry personally.'],
  ['03', 'We manufacture and ship', 'Receive a detailed quotation, approve terms, and track production status in real time. Every shipment includes dimensional inspection reports and material certifications.'],
];

const industries = [
  { name: 'Aerospace', cert: 'AS9100D', desc: 'Flight-critical structural and mechanical components for commercial aviation, defense, and space programmes.' },
  { name: 'Automotive', cert: 'IATF 16949', desc: 'Powertrain, chassis, and transmission components for tier-1 OEMs and tier-2 supplier programmes.' },
  { name: 'Energy', cert: 'PED 2014/68/EU', desc: 'Pressure-rated and corrosion-resistant parts for oil, gas, nuclear, and renewable energy infrastructure.' },
  { name: 'Heavy Machinery', cert: 'ISO 3834', desc: 'High-load structural and machined components for construction, mining, and industrial equipment.' },
  { name: 'Defense', cert: 'ITAR Registered', desc: 'Military-grade tolerances with full material traceability and compliant handling for controlled programmes.' },
  { name: 'Chemical Processing', cert: 'ATEX Compliant', desc: 'Chemically resistant alloys, specialist coatings, and sealing solutions for aggressive process environments.' },
];

export default function Page() {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const eyebrow = useThemeContent('hero.eyebrow', 'ISO 9001 Certified · Est. 1985');
  const title = useThemeContent('hero.title', 'Precision Manufacturing\nfor Global Markets.');
  const description = useThemeContent(
    'hero.description',
    'We engineer and manufacture industrial components for the aerospace, energy, and automotive sectors. Browse our catalog, get specifications, and request pricing directly from the source.',
  );
  const primaryCta = useThemeContent('hero.primary_cta_label', 'View our products');
  const secondaryCta = useThemeContent('hero.secondary_cta_label', 'Request a quote');
  const collectionTitle = useThemeContent('collection.title', 'Product highlights');
  const collectionDescription = useThemeContent(
    'collection.description',
    'A selection of our manufactured parts. Each item ships with full dimensional inspection reports, material certifications, and traceability documentation.',
  );
  const offlineKicker = useThemeContent('sync.offline_kicker', 'Catalog unavailable');
  const offlineTitle = useThemeContent('sync.offline_title', 'Products could not be loaded.');
  const emptyTitle = useThemeContent('empty.title', 'No catalog products are published yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add product records in the admin panel and they will appear here.');
  const rfqTitle = useThemeContent('rfq.title', 'Request a quotation');
  const rfqDescription = useThemeContent(
    'rfq.description',
    'Submit your part requirements — quantity, tolerance, material grade, and delivery timeline. Our sales engineering team responds within 48 business hours with pricing, lead time, and available certifications.',
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setLoadingProducts(true);
      const result = await fetchProductsCatalog();

      if (!isMounted) return;

      if (result.ok) {
        setProducts(result.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError(result.error);
        const resolution = resolveProductsFailure(allowDemo);
        setProducts(resolution.mode === 'demo' ? resolution.products : []);
        setUseFallback(resolution.mode === 'demo');
      }

      setLoadingProducts(false);
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [allowDemo]);

  const productCountLabel = useMemo(() => {
    if (loadingProducts) return '—';
    return products.length > 0 ? `${products.length.toLocaleString()}+` : '—';
  }, [loadingProducts, products.length]);

  return (
    <div className="b2b-page">

      {/* Hero — split layout with visual column */}
      <section className="b2b-hero-corp">
        <div className="b2b-hero-corp-inner">

          {/* Text column */}
          <div className="b2b-hero-corp-content">
            <span className="b2b-kicker">{eyebrow}</span>
            <h1 className="b2b-hero-corp-h1">
              {title.split('\n').map((line, index, lines) => (
                <React.Fragment key={`${line}-${index}`}>
                  {line}
                  {index < lines.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </h1>
            <p className="b2b-hero-corp-lead">{description}</p>
            <div className="b2b-hero-corp-sectors" aria-label="Industries served">
              {['Aerospace', 'Automotive', 'Energy', 'Machinery', 'Defense', 'Chemical', 'Mining'].map((sector) => (
                <span key={sector} className="b2b-sector-chip">{sector}</span>
              ))}
            </div>
            <div className="b2b-actions">
              <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">{primaryCta}</a>
              <a href="#b2b-rfq" className="b2b-btn b2b-btn-secondary">{secondaryCta}</a>
            </div>
          </div>

          {/* Visual column — industrial image placeholder */}
          <div className="b2b-hero-corp-visual" aria-hidden="true">
            <div className="b2b-hero-corp-img">
              {/* Abstract industrial graphic */}
              <svg className="b2b-hero-corp-img-svg" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                {/* Grid lines */}
                {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x) => (
                  <line key={`vl-${x}`} x1={x} y1="0" x2={x} y2="500" stroke="rgba(45,212,191,0.06)" strokeWidth="1" />
                ))}
                {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map((y) => (
                  <line key={`hl-${y}`} x1="0" y1={y} x2="400" y2={y} stroke="rgba(45,212,191,0.06)" strokeWidth="1" />
                ))}
                {/* Central circle — gear/component motif */}
                <circle cx="200" cy="240" r="110" stroke="rgba(45,212,191,0.15)" strokeWidth="1.5" />
                <circle cx="200" cy="240" r="80" stroke="rgba(45,212,191,0.2)" strokeWidth="1" />
                <circle cx="200" cy="240" r="40" stroke="rgba(45,212,191,0.3)" strokeWidth="1.5" />
                <circle cx="200" cy="240" r="15" fill="rgba(45,212,191,0.25)" />
                {/* Radial lines */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <line key={`r-${angle}`}
                      x1={200 + Math.cos(rad) * 42} y1={240 + Math.sin(rad) * 42}
                      x2={200 + Math.cos(rad) * 78} y2={240 + Math.sin(rad) * 78}
                      stroke="rgba(45,212,191,0.35)" strokeWidth="2"
                    />
                  );
                })}
                {/* Corner marks */}
                <path d="M20 20 L20 50 M20 20 L50 20" stroke="rgba(45,212,191,0.5)" strokeWidth="2" />
                <path d="M380 20 L380 50 M380 20 L350 20" stroke="rgba(45,212,191,0.5)" strokeWidth="2" />
                <path d="M20 480 L20 450 M20 480 L50 480" stroke="rgba(45,212,191,0.5)" strokeWidth="2" />
                <path d="M380 480 L380 450 M380 480 L350 480" stroke="rgba(45,212,191,0.5)" strokeWidth="2" />
                {/* Measurement lines */}
                <line x1="200" y1="100" x2="200" y2="125" stroke="rgba(45,212,191,0.3)" strokeWidth="1" strokeDasharray="4 3" />
                <line x1="200" y1="355" x2="200" y2="380" stroke="rgba(45,212,191,0.3)" strokeWidth="1" strokeDasharray="4 3" />
                <line x1="55" y1="240" x2="80" y2="240" stroke="rgba(45,212,191,0.3)" strokeWidth="1" strokeDasharray="4 3" />
                <line x1="320" y1="240" x2="345" y2="240" stroke="rgba(45,212,191,0.3)" strokeWidth="1" strokeDasharray="4 3" />
              </svg>
              {/* Badge overlays */}
              <div className="b2b-hero-corp-img-badge b2b-hero-corp-img-badge-tl">
                <strong>ISO 9001</strong>
                <span>Certified</span>
              </div>
              <div className="b2b-hero-corp-img-badge b2b-hero-corp-img-badge-br">
                <strong>{productCountLabel}</strong>
                <span>Products</span>
              </div>
            </div>
          </div>

          {/* Stats bar — full width */}
          <div className="b2b-hero-corp-stats" aria-label="Company statistics">
            <div className="b2b-hero-corp-stat">
              <strong>40+</strong>
              <span>Years of Manufacturing</span>
            </div>
            <div className="b2b-hero-corp-stat">
              <strong>98%</strong>
              <span>On-Time Delivery</span>
            </div>
            <div className="b2b-hero-corp-stat">
              <strong>{productCountLabel}</strong>
              <span>Products Available</span>
            </div>
            <div className="b2b-hero-corp-stat">
              <strong>47</strong>
              <span>Countries Served</span>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are — redesigned */}
      <section className="b2b-who" aria-label="About us">
        <div className="b2b-who-inner">
          <div className="b2b-who-copy">
            <span className="b2b-kicker">Who we are</span>
            <h2>Four decades of precision engineering.</h2>
            <p>
              Founded in 1985, we have grown from a regional machining operation into a global-scale precision components manufacturer.
              Today we operate three production facilities and export to 47 countries across six continents.
            </p>
            <p>
              Our engineering team specialises in close-tolerance metal and composite components for aerospace, energy, and heavy machinery applications.
              Every product leaves our facility with full dimensional reports and material certification.
            </p>
            <div className="b2b-who-actions">
              <a href={themeLink('/about')} className="b2b-btn b2b-btn-primary">Our company</a>
              <a href={themeLink('/contact')} className="b2b-btn b2b-btn-secondary">Get in touch</a>
            </div>
          </div>
          <div className="b2b-who-visual" aria-hidden="true">
            <div className="b2b-who-img-wrap">
              <svg viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="b2b-who-img-svg" aria-hidden="true">
                <rect x="0" y="0" width="360" height="280" fill="none" />
                {/* Blueprint grid */}
                {[0,40,80,120,160,200,240,280,320,360].map((x) => (
                  <line key={`x${x}`} x1={x} y1="0" x2={x} y2="280" stroke="rgba(45,212,191,0.07)" strokeWidth="1" />
                ))}
                {[0,40,80,120,160,200,240,280].map((y) => (
                  <line key={`y${y}`} x1="0" y1={y} x2="360" y2={y} stroke="rgba(45,212,191,0.07)" strokeWidth="1" />
                ))}
                {/* Component outline — isometric box */}
                <path d="M180 40 L300 110 L300 210 L180 280 L60 210 L60 110 Z" stroke="rgba(45,212,191,0.25)" strokeWidth="1.5" fill="none" />
                <path d="M180 40 L180 140 M300 110 L180 140 M60 110 L180 140" stroke="rgba(45,212,191,0.15)" strokeWidth="1" strokeDasharray="5 4" />
                {/* Inner detail */}
                <path d="M180 90 L260 135 L260 185 L180 230 L100 185 L100 135 Z" stroke="rgba(45,212,191,0.35)" strokeWidth="1.5" fill="rgba(45,212,191,0.04)" />
                {/* Circle */}
                <circle cx="180" cy="160" r="28" stroke="rgba(45,212,191,0.4)" strokeWidth="1.5" fill="none" />
                <circle cx="180" cy="160" r="10" fill="rgba(45,212,191,0.2)" />
                {/* Dimension lines */}
                <line x1="40" y1="110" x2="40" y2="210" stroke="rgba(45,212,191,0.3)" strokeWidth="1" />
                <line x1="35" y1="110" x2="45" y2="110" stroke="rgba(45,212,191,0.3)" strokeWidth="1" />
                <line x1="35" y1="210" x2="45" y2="210" stroke="rgba(45,212,191,0.3)" strokeWidth="1" />
              </svg>
              <div className="b2b-who-cert-badge">
                <span>✓ IATF 16949</span>
                <span>✓ AS9100D</span>
                <span>✓ ISO 14001</span>
              </div>
            </div>
            <div className="b2b-who-numbers">
              <div><strong>3</strong><span>Production Facilities</span></div>
              <div><strong>850+</strong><span>Skilled Employees</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate banners */}
      <section className="b2b-banners" aria-label="Company highlights">
        <article className="b2b-banner b2b-banner-primary">
          <span className="b2b-kicker">Custom manufacturing</span>
          <h3>We manufacture to your drawings — from prototype to production run.</h3>
          <p>Submit your technical drawings or CAD files and our engineering team will provide a detailed quotation including tooling cost, lead time, and MOQ.</p>
          <a href="#b2b-rfq" className="b2b-btn b2b-btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            Start a project
          </a>
        </article>
        <article className="b2b-banner b2b-banner-secondary">
          <span className="b2b-kicker">Expedited delivery</span>
          <h3>72-hour dispatch on all stocked items for qualifying orders.</h3>
          <p>Urgent requirement? Over 800 standard part numbers are held in stock and available for immediate dispatch. Contact our logistics team.</p>
          <a href={themeLink('/contact')} className="b2b-btn b2b-btn-secondary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            Contact logistics
          </a>
        </article>
      </section>

      {/* Business capabilities */}
      <section className="b2b-capability-grid" aria-label="Our capabilities">
        {capabilities.map(([iconPath, name, detail]) => (
          <article key={name}>
            <span className="b2b-capability-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={iconPath} />
              </svg>
            </span>
            <h2>{name}</h2>
            <p>{detail}</p>
          </article>
        ))}
      </section>

      {/* Industries We Serve */}
      <section className="b2b-industries" aria-label="Industries served">
        <div className="b2b-section-heading">
          <span className="b2b-kicker">Industry expertise</span>
          <h2>Who we manufacture for.</h2>
          <p>
            Our components are certified and active in six demanding industrial sectors.
            We hold the accreditations each market requires — and the engineering track record to back them.
          </p>
        </div>
        <div className="b2b-industries-grid">
          {industries.map((ind) => (
            <div key={ind.name} className="b2b-industry-card">
              <span className="b2b-industry-cert">{ind.cert}</span>
              <h3>{ind.name}</h3>
              <p>{ind.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product highlights */}
      <section className="b2b-collection">
        <div className="b2b-section-heading">
          <span className="b2b-kicker">From the factory floor</span>
          <h2>{collectionTitle}</h2>
          <p>{collectionDescription}</p>
        </div>

        {apiError && useFallback && <CatalogSyncAlert variant="demo" error={apiError} classPrefix="ef" />}
        {apiError && !useFallback && <CatalogSyncAlert variant="production" error={apiError} classPrefix="ef" />}

        <div className="b2b-product-grid">
          {loadingProducts ? (
            [1, 2, 3].map((item) => <div key={item} className="b2b-product-card b2b-skeleton" />)
          ) : apiError && !useFallback ? (
            <div className="b2b-state">
              <span className="b2b-kicker">{offlineKicker}</span>
              <h3>{offlineTitle}</h3>
              <p>Check the API connection or refresh the page.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="b2b-state">
              <h3>{emptyTitle}</h3>
              <p>{emptyDescription}</p>
            </div>
          ) : (
            products.slice(0, 3).map((product) => (
              <B2BProductCard
                key={product.id}
                product={product}
                href={themeLink(`/product/${product.slug}`)}
                featured={product.id === products[0]?.id}
              />
            ))
          )}
        </div>

        {!loadingProducts && products.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <a href={themeLink('/explore')} className="b2b-btn b2b-btn-secondary">
              View full catalog →
            </a>
          </div>
        )}
      </section>

      {/* Client testimonials */}
      <section className="b2b-testimonials" aria-label="Client reviews">
        <div className="b2b-section-heading">
          <span className="b2b-kicker">What our clients say</span>
          <h2>Trusted by leading industrial companies worldwide.</h2>
        </div>
        <div className="b2b-testimonial-grid">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="b2b-testimonial-card">
              <div className="b2b-testimonial-stars" aria-label="5 stars">{'★'.repeat(5)}</div>
              <p className="b2b-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <footer className="b2b-testimonial-author">
                <span className="b2b-testimonial-avatar" aria-hidden="true">{t.initials}</span>
                <div>
                  <strong className="b2b-testimonial-name">{t.name}</strong>
                  <span className="b2b-testimonial-role">{t.role}</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* How to order */}
      <section style={{ marginTop: '6rem' }} aria-label="How to order">
        <div className="b2b-section-heading">
          <span className="b2b-kicker">How it works</span>
          <h2>Order in three steps.</h2>
          <p>From discovery to confirmed order — our process is designed to be fast, transparent, and fully traceable.</p>
        </div>
        <div className="b2b-process">
          {processSteps.map(([num, step, detail]) => (
            <article key={num}>
              <span>{num}</span>
              <h3>{step}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* RFQ section */}
      <section className="b2b-rfq" id="b2b-rfq" aria-label="Request a quote">
        <div>
          <span className="b2b-kicker">Get started</span>
          <h2>{rfqTitle}</h2>
          <p>{rfqDescription}</p>
          <div className="b2b-actions">
            <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">Browse catalog</a>
            <a href={themeLink('/contact')} className="b2b-btn b2b-btn-secondary">Contact our team</a>
          </div>
        </div>
      </section>

    </div>
  );
}
