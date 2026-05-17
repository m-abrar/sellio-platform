'use client';
import React from 'react';
import { ClassicHeader, ClassicCarCard, AuctionCard, ClassicFooter } from './components';

export default function Page() {
  const cars = [
    { title: "1965 Ford Mustang", desc: "Convertible, V8 Engine", price: "$45,000", image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=600" },
    { title: "1970 Porsche 911 T", desc: "Rally-Ready, Matching Numbers", price: "$120,000", image: "/themes/autos/classic/porsche_911.png" },
    { title: "1961 Jaguar E-Type", desc: "Series 1 Coupe, Restored", price: "$185,000", image: "/themes/autos/classic/jaguar_etype.png" },
    { title: "1955 Mercedes 300 SL", desc: "Gullwing, Highly Original", price: "$1,500,000", image: "/themes/autos/classic/mercedes_300sl.png" },
  ];

  const auctions = [
    { title: "1957 Chevrolet Bel Air", desc: "Iconic American Classic - No Reserve", currentBid: "$78,000", timeRemaining: "01D : 14H : 30M : 00S", image: "/themes/autos/classic/chevy_belair.png" },
    { title: "1962 Ferrari 250 GTO", desc: "Highly Sought-After Investment", currentBid: "$38,000,000", timeRemaining: "05D : 08H : 15M : 00S", image: "/themes/autos/classic/ferrari_250gto.png" }
  ];

  return (
    <div className="autos-classic-wrapper">
      <ClassicHeader />

      {/* Hero Section */}
      <section className="ac-hero">
        <div className="ac-hero-overlay"></div>
        <div className="ac-hero-content">
            <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '1rem', color: 'var(--ac-secondary)' }}>The Collector's Choice</p>
            <h1>Discover Timeless Classics</h1>
            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', lineHeight: 1.6, textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                Your journey into automotive history begins here. Find, bid, or sell the world's most desired vintage automobiles.
            </p>
            <div className="ac-hero-buttons">
                <a href="#listings" className="ac-btn ac-btn-cta" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Browse Cars</a>
                <a href="#sell" className="ac-btn ac-btn-gold" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Start Selling</a>
            </div>
        </div>
      </section>

      {/* Filters */}
      <section className="ac-filter-section">
        <div style={{ flex: 1, minWidth: '100%', marginBottom: '1rem' }}>
            <h2 className="ac-heading" style={{ fontSize: '2rem', textAlign: 'center' }}>Find Your Dream Classic</h2>
        </div>
        <div className="ac-filter-group">
            <select className="ac-select">
                <option>Make (e.g., Ford)</option>
                <option>Ford</option>
                <option>Porsche</option>
                <option>Jaguar</option>
                <option>Mercedes-Benz</option>
                <option>Chevrolet</option>
                <option>Ferrari</option>
            </select>
        </div>
        <div className="ac-filter-group">
            <select className="ac-select">
                <option>Model (e.g., Mustang)</option>
                <option>Mustang</option>
                <option>911 T</option>
                <option>E-Type</option>
                <option>300 SL</option>
                <option>Bel Air</option>
                <option>250 GTO</option>
            </select>
        </div>
        <div className="ac-filter-group">
            <select className="ac-select">
                <option>Year</option>
                <option>1950 - 1959</option>
                <option>1960 - 1969</option>
                <option>1970 - 1979</option>
                <option>Pre-1950</option>
            </select>
        </div>
        <div className="ac-filter-group">
            <select className="ac-select">
                <option>Price Range</option>
                <option>$10k - $50k</option>
                <option>$50k - $150k</option>
                <option>$150k - $500k</option>
                <option>$500k+</option>
            </select>
        </div>
        <div className="ac-filter-group">
            <button className="ac-btn ac-btn-cta" style={{ width: '100%', padding: '0.8rem 0' }}>Search</button>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="ac-section" id="listings">
        <h2 className="ac-section-title">Featured Classics for Sale</h2>
        <div className="ac-grid">
            {cars.map((car, i) => (
                <ClassicCarCard key={i} {...car} />
            ))}
        </div>
      </section>

      {/* Live Auctions */}
      <section className="ac-auction-section" id="auctions">
        <h2 className="ac-section-title">Live Auction Spotlight <span style={{ background: 'var(--ac-primary)', color: 'white', fontSize: '1rem', padding: '0.2rem 0.6rem', borderRadius: '4px', verticalAlign: 'middle', animation: 'pulse 1.5s infinite' }}>LIVE</span></h2>
        <div className="ac-auction-grid">
            {auctions.map((a, i) => (
                <AuctionCard key={i} {...a} />
            ))}
        </div>
      </section>

      {/* About */}
      <section className="ac-section" id="about" style={{ background: 'var(--ac-light)' }}>
        <div className="ac-about-grid">
            <div>
                <img src="/themes/autos/classic/why_collect.png" alt="Why Collect" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            </div>
            <div>
                <h2 className="ac-heading" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Collect Classic Cars?</h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.8 }}>
                    More than just vehicles, classic cars are <strong>rolling investments</strong>, passionate hobbies, and tangible links to history.
                </p>
                <p style={{ color: '#555', marginBottom: '1.5rem', lineHeight: 1.8 }}>
                    Each curve, engine note, and stitch of leather tells a story of innovation, design, and a bygone era. We connect discerning collectors with meticulously curated classics, ensuring authenticity, provenance, and investment quality.
                </p>
                <a href="#" className="ac-btn ac-btn-cta">Read Our Story</a>
            </div>
        </div>
      </section>

      <ClassicFooter />
    </div>
  );
}
