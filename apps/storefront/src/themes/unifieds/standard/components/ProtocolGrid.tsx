
import React from 'react';

interface ProtocolCardProps {
    tag: string;
    title: string;
    description: string;
}

const ProtocolCard = ({ tag, title, description }: ProtocolCardProps) => (
    <div className="protocol-card">
        <span className="protocol-tag">{tag}</span>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{title}</h3>
        <p style={{ color: 'var(--scale-gray)', fontSize: '0.9rem', lineHeight: 1.7 }}>{description}</p>
    </div>
);

export const ProtocolGrid = () => {
    const protocols = [
        { tag: "DATA_LAYER", title: "Standardized Mapping", description: "Universal schema translation across all 50 vertical storefronts." },
        { tag: "SYNC_ENGINE", title: "Atomic Distribution", description: "Real-time asset synchronization with institutional-grade redundancy." },
        { tag: "UI_PROTOCOL", title: "Geometric Precision", description: "High-fidelity modular components optimized for multi-vertical scale." },
        { tag: "NODE_LOGIC", title: "Isolated Resilience", description: "Sovereign architectural silos ensuring zero-dependency performance." },
        { tag: "AUTH_LAYER", title: "Institutional Security", description: "AES-256 encrypted distribution nodes for verified asset handling." },
        { tag: "CORE_API", title: "Unified Endpoint", description: "A single, robust entry point for global high-fidelity commerce." },
    ];

    return (
        <section className="protocol-grid">
            {protocols.map((p, i) => <ProtocolCard key={i} {...p} />)}
        </section>
    );
};
