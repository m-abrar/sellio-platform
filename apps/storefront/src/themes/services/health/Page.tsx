
import React from 'react';
import { SpecialistCard } from './components';

export default function Page() {
  const specialists = [
    { name: "Dr. Sarah Chen", title: "DERMATOLOGIST", image: "https://images.unsplash.com/photo-1559839734-2b71f1e3c770?q=80&w=2000", rating: "4.9", availability: "TOMORROW" },
    { name: "Dr. Marcus Thorne", title: "CARDIOLOGIST", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2000", rating: "5.0", availability: "TODAY" },
    { name: "Dr. Elena Rossi", title: "PSYCHOLOGIST", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2000", rating: "4.8", availability: "MON, AUG 18" },
    { name: "Dr. Julian Voss", title: "NUTRITIONIST", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2000", rating: "4.9", availability: "WED, AUG 20" },
  ];

  return (
    <div>
      {/* Health Hero */}
      <section className="health-hero">
        <div className="hero-health-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.4rem 1rem', background: '#0d9488', color: 'white', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800 }}>TRUSTED_CARE</div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0d9488' }}>Verified by Sellio Health Node</span>
            </div>
            <h1 className="health-hero-title">Your Health, <br/>Expertly Curated.</h1>
            <p className="health-hero-subtitle">
                Connect with world-class medical specialists and wellness practitioners. Personalized healthcare protocols designed for your unique physiology and lifestyle.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <button className="health-btn">BOOK_CONSULTATION</button>
                <button style={{ 
                    padding: '1rem 2.5rem', 
                    background: 'white', 
                    color: '#111827', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    fontWeight: 700 
                }}>FIND_A_SPECIALIST</button>
            </div>
        </div>
        <div style={{ position: 'relative' }}>
            <div style={{ width: '100%', height: '500px', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
                <img 
                    src="https://images.unsplash.com/photo-1504813184591-01592fd039e5?q=80&w=2071" 
                    alt="Clinical Excellence" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            {/* Floating Trust Card */}
            <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#0d9488' }}>
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path></svg>
                </div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>99.9% Secure</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>HIPAA Compliant Node</div>
                </div>
            </div>
        </div>
      </section>

      {/* Specialist Grid */}
      <section className="health-section">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#134e4a', marginBottom: '1rem' }}>Top_Rated_Practitioners</h2>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Every specialist is vetted for clinical excellence and patient satisfaction.</p>
        </div>
        
        <div className="health-grid">
            {specialists.map((s, i) => (
                <SpecialistCard key={i} {...s} />
            ))}
        </div>
      </section>

      {/* Wellness Plans */}
      <section style={{ padding: '8rem 4rem', background: '#0f172a', color: 'white', overflow: 'hidden', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '8rem', alignItems: 'center' }}>
            <div>
                <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem', lineHeight: 1.2 }}>Comprehensive <br/>Wellness Protocols.</h2>
                <p style={{ fontSize: '1.1rem', opacity: 0.6, lineHeight: 1.8, marginBottom: '3rem' }}>
                    Beyond reactive care. Our wellness plans integrate preventive medicine, nutritional optimization, and biometric tracking to help you achieve peak performance and longevity.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0d9488', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.7rem' }}>✓</div>
                        <span>Biometric Analysis Integration</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0d9488', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.7rem' }}>✓</div>
                        <span>Nutritional Genetic Mapping</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0d9488', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.7rem' }}>✓</div>
                        <span>24/7 Specialist Access</span>
                    </div>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0d9488', marginBottom: '1rem' }}>BASIC_PLAN</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>$49<span style={{ fontSize: '1rem', opacity: 0.4 }}>/mo</span></div>
                    <button style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', fontWeight: 700 }}>GET_STARTED</button>
                </div>
                <div style={{ background: '#0d9488', padding: '2.5rem', borderRadius: '24px', transform: 'scale(1.05)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f0fdfa', marginBottom: '1rem' }}>OPTIMUM_v3</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>$129<span style={{ fontSize: '1rem', opacity: 0.8 }}>/mo</span></div>
                    <button style={{ width: '100%', padding: '0.75rem', background: 'white', color: '#0d9488', border: 'none', borderRadius: '8px', fontWeight: 700 }}>GET_STARTED</button>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
