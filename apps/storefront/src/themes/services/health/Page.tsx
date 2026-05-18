'use client';
import React from 'react';
import { PractitionerCard, VitalityHUD } from './components';

export default function Page() {
  const specialists = [
    { name: "Dr. Sarah Chen", title: "DERMATOLOGIST", image: "/themes/services/health/15.webp", rating: "4.9", availability: "TOMORROW" },
    { name: "Dr. Marcus Thorne", title: "CARDIOLOGIST", image: "/themes/services/health/16.webp", rating: "5.0", availability: "TODAY" },
    { name: "Dr. Elena Rossi", title: "PSYCHOLOGIST", image: "/themes/services/health/17.webp", rating: "4.8", availability: "MON, AUG 18" },
    { name: "Dr. Julian Voss", title: "NUTRITIONIST", image: "/themes/services/health/18.webp", rating: "4.9", availability: "WED, AUG 20" },
  ];

  return (
    <div className="services-health-theme">
      {/* Precision Clinical Hero */}
      <section className="sh-hero" id="sh-hero-section" aria-labelledby="sh-hero-title">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ padding: '0.5rem 1.5rem', background: 'var(--sh-teal-light)', color: 'var(--sh-teal)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px' }}>VITALITY PROTOCOL</div>
              <div className="sh-mono" style={{ fontSize: '0.65rem', opacity: 0.6 }}>CLINICAL GRADE V2</div>
          </div>
          <h1 className="sh-heading-xl" id="sh-hero-title">
            Precision <br/>
            Medicine, <br/>
            <span style={{ color: 'var(--sh-teal)' }}>Delivered.</span>
          </h1>
          <p style={{ marginTop: '4rem', fontSize: '1.25rem', color: 'var(--sh-grey)', lineHeight: 1.8, maxWidth: '600px', fontWeight: 300 }}>
            Connect with an elite network of specialists and diagnosticians. We engineer personalized physiological protocols for peak human performance.
          </p>
          <div style={{ marginTop: '5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <button className="sh-btn-primary" onClick={() => document.getElementById('protocols')?.scrollIntoView({ behavior: 'smooth' })}>
              INITIALIZE CONSULTATION
            </button>
            <button 
              className="sh-btn-outline-clinicians"
              onClick={() => document.getElementById('registry')?.scrollIntoView({ behavior: 'smooth' })}
            >
              VIEW CLINICIANS
            </button>
          </div>
        </div>
        <div className="sh-hero-img-wrapper">
          <img src="/themes/services/health/10.webp" alt="Clinical Excellence" className="sh-hero-img" />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--sh-border)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--sh-teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sh-teal)', fontSize: '1.25rem', fontWeight: 700 }}>+</div>
              <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--sh-blue)' }}>End-to-End Encrypted</div>
                  <div className="sh-mono" style={{ fontSize: '0.6rem', opacity: 0.6, marginTop: '0.2rem' }}>HIPAA COMPLIANT</div>
              </div>
          </div>
        </div>
      </section>

      {/* Vitality HUD Section */}
      <section className="sh-section sh-hud-section" id="telemetry" aria-label="Telemetry HUD">
          <VitalityHUD label="PRACTITIONERS" value="1.2k+" sub="Vetted specialists active across our global clinical network." />
          <VitalityHUD label="ACCURACY" value="99.9%" sub="High-fidelity data synchronization for real-time monitoring." />
          <VitalityHUD label="RESPONSE RATE" value="0.01s" sub="Instant consultation availability for critical wellness nodes." />
      </section>

      {/* Specialist Registry Section */}
      <section className="sh-section" id="registry" aria-labelledby="sh-registry-title">
          <div className="sh-registry-header">
              <div>
                  <div className="sh-mono" style={{ marginBottom: '1.5rem' }}>OFFICIAL REGISTRY</div>
                  <h2 className="sh-heading-xl sh-registry-heading">Top Rated <br/>Practitioners.</h2>
              </div>
              <div className="sh-registry-desc">
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
      <section className="sh-section sh-pricing-section" id="protocols" aria-labelledby="sh-protocols-title">
          <div className="sh-pricing-body">
              <div className="sh-mono" style={{ marginBottom: '2rem', color: 'var(--sh-teal)' }}>CLINICAL TIERS</div>
              <h2 className="sh-heading-xl" id="sh-protocols-title" style={{ color: 'white', fontSize: 'clamp(3rem, 5vw, 4.5rem)', marginBottom: '3rem' }}>Optimized <br/>Physiology.</h2>
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
          <div className="sh-pricing-cards">
              <div className="sh-plan-card">
                  <div>
                      <div className="sh-mono" style={{ marginBottom: '0.5rem' }}>STANDARD PLAN</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>$49<span style={{ fontSize: '1rem', opacity: 0.5 }}>/mo</span></div>
                  </div>
                  <button className="sh-plan-btn" onClick={() => alert('Standard plan consultation initialized.')}>SELECT</button>
              </div>
              <div className="sh-plan-card sh-plan-card-pro">
                  <div>
                      <div className="sh-mono" style={{ marginBottom: '0.5rem', color: 'white' }}>VITALITY PRO</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>$149<span style={{ fontSize: '1rem', opacity: 0.7 }}>/mo</span></div>
                  </div>
                  <button className="sh-plan-btn-pro" onClick={() => alert('Vitality Pro clinical protocol started!')}>INITIALIZE</button>
              </div>
          </div>
      </section>

      {/* Direct inquiry consult trigger section */}
      <section className="sh-section sh-consultation-section" id="contact" style={{ display: 'none' }}></section>
      
      <div style={{ height: '6rem' }}></div>
    </div>
  );
}
