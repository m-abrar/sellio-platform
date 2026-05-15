import React from 'react';
import { InventoryCard, FilterSidebar } from './components';

export default function ClassicDealerPage() {
  const inventory = [
    { name: "2024 Porsche 911 Carrera", price: "$124,900", km: "1,200", transmission: "AUTO", fuel: "PETROL", year: 2024, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070", isCertified: true },
    { name: "2023 BMW M4 Competition", price: "$89,500", km: "12,400", transmission: "AUTO", fuel: "PETROL", year: 2023, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070", isCertified: true },
    { name: "2022 Audi RS6 Avant", price: "$105,000", km: "24,000", transmission: "AUTO", fuel: "PETROL", year: 2022, image: "https://images.unsplash.com/photo-1614162692292-7ac56d7fd761?q=80&w=2070" },
    { name: "2021 Mercedes-AMG G63", price: "$165,000", km: "35,000", transmission: "AUTO", fuel: "PETROL", year: 2021, image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=2070", isCertified: true },
    { name: "2023 Range Rover Sport", price: "$98,000", km: "8,500", transmission: "AUTO", fuel: "DIESEL", year: 2023, image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071" },
    { name: "2022 Tesla Model S Plaid", price: "$82,000", km: "18,000", transmission: "AUTO", fuel: "ELECTRIC", year: 2022, image: "https://images.unsplash.com/photo-1617788131775-ceb2027fd12c?q=80&w=2070" },
  ];

  return (
    <div>
      <section style={{ padding: '4rem', background: 'var(--color-charcoal)', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>PREMIUM_INVENTORY</h1>
        <p style={{ opacity: 0.5, letterSpacing: '2px' }}>64 VEHICLES CURRENTLY IN STOCK // UPDATED 2M AGO</p>
      </section>

      <div className="inventory-layout">
        <FilterSidebar />
        
        <div className="main-inventory-content">
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800 }}>SHOWING {inventory.length} VEHICLES</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select style={{ padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.8rem', fontWeight: 700 }}>
                <option>SORT: PRICE (LOW-HIGH)</option>
              </select>
            </div>
          </div>
          
          <div className="car-grid-classic">
            {inventory.map((car, i) => (
              <InventoryCard key={i} {...car} />
            ))}
          </div>

          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <button style={{ 
              border: '2px solid var(--color-red)', 
              background: 'transparent', 
              color: 'var(--color-red)', 
              padding: '1rem 3rem', 
              fontWeight: 800,
              cursor: 'pointer'
            }}>
              LOAD_MORE_VEHICLES
            </button>
          </div>
        </div>
      </div>

      <section style={{ padding: '6rem 4rem', background: 'white', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem' }}>
          <div>
            <h3 style={{ fontWeight: 900, marginBottom: '1rem' }}>WE_BUY_CARS</h3>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Get an instant valuation and trade-in your current vehicle for a premium upgrade today.</p>
          </div>
          <div>
            <h3 style={{ fontWeight: 900, marginBottom: '1rem' }}>FINANCE_SOLUTIONS</h3>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Flexible financing options starting from 2.9% APR for qualified buyers.</p>
          </div>
          <div>
            <h3 style={{ fontWeight: 900, marginBottom: '1rem' }}>WORLDWIDE_SHIPPING</h3>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Secure, enclosed transport available for our global collectors and buyers.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
