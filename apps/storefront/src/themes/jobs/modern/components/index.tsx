'use client';
import React from 'react';

export const ModernHeader = () => (
    <div className="jm-header-container">
        <header className="jm-header jm-glass">
            <a href="#" className="jm-logo">
                Nex<span className="jm-text-gradient">Role</span>
            </a>
            <nav className="jm-nav d-none d-lg-flex">
                <a href="#discover" className="jm-nav-link">Discover</a>
                <a href="#companies" className="jm-nav-link">Top Companies</a>
                <a href="#salaries" className="jm-nav-link">Salaries</a>
                <a href="#career" className="jm-nav-link">Career Paths</a>
            </nav>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" className="jm-nav-link" style={{ alignSelf: 'center', fontWeight: 600 }}>Login</a>
                <a href="#" className="jm-btn jm-btn-primary">Post a Job</a>
            </div>
        </header>
    </div>
);

export const ModernJobCard = ({ title, company, location, type, level, salary, logo }: any) => (
    <div className="jm-job-card jm-glass">
        <div className="jm-company-header">
            <div className="jm-company-logo">
                <img src={logo} alt={company} />
            </div>
            <div>
                <div className="jm-company-name">{company}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--jm-text-muted)' }}>📍 {location}</div>
            </div>
        </div>
        <h3 className="jm-job-title">{title}</h3>
        <div className="jm-job-tags">
            <span className="jm-tag">{type}</span>
            <span className="jm-tag">{level}</span>
        </div>
        <div className="jm-job-footer">
            <div className="jm-salary">{salary}</div>
            <button className="jm-apply-btn" aria-label="Apply Now">→</button>
        </div>
    </div>
);

export const ModernFooter = () => (
    <footer className="jm-footer">
        <div className="jm-glass" style={{ borderRadius: '32px', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Ready for your next big move?</h2>
            <p style={{ color: 'var(--jm-text-muted)', fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '500px' }}>Join over 2 million professionals advancing their careers on NexRole.</p>
            <button className="jm-btn jm-btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Create Your Profile</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <a href="#" className="jm-logo">
                Nex<span className="jm-text-gradient">Role</span>
            </a>
            <div style={{ display: 'flex', gap: '2rem' }}>
                <a href="#" className="jm-nav-link">About</a>
                <a href="#" className="jm-nav-link">Terms</a>
                <a href="#" className="jm-nav-link">Privacy</a>
                <a href="#" className="jm-nav-link">Contact</a>
            </div>
            <div style={{ color: 'var(--jm-text-muted)', fontSize: '0.9rem' }}>
                &copy; 2026 NexRole Inc.
            </div>
        </div>
    </footer>
);
