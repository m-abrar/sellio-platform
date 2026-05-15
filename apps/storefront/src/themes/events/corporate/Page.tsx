'use client';
import React from 'react';
import { SpeakerCard, AgendaItem } from './components';

export default function Page() {
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
      {/* Hero Section */}
      <section className="ec-hero">
        <div className="ec-mono" style={{ marginBottom: '2rem' }}>WORLD_ENGINEERING_SUMMIT // 2026</div>
        <h1 className="ec-heading-xl">
          The Future of <br/>
          <span style={{ color: 'var(--ec-blue)' }}>Structural</span> Excellence.
        </h1>
        
        <div className="ec-hero-meta">
            <div>
                <div className="ec-mono" style={{ color: 'var(--ec-text-muted)', marginBottom: '0.5rem' }}>DATE</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>OCTOBER 14-16</div>
            </div>
            <div>
                <div className="ec-mono" style={{ color: 'var(--ec-text-muted)', marginBottom: '0.5rem' }}>LOCATION</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>SAN FRANCISCO, CA</div>
            </div>
            <div>
                <div className="ec-mono" style={{ color: 'var(--ec-text-muted)', marginBottom: '0.5rem' }}>CAPACITY</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>5,000 DELEGATES</div>
            </div>
        </div>

        <div style={{ marginTop: '5rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            <button className="ec-btn-primary">GET_DELEGATE_PASS</button>
            <button className="ec-btn-outline">VIEW_FULL_SCHEDULE</button>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="ec-section">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <div className="ec-mono">FACULTY_SYNC // 2026</div>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginTop: '1.5rem', letterSpacing: '-2px' }}>Distinguished Speakers</h2>
        </div>
        
        <div className="ec-speaker-grid">
          {speakers.map((s, i) => (
            <SpeakerCard key={i} {...s} />
          ))}
        </div>
      </section>

      {/* Agenda Section */}
      <section className="ec-section" style={{ background: 'var(--ec-bone)', borderRadius: 'var(--ec-radius-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem' }}>
            <div>
                <div className="ec-mono">CURATED_SCHEDULE // DAY_01</div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginTop: '1.5rem', letterSpacing: '-2px' }}>The Agenda</h2>
            </div>
            <p style={{ maxWidth: '400px', color: 'var(--ec-text-muted)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                Four tracks of intense technical exploration, ranging from core infrastructure to product design philosophy.
            </p>
        </div>

        <div className="ec-agenda-list">
          {agenda.map((item, i) => (
            <AgendaItem key={i} {...item} />
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '6rem' }}>
            <button className="ec-btn-outline">DOWNLOAD_FULL_PROGRAM_PDF</button>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="ec-section" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-3px', marginBottom: '3rem' }}>
                  Secure Your <br/>
                  <span style={{ color: 'var(--ec-blue)' }}>Seat in History.</span>
              </h2>
              <p style={{ color: 'var(--ec-text-muted)', fontSize: '1.5rem', lineHeight: 1.6, marginBottom: '5rem' }}>
                  Registration closes September 30. Join 5,000+ industry leaders for the most influential engineering event of the year.
              </p>
              <button className="ec-btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.25rem' }}>
                  RESERVE_MY_FORUM_PASS
              </button>
          </div>
      </section>
    </div>
  );
}
