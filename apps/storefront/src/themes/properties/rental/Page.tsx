
import React from 'react';
import { RentCard } from './components';

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
    <div>
      {/* Hero Section */}
      <section className="lease-hero">
          <div className="lease-hero-content">
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--rent-teal)', letterSpacing: '2px', display: 'block', marginBottom: '1.5rem' }}>EASY_LEASING_PROTOCOL</span>
              <h1>Rent your next <br/>home with ease.</h1>
              <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: 1.6, marginBottom: '3.5rem', maxWidth: '500px' }}>
                  A streamlined rental experience designed for the modern tenant. Verified properties, digital leases, and automated maintenance nodes.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'var(--rent-teal)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700 }}>FIND_A_RENTAL</button>
                  <button style={{ padding: '1.25rem 3.5rem', background: 'none', color: 'var(--rent-dark)', border: '1px solid var(--rent-dark)', borderRadius: '12px', fontWeight: 700 }}>LIST_YOUR_UNIT</button>
              </div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070" alt="Modern Apartment" style={{ width: '100%', borderRadius: '16px', boxShadow: '40px 40px 80px rgba(0,0,0,0.05)' }} />
          </div>
      </section>

      {/* Filter / Search Bar */}
      <section style={{ padding: '3rem 5%', display: 'flex', justifyContent: 'center', background: '#fff', borderBottom: '1px solid var(--rent-border)' }}>
          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center' }}>
              {['Studio', 'Apartment', 'Loft', 'Penthouse', 'Townhouse'].map(type => (
                  <span key={type} style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8', cursor: 'pointer' }}>{type.toUpperCase()}</span>
              ))}
          </div>
      </section>

      {/* Rent Grid */}
      <section className="rent-grid">
          {rentals.map((rental, i) => (
              <RentCard key={i} {...rental} />
          ))}
      </section>

      {/* Value Prop Section */}
      <section style={{ padding: '10rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center', background: '#f0fdfa' }}>
          <div>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2.5rem' }}>Digital First <br/>Leasing.</h2>
              <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 2, marginBottom: '4rem' }}>
                  Our rental vertical is built on a "Digital First" philosophy. From virtual tours to cryptographic lease signing, we have removed the friction from finding your next home.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                  <div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--rent-teal)' }}>100%</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>DIGITAL_LEASES</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--rent-teal)' }}>24h</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>MAINTENANCE_SLA</div>
                  </div>
              </div>
          </div>
          <div style={{ padding: '4rem', background: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>Ready to move in?</h3>
              <p style={{ color: '#94a3b8', lineHeight: 2, marginBottom: '3rem' }}>
                  Join thousands of tenants currently using the Sellio rental protocol for a better living experience.
              </p>
              <button style={{ width: '100%', padding: '1.5rem', background: 'var(--rent-dark)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 900 }}>
                  CREATE_TENANT_NODE
              </button>
          </div>
      </section>
    </div>
  );
}
