
import React from 'react';

interface HeritageCardProps {
    num: string;
    title: string;
    description: string;
}

const HeritageCard = ({ num, title, description }: HeritageCardProps) => (
    <div className="legacy-card">
        <span className="card-num">{num}</span>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: 'var(--legacy-burgundy)', marginBottom: '2rem' }}>{title}</h3>
        <p style={{ color: '#666', lineHeight: 2, fontSize: '1rem' }}>{description}</p>
    </div>
);

export const HeritageGrid = () => {
    const records = [
        { num: "01", title: "Institutional Legacy", description: "A high-fidelity foundation established through decades of multi-vertical distribution excellence." },
        { num: "02", title: "Verifiable Provenance", description: "Every asset in the legacy registry is verified for its historical integrity and functional legacy." },
        { num: "03", title: "Global Authority", description: "Synchronizing global commerce nodes through the world's most trusted structural protocol." },
    ];

    return (
        <section className="heritage-grid">
            <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--legacy-gold)', letterSpacing: '6px' }}>ESTABLISHED_1996</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4.5rem', fontWeight: 900, color: 'var(--legacy-burgundy)', marginTop: '2rem' }}>The Registry of <br/>Excellence.</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
                {records.map((r, i) => <HeritageCard key={i} {...r} />)}
            </div>
        </section>
    );
};
