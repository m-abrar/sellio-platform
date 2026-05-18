'use client';
import React from 'react';
import { ModernHeader, ModernJobCard, ModernFooter } from './components';

export default function Page() {
  const jobs = [
    { title: "Lead Product Designer", company: "Figma", location: "San Francisco, CA", type: "Full-Time", level: "Senior", salary: "$160k - $210k", logo: "/themes/jobs/modern/1.webp" },
    { title: "VP of Engineering", company: "Spotify", location: "Remote - Global", type: "Full-Time", level: "Executive", salary: "$250k+", logo: "/themes/jobs/modern/2.webp" },
    { title: "Senior Data Scientist", company: "Airbnb", location: "New York, NY", type: "Full-Time", level: "Senior", salary: "$150k - $190k", logo: "/themes/jobs/modern/3.webp" },
    { title: "Brand Marketing Manager", company: "Nike", location: "Portland, OR", type: "Hybrid", level: "Mid-Level", salary: "$110k - $140k", logo: "/themes/jobs/modern/4.webp" },
    { title: "iOS Developer", company: "Apple", location: "Cupertino, CA", type: "On-site", level: "Mid-Level", salary: "$140k - $170k", logo: "/themes/jobs/modern/5.webp" },
    { title: "UX Researcher", company: "Google", location: "Remote - US", type: "Full-Time", level: "Mid-Level", salary: "$130k - $160k", logo: "/themes/jobs/modern/6.webp" },
  ];

  return (
    <div className="jobs-modern-wrapper">
      <ModernHeader />

      {/* Hero */}
      <section className="jm-hero">
        <div className="jm-hero-badge">🚀 Over 10,000+ new roles added this week</div>
        <h1 className="jm-hero-title">Find work that <br/><span className="jm-text-gradient">matches your ambition.</span></h1>
        <p className="jm-hero-subtitle">The modern way to discover roles at innovative startups and world-class tech companies.</p>
        
        <div className="jm-search-box">
            <input type="text" className="jm-search-input" placeholder="Job title, skill, or company" />
            <div className="jm-search-divider"></div>
            <input type="text" className="jm-search-input" placeholder="City or Remote" />
            <button className="jm-btn jm-btn-primary" style={{ margin: '4px' }}>Search</button>
        </div>
      </section>

      {/* Stats */}
      <div className="jm-stats">
          <div className="jm-stat-item">
              <div className="jm-stat-number jm-text-gradient">2M+</div>
              <div className="jm-stat-label">Active Users</div>
          </div>
          <div className="jm-stat-item">
              <div className="jm-stat-number jm-text-gradient">50k</div>
              <div className="jm-stat-label">Companies</div>
          </div>
          <div className="jm-stat-item">
              <div className="jm-stat-number jm-text-gradient">$120k</div>
              <div className="jm-stat-label">Avg Salary</div>
          </div>
      </div>

      {/* Job Grid */}
      <section className="jm-section" id="discover">
          <div className="jm-section-header">
              <h2 className="jm-section-title">Curated for you</h2>
              <a href="#" className="jm-btn jm-btn-outline">View All Roles</a>
          </div>
          
          <div className="jm-grid">
              {jobs.map((job, i) => <ModernJobCard key={i} {...job} />)}
          </div>
      </section>

      <ModernFooter />
    </div>
  );
}
