
import React from 'react';

export const JobsHeader = () => (
  <header className="jm-header">
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: '40px', height: '40px', background: 'var(--jm-primary)', borderRadius: '10px' }}></div>
      <span style={{ fontFamily: 'var(--jm-font-display)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-1px' }}>Sellio_Jobs</span>
    </div>
    <nav style={{ display: 'flex', gap: '3rem' }}>
      <a href="#" className="jm-nav-link">Marketplace</a>
      <a href="#" className="jm-nav-link">Companies</a>
      <a href="#" className="jm-nav-link">Salaries</a>
      <a href="#" className="jm-nav-link">Academy</a>
    </nav>
    <div style={{ display: 'flex', gap: '1rem' }}>
      <button style={{ background: 'none', border: 'none', fontWeight: 700, color: 'var(--jm-text)', cursor: 'pointer' }}>Sign In</button>
      <button className="jm-btn-primary">Post a Job</button>
    </div>
  </header>
);

export const JobsFooter = () => (
  <footer style={{ padding: '10rem 5% 5rem', background: 'white', borderTop: '1px solid var(--jm-border)' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '5rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--jm-primary)', borderRadius: '8px' }}></div>
          <span style={{ fontFamily: 'var(--jm-font-display)', fontWeight: 800, fontSize: '1.2rem' }}>Sellio_Jobs</span>
        </div>
        <p style={{ color: 'var(--jm-text-dim)', lineHeight: 1.8, maxWidth: '300px' }}>
          The global standard for professional talent distribution. Architecting the future of work.
        </p>
      </div>
      <div>
        <h4 style={{ marginBottom: '2rem', fontWeight: 800 }}>Platform</h4>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li><a href="#" className="jm-nav-link">Browse Jobs</a></li>
          <li><a href="#" className="jm-nav-link">Premium Talent</a></li>
          <li><a href="#" className="jm-nav-link">Job APIs</a></li>
        </ul>
      </div>
      <div>
        <h4 style={{ marginBottom: '2rem', fontWeight: 800 }}>Resources</h4>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li><a href="#" className="jm-nav-link">Career Blog</a></li>
          <li><a href="#" className="jm-nav-link">Salary Guide</a></li>
          <li><a href="#" className="jm-nav-link">Resume Lab</a></li>
        </ul>
      </div>
      <div>
        <h4 style={{ marginBottom: '2rem', fontWeight: 800 }}>Company</h4>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li><a href="#" className="jm-nav-link">About Us</a></li>
          <li><a href="#" className="jm-nav-link">Contact</a></li>
          <li><a href="#" className="jm-nav-link">Terms</a></li>
        </ul>
      </div>
    </div>
    <div style={{ marginTop: '8rem', paddingTop: '3rem', borderTop: '1px solid var(--jm-border)', textAlign: 'center', color: 'var(--jm-text-dim)', fontSize: '0.9rem' }}>
      © 2026 Sellio Platform. All rights reserved. Built with Elite Standards.
    </div>
  </footer>
);

export const JobCard = ({ title, company, type, salary, logo, progress }: any) => (
  <div className="jm-card jm-job-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
      <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
        {logo}
      </div>
      <span className="jm-tag">{type}</span>
    </div>
    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ color: 'var(--jm-text-dim)', marginBottom: '2rem' }}>{company}</p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
      <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{salary}</span>
      <button style={{ color: 'var(--jm-primary)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}>Apply_Now →</button>
    </div>
    {progress && (
      <div className="jm-progress-container">
        <div className="jm-progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
    )}
  </div>
);

export const StatCard = ({ label, value, icon }: any) => (
  <div className="jm-card jm-stat-card">
    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{value}</div>
    <div style={{ color: 'var(--jm-text-dim)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '1px' }}>{label}</div>
  </div>
);

export const FeaturedCard = () => (
  <div className="jm-card jm-featured-card">
    <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Accelerate Your <br/>Application Process.</h3>
    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', lineHeight: 1.6 }}>
      Join Sellio Pro to get priority access to elite job nodes and direct-to-manager routing protocols.
    </p>
    <button style={{ background: 'white', color: 'var(--jm-primary)', padding: '1.25rem 3rem', borderRadius: '16px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
      Upgrade to Pro
    </button>
  </div>
);
