
import React from 'react';

interface AssetCardProps {
    title: string;
    type: string;
    area: string;
    status: string;
    id: string;
}

export const AssetCard = ({ title, type, area, status, id }: AssetCardProps) => (
    <div className="asset-card">
        <span className="asset-tag">{type}</span>
        <h3 className="asset-title">{title}</h3>
        <div className="asset-specs">
            <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.5, letterSpacing: '1px' }}>FLOOR_AREA</span>
                <span className="asset-spec-val">{area}</span>
            </div>
            <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.5, letterSpacing: '1px' }}>STATUS</span>
                <span className="asset-spec-val" style={{ color: status === 'AVAILABLE' ? '#10b981' : '#64748b' }}>{status}</span>
            </div>
        </div>
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.4 }}>ASSET_REF: {id}</span>
            <button style={{ background: 'none', border: '1px solid #ddd', padding: '0.5rem 1rem', fontSize: '0.7rem', fontWeight: 700 }}>VIEW_DETAILS</button>
        </div>
    </div>
);
