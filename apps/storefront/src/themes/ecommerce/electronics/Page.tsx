
import React from 'react';
import { TechProductCard } from './components';

export default function Page() {
  const products = [
    { title: "NVIDIA RTX 5090 Ti", price: "$2,199", category: "GRAPHICS", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070" },
    { title: "Quantum-X UltraWide", price: "$1,499", category: "DISPLAY", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070" },
    { title: "Core-i11 16th Gen", price: "$699", category: "PROCESSOR", image: "https://images.unsplash.com/photo-1591405351990-4726e33df58d?q=80&w=2070" },
    { title: "NeuroMechanical K7", price: "$299", category: "INTERFACE", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2070" },
    { title: "HyperLink 10G Router", price: "$450", category: "NETWORK", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070" },
    { title: "ZeroLat Sonic Pods", price: "$199", category: "AUDIO", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="tech-hero">
          <div className="tech-hero-content">
              <span className="tech-badge">LATEST_GEN_AVAILABLE</span>
              <h1>The Next <br/>Iteration of <br/>Power.</h1>
              <p style={{ maxWidth: '500px', opacity: 0.6, lineHeight: 1.8, marginBottom: '3rem' }}>
                  Enterprise-grade hardware architecture optimized for the next decade of computational demand. 
              </p>
              <button style={{ 
                  background: 'var(--tech-primary)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '1.25rem 3rem', 
                  fontFamily: 'var(--font-tech)',
                  fontSize: '0.8rem',
                  letterSpacing: '2px'
              }}>
                  ENTER_ECOSYSTEM
              </button>
          </div>
          <div style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070" alt="Hardware" style={{ width: '100%', borderRadius: '2px', filter: 'grayscale(1) contrast(1.2)' }} />
              <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', padding: '2rem', background: 'var(--tech-accent)', color: 'black', fontFamily: 'var(--font-tech)', fontSize: '1rem', fontWeight: 900 }}>
                  v.4.0
              </div>
          </div>
      </section>

      {/* Specs Section */}
      <section className="spec-grid">
          <div className="spec-card">
              <div className="spec-icon">⚡</div>
              <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '0.9rem', marginBottom: '1rem' }}>Zero Latency</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Optimized data paths for instant response times.</p>
          </div>
          <div className="spec-card">
              <div className="spec-icon">🔒</div>
              <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '0.9rem', marginBottom: '1rem' }}>Core Security</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Hardware-level encryption for every transaction.</p>
          </div>
          <div className="spec-card">
              <div className="spec-icon">🌐</div>
              <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '0.9rem', marginBottom: '1rem' }}>Global Node</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Seamless integration with the Sellio network.</p>
          </div>
          <div className="spec-card" style={{ background: 'var(--tech-primary)', color: 'white' }}>
              <div className="spec-icon" style={{ color: 'white' }}>🚀</div>
              <h3 style={{ fontFamily: 'var(--font-tech)', fontSize: '0.9rem', marginBottom: '1rem' }}>Scale Ready</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Designed to grow with your industrial demand.</p>
          </div>
      </section>

      {/* Product Grid */}
      <section className="tech-product-grid">
          {products.map((p, i) => (
              <TechProductCard key={i} {...p} />
          ))}
      </section>

      {/* Full Width Feature */}
      <section style={{ padding: '10rem 10%', background: '#0a0a0a', color: 'white', display: 'flex', alignItems: 'center', gap: '8rem' }}>
          <div style={{ flex: 1 }}>
              <span style={{ color: 'var(--tech-accent)', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '4px' }}>MANUFACTURING_PROTOCOL</span>
              <h2 style={{ fontFamily: 'var(--font-tech)', fontSize: '3.5rem', marginTop: '2rem', marginBottom: '3rem' }}>Bespoke <br/>Infrastructure.</h2>
              <p style={{ opacity: 0.5, lineHeight: 2, marginBottom: '4rem' }}>
                  Need something custom? Our engineering nodes are ready to assemble bespoke hardware configurations tailored to your specific computational requirements.
              </p>
              <button style={{ border: '1px solid white', background: 'none', color: 'white', padding: '1rem 3rem', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px' }}>
                  CONTACT_ENGINEERING
              </button>
          </div>
          <div style={{ flex: 1, border: '1px solid #222', padding: '4rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {[1, 2, 3].map(i => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111', paddingBottom: '1rem' }}>
                          <span style={{ fontSize: '0.8rem', color: '#666' }}>NODE_0{i}_STATUS</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--tech-accent)' }}>OPERATIONAL</span>
                      </div>
                  ))}
              </div>
          </div>
      </section>
    </div>
  );
}
