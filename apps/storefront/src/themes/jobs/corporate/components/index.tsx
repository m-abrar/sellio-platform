'use client';
import React, { useState } from 'react';

export const CorporateHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="jc-header">
      <a href="#" className="jc-logo">
        <span style={{ color: 'var(--jc-blue-accent)' }}>Talent</span>Corp
      </a>

      {/* Mobile Hamburger Trigger */}
      <button 
        className={`jc-hamburger ${isOpen ? 'jc-hamburger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation"
        id="jc-hamburger-toggle"
      >
        <span className="jc-hamburger-bar"></span>
        <span className="jc-hamburger-bar"></span>
        <span className="jc-hamburger-bar"></span>
      </button>

      {/* Navigation Links */}
      <nav className={`jc-nav ${isOpen ? 'jc-nav-open' : ''}`}>
        {[
          { name: 'Find Jobs', target: 'jobs' },
          { name: 'Companies', target: 'companies' },
          { name: 'Application Tracker', target: 'tracker' },
          { name: 'Upload Resume', target: 'resume' }
        ].map(link => (
          <a 
            key={link.name} 
            href={`#${link.target}`} 
            className="jc-nav-link"
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
        <div className="jc-mobile-actions">
          <a href="#" className="jc-btn jc-btn-outline jc-mobile-action-btn">Sign In</a>
          <a href="#" className="jc-btn jc-btn-navy jc-mobile-action-btn">Post a Job</a>
        </div>
      </nav>

      {/* Desktop Actions */}
      <div className="jc-desktop-actions">
        <a href="#" className="jc-btn jc-btn-outline">Sign In</a>
        <a href="#" className="jc-btn jc-btn-navy" id="jc-btn-vibe-status">Post a Job</a>
      </div>
    </header>
  );
};

export const JobCard = ({ title, company, location, type, salary, time, logo }: any) => (
    <div className="jc-job-card">
        <div className="jc-company-logo">
            <img src={logo} alt={company} />
        </div>
        <div className="jc-job-body">
            <h3 className="jc-job-title">{title}</h3>
            <div className="jc-company-name">{company}</div>
            <div className="jc-job-meta">
                <span>📍 {location}</span>
                <span>💼 {type}</span>
                <span>💰 {salary}</span>
                <span>⏱️ {time}</span>
            </div>
        </div>
        <div className="jc-job-action">
            <button className="jc-btn jc-btn-navy">Apply Now</button>
        </div>
    </div>
);

export const DashboardCard = () => (
    <div className="jc-dashboard-card" id="resume">
        <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 700 }}>Get Discovered by Top Employers</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Upload your resume and let recruiters come to you. Track applications in real-time.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="jc-btn" style={{ backgroundColor: 'white', color: 'var(--jc-navy)' }}>Upload Resume</button>
            <button className="jc-btn jc-btn-outline" style={{ color: 'white', borderColor: 'white' }}>View Tracker</button>
        </div>
    </div>
);

export const CorporateFooter = () => (
    <footer className="jc-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href="#" className="jc-logo" style={{ marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--jc-blue-accent)' }}>Talent</span>Corp
                </a>
                <p style={{ color: 'var(--jc-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Empowering professionals and leading enterprises to connect seamlessly.</p>
            </div>
            <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jc-navy)', marginBottom: '1.5rem' }}>For Candidates</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <a href="#" style={{ color: 'var(--jc-text-muted)', textDecoration: 'none' }}>Browse Jobs</a>
                    <a href="#" style={{ color: 'var(--jc-text-muted)', textDecoration: 'none' }}>Salary Tools</a>
                    <a href="#" style={{ color: 'var(--jc-text-muted)', textDecoration: 'none' }}>Career Advice</a>
                </div>
            </div>
            <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jc-navy)', marginBottom: '1.5rem' }}>For Employers</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <a href="#" style={{ color: 'var(--jc-text-muted)', textDecoration: 'none' }}>Post a Job</a>
                    <a href="#" style={{ color: 'var(--jc-text-muted)', textDecoration: 'none' }}>Search Resumes</a>
                    <a href="#" style={{ color: 'var(--jc-text-muted)', textDecoration: 'none' }}>ATS Integration</a>
                </div>
            </div>
            <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--jc-navy)', marginBottom: '1.5rem' }}>Subscribe</h4>
                <p style={{ color: 'var(--jc-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Get daily job alerts.</p>
                <div style={{ display: 'flex' }}>
                    <input type="email" placeholder="Email" style={{ padding: '0.5rem', border: '1px solid var(--jc-border)', borderRadius: '4px 0 0 4px', width: '100%', outline: 'none' }} />
                    <button className="jc-btn jc-btn-navy" style={{ borderRadius: '0 4px 4px 0' }}>Subscribe</button>
                </div>
            </div>
        </div>
        <div style={{ borderTop: '1px solid var(--jc-border)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--jc-text-muted)', fontSize: '0.85rem' }}>
            &copy; 2026 TalentCorp Inc. All rights reserved.
        </div>
    </footer>
);
