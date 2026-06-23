'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Product } from '@sellio/types';
import { useThemeContent } from '@/components/theme-content/ThemeContentProvider';
import { fetchProductsCatalog, resolveProductsFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import exhibitionBanner from './assets/banner-exhibition.webp';
import imgInspection from './assets/aadab-international-section-01.webp';
import imgInstruments from './assets/aadab-international-section-02.webp';
import imgVideoIntro from './assets/video-introduction.webp';
import imgClip1 from './assets/video-clip-1.webp';
import imgClip2 from './assets/video-clip-2.webp';
import imgClip3 from './assets/video-clip-3.webp';
import imgClip4 from './assets/video-clip-4.webp';
import imgClip5 from './assets/video-clip-5.webp';
import imgSliderCutters from './assets/home-slider-cutters.webp';
import imgSliderScissors from './assets/home-slider-scissors.webp';
import imgSliderForceps from './assets/home-slider-forceps.webp';

const aadabImages = {
  inspection: imgInspection.src,
  instruments: imgInstruments.src,
};

const exhibitionNews = {
  title: 'WHX Dubai 2026',
  body: 'Aadab International will exhibit at the World Health Exhibition, Dubai. Bring your instrument list — we will have samples and factory representatives on site.',
  cta: 'Register interest',
};

const legacyFeatures = [
  { code: 'Since 1942', icon: 'heritage', lineOne: 'Serving', lineTwo: 'the World', lineThree: 'Since 1942' },
  { code: 'Export House', icon: 'export', lineOne: 'Third', lineTwo: 'Generation', lineThree: 'in Export' },
  { code: 'Bone Surgery', icon: 'bone', lineOne: 'Specialized', lineTwo: 'in Bone', lineThree: 'Surgery' },
  { code: 'OEM Ready', icon: 'custom', lineOne: 'Custom', lineTwo: 'Made', lineThree: 'Products' },
  { code: 'Global Supply', icon: 'globe', lineOne: 'WorldWide', lineTwo: 'Happy', lineThree: 'Customers' },
  { code: 'QC Checked', icon: 'quality', lineOne: '100%', lineTwo: 'Guaranteed', lineThree: 'Instruments' },
];

const heroRecords = [
  { label: 'Factory record', icon: 'heritage', value: 'Est. 1942', detail: 'Reusable surgical instrument manufacturing' },
  { label: 'Export desk', icon: 'export', value: '40+', detail: 'Destinations served through distributor supply' },
  { label: 'Catalog file', icon: 'bone', value: 'catalog', detail: 'Orthopedic patterns, sets, and OEM items' },
  { label: 'Buyer program', icon: 'custom', value: 'OEM', detail: 'Private label, marking, packing, and documents' },
];

const heroSliderProducts = [
  { name: 'T.C. Pin Cutter', image: imgSliderCutters.src },
  { name: 'Surgical Scissors', image: imgSliderScissors.src },
  { name: 'Bone Holding Forceps', image: imgSliderForceps.src },
];

const heroCapabilities = [
  ['Orthopedic range', 'Bone surgery, trauma, spine, retractors'],
  ['OEM export supply', 'Private label marking, packing, documentation'],
  ['Factory quotation', 'Buyer item lists, drawings, and bulk RFQs'],
];

function normalizeHeroTitle(value: string) {
  const legacyTitles = new Set([
    'Orthopedic Instruments',
    'Orthopedic instruments\nbuilt for export.',
    'Bone surgery instruments\nfor export buyers.',
    'Orthopedic instruments\nfor global distributors.',
  ]);

  return legacyTitles.has(value) ? 'Bone Surgery Instruments' : value;
}

const factoryClips = [imgClip1.src, imgClip2.src, imgClip3.src, imgClip4.src, imgClip5.src];

const categories = [
  { name: 'Wire Twisting Forceps T.C.', count: 7, image: '/aadab/categories/wire-twisting-forceps-t.c.jpg' },
  { name: 'Wire Cutting Pliers', count: 15, image: '/aadab/categories/wire-cutting-pliers.jpg' },
  { name: 'Tendon Strippers & Tendon Forceps', count: 16, image: '/aadab/categories/tendon-strippers-tendon-forceps.jpg' },
  { name: 'Tampers - Osteotomes', count: 76, image: '/aadab/categories/tampers-osteotomes-chisels-gouges.jpg' },
  { name: 'Raspatories', count: 59, image: '/aadab/categories/raspatories-elevators.jpg' },
  { name: 'Nail Extracting Forceps', count: 4, image: '/aadab/categories/nail-extracting-forceps-finger-ring-saws.jpg' },
  { name: 'Meniscus Knives', count: 10, image: '/aadab/categories/meniscus-knives.jpg' },
  { name: 'Mallets', count: 23, image: '/aadab/categories/mallets.jpg' },
  { name: 'Knee & Spinal Retractors', count: 4, image: '/aadab/categories/knee-spinal-Retractors.jpg' },
  { name: 'Instruments For Orthopaedic Implants', count: 24, image: '/aadab/categories/instruments-for-orthopaedic-implants.jpg' },
  { name: 'Gouges', count: 76, image: null as string | null },
  { name: 'Flat Nose Pliers', count: 15, image: '/aadab/categories/flat-nose-pliers.jpg' },
  { name: 'Finger Ring Saws', count: 4, image: null as string | null },
  { name: 'Extension Bows', count: 14, image: '/aadab/categories/extension-bows.jpg' },
  { name: 'Elevators', count: 59, image: null as string | null },
  { name: 'Drilling Chucks', count: 7, image: '/aadab/categories/drilling-chucks.jpg' },
  { name: 'Chisels', count: 76, image: null as string | null },
  { name: 'Bone Rongeurs', count: 53, image: '/aadab/categories/bone-rongeurs.jpg' },
  { name: 'Bone Levers', count: 35, image: '/aadab/categories/bone-levers-bone-retractor.jpg' },
  { name: 'Bone Holding Forceps', count: 41, image: '/aadab/categories/bone-holding-forceps.jpg' },
  { name: 'Bone Holding Clamps', count: 8, image: '/aadab/categories/bone-holding-clamps.jpg' },
  { name: 'Bone Hand Drills', count: 35, image: '/aadab/categories/bone-hand-drills.jpg' },
  { name: 'Bone Files', count: 14, image: '/aadab/categories/bone-files.jpg' },
  { name: 'Bone Cutting Forceps', count: 18, image: '/aadab/categories/bone-cutting-forceps.jpg' },
  { name: 'Bone Curettes & Raspatories', count: 46, image: '/aadab/categories/bone-curettes-raspatories.jpg' },
  { name: 'Amputation Saws', count: 7, image: '/aadab/categories/Amputation-Saws.jpg' },
  { name: 'Amputation Retractors', count: 1, image: '/aadab/categories/Amputation-Retractors.jpg' },
];

const featuredProducts = [
  { sku: '13-844-01', desc: 'Synovcetomy Rongeur, width of jaws 1.2mm, 13 cm', category: 'Bone Rongeurs', image: '/aadab/products/13-844-01.jpg' },
  { sku: '13-848-14', desc: 'Bone Rongeur, 4 mm, 14 cm', category: 'Bone Rongeurs', image: '/aadab/products/13-848-14.jpg' },
  { sku: '13-852-17', desc: 'Stellbrink Synovcetomy Rongeur, 2 mm, 17 cm', category: 'Bone Rongeurs', image: '/aadab/products/13-852-17.jpg' },
  { sku: '13-856-15', desc: 'Luer Bone Rongeur, 4 mm, 15 cm', category: 'Bone Rongeurs', image: '/aadab/products/13-856-15.jpg' },
  { sku: '13-864-18', desc: 'Jansen Bone Rongeur, 4 mm, Straight, 18 cm', category: 'Bone Rongeurs', image: '/aadab/products/13-864-18.jpg' },
  { sku: '13-866-18', desc: 'Jansen Bone Rongeur, 5 mm, Curved, 18 cm', category: 'Bone Rongeurs', image: '/aadab/products/13-866-18.jpg' },
];

function OrthopedicFeatureIcon({ icon }: { icon: string }) {
  if (icon === 'bone') {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <path d="M23 28c-7-2-11-9-8-15 3-7 12-8 17-2 4-6 13-5 17 1 3 6 0 13-7 16l-14 40c7 3 10 10 7 16-4 7-13 8-18 2-5 6-14 5-17-2-3-6 1-13 8-15l15-41Z" />
        <path d="M38 30l-13 36" />
      </svg>
    );
  }

  if (icon === 'quality') {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <path d="M48 11 78 23v22c0 20-12 33-30 42-18-9-30-22-30-42V23l30-12Z" />
        <path d="m33 49 10 10 21-24" />
      </svg>
    );
  }

  if (icon === 'globe' || icon === 'export') {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <circle cx="48" cy="48" r="33" />
        <path d="M15 48h66M48 15c10 10 15 21 15 33S58 71 48 81M48 15C38 25 33 36 33 48s5 23 15 33" />
        {icon === 'export' ? <path d="M57 29h17v17M74 29 53 50" /> : null}
      </svg>
    );
  }

  if (icon === 'custom') {
    return (
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <path d="M27 70 66 31l-1-14 14 1-4 13-39 39H27Z" />
        <path d="m22 74 15-15M52 45l10 10M64 33l10 10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 96 96" aria-hidden="true">
      <path d="M25 22h46M25 74h46M34 22c0 16 28 16 28 0M34 74c0-16 28-16 28 0M48 38v20" />
      <path d="M39 44h18M39 52h18" />
    </svg>
  );
}

function HeroRecordIcon({ icon }: { icon: string }) {
  return <OrthopedicFeatureIcon icon={icon} />;
}

export default function Page() {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const eyebrow = useThemeContent('hero.eyebrow', 'Est. 1942 · Surgical Instruments Manufacturer');
  const title = useThemeContent('hero.title', 'Bone Surgery Instruments');
  const description = useThemeContent(
    'hero.description',
    'Reusable bone surgery, trauma, spine, and OEM instrument supply for importers, distributors, and hospital purchasing teams.',
  );
  const primaryCta = useThemeContent('hero.primary_cta_label', 'View instrument catalog');
  const secondaryCta = useThemeContent('hero.secondary_cta_label', 'Request a quote');
  const rfqTitle = useThemeContent('rfq.title', 'Ready to place an order?');
  const rfqDescription = useThemeContent(
    'rfq.description',
    'Send your instrument list, quantities, destination country, and any marking, packing, or documentation requirements. Our export team will respond with a complete quotation.',
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
  const displayTitle = normalizeHeroTitle(title);

  return (
    <div className="b2b-page">
      <section className="b2b-exhibition-banner" aria-label="Exhibition news">
        <div className="b2b-exhibition-event">
          <span className="b2b-exhibition-kicker">Exhibiting at</span>
          <strong className="b2b-exhibition-name">{exhibitionNews.title}</strong>
        </div>
        <p className="b2b-exhibition-body">{exhibitionNews.body}</p>
        <img src={exhibitionBanner.src} alt="WHX Dubai 2026 exhibition" className="b2b-exhibition-image" />
        <a href={themeLink('/contact')} className="b2b-exhibition-link">
          {exhibitionNews.cta}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </section>

      <section className="b2b-hero-corp">
        <div className="b2b-hero-corp-inner">
          <div className="b2b-hero-corp-content">
            <span className="b2b-kicker">{eyebrow}</span>
            <h1 className="b2b-hero-corp-h1">
              {displayTitle.split('\n').map((line, index, lines) => (
                <React.Fragment key={`${line}-${index}`}>
                  {line}
                  {index < lines.length - 1 ? <br /> : null}
                </React.Fragment>
              ))}
            </h1>
            <p className="b2b-hero-corp-lead">{description}</p>
            <div className="b2b-hero-corp-sectors" aria-label="Buyer capabilities">
              {heroCapabilities.map(([title, detail]) => (
                <article key={title} className="b2b-sector-chip">
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </article>
              ))}
            </div>
            <div className="b2b-actions">
              <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">{primaryCta}</a>
              <a href={themeLink('/quote')} className="b2b-btn b2b-btn-secondary">{secondaryCta}</a>
            </div>
            <p className="b2b-hero-spec-line">Laser marking / passivation / export packing / repeat supply programs</p>
          </div>

          <div className="b2b-hero-corp-visual">
            <div className="b2b-hero-corp-img b2b-hero-product-stage" aria-label="Rotating orthopedic instrument showcase">
              <div className="b2b-hero-stage-grid" aria-hidden="true" />
              <div className="b2b-hero-stage-ring" aria-hidden="true" />
              <div className="b2b-hero-stage-shadow" aria-hidden="true" />
              {heroSliderProducts.map((product) => (
                <figure
                  key={product.name}
                  className="b2b-hero-product-slide"
                >
                  <img src={product.image} alt={product.name} />
                  <figcaption>{product.name}</figcaption>
                </figure>
              ))}
            </div>
            <div className="b2b-hero-photo-strip" aria-label="Manufacturing focus">
              <figure>
                <img src={aadabImages.inspection} alt="Aadab International orthopedic instruments" />
                <figcaption>Final QC bench</figcaption>
              </figure>
              <figure>
                <img src={aadabImages.instruments} alt="Aadab International surgical instrument manufacturing" />
                <figcaption>Reusable stainless steel</figcaption>
              </figure>
            </div>
          </div>

          <div className="b2b-hero-corp-stats" aria-label="Company highlights">
            {heroRecords.map((record) => (
              <article key={record.label} className="b2b-hero-corp-stat">
                <div className="b2b-hero-record-top">
                  <span>{record.label}</span>
                  <HeroRecordIcon icon={record.icon} />
                </div>
                <strong>{record.value === 'catalog' ? productCountLabel : record.value}</strong>
                <p>{record.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="b2b-legacy-features" aria-label="Company features">
        {legacyFeatures.map((feature, index) => (
          <article key={feature.code} className="b2b-legacy-card">
            <div className="b2b-legacy-icon">
              <OrthopedicFeatureIcon icon={feature.icon} />
            </div>
            <div className="b2b-legacy-card-top">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <em>{feature.code}</em>
            </div>
            <div className="b2b-legacy-card-copy">
              <span>{feature.lineOne}</span>
              <strong>{feature.lineTwo}</strong>
              <em>{feature.lineThree}</em>
            </div>
          </article>
        ))}
      </section>

      <section className="b2b-category-showcase" aria-label="Product categories">
        <div className="b2b-section-heading">
          <span className="b2b-kicker">Product range</span>
          <h2>Instruments for every discipline.</h2>
          <p>Pattern, size, steel grade, finish, and marking are confirmed at the quotation stage. Browse to understand our range, then send an RFQ with your specifics.</p>
        </div>
        <div className="b2b-category-grid">
          {categories.map((category) => (
            <a key={category.name} href={themeLink('/explore')} className="b2b-category-card" aria-label={`View ${category.name} instruments`}>
              <div className="b2b-category-img">
                {category.image
                  ? <img src={category.image} alt={category.name} loading="lazy" />
                  : <div className="b2b-category-placeholder" aria-hidden="true" />}
                <div className="b2b-category-img-overlay" aria-hidden="true" />
              </div>
              <div className="b2b-category-info">
                <h3 className="b2b-category-title">{category.name}</h3>
                <div className="b2b-category-meta">
                  <span className="b2b-category-count">{category.count} items</span>
                  <svg className="b2b-category-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="b2b-factory-visit" aria-label="Visit our factory">
        <div className="b2b-factory-copy">
          <span className="b2b-kicker">Our factory</span>
          <h2>Visit Our Factory</h2>
          <p>
            <strong>Have a virtual tour of</strong><br />
            our production process and factory tour in the video.
          </p>
          <a
            href="https://www.youtube.com/watch?v=jdYh_CcNDOs"
            target="_blank"
            rel="noopener noreferrer"
            className="b2b-btn b2b-btn-primary b2b-factory-cta"
          >
            Watch the Video
          </a>
          <div className="b2b-factory-filmstrip" aria-hidden="true">
            <div className="b2b-factory-filmstrip-inner">
              {[...factoryClips, ...factoryClips].map((src, i) => (
                <img key={i} src={src} alt="" loading="lazy" />
              ))}
            </div>
          </div>
        </div>
        <a
          href="https://www.youtube.com/watch?v=jdYh_CcNDOs"
          target="_blank"
          rel="noopener noreferrer"
          className="b2b-factory-media b2b-factory-video-link"
          aria-label="Watch the Aadab International factory tour on YouTube"
        >
          <img
            src={imgVideoIntro.src}
            alt="Aadab International orthopedic instrument factory tour"
          />
          <span className="b2b-factory-play-btn" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="52" height="52">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </a>
      </section>

      <section className="b2b-featured-products" aria-label="Featured instruments">
        <div className="b2b-section-heading">
          <span className="b2b-kicker">Highlights from the range of our catalog</span>
          <h2>Featured Articles.</h2>
          <p>A hand-picked selection from our export catalog. Available in your choice of steel grade, finish, marking, and packing — send an RFQ for exact specifications.</p>
        </div>
        <div className="b2b-fp-grid">
          {featuredProducts.map((product) => (
            <a key={product.sku} href={themeLink('/explore')} className="b2b-fp-card">
              <div className="b2b-fp-img">
                <img src={product.image} alt={product.desc} loading="lazy" />
              </div>
              <div className="b2b-fp-body">
                <span className="b2b-fp-category">{product.category}</span>
                <code className="b2b-fp-sku">{product.sku}</code>
                <p className="b2b-fp-desc">{product.desc}</p>
              </div>
              <div className="b2b-fp-footer">
                <span className="b2b-fp-cta">
                  Enquire
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a href={themeLink('/explore')} className="b2b-btn b2b-btn-secondary">View full catalog</a>
        </div>
      </section>

      <section className="b2b-rfq" id="b2b-rfq" aria-label="Request a quote">
        <div>
          <span className="b2b-kicker">Export enquiries</span>
          <h2>{rfqTitle}</h2>
          <p>{rfqDescription}</p>
          <div className="b2b-actions">
            <a href={themeLink('/explore')} className="b2b-btn b2b-btn-primary">Browse catalog</a>
            <a href={themeLink('/quote')} className="b2b-btn b2b-btn-secondary">Send RFQ</a>
          </div>
        </div>
      </section>
    </div>
  );
}
