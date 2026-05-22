'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { ElectronicsHeader, ProductCard, SpecFeature, ElectronicsFooter } from './components';

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

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorTrace, setErrorTrace] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.getProducts();
        setProducts(res || []);
      } catch (err: any) {
        console.error("Laravel Database connection failure. Activating resilience fallback.", err);
        setErrorTrace(
          `DATABASE_OFFLINE_DIAGNOSTICS_TRACE\n` +
          `STATUS: [OFFLINE] | LATENCY: [TIMEOUT] | REASON: [${err.message || 'axios connection refused'}]\n` +
          `ACTION: Gracefully activated premium offline node resilience. Loading high-fidelity local catalog backups...`
        );
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getProductImage = (product: Product, index: number) => {
    if (product.media?.featured_image) {
      return product.media.featured_image;
    }
    if (product.image_url) {
      return product.image_url;
    }
    // High-fidelity fallback based on index
    return `/themes/ecommerce/electronics/${21 + (index % 8)}.webp`;
  };

  const getThemeLink = (path: string) => {
    if (typeof window !== 'undefined') {
      const isPreview = window.location.pathname.startsWith('/preview/');
      if (isPreview) {
        const themeKey = window.location.pathname.split('/')[2];
        return `/preview/${themeKey}${path}`;
      }
    }
    return path;
  };

  const mapApiProductToFrontend = (p: Product, index: number) => {
    const priceStr = p.pricing?.formatted || `$${Number(p.price).toFixed(2)}`;
    
    let oldPriceStr = undefined;
    if (p.pricing && p.pricing.base_price > p.pricing.sale_price) {
      oldPriceStr = `$${Number(p.pricing.base_price).toFixed(2)}`;
    }
    
    // Scoped category based on list index to maintain Envato aesthetics
    const fallbackCategories = [
      "Graphics Cards", "Processors", "Memory", "Monitors",
      "Mice", "Keyboards", "Audio", "Streaming"
    ];
    const categoryStr = fallbackCategories[index % fallbackCategories.length];
    
    let badgeStr = undefined;
    if (p.pricing && p.pricing.base_price > p.pricing.sale_price) {
      badgeStr = "SALE";
    } else if (index % 4 === 0) {
      badgeStr = "IN STOCK";
    } else if (index % 4 === 3) {
      badgeStr = "NEW";
    }

    return {
      title: p.title,
      category: categoryStr,
      price: priceStr,
      oldPrice: oldPriceStr,
      image: getProductImage(p, index),
      badge: badgeStr,
      slug: p.slug,
      onClick: () => {
        if (typeof window !== 'undefined') {
          window.location.href = getThemeLink(`/product/${p.slug}`);
        }
      }
    };
  };

  const hasDynamicProducts = !errorTrace && products.length > 0;

  const trendingProductsList = hasDynamicProducts
    ? products.slice(0, 4).map((p, idx) => mapApiProductToFrontend(p, idx))
    : FALLBACK_TRENDING_PRODUCTS.map(p => ({
        ...p,
        onClick: () => {
          if (typeof window !== 'undefined') {
            window.location.href = getThemeLink(`/product/${p.slug}`);
          }
        }
      }));

  const peripheralProductsList = hasDynamicProducts
    ? products.slice(4, 8).map((p, idx) => mapApiProductToFrontend(p, idx + 4))
    : FALLBACK_PERIPHERAL_PRODUCTS.map(p => ({
        ...p,
        onClick: () => {
          if (typeof window !== 'undefined') {
            window.location.href = getThemeLink(`/product/${p.slug}`);
          }
        }
      }));

  return (
    <div className="ecommerce-electronics-wrapper">
      <style>{`
        @keyframes elPulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        .el-pulse {
          animation: elPulse 1.5s ease-in-out infinite;
        }
        .el-diagnostics-card {
          background-color: var(--el-bg-card);
          border: 1px solid var(--el-secondary);
          border-radius: 8px;
          padding: 2rem;
          margin: 2rem 5%;
          box-shadow: 0 0 20px rgba(255, 0, 85, 0.15);
        }
        .el-diagnostics-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--el-secondary);
          font-family: var(--el-font-tech);
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: 1px;
        }
        .el-diagnostics-trace {
          background-color: #0f1115;
          border: 1px solid var(--el-border);
          padding: 1.5rem;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.85rem;
          color: #ff88a8;
          overflow-x: auto;
          margin-top: 1rem;
          white-space: pre-wrap;
          line-height: 1.5;
        }
      `}</style>

      <ElectronicsHeader />

      {/* Hero */}
      <section className="el-hero">
        <div className="el-hero-bg"></div>
        <div className="el-hero-content">
            <div className="el-badge" style={{ position: 'relative', top: 0, left: 0, display: 'inline-block', marginBottom: '1.5rem' }}>NEXT GEN RELEASE</div>
            <h1 className="el-hero-title">QUANTUM<br/>PERFORMANCE</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--el-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                Experience untethered speed with the all-new line of RTX 50-Series Architecture. Built for the creators of tomorrow.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#components" className="el-btn el-btn-primary">Shop Now</a>
                <a href="#specs" className="el-btn el-btn-outline">View Specs</a>
            </div>
        </div>
        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', zIndex: 2, width: '45%' }}>
            <img src="/themes/ecommerce/electronics/29.webp" alt="Hero GPU" style={{ width: '100%', filter: 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.3))' }} />
        </div>
      </section>

      {/* Features Row */}
      <div className="el-spec-row" id="specs">
          <SpecFeature icon="⚡" title="Overclocked Out-of-Box" desc="Every component is stress-tested and pre-tuned for maximum stable performance." />
          <SpecFeature icon="🛡️" title="3-Year Warranty Plus" desc="Extended coverage on all premium hardware, including accidental damage protection." />
          <SpecFeature icon="🚀" title="Same-Day Dispatch" desc="Order by 4 PM EST for guaranteed same-day shipping via overnight couriers." />
      </div>

      {/* Resilience Warning Diagnostic Tracer */}
      {errorTrace && (
        <div className="el-diagnostics-card" id="el-diagnostics-notice">
          <div className="el-diagnostics-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>DATABASE CONNECTION WARNING</span>
          </div>
          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            The dynamic Laravel API database is currently offline. Activating premium local node resilience fallback.
          </p>
          <pre className="el-diagnostics-trace">{errorTrace}</pre>
        </div>
      )}

      {/* Trending Products */}
      <section className="el-section" id="components">
          <h2 className="el-section-title">TRENDING HARDWARE</h2>
          <div className="el-grid">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="el-product-card el-pulse">
                    <div style={{ height: '200px', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px', marginBottom: '1.5rem' }}></div>
                    <div style={{ height: '12px', width: '40%', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                    <div style={{ height: '20px', width: '80%', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px', marginBottom: '1rem' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <div style={{ height: '24px', width: '30%', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px' }}></div>
                      <div style={{ height: '40px', width: '40px', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))
              ) : (
                trendingProductsList.map((p, i) => <ProductCard key={i} {...p} />)
              )}
          </div>
      </section>

      {/* Promo Banner */}
      <section style={{ margin: '2rem 5%', background: 'linear-gradient(90deg, #1a1d24, #0f1115)', border: '1px solid var(--el-primary)', borderRadius: '8px', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
              <h2 className="el-tech-font" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>BUILD YOUR DREAM PC</h2>
              <p style={{ color: 'var(--el-text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Use our interactive 3D configurator to ensure 100% compatibility and visualize your custom rig before you buy.</p>
              <button className="el-btn el-btn-primary">Launch Configurator</button>
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', background: 'url(/themes/ecommerce/electronics/30.webp) center/cover', opacity: 0.4, maskImage: 'linear-gradient(to left, black, transparent)', WebkitMaskImage: 'linear-gradient(to left, black, transparent)' }}></div>
      </section>

      {/* Peripherals */}
      <section className="el-section" id="peripherals">
          <h2 className="el-section-title">PRO PERIPHERALS</h2>
          <div className="el-grid">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="el-product-card el-pulse">
                    <div style={{ height: '200px', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px', marginBottom: '1.5rem' }}></div>
                    <div style={{ height: '12px', width: '40%', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                    <div style={{ height: '20px', width: '80%', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px', marginBottom: '1rem' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <div style={{ height: '24px', width: '30%', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px' }}></div>
                      <div style={{ height: '40px', width: '40px', backgroundColor: 'var(--el-border)', opacity: 0.3, borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))
              ) : (
                peripheralProductsList.map((p, i) => <ProductCard key={i} {...p} />)
              )}
          </div>
      </section>

      <ElectronicsFooter />
    </div>
  );
}
