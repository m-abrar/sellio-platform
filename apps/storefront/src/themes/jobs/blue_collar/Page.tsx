'use client';
import React from 'react';
import { BlueCollarHeader, BlueCollarJobCard, BlueCollarFooter } from './components';

export default function Page() {
  const jobs = [
    { title: "Heavy Equipment Operator", company: "BuildRight Construction", location: "Denver, CO", type: "Full-Time", wage: "$28 - $35/hr", time: "Posted Today" },
    { title: "Journeyman Electrician", company: "Spark Energy Solutions", location: "Austin, TX", type: "Full-Time", wage: "$35 - $45/hr", time: "1 Day Ago" },
    { title: "Commercial Plumber", company: "PipeMasters LLC", location: "Chicago, IL", type: "Contract", wage: "$40/hr", time: "2 Days Ago" },
    { title: "CDL Class A Truck Driver", company: "National Freight Movers", location: "Omaha, NE", type: "Full-Time", wage: "$75,000/yr", time: "3 Days Ago" },
    { title: "CNC Machinist", company: "Precision Parts Manufacturing", location: "Detroit, MI", type: "Shift Work", wage: "$25 - $30/hr", time: "3 Days Ago" },
    { title: "HVAC Technician", company: "CoolAir Services", location: "Phoenix, AZ", type: "Full-Time", wage: "$26 - $34/hr", time: "4 Days Ago" },
  ];

  return (
    <div className="jobs-blue-collar-wrapper">
      <BlueCollarHeader />

      {/* Hero */}
      <section className="jbc-hero" id="jbc-hero-section" aria-labelledby="jbc-hero-title">
        <div className="jbc-hero-overlay"></div>
        <div className="jbc-hero-content">
            <h1 className="jbc-hero-title" id="jbc-hero-title">Hard Work <span>Pays Off.</span></h1>
            <p className="jbc-hero-subtitle">Find high-paying jobs in construction, manufacturing, transportation, and skilled trades. No desk required.</p>
            
            <div className="jbc-search-box" aria-label="Search Filter Bar">
                <input type="text" className="jbc-search-input" placeholder="Job Title or Trade (e.g., Welder)" aria-label="Trade Search Input" />
                <div className="jbc-search-divider"></div>
                <input type="text" className="jbc-search-input" placeholder="City or ZIP Code" aria-label="City Search Input" />
                <button className="jbc-btn jbc-btn-primary" style={{ border: 'none', margin: '4px' }} onClick={() => alert('Searching listings...')}>Search</button>
            </div>
        </div>
      </section>

      {/* Categories */}
      <section className="jbc-section" id="jbc-trades-section" style={{ backgroundColor: 'white' }} aria-labelledby="jbc-trades-title">
          <h2 className="jbc-section-title" id="jbc-trades-title">Browse By Trade</h2>
          <div className="jbc-trades-grid">
              {['Construction', 'Manufacturing', 'Transportation', 'Maintenance', 'Warehousing', 'Energy'].map(trade => (
                  <a href="#" key={trade} className="jbc-trade-link"
                     onClick={(e) => { e.preventDefault(); alert(`Filtering jobs for ${trade}...`); }}
                  >
                      {trade}
                  </a>
              ))}
          </div>
      </section>

      {/* Job Grid */}
      <section className="jbc-section" id="jobs" aria-labelledby="jbc-jobs-title">
          <div className="jbc-jobs-header">
              <h2 className="jbc-section-title" id="jbc-jobs-title" style={{ marginBottom: 0 }}>Latest Openings</h2>
              <select className="jbc-sort-select" aria-label="Sort Jobs Select">
                  <option>Most Recent</option>
                  <option>Highest Wage</option>
                  <option>Closest to Me</option>
              </select>
          </div>
          
          <div className="jbc-job-grid">
              {jobs.map((job, i) => <BlueCollarJobCard key={i} {...job} />)}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="jbc-btn jbc-btn-secondary" onClick={() => alert('Loading more blue-collar jobs...')}>Load More Jobs</button>
          </div>
      </section>

      {/* CTA */}
      <section className="jbc-cta" id="jbc-employers-section">
          <h2>Need Workers Fast?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', fontWeight: 500 }}>Access our database of over 50,000 certified tradespeople ready to start tomorrow.</p>
          <button className="jbc-btn jbc-btn-primary" style={{ fontSize: '1.25rem', padding: '1rem 3rem' }} onClick={() => alert('Employer onboarding portal...')}>Post Your Job Now</button>
      </section>

      <BlueCollarFooter />
    </div>
  );
}
