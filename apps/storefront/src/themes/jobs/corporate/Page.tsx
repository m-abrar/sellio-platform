'use client';
import React from 'react';
import { CorporateHeader, JobCard, DashboardCard, CorporateFooter } from './components';

export default function Page() {
  const jobs = [
    { title: "Senior Enterprise Architect", company: "Globex Corporation", location: "New York, NY", type: "Full-Time", salary: "$160k - $200k", time: "2h ago", logo: "/themes/jobs/corporate/1.webp" },
    { title: "Director of Product Management", company: "Initech", location: "Remote", type: "Full-Time", salary: "$180k - $220k", time: "5h ago", logo: "/themes/jobs/corporate/2.webp" },
    { title: "Financial Analyst II", company: "Acme Corp", location: "Chicago, IL", type: "Contract", salary: "$80 - $100/hr", time: "1d ago", logo: "/themes/jobs/corporate/3.webp" },
    { title: "Lead HR Business Partner", company: "Soylent", location: "San Francisco, CA", type: "Full-Time", salary: "$140k - $170k", time: "1d ago", logo: "/themes/jobs/corporate/4.webp" },
    { title: "Cybersecurity Operations Center Analyst", company: "Umbrella Corp", location: "Austin, TX", type: "Full-Time", salary: "$110k - $140k", time: "2d ago", logo: "/themes/jobs/corporate/5.webp" },
  ];

  return (
    <div className="jobs-corporate-wrapper">
      <CorporateHeader />

      {/* Hero */}
      <section className="jc-hero">
        <h1 className="jc-hero-title">Advance Your Corporate Career</h1>
        <p className="jc-hero-subtitle">Discover premium opportunities at Fortune 500 companies and high-growth enterprises worldwide.</p>
        
        <div className="jc-search-container">
            <input type="text" className="jc-search-input" placeholder="Job title, keywords, or company" />
            <div className="jc-search-divider"></div>
            <input type="text" className="jc-search-input" placeholder="City, state, or Remote" />
            <button className="jc-btn jc-btn-navy jc-search-btn">Search Jobs</button>
        </div>
      </section>

      {/* Main Layout */}
      <div className="jc-layout">
          {/* Sidebar */}
          <aside className="jc-sidebar">
              <div className="jc-filter-group">
                  <div className="jc-sidebar-title">Job Type</div>
                  <label className="jc-filter-label"><input type="checkbox" /> Full-Time (1,240)</label>
                  <label className="jc-filter-label"><input type="checkbox" /> Contract (430)</label>
                  <label className="jc-filter-label"><input type="checkbox" /> Part-Time (120)</label>
              </div>

              <div className="jc-filter-group">
                  <div className="jc-sidebar-title">Experience Level</div>
                  <label className="jc-filter-label"><input type="checkbox" /> Executive (80)</label>
                  <label className="jc-filter-label"><input type="checkbox" /> Director (250)</label>
                  <label className="jc-filter-label"><input type="checkbox" /> Mid-Senior Level (900)</label>
                  <label className="jc-filter-label"><input type="checkbox" /> Associate (300)</label>
              </div>

              <div className="jc-filter-group">
                  <div className="jc-sidebar-title">Work Model</div>
                  <label className="jc-filter-label"><input type="checkbox" /> Remote</label>
                  <label className="jc-filter-label"><input type="checkbox" /> Hybrid</label>
                  <label className="jc-filter-label"><input type="checkbox" /> On-site</label>
              </div>
          </aside>

          {/* Job Listings */}
          <main>
              <DashboardCard />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--jc-navy)' }}>Recommended for You</h2>
                  <select style={{ padding: '0.5rem', border: '1px solid var(--jc-border)', borderRadius: '4px', color: 'var(--jc-text-main)', outline: 'none' }}>
                      <option>Sort by: Most Relevant</option>
                      <option>Sort by: Most Recent</option>
                      <option>Sort by: Salary (High to Low)</option>
                  </select>
              </div>

              <div className="jc-job-list">
                  {jobs.map((job, i) => (
                      <JobCard key={i} {...job} />
                  ))}
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <button className="jc-btn jc-btn-outline">Load More Results</button>
              </div>
          </main>
      </div>

      <CorporateFooter />
    </div>
  );
}
