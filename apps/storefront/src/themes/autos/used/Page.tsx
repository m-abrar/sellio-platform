'use client';
import React from 'react';
import { UsedHeader, UsedCarCard, DealerLogo, StepCard, UsedFooter } from './components';

export default function Page() {
  const cars = [
    { title: "2018 Honda Civic", price: "$15,500", mileage: "40,000 miles", location: "New York", dealer: "AutoWorld Dealership", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=600" },
    { title: "2020 Toyota Camry", price: "$19,800", mileage: "25,000 miles", location: "Los Angeles", dealer: "City Motors", image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?q=80&w=600" },
    { title: "2016 Ford Focus", price: "$9,200", mileage: "60,000 miles", location: "Chicago", dealer: "Honest Used Cars", image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600" },
    { title: "2019 Mazda 3", price: "$17,000", mileage: "30,000 miles", location: "Dallas", dealer: "Zoom Motors", image: "https://images.unsplash.com/photo-1606132712398-b8070940428d?q=80&w=600" },
  ];

  return (
    <div className="autos-used-wrapper">
      <UsedHeader />

      {/* Hero */}
      <section className="us-hero" id="home">
        <h1 className="us-hero-title">Find Your Perfect Used Car Today</h1>
        <p className="us-hero-subtitle">Trusted listings, verified sellers, and transparent pricing. Your next drive starts here.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#featured-listings" className="us-btn us-btn-orange">Browse Cars</a>
            <a href="#how-it-works" className="us-btn us-btn-outline" style={{ color: 'white', borderColor: 'white' }}>Sell a Car</a>
        </div>
      </section>

      {/* Filter Card */}
      <div className="us-filter-card">
        <h5 className="us-text-blue us-fw-bold" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Quick Search</h5>
        <div className="us-filter-grid">
            <div className="us-filter-group"><select className="us-select"><option>Brand (e.g., Honda)</option></select></div>
            <div className="us-filter-group"><select className="us-select"><option>Model</option></select></div>
            <div className="us-filter-group"><select className="us-select"><option>Price Range</option></select></div>
            <div className="us-filter-group"><select className="us-select"><option>Max Mileage</option></select></div>
            <div className="us-filter-group"><select className="us-select"><option>Location</option></select></div>
            <button className="us-btn us-btn-orange" style={{ padding: '0.8rem 2rem' }}>Search</button>
        </div>
      </div>

      {/* Listings */}
      <section className="us-section" id="featured-listings">
        <h2 className="us-section-title">Featured Listings</h2>
        <div className="us-grid">
            {cars.map((car, i) => (
                <UsedCarCard key={i} {...car} />
            ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <a href="#" className="us-btn us-btn-outline">View All Listings →</a>
        </div>
      </section>

      {/* Deal of the Week */}
      <section className="us-section" style={{ backgroundColor: 'white' }}>
        <h2 className="us-section-title">⭐ Deal of the Week! ⭐</h2>
        <div className="us-deal-card">
            <span className="us-badge-deal">SAVE $3,000!</span>
            <div>
                <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800" alt="Deal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 className="us-text-blue us-fw-bold" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>2021 Hyundai Elantra Limited</h3>
                <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Low Mileage, Single Owner, Full Service History.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <span className="us-text-orange us-fw-bold" style={{ fontSize: '2.5rem' }}>$21,995</span>
                    <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '1.25rem' }}>$24,995</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: '#555', lineHeight: 2 }}>
                    <li>⏱️ Only 15,000 Miles</li>
                    <li>📅 Model Year 2021</li>
                    <li>⛽ Great MPG</li>
                </ul>
                <a href="#" className="us-btn us-btn-orange" style={{ width: '100%' }}>Claim This Deal Now</a>
            </div>
        </div>
      </section>

      {/* Trusted Dealers */}
      <section className="us-section" id="trusted-dealers">
        <h2 className="us-section-title">Trusted Dealers</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '1.1rem' }}>We partner with top-rated, verified dealerships to ensure a safe transaction.</p>
        <div className="us-dealer-grid">
            <DealerLogo name="AutoWorld" rating={4.8} />
            <DealerLogo name="City Motors" rating={4.1} />
            <DealerLogo name="Honest Used Cars" rating={5.0} />
            <DealerLogo name="Zoom Motors" rating={3.6} />
            <DealerLogo name="Prime Autos" rating={4.7} />
            <DealerLogo name="Elite Drives" rating={4.9} />
        </div>
      </section>

      {/* How It Works */}
      <section className="us-section" id="how-it-works" style={{ backgroundColor: 'white' }}>
        <h2 className="us-section-title">How It Works: 3 Simple Steps</h2>
        <div className="us-step-grid">
            <StepCard 
                icon="🔍" 
                title="1. Search & Filter" 
                desc="Easily find your dream car with our powerful, intuitive search tools." 
            />
            <StepCard 
                icon="💬" 
                title="2. Contact a Seller" 
                desc="Talk directly to verified dealers or private sellers, all from one place." 
            />
            <StepCard 
                icon="🛣️" 
                title="3. Test Drive & Drive" 
                desc="Take a test drive, finalize the deal, and hit the open road!" 
            />
        </div>
      </section>

      <UsedFooter />
    </div>
  );
}
