
import React from 'react';

export const TradeHeader = () => (
    <header className="trade-header">
        <div className="trade-logo">TRADE<span>_</span>NODE</div>
        <nav className="trade-nav">
            <a href="#" className="trade-nav-link">EXCHANGE</a>
            <a href="#" className="trade-nav-link">LIQUIDITY</a>
            <a href="#" className="trade-nav-link">PEER_LOGIC</a>
            <a href="#" className="trade-nav-link">REGISTRY</a>
        </nav>
        <button className="trade-btn-primary" style={{ padding: '0.8rem 2.5rem', fontSize: '0.85rem' }}>OPEN_TRADE</button>
    </header>
);
