
import React from 'react';

interface CategoryBentoCardProps {
    title: string;
    count: string;
    icon: React.ReactNode;
    color?: string;
}

export const CategoryBentoCard = ({ title, count, icon, color = '#1e3a8a' }: CategoryBentoCardProps) => (
    <div className="mega-category-card">
        <div className="mega-card-icon" style={{ color: color }}>
            {icon}
        </div>
        <div>
            <h3 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{title}</h3>
            <span className="mega-card-count">{count} ACTIVE_ADS</span>
        </div>
    </div>
);
