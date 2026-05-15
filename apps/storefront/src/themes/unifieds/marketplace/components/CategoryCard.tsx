
import React from 'react';

interface CategoryCardProps {
    title: string;
    icon: string;
    count: string;
}

export const CategoryCard = ({ title, icon, count }: CategoryCardProps) => (
    <div className="cat-card">
        <span className="cat-icon">{icon}</span>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{title}</h3>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--market-purple)' }}>{count} ACTIVE_NODES</div>
    </div>
);
