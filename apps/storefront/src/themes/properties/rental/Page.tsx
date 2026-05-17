'use client';
import React, { useState } from 'react';
import { LeaseUnitCard, TrustMetrics } from './components';

export default function Page() {
  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1 Guest');

  const rentals = [
    { title: "The North Tower Studio", price: "$1,850", type: "Studio", location: "Downtown Core", beds: "1", baths: "1", sqft: "480", rating: 4.8, reviews: 142, image: "/themes/properties/rental/1.webp" },
    { title: "Riverside 2BR Apartment", price: "$2,400", type: "Apartment", location: "West End District", beds: "2", baths: "2", sqft: "950", rating: 4.9, reviews: 89, image: "/themes/properties/rental/2.webp" },
    { title: "Modern Industrial Loft", price: "$3,100", type: "Loft", location: "Arts & Culture Center", beds: "1", baths: "1.5", sqft: "820", rating: 4.7, reviews: 63, image: "/themes/properties/rental/3.webp" },
    { title: "Skyline Penthouse Unit", price: "$5,500", type: "Penthouse", location: "Financial Hub District", beds: "3", baths: "3", sqft: "1650", rating: 5.0, reviews: 27, image: "/themes/properties/rental/4.webp" },
    { title: "Sunlit Family Townhouse", price: "$3,800", type: "Townhouse", location: "Suburban Pines", beds: "4", baths: "3", sqft: "1900", rating: 4.9, reviews: 52, image: "/themes/properties/rental/5.webp" },
    { title: "Compact Downtown Micro-Studio", price: "$1,400", type: "Studio", location: "South Side Loop", beds: "1", baths: "1", sqft: "350", rating: 4.6, reviews: 104, image: "/themes/properties/rental/6.webp" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Searching rentals in: ${searchLocation || 'Anywhere'} | Check-in: ${checkIn || 'Anytime'} | Check-out: ${checkOut || 'Anytime'} | Guests: ${guests}`);
  };

  return (
    <div className="pr-section">
      {/* Lease Hero */}
      <section className="pr-hero">
        <div>
          <div className="pr-mono" style={{ marginBottom: '2.5rem' }}>EASY_LEASING_PROTOCOL_V8</div>
          <h1 className="pr-heading-xl">
            Rent Your <br/>
            Next Home <br/>
            <span style={{ color: 'var(--pr-mint)' }}>with Ease.</span>
          </h1>
          <p style={{ marginTop: '3rem', fontSize: '1.2rem', color: 'var(--pr-text-muted)', lineHeight: 1.8, maxWidth: '540px' }}>
            A high-fidelity rental protocol designed for modern residential nodes. Certified properties, digital instant leases, and automated utility routing nodes.
          </p>
          
          <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem' }} className="pr-hero-buttons">
            <button className="pr-btn-primary" id="pr-btn-discover" onClick={() => document.getElementById('pr-discovery-grid')?.scrollIntoView({ behavior: 'smooth' })}>
              Find a Rental
            </button>
            <button style={{ 
                background: 'transparent', 
                border: '2px solid var(--pr-slate)', 
                color: 'var(--pr-slate)', 
                padding: '1.25rem 3.5rem', 
                borderRadius: '100px', 
                fontWeight: 800, 
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }} id="pr-btn-list" onClick={() => alert('List your residential node starting program. Developer active.')}>
                List Unit
            </button>
          </div>
        </div>
        
        <div className="pr-hero-image-wrapper">
          <img src="/themes/properties/rental/7.webp" alt="High Fidelity Modern Living Concept" className="pr-hero-image" />
          
          <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid var(--pr-border)' }} className="pr-badge-floater">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
                  <div className="pr-mono" style={{ fontSize: '0.65rem', color: 'var(--pr-slate)' }}>842 RENTALS VERIFIED NOW</div>
              </div>
          </div>
        </div>
      </section>

      {/* Stateful Calendar & Guest Selector Booking Search Panel */}
      <section style={{ marginTop: '4rem', marginBottom: '8rem' }}>
        <form onSubmit={handleSearchSubmit} className="pr-booking-widget" aria-label="Properties Search Panel">
          <div className="pr-booking-field">
            <label className="pr-booking-label" htmlFor="pr-search-loc">Destination Location</label>
            <input 
              id="pr-search-loc"
              type="text" 
              placeholder="e.g. Downtown Core" 
              className="pr-booking-input"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
          
          <div className="pr-booking-field">
            <label className="pr-booking-label" htmlFor="pr-checkin">Check In Date</label>
            <input 
              id="pr-checkin"
              type="date" 
              className="pr-booking-input"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          
          <div className="pr-booking-field">
            <label className="pr-booking-label" htmlFor="pr-checkout">Check Out Date</label>
            <input 
              id="pr-checkout"
              type="date" 
              className="pr-booking-input"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          
          <div className="pr-booking-field">
            <label className="pr-booking-label" htmlFor="pr-guests-selector">Lease Terms</label>
            <select 
              id="pr-guests-selector"
              className="pr-booking-input"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            >
              <option value="1 Guest">Single Tenant</option>
              <option value="2 Guests">Shared Lease (2)</option>
              <option value="3 Guests">Family Lease (3+)</option>
              <option value="Commercial">Commercial Tenant</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="pr-btn-primary" 
            style={{ 
              gridColumn: 'span 4', 
              marginTop: '1rem', 
              padding: '1.5rem', 
              borderRadius: '16px',
              fontSize: '1rem' 
            }}
            id="pr-booking-submit"
          >
            ⚡ Synchronize Rental Search
          </button>
        </form>
      </section>

      {/* Trust Metrics Section */}
      <section style={{ padding: '8rem 0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center' }} className="pr-hero">
          <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '2.5rem', lineHeight: 1.1, color: 'var(--pr-slate)' }}>Digital First <br/>Lease Protocols.</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--pr-text-muted)', lineHeight: 1.8 }}>
                  Our property leasing vertical is engineered from scratch for high-fidelity compliance. From immersive virtual galleries to automated cryptographic lease signing nodes, we have removed the friction from securing residential nodes.
              </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="pr-stats-grid">
              <TrustMetrics value="100%" label="DIGITAL_LEASES" />
              <TrustMetrics value="24h" label="MAINTENANCE_SLA" />
              <TrustMetrics value="Instant" label="APPROVAL_SYNC" />
              <TrustMetrics value="Verified" label="NODE_STATUS" />
          </div>
      </section>

      {/* Navigation Filter Selector */}
      <div style={{ background: 'var(--pr-white)', padding: '2rem', borderRadius: '100px', border: '1px solid var(--pr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }} className="pr-filter-bar">
          <div style={{ display: 'flex', gap: '3rem', paddingLeft: '1.5rem' }} className="pr-filter-links">
              {['Studio', 'Apartment', 'Loft', 'Penthouse', 'Townhouse'].map(type => (
                  <span key={type} className="pr-mono" style={{ color: 'var(--pr-text-muted)', cursor: 'pointer', fontWeight: 700 }} onClick={() => alert(`Filtering by category: ${type}`)}>{type}</span>
              ))}
          </div>
          <div style={{ color: 'var(--pr-mint)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', paddingRight: '1.5rem' }} className="pr-mono" onClick={() => alert('Sort controls activated.')}>
            SORT: NEWEST_FIRST ⌄
          </div>
      </div>

      {/* Rent Grid */}
      <section id="pr-discovery-grid">
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px' }}>Featured Certified Properties</h2>
        <p style={{ color: 'var(--pr-text-muted)', marginBottom: '3rem', fontSize: '1rem' }}>Siloed verified residential units matching active Elite standards.</p>
        
        <div className="pr-rent-grid">
          {rentals.map((r, i) => (
            <LeaseUnitCard key={i} {...r} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ marginTop: '12rem', padding: '8rem 4rem', background: 'linear-gradient(135deg, #f0fdfa 0%, #fff 100%)', borderRadius: '48px', border: '1px solid var(--pr-border)', textAlign: 'center', boxShadow: 'var(--pr-shadow-lg)' }} className="pr-cta-box">
          <div className="pr-mono" style={{ marginBottom: '2.5rem' }}>AUTHORIZE_NEW_RESIDENCE</div>
          <h2 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-3px', marginBottom: '3rem', color: 'var(--pr-slate)', lineHeight: 1.1 }}>
              Ready to <br/>
              Move In?
          </h2>
          <p style={{ maxWidth: '580px', margin: '0 auto 5rem', color: 'var(--pr-text-muted)', fontSize: '1.2rem', lineHeight: 1.8 }}>
              Join thousands of verified tenants utilizing the Sellio platform for securing residential properties with absolute transparency.
          </p>
          <button className="pr-btn-primary" style={{ padding: '2rem 7rem', fontSize: '1.15rem' }} id="pr-btn-cta-auth" onClick={() => alert('Authentication and signature pipeline initializing.')}>
              CREATE TENANT NODE
          </button>
      </section>
    </div>
  );
}
