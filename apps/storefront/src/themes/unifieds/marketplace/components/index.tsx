'use client';
import React, { useState } from 'react';
import { MenuNav } from '@/components/menu/MenuNav';
import { MenuActionButtons } from '@/components/menu/MenuActionButtons';
import { FooterMenuColumn } from '@/components/menu/FooterMenuColumn';
import { defaultNavItemRenderer } from '@/components/menu/menu-renderers';

export const TradeHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="um-header">
      <div className="um-logo">
        TRADE<span style={{ color: 'var(--um-green)' }}>NODE</span>
      </div>
      
      <button 
          className={`um-hamburger ${isOpen ? 'um-hamburger-open' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation"
          id="um-hamburger-toggle"
      >
          <span className="um-hamburger-bar"></span>
          <span className="um-hamburger-bar"></span>
          <span className="um-hamburger-bar"></span>
      </button>

      <div className={`um-nav-panel ${isOpen ? 'um-nav-open' : ''}`}>
          <MenuNav
            location="main_header"
            flat
            className="um-nav"
            linkClassName="um-nav-link"
            onNavigate={() => setIsOpen(false)}
            renderItem={defaultNavItemRenderer}
          />
          <MenuActionButtons
            as="button"
            buttonClassName="um-btn-primary um-mobile-btn"
            onNavigate={() => setIsOpen(false)}
            renderItem={(item, { className, onNavigate }) => (
              <button type="button" className={className} style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }} onClick={onNavigate}>{item.title}</button>
            )}
          />
      </div>

      <MenuActionButtons
        as="button"
        buttonClassName="um-btn-primary um-desktop-btn"
        renderItem={(item, { className, onNavigate }) => (
          <button type="button" className={className} style={{ padding: '0.8rem 2rem', fontSize: '0.75rem', borderRadius: '8px' }} onClick={onNavigate} id="um-btn-header-access">{item.title}</button>
        )}
      />
    </header>
  );
};

interface MarketItemProps {
    title: string;
    volume: string;
    nodes: string;
    icon: string;
}

const MarketItem = ({ title, volume, nodes, icon }: MarketItemProps) => (
    <div className="um-market-card-premium" >
        <div style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{icon}</div>
        <h3 style={{ fontFamily: 'var(--um-font-heading)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#1e293b' }}>{title}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--um-border)' }} className="um-card-metrics">
            <div>
                <div className="um-mono" style={{ fontSize: '0.55rem', color: '#94a3b8' }}>VOL_24H</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--um-green)' }}>{volume}</div>
            </div>
            <div>
                <div className="um-mono" style={{ fontSize: '0.55rem', color: '#94a3b8' }}>NODES</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{nodes}</div>
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
        <section className="um-market-grid-section" id="um-exchange-section">
            <div style={{ marginBottom: '6rem' }}>
                <span className="um-mono" style={{ color: 'var(--um-green)' }}>LIQUID_MARKET_V1</span>
                <h2 style={{ fontFamily: 'var(--um-font-heading)', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900, marginTop: '1.5rem', color: 'var(--um-slate)' }}>Global Exchange.</h2>
            </div>
            <div className="um-market-grid">
                {items.map((item, i) => <MarketItem key={i} {...item} />)}
            </div>
        </section>
    );
};

export const LiquidSyncBar = () => (
    <div className="um-liquid-sync-bar">
        <span>★ TRANS_FLOW: SYNC_STABLE // 24/7 AUTOMATED EXCHANGE</span>
        <span className="um-bar-separator">//</span>
        <span>LATENCY TARGET: &lt;5ms TRANSACTIONAL PIPELINES</span>
        <span className="um-bar-separator">//</span>
        <span>SECURE HIGH VOLUME PROTOCOL</span>
    </div>
);

export const ExchangeFooter = () => (
    <footer className="um-exchange-footer">
        <div className="um-footer-grid">
            <div>
                <div className="um-logo" style={{ color: 'white', fontSize: '2rem', marginBottom: '3rem' }}>TRADENODE</div>
                <p style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}>
                    The advanced high-fidelity marketplace exchange node. Built for liquid trading and precise multi-vertical logistics.
                </p>
            </div>
            <FooterMenuColumn
                location="footer_column_1"
                renderTitle={(title) => <div className="um-mono" style={{ color: 'var(--um-green)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="um-footer-link-group"
                linkClassName="um-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_2"
                renderTitle={(title) => <div className="um-mono" style={{ color: 'var(--um-green)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="um-footer-link-group"
                linkClassName="um-footer-link"
            />
            <FooterMenuColumn
                location="footer_column_3"
                renderTitle={(title) => <div className="um-mono" style={{ color: 'var(--um-green)', marginBottom: '3rem' }}>{title}</div>}
                listClassName="um-footer-link-group"
                linkClassName="um-footer-link"
            />
        </div>
        <div className="um-footer-bottom">
            <div className="um-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 SELLIO_TRADE_OS // SECURE_SYNC_STABLE</div>
            <div className="um-footer-socials">
                <MenuNav
                    location="social_footer"
                    flat
                    linkClassName="um-mono"
                    renderItem={(item, { href, className, onNavigate }) => (
                        <span className={className} style={{ opacity: 0.4, fontSize: '0.65rem', cursor: 'pointer' }}>
                            <a href={href} onClick={onNavigate} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
                        </span>
                    )}
                />
            </div>
        </div>
    </footer>
);
