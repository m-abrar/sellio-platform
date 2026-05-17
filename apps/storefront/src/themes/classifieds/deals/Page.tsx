'use client';
import React from 'react';
import { DealsHeader, DealCard, DealsFooter } from './components';

export default function Page() {
  const flashDeals = [
    { title: "Sony WH-1000XM4 Noise Canceling Headphones", currentPrice: "$199.00", originalPrice: "$349.99", discount: "43", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=400", seller: "TechOutlet", isTopSeller: true },
    { title: "Dyson V11 Cordless Vacuum (Refurbished)", currentPrice: "$299.00", originalPrice: "$599.00", discount: "50", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=400", seller: "HomeGoods99", isTopSeller: false },
    { title: "Apple Watch Series 8 (GPS, 41mm)", currentPrice: "$249.00", originalPrice: "$399.00", discount: "37", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=400", seller: "GadgetPro", isTopSeller: true },
    { title: "Vitamix 5200 Professional-Grade Blender", currentPrice: "$349.00", originalPrice: "$499.00", discount: "30", image: "https://images.unsplash.com/photo-1585237887309-84725ba5cbf1?q=80&w=400", seller: "KitchenKing", isTopSeller: true },
  ];

  const recentListings = [
    { title: "Herman Miller Aeron Chair - Size B", currentPrice: "$450.00", originalPrice: "$1,200.00", discount: "62", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=400", seller: "OfficeClearance", isTopSeller: false },
    { title: "Nintendo Switch OLED Model", currentPrice: "$280.00", originalPrice: "$349.99", discount: "20", image: "https://images.unsplash.com/photo-1612282131557-41a4a4086438?q=80&w=400", seller: "GamerDude88", isTopSeller: false },
    { title: "Breville Barista Express Espresso Machine", currentPrice: "$500.00", originalPrice: "$750.00", discount: "33", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=400", seller: "CoffeeLover", isTopSeller: true },
    { title: "Samsonite Winfield 2 Hardside Luggage", currentPrice: "$85.00", originalPrice: "$199.00", discount: "57", image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceeee?q=80&w=400", seller: "TravelBug", isTopSeller: false },
    { title: "Logitech MX Master 3S Wireless Mouse", currentPrice: "$70.00", originalPrice: "$99.99", discount: "30", image: "https://images.unsplash.com/photo-1615663245857-ac93bb022f46?q=80&w=400", seller: "TechOutlet", isTopSeller: true },
    { title: "YETI Tundra 45 Cooler", currentPrice: "$225.00", originalPrice: "$325.00", discount: "30", image: "https://images.unsplash.com/photo-1613962635952-4c2293bd3540?q=80&w=400", seller: "OutdoorGear", isTopSeller: true },
  ];

  return (
    <div className="classifieds-deals-wrapper">
      <DealsHeader />

      {/* Hero */}
      <section className="cd-hero">
        <div className="cd-hero-content">
            <div className="cd-flash-badge">
                <span>⚡</span> SUPER DEAL OF THE DAY
            </div>
            <h1 className="cd-hero-title">MacBook Pro M2 14"</h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--cd-primary-red)' }}>$1,299</span>
                <span style={{ fontSize: '1.5rem', textDecoration: 'line-through', color: 'rgba(0,0,0,0.5)' }}>$1,999</span>
            </div>
            <button className="cd-btn-post" style={{ padding: '1rem 3rem', fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(230, 57, 70, 0.3)' }}>Snag This Deal</button>
        </div>
        <div className="d-none d-lg-block" style={{ width: '45%' }}>
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800" alt="MacBook" style={{ width: '100%', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))' }} />
        </div>
      </section>

      {/* Flash Sales */}
      <section className="cd-section">
          <div className="cd-section-header">
              <h2 className="cd-section-title">
                  <span style={{ color: 'var(--cd-primary-red)' }}>⚡</span> Flash Sales
              </h2>
              <div className="cd-timer">
                  ENDS IN: 04:12:39
              </div>
          </div>
          <div className="cd-grid">
              {flashDeals.map((deal, i) => (
                  <DealCard key={i} {...deal} />
              ))}
          </div>
      </section>

      {/* Promo Banner */}
      <section style={{ margin: '0 5% 4rem', backgroundColor: 'var(--cd-dark-bg)', borderRadius: '16px', padding: '3rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Clearance Event</h2>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>Thousands of items marked down for quick sale. Negotiate directly with sellers.</p>
          </div>
          <button style={{ backgroundColor: 'var(--cd-secondary-yellow)', color: 'var(--cd-dark-bg)', padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 800, border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Shop Clearance</button>
      </section>

      {/* Fresh Deals */}
      <section className="cd-section" style={{ paddingTop: 0 }}>
          <div className="cd-section-header">
              <h2 className="cd-section-title">Fresh Price Drops</h2>
              <a href="#" style={{ color: 'var(--cd-dark-bg)', fontWeight: 700, textDecoration: 'none' }}>View All →</a>
          </div>
          <div className="cd-grid">
              {recentListings.map((deal, i) => (
                  <DealCard key={i} {...deal} />
              ))}
          </div>
      </section>

      <DealsFooter />
    </div>
  );
}
