
'use client';
import React from 'react';

export const MarketplaceHeader = () => (
  <header style={{ 
    position: 'fixed', 
    top: '1.5rem', 
    left: '50%', 
    transform: 'translateX(-50%)', 
    width: '94%', 
    maxWidth: '1600px', 
    zIndex: 1000 
  }}>
    <div style={{ 
      background: 'rgba(15, 23, 43, 0.8)', 
      backdropFilter: 'blur(16px)', 
      border: '1px solid rgba(255,255,255,0.08)', 
      borderRadius: '8px', 
      padding: '1rem 4rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    }}>
      <div style={{ fontFamily: 'var(--sm-font-heading)', fontWeight: 900, fontSize: '1.8rem', color: 'white', letterSpacing: '-1px' }}>
        TALENT<span style={{ color: 'var(--sm-accent)' }}>GRID</span>
      </div>
      
      <nav style={{ display: 'flex', gap: '4rem' }}>
        {['EXPERTS', 'VERTICALS', 'PROCESS', 'ENTERPRISE'].map(item => (
          <span key={item} style={{ fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', color: 'white', opacity: 0.6, letterSpacing: '2px' }}>
            {item}
          </span>
        ))}
      </nav>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>LOGIN</span>
          <button className="sm-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.75rem' }}>
            HIRE TALENT
          </button>
      </div>
    </div>
  </header>
);

export const MarketplaceFooter = () => (
  <footer className="sm-section" style={{ background: '#080E1E', borderTop: '1px solid var(--sm-border)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10rem' }}>
      <div>
        <div style={{ fontFamily: 'var(--sm-font-heading)', fontWeight: 900, fontSize: '2rem', color: 'white', marginBottom: '2.5rem' }}>TALENTGRID</div>
        <p style={{ color: 'var(--sm-text-dim)', lineHeight: 2, maxWidth: '400px', fontWeight: 300 }}>
            Connecting elite global talent with mission-critical projects. Precision matching for the modern digital enterprise.
        </p>
      </div>
      
      {[
        { title: 'DOMAINS', links: ['Legal Architecture', 'Finance Strategy', 'Cloud Engineering', 'Brand Experience'] },
        { title: 'PLATFORM', links: ['Case Studies', 'Talent Protocol', 'Security', 'Verification'] },
        { title: 'COMPANY', links: ['About Hub', 'Global Compliance', 'Legal', 'Privacy'] }
      ].map(col => (
        <div key={col.title}>
          <div style={{ color: 'var(--sm-accent)', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '3px', marginBottom: '3rem', textTransform: 'uppercase' }}>{col.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {col.links.map(link => (
              <span key={link} style={{ color: 'var(--sm-text-dim)', fontSize: '1rem', cursor: 'pointer', fontWeight: 300 }}>{link}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
    
    <div style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '1px solid var(--sm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4rem' }}>
        <div style={{ color: 'var(--sm-text-dim)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px' }}>© 2026 SELLIO TALENT GRID // PROTOCOL_SECURE</div>
        <div style={{ display: 'flex', gap: '4rem' }}>
            {['LINKEDIN', 'X', 'GITHUB'].map(social => (
                <span key={social} style={{ color: 'var(--sm-accent)', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', cursor: 'pointer' }}>{social}</span>
            ))}
        </div>
    </div>
  </footer>
);

export const ExpertCard = ({ name, category, rating, jobs, image }: any) => (
  <div className="sm-expert-card">
    <div className="sm-expert-image-wrapper">
        <img src={image} alt={name} className="sm-expert-image" />
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(15,23,42,0.8)', padding: '0.5rem 1rem', borderRadius: '4px', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#FACC15', fontSize: '0.8rem' }}>★</span>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>{rating}</span>
        </div>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
            <div className="sm-subheading" style={{ fontSize: '0.6rem', marginBottom: '0.5rem' }}>{category}</div>
            <h3 style={{ fontFamily: 'var(--sm-font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{name}</h3>
        </div>
    </div>
    
    <p style={{ color: 'var(--sm-text-dim)', fontSize: '0.95rem', marginBottom: '3rem', fontWeight: 300 }}>
        High-fidelity professional with over {jobs} verified project nodes completed.
    </p>
    
    <button className="sm-btn-primary" style={{ width: '100%', padding: '1.2rem' }}>
        ENGAGE TALENT
    </button>
  </div>
);

export const CategoryCard = ({ icon, label }: any) => (
  <div className="sm-cat-card">
    <div style={{ fontSize: '3.5rem', marginBottom: '2.5rem', filter: 'grayscale(1) brightness(2)' }}>{icon}</div>
    <div style={{ fontFamily: 'var(--sm-font-heading)', fontWeight: 800, fontSize: '1.4rem', color: 'white' }}>{label}</div>
    <div style={{ marginTop: '1.5rem', color: 'var(--sm-accent)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px' }}>EXPLORE →</div>
  </div>
);
