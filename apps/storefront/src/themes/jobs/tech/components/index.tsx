'use client';
import React from 'react';

export const TechHeader = () => (
    <header className="jt-header">
        <a href="#" className="jt-logo">
            <span className="jt-text-accent">{'>'}</span>dev_jobs_
        </a>
        <nav className="jt-nav d-none d-md-flex">
            <a href="#jobs" className="jt-nav-link">Jobs</a>
            <a href="#companies" className="jt-nav-link">Companies</a>
            <a href="#salaries" className="jt-nav-link">Salaries</a>
        </nav>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" className="jt-btn jt-btn-outline">Log in</a>
            <a href="#" className="jt-btn jt-btn-primary">Post a Job</a>
        </div>
    </header>
);

export const TechJobCard = ({ title, company, location, type, salary, time, logo, skills }: any) => (
    <div className="jt-job-card">
        <div className="jt-company-logo">
            <img src={logo} alt={company} />
        </div>
        <div className="jt-job-body">
            <h3 className="jt-job-title">{title}</h3>
            <div className="jt-job-company">{company}</div>
            <div className="jt-job-tags">
                {skills.map((skill: string) => (
                    <span key={skill} className="jt-skill-tag">{skill}</span>
                ))}
            </div>
            <div className="jt-job-meta">
                <span>📍 {location}</span>
                <span>💼 {type}</span>
                <span>💰 {salary}</span>
            </div>
        </div>
        <div className="jt-job-action">
            <div style={{ fontSize: '0.8rem', color: 'var(--jt-text-muted)' }}>{time}</div>
            <button className="jt-btn jt-btn-primary">Apply</button>
        </div>
    </div>
);

export const TechFooter = () => (
    <footer className="jt-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
                <a href="#" className="jt-logo" style={{ marginBottom: '1rem', display: 'block' }}>
                    <span className="jt-text-accent">{'>'}</span>dev_jobs_
                </a>
                <p style={{ color: 'var(--jt-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>The #1 job board for software engineers, product managers, and data scientists.</p>
            </div>
            <div>
                <h4 className="jt-sidebar-title">Developers</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <a href="#" style={{ color: 'var(--jt-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Job Search</a>
                    <a href="#" style={{ color: 'var(--jt-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Salary Calculator</a>
                    <a href="#" style={{ color: 'var(--jt-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Create Profile</a>
                </div>
            </div>
            <div>
                <h4 className="jt-sidebar-title">Employers</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <a href="#" style={{ color: 'var(--jt-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Post Jobs</a>
                    <a href="#" style={{ color: 'var(--jt-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Search Developers</a>
                    <a href="#" style={{ color: 'var(--jt-text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Pricing</a>
                </div>
            </div>
        </div>
        <div style={{ borderTop: '1px solid var(--jt-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', color: 'var(--jt-text-muted)', fontSize: '0.85rem' }}>
            <span>&copy; 2026 DevJobs. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: 'var(--jt-text-muted)', textDecoration: 'none' }}>Terms</a>
                <a href="#" style={{ color: 'var(--jt-text-muted)', textDecoration: 'none' }}>Privacy</a>
                <a href="#" style={{ color: 'var(--jt-text-muted)', textDecoration: 'none' }}>API</a>
            </div>
        </div>
    </footer>
);
