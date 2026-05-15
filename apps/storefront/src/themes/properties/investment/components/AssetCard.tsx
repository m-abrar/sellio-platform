
import React from 'react';

interface AssetCardProps {
    title: string;
    yield: string;
    price: string;
    type: string;
    status: string;
}

export const AssetCard = ({ title, yield: yieldVal, price, type, status }: AssetCardProps) => (
    <div className="asset-card">
        <span className="asset-yield">↑ {yieldVal}</span>
        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '2px', marginBottom: '0.5rem' }}>{type.toUpperCase()}</div>
        <h3 className="asset-title">{title}</h3>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '2rem' }}>{price}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#22c55e' }}>{status}</span>
            <button style={{ background: 'none', border: '1px solid #ddd', padding: '0.5rem 1rem', fontSize: '0.7rem', fontWeight: 700 }}>ANALYZE</button>
        </div>
    </div>
);
