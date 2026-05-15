
import React from 'react';

interface StructureItemProps {
    title: string;
    units: string;
    area: string;
    icon: string;
}

const StructureItem = ({ title, units, area, icon }: StructureItemProps) => (
    <div className="structure-card-premium">
        <div style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{icon}</div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--urban-border)' }}>
            <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--urban-concrete)', letterSpacing: '2px' }}>AVAILABLE_UNITS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--urban-skyline)' }}>{units}</div>
            </div>
            <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--urban-concrete)', letterSpacing: '2px' }}>TOTAL_AREA</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{area}</div>
            </div>
        </div>
    </div>
);

export const StructureGrid = () => {
    const items = [
        { title: "Skyline Lofts", units: "42", area: "12,400m²", icon: "🏙️" },
        { title: "Urban Hubs", units: "12", area: "45,000m²", icon: "🏢" },
        { title: "Concrete Studios", units: "84", area: "8,200m²", icon: "🏗️" },
    ];

    return (
        <section className="structure-grid-section">
            <div style={{ marginBottom: '6rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--urban-skyline)', letterSpacing: '6px' }}>STRUCTURAL_SCHEMA_V4</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', fontWeight: 900, marginTop: '1.5rem', letterSpacing: '-2px' }}>Urban Assets.</h2>
            </div>
            <div className="structure-grid">
                {items.map((item, i) => <StructureItem key={i} {...item} />)}
            </div>
        </section>
    );
};
