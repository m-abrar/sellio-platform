
import React from 'react';

interface JobRoleCardProps {
    title: string;
    department: string;
    location: string;
    type: string;
}

export const JobRoleCard = ({ title, department, location, type }: JobRoleCardProps) => (
    <div className="role-card">
        <div>
            <h3 className="role-title">{title}</h3>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>
                <span>{type.toUpperCase()}</span>
                <span>•</span>
                <span style={{ color: 'var(--corp-blue)' }}>ID: {Math.floor(Math.random() * 9000) + 1000}</span>
            </div>
        </div>
        <div className="role-dept">{department}</div>
        <div className="role-location">📍 {location}</div>
        <button style={{ 
            background: 'none', 
            border: '1px solid #ddd', 
            padding: '0.75rem 2rem', 
            fontSize: '0.75rem', 
            fontWeight: 700,
            transition: 'all 0.2s ease'
        }}>
            APPLY_NOW
        </button>
    </div>
);
