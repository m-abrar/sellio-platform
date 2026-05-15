
import React from 'react';

interface TradeCardProps {
    title: string;
    company: string;
    pay: string;
    location: string;
    type: string;
}

export const TradeCard = ({ title, company, pay, location, type }: TradeCardProps) => (
    <div className="trade-card">
        <h3 className="trade-title">{title}</h3>
        <div className="trade-company">{company.toUpperCase()}</div>
        <div className="trade-meta">
            <span>💰 {pay}</span>
            <span>📍 {location}</span>
            <span>🛠️ {type}</span>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
            <button style={{ flex: 1, padding: '1.25rem', background: '#111827', color: 'white', border: 'none', fontWeight: 700, fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>APPLY_NOW</button>
            <button style={{ padding: '1.25rem', background: 'none', border: '2px solid #ddd', fontWeight: 700 }}>DETAILS</button>
        </div>
    </div>
);
