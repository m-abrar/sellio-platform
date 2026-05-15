'use client';
import React from 'react';
import { LeaseUnitCard, TrustMetrics } from './components';

export default function Page() {
  const rentals = [
    { title: "The North Tower Studio", price: "$1,850", type: "Studio", location: "Downtown Core", beds: "0", baths: "1", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070" },
    { title: "Riverside 2BR Apartment", price: "$2,400", type: "Apartment", location: "West End", beds: "2", baths: "2", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070" },
    { title: "Modern Industrial Loft", price: "$3,100", type: "Loft", location: "Arts District", beds: "1", baths: "1.5", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070" },
    { title: "Skyline Penthouse Unit", price: "$5,500", type: "Penthouse", location: "Financial Center", beds: "3", baths: "3", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" },
    { title: "Family Townhouse", price: "$3,800", type: "Townhouse", location: "Suburbs", beds: "4", baths: "3", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074" },
    { title: "Compact City Studio", price: "$1,400", type: "Studio", location: "South Side", beds: "0", baths: "1", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070" },
  ];

  return (
    <div className="pr-section">
      {/* Lease Hero */}
      <section className="pr-hero">
        <div>
          <div className="pr-mono" style={{ marginBottom: '2.5rem' }}>EASY_LEASING_PROTOCOL_V8</div>
          <h1 className="pr-heading-xl">
            Rent Your <br/>
            Next Home <br/>
            <span style={{ color: 'var(--pr-mint)' }}>with Ease.</span>
          </h1>
          <p style={{ marginTop: '4rem', fontSize: '1.25rem', color: 'var(--pr-text-muted)', lineHeight: 1.8, maxWidth: '500px' }}>
            A high-fidelity rental experience designed for the modern tenant. Verified properties, digital leases, and automated maintenance nodes.
          </p>
          <div style={{ marginTop: '5rem', display: 'flex', gap: '2.5rem' }}>
            <button className="pr-btn-primary">Find_a_Rental</button>
            <button style={{ 
                background: 'transparent', 
                border: '2px solid var(--pr-slate)', 
                color: 'var(--pr-slate)', 
                padding: '1.25rem 3.5rem', 
                borderRadius: '100px', 
                fontWeight: 800, 
                cursor: 'pointer' 
            }}>
                List_Unit
            </button>
          </div>
        </div>
        <div className="pr-hero-image-wrapper">
          <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070" alt="Modern Living" className="pr-hero-image" />
          
          <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid var(--pr-border)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
                  <div className="pr-mono" style={{ fontSize: '0.65rem' }}>842_RENTALS_AVAILABLE_NOW</div>
              </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics Section */}
      <section style={{ padding: '12rem 0', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10rem', alignItems: 'center' }}>
          <div>
              <h2 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '3rem' }}>Digital First <br/>Leasing.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--pr-text-muted)', lineHeight: 2 }}>
                  Our rental vertical is built on a "Digital First" philosophy. From virtual tours to cryptographic lease signing, we have removed the friction from finding your next residential node.
              </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
              <TrustMetrics value="100%" label="DIGITAL_LEASES" />
              <TrustMetrics value="24h" label="MAINTENANCE_SLA" />
              <TrustMetrics value="Instant" label="APPROVAL_SYNC" />
              <TrustMetrics value="Verified" label="NODE_STATUS" />
          </div>
      </section>

      {/* Search Bar Placeholder */}
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '100px', border: '1px solid var(--pr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6rem' }}>
          <div style={{ display: 'flex', gap: '4rem', paddingLeft: '2rem' }}>
              {['Studio', 'Apartment', 'Loft', 'Penthouse'].map(type => (
                  <span key={type} className="pr-mono" style={{ color: 'var(--pr-text-muted)', cursor: 'pointer' }}>{type}</span>
              ))}
          </div>
          <div style={{ color: 'var(--pr-mint)', fontWeight: 800 }}>SORT: NEWEST_FIRST ⌄</div>
      </div>

      {/* Rent Grid */}
      <section>
        <div className="pr-rent-grid">
          {rentals.map((r, i) => (
            <LeaseUnitCard key={i} {...r} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ marginTop: '15rem', padding: '10rem', background: 'linear-gradient(135deg, #f0fdfa 0%, #fff 100%)', borderRadius: '48px', border: '1px solid var(--pr-border)', textAlign: 'center' }}>
          <div className="pr-mono" style={{ marginBottom: '3rem' }}>AUTHORIZE_NEW_RESIDENCE</div>
          <h2 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-3px', marginBottom: '4rem' }}>
              Ready to <br/>
              Move In?
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 6rem', color: 'var(--pr-text-muted)', fontSize: '1.25rem', lineHeight: 1.8 }}>
              Join thousands of tenants currently using the Sellio rental protocol for a high-fidelity living experience.
          </p>
          <button className="pr-btn-primary" style={{ padding: '2.5rem 8rem', fontSize: '1.25rem' }}>
              CREATE_TENANT_NODE
          </button>
      </section>
    </div>
  );
}
