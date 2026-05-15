
import React from 'react';
import { MinimalGrid, VoidSyncBar } from './components';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="silent-hero">
          <div style={{ fontSize: '0.75rem', fontWeight: 300, color: '#ccc', letterSpacing: '12px', marginBottom: '3rem' }}>REDUCTIONIST_NODE_V1</div>
          <h1>Pure Focus. <br/><span>Zero Noise.</span></h1>
          <p style={{ maxWidth: '600px', fontSize: '1rem', color: '#888', lineHeight: 2, marginBottom: '6rem', fontWeight: 300 }}>
              The high-fidelity distribution node for minimalist multi-vertical commerce. Stripped of complexity, engineered for pure performance.
          </p>
          <button className="silent-btn-primary">INITIALIZE_VOID</button>
      </section>

      {/* Void Sync Bar */}
      <VoidSyncBar />

      {/* Minimal Grid Section */}
      <MinimalGrid />

      {/* Mid-Section: Invisible Logic */}
      <section style={{ padding: '15rem 6%', textAlign: 'center', background: '#fdfdfd' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#ccc', letterSpacing: '8px' }}>INVISIBLE_LOGIC</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 200, marginTop: '2.5rem', marginBottom: '4rem', letterSpacing: '4px', textTransform: 'uppercase' }}>The Zen of <br/>Distribution.</h2>
              <p style={{ fontSize: '1.1rem', color: '#888', lineHeight: 2, marginBottom: '6rem', fontWeight: 300 }}>
                  Every transition in the Silent Edge protocol is designed to be invisible. By removing non-essential visual telemetry, we achieve a high-fidelity distribution state that allows your assets to exist in their purest form.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8rem' }}>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 200, fontFamily: 'var(--font-heading)' }}>0ms</div>
                      <div style={{ fontSize: '0.6rem', color: '#ccc', fontWeight: 400, letterSpacing: '3px' }}>SYNC_DELAY</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 200, fontFamily: 'var(--font-heading)' }}>100%</div>
                      <div style={{ fontSize: '0.6rem', color: '#ccc', fontWeight: 400, letterSpacing: '3px' }}>PURE_REPRESENTATION</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '20rem 6%', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: 200, marginBottom: '5rem', letterSpacing: '10px', textTransform: 'uppercase' }}>Enter the <br/>Void.</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 6rem', fontSize: '1.25rem', color: '#ccc', fontWeight: 300 }}>
              Connect your core node to the Silent Edge and join the world's most reductionist high-fidelity distribution network.
          </p>
          <button className="silent-btn-primary" style={{ padding: '2rem 10rem', fontSize: '1rem' }}>CONNECT_VOID_NODE</button>
      </section>
    </div>
  );
}
