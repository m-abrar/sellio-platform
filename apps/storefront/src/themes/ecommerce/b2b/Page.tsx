'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Product } from '@sellio/types';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchProductsCatalog, resolveProductsFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import { B2BProductCard } from './components';

const aadabImages = {
  hero: 'https://commons.wikimedia.org/wiki/Special:FilePath/Surgical%20Instruments%2001.jpg',
  inspection: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ring%20Forceps.jpg',
  instruments: 'https://commons.wikimedia.org/wiki/Special:FilePath/Surgical%20instruments%2002.JPG',
};

const capabilities = [
  [
    'ISO 13485 Quality System',
    'Orthopedic instruments are produced under documented quality controls with material traceability, dimensional inspection, passivation, and batch-level records before dispatch.',
  ],
  [
    'OEM & Private Label Supply',
    'We manufacture instrument sets to buyer specifications, etch private-label branding, support custom trays, and quote distributor-ready bulk orders.',
  ],
  [
    '48-Hour Export Quote',
    'Send item codes, drawings, target quantities, and destination port. Our export team replies with pricing, lead time, packing options, and required documents.',
  ],
  [
    'Worldwide Export Logistics',
    'EXW, FOB, CIF, and air-cargo dispatch are available with export packing, certificate support, commercial invoices, and third-party inspection coordination.',
  ],
];

const testimonials = [
  {
    quote: 'Their orthopedic sets arrive consistent, cleanly finished, and properly documented. That reliability matters when you supply hospitals across multiple regions.',
    name: 'Dr. Elena Morris',
    role: 'Procurement Director, Northshore Surgical Group',
    initials: 'EM',
  },
  {
    quote: 'We moved our trauma instrument sourcing to Aadab International because they understand export packing, private labeling, and the documentation importers need.',
    name: 'Yusuf Khan',
    role: 'Managing Director, MedGate Imports',
    initials: 'YK',
  },
  {
    quote: 'The RFQ process is clear and technical. Their team catches details on finish, steel grade, and tray configuration before production starts.',
    name: 'Fatima Al-Rashid',
    role: 'Sourcing Lead, Gulf Orthopedic Supply',
    initials: 'FA',
  },
];

const processSteps = [
  ['01', 'Select instruments or sets', 'Browse trauma, spine, joint, retractor, and general orthopedic instruments. Share item codes, drawings, or your current set list.'],
  ['02', 'Submit export requirements', 'Tell us quantity, steel grade, finish, branding, destination port, certificates, and preferred packing. Our export team reviews every enquiry.'],
  ['03', 'Approve and ship', 'Receive a detailed quotation, approve samples if needed, and dispatch under EXW, FOB, CIF, or air-cargo terms with required documents.'],
];

const categories = [
  { name: 'Trauma Instruments', cert: 'AO Pattern', desc: 'Bone holding forceps, reduction clamps, plate benders, drill guides, depth gauges, and screwdrivers for trauma sets.' },
  { name: 'Spine Instruments', cert: 'Set Supply', desc: 'Rongeurs, curettes, elevators, distractors, probes, and implant-support instruments for spine procedures.' },
  { name: 'Joint Instruments', cert: 'OEM Ready', desc: 'Hip, knee, and extremity instruments supplied as loose items or procedure-ready configured sets.' },
  { name: 'Retractors & Elevators', cert: 'Reusable SS', desc: 'Periosteal elevators, Hohmann retractors, bone levers, and exposure instruments in surgical stainless steel.' },
  { name: 'Custom Sets', cert: 'Private Label', desc: 'Distributor-specific kits with laser marking, custom tray layouts, and export-ready labeling support.' },
  { name: 'Hospital Supply', cert: 'Bulk RFQ', desc: 'Repeat supply programs for hospitals, buying groups, tender suppliers, and regional medical distributors.' },
];

function CapabilityIcon() {
  return (
    <span className="b2b-capability-icon" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </span>
  );
}

export default function Page() {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const eyebrow = useThemeContent('hero.eyebrow', 'Manufacturers & Exporters - Sialkot, Pakistan');
  const title = useThemeContent('hero.title', 'Orthopedic instruments\nfor global distributors.');
  const description = useThemeContent(
    'hero.description',
    'Aadab International manufactures and exports reusable orthopedic surgical instruments from Sialkot, Pakistan for hospitals, distributors, importers, and OEM buyers. Browse the catalog, shortlist items, and request export pricing directly from the factory.',
  );
  const primaryCta = useThemeContent('hero.primary_cta_label', 'Browse instruments');
  const secondaryCta = useThemeContent('hero.secondary_cta_label', 'Request export quote');
  const collectionTitle = useThemeContent('collection.title', 'Featured orthopedic instruments');
  const collectionDescription = useThemeContent(
    'collection.description',
    'A selection of orthopedic instruments and procedure sets. Each shipment can include material traceability, packing lists, inspection records, and export documentation.',
  );
  const offlineKicker = useThemeContent('sync.offline_kicker', 'Catalog unavailable');
  const offlineTitle = useThemeContent('sync.offline_title', 'Products could not be loaded.');
  const emptyTitle = useThemeContent('empty.title', 'No orthopedic instruments are published yet.');
  const emptyDescription = useThemeContent('empty.description', 'Add product records in the admin panel and they will appear here.');
  const rfqTitle = useThemeContent('rfq.title', 'Request an orthopedic export quotation');
  const rfqDescription = useThemeContent(
    'rfq.description',
    'Submit item codes, quantities, stainless-steel grade, finish, private-label needs, destination port, and delivery timeline. Our export team responds within 48 business hours with pricing, lead time, and document options.',
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
    if (loadingProducts) return '-';
    return products.length > 0 ? `${products.length.toLocaleString()}+` : '-';
  }, [loadingProducts, products.length]);

  return (
    <div className="b2b-page">
      <section className="b2b-hero-corp">
        <div className="b2b-hero-corp-inner">
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
            <div className="b2b-hero-corp-sectors" aria-label="Product groups">
              {['Trauma', 'Spine', 'Joint', 'Retractors', 'OEM Sets', 'Private Label', 'Export'].map((sector) => (
                <span key={sector} className="b2b-sector-chip">{sector}</span>
              ))}
            </div>
            <div className="b2b-actions">
              <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">{primaryCta}</a>
              <a href={themeLink('/quote')} className="b2b-btn b2b-btn-secondary">{secondaryCta}</a>
            </div>
          </div>

          <div className="b2b-hero-corp-visual">
            <div className="b2b-hero-corp-img">
              <img src={aadabImages.hero} alt="Clean medical instrument inspection bench" />
              <div className="b2b-hero-corp-img-badge b2b-hero-corp-img-badge-tl">
                <strong>Sialkot</strong>
                <span>Pakistan</span>
              </div>
              <div className="b2b-hero-corp-img-badge b2b-hero-corp-img-badge-br">
                <strong>{productCountLabel}</strong>
                <span>Instruments</span>
              </div>
            </div>
            <div className="b2b-hero-photo-strip" aria-label="Manufacturing focus">
              <figure>
                <img src={aadabImages.inspection} alt="Precision inspection in a manufacturing workspace" />
                <figcaption>In-process inspection</figcaption>
              </figure>
              <figure>
                <img src={aadabImages.instruments} alt="Reusable surgical instrument detail" />
                <figcaption>Reusable stainless steel</figcaption>
              </figure>
            </div>
          </div>

          <div className="b2b-hero-corp-stats" aria-label="Company statistics">
            <div className="b2b-hero-corp-stat"><strong>40+</strong><span>Years Surgical Manufacturing</span></div>
            <div className="b2b-hero-corp-stat"><strong>98%</strong><span>On-Time Export Dispatch</span></div>
            <div className="b2b-hero-corp-stat"><strong>{productCountLabel}</strong><span>Catalog Instruments</span></div>
            <div className="b2b-hero-corp-stat"><strong>47</strong><span>Export Markets</span></div>
          </div>
        </div>
      </section>

      <section className="b2b-who" aria-label="About us">
        <div className="b2b-who-inner">
          <div className="b2b-who-copy">
            <span className="b2b-kicker">Who we are</span>
            <h2>Orthopedic instrument manufacturing with export discipline.</h2>
            <p>
              Founded in Sialkot, Pakistan, Aadab International has grown from a specialist surgical workshop into a manufacturer and exporter of reusable orthopedic instruments.
              Today we supply trauma, spine, joint, retractor, and custom instrument sets for buyers across 47 export markets.
            </p>
            <p>
              Our production teams work with surgical stainless steels, controlled finishing, passivation, laser marking, and batch documentation.
              Every order is packed for professional medical distribution, not generic commodity resale.
            </p>
            <div className="b2b-who-actions">
              <a href={themeLink('/about')} className="b2b-btn b2b-btn-primary">Our company</a>
              <a href={themeLink('/contact')} className="b2b-btn b2b-btn-secondary">Get in touch</a>
            </div>
          </div>
          <div className="b2b-who-visual">
            <div className="b2b-who-img-wrap">
              <img src={aadabImages.inspection} alt="Instrument quality inspection and finishing review" />
              <div className="b2b-who-cert-badge">
                <span>ISO 13485 aligned</span>
                <span>CE documentation support</span>
                <span>316L / 420 stainless steel</span>
              </div>
            </div>
            <div className="b2b-who-numbers">
              <div><strong>3</strong><span>Production Units</span></div>
              <div><strong>850+</strong><span>Skilled Technicians</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="b2b-banners" aria-label="Company highlights">
        <article className="b2b-banner b2b-banner-primary">
          <span className="b2b-kicker">OEM manufacturing</span>
          <h3>We manufacture orthopedic instruments to your item list, drawings, or private-label program.</h3>
          <p>Share your catalog codes, required steel grade, finish, logo marking, and tray layout. Our team returns a quotation with tooling, MOQ, samples, and lead time.</p>
          <a href={themeLink('/quote')} className="b2b-btn b2b-btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            Start a project
          </a>
        </article>
        <article className="b2b-banner b2b-banner-secondary">
          <span className="b2b-kicker">Distributor supply</span>
          <h3>Stocked orthopedic instruments and repeat export programs for qualified buyers.</h3>
          <p>Need urgent supply? Common trauma, retractor, elevator, and screwdriver patterns are available for fast quotation and staged shipment.</p>
          <a href={themeLink('/contact')} className="b2b-btn b2b-btn-secondary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            Contact export desk
          </a>
        </article>
      </section>

      <section className="b2b-capability-grid" aria-label="Our capabilities">
        {capabilities.map(([name, detail]) => (
          <article key={name}>
            <CapabilityIcon />
            <h2>{name}</h2>
            <p>{detail}</p>
          </article>
        ))}
      </section>

      <section className="b2b-industries" aria-label="Product categories">
        <div className="b2b-section-heading">
          <span className="b2b-kicker">Catalog expertise</span>
          <h2>What we manufacture.</h2>
          <p>Our orthopedic line is built for distributors, hospitals, importers, OEM brands, and tender suppliers that need repeatable quality with export-ready paperwork.</p>
        </div>
        <div className="b2b-industries-grid">
          {categories.map((category) => (
            <div key={category.name} className="b2b-industry-card">
              <span className="b2b-industry-cert">{category.cert}</span>
              <h3>{category.name}</h3>
              <p>{category.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="b2b-collection">
        <div className="b2b-section-heading">
          <span className="b2b-kicker">From the instrument catalog</span>
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
              <B2BProductCard key={product.id} product={product} href={themeLink(`/product/${product.slug}`)} featured={product.id === products[0]?.id} />
            ))
          )}
        </div>

        {!loadingProducts && products.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <a href={themeLink('/explore')} className="b2b-btn b2b-btn-secondary">View full catalog</a>
          </div>
        )}
      </section>

      <section className="b2b-testimonials" aria-label="Client reviews">
        <div className="b2b-section-heading">
          <span className="b2b-kicker">What buyers say</span>
          <h2>Trusted by surgical distributors and medical supply teams.</h2>
        </div>
        <div className="b2b-testimonial-grid">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.name} className="b2b-testimonial-card">
              <div className="b2b-testimonial-stars" aria-label="5 stars">*****</div>
              <p className="b2b-testimonial-quote">&ldquo;{testimonial.quote}&rdquo;</p>
              <footer className="b2b-testimonial-author">
                <span className="b2b-testimonial-avatar" aria-hidden="true">{testimonial.initials}</span>
                <div>
                  <strong className="b2b-testimonial-name">{testimonial.name}</strong>
                  <span className="b2b-testimonial-role">{testimonial.role}</span>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '6rem' }} aria-label="How to order">
        <div className="b2b-section-heading">
          <span className="b2b-kicker">How it works</span>
          <h2>Export sourcing in three steps.</h2>
          <p>From catalog selection to shipment, our process is built for transparent medical-device procurement and repeat distributor supply.</p>
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

      <section className="b2b-rfq" id="b2b-rfq" aria-label="Request a quote">
        <div>
          <span className="b2b-kicker">Get started</span>
          <h2>{rfqTitle}</h2>
          <p>{rfqDescription}</p>
          <div className="b2b-actions">
            <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">Browse instruments</a>
            <a href={themeLink('/quote')} className="b2b-btn b2b-btn-secondary">Send RFQ</a>
          </div>
        </div>
      </section>
    </div>
  );
}
