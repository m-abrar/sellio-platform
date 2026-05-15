
import React from 'react';

interface ServiceFeatureCardProps {
    title: string;
    description: string;
    icon: string;
}

export const ServiceFeatureCard = ({ title, description, icon }: ServiceFeatureCardProps) => (
    <div className="service-card">
        <div className="service-icon">{icon}</div>
        <h3 className="service-title">{title}</h3>
        <p className="service-desc">{description}</p>
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
            <a href="#" style={{ color: 'var(--corp-primary)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>LEARN_MORE →</a>
        </div>
    </div>
);
