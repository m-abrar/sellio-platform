'use client';
import React, { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { ElectronicsHeader, ProductCard, SpecFeature, ElectronicsFooter } from './components';
import { CatalogSyncAlert } from '@/themes/ecommerce/shared/CatalogSyncAlert';
import { fetchProductsCatalog, resolveProductsFailure } from '@/themes/ecommerce/shared/catalog';
import { useDemoFallbackAllowed } from '@/themes/ecommerce/shared/useDemoFallbackAllowed';
import { useEcommerceThemeLink } from '@/themes/ecommerce/shared/useEcommerceThemeLink';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

const FALLBACK_TRENDING_PRODUCTS = [
  { title: "NVIDIA RTX 5090 Ti Founders Edition", category: "Graphics Cards", price: "$1,999.00", image: "/themes/ecommerce/electronics/21.webp", badge: "IN STOCK", slug: "nvidia-rtx-5090-ti" },
  { title: "AMD Ryzen 9 9950X Processor", category: "Processors", price: "$699.99", oldPrice: "$749.99", image: "/themes/ecommerce/electronics/22.webp", badge: "SALE", slug: "amd-ryzen-9-9950x" },
  { title: "Corsair Dominator Titanium 64GB DDR5", category: "Memory", price: "$349.99", image: "/themes/ecommerce/electronics/23.webp", slug: "corsair-dominator-titanium-64gb" },
  { title: "ASUS ROG Swift OLED 32\" 4K 240Hz", category: "Monitors", price: "$1,299.00", image: "/themes/ecommerce/electronics/24.webp", badge: "NEW", slug: "asus-rog-swift-oled-32" },
];

const FALLBACK_PERIPHERAL_PRODUCTS = [
  { title: "Logitech G Pro X Superlight 2", category: "Mice", price: "$159.99", image: "/themes/ecommerce/electronics/25.webp", slug: "logitech-g-pro-x-superlight-2" },
  { title: "Wooting 60HE+ Analog Keyboard", category: "Keyboards", price: "$174.99", image: "/themes/ecommerce/electronics/26.webp", slug: "wooting-60he-analog-keyboard" },
  { title: "Audeze Maxwell Wireless Gaming Headset", category: "Audio", price: "$299.00", image: "/themes/ecommerce/electronics/27.webp", slug: "audeze-maxwell-wireless" },
  { title: "Elgato Stream Deck +", category: "Streaming", price: "$199.99", image: "/themes/ecommerce/electronics/28.webp", slug: "elgato-stream-deck" },
];

const CATEGORY_LABELS = ["Graphics Cards", "Processors", "Memory", "Monitors", "Mice", "Keyboards", "Audio", "Streaming"];

export default function Page() {
  const themeLink = useEcommerceThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const heroBadge        = useThemeContent('hero.badge',              'NEXT GEN RELEASE');
  const heroTitle        = useThemeContent('hero.title',              'QUANTUM\nPERFORMANCE');
  const heroDescription  = useThemeContent('hero.description',        'Experience untethered speed with the all-new RTX 50-Series architecture. Built for creators and gamers who demand the best.');
  const heroPrimaryCta   = useThemeContent('hero.primary_cta_label',  'Shop Now');
  const heroSecondaryCta = useThemeContent('hero.secondary_cta_label','View Specs');
  const heroImage        = useThemeMedia('hero.image',                '/themes/ecommerce/electronics/29.webp');
  const trendingTitle    = useThemeContent('trending.title',          'TRENDING HARDWARE');
  const promoTitle       = useThemeContent('promo.title',             'BUILD YOUR DREAM PC');
  const promoDescription = useThemeContent('promo.description',       'Browse our full catalog of components and find everything you need to build or upgrade your rig.');
  const promoCta         = useThemeContent('promo.cta_label',         'Shop Components');
  const promoImage       = useThemeMedia('promo.image',               '/themes/ecommerce/electronics/30.webp');
  const peripheralsTitle = useThemeContent('peripherals.title',       'PRO PERIPHERALS');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      const result = await fetchProductsCatalog();

      if (!isMounted) return;

      if (result.ok) {
        setProducts(result.data);
        setUseFallback(false);
        setApiError(null);
      } else {
        setApiError(result.error);
        const resolution = resolveProductsFailure(allowDemo);
        if (resolution.mode === 'demo') {
          setProducts(resolution.products);
          setUseFallback(true);
        } else {
          setProducts([]);
          setUseFallback(false);
        }
      }

      setLoading(false);
    }

    loadData();

    return () => { isMounted = false; };
  }, [allowDemo]);

  const getProductImage = (product: Product, index: number) => {
    if (product.media?.featured_image) return product.media.featured_image;
    if (product.image_url) return product.image_url;
    return `/themes/ecommerce/electronics/${21 + (index % 8)}.webp`;
  };

  const mapApiProductToFrontend = (p: Product, index: number) => {
    const priceStr = p.pricing?.formatted || `$${Number(p.price).toFixed(2)}`;
    const oldPriceStr = (p.pricing && p.pricing.base_price > p.pricing.sale_price)
      ? `$${Number(p.pricing.base_price).toFixed(2)}`
      : undefined;
    const categoryStr = CATEGORY_LABELS[index % CATEGORY_LABELS.length];
    const badgeStr = oldPriceStr ? "SALE"
      : index % 4 === 0 ? "IN STOCK"
      : index % 4 === 3 ? "NEW"
      : undefined;

    return {
      title: p.title,
      category: categoryStr,
      price: priceStr,
      oldPrice: oldPriceStr,
      image: getProductImage(p, index),
      badge: badgeStr,
      slug: p.slug,
      href: themeLink(`/product/${p.slug}`),
    };
  };

  const mapFallbackProduct = (p: typeof FALLBACK_TRENDING_PRODUCTS[number]) => ({
    ...p,
    href: themeLink(`/product/${p.slug}`),
  });

  const trendingProductsList = products.length > 0
    ? products.slice(0, 4).map((p, idx) => mapApiProductToFrontend(p, idx))
    : useFallback
      ? FALLBACK_TRENDING_PRODUCTS.map(mapFallbackProduct)
      : [];

  const peripheralProductsList = products.length > 4
    ? products.slice(4, 8).map((p, idx) => mapApiProductToFrontend(p, idx + 4))
    : useFallback
      ? FALLBACK_PERIPHERAL_PRODUCTS.map(mapFallbackProduct)
      : products.length > 0
        ? products.slice(0, Math.min(4, products.length)).map((p, idx) => mapApiProductToFrontend(p, idx + 4))
        : [];

  return (
    <div className="ecommerce-electronics-wrapper">
      <style>{`
        @keyframes elPulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        .el-pulse { animation: elPulse 1.5s ease-in-out infinite; }
      `}</style>

      <ElectronicsHeader />

      {/* Hero */}
      <section className="el-hero">
        <div className="el-hero-bg" />
        <div className="el-hero-content">
          <div className="el-badge" style={{ position: 'relative', top: 0, left: 0, display: 'inline-block', marginBottom: '1.5rem' }}>{heroBadge}</div>
          <h1 className="el-hero-title">
            {heroTitle.split('\n').map((line, index, lines) => (
              <React.Fragment key={`${line}-${index}`}>
                {line}{index < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h1>
          <p className="el-hero-description">{heroDescription}</p>
          <div className="el-hero-cta-row">
            <a href={themeLink('/explore')} className="el-btn el-btn-primary">{heroPrimaryCta}</a>
            <a href={themeLink('/explore')} className="el-btn el-btn-outline">{heroSecondaryCta}</a>
          </div>
        </div>
        <div className="el-hero-image">
          <img src={heroImage} alt="Featured product" style={{ width: '100%', filter: 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.3))' }} />
        </div>
      </section>

      {/* Features Row */}
      <div className="el-spec-row" id="specs">
        <SpecFeature icon="⚡" title="Overclocked Out-of-Box" desc="Every component is stress-tested and pre-tuned for maximum stable performance." />
        <SpecFeature icon="🛡️" title="3-Year Warranty Plus" desc="Extended coverage on all premium hardware, including accidental damage protection." />
        <SpecFeature icon="🚀" title="Same-Day Dispatch" desc="Order by 4 PM EST for guaranteed same-day shipping via overnight couriers." />
      </div>

      {apiError && useFallback && (
        <div style={{ margin: '0 5% 2rem' }}>
          <CatalogSyncAlert variant="demo" error={apiError} classPrefix="el" />
        </div>
      )}
      {apiError && !useFallback && (
        <div style={{ margin: '0 5% 2rem' }}>
          <CatalogSyncAlert variant="production" error={apiError} classPrefix="el" />
        </div>
      )}

      {/* Trending Products */}
      <section className="el-section" id="components">
        <h2 className="el-section-title">{trendingTitle}</h2>
        <div className="el-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="el-product-card el-pulse">
                <div style={{ height: '200px', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px', marginBottom: '1.5rem' }} />
                <div style={{ height: '12px', width: '40%', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px', marginBottom: '0.5rem' }} />
                <div style={{ height: '20px', width: '80%', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px', marginBottom: '1rem' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ height: '24px', width: '30%', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px' }} />
                  <div style={{ height: '40px', width: '40px', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px' }} />
                </div>
              </div>
            ))
          ) : trendingProductsList.length > 0 ? (
            trendingProductsList.map((p, i) => <ProductCard key={i} {...p} />)
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', border: '1px solid var(--el-border)', borderRadius: '8px' }}>
              <p style={{ color: 'var(--el-text-muted)' }}>No products available yet. Publish inventory in the admin.</p>
              <a href={themeLink('/explore')} className="el-btn el-btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>Browse catalog</a>
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="el-promo-section">
        <div className="el-promo-content">
          <h2 className="el-promo-title el-tech-font">{promoTitle}</h2>
          <p className="el-promo-description">{promoDescription}</p>
          <a href={themeLink('/explore')} className="el-btn el-btn-primary">{promoCta}</a>
        </div>
        <div className="el-promo-bg" style={{ backgroundImage: `url(${promoImage})` }} />
      </section>

      {/* Peripherals */}
      <section className="el-section" id="peripherals">
        <h2 className="el-section-title">{peripheralsTitle}</h2>
        <div className="el-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="el-product-card el-pulse">
                <div style={{ height: '200px', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px', marginBottom: '1.5rem' }} />
                <div style={{ height: '12px', width: '40%', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px', marginBottom: '0.5rem' }} />
                <div style={{ height: '20px', width: '80%', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px', marginBottom: '1rem' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ height: '24px', width: '30%', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px' }} />
                  <div style={{ height: '40px', width: '40px', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px' }} />
                </div>
              </div>
            ))
          ) : peripheralProductsList.length > 0 ? (
            peripheralProductsList.map((p, i) => <ProductCard key={i} {...p} />)
          ) : null}
        </div>
      </section>

      <ElectronicsFooter />
    </div>
  );
}
