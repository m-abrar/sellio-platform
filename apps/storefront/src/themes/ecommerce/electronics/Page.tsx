'use client';
import React from 'react';
import { ElectronicsHeader, ProductCard, SpecFeature, ElectronicsFooter } from './components';

export default function Page() {
  const trendingProducts = [
    { title: "NVIDIA RTX 5090 Ti Founders Edition", category: "Graphics Cards", price: "$1,999.00", image: "/themes/ecommerce/electronics/21.webp", badge: "IN STOCK" },
    { title: "AMD Ryzen 9 9950X Processor", category: "Processors", price: "$699.99", oldPrice: "$749.99", image: "/themes/ecommerce/electronics/22.webp", badge: "SALE" },
    { title: "Corsair Dominator Titanium 64GB DDR5", category: "Memory", price: "$349.99", image: "/themes/ecommerce/electronics/23.webp" },
    { title: "ASUS ROG Swift OLED 32\" 4K 240Hz", category: "Monitors", price: "$1,299.00", image: "/themes/ecommerce/electronics/24.webp", badge: "NEW" },
  ];

  const peripheralProducts = [
    { title: "Logitech G Pro X Superlight 2", category: "Mice", price: "$159.99", image: "/themes/ecommerce/electronics/25.webp" },
    { title: "Wooting 60HE+ Analog Keyboard", category: "Keyboards", price: "$174.99", image: "/themes/ecommerce/electronics/26.webp" },
    { title: "Audeze Maxwell Wireless Gaming Headset", category: "Audio", price: "$299.00", image: "/themes/ecommerce/electronics/27.webp" },
    { title: "Elgato Stream Deck +", category: "Streaming", price: "$199.99", image: "/themes/ecommerce/electronics/28.webp" },
  ];

  return (
    <div className="ecommerce-electronics-wrapper">
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

      {/* Trending Products */}
      <section className="el-section" id="components">
          <h2 className="el-section-title">TRENDING HARDWARE</h2>
          <div className="el-grid">
              {trendingProducts.map((p, i) => <ProductCard key={i} {...p} />)}
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
              {peripheralProducts.map((p, i) => <ProductCard key={i} {...p} />)}
          </div>
      </section>

      <ElectronicsFooter />
    </div>
  );
}
