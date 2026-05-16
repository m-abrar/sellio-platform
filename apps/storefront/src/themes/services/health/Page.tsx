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
      {/* Serene Clinical Hero */}
      <section className="sh-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ padding: '0.4rem 1.2rem', background: 'var(--sh-teal)', color: 'white', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 900 }}>TRUSTED_CARE</div>
              <div className="sh-mono" style={{ fontSize: '0.65rem' }}>VERIFIED_BY_SELLIO_HEALTH_NODE</div>
          </div>
          <h1 className="sh-heading-xl">
            Your Health, <br/>
            Expertly <br/>
            <span style={{ color: 'var(--sh-teal)' }}>Curated.</span>
          </h1>
          <p style={{ marginTop: '5rem', fontSize: '1.25rem', color: 'var(--sh-grey)', lineHeight: 1.8, maxWidth: '600px' }}>
            Connect with world-class medical specialists and wellness practitioners. Personalized healthcare protocols designed for your unique physiology.
          </p>
          <div style={{ marginTop: '6rem', display: 'flex', gap: '3rem' }}>
            <button className="sh-btn-primary">Book Consultation</button>
            <button style={{ 
                background: 'transparent', 
                border: '1px solid var(--sh-border)', 
                color: 'var(--sh-blue)', 
                padding: '1.25rem 3.5rem', 
                borderRadius: '12px', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                cursor: 'pointer',
                fontSize: '0.85rem'
            }}>
                Find_Specialist
            </button>
          </div>
        </div>
        <div className="sh-hero-img-wrapper">
          <img src="https://images.unsplash.com/photo-1504813184591-01592fd039e5?q=80&w=2071" alt="Clinical Excellence" className="sh-hero-img" />
          <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--sh-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-teal)', fontSize: '1.5rem' }}>🛡️</div>
              <div>
                  <div style={{ fontWeight: 900, fontSize: '1.25rem' }}>99.9% Secure</div>
                  <div className="sh-mono" style={{ fontSize: '0.65rem', opacity: 0.5 }}>HIPAA_COMPLIANT_NODE</div>
              </div>
          </div>
        </div>
      </section>

      {/* Vitality HUD Section */}
      <section className="sh-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem', marginTop: '5rem' }}>
          <VitalityHUD label="PRACTITIONER_SYNC" value="1.2k+" sub="Vetted specialists active across our global clinical network." />
          <VitalityHUD label="TELEMETRY_ACCURACY" value="99.9%" sub="High-fidelity data synchronization for real-time monitoring." />
          <VitalityHUD label="RESPONSE_LATENCY" value="0.01s" sub="Instant consultation availability for critical wellness nodes." />
      </section>

      {/* Specialist Registry Section */}
      <section className="sh-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="sh-mono" style={{ marginBottom: '1.5rem' }}>OFFICIAL_PRACTITIONER_REGISTRY</div>
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
      <section className="sh-section" style={{ background: 'var(--sh-blue)', borderRadius: '48px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12rem', alignItems: 'center', color: 'white', marginBottom: '10rem' }}>
          <div style={{ padding: '8rem' }}>
              <div className="sh-mono" style={{ marginBottom: '3rem', color: 'var(--sh-teal)' }}>COMPREHENSIVE_WELLNESS_PROTOCOLS</div>
              <h2 className="sh-heading-xl" style={{ color: 'white', fontSize: '4.5rem', marginBottom: '4rem' }}>Optimized <br/>Care.</h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.5, lineHeight: 2, marginBottom: '6rem' }}>
                  Beyond reactive care. Our wellness plans integrate preventive medicine, nutritional optimization, and biometric tracking.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                  {['Biometric_Analysis_Sync', 'Nutritional_Genetic_Mapping', '24/7_Specialist_Access'].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '2px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--sh-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>✓</div>
                          {item.toUpperCase()}
                      </div>
                  ))}
              </div>
          </div>
          <div style={{ padding: '8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '4rem', borderRadius: '32px' }}>
                  <div className="sh-mono" style={{ marginBottom: '1.5rem' }}>BASIC_NODE</div>
                  <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>$49<span style={{ fontSize: '1rem', opacity: 0.3 }}>/mo</span></div>
                  <button style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 800, borderRadius: '8px' }}>INITIALIZE</button>
              </div>
              <div style={{ background: 'var(--sh-teal)', padding: '4rem', borderRadius: '32px', transform: 'scale(1.05)', boxShadow: '0 40px 80px rgba(20, 184, 166, 0.2)' }}>
                  <div className="sh-mono" style={{ marginBottom: '1.5rem', color: 'white' }}>OPTIMUM_V8</div>
                  <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>$129<span style={{ fontSize: '1rem', opacity: 0.6 }}>/mo</span></div>
                  <button style={{ width: '100%', padding: '1rem', background: 'white', color: 'var(--sh-teal)', border: 'none', fontWeight: 800, borderRadius: '8px' }}>INITIALIZE</button>
              </div>
          </div>
      </section>
      
      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
