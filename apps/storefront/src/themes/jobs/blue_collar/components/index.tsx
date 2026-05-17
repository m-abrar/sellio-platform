'use client';
import React from 'react';

export const BlueCollarHeader = () => (
    <header className="jbc-header">
        <a href="#" className="jbc-logo">
            Trades<span>Work</span>
        </a>
        <nav className="jbc-nav d-none d-md-flex">
            <a href="#jobs" className="jbc-nav-link">Find Jobs</a>
            <a href="#training" className="jbc-nav-link">Training</a>
            <a href="#employers" className="jbc-nav-link">Employers</a>
        </nav>
        <div>
            <a href="#" className="jbc-btn jbc-btn-primary">Post a Job</a>
        </div>
    </header>
);

export const BlueCollarJobCard = ({ title, company, location, type, wage, time }: any) => (
    <div className="jbc-job-card">
        <h3 className="jbc-job-title">{title}</h3>
        <div className="jbc-job-company">{company}</div>
        
        <div className="jbc-job-meta">
            <span className="jbc-meta-item">📍 {location}</span>
            <span className="jbc-meta-item">⏱️ {type}</span>
            <span className="jbc-meta-item">📅 {time}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="jbc-wage">{wage}</div>
            <button className="jbc-btn jbc-btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Apply Now</button>
        </div>
    </div>
);

export const BlueCollarFooter = () => (
    <footer className="jbc-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div>
                <a href="#" className="jbc-logo" style={{ marginBottom: '1rem', display: 'block' }}>
                    Trades<span>Work</span>
                </a>
                <p style={{ color: 'var(--jbc-text-muted)', fontWeight: 500 }}>Connecting skilled tradespeople with top employers in construction, manufacturing, and logistics.</p>
            </div>
            <div>
                <h4 style={{ textTransform: 'uppercase', fontWeight: 900, marginBottom: '1rem' }}>Job Seekers</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <a href="#" style={{ color: 'var(--jbc-text-muted)', textDecoration: 'none', fontWeight: 500 }}>Browse Jobs</a>
                    <a href="#" style={{ color: 'var(--jbc-text-muted)', textDecoration: 'none', fontWeight: 500 }}>Apprenticeships</a>
                    <a href="#" style={{ color: 'var(--jbc-text-muted)', textDecoration: 'none', fontWeight: 500 }}>Resume Builder</a>
                </div>
            </div>
            <div>
                <h4 style={{ textTransform: 'uppercase', fontWeight: 900, marginBottom: '1rem' }}>Employers</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <a href="#" style={{ color: 'var(--jbc-text-muted)', textDecoration: 'none', fontWeight: 500 }}>Post a Job</a>
                    <a href="#" style={{ color: 'var(--jbc-text-muted)', textDecoration: 'none', fontWeight: 500 }}>Pricing</a>
                    <a href="#" style={{ color: 'var(--jbc-text-muted)', textDecoration: 'none', fontWeight: 500 }}>Recruiting Solutions</a>
                </div>
            </div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: '1rem', color: '#757575', fontSize: '0.85rem', textAlign: 'center', fontWeight: 500 }}>
            &copy; 2026 TradesWork Platform. All Rights Reserved.
        </div>
    </footer>
);
