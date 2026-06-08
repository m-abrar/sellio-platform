'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@sellio/api-client';
import type { Product } from '@sellio/types';
import { ElectronicsHeader, ProductCard, ElectronicsFooter } from './components';

interface ProductPageProps {
  slug: string;
}

interface SpecOrderForm {
  name: string;
  email: string;
  tuningRequests: string;
}

const getFallbackProduct = (slug: string): any => {
  const fallbacks: Record<string, any> = {
    'nvidia-rtx-5090-ti': {
      id: 201,
      title: "NVIDIA RTX 5090 Ti Founders Edition",
      slug: "nvidia-rtx-5090-ti",
      description: "Unleash extreme graphics acceleration with the custom founders edition RTX 5090 Ti. Featuring next-generation quantum ray tracing cores, 32GB GDDR7 high-bandwidth memory, and premium vapor-chamber cooling thermal architectures built for extreme builders.",
      price: 1999.00,
      pricing: { base_price: 1999.00, sale_price: 1999.00, current_price: 1999.00, formatted: "$1,999.00", currency_symbol: "$" },
      category_id: 1,
      image_url: "/themes/ecommerce/electronics/21.webp",
      specs: { category: "Graphics Cards", brand: "NVIDIA", warranty: "3-Year Founders Warranty", power: "600W PCIe 5.0", status: "IN STOCK" }
    },
    'amd-ryzen-9-9950x': {
      id: 202,
      title: "AMD Ryzen 9 9950X Processor",
      slug: "amd-ryzen-9-9950x",
      description: "Dominating raw computing benchmarks, the Ryzen 9 9950X powers demanding game rendering pipelines and complex deep learning routines. Offers 16 high-efficiency cores, 32 computing threads, and boost frequencies up to 5.7GHz.",
      price: 699.99,
      pricing: { base_price: 749.99, sale_price: 699.99, current_price: 699.99, formatted: "$699.99", currency_symbol: "$" },
      category_id: 1,
      image_url: "/themes/ecommerce/electronics/22.webp",
      specs: { category: "Processors", brand: "AMD", warranty: "3-Year Limited", power: "170W AM5 Socket", status: "SALE" }
    },
    'corsair-dominator-titanium-64gb': {
      id: 203,
      title: "Corsair Dominator Titanium 64GB DDR5",
      slug: "corsair-dominator-titanium-64gb",
      description: "Engineered for record-breaking overclocking runs, Dominator Titanium pairs premium ICs with dynamic custom RGB diffuse tubes and sleek forged-aluminum heat-spreaders.",
      price: 349.99,
      pricing: { base_price: 349.99, sale_price: 349.99, current_price: 349.99, formatted: "$349.99", currency_symbol: "$" },
      category_id: 1,
      image_url: "/themes/ecommerce/electronics/23.webp",
      specs: { category: "Memory", brand: "Corsair", warranty: "Lifetime Warranty", power: "1.4V XMP 3.0 Profile", status: "IN STOCK" }
    },
    'asus-rog-swift-oled-32': {
      id: 204,
      title: "ASUS ROG Swift OLED 32\" 4K 240Hz",
      slug: "asus-rog-swift-oled-32",
      description: "Dive into ultra-fluid visuals with the premium 32-inch 4K OLED gaming display. Achieving a blistering 240Hz refresh rate and 0.03ms response time with custom heat dissipation pads.",
      price: 1299.00,
      pricing: { base_price: 1299.00, sale_price: 1299.00, current_price: 1299.00, formatted: "$1,299.00", currency_symbol: "$" },
      category_id: 1,
      image_url: "/themes/ecommerce/electronics/24.webp",
      specs: { category: "Monitors", brand: "ASUS ROG", warranty: "3-Year OLED Burn-In Coverage", power: "External Adaptor", status: "NEW" }
    },
    'logitech-g-pro-x-superlight-2': {
      id: 205,
      title: "Logitech G Pro X Superlight 2",
      slug: "logitech-g-pro-x-superlight-2",
      description: "The trusted competitive esports companion mouse. Boasts the advanced HERO 2 sensor operating at up to 32,000 DPI and dual hybrid optic-mechanical switches at only 60 grams.",
      price: 159.99,
      pricing: { base_price: 159.99, sale_price: 159.99, current_price: 159.99, formatted: "$159.99", currency_symbol: "$" },
      category_id: 2,
      image_url: "/themes/ecommerce/electronics/25.webp",
      specs: { category: "Mice", brand: "Logitech G", warranty: "2-Year Hardware", power: "USB-C Rechargeable", status: "IN STOCK" }
    },
    'wooting-60he-analog-keyboard': {
      id: 206,
      title: "Wooting 60HE+ Analog Keyboard",
      slug: "wooting-60he-analog-keyboard",
      description: "The ultimate raw competitive mechanical keyboard. Dynamic magnetic Hall-effect switches allow variable rapid-trigger configurations and 0.1mm actuation adjustments.",
      price: 174.99,
      pricing: { base_price: 174.99, sale_price: 174.99, current_price: 174.99, formatted: "$174.99", currency_symbol: "$" },
      category_id: 2,
      image_url: "/themes/ecommerce/electronics/26.webp",
      specs: { category: "Keyboards", brand: "Wooting", warranty: "2-Year Parts", power: "Detachable USB-C", status: "IN STOCK" }
    },
    'audeze-maxwell-wireless': {
      id: 207,
      title: "Audeze Maxwell Wireless Gaming Headset",
      slug: "audeze-maxwell-wireless",
      description: "Experience absolute high-fidelity spatial gaming audio with large 90mm planar magnetic speaker drivers, Bluetooth 5.3 LE, and an integrated AI-enhanced noise-canceling mic.",
      price: 299.00,
      pricing: { base_price: 299.00, sale_price: 299.00, current_price: 299.00, formatted: "$299.00", currency_symbol: "$" },
      category_id: 2,
      image_url: "/themes/ecommerce/electronics/27.webp",
      specs: { category: "Audio", brand: "Audeze", warranty: "1-Year Planar Driver Coverage", power: "80hr Fast-Charge Battery", status: "IN STOCK" }
    },
    'elgato-stream-deck': {
      id: 208,
      title: "Elgato Stream Deck +",
      slug: "elgato-stream-deck",
      description: "Empower your streaming studio console setup. Integrates 8 customizable LCD keys, 4 dynamic tactile rotary encoders, and a sleek touch screen interface to manage scenes.",
      price: 199.99,
      pricing: { base_price: 199.99, sale_price: 199.99, current_price: 199.99, formatted: "$199.99", currency_symbol: "$" },
      category_id: 2,
      image_url: "/themes/ecommerce/electronics/28.webp",
      specs: { category: "Streaming", brand: "Elgato", warranty: "2-Year Retail Warranty", power: "USB Bus Powered", status: "IN STOCK" }
    }
  };

  const resolved = fallbacks[slug];
  if (resolved) return resolved;

  // Generic fallback if slug is not matched
  const titleStr = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    id: 999,
    title: titleStr,
    slug: slug,
    description: "Upgrade your high-performance computing system with this state-of-the-art tech hardware. Precision engineered, factory stress-tested, and fully compatible with modern PCIe 5.0 systems.",
    price: 499.99,
    pricing: { base_price: 549.99, sale_price: 499.99, current_price: 499.99, formatted: "$499.99", currency_symbol: "$" },
    category_id: 1,
    image_url: "/themes/ecommerce/electronics/21.webp",
    specs: { category: "Hardware", brand: "NeuralGear", warranty: "3-Year Premium Plus", power: "Standard PCIe Socket", status: "IN STOCK" }
  };
};

export default function ProductPage({ slug }: ProductPageProps) {
  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorTrace, setErrorTrace] = useState<string | null>(null);

  // Form states
  const [form, setForm] = useState<SpecOrderForm>({ name: '', email: '', tuningRequests: '' });
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrorTrace(null);
        
        // Load target product by slug
        const fetched = await api.getProductBySlug(slug);
        if (fetched) {
          setProduct(fetched);
          
          // Query related listings
          const list = await api.getProducts();
          if (list && list.length > 0) {
            const filtered = list.filter(p => p.slug !== slug);
            setRelatedProducts(filtered.slice(0, 4));
          }
        } else {
          throw new Error("Empty details response returned from dynamic API node.");
        }
      } catch (err: any) {
        console.error("Laravel Database connection failure. Activating resilience fallback.", err);
        setErrorTrace(
          `DATABASE_OFFLINE_DIAGNOSTICS_TRACE\n` +
          `STATUS: [OFFLINE] | LATENCY: [TIMEOUT] | REASON: [${err.message || 'axios connection refused'}]\n` +
          `ACTION: Gracefully activated premium offline node resilience. Loading high-fidelity local catalog backups...`
        );
        // Map resilience fallbacks
        const targetFallback = getFallbackProduct(slug);
        setProduct(targetFallback);

        // Load fallback related listings
        const fallbacksList = [
          getFallbackProduct('nvidia-rtx-5090-ti'),
          getFallbackProduct('amd-ryzen-9-9950x'),
          getFallbackProduct('corsair-dominator-titanium-64gb'),
          getFallbackProduct('asus-rog-swift-oled-32'),
          getFallbackProduct('logitech-g-pro-x-superlight-2'),
          getFallbackProduct('wooting-60he-analog-keyboard')
        ].filter(p => p.slug !== slug);
        setRelatedProducts(fallbacksList.slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const getProductImage = (p: any, index: number) => {
    if (p.media?.featured_image) {
      return p.media.featured_image;
    }
    if (p.image_url) {
      return p.image_url;
    }
    return `/themes/ecommerce/electronics/${21 + (index % 8)}.webp`;
  };

  const getPriceStr = (p: any) => {
    return p.pricing?.formatted || `$${Number(p.price).toFixed(2)}`;
  };

  const getOldPriceStr = (p: any) => {
    if (p.pricing && p.pricing.base_price > p.pricing.sale_price) {
      return `$${Number(p.pricing.base_price).toFixed(2)}`;
    }
    return undefined;
  };

  const getSpecValue = (key: string, index: number) => {
    if (product?.specs?.[key]) {
      return product.specs[key];
    }
    const defaults: Record<string, string[]> = {
      category: ["Graphics Cards", "Processors", "Memory", "Monitors"],
      brand: ["NVIDIA", "AMD", "Corsair", "ASUS ROG"],
      warranty: ["3-Year Founders Warranty", "3-Year Limited Warranty", "Lifetime Warranty", "3-Year OLED Burn-In Coverage"],
      power: ["600W PCIe 5.0", "170W AM5 Socket", "1.4V XMP Profile", "External Power Adaptor"],
      status: ["IN STOCK", "SALE", "NEW", "LIMITED STOCK"]
    };
    const list = defaults[key];
    return list ? list[index % list.length] : "NeuralGear Verified";
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Record booking order to localStorage for localized client persistence
      const activeOrders = JSON.parse(localStorage.getItem('sellio_ecommerce_electronics_orders') || '[]');
      const newOrder = {
        id: Date.now(),
        productSlug: slug,
        productTitle: product?.title || 'Unknown Hardware',
        price: getPriceStr(product),
        quantity: quantity,
        customerName: form.name,
        customerEmail: form.email,
        tuningRequests: form.tuningRequests,
        timestamp: new Date().toISOString()
      };
      activeOrders.push(newOrder);
      localStorage.setItem('sellio_ecommerce_electronics_orders', JSON.stringify(activeOrders));

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
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
        .el-product-detail-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          padding: 3rem 5%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .el-breadcrumbs {
          padding: 2rem 5% 0;
          color: var(--el-text-muted);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .el-breadcrumbs a {
          color: var(--el-primary);
          text-decoration: none;
          margin-right: 0.5rem;
        }
        .el-breadcrumbs span {
          margin-right: 0.5rem;
        }
        .el-scanned-image-wrap {
          position: relative;
          background-color: var(--el-bg-card);
          border: 1px solid var(--el-border);
          border-radius: 8px;
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 500px;
          overflow: hidden;
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8);
        }
        .el-scanned-image-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0, 229, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
          z-index: 1;
        }
        .el-scanned-reticle {
          position: absolute;
          inset: 2rem;
          border: 1px solid rgba(0, 229, 255, 0.15);
          pointer-events: none;
          z-index: 2;
        }
        .el-scanned-reticle::before,
        .el-scanned-reticle::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          border-color: var(--el-primary);
          border-style: solid;
        }
        .el-scanned-reticle::before {
          top: -2px; left: -2px; border-width: 2px 0 0 2px;
        }
        .el-scanned-reticle::after {
          bottom: -2px; right: -2px; border-width: 0 2px 2px 0;
        }
        .el-image-scanline {
          position: absolute;
          width: 100%;
          height: 2px;
          background-color: var(--el-primary);
          opacity: 0.5;
          box-shadow: 0 0 10px var(--el-primary);
          animation: elScan 4s linear infinite;
          z-index: 3;
          pointer-events: none;
        }
        @keyframes elScan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .el-detail-img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          z-index: 2;
          filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.15));
        }
        .el-inquiry-box {
          background-color: var(--el-bg-card);
          border: 1px solid var(--el-border);
          border-radius: 8px;
          padding: 2.5rem;
          margin-top: 2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        .el-input-group {
          margin-bottom: 1.5rem;
        }
        .el-input-group label {
          display: block;
          color: var(--el-text-muted);
          font-family: var(--el-font-tech);
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }
        .el-input-field {
          width: 100%;
          background-color: #0f1115;
          border: 1px solid var(--el-border);
          padding: 0.8rem 1rem;
          color: white;
          font-family: var(--el-font-sans);
          border-radius: 4px;
          outline: none;
          transition: var(--el-transition);
        }
        .el-input-field:focus {
          border-color: var(--el-primary);
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
        }
        .el-qty-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
          background-color: #0f1115;
          border: 1px solid var(--el-border);
          border-radius: 4px;
          padding: 0.4rem;
          width: fit-content;
        }
        .el-qty-btn {
          width: 32px;
          height: 32px;
          background-color: var(--el-bg-card);
          border: 1px solid var(--el-border);
          color: white;
          cursor: pointer;
          font-weight: bold;
          border-radius: 4px;
          transition: var(--el-transition);
        }
        .el-qty-btn:hover {
          background-color: var(--el-primary);
          color: black;
          border-color: var(--el-primary);
        }
        .el-qty-val {
          font-family: var(--el-font-tech);
          font-weight: bold;
          width: 24px;
          text-align: center;
        }
        .el-specs-table {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
          border-top: 1px solid var(--el-border);
          padding-top: 2rem;
        }
        .el-spec-node {
          background-color: #0f1115;
          border: 1px solid var(--el-border);
          border-radius: 4px;
          padding: 1rem;
        }
        .el-spec-lbl {
          font-size: 0.8rem;
          color: var(--el-text-muted);
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }
        .el-spec-val {
          font-family: var(--el-font-tech);
          font-weight: 600;
          color: white;
          font-size: 0.95rem;
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
        @media (max-width: 992px) {
          .el-product-detail-layout {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .el-scanned-image-wrap {
            height: 350px !important;
          }
        }
      `}</style>

      <ElectronicsHeader />

      {/* Breadcrumbs */}
      <div className="el-breadcrumbs">
        <a href={getThemeLink('/')}>Showroom</a>
        <span>/</span>
        <span style={{ color: 'white' }}>{loading ? 'SYNCING...' : product?.title}</span>
      </div>

      {/* Diagnostics Tracing Warning */}
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

      {/* Main Details Panel */}
      {loading ? (
        <div className="el-product-detail-layout">
          {/* Left Side Shimmer */}
          <div className="el-pulse" style={{ height: '500px', backgroundColor: 'var(--el-bg-card)', border: '1px solid var(--el-border)', borderRadius: '8px' }}></div>
          {/* Right Side Shimmer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="el-pulse" style={{ height: '35px', width: '70%', backgroundColor: 'var(--el-bg-card)', borderRadius: '4px' }}></div>
            <div className="el-pulse" style={{ height: '15px', width: '30%', backgroundColor: 'var(--el-bg-card)', borderRadius: '4px' }}></div>
            <div className="el-pulse" style={{ height: '120px', width: '100%', backgroundColor: 'var(--el-bg-card)', borderRadius: '4px' }}></div>
            <div className="el-pulse" style={{ height: '300px', width: '100%', backgroundColor: 'var(--el-bg-card)', borderRadius: '4px' }}></div>
          </div>
        </div>
      ) : (
        <div className="el-product-detail-layout">
          {/* Left Column: Custom Scanned Image */}
          <div>
            <div className="el-scanned-image-wrap">
              <div className="el-scanned-reticle"></div>
              <div className="el-image-scanline"></div>
              <img 
                src={getProductImage(product, product.id)} 
                alt={product.title} 
                className="el-detail-img" 
              />
            </div>
            
            {/* Spec Table */}
            <div className="el-specs-table">
              <div className="el-spec-node">
                <div className="el-spec-lbl">Category</div>
                <div className="el-spec-val">{getSpecValue('category', product.id)}</div>
              </div>
              <div className="el-spec-node">
                <div className="el-spec-lbl">Brand</div>
                <div className="el-spec-val">{getSpecValue('brand', product.id)}</div>
              </div>
              <div className="el-spec-node">
                <div className="el-spec-lbl">Warranty</div>
                <div className="el-spec-val">{getSpecValue('warranty', product.id)}</div>
              </div>
              <div className="el-spec-node">
                <div className="el-spec-lbl">Specs / Power</div>
                <div className="el-spec-val">{getSpecValue('power', product.id)}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Text Information & Order Console */}
          <div>
            <span className="el-badge" style={{ position: 'static', display: 'inline-block', marginBottom: '1.5rem' }}>
              {getSpecValue('status', product.id)}
            </span>
            <h1 className="el-tech-font" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'white', marginBottom: '1rem', lineHeight: 1.1 }}>
              {product.title}
            </h1>
            
            {/* Price Tags */}
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '2rem' }}>
              <span className="el-price" style={{ fontSize: '2.5rem' }}>{getPriceStr(product)}</span>
              {getOldPriceStr(product) && (
                <span className="el-price-old" style={{ fontSize: '1.4rem', marginLeft: '1rem' }}>{getOldPriceStr(product)}</span>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--el-text-muted)', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '2.5rem' }}>
              {product.description}
            </p>

            {/* Order inquiry Console */}
            <div className="el-inquiry-box">
              {isSubmitted ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ fontSize: '3rem', color: 'var(--el-primary)', marginBottom: '1.5rem' }}>✓</div>
                  <h3 className="el-tech-font" style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>TUNING PROTOCOL INITIALIZED</h3>
                  <p style={{ color: 'var(--el-text-muted)', lineHeight: 1.6 }}>
                    Our master hardware rig builders have loaded your customization request. A technical diagnostics engineer will contact you shortly at <strong>{form.email}</strong>.
                  </p>
                  <button 
                    className="el-btn el-btn-outline" 
                    style={{ marginTop: '2rem', padding: '0.8rem 2.5rem' }} 
                    onClick={() => { setIsSubmitted(false); setForm({ name: '', email: '', tuningRequests: '' }); setQuantity(1); }}
                  >
                    SUBMIT NEW PROTOCOL
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit}>
                  <h3 className="el-tech-font" style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1.5rem', borderBottom: '1px solid var(--el-border)', paddingBottom: '0.75rem' }}>
                    INITIALIZE ORDER PROTOCOL
                  </h3>

                  <div className="el-input-group">
                    <label>YOUR OPERATOR NAME</label>
                    <input 
                      type="text" 
                      className="el-input-field" 
                      placeholder="e.g. Neo Builder" 
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="el-input-group">
                    <label>SECURE DISPATCH EMAIL</label>
                    <input 
                      type="email" 
                      className="el-input-field" 
                      placeholder="e.g. operator@neuralgear.tech" 
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  {/* Quantity Counter */}
                  <div className="el-input-group">
                    <label>ORDER QUANTITY</label>
                    <div className="el-qty-selector">
                      <button 
                        type="button" 
                        className="el-qty-btn" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="el-qty-val">{quantity}</span>
                      <button 
                        type="button" 
                        className="el-qty-btn" 
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="el-input-group">
                    <label>CUSTOM OVERCLOCKING & PERFORMANCE REQUESTS</label>
                    <textarea 
                      className="el-input-field" 
                      style={{ minHeight: '100px', resize: 'vertical' }}
                      placeholder="e.g. Pre-applied Liquid Metal thermal grease, stress test diagnostics logs, custom BIOS profiles..."
                      value={form.tuningRequests}
                      onChange={(e) => setForm({ ...form, tuningRequests: e.target.value })}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="el-btn el-btn-primary" 
                    style={{ width: '100%', marginTop: '1rem', padding: '1rem 0' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'TRANSMITTING...' : 'TRANSMIT TUNING PROTOCOL'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Related Products Section */}
      {!loading && relatedProducts.length > 0 && (
        <section className="el-section" style={{ borderTop: '1px solid var(--el-border)', marginTop: '4rem' }}>
          <h2 className="el-section-title">COMPATIBLE VENTURES // RELATED HARDWARE</h2>
          <div className="el-grid">
            {relatedProducts.map((p, i) => (
              <ProductCard 
                key={p.id || i}
                title={p.title}
                category={getSpecValue('category', p.id || i + 3)}
                price={getPriceStr(p)}
                oldPrice={getOldPriceStr(p)}
                image={getProductImage(p, p.id || i + 3)}
                badge={getOldPriceStr(p) ? 'SALE' : undefined}
                // Custom routing redirect
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = getThemeLink(`/product/${p.slug}`);
                  }
                }}
              />
            ))}
          </div>
        </section>
      )}

      <ElectronicsFooter />
    </div>
  );
}
