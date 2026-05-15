
import React from 'react';

export const PulseExperience = () => (
    <section className="pulse-experience">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }}>
            <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--sonic-pink)', letterSpacing: '8px' }}>THE_PROTOCOL</span>
                <h2 className="exp-title">Immersive <br/>Distribution.</h2>
                <p style={{ fontSize: '1.25rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                    Sonic Pulse is more than a ticketing engine. It is a high-fidelity experience node designed to synchronize global music enthusiasts with exclusive festival distribution. Every ticket is a verified asset in the sonic registry.
                </p>
                <div style={{ display: 'flex', gap: '4rem' }}>
                    <div>
                        <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'white' }}>128bit</div>
                        <div style={{ fontSize: '0.65rem', color: '#444', fontWeight: 800, letterSpacing: '2px' }}>AUDIO_PRECISION</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'white' }}>Global</div>
                        <div style={{ fontSize: '0.65rem', color: '#444', fontWeight: 800, letterSpacing: '2px' }}>DISTRIBUTION_NODE</div>
                    </div>
                </div>
            </div>
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '200px', height: '200px', borderTop: '2px solid var(--sonic-pink)', borderRight: '2px solid var(--sonic-pink)' }}></div>
                <div style={{ height: '600px', background: 'var(--sonic-card)', border: '1px solid var(--sonic-border)', overflow: 'hidden' }}>
                    <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070" alt="Concert Crowd" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
                </div>
            </div>
        </div>
    </section>
);
