
import React from 'react';

interface GigCardProps {
    title: string;
    rate: string;
    duration: string;
    tags: string[];
}

export const GigCard = ({ title, rate, duration, tags }: GigCardProps) => (
    <div className="gig-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div className="gig-rate">{rate}</div>
            <div style={{ fontSize: '0.7rem', color: '#cbd5e0', fontFamily: 'var(--font-mono)' }}>ID_{Math.floor(Math.random()*10000)}</div>
        </div>
        <h3 className="gig-title">{title}</h3>
        <div className="gig-tags">
            {tags.map(t => <span key={t} className="gig-tag">{t}</span>)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
            <span style={{ fontSize: '0.8rem', color: '#718096' }}>⏱️ {duration}</span>
            <button style={{ 
                background: 'var(--flex-graphite)', 
                color: 'white', 
                border: 'none', 
                padding: '0.6rem 1.5rem', 
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 700
            }}>
                BID_NOW
            </button>
        </div>
    </div>
);
