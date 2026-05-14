import React from 'react';
import './styles.css';

export default function Page() {
  return (
    <div className="modern-container">
      <main>
        <section className="modern-hero">
          <div className="hero-glow"></div>
          <h1 className="modern-title">
            The Future of <br />
            <span className="gradient-text">Unified Commerce</span>
          </h1>
          <p className="modern-subtitle">
            Empower your brand with a hyper-vertical marketplace engine designed for the next generation of digital retail.
          </p>
          <button className="modern-btn">Get Started Now</button>
        </section>

        <div className="modern-grid">
          <div className="modern-card">
            <div className="floating-asset" style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <h3>Infinite Scalability</h3>
            <p>
              Architected for speed and scale. Our engine handles millions of transactions with sub-millisecond latency.
            </p>
          </div>
          
          <div className="modern-card">
            <div className="floating-asset" style={{ fontSize: '2rem', marginBottom: '1rem', animationDelay: '1s' }}>🎨</div>
            <h3>Dynamic Theming</h3>
            <p>
              Instantly switch between high-fidelity layouts tailored for fashion, electronics, or grocery verticals.
            </p>
          </div>

          <div className="modern-card">
            <div className="floating-asset" style={{ fontSize: '2rem', marginBottom: '1rem', animationDelay: '2s' }}>📱</div>
            <h3>Native Experience</h3>
            <p>
              Seamlessly bridge the gap between web and mobile with our unified API-first architecture.
            </p>
          </div>
        </div>

        <section style={{ textAlign: 'center', paddingBottom: '8rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Ready to transform?</h2>
          <div style={{ opacity: 0.5 }}>Join 500+ premium brands scaling with Sellio.</div>
        </section>
      </main>
    </div>
  );
}
