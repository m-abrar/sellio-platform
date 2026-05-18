'use client';
import React from 'react';
import { FreelanceHeader, GigCard, FreelanceFooter } from './components';

export default function Page() {
  const gigs = [
    { title: "I will design a modern minimalist logo for your brand", name: "Alex Design", avatar: "/themes/jobs/freelance/1.webp", image: "/themes/jobs/freelance/10.webp", rating: 4.9, reviews: 1043, price: "$50" },
    { title: "I will build a responsive Next.js web application", name: "Sarah Code", avatar: "/themes/jobs/freelance/2.webp", image: "/themes/jobs/freelance/11.webp", rating: 5.0, reviews: 312, price: "$200" },
    { title: "I will write SEO optimized blog posts and articles", name: "John Writes", avatar: "/themes/jobs/freelance/3.webp", image: "/themes/jobs/freelance/12.webp", rating: 4.8, reviews: 890, price: "$25" },
    { title: "I will edit your YouTube videos professionally", name: "Mike Visuals", avatar: "/themes/jobs/freelance/4.webp", image: "/themes/jobs/freelance/13.webp", rating: 4.9, reviews: 567, price: "$40" },
  ];

  return (
    <div className="jobs-freelance-wrapper">
      <FreelanceHeader />

      {/* Hero */}
      <section className="jf-hero">
        <h1 className="jf-hero-title">Find the perfect <span style={{ fontStyle: 'italic' }}>freelance</span> services<br/>for your business</h1>
        
      </section>

      {/* Search Bar */}
      <div className="jf-search-container">
          <span style={{ padding: '1rem', fontSize: '1.25rem', color: 'var(--jf-text-muted)' }}>🔍</span>
          <input type="text" className="jf-search-input" placeholder='Try "logo design" or "React developer"' />
          <button className="jf-btn jf-btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Search</button>
      </div>

      {/* Categories Slider */}
      <div className="jf-categories">
          <div className="jf-cat-pill active">All Categories</div>
          <div className="jf-cat-pill">Graphics & Design</div>
          <div className="jf-cat-pill">Programming & Tech</div>
          <div className="jf-cat-pill">Digital Marketing</div>
          <div className="jf-cat-pill">Video & Animation</div>
          <div className="jf-cat-pill">Writing & Translation</div>
          <div className="jf-cat-pill">Music & Audio</div>
          <div className="jf-cat-pill">Business</div>
      </div>

      {/* Popular Gigs */}
      <section className="jf-section" id="explore">
          <h2 className="jf-section-title">
              Popular professional services
          </h2>
          <div className="jf-grid">
              {gigs.map((gig, i) => (
                  <GigCard key={i} {...gig} />
              ))}
          </div>
      </section>

      {/* Promo Block */}
      <section className="jf-promo">
          <div>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>A whole world of freelance talent at your fingertips</h2>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', fontSize: '1.2rem', lineHeight: 1.8 }}>
                  <li>✓ The best for every budget</li>
                  <li>✓ Quality work done quickly</li>
                  <li>✓ Protected payments, every time</li>
                  <li>✓ 24/7 support</li>
              </ul>
              <button className="jf-btn" style={{ backgroundColor: 'white', color: 'var(--jf-accent)' }}>Explore GigHive Pro</button>
          </div>
          <div className="d-none d-lg-block" style={{ width: '40%' }}>
              <img src="/themes/jobs/freelance/14.webp" alt="Team" style={{ width: '100%', borderRadius: '16px', transform: 'rotate(5deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} />
          </div>
      </section>

      <FreelanceFooter />
    </div>
  );
}
