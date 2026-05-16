'use client';
import React from 'react';
import { TechDeviceCard, ComponentHUD } from './components';

export default function Page() {
  const products = [
    { title: "NVIDIA RTX 5090 Ti", price: "$2,199", category: "GRAPHICS", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070" },
    { title: "Quantum-X UltraWide", price: "$1,499", category: "DISPLAY", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070" },
    { title: "Core-i11 16th Gen", price: "$699", category: "PROCESSOR", image: "https://images.unsplash.com/photo-1591405351990-4726e33df58d?q=80&w=2070" },
    { title: "NeuroMechanical K7", price: "$299", category: "INTERFACE", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2070" },
    { title: "HyperLink 10G Router", price: "$450", category: "NETWORK", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070" },
    { title: "ZeroLat Sonic Pods", price: "$199", category: "AUDIO", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070" },
  ];

  return (
    <div className="el-section">
      {/* Technical Hero */}
      <section className="el-hero">
        <div>
          <div className="el-label" style={{ marginBottom: '3rem' }}>Core Adaptive Hardware System</div>
          <h1 className="el-heading-xl">
            Precision <br/>
            Engineered <br/>
            <span style={{ color: 'var(--el-cyan)' }}>Performance.</span>
          </h1>
          <p style={{ marginTop: '5.5rem', fontSize: '1.25rem', color: 'rgba(255,255,255,0.4)', lineHeight: 2, maxWidth: '500px' }}>
            Enterprise-grade hardware architecture optimized for the next decade of computational demand. Engineered for the world's most critical nodes.
          </p>
          <div style={{ marginTop: '7rem', display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'inherit' }}>
            <button className="el-btn-primary">Enter Ecosystem</button>
            <button style={{ 
                background: 'transparent', 
                border: '1px solid var(--el-border)', 
                color: 'white', 
                padding: '1.5rem 4rem', 
                borderRadius: '2px', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                cursor: 'pointer',
                fontFamily: 'var(--el-mono)',
                fontSize: '0.8rem',
                letterSpacing: '2px'
            }}>
                Explore Manifest
            </button>
          </div>
        </div>
        <div className="el-hero-img-wrapper">
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070" alt="Hardware Node" className="el-hero-img" />
          
          <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', background: 'var(--el-cyan)', color: 'black', padding: '4rem', fontWeight: 900, fontFamily: 'var(--el-mono)', boxShadow: '0 40px 80px rgba(0,0,0,0.2)', display: 'none' }}>
              <style dangerouslySetInnerHTML={{ __html: `
                @media (min-width: 1024px) {
                  div[style*="top: -4rem"] { display: block !important; }
                }
              ` }} />
              <div style={{ fontSize: '3rem' }}>6.0</div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '4px' }}>VERSION_CORE</div>
          </div>
        </div>
      </section>

      {/* Component HUD Bar */}
      <section style={{ padding: '8rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginTop: '10rem' }}>
          <ComponentHUD icon="⚡" label="Near-Zero Latency" status="0.01ms optimized data paths for instant response." />
          <ComponentHUD icon="🔒" label="Hardware Shield" status="Kernel-level hardware encryption for every node." />
          <ComponentHUD icon="🌐" label="Grid Integration" status="Seamless synchronization with the global network." />
          <ComponentHUD icon="🚀" label="Scaling Protocol" status="Designed for high-density industrial growth." />
      </section>

      {/* Device Registry Section */}
      <section style={{ marginTop: '15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem', flexWrap: 'wrap', gap: '4rem' }}>
              <div>
                  <div className="el-label" style={{ marginBottom: '1.5rem' }}>Core Hardware Registry</div>
                  <h2 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 800, letterSpacing: '-3px', textTransform: 'uppercase', fontFamily: 'var(--el-mono)' }}>The <span style={{ color: 'var(--el-cyan)' }}>Showcase.</span></h2>
              </div>
              <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.8 }}>
                  Our unified protocol synchronizes hardware availability from the world's most significant engineering nodes.
              </div>
          </div>
          
          <div className="el-device-grid">
            {products.map((p, i) => (
              <TechDeviceCard key={i} {...p} />
            ))}
          </div>
      </section>

      {/* Bespoke Feature Section */}
      <section style={{ marginTop: '20rem', padding: '15rem 10%', background: 'var(--el-surface)', border: '1px solid var(--el-border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15rem', alignItems: 'center' }}>
          <div>
              <div className="el-label" style={{ marginBottom: '3rem' }}>Hardware Synthesis Hub</div>
              <h2 className="el-heading-xl" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', marginBottom: '4rem' }}>Bespoke <br/>Infrastructure.</h2>
              <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.4)', lineHeight: 2, marginBottom: '6rem' }}>
                  Need something custom? Our engineering nodes are ready to assemble bespoke hardware configurations tailored to your specific requirements.
              </p>
              <button className="el-btn-primary">Contact Engineering</button>
          </div>
          <div style={{ padding: '6rem', background: '#000', border: '1px solid var(--el-border)', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--el-border)', paddingBottom: '2rem' }}>
                      <span className="el-label" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>Node Verified</span>
                      <span className="el-label" style={{ fontSize: '0.6rem', color: 'var(--el-cyan)' }}>Stable Signal</span>
                  </div>
              ))}
          </div>
      </section>

      {/* Final Space */}
      <div style={{ height: '15rem' }}></div>
    </div>
  );
}
