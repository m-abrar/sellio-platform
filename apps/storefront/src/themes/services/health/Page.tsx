'use client';
import React from 'react';
import { PractitionerCard, VitalityHUD } from './components';

export default function Page() {
  const specialists = [
    { name: "Dr. Sarah Chen", title: "DERMATOLOGIST", image: "https://images.unsplash.com/photo-1559839734-2b71f1e3c770?q=80&w=2000", rating: "4.9", availability: "TOMORROW" },
    { name: "Dr. Marcus Thorne", title: "CARDIOLOGIST", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2000", rating: "5.0", availability: "TODAY" },
    { name: "Dr. Elena Rossi", title: "PSYCHOLOGIST", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2000", rating: "4.8", availability: "MON, AUG 18" },
    { name: "Dr. Julian Voss", title: "NUTRITIONIST", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2000", rating: "4.9", availability: "WED, AUG 20" },
  ];

  return (
    <div className="services-health-theme">
      {/* Precision Clinical Hero */}
      <section className="sh-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ padding: '0.5rem 1.5rem', background: 'var(--sh-teal-light)', color: 'var(--sh-teal)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px' }}>VITALITY PROTOCOL</div>
              <div className="sh-mono" style={{ fontSize: '0.65rem', opacity: 0.6 }}>CLINICAL GRADE V2</div>
          </div>
          <h1 className="sh-heading-xl">
            Precision <br/>
            Medicine, <br/>
            <span style={{ color: 'var(--sh-teal)' }}>Delivered.</span>
          </h1>
          <p style={{ marginTop: '4rem', fontSize: '1.25rem', color: 'var(--sh-grey)', lineHeight: 1.8, maxWidth: '600px', fontWeight: 300 }}>
            Connect with an elite network of specialists and diagnosticians. We engineer personalized physiological protocols for peak human performance.
          </p>
          <div style={{ marginTop: '5rem', display: 'flex', gap: '2rem' }}>
            <button className="sh-btn-primary">INITIALIZE CONSULTATION</button>
            <button style={{ 
                background: 'transparent', 
                border: '1px solid var(--sh-border)', 
                color: 'var(--sh-blue)', 
                padding: '1.25rem 3.5rem', 
                borderRadius: '8px', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                cursor: 'pointer',
                fontSize: '0.85rem',
                letterSpacing: '1px',
                transition: 'var(--sh-transition)'
            }}>
                VIEW CLINICIANS
            </button>
          </div>
        </div>
        <div className="sh-hero-img-wrapper">
          <img src="https://images.unsplash.com/photo-1504813184591-01592fd039e5?q=80&w=2071" alt="Clinical Excellence" className="sh-hero-img" />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--sh-border)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--sh-teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-teal)', fontSize: '1.25rem' }}>+</div>
              <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--sh-blue)' }}>End-to-End Encrypted</div>
                  <div className="sh-mono" style={{ fontSize: '0.6rem', opacity: 0.6, marginTop: '0.2rem' }}>HIPAA COMPLIANT</div>
              </div>
          </div>
        </div>
      </section>

      {/* Vitality HUD Section */}
      <section className="sh-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem', marginTop: '5rem' }}>
          <VitalityHUD label="PRACTITIONERS" value="1.2k+" sub="Vetted specialists active across our global clinical network." />
          <VitalityHUD label="ACCURACY" value="99.9%" sub="High-fidelity data synchronization for real-time monitoring." />
          <VitalityHUD label="RESPONSE RATE" value="0.01s" sub="Instant consultation availability for critical wellness nodes." />
      </section>

      {/* Specialist Registry Section */}
      <section className="sh-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="sh-mono" style={{ marginBottom: '1.5rem' }}>OFFICIAL REGISTRY</div>
                  <h2 className="sh-heading-xl" style={{ fontSize: '5rem' }}>Top Rated <br/>Practitioners.</h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--sh-grey)', lineHeight: 1.8 }}>
                  Our unified protocol vetting process ensures that every specialist on the node meets our high-fidelity clinical standards.
              </div>
          </div>
          
          <div className="sh-specialist-grid">
            {specialists.map((s, i) => (
              <PractitionerCard key={i} {...s} />
            ))}
          </div>
      </section>

      {/* Wellness Protocols Section */}
      <section className="sh-section" style={{ background: 'var(--sh-blue)', borderRadius: '24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center', color: 'white', marginBottom: '10rem', overflow: 'hidden' }}>
          <div style={{ padding: '6rem 4rem 6rem 6rem' }}>
              <div className="sh-mono" style={{ marginBottom: '2rem', color: 'var(--sh-teal)' }}>CLINICAL TIERS</div>
              <h2 className="sh-heading-xl" style={{ color: 'white', fontSize: 'clamp(3rem, 5vw, 4.5rem)', marginBottom: '3rem' }}>Optimized <br/>Physiology.</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.7, lineHeight: 1.8, marginBottom: '4rem', fontWeight: 300 }}>
                  Move beyond reactive care. Our elite protocols integrate preventive diagnostics, continuous biomarker tracking, and personalized nutritional algorithms.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                  {['Biomarker Telemetry', 'Genetic Mapping', '24/7 Concierge'].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', opacity: 0.9 }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--sh-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: 'white' }}>✓</div>
                          {item.toUpperCase()}
                      </div>
                  ))}
              </div>
          </div>
          <div style={{ padding: '6rem 6rem 6rem 0', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                      <div className="sh-mono" style={{ marginBottom: '0.5rem' }}>STANDARD PLAN</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>$49<span style={{ fontSize: '1rem', opacity: 0.5 }}>/mo</span></div>
                  </div>
                  <button style={{ padding: '1rem 2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontWeight: 700, borderRadius: '6px', fontSize: '0.8rem', letterSpacing: '1px' }}>SELECT</button>
              </div>
              <div style={{ background: 'var(--sh-teal)', padding: '3rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 20px 40px rgba(13,148,136,0.3)' }}>
                  <div>
                      <div className="sh-mono" style={{ marginBottom: '0.5rem', color: 'white' }}>VITALITY PRO</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>$149<span style={{ fontSize: '1rem', opacity: 0.7 }}>/mo</span></div>
                  </div>
                  <button style={{ padding: '1rem 2rem', background: 'white', color: 'var(--sh-teal)', border: 'none', fontWeight: 800, borderRadius: '6px', fontSize: '0.8rem', letterSpacing: '1px' }}>INITIALIZE</button>
              </div>
          </div>
      </section>
      
      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
