
import React from 'react';

interface MinimalItemProps {
    title: string;
    description: string;
}

const MinimalItem = ({ title, description }: MinimalItemProps) => (
    <div className="minimal-card">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '2rem' }}>{title}</h3>
        <p style={{ color: '#888', lineHeight: 2, fontSize: '0.85rem', fontWeight: 300 }}>{description}</p>
    </div>
);

export const MinimalGrid = () => {
    const items = [
        { title: "Reductionist Logic", description: "A high-fidelity distribution node stripped of all non-essential telemetry." },
        { title: "Zero Latency", description: "Synchronizing global commerce through invisible architectural transitions." },
        { title: "Pure Presence", description: "Establishing structural authority through minimalist geometric precision." },
    ];

    return (
        <section className="minimal-grid">
            {items.map((item, i) => <MinimalItem key={i} {...item} />)}
        </section>
    );
};
