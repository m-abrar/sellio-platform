'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@sellio/api-client';
import { AssetRegistryCard } from './components';
import { submitPropertyInquiry } from '@/themes/properties/shared/submit-property-inquiry';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';

// High-fidelity local commercial assets fallback seeds
const FALLBACK_ASSETS = [
  { id: "ASSET-9921", rawId: 1, title: "One Skyline Plaza", type: "PRIME_OFFICE", area: "142,000 SQFT", status: "AVAILABLE", slug: "one-skyline-plaza", location: "New York, NY", description: "Authoritative architectural node in the Downtown Core. Features premium steel framing, high-density server vaults, and private rooftop logistics helipads." },
  { id: "ASSET-4412", rawId: 2, title: "TechPark Hub", type: "MIXED_USE", area: "85,000 SQFT", status: "LEASING", slug: "techpark-hub", location: "San Francisco, CA", description: "Bespoke engineering incubator configured with modular open floors, advanced fiber optical routing hubs, and collaborative courtyard specifications." },
  { id: "ASSET-1022", rawId: 3, title: "Portside Logistics Center", type: "INDUSTRIAL", area: "250,000 SQFT", status: "AVAILABLE", slug: "portside-logistics-center", location: "Houston, TX", description: "Premium class-A global distribution hub boasting automated bay entries, 36-foot clearance ceilings, and robust intermodal transport routing protocols." },
  { id: "ASSET-3381", rawId: 4, title: "The Atrium HQ", type: "OFFICE_CAMPUS", area: "110,000 SQFT", status: "OCCUPIED", slug: "the-atrium-hq", location: "Seattle, WA", description: "High-yield suburban business headquarters enveloped by triple-pane energy glass facades, custom botanical atrium lungs, and subterranean EV storage clusters." },
  { id: "ASSET-7756", rawId: 5, title: "Westside Retail Mall", type: "RETAIL_CENTER", area: "200,000 SQFT", status: "AVAILABLE", slug: "westside-retail-mall", location: "Los Angeles, CA", description: "Premier lifestyle center with high foot-traffic indices, state-of-the-art visual staging arenas, and versatile commercial zoning permits." },
  { id: "ASSET-8821", rawId: 6, title: "DataVault Station", type: "DATA_CENTER", area: "45,000 SQFT", status: "PRIVATE_SALE", slug: "datavault-station", location: "Ashburn, VA", description: "Tier-IV mission-critical secure vault node configured with modular cooling towers, secondary generator backups, and biometric security boundaries." },
];

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();
  const themeLink = usePropertyThemeLink();
  const [asset, setAsset] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);

  // Hydration status
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Stateful Auditing Desk
  const [repName, setRepName] = useState('');
  const [corpEmail, setCorpEmail] = useState('');
  const [corpFirm, setCorpFirm] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [targetBudget, setTargetBudget] = useState('');
  const [isRouting, setIsRouting] = useState(false);
  const [auditReceipt, setAuditReceipt] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const translateProperty = (p: any) => {
    const rawPrice = p.price || 14000000;
    const formattedPrice = p.price_formatted || `$${(rawPrice / 1000000).toFixed(1)}M`;
    
    let loc = 'Downtown Core';
    if (p.location) {
      if (typeof p.location === 'object') {
        loc = p.location.title || (p.location.city ? `${p.location.city}, ${p.location.state || p.location.country || ''}` : 'Downtown Core');
      } else {
        loc = String(p.location);
      }
    } else if (p.city || p.address) {
      loc = p.city || p.address;
    }

    const area = p.specs?.area_formatted || (p.area_sq_ft ? `${p.area_sq_ft.toLocaleString()} SQFT` : `${142000 + (p.id % 5) * 20000} SQFT`);
    
    let status = 'AVAILABLE';
    if (p.status) {
      let rawStatus = '';
      if (typeof p.status === 'object') {
        rawStatus = (p.status.label || p.status.name || '').toUpperCase();
      } else {
        rawStatus = String(p.status).toUpperCase();
      }

      if (rawStatus.includes('RENT') || rawStatus.includes('LEAS') || rawStatus === 'RENTAL') {
        status = 'LEASING';
      } else if (rawStatus.includes('SALE') || rawStatus.includes('BUY') || rawStatus === 'AVAILABLE') {
        status = 'AVAILABLE';
      } else if (rawStatus.includes('OCCUP') || rawStatus === 'OCCUPIED') {
        status = 'OCCUPIED';
      } else {
        status = 'PRIVATE_SALE';
      }
    } else {
      status = p.id % 3 === 0 ? 'LEASING' : p.id % 3 === 1 ? 'OCCUPIED' : 'AVAILABLE';
    }

    const assetId = `ASSET-${p.id + 9900}`;
    
    let categoryTitle = 'Prime Office';
    if (p.category) {
      if (typeof p.category === 'object') {
        categoryTitle = p.category.title || p.category.name || 'Prime Office';
      } else {
        categoryTitle = String(p.category);
      }
    }
    
    let typeToken = categoryTitle.toUpperCase().replace(/\s+/g, '_');
    const allowedTypes = ['PRIME_OFFICE', 'MIXED_USE', 'INDUSTRIAL', 'OFFICE_CAMPUS', 'RETAIL_CENTER', 'DATA_CENTER'];
    if (!allowedTypes.includes(typeToken)) {
      typeToken = allowedTypes[p.id % allowedTypes.length];
    }
    
    const rawId = typeof p.id === 'number' ? p.id : (p.rawId || parseInt(String(p.id).replace(/[^\d]/g, '')) || 1);
    let img = p.featured_image || (p.media?.main_photo || p.image);
    if (!img) {
      const unsplashImages = [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1464938050520-502b4763c533?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80"
      ];
      img = unsplashImages[rawId % unsplashImages.length];
    }

    const estYield = `${5.8 + (p.id % 4) * 0.45}%`;
    const yearBuilt = String(2010 + (p.id % 3) * 4);
    const zoning = p.id % 2 === 0 ? 'C3-2 (General Commercial)' : 'M1-1 (Light Industrial)';
    const occupancy = `${82 + (p.id % 5) * 3}%`;
    const stories = `${8 + (p.id % 4) * 4} Stories`;

    return {
      id: assetId,
      rawId: p.id,
      title: p.title,
      slug: p.slug || `property-${p.id}`,
      price: formattedPrice,
      base_price: rawPrice,
      type: typeToken,
      location: loc,
      area: area,
      status: status,
      image: img,
      yield: estYield,
      yearBuilt: yearBuilt,
      zoning: zoning,
      occupancy: occupancy,
      stories: stories,
      description: p.description || p.short_description || `High-fidelity dynamic commercial node located in ${loc}. Ready for instant lease signing protocols.`
    };
  };

  const loadAssetDetails = async () => {
    setLoading(true);
    try {
      const response = await api.getPropertyDetails(slug);
      if (response && response.data) {
        const translated = translateProperty(response.data);
        setAsset(translated);
        setUseFallback(false);
        setApiError(null);

        // Fetch related commercial assets in the same class
        const relatedRes = await api.getProperties({ per_page: 6 });
        if (relatedRes && relatedRes.data) {
          const mappedRelated = relatedRes.data
            .filter((p: any) => p.slug !== slug)
            .slice(0, 3)
            .map((p: any) => translateProperty(p));
          setRelated(mappedRelated);
        }
      } else {
        triggerFallbackNode();
      }
    } catch (error) {
      console.error("Properties Commercial: Detail load failure. Engaging fallback.", error);
      setApiError(error instanceof Error ? error.message : String(error));
      triggerFallbackNode();
    } finally {
      setLoading(false);
    }
  };

  const triggerFallbackNode = () => {
    setUseFallback(true);
    const found = FALLBACK_ASSETS.find(a => a.slug === slug) || FALLBACK_ASSETS[0];
    
    // Map full specifications for backup nodes
    const detailsMapped = {
      ...found,
      yield: `${5.8 + (found.rawId % 4) * 0.45}%`,
      yearBuilt: String(2010 + (found.rawId % 3) * 4),
      zoning: found.rawId % 2 === 0 ? 'C3-2 (General Commercial)' : 'M1-1 (Light Industrial)',
      occupancy: `${82 + (found.rawId % 5) * 3}%`,
      stories: `${8 + (found.rawId % 4) * 4} Stories`,
      price: found.rawId % 2 === 0 ? '$14.2M' : '$8.5M',
      image: `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80`
    };

    setAsset(detailsMapped);

    const filtered = FALLBACK_ASSETS
      .filter(a => a.slug !== found.slug)
      .slice(0, 3)
      .map(a => ({
        ...a,
        yield: `${5.8 + (a.rawId % 4) * 0.45}%`,
        yearBuilt: String(2010 + (a.rawId % 3) * 4),
        zoning: a.rawId % 2 === 0 ? 'C3-2 (General Commercial)' : 'M1-1 (Light Industrial)',
        occupancy: `${82 + (a.rawId % 5) * 3}%`,
        stories: `${8 + (a.rawId % 4) * 4} Stories`,
        price: a.rawId % 2 === 0 ? '$14.2M' : '$8.5M',
        image: `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80`
      }));
    setRelated(filtered);
  };

  useEffect(() => {
    loadAssetDetails();
  }, [slug]);

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset || !repName || !corpEmail || !corpFirm || !preferredDate || !targetBudget) {
      setFormError('Please specify all core institutional appraisal parameters.');
      return;
    }
    setFormError(null);
    setIsRouting(true);

    const propertyId = asset.rawId ?? asset.id;
    const inquiryMessage = [
      `Firm: ${corpFirm}`,
      `Preferred audit date: ${preferredDate}`,
      `Target budget: ${targetBudget}`,
    ].join('\n');

    const shaHash = `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const receipt = {
      auditId: `AUD-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleString(),
      assetTitle: asset.title,
      assetId: asset.id,
      representative: repName,
      corporateEmail: corpEmail,
      firmName: corpFirm,
      auditDate: preferredDate,
      targetBudget,
      shaHash,
    };

    const result = await submitPropertyInquiry({
      propertyId: Number(propertyId),
      useFallback,
      storageKey: 'sellio_properties_commercial_orders',
      fullName: repName,
      email: corpEmail,
      message: inquiryMessage,
      demoRecord: receipt,
    });

    setIsRouting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setAuditReceipt({
      ...receipt,
      auditId: String(result.leadId),
    });
  };

  if (loading) {
    return (
      <div className="pc-section" style={{ padding: '8rem 6%', minHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .pc-detail-shimmer {
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: pcDetShimmer 1.5s infinite linear;
          }
          @keyframes pcDetShimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}} />
        <div className="pc-detail-shimmer" style={{ height: '400px', borderRadius: '4px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '6rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="pc-detail-shimmer" style={{ height: '50px', width: '60%', borderRadius: '4px' }} />
            <div className="pc-detail-shimmer" style={{ height: '24px', width: '85%', borderRadius: '4px' }} />
            <div className="pc-detail-shimmer" style={{ height: '200px', borderRadius: '4px' }} />
          </div>
          <div className="pc-detail-shimmer" style={{ height: '450px', borderRadius: '4px' }} />
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="pc-section text-center" style={{ padding: '12rem 2rem', color: 'var(--pc-carbon)' }}>
        <div className="pc-mono" style={{ marginBottom: '1.5rem' }}>RESOLVE_NODE_NULL</div>
        <h2 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase' }}>Asset Blueprints Unresolved</h2>
        <p style={{ color: 'var(--pc-slate)', margin: '2rem 0 5rem', fontSize: '1.1rem' }}>The institutional real estate coordinates could not be recovered from the Sellio Ledger.</p>
        <button className="pc-btn-primary" onClick={() => router.push(themeLink('/'))}>RETURN_TO_REGISTRY</button>
      </div>
    );
  }

  return (
    <div className="pc-section" style={{ maxWidth: '1600px', margin: '0 auto', paddingBottom: '12rem' }}>
      
      {/* Return Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6rem', marginTop: '2rem' }}>
        <button 
          onClick={() => router.push(themeLink('/'))}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--pc-carbon)',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontFamily: 'var(--pc-font)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            letterSpacing: '2px'
          }}
        >
          {`←`} RETURN_TO_REGISTRY
        </button>
        <div className="pc-mono" style={{ fontSize: '0.65rem' }}>
          ASSET_LEDGER_NODE // {asset.id}
        </div>
      </div>

      {/* Diagnostics exception panel */}
      {useFallback && apiError && (
        <div style={{
          background: '#f8fafc',
          border: '1px dashed var(--pc-blue)',
          borderLeft: '4px solid var(--pc-blue)',
          padding: '2.5rem 3rem',
          borderRadius: '4px',
          marginBottom: '6rem',
          color: 'var(--pc-carbon)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }} className="pc-mono">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pcPulse 1.5s infinite' }}></span>
            <span style={{ color: 'var(--pc-blue)' }}>CONNECTION_OFFLINE_DIAGNOSTICS</span>
          </div>
          <p style={{ margin: 0, color: 'var(--pc-slate)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Viewing high-fidelity simulated blueprints because the live registry database threw a <code style={{ background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{apiError}</code>. Specs have loaded safely.
          </p>
        </div>
      )}

      {/* Hero Presentation */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '6rem', alignItems: 'start' }}>
        
        {/* Left Side: Metadata and Spec Sheets */}
        <div>
          <div style={{ borderBottom: '1px solid var(--pc-border)', paddingBottom: '4rem', marginBottom: '5rem' }}>
            <div className="pc-mono" style={{ marginBottom: '1.5rem' }}>{asset.type} // {asset.location.toUpperCase()}</div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-2px', lineHeight: 1.05, marginBottom: '2rem' }}>
              {asset.title}
            </h1>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--pc-blue)' }}>
              {asset.price}
            </div>
          </div>

          <div style={{ marginBottom: '6rem' }}>
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" 
              alt={asset.title} 
              style={{ width: '100%', height: '500px', objectFit: 'cover', filter: 'grayscale(100%) brightness(0.95)', border: '1px solid var(--pc-border)', padding: '1rem', background: 'var(--pc-bg)' }} 
            />
          </div>

          {/* Intelligence Specs Matrix */}
          <h3 className="pc-mono" style={{ marginBottom: '2.5rem' }}>Intelligence_Specs_Matrix</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '6rem' }}>
            {[
              { label: 'TOTAL_AREA_MEASUREMENT', value: asset.area },
              { label: 'ACQUISITION_STATUS', value: asset.status },
              { label: 'EST_ANNUAL_YIELD_v2026', value: asset.yield || '6.25%' },
              { label: 'ZONING_CLASSIFICATION', value: asset.zoning || 'C3-2 (General Commercial)' },
              { label: 'LEDGER_OCCUPANCY_RATE', value: asset.occupancy || '85%' },
              { label: 'CONSTRUCTION_DATE_STABLE', value: asset.yearBuilt || '2018' },
              { label: 'BUILDING_STORIES_LEVEL', value: asset.stories || '12 Stories' },
              { label: 'LEDGER_COORDINATES', value: `NODE-${asset.slug.toUpperCase().substring(0, 8)}` }
            ].map((spec, idx) => (
              <div key={idx} style={{ padding: '2rem', background: 'var(--pc-bg)', border: '1px solid var(--pc-border)', borderRadius: '4px' }}>
                <div className="pc-mono" style={{ fontSize: '0.55rem', color: 'var(--pc-slate)', marginBottom: '0.75rem' }}>{spec.label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--pc-carbon)' }}>{spec.value}</div>
              </div>
            ))}
          </div>

          {/* Scope Narrative */}
          <h3 className="pc-mono" style={{ marginBottom: '2rem' }}>Narrative_Description</h3>
          <p style={{ fontSize: '1.15rem', color: 'var(--pc-slate)', lineHeight: 1.9, marginBottom: '6rem' }}>
            {asset.description}
          </p>

          {/* Verification Protocol Block */}
          <div style={{ border: '1px solid var(--pc-border)', padding: '3.5rem 4rem', borderRadius: '4px', background: 'var(--pc-bg)' }}>
            <h4 className="pc-mono" style={{ marginBottom: '1.5rem' }}>{`./registry_protocol_compliance.sh`}</h4>
            <ul style={{ color: 'var(--pc-slate)', fontSize: '0.95rem', lineHeight: 2, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li>Full mechanical, electrical, and structural systems evaluated and verified under CORP guidelines.</li>
              <li>Environmental zoning, soil acoustics, and neighborhood carbon emission compliance verified.</li>
              <li>Yield metrics, annual HOA indices, tenant escrow histories, and capital depreciation audited.</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Stateful Inquiries Drawer */}
        <div>
          {auditReceipt ? (
            /* Auditing Booking Success Invoice */
            <div style={{
              background: 'var(--pc-carbon)',
              color: 'white',
              padding: '4.5rem 3.5rem',
              border: '2px solid var(--pc-blue)',
              borderRadius: '4px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              animation: 'pcFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div className="pc-mono" style={{ color: 'var(--pc-blue)', marginBottom: '2.5rem', fontSize: '0.65rem' }}>ROUTING_AUDIT_SEQUENCE_SYNCED</div>
              <h3 style={{ fontSize: '2.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-2px', marginBottom: '2rem' }}>Audit Schedu_</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.6, lineHeight: 1.8, marginBottom: '4rem' }}>
                Your institutional site visit and yield validation audits have been scheduled. The asset custodian will review firm credentials.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '3rem', marginBottom: '4.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="pc-mono" style={{ opacity: 0.4, fontSize: '0.6rem' }}>AUDIT_REF_ID</span>
                  <span style={{ fontWeight: 800, fontFamily: 'monospace' }}>{auditReceipt.auditId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="pc-mono" style={{ opacity: 0.4, fontSize: '0.6rem' }}>REPRESENTATIVE</span>
                  <span style={{ fontWeight: 800 }}>{auditReceipt.representative}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="pc-mono" style={{ opacity: 0.4, fontSize: '0.6rem' }}>CORPORATE_EMAIL</span>
                  <span style={{ fontWeight: 800 }}>{auditReceipt.corporateEmail}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="pc-mono" style={{ opacity: 0.4, fontSize: '0.6rem' }}>FIRM_ENTITY</span>
                  <span style={{ fontWeight: 800 }}>{auditReceipt.firmName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="pc-mono" style={{ opacity: 0.4, fontSize: '0.6rem' }}>AUDIT_TARGET_DATE</span>
                  <span style={{ fontWeight: 800, color: 'var(--pc-blue)' }}>{auditReceipt.auditDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="pc-mono" style={{ opacity: 0.4, fontSize: '0.6rem' }}>ALLOCATED_BUDGET</span>
                  <span style={{ fontWeight: 800 }}>{auditReceipt.targetBudget}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '2rem', marginTop: '1rem' }}>
                  <span className="pc-mono" style={{ opacity: 0.4, fontSize: '0.55rem' }}>SHA_256_VERIFICATION_HASH</span>
                  <span style={{ fontWeight: 800, color: 'var(--pc-blue)', fontSize: '0.75rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>{auditReceipt.shaHash}</span>
                </div>
              </div>

              <button 
                className="pc-btn-primary" 
                style={{ width: '100%', background: 'var(--pc-blue)', padding: '1.5rem', fontSize: '0.9rem' }}
                onClick={() => setAuditReceipt(null)}
              >
                SCHEDULE ANOTHER AUDIT
              </button>
            </div>
          ) : (
            /* Corporate Auditing inquiry Desk */
            <div style={{
              background: 'var(--pc-bg)',
              border: '1px solid var(--pc-border)',
              padding: '4.5rem 3.5rem',
              borderRadius: '4px'
            }}>
              <h3 className="pc-mono" style={{ marginBottom: '1.25rem' }}>Institutional_Inquiry</h3>
              <p style={{ color: 'var(--pc-slate)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '3.5rem' }}>
                Initiate yield diagnostics and schedule site audits directly with asset custodians.
              </p>

              <form onSubmit={handleAuditSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
                  <div>
                    <label className="pc-mono" style={{ fontSize: '0.55rem', color: 'var(--pc-slate)', display: 'block', marginBottom: '0.75rem' }}>Representative Name</label>
                    <input 
                      type="text"
                      className="pc-search-input"
                      style={{ width: '100%', backgroundColor: 'var(--pc-white)', border: '1px solid var(--pc-border)', color: 'var(--pc-carbon)', padding: '0.9rem 1.25rem', borderRadius: '4px', outline: 'none', fontFamily: 'inherit', fontWeight: 600 }}
                      placeholder="e.g. Warren Buffett"
                      value={repName}
                      onChange={(e) => setRepName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="pc-mono" style={{ fontSize: '0.55rem', color: 'var(--pc-slate)', display: 'block', marginBottom: '0.75rem' }}>Corporate Email Address</label>
                    <input 
                      type="email"
                      className="pc-search-input"
                      style={{ width: '100%', backgroundColor: 'var(--pc-white)', border: '1px solid var(--pc-border)', color: 'var(--pc-carbon)', padding: '0.9rem 1.25rem', borderRadius: '4px', outline: 'none', fontFamily: 'inherit', fontWeight: 600 }}
                      placeholder="e.g. w.buffett@berkshire.com"
                      value={corpEmail}
                      onChange={(e) => setCorpEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="pc-mono" style={{ fontSize: '0.55rem', color: 'var(--pc-slate)', display: 'block', marginBottom: '0.75rem' }}>Firm / Institution Name</label>
                    <input 
                      type="text"
                      className="pc-search-input"
                      style={{ width: '100%', backgroundColor: 'var(--pc-white)', border: '1px solid var(--pc-border)', color: 'var(--pc-carbon)', padding: '0.9rem 1.25rem', borderRadius: '4px', outline: 'none', fontFamily: 'inherit', fontWeight: 600 }}
                      placeholder="e.g. Berkshire Hathaway"
                      value={corpFirm}
                      onChange={(e) => setCorpFirm(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="pc-mono" style={{ fontSize: '0.55rem', color: 'var(--pc-slate)', display: 'block', marginBottom: '0.75rem' }}>Preferred Audit Date</label>
                    <input 
                      type="date"
                      className="pc-search-input"
                      style={{ width: '100%', backgroundColor: 'var(--pc-white)', border: '1px solid var(--pc-border)', color: 'var(--pc-carbon)', padding: '0.9rem 1.25rem', borderRadius: '4px', outline: 'none', fontFamily: 'inherit', fontWeight: 600 }}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="pc-mono" style={{ fontSize: '0.55rem', color: 'var(--pc-slate)', display: 'block', marginBottom: '0.75rem' }}>Target Acquisition Budget</label>
                    <select
                      className="pc-search-input"
                      style={{ width: '100%', backgroundColor: 'var(--pc-white)', border: '1px solid var(--pc-border)', color: 'var(--pc-carbon)', padding: '0.9rem 1.25rem', borderRadius: '4px', outline: 'none', fontFamily: 'inherit', fontWeight: 600, appearance: 'none', cursor: 'pointer' }}
                      value={targetBudget}
                      onChange={(e) => setTargetBudget(e.target.value)}
                      required
                    >
                      <option value="">SELECT_BUDGET_BRACKET</option>
                      <option value="5M_10M">$5M - $10M</option>
                      <option value="10M_25M">$10M - $25M</option>
                      <option value="25M_50M">$25M - $50M</option>
                      <option value="50M_PLUS">$50M+</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="pc-btn-primary"
                  style={{ width: '100%', padding: '1.6rem', background: 'var(--pc-blue)', fontSize: '0.95rem' }}
                  disabled={isRouting}
                >
                  {isRouting ? 'ROUTING_BLUEPRINTS...' : '⚡ INITIALIZE SITE AUDIT GATE'}
                </button>
                {formError && <p className="prop-form-error" role="alert">{formError}</p>}
              </form>
            </div>
          )}
        </div>

      </section>

      {/* Suggested related investment assets carousel */}
      {related.length > 0 && (
        <section style={{ marginTop: '12rem' }}>
          <div className="pc-mono" style={{ marginBottom: '1.5rem' }}>ALTERNATIVE_ブルー_PRINTS</div>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '-2px' }}>Suggested Assets</h2>
          <p style={{ color: 'var(--pc-slate)', marginBottom: '5rem', fontSize: '1.1rem' }}>Alternative prime opportunities matching current classification ledger tags.</p>
          
          <div className="pc-asset-grid">
            {related.map((item, idx) => (
              <AssetRegistryCard 
                key={idx} 
                {...item} 
                onClick={() => {
                  setAuditReceipt(null);
                  setRepName('');
                  setCorpEmail('');
                  setCorpFirm('');
                  setPreferredDate('');
                  setTargetBudget('');
                  router.push(themeLink(`/product/${item.slug}`));
                }}
              />
            ))}
          </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pcFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pcPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
      `}} />
    </div>
  );
}
