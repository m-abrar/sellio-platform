
import React from 'react';

export const Footer = () => (
    <footer className="pc-footer">
        <div className="pc-footer-grid">
            <div style={{ paddingRight: '1rem' }}>
                <h2 className="pc-serif pc-footer-title">
                    ESTATE <br/> 
                    <span className="pc-italic" style={{ fontWeight: 400 }}>&</span> HERITAGE
                </h2>
                <p style={{ color: 'var(--pc-beige)', opacity: 0.8, lineHeight: 2, fontSize: '0.95rem', marginBottom: '3rem', maxWidth: '400px' }}>
                    A curated distribution of the world's most distinguished historic properties. Every acquisition is verified for architectural provenance and legacy value.
                </p>
                <div style={{ display: 'flex', gap: '2rem', opacity: 0.6, fontWeight: 900, fontSize: '0.7rem', letterSpacing: '3px' }}>
                   {['FB', 'TW', 'IG', 'LI'].map(s => <span key={s} style={{ cursor: 'pointer' }}>{s}</span>)}
                </div>
            </div>

            <div>
                <h4 className="pc-caps" style={{ color: 'var(--pc-beige)', marginBottom: '2.5rem', opacity: 0.8 }}>Collections</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <a href="#" className="pc-footer-link">Manorial Estates</a>
                    <a href="#" className="pc-footer-link">Historic Chateaus</a>
                    <a href="#" className="pc-footer-link">Urban Heritage</a>
                    <a href="#" className="pc-footer-link">Legacy Registry</a>
                </div>
            </div>

            <div>
                <h4 className="pc-caps" style={{ color: 'var(--pc-beige)', marginBottom: '2.5rem', opacity: 0.8 }}>Heritage Spotlight</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', borderRadius: '50%' }}>
                        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=crop&h=80&w=80" alt="Agent" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) brightness(1.2)' }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--pc-beige)', marginBottom: '0.25rem' }}>Julian St. Claire</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7, lineHeight: 1.4 }}>Heritage Specialist // <br/> Institutional Lead</div>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="pc-caps" style={{ color: 'var(--pc-beige)', marginBottom: '2.5rem', opacity: 0.85 }}>Registry Updates</h4>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '2rem', lineHeight: 1.6 }}>Subscribe to our global heritage distribution protocol.</p>
                <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }} className="pc-footer-subscribe">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        style={{ 
                            padding: '1.25rem', 
                            background: 'transparent', 
                            border: 'none', 
                            color: 'var(--pc-bone)',
                            width: '100%',
                            outline: 'none',
                            fontFamily: 'var(--pc-font-body)',
                            fontSize: '0.85rem'
                        }} 
                    />
                    <button style={{ padding: '1.25rem 2rem', background: 'var(--pc-beige)', color: 'var(--pc-teal)', border: 'none', fontWeight: 900, fontSize: '0.7rem', letterSpacing: '2px', cursor: 'pointer' }}>JOIN</button>
                </div>
            </div>
        </div>

        <div style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '2.5rem', justifyContent: 'center', alignItems: 'center', textAlign: 'center', fontSize: '0.65rem', opacity: 0.6, fontWeight: 800, letterSpacing: '3px' }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @media (min-width: 992px) {
                    .pc-footer-bottom { flex-direction: row !important; justify-content: space-between !important; text-align: left !important; }
                }
            ` }} />
            <div className="pc-footer-bottom" style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '2.5rem', alignItems: 'center' }}>
                <span>© 2026 ESTATE & HERITAGE // GLOBAL REGISTRY</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                    <style dangerouslySetInnerHTML={{ __html: `
                        @media (min-width: 600px) {
                            .pc-footer-links { flex-direction: row !important; gap: 4rem !important; }
                        }
                    ` }} />
                    <div className="pc-footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                        <span style={{ cursor: 'pointer' }}>PRIVACY</span>
                        <span style={{ cursor: 'pointer' }}>TERMS</span>
                        <span style={{ cursor: 'pointer' }}>PROVENANCE</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);
