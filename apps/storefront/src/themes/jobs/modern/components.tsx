import React from 'react';

export const TalentHeader = () => (
  <header className="talent-header">
    <div className="talent-logo">HIRE_MODERN</div>
    <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
      <span>Browse Jobs</span>
      <span>Post a Role</span>
      <span>For Talent</span>
    </div>
    <button style={{ 
      background: 'var(--color-indigo)', 
      color: 'white', 
      padding: '0.7rem 1.8rem', 
      borderRadius: '100px', 
      border: 'none', 
      fontWeight: 700,
      fontSize: '0.85rem',
      cursor: 'pointer'
    }}>
      Join Network
    </button>
  </header>
);

export const BentoJobCard = ({ title, company, location, salary, tags, initial }: { title: string, company: string, location: string, salary: string, tags: string[], initial: string }) => (
  <div className="bento-job-card">
    <div className="company-logo-frame">{initial}</div>
    <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>{title}</h3>
    <div style={{ opacity: 0.5, fontSize: '0.9rem', marginBottom: '1.5rem' }}>{company} // {location}</div>
    <div style={{ flex: 1 }}>
      <div className="salary-badge-modern">{salary}</div>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {tags.map(tag => (
        <span key={tag} className="job-tag-pill">{tag}</span>
      ))}
    </div>
  </div>
);

export const ModernJobFooter = () => (
  <footer className="modern-job-footer">
    <div>
      <div className="talent-logo" style={{ marginBottom: '1rem' }}>HIRE_MODERN</div>
      <p style={{ opacity: 0.4, fontSize: '0.85rem' }}>© 2026 SELLIO_TALENT_SERVICES</p>
    </div>
    <div style={{ display: 'flex', gap: '3rem', fontSize: '0.9rem', fontWeight: 700 }}>
      <span>RESOURCES</span>
      <span>API_DOCS</span>
      <span>STATUS</span>
    </div>
  </footer>
);
