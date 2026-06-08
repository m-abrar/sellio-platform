
import React from 'react';

export const MusicFooter = () => (
    <footer className="music-footer">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', textAlign: 'left' }}>
            <div>
                <div className="music-logo" style={{ marginBottom: '2rem' }}>SELLIO_SOUND</div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>
                    Defining the next era of live music experiences. Every beat, every lightsaber, every soul-shaking moment.
                </p>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', fontSize: '0.9rem', color: '#ff3e00' }}>LINEUP</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    <span>Main Stage</span>
                    <span>Electric Field</span>
                    <span>The Bunker</span>
                    <span>Chill Zone</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', fontSize: '0.9rem', color: '#ff3e00' }}>INFO</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    <span>FAQ</span>
                    <span>Safety</span>
                    <span>Careers</span>
                    <span>Press</span>
                </div>
            </div>
            <div>
                <h4 style={{ fontWeight: 900, marginBottom: '1.5rem', fontSize: '0.9rem', color: '#ff3e00' }}>SOCIAL</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    <span>Instagram</span>
                    <span>TikTok</span>
                    <span>SoundCloud</span>
                    <span>Spotify</span>
                </div>
            </div>
        </div>
        <div style={{ marginTop: '8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', opacity: 0.3 }}>
            <span>© 2026 SELLIO_SOUND_FESTIVAL. ALL RIGHTS RESERVED.</span>
            <span>POWERED_BY_STYLETIME_ENGINE</span>
        </div>
    </footer>
);
