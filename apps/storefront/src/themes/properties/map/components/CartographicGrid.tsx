
import React from 'react';

interface MapItemProps {
    title: string;
    coords: string;
    assets: string;
    icon: string;
}

const MapItem = ({ title, coords, assets, icon }: MapItemProps) => (
    <div className="map-card-premium">
        <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{icon}</div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
        <div style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '1px', marginBottom: '2rem' }}>{coords}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--map-border)' }}>
            <div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>ASSET_COUNT</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--map-teal)' }}>{assets}</div>
            </div>
            <button style={{ background: 'none', border: '1px solid var(--map-teal)', color: 'var(--map-teal)', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>VIEW</button>
        </div>
    </div>
);

export const CartographicGrid = () => {
    const items = [
        { title: "North Sector", coords: "40.7128° N, 74.0060° W", assets: "1,240", icon: "📍" },
        { title: "East Registry", coords: "35.6895° N, 139.6917° E", assets: "840", icon: "📍" },
        { title: "South Node", coords: "33.8688° S, 151.2093° E", assets: "2,150", icon: "📍" },
        { title: "West District", coords: "34.0522° N, 118.2437° W", assets: "1,400", icon: "📍" },
    ];

    return (
        <section className="cartographic-grid-section">
            <div style={{ marginBottom: '6rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--map-teal)', letterSpacing: '8px' }}>SPATIAL_REGISTRY_V4</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', fontWeight: 700, marginTop: '1.5rem', letterSpacing: '-2px' }}>Cartographic Assets.</h2>
            </div>
            <div className="cartographic-grid">
                {items.map((item, i) => <MapItem key={i} {...item} />)}
            </div>
        </section>
    );
};
