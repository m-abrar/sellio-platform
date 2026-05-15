
import React from 'react';

export const ServicesHeader = () => (
    <header className="srv-header">
        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e4d4e' }}>STYLE_TIME_SERVICES</div>
        <nav style={{ display: 'flex', gap: '2.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
            <a href="#">HIRE_EXPERTS</a>
            <a href="#">FIND_WORK</a>
            <a href="#">ENTERPRISE</a>
        </nav>
        <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none', background: 'transparent', fontWeight: 700 }}>LOG_IN</button>
            <button style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none', background: '#1e4d4e', color: 'white', fontWeight: 700 }}>JOIN_NOW</button>
        </div>
    </header>
);

export const ExpertCard = ({ name, category, rating, jobs, image }: any) => (
    <div className="srv-expert-card">
        <div className="srv-expert-image">
            <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="srv-expert-info">
            <div className="srv-rating">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                {rating} ({jobs} jobs)
            </div>
            <h3 className="srv-expert-name">{name}</h3>
            <span className="srv-expert-category">{category}</span>
            <a href="#" className="srv-btn-quote">REQUEST_QUOTATION</a>
        </div>
    </div>
);
