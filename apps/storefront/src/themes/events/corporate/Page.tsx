import React from 'react';
import { SpeakerCard, AgendaItem } from './components';

export default function CorporatePage() {
  const speakers = [
    { name: "Dr. Sarah Chen", role: "Chief AI Officer", company: "Nexus Logic", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076" },
    { name: "Marcus Thorne", role: "VP of Engineering", company: "Scale Flow", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070" },
    { name: "Elena Rodriguez", role: "Product Director", company: "Cloud Core", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2070" },
    { name: "James Wilson", role: "Security Lead", company: "Cyber Shield", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2070" },
  ];

  const agenda = [
    { time: "09:00 AM", title: "Opening Keynote: The Future of Distributed Intelligence", speaker: "Dr. Sarah Chen", track: "KEYNOTE" },
    { time: "11:00 AM", title: "Scaling High-Availability Microservices", speaker: "Marcus Thorne", track: "ENGINEERING" },
    { time: "01:30 PM", title: "Designing for Global User Adoption", speaker: "Elena Rodriguez", track: "PRODUCT" },
    { time: "03:30 PM", title: "Hardening the Digital Core", speaker: "James Wilson", track: "SECURITY" },
  ];

  return (
    <div>
      <section className="corporate-hero">
        <h1 className="hero-conf-title">The Global Engineering Forum 2026</h1>
        <div className="hero-conf-meta">
          <span>OCTOBER 14-16, 2026</span>
          <span>SAN FRANCISCO, CA</span>
          <span>5,000+ ATTENDEES</span>
        </div>
      </section>

      <section style={{ padding: '6rem 4rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '4rem' }}>FEATURED_SPEAKERS</h2>
        <div className="speaker-grid">
          {speakers.map((s, i) => (
            <SpeakerCard key={i} {...s} />
          ))}
        </div>
      </section>

      <section className="agenda-section">
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '4rem' }}>CONFERENCE_AGENDA</h2>
        <div style={{ maxWidth: '1000px' }}>
          {agenda.map((item, i) => (
            <AgendaItem key={i} {...item} />
          ))}
        </div>
      </section>

      <section style={{ padding: '8rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Limited Passes Remaining</h2>
          <p style={{ opacity: 0.7, marginBottom: '2.5rem' }}>
            Join the world's leading engineers, architects, and product leaders for three days of deep-dive workshops and networking.
          </p>
          <button style={{ 
            backgroundColor: 'var(--color-primary)', 
            color: 'white', 
            padding: '1.2rem 4rem', 
            borderRadius: '4px', 
            border: 'none', 
            fontWeight: 800, 
            fontSize: '1.1rem',
            cursor: 'pointer'
          }}>
            RESERVE_YOUR_PASS
          </button>
        </div>
      </section>
    </div>
  );
}
