import React from 'react';

export const GlassNav = () => (
  <nav className="glass-nav">
    <div className="modern-logo">SELLIO</div>
    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
      <span>Products</span>
      <span>Solutions</span>
      <span>Developers</span>
    </div>
    <button style={{ 
      background: 'var(--color-midnight)', 
      color: 'white', 
      padding: '0.6rem 1.5rem', 
      borderRadius: '100px', 
      border: 'none', 
      fontWeight: 700,
      fontSize: '0.85rem'
    }}>
      Get Started
    </button>
  </nav>
);

export const BentoCard = ({ title, icon, description }: { title: string, icon: string, description: string }) => (
  <div className="bento-card-modern">
    <div className="bento-icon-wrapper">{icon}</div>
    <h3 className="bento-card-title">{title}</h3>
    <p style={{ fontSize: '0.9rem', opacity: 0.6, lineHeight: '1.6' }}>{description}</p>
  </div>
);

export const SaaSFooter = () => (
  <footer className="saas-footer">
    <div>
      <div className="modern-logo" style={{ marginBottom: '1.5rem' }}>SELLIO</div>
      <p style={{ opacity: 0.5, maxWidth: '300px', fontSize: '0.9rem' }}>The next-generation commerce engine for modern industries. Scale faster with Sellio.</p>
    </div>
    {['Platform', 'Company', 'Legal'].map(cat => (
      <div key={cat}>
        <h4 style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>{cat}</h4>
        <ul style={{ listStyle: 'none', padding: 0, opacity: 0.6, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <li>Feature Link</li>
          <li>Solution Link</li>
          <li>Support Center</li>
        </ul>
      </div>
    ))}
  </footer>
);
