'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { StructureGrid, SkylineSyncBar } from './components';

const icons = ['🏙️', '🏢', '🏗️', '🏬', '🏛️', '🏘️'];

function mapPropertyToStructure(property: Property, index: number) {
  const area = property.specs?.area_formatted
    || (property.area_sq_ft ? `${Number(property.area_sq_ft).toLocaleString()} sqft` : 'Area TBA');

  return {
    title: property.title,
    units: String(property.specs?.total_units || property.maximum_guests || property.number_of_bedrooms || 1),
    area,
    icon: icons[index % icons.length],
    slug: property.slug,
  };
}

export default function Page() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [propertyError, setPropertyError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProperties() {
      try {
        const response = await api.getProperties({ per_page: 6 });
        if (!isMounted) {
          return;
        }

        setProperties(Array.isArray(response.data) ? response.data : []);
        setPropertyError(null);
      } catch (error: unknown) {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load properties modern listings:', error);
        setPropertyError(error instanceof Error ? error.message : 'Properties are temporarily unavailable.');
      } finally {
        if (isMounted) {
          setLoadingProperties(false);
        }
      }
    }

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  const structureItems = properties.slice(0, 6).map(mapPropertyToStructure);

  return (
    <div>
      {/* Hero Section */}
      <section className="urban-hero">
          <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--urban-skyline)', letterSpacing: '10px', marginBottom: '3rem' }}>ARCHITECTURAL_DISTRIBUTION_V8</div>
              <h1>The <span>Urban</span> <br/>Authority.</h1>
              <p style={{ maxWidth: '600px', fontSize: '1.25rem', color: 'var(--urban-concrete)', lineHeight: 1.8, marginBottom: '5rem' }}>
                  The world's most advanced high-fidelity urban distribution node. Precision architectural engineering for the modern global skyline.
              </p>
              <div style={{ display: 'flex', gap: '3rem' }}>
                  <button className="urban-btn-primary">EXPLORE_SKYLINE</button>
                  <button style={{ background: 'transparent', border: '1px solid #ddd', padding: '1.25rem 4rem', borderRadius: '12px', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>STRUCTURAL_SPEC</button>
              </div>
          </div>
          <div style={{ position: 'relative' }}>
              <div style={{ height: '600px', background: '#f0f9ff', borderRadius: '40px', overflow: 'hidden', border: '1px solid var(--urban-border)' }}>
                  <img src="/themes/properties/modern/1.webp" alt="High-rise Building" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-3rem', right: '-3rem', padding: '3rem', background: 'white', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid var(--urban-border)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--urban-skyline)', fontFamily: 'var(--font-heading)' }}>{loadingProperties ? '...' : properties.length || 84}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--urban-concrete)', fontWeight: 800, letterSpacing: '2px' }}>DISTRICT_NODES</div>
              </div>
          </div>
      </section>

      {/* Skyline Sync Bar */}
      <SkylineSyncBar />

      {/* Structure Grid Section */}
      <StructureGrid items={structureItems} loading={loadingProperties} error={propertyError} />

      {/* Mid-Section: Structural Precision */}
      <section style={{ padding: '15rem 6%', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10rem', alignItems: 'center', background: '#f8fafc' }}>
          <div style={{ position: 'relative' }}>
              <div style={{ height: '700px', background: 'white', border: '1px solid var(--urban-border)', overflow: 'hidden', borderRadius: '24px' }}>
                  <img src="/themes/properties/modern/2.webp" alt="Modern Architecture" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
              </div>
              <div style={{ position: 'absolute', top: '-2rem', left: '-2rem', width: '200px', height: '200px', borderTop: '3px solid var(--urban-skyline)', borderLeft: '3px solid var(--urban-skyline)' }}></div>
          </div>
          <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--urban-skyline)', letterSpacing: '6px' }}>STRUCTURAL_PRECISION</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4.5rem', fontWeight: 900, color: 'var(--urban-midnight)', marginTop: '2.5rem', marginBottom: '3rem', letterSpacing: '-2px' }}>Skyline <br/>Engineering.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--urban-concrete)', lineHeight: 2, marginBottom: '4rem' }}>
                  The Urban Node protocol is built on a foundation of structural integrity. By synchronizing high-fidelity urban assets through a unified architectural registry, we ensure that every unit in the global skyline is represented with absolute precision.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--urban-midnight)' }}>100%</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#aaa', letterSpacing: '2px' }}>INTEGRITY_SYNC</div>
                  </div>
                  <div>
                      <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--urban-midnight)' }}>Global</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#aaa', letterSpacing: '2px' }}>DISTRIBUTION_NODE</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '20rem 6%', textAlign: 'center', background: 'white' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '6rem', fontWeight: 900, color: 'var(--urban-midnight)', marginBottom: '4rem', letterSpacing: '-4px' }}>Authorize Your <br/>Skyline.</h2>
              <p style={{ fontSize: '1.5rem', color: 'var(--urban-concrete)', lineHeight: 1.8, marginBottom: '6rem' }}>
                  Connect your architectural node to the Urban Registry and join the world's most advanced high-fidelity distribution network.
              </p>
              <button className="urban-btn-primary" style={{ padding: '2rem 8rem', fontSize: '1.5rem' }}>CONNECT_URBAN_NODE</button>
          </div>
      </section>
    </div>
  );
}
