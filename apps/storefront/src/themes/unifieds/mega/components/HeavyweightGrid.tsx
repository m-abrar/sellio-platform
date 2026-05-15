
import React from 'react';

interface MegaItemProps {
    title: string;
    value: string;
    label: string;
}

const MegaItem = ({ title, value, label }: MegaItemProps) => (
    <div className="mega-grid-item">
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--mega-orange)', letterSpacing: '3px', marginBottom: '1.5rem' }}>{title}</div>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', lineHeight: 1, marginBottom: '0.5rem' }}>{value}</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 700 }}>{label}</div>
    </div>
);

export const HeavyweightGrid = () => {
    const items = [
        { title: "GLOBAL_THROUGHPUT", value: "840TB", label: "Monthly Data Sync" },
        { title: "NODAL_CAPACITY", value: "12k+", label: "Active Distribution Nodes" },
        { title: "REGISTRY_VOLUME", value: "1.4M", label: "Verified Assets" },
        { title: "SYSTEM_UPTIME", value: "99.9", label: "Core Reliability" },
    ];

    return (
        <section className="heavyweight-grid">
            <div style={{ marginBottom: '8rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--mega-orange)', letterSpacing: '5px' }}>HEAVYWEIGHT_LOGIC</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: 900, marginTop: '2rem', letterSpacing: '-3px' }}>Unrivaled <br/>Capacity.</h2>
            </div>
            <div className="mega-grid">
                {items.map((item, i) => <MegaItem key={i} {...item} />)}
            </div>
        </section>
    );
};
