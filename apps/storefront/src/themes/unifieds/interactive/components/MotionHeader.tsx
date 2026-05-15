
import React from 'react';

export const MotionHeader = () => (
    <header className="motion-header">
        <div className="motion-logo">MOTION<span>_</span>NODE</div>
        <nav className="motion-nav">
            <a href="#" className="motion-nav-link">KINETICS</a>
            <a href="#" className="motion-nav-link">FLUIDS</a>
            <a href="#" className="motion-nav-link">DYNAMICS</a>
            <a href="#" className="motion-nav-link">SYMBOLS</a>
        </nav>
        <button className="motion-btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '0.8rem' }}>INITIALIZE</button>
    </header>
);
