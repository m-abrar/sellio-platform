
import React from 'react';

export const BrandNarrative = () => (
    <section className="brand-narrative">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--atelier-gold)', letterSpacing: '6px' }}>OUR_PHILOSOPHY</span>
            <h2 className="narrative-title">Crafting the invisible thread of elegance.</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.6, lineHeight: 2, fontWeight: 300 }}>
                The Atelier is not just a boutique; it is a high-fidelity distribution node for architectural fashion. Every piece in our collection is verified for its structural integrity and aesthetic legacy, ensuring that true luxury remains timeless.
            </p>
            <div style={{ marginTop: '6rem', display: 'flex', justifyContent: 'center', gap: '6rem' }}>
                <div>
                    <div style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>100%</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>HAND_FINISHED</div>
                </div>
                <div>
                    <div style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Global</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5, letterSpacing: '2px' }}>NODE_DISTRIBUTION</div>
                </div>
            </div>
        </div>
    </section>
);
