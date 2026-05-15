
import React from 'react';
import { VehicleCard } from './components';

export default function Page() {
  const vehicles = [
    { year: "2022", make: "BMW", model: "X5 xDrive40i", price: "$58,400", mileage: "24,500 mi", transmission: "Automatic", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070" },
    { year: "2021", make: "Audi", model: "A6 Premium Plus", price: "$42,900", mileage: "31,200 mi", transmission: "Automatic", image: "https://images.unsplash.com/photo-1606152424101-ad2f8a45340c?q=80&w=2070" },
    { year: "2023", make: "Tesla", model: "Model 3 Long Range", price: "$39,500", mileage: "12,100 mi", transmission: "Direct Drive", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071" },
    { year: "2020", make: "Lexus", model: "RX 350 Luxury", price: "$36,800", mileage: "45,000 mi", transmission: "Automatic", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070" },
    { year: "2022", make: "Mercedes-Benz", model: "GLC 300", price: "$47,200", mileage: "18,900 mi", transmission: "Automatic", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070" },
    { year: "2021", make: "Porsche", model: "Macan S", price: "$64,500", mileage: "22,400 mi", transmission: "PDK", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" },
    { year: "2023", make: "Land Rover", model: "Defender 110", price: "$72,900", mileage: "8,500 mi", transmission: "Automatic", image: "https://images.unsplash.com/photo-1625235338069-44971230011d?q=80&w=2070" },
    { year: "2019", make: "Jaguar", model: "F-Type R-Dynamic", price: "$49,800", mileage: "38,200 mi", transmission: "Automatic", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="used-hero">
          <div className="used-hero-content">
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--auto-accent)', letterSpacing: '2px', display: 'block', marginBottom: '1.5rem' }}>CERTIFIED_SELECT_2026</span>
              <h1>Transparency in <br/>Every Mile.</h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--auto-secondary)', lineHeight: 1.6, marginBottom: '3rem' }}>
                  Explore a curated selection of pre-owned vehicles verified by our 150-point inspection protocol. No hidden history, just high-fidelity performance.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button style={{ padding: '1.25rem 3rem', background: 'var(--auto-primary)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 700 }}>EXPLORE_INVENTORY</button>
                  <button style={{ padding: '1.25rem 3rem', background: 'none', color: 'var(--auto-primary)', border: '1px solid var(--auto-primary)', borderRadius: '4px', fontWeight: 700 }}>VALUATE_MY_TRADE</button>
              </div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1542362567-b0520002cf71?q=80&w=2070" alt="Certified Vehicle" style={{ width: '100%', borderRadius: '8px', boxShadow: '40px 40px 80px rgba(0,0,0,0.05)' }} />
          </div>
      </section>

      {/* Trust Grid */}
      <section style={{ padding: '4rem 5%', background: '#fff', borderBottom: '1px solid var(--auto-border)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem' }}>
          <div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛡️</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Certified Warranty</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>12-month / 12k mile protection.</div>
          </div>
          <div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Full History</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Complete CARFAX reports available.</div>
          </div>
          <div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚚</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Global Delivery</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Direct to your node within 72h.</div>
          </div>
          <div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💵</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Instant Funding</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Pre-approval in under 60 seconds.</div>
          </div>
      </section>

      {/* Inventory Grid */}
      <section style={{ background: '#f8fafc' }}>
          <div className="vehicle-grid">
              {vehicles.map((v, i) => (
                  <VehicleCard key={i} {...v} />
              ))}
          </div>
      </section>

      {/* Valuation CTA */}
      <section style={{ padding: '12rem 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2.5rem' }}>Market-Leading Trade Values.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--auto-secondary)', marginBottom: '4rem' }}>
                  Our AI-driven valuation engine provides the most accurate market price for your current vehicle in seconds.
              </p>
              <button style={{ padding: '1.5rem 4rem', background: 'var(--auto-accent)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 900, fontSize: '0.9rem' }}>
                  GET_INSTANT_OFFER
              </button>
          </div>
      </section>
    </div>
  );
}
