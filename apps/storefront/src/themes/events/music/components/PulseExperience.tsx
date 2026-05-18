'use client';
import React from 'react';

export const PulseExperience = () => (
    <section className="pulse-experience">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '8rem', alignItems: 'center' }}>
            <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--neon-pink)', letterSpacing: '8px' }}>THE EXPERIENCE</span>
                <h2 className="exp-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', textTransform: 'uppercase' }}>Absolute <br/><span style={{ color: 'var(--neon-blue)' }}>Sound.</span></h2>
                <p style={{ fontSize: '1.25rem', color: '#888', lineHeight: 2, marginBottom: '4rem' }}>
                    PULSE is the definitive destination for high-velocity music culture. We don't just sell tickets; we provide verified access to the most immersive audio experiences on the planet.
                </p>
                <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'white' }}>100%</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--neon-lime)', fontWeight: 900, letterSpacing: '2px' }}>VERIFIED_ACCESS</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'white' }}>Global</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--neon-blue)', fontWeight: 900, letterSpacing: '2px' }}>EVENT_NETWORK</div>
                    </div>
                </div>
            </div>
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '200px', height: '200px', borderTop: '4px solid var(--neon-pink)', borderRight: '4px solid var(--neon-pink)', boxShadow: '0 0 20px var(--neon-pink)', borderRadius: '0 20px 0 0' }}></div>
                <div style={{ height: '600px', background: 'var(--sonic-card)', border: '1px solid var(--sonic-border)', overflow: 'hidden', borderRadius: '20px' }}>
                    <img src="/themes/events/music/15.webp" alt="Concert Crowd" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                </div>
                <div style={{ position: 'absolute', bottom: '2rem', left: '-2rem', padding: '2rem', background: 'var(--sonic-bg)', border: '1px solid var(--neon-blue)', boxShadow: '0 0 20px var(--neon-blue)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--neon-blue)', letterSpacing: '2px' }}>NEXT_UP: IBIZA_MESH</div>
                </div>
            </div>
        </div>
    </section>
);
