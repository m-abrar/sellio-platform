import React from 'react';
import { EstateShowcase, LuxuryAmenities } from './components';
import { useThemeContent, useThemeMedia } from '@/components/theme-content/ThemeContentProvider';

export default function Page() {
  return (
    <div>
      {/* Hero Section */}
      <section className="platinum-hero">
          <div className="platinum-hero-content">
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--luxury-gold)', letterSpacing: '5px', display: 'block', marginBottom: '2rem' }}>{useThemeContent('hero.kicker', 'ESTABLISHED_REPRESENTATION')}</span>
              <h1>
                {useThemeContent('hero.title', 'The \nCollection.').split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i === 0 && (
                      <>
                        {' '}
                        <span>{useThemeContent('hero.highlight', 'Platinum')}</span>
                      </>
                    )}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h1>
              <p style={{ fontSize: '1.25rem', color: '#666', lineHeight: 2, marginBottom: '4rem', maxWidth: '600px' }}>
                  {useThemeContent('hero.description', "A curated distribution of the world's most significant luxury estates. Immersive, high-fidelity representation for the discerning asset holder.")}
              </p>
              <button className="luxury-btn-primary">{useThemeContent('hero.primary_cta_label', 'EXPLORE_COLLECTION')}</button>
          </div>
          <div>
              <img src={useThemeMedia('hero.image', '/themes/properties/luxury/1.webp')} alt="Luxury Villa" className="platinum-hero-img" />
          </div>
      </section>

      {/* Logic Bar */}
      <section style={{ padding: '3rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid var(--luxury-border)', color: '#bbb', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '3px' }}>
          {useThemeContent('logic.items', 'ASSETS_UNDER_MANAGEMENT: $18.4B|NODAL_VERIFICATION: ELITE|GLOBAL_DISTRIBUTION: ACTIVE|PRIVATE_ACCESS: GRANTED').split('|').map(logic => (
              <span key={logic}>{logic}</span>
          ))}
      </section>

      {/* Showcase */}
      <EstateShowcase />

      {/* Middle Section: Editorial */}
      <section style={{ padding: '15rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10rem', alignItems: 'center', background: 'var(--luxury-platinum)' }}>
          <div style={{ position: 'relative' }}>
              <img src={useThemeMedia('editorial.image', '/themes/properties/luxury/2.webp')} alt="Modern Architecture" style={{ width: '100%', borderRadius: '4px', boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }} />
              <div style={{ position: 'absolute', bottom: '-4rem', right: '-4rem', padding: '4rem', background: 'white', border: '1px solid var(--luxury-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-serif)', color: 'var(--luxury-gold)' }}>{useThemeContent('editorial.badge_value', '50+')}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#aaa', letterSpacing: '2px' }}>{useThemeContent('editorial.badge_label', 'OFF_MARKET_NODES')}</div>
              </div>
          </div>
          <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--luxury-gold)', letterSpacing: '5px' }}>{useThemeContent('editorial.kicker', 'EDITORIAL_INSIGHT')}</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 900, marginTop: '1rem', marginBottom: '3rem' }}>
                {useThemeContent('editorial.title', 'Bespoke Architecture. \nGlobal Context.').split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 2, marginBottom: '4rem' }}>
                  {useThemeContent('editorial.description', 'Every property in our Platinum Collection is more than an asset; it is a architectural statement. Our high-fidelity platform ensures that the narrative of each estate is preserved and communicated with surgical precision.')}
              </p>
              <button style={{ background: 'none', border: 'none', borderBottom: '2px solid var(--luxury-charcoal)', padding: '0.5rem 0', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>{useThemeContent('editorial.cta_label', 'READ_THE_JOURNAL')}</button>
          </div>
      </section>

      {/* Amenities */}
      <LuxuryAmenities />

      {/* Final CTA */}
      <section style={{ padding: '15rem 5%', textAlign: 'center', background: 'var(--luxury-charcoal)', color: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '5rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-2px' }}>
                {useThemeContent('cta.title', 'Define your \nLegacy.').split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h2>
              <p style={{ fontSize: '1.25rem', opacity: 0.6, lineHeight: 2, marginBottom: '5rem' }}>
                  {useThemeContent('cta.description', "Our concierge team is standing by to facilitate your next high-fidelity acquisition. Connect with the world's most exclusive distribution network.")}
              </p>
              <button className="luxury-btn-primary" style={{ background: 'var(--luxury-gold)', color: 'white', padding: '2rem 6rem', fontSize: '1.1rem' }}>{useThemeContent('cta.button_label', 'CONNECT_WITH_CONCIERGE')}</button>
          </div>
      </section>
    </div>
  );
}
