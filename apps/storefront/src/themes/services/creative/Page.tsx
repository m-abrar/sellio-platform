'use client';
import React from 'react';
import { CrtvHeader, CrtvCategoryCard, CrtvCreativeCard, CrtvPortfolioItem, CrtvFooter } from './components';

export default function Page() {
  const categories = [
    { title: "Graphic Design", rate: "From $100", icon: "🎨" },
    { title: "Writing & Content", rate: "Copywriting, SEO", icon: "✍️" },
    { title: "Photography", rate: "Events, Products", icon: "📸" },
    { title: "Web Development", rate: "Full Stack, CMS", icon: "💻" },
    { title: "Music & Audio", rate: "Sound Design", icon: "🎵" },
    { title: "Marketing", rate: "Social Media", icon: "📈" }
  ];

  const creatives = [
    { name: "Sophia L.", title: "UX Designer", rating: "5.0", rate: "$50/hr", image: "/themes/services/creative/15.webp" },
    { name: "David P.", title: "Professional Photographer", rating: "4.8", rate: "$75/hr", image: "/themes/services/creative/16.webp" },
    { name: "Marco V.", title: "Senior Front-End Dev", rating: "4.9", rate: "$80/hr", image: "/themes/services/creative/17.webp" }
  ];

  const portfolios = [
    { title: "Modern UI Kit", category: "Graphic Design", image: "/themes/services/creative/11.webp" },
    { title: "Brand Identity", category: "Branding", image: "/themes/services/creative/12.webp" },
    { title: "Urban Photography", category: "Photography", image: "/themes/services/creative/13.webp" },
    { title: "SaaS Website", category: "UX/UI Design", image: "/themes/services/creative/14.webp" },
    { title: "Product Ad Copy", category: "Writing", image: "/themes/services/creative/2.webp" },
    { title: "Mobile App Concept", category: "Development", image: "/themes/services/creative/3.webp" }
  ];

  return (
    <div className="services-creative-theme">
      <CrtvHeader />

      {/* Hero Section */}
      <section className="crtv-hero" id="crtv-hero-section" aria-labelledby="crtv-hero-title">
        <div className="crtv-hero-overlay"></div>
        <div className="crtv-hero-content">
          <h1 id="crtv-hero-title">Hire Creative Talent Worldwide</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>
            Discover exceptional freelancers for your projects, from design to development.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="crtv-btn crtv-btn-gradient" 
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Creatives
            </button>
            <button 
              className="crtv-btn crtv-btn-outline" 
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Showcase Your Work
            </button>
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="crtv-search-bar" aria-label="Creative Search Filters">
        <input type="text" className="crtv-search-input" placeholder="Search for skills, creatives, or projects..." style={{ flex: 2 }} />
        <select className="crtv-select" aria-label="Category Selection"><option>Category</option></select>
        <select className="crtv-select" aria-label="Budget Selection"><option>Budget</option></select>
        <select className="crtv-select" aria-label="Rating Selection"><option>Rating</option></select>
        <button className="crtv-btn" style={{ background: '#6c757d', color: 'white' }} onClick={() => alert('Filters applied.')}>Filter</button>
      </section>

      {/* Categories */}
      <section className="crtv-section" id="categories" aria-labelledby="crtv-cat-title">
        <h2 className="crtv-section-title" id="crtv-cat-title"><span className="gradient-text">Featured Creative Categories</span></h2>
        <div className="crtv-category-grid">
          {categories.map((c, i) => (
            <div key={i} onClick={() => alert(`Exploring Category: ${c.title}`)}>
              <CrtvCategoryCard {...c} />
            </div>
          ))}
        </div>
      </section>

      {/* Top Creatives */}
      <section className="crtv-section" style={{ background: 'white' }} id="pricing" aria-labelledby="crtv-creatives-title">
        <h2 className="crtv-section-title" id="crtv-creatives-title">Meet Our <span className="gradient-text">Top Creatives</span></h2>
        <div className="crtv-creative-grid">
          {creatives.map((c, i) => (
            <CrtvCreativeCard key={i} {...c} />
          ))}
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="crtv-section" id="portfolios" aria-labelledby="crtv-showcase-title">
        <h2 className="crtv-section-title" id="crtv-showcase-title"><span className="gradient-text">Inspiring Portfolio Showcase</span></h2>
        <div className="crtv-masonry">
          {portfolios.map((p, i) => (
            <CrtvPortfolioItem key={i} {...p} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="crtv-section" style={{ background: 'white' }} aria-labelledby="crtv-testimonial-title">
        <h2 className="crtv-section-title" id="crtv-testimonial-title">Trusted by Clients & Creatives</h2>
        <div className="crtv-testimonial-container">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }} className="gradient-text">"</div>
            <p style={{ fontSize: '1.25rem', fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.6 }}>
                "I found my dream design job here! The platform made it incredibly easy to showcase my UI/UX work and connect with top-tier clients globally. Highly recommended for any serious creative."
            </p>
            <p style={{ fontWeight: 800 }}>Josh T., Client <span style={{ color: 'var(--crtv-text)', fontWeight: 400, opacity: 0.7 }}>- Hired a UX Designer</span></p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="crtv-cta-banner" id="contact" aria-labelledby="crtv-cta-title">
        <h2 id="crtv-cta-title" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>Ready to Hire or Get Hired?</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>Join the Creative Community Today and turn your vision into reality.</p>
        <button className="crtv-btn" style={{ background: 'white', color: '#121212', padding: '1.2rem 3rem', fontSize: '1.1rem', fontWeight: 700 }} onClick={() => alert('Onboarding sequence started!')}>Sign Up Now</button>
      </section>

      <CrtvFooter />
    </div>
  );
}
