
import React from 'react';

interface OpportunityCardProps {
    title: string;
    company: string;
    equity: string;
    stage: string;
    location: string;
}

const OpportunityCard = ({ title, company, equity, stage, location }: OpportunityCardProps) => (
    <div className="opportunity-card growth-panel">
        <span className="opp-badge">{stage.toUpperCase()}</span>
        <h3 className="opp-title">{title}</h3>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--growth-neon)', marginBottom: '0.5rem' }}>{company}</div>
        <div style={{ color: 'var(--growth-dim)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>📍 {location}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--growth-border)' }}>
            <div>
                <div style={{ fontSize: '0.6rem', color: 'var(--growth-dim)', fontWeight: 800 }}>EQUITY_SHARE</div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>{equity}</div>
            </div>
            <button style={{ background: 'none', border: '1px solid var(--growth-neon)', color: 'var(--growth-neon)', padding: '0.5rem 1.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>JOIN</button>
        </div>
    </div>
);

export const OpportunityGrid = () => {
    const opportunities = [
        { title: "Founding Engineer (Rust)", company: "Nexus.AI", equity: "1.5% - 2.5%", stage: "Series A", location: "San Francisco / Remote" },
        { title: "Head of Protocol Growth", company: "Aether Labs", equity: "1.0% - 2.0%", stage: "Seed+", location: "Berlin / Hybrid" },
        { title: "Senior Solidity Architect", company: "Void Capital", equity: "2.0% - 3.5%", stage: "Series B", location: "Singapore / Remote" },
        { title: "Lead Product Designer", company: "Orbital Systems", equity: "0.5% - 1.2%", stage: "Series A", location: "Austin / On-site" },
        { title: "DevOps / Infrastructure", company: "Cyber Node", equity: "0.8% - 1.5%", stage: "Seed", location: "London / Remote" },
        { title: "Growth Marketing Lead", company: "Scale Protocol", equity: "1.2% - 2.2%", stage: "Series A", location: "New York / Hybrid" },
    ];

    return (
        <section className="opportunity-grid">
            {opportunities.map((o, i) => <OpportunityCard key={i} {...o} />)}
        </section>
    );
};
