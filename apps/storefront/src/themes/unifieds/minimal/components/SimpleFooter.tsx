
import React from 'react';

export const SimpleFooter = () => (
    <footer className="simple-footer">
        <div>
            <h2 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '2rem' }}>SELLIO_MINIMAL.</h2>
            <p style={{ maxWidth: '300px', fontSize: '0.85rem', opacity: 0.6 }}>
                Objective distribution for the modern world. No depth. No distraction. Just utility.
            </p>
        </div>
        <div>
            <h4>INDEX</h4>
            <a href="#" className="simple-footer-link">Objects</a>
            <a href="#" className="simple-footer-link">Furniture</a>
            <a href="#" className="simple-footer-link">Apparel</a>
            <a href="#" className="simple-footer-link">Archive</a>
        </div>
        <div>
            <h4>PROTOCOL</h4>
            <a href="#" className="simple-footer-link">Shipping</a>
            <a href="#" className="simple-footer-link">Returns</a>
            <a href="#" className="simple-footer-link">Privacy</a>
            <a href="#" className="simple-footer-link">Legal</a>
        </div>
    </footer>
);
