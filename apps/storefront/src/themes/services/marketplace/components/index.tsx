'use client';
import React from 'react';

export const Header = () => (
  <header style={{ 
    position: 'fixed', 
    top: '2rem', 
    left: '50%', 
    transform: 'translateX(-50%)', 
    width: '90%', 
    maxWidth: '1400px', 
    zIndex: 1000 
  }}>
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(20px)', 
      border: '1px solid var(--sm-border)', 
      borderRadius: '100px', 
      padding: '0.8rem 3rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 20px 40px rgba(30, 77, 78, 0.05)'
    }}>
      <div style={{ fontFamily: 'var(--sm-font-heading)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--sm-forest)' }}>
        SERVICE<span style={{ color: 'var(--sm-clay)' }}>HUB</span>
      </div>
      
      <nav style={{ display: 'flex', gap: '3rem' }}>
        {['EXPERTS', 'CATEGORIES', 'HOW_IT_WORKS', 'PRICING'].map(item => (
          <span key={item} className="sm-mono" style={{ fontSize: '0.65rem', cursor: 'pointer' }}>
            {item}
          </span>
        ))}
      </nav>

      <button className="sm-btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '0.8rem' }}>
        ACCESS_TALENT
      </button>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="sm-section" style={{ background: 'var(--sm-sage)', borderRadius: 'var(--sm-radius) var(--sm-radius) 0 0' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6rem' }}>
      <div>
        <div style={{ fontFamily: 'var(--sm-font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--sm-forest)', marginBottom: '2rem' }}>SERVICEHUB</div>
        <p style={{ color: 'var(--sm-text-muted)', lineHeight: 1.8, maxWidth: '350px' }}>
            Connecting high-fidelity talent with global project nodes. Human-centric solutions for the digital economy.
        </p>
      </div>
      
      {[
        { title: 'VERTICALS', links: ['Legal', 'Finance', 'Tech', 'Design'] },
        { title: 'RESOURCES', links: ['Case Studies', 'Expert Blog', 'Protocol', 'Safety'] },
        { title: 'SUPPORT', links: ['Help Center', 'Verification', 'Disputes', 'Auth'] }
      ].map(col => (
        <div key={col.title}>
          <div className="sm-mono" style={{ marginBottom: '2.5rem' }}>{col.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {col.links.map(link => (
              <span key={link} style={{ color: 'var(--sm-text-muted)', fontSize: '0.95rem', cursor: 'pointer' }}>{link}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
    
    <div style={{ marginTop: '8rem', paddingTop: '3rem', borderTop: '1px solid var(--sm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sm-mono" style={{ fontSize: '0.65rem', opacity: 0.6 }}>© 2026 SELLIO_SERVICES_NODE // ALL_DATA_ENCRYPTED</div>
        <div style={{ display: 'flex', gap: '3rem' }}>
            {['INSTAGRAM', 'LINKEDIN', 'X_PLATFORM'].map(social => (
                <span key={social} className="sm-mono" style={{ fontSize: '0.65rem' }}>{social}</span>
            ))}
        </div>
    </div>
  </footer>
);

export const ExpertCard = ({ name, category, rating, jobs, image }: any) => (
  <div className="sm-expert-card">
    <img src={image} alt={name} className="sm-expert-image" />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div className="sm-mono" style={{ fontSize: '0.6rem', color: 'var(--sm-clay)' }}>{category}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.9rem' }}>
            ⭐ {rating}
        </div>
    </div>
    <h3 style={{ fontFamily: 'var(--sm-font-heading)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>{name}</h3>
    <div style={{ color: 'var(--sm-text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>{jobs} Projects Completed</div>
    
    <button className="sm-btn-primary" style={{ width: '100%', borderRadius: '20px' }}>
        BOOK_CONSULTATION
    </button>
  </div>
);

export const CategoryCard = ({ icon, label }: any) => (
  <div className="sm-cat-card">
    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{icon}</div>
    <div style={{ fontFamily: 'var(--sm-font-heading)', fontWeight: 800, fontSize: '1.25rem' }}>{label}</div>
  </div>
);
