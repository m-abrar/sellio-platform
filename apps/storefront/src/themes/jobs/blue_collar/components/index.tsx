'use client';
import React, { useState } from 'react';

export const BlueCollarHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="jbc-header">
      <div className="jbc-header-container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', justifyContent: 'space-between' }}>
        <a href="#" className="jbc-logo">
            Trades<span>Work</span>
        </a>

        {/* Mobile Hamburger Trigger */}
        <button 
          className={`jbc-hamburger ${isOpen ? 'jbc-hamburger-open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="jbc-hamburger-toggle"
        >
          <span className="jbc-hamburger-bar"></span>
          <span className="jbc-hamburger-bar"></span>
          <span className="jbc-hamburger-bar"></span>
        </button>
      </div>
      
      {/* Navigation Links */}
      <nav className={`jbc-nav ${isOpen ? 'jbc-nav-open' : ''}`}>
        {[
          { name: 'Find Jobs', target: 'jobs' },
          { name: 'Trades Categories', target: 'jbc-trades-section' },
          { name: 'Employers', target: 'jbc-employers-section' }
        ].map(link => (
          <a 
            key={link.name} 
            href={`#${link.target}`} 
            className="jbc-nav-link"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              const targetId = link.target;
              document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {link.name}
          </a>
        ))}
        <button 
          className="jbc-btn jbc-btn-primary jbc-mobile-btn" 
          onClick={() => alert('Job posting form starting...')}
        >
          Post a Job
        </button>
      </nav>

      {/* Desktop Actions */}
      <div className="jbc-desktop-btn-container">
        <button 
          className="jbc-btn jbc-btn-primary jbc-desktop-btn" 
          onClick={() => alert('Job posting form starting...')}
          id="jbc-btn-vibe-status"
        >
          Post a Job
        </button>
      </div>
    </header>
  );
};

export const BlueCollarJobCard = ({ title, company, location, type, wage, time }: any) => (
    <div className="jbc-job-card">
        <h3 className="jbc-job-title">{title}</h3>
        <div className="jbc-job-company">{company}</div>
        
        <div className="jbc-job-meta">
            <span className="jbc-meta-item">📍 {location}</span>
            <span className="jbc-meta-item">⏱️ {type}</span>
            <span className="jbc-meta-item">📅 {time}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <div className="jbc-wage">{wage}</div>
            <button className="jbc-btn jbc-btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }} onClick={() => alert(`Applying to ${title} at ${company}...`)}>Apply Now</button>
        </div>
    </div>
);

export const BlueCollarFooter = () => (
    <footer className="jbc-footer">
        <div className="jbc-footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href="#" className="jbc-logo" style={{ marginBottom: '1.5rem', display: 'block' }}>
                    Trades<span>Work</span>
                </a>
                <p style={{ color: 'var(--jbc-text-muted)', fontWeight: 500, lineHeight: 1.6 }}>Connecting skilled tradespeople with top employers in construction, manufacturing, and logistics.</p>
            </div>
            <div>
                <h4 style={{ textTransform: 'uppercase', fontWeight: 900, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'white' }}>Job Seekers</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <a href="#" style={{ color: 'var(--jbc-text-muted)', textDecoration: 'none', fontWeight: 500 }} onClick={() => alert('Search listings.')}>Browse Jobs</a>
                    <a href="#" style={{ color: 'var(--jbc-text-muted)', textDecoration: 'none', fontWeight: 500 }} onClick={() => alert('Apprentice listings.')}>Apprenticeships</a>
                    <a href="#" style={{ color: 'var(--jbc-text-muted)', textDecoration: 'none', fontWeight: 500 }} onClick={() => alert('Resume builder.')}>Resume Builder</a>
                </div>
            </div>
            <div>
                <h4 style={{ textTransform: 'uppercase', fontWeight: 900, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'white' }}>Employers</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <a href="#" style={{ color: 'var(--jbc-text-muted)', textDecoration: 'none', fontWeight: 500 }} onClick={() => alert('Post job wizard.')}>Post a Job</a>
                    <a href="#" style={{ color: 'var(--jbc-text-muted)', textDecoration: 'none', fontWeight: 500 }} onClick={() => alert('Pricing tiers.')}>Pricing</a>
                    <a href="#" style={{ color: 'var(--jbc-text-muted)', textDecoration: 'none', fontWeight: 500 }} onClick={() => alert('Recruiter suite.')}>Recruiting Solutions</a>
                </div>
            </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', color: '#757575', fontSize: '0.85rem', textAlign: 'center', fontWeight: 500 }}>
            &copy; 2026 TradesWork Platform. All Rights Reserved.
        </div>
    </footer>
);
