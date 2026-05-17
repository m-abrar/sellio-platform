'use client';
import React from 'react';
import { LuxuryHeader, LuxuryCarCard, LuxuryFooter } from './components';

export default function Page() {
  const cars = [
    { title: "2025 Mercedes S-Class", specs: "Sleek Sedan | 5,000 mi", price: "$110,000", image: "/themes/autos/luxury/mercedes.png" },
    { title: "2024 Rolls Royce Phantom", specs: "Ultra Luxury | 2,100 mi", price: "$420,000", image: "/themes/autos/luxury/rolls.png" },
    { title: "2025 Porsche Taycan Turbo", specs: "Electric Coupe | 800 mi", price: "$160,000", image: "/themes/autos/luxury/porsche.png" },
    { title: "2023 Bentley Continental GT", specs: "Grand Tourer | 6,500 mi", price: "$245,000", image: "/themes/autos/luxury/bentley.png" }
  ];

  const testimonials = [
    { name: "Julian D.", role: "Collector", quote: "The service was impeccable and discreet. Found my dream classic car with ease. Truly a five-star experience from start to finish.", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100" },
    { name: "Sarah K.", role: "Entrepreneur", quote: "Seamless, professional, and unparalleled inventory. They connected me with the perfect new SUV before it was even publicly listed.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100" },
    { name: "Marcus T.", role: "Investor", quote: "Beyond expectations. The attention to detail and personalized guidance made the acquisition of my Rolls Royce a pleasure.", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100" }
  ];

  return (
    <div className="autos-luxury-wrapper">
      <LuxuryHeader />

      {/* Hero Section */}
      <section className="lx-hero">
        <div className="lx-hero-overlay"></div>
        <div className="lx-hero-content">
            <h1 className="lx-hero-title">Experience the Luxury You Deserve</h1>
            <p style={{ fontSize: '1.25rem', fontWeight: 300, marginBottom: '2rem', lineHeight: 1.6 }}>
                Your journey into unparalleled elegance and performance starts here. Discover hand-picked masterpieces.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#collections" className="lx-btn lx-btn-gold">Explore Collection</a>
                <a href="#contact" className="lx-btn lx-btn-outline">Book Now</a>
            </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="lx-filter-bar">
        <select className="lx-select"><option>Brand</option></select>
        <select className="lx-select"><option>Price Range</option></select>
        <select className="lx-select"><option>Year</option></select>
        <select className="lx-select"><option>Category</option></select>
        <button className="lx-btn lx-btn-gold" style={{ flex: 1, padding: '0.8rem' }}>Search</button>
      </section>

      {/* Featured Masterpieces */}
      <section className="lx-section" id="collections">
        <h2 className="lx-section-title">Featured Masterpieces</h2>
        <div className="lx-grid">
            {cars.map((car, i) => (
                <LuxuryCarCard key={i} {...car} />
            ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <a href="#" className="lx-btn lx-btn-gold" style={{ padding: '1rem 3rem' }}>View All Inventory</a>
        </div>
      </section>

      {/* Exclusive Showcase */}
      <section className="lx-section" style={{ backgroundColor: '#111111' }}>
        <h2 className="lx-section-title" style={{ color: 'white' }}>Exclusive Showcase</h2>
        <div className="lx-showcase-item">
            <div>
                <img src="/themes/autos/luxury/ferrari.png" style={{ width: '100%', borderRadius: '8px' }} alt="Ferrari" />
            </div>
            <div>
                <h3 className="lx-heading lx-text-gold" style={{ fontSize: '2rem', marginBottom: '1rem' }}>The Crimson Legend</h3>
                <p style={{ fontSize: '1.2rem', color: 'var(--lx-text-muted)', marginBottom: '1.5rem' }}>1963 Ferrari 250 GTO</p>
                <p style={{ marginBottom: '2rem', lineHeight: 1.6 }}>
                    A one-of-a-kind vintage masterpiece, meticulously restored. This vehicle represents automotive history and unparalleled exclusivity.
                </p>
                <a href="#" className="lx-btn lx-btn-gold">Inquire About Price</a>
            </div>
        </div>
      </section>

      {/* Brands */}
      <section className="lx-section" id="brands">
        <h2 className="lx-section-title">Our Curated Brands</h2>
        <div className="lx-brand-grid">
            <div className="lx-brand-item">Ferrari</div>
            <div className="lx-brand-item">Lamborghini</div>
            <div className="lx-brand-item">Mercedes</div>
            <div className="lx-brand-item">Rolls Royce</div>
            <div className="lx-brand-item">Porsche</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="lx-section" style={{ backgroundColor: '#111111' }}>
        <h2 className="lx-section-title" style={{ color: 'white' }}>Client Experiences</h2>
        <div className="lx-testimonial-grid">
            {testimonials.map((t, i) => (
                <div key={i} className="lx-testimonial-card">
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <img src={t.avatar} alt={t.name} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--lx-gold)', marginRight: '1rem', objectFit: 'cover' }} />
                        <div>
                            <h5 style={{ fontWeight: 700, margin: 0 }}>{t.name}</h5>
                            <small style={{ color: 'var(--lx-text-muted)' }}>{t.role}</small>
                        </div>
                    </div>
                    <p style={{ fontStyle: 'italic', lineHeight: 1.6 }}>"{t.quote}"</p>
                </div>
            ))}
        </div>
      </section>

      <LuxuryFooter />
    </div>
  );
}
