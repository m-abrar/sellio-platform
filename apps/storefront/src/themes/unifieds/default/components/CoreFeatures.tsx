
import React from 'react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
    <div className="feature-card-premium">
        <span className="feature-icon">{icon}</span>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{title}</h3>
        <p style={{ color: 'var(--core-slate)', lineHeight: 1.8 }}>{description}</p>
    </div>
);

export const CoreFeatures = () => {
    const features = [
        { title: "Institutional Infrastructure", description: "Scale your distribution across 50 verticals with surgical precision and global redundancy.", icon: "🏛️" },
        { title: "High-Fidelity Logic", description: "Standardize your presence with high-fidelity components designed for enterprise performance.", icon: "⚙️" },
        { title: "Global Distribution", description: "Sync your inventory across multiple nodes with real-time latency optimization.", icon: "🌐" },
    ];

    return (
        <section className="core-features">
            <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--core-azure)', letterSpacing: '4px' }}>PLATFORM_CORE</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 800, marginTop: '1.5rem' }}>Built for Scale.</h2>
            </div>
            <div className="feature-grid">
                {features.map((f, i) => <FeatureCard key={i} {...f} />)}
            </div>
        </section>
    );
};
