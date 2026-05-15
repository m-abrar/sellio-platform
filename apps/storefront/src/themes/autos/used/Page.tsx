'use client';
import React from 'react';
import { CertifiedVehicleCard, TrustHUD } from './components';

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
    <div className="au-section">
      {/* Professional Trust Hero */}
      <section className="au-hero">
        <div>
          <div className="au-mono" style={{ marginBottom: '2.5rem' }}>CERTIFIED_SELECT_PROTOCOL_V8</div>
          <h1 className="au-heading-xl">
            Transparency <br/>
            in Every <br/>
            <span style={{ color: 'var(--au-indigo)' }}>Mile.</span>
          </h1>
          <p style={{ marginTop: '5rem', fontSize: '1.25rem', color: 'var(--au-text-muted)', lineHeight: 1.8, maxWidth: '600px' }}>
            Explore a curated selection of pre-owned vehicles verified by our 150-point inspection protocol. No hidden history, just high-fidelity performance.
          </p>
          <div style={{ marginTop: '6rem', display: 'flex', gap: '3rem' }}>
            <button className="au-btn-primary">Explore Inventory</button>
            <button style={{ background: 'transparent', border: '2px solid var(--au-slate)', color: 'var(--au-slate)', padding: '1.25rem 3.5rem', borderRadius: '8px', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>Valuate_Trade</button>
          </div>
        </div>
        <div className="au-hero-img-wrapper">
          <img src="https://images.unsplash.com/photo-1542362567-b0520002cf71?q=80&w=2070" alt="Certified Vehicle" className="au-hero-img" />
          
          <div style={{ position: 'absolute', bottom: '3rem', right: '3rem', background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid var(--au-border)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>🛡️</div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '0.9rem' }}>150-Point Inspection</div>
                    <div className="au-mono" style={{ fontSize: '0.6rem' }}>VERIFIED_BY_SELLIO_NODE</div>
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* Trust Grid Section */}
      <section style={{ padding: '8rem 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6rem', borderTop: '1px solid var(--au-border)', marginTop: '10rem' }}>
          <TrustHUD icon="🛡️" label="Certified Warranty" sub="12-month / 12k mile protection on every unit." />
          <TrustHUD icon="📋" label="Full History" sub="Complete digital provenance records via CARFAX." />
          <TrustHUD icon="🚚" label="Global Delivery" sub="Direct to your node within 72 hours of verification." />
          <TrustHUD icon="💵" label="Instant Funding" sub="Pre-approval nodes active for all regional clusters." />
      </section>

      {/* Inventory Registry Section */}
      <section style={{ marginTop: '15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="au-mono" style={{ marginBottom: '1.5rem' }}>SELECT_INVENTORY_REGISTRY</div>
                  <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-2px', textTransform: 'uppercase' }}>Certified <br/>Inventory.</h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'var(--au-text-muted)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes verification metadata across our global pre-owned distribution nodes.
              </div>
          </div>
          
          <div className="au-vehicle-grid">
            {vehicles.map((v, i) => (
              <CertifiedVehicleCard key={i} {...v} />
            ))}
          </div>
      </section>

      {/* Valuation CTA */}
      <section style={{ marginTop: '15rem', padding: '12rem 8%', background: 'var(--au-surface)', border: '1px solid var(--au-border)', borderRadius: '24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', marginBottom: '4rem', lineHeight: 1.1 }}>
                  Market-Leading <br/>
                  <span style={{ color: 'var(--au-indigo)' }}>Trade Values.</span>
              </h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--au-text-muted)', lineHeight: 2 }}>
                  Our AI-driven valuation engine provides the most accurate market price for your current vehicle in seconds, synchronized with real-time auction nodes.
              </p>
          </div>
          <div style={{ padding: '6rem', background: 'white', borderRadius: '24px', border: '1px solid var(--au-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
              <div className="au-mono" style={{ marginBottom: '2.5rem' }}>GET_INSTANT_OFFER</div>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2.5rem' }}>Value Your Asset.</h3>
              <p style={{ color: 'var(--au-text-muted)', lineHeight: 2, marginBottom: '4rem' }}>
                  Secure a competitive buy-back offer for your current vehicle from the Sellio Select Network.
              </p>
              <button className="au-btn-primary" style={{ width: '100%', padding: '2rem', fontSize: '1.1rem' }}>
                  START_APPRAISAL
              </button>
          </div>
      </section>
      
      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
