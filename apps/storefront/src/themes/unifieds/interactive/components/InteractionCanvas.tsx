
import React from 'react';

export const InteractionCanvas = () => (
    <section className="interaction-canvas">
        <div className="canvas-grid">
            <div className="canvas-item item-main" style={{ padding: '5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--motion-yellow)', letterSpacing: '4px', marginBottom: '2rem' }}>DYNAMIC_SCHEMA_V4</div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: 800, lineHeight: 0.9, marginBottom: '3rem' }}>Kinetic <br/>Architecture.</h2>
                <p style={{ maxWidth: '600px', fontSize: '1.25rem', color: '#666', lineHeight: 1.8 }}>
                    The Motion Node is a high-fidelity interactive engine designed for multi-vertical distribution. Synchronize your digital assets through fluid logic and kinetic transitions.
                </p>
                <div style={{ marginTop: '5rem', display: 'flex', gap: '4rem' }}>
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>120fps</div>
                        <div style={{ fontSize: '0.6rem', color: '#444', fontWeight: 800, letterSpacing: '2px' }}>FLUID_LATENCY</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>Realtime</div>
                        <div style={{ fontSize: '0.6rem', color: '#444', fontWeight: 800, letterSpacing: '2px' }}>INTERACTION_SYNC</div>
                    </div>
                </div>
            </div>
            <div className="canvas-item item-side" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100px', height: '100px', background: 'var(--motion-indigo)', borderRadius: '50%', boxShadow: '0 0 50px var(--motion-indigo)', opacity: 0.5 }}></div>
            </div>
            <div className="canvas-item item-side" style={{ padding: '3rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Nodes_Active</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
                    {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: '40px', background: i < 4 ? 'var(--motion-indigo)' : '#111' }}></div>)}
                </div>
            </div>
        </div>
    </section>
);
