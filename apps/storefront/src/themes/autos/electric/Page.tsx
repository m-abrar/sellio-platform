'use client';
import React from 'react';
import { ElectricAssetCard, RangeAnalyticsHUD } from './components';

export default function Page() {
  const electricFleet = [
    { name: "Lucid Air Sapphire", price: "$249,000", range: "687 KM", accel: "1.89s", topSpeed: "330 KM/H", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2000" },
    { name: "Tesla Model S Plaid", price: "$89,990", range: "637 KM", accel: "1.99s", topSpeed: "322 KM/H", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000" },
    { name: "Rimac Nevera", price: "$2,200,000", range: "490 KM", accel: "1.81s", topSpeed: "412 KM/H", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7fd761?q=80&w=2000" },
    { name: "Porsche Taycan Turbo S", price: "$194,900", range: "450 KM", accel: "2.4s", topSpeed: "260 KM/H", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7fd761?q=80&w=2000" },
    { name: "Lotus Evija", price: "$2,100,000", range: "400 KM", accel: "2.8s", topSpeed: "350 KM/H", image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=2000" },
    { name: "Rivian R1S", price: "$78,000", range: "516 KM", accel: "3.0s", topSpeed: "201 KM/H", image: "https://images.unsplash.com/photo-1617788131775-ceb2027fd12c?q=80&w=2000" },
  ];

  return (
    <div className="ae-section">
      {/* Tech Hero */}
      <section className="ae-hero">
        <div className="ae-hero-circle"></div>
        <div className="ae-mono" style={{ marginBottom: '4rem', color: 'var(--ae-green)' }}>THE REGISTRY // NEURAL CONNECTIVITY ACTIVE</div>
        <h1 className="ae-heading-xl">
            EV<span style={{ color: 'var(--ae-cyan)' }}>OLVE.</span> <br/>
            Neural <br/>
            Design.
        </h1>
        <p style={{ maxWidth: '750px', fontSize: '1.5rem', color: 'rgba(241, 245, 249, 0.4)', lineHeight: 1.8, marginTop: '6rem', fontWeight: 300 }}>
            Access the world's most advanced electric vehicle inventory. Every asset is verified for peak performance, range integrity, and neural-linked telemetry.
        </p>
        <div style={{ marginTop: '8rem', display: 'flex', gap: '3rem' }}>
            <button className="ae-btn-primary">Initialize Scan</button>
            <button style={{ 
                background: 'transparent', 
                border: '1px solid var(--ae-cyan)', 
                color: 'var(--ae-cyan)', 
                padding: '1.5rem 4rem', 
                borderRadius: '12px', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                cursor: 'pointer',
                letterSpacing: '2px',
                boxShadow: 'var(--ae-glow-blue)'
            }}>
                View Network
            </button>
        </div>
      </section>

      {/* Logic / Trust Bar */}
      <div style={{ padding: '4rem 0', borderTop: '1px solid var(--ae-border)', borderBottom: '1px solid var(--ae-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12rem', background: 'rgba(0,0,0,0.2)' }}>
          {['TELEMETRY: VERIFIED', '800V_ULTRA_GRID', 'NEURAL_LINK: STABLE', 'ASSET_VERIFICATION: 100%'].map(logic => (
              <div key={logic} className="ae-mono" style={{ fontSize: '0.65rem', opacity: 0.6 }}>{logic}</div>
          ))}
      </div>

      {/* Analytics HUD Section */}
      <section className="ae-analytics-hud">
          <div className="ae-analytics-inner">
              <div>
                  <div className="ae-mono" style={{ marginBottom: '1.5rem', color: 'var(--ae-green)' }}>MODULAR_PLATFORM</div>
                  <h2 className="ae-heading-l">Modular <br/><span style={{ color: 'var(--ae-cyan)' }}>Architecture.</span></h2>
              </div>
              <p style={{ fontSize: '1.25rem', color: 'rgba(241, 245, 249, 0.4)', lineHeight: 2 }}>
                  Our vehicles are built on the 'Electra-Core' platform, featuring swappable battery modules and a neural navigation system that learns your driving patterns in real-time.
              </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem' }}>
              <RangeAnalyticsHUD value="350KW" label="ULTRA_CHARGE" />
              <RangeAnalyticsHUD value="L4" label="AUTONOMOUS" />
              <RangeAnalyticsHUD value="0.01s" label="SYNC_SPEED" />
              <RangeAnalyticsHUD value="100%" label="EFFICIENCY" />
          </div>
      </section>

      {/* Fleet Showcase Grid */}
      <section className="ae-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
              <div>
                  <div className="ae-mono" style={{ marginBottom: '1.5rem', color: 'var(--ae-green)' }}>HIGH_FIDELITY_FLEET</div>
                  <h2 className="ae-heading-l">The <span style={{ color: 'var(--ae-cyan)' }}>Registry.</span></h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'rgba(241, 245, 249, 0.3)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes performance data from the world's most significant electric asset nodes.
              </div>
          </div>
          
          <div className="ae-fleet-grid">
            {electricFleet.map((car, i) => (
              <ElectricAssetCard key={i} {...car} />
            ))}
          </div>
      </section>

      {/* Elite Comparison Matrix */}
      <section className="ae-section" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--ae-border)', borderBottom: '1px solid var(--ae-border)' }}>
          <div style={{ textAlign: 'center', marginBottom: '10rem' }}>
              <div className="ae-mono" style={{ marginBottom: '1.5rem', color: 'var(--ae-green)' }}>COMPARISON_PROTOCOL_V4</div>
              <h2 className="ae-heading-m">Nodal <span style={{ color: 'var(--ae-cyan)' }}>Benchmarks.</span></h2>
          </div>

          <div className="ae-swipe-container">
              <div className="ae-matrix">
                  <div className="ae-matrix-row ae-matrix-header">
                      <div className="ae-matrix-cell">SPECIFICATION</div>
                      <div className="ae-matrix-cell">LUCID AIR</div>
                      <div className="ae-matrix-cell">TESLA PLAID</div>
                      <div className="ae-matrix-cell">RIMAC NEVERA</div>
                  </div>
                  {[
                      { label: "Starting Price", v1: "$249,000", v2: "$89,990", v3: "$2,200,000" },
                      { label: "Max Range (EPA)", v1: "687 KM", v2: "637 KM", v3: "490 KM" },
                      { label: "0-60 MPH (Est.)", v1: "1.89s", v2: "1.99s", v3: "1.81s" },
                      { label: "Charge (800V)", v1: "350 KW", v2: "250 KW", v3: "500 KW" },
                      { label: "Neural Compute", v1: "L4 READY", v2: "FSD ACTIVE", v3: "R-TRACK" }
                  ].map((row, i) => (
                      <div key={i} className="ae-matrix-row">
                          <div className="ae-matrix-cell ae-matrix-label">{row.label}</div>
                          <div className="ae-matrix-cell">{row.v1}</div>
                          <div className="ae-matrix-cell">{row.v2}</div>
                          <div className="ae-matrix-cell">{row.v3}</div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Charging Hub Registry */}
      <section className="ae-section">
          <div className="ae-grid-hub">
              <div>
                  <div className="ae-mono" style={{ marginBottom: '2.5rem', color: 'var(--ae-green)' }}>CHARGING_NETWORK_MAP</div>
                  <h2 className="ae-heading-l" style={{ marginBottom: '4rem' }}>Global <span style={{ color: 'var(--ae-cyan)' }}>Grid.</span></h2>
                  <p style={{ fontSize: '1.25rem', color: 'rgba(241, 245, 249, 0.4)', lineHeight: 2, marginBottom: '6rem' }}>
                      Never worry about range anxiety. Our marketplace integrates with thousands of Level 2 and DC Fast Charging stations globally.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      {['REAL-TIME AVAILABILITY', 'INTEGRATED PAYMENTS', 'RENEWABLE ENERGY FILTER'].map(item => (
                          <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--ae-cyan)' }}>
                              <span style={{ fontSize: '1.5rem' }}>◈</span> {item}
                          </li>
                      ))}
                  </ul>
              </div>
              <div style={{ background: 'var(--ae-glass)', border: '1px solid var(--ae-border)', height: '600px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at center, var(--ae-cyan) 0%, transparent 70%)' }}></div>
                  <div className="ae-mono" style={{ opacity: 0.2, fontSize: '1rem' }}>[ MAP_REGISTRY_LOADING_V8 ]</div>
              </div>
          </div>
      </section>

      {/* Sustainability Pulse */}
      <section className="ae-section" style={{ borderTop: '1px solid var(--ae-border)' }}>
          <h2 className="ae-heading-m" style={{ textAlign: 'center', marginBottom: '10rem' }}>Sustainability <span style={{ color: 'var(--ae-green)' }}>Protocol.</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
              {[
                  { icon: "⚡", title: "Zero Emissions", desc: "Contribute to a cleaner planet with every mile driven in our fleet." },
                  { icon: "🔋", title: "Circular Battery", desc: "Recycled module architecture ensuring 98% lifecycle efficiency." },
                  { icon: "💠", title: "Smart Mesh", desc: "Over-the-air updates keeping your hardware optimized indefinitely." },
                  { icon: "♻️", title: "Pure Energy", desc: "Filter for charging nodes powered exclusively by solar and wind." }
              ].map((item, i) => (
                  <div key={i} className="ae-icon-box">
                      <div style={{ fontSize: '4rem', marginBottom: '3rem' }}>{item.icon}</div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'white' }}>{item.title}</h3>
                      <p style={{ color: 'rgba(241, 245, 249, 0.4)', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
              ))}
          </div>
      </section>

      {/* Final Space */}
      <div style={{ height: '10rem' }}></div>
    </div>
  );
}
