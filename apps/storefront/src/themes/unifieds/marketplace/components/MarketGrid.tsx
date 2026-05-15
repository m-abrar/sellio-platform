
import React from 'react';

interface MarketItemProps {
    title: string;
    volume: string;
    nodes: string;
    icon: string;
}

const MarketItem = ({ title, volume, nodes, icon }: MarketItemProps) => (
    <div className="market-card-premium">
        <div style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{icon}</div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--trade-border)' }}>
            <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>VOL_24H</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--trade-green)' }}>{volume}</div>
            </div>
            <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px' }}>NODES</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{nodes}</div>
            </div>
        </div>
    </div>
);

export const MarketGrid = () => {
    const items = [
        { title: "Digital Assets", volume: "$4.2M", nodes: "840", icon: "💎" },
        { title: "Physical Goods", volume: "$12.8M", nodes: "2.4k", icon: "📦" },
        { title: "Service Nodes", volume: "$1.4M", nodes: "150", icon: "🛠️" },
        { title: "Industrial Grid", volume: "$24.5M", nodes: "12k", icon: "🏗️" },
    ];

    return (
        <section className="market-grid-section">
            <div style={{ marginBottom: '6rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--trade-green)', letterSpacing: '6px' }}>LIQUID_MARKET_V1</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', fontWeight: 900, marginTop: '1.5rem', letterSpacing: '-2px' }}>Global Exchange.</h2>
            </div>
            <div className="market-grid">
                {items.map((item, i) => <MarketItem key={i} {...item} />)}
            </div>
        </section>
    );
};
