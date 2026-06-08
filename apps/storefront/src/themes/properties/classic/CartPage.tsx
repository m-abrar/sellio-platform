'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import { FALLBACK_ESTATE_IDS } from './fallback-data';
import { useClassicListingLink, useClassicThemeLink } from './hooks/useClassicThemeLink';
import { useDemoFallbackAllowed } from './hooks/useDemoFallbackAllowed';

interface InquiredEstate {
  id: number;
  title: string;
  slug: string;
  featured_image?: string;
  location: string;
  price: string | number;
  year?: string | number;
  beds?: number;
  baths?: number;
  area?: string;
  is_rental?: boolean;
  checkIn?: string;
  checkOut?: string;
  guests?: string | number;
  estimated_total?: string;
}

export default function CartPage() {
  const allowDemoCatalog = useDemoFallbackAllowed();
  const themeLink = useClassicThemeLink();
  const listingLink = useClassicListingLink();
  const [inquiries, setInquiries] = useState<InquiredEstate[]>([]);
  const [loading, setLoading] = useState(true);

  // Inquiry form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRegistryText, setSpecialRegistryText] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('sellio_classic_inquiries') || '[]');
    setInquiries(list);
    setLoading(false);
  }, []);

  // Update check-in and check-out dates for a specific rental property and estimate price
  const handleDateChange = async (id: number, field: 'checkIn' | 'checkOut', value: string) => {
    const updated = inquiries.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });

    setInquiries(updated);
    localStorage.setItem('sellio_classic_inquiries', JSON.stringify(updated));

    // If both dates are set, calculate dynamic lodging total
    const item = updated.find(i => i.id === id);
    if (item && item.checkIn && item.checkOut) {
      try {
        // Fetch calculations
        let result: { total_nights: number; estimated_lodging_total: string };
        
        // If it's a fallback ID (custom mock IDs are usually small or have distinct ranges, but checking standard fallbacks)
        const isFallback = allowDemoCatalog && FALLBACK_ESTATE_IDS.has(item.id);
        if (isFallback) {
          const inDate = new Date(item.checkIn);
          const outDate = new Date(item.checkOut);
          const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          // strip currency symbol/commas for clean number parsing
          const priceRaw = String(item.price).replace(/[^0-9.]/g, '');
          const priceNum = Number(priceRaw) || 2500;
          result = {
            total_nights: diffDays,
            estimated_lodging_total: (priceNum * diffDays).toFixed(2)
          };
        } else {
          result = await api.calculateLodgingPrice(item.id, item.checkIn, item.checkOut);
        }

        const calculatedList = updated.map(i => {
          if (i.id === id) {
            return { 
              ...i, 
              estimated_total: `$${Number(result.estimated_lodging_total).toLocaleString()}` 
            };
          }
          return i;
        });
        setInquiries(calculatedList);
        localStorage.setItem('sellio_classic_inquiries', JSON.stringify(calculatedList));
      } catch (err) {
        console.warn("Failed estimating price dynamically for rental registry entry.", err);
      }
    }
  };

  const handleRemoveItem = (id: number) => {
    const filtered = inquiries.filter(item => item.id !== id);
    setInquiries(filtered);
    localStorage.setItem('sellio_classic_inquiries', JSON.stringify(filtered));
  };

  const handleClearRegistry = () => {
    localStorage.removeItem('sellio_classic_inquiries');
    setInquiries([]);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setFormError('Please complete the required coordination details.');
      return;
    }
    setFormError(null);
    
    // Simulate API dispatch
    setFormSubmitted(true);
    localStorage.removeItem('sellio_classic_inquiries');
    setInquiries([]);
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--pc-bone)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'var(--pc-font-serif)' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--pc-teal)' }} className="pc-italic">Synchronizing Ledger...</h2>
        <div style={{ width: '80px', height: '1px', background: 'var(--pc-teal)', marginTop: '2rem', opacity: 0.3 }} />
      </div>
    );
  }

  return (
    <div className="pc-page-shell" style={{ background: 'var(--pc-bone)', minHeight: '100vh' }}>
      
      <section className="pc-section pc-section--listing">
        
        <div className="pc-page-header" style={{ alignItems: 'flex-end' }}>
          <div>
            <div className="pc-caps pc-section-eyebrow" style={{ color: 'var(--pc-teal)', opacity: 0.4 }}>Heritage Registry Inquiry</div>
            <h1 className="pc-serif" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--pc-teal)' }}>
              Your <span className="pc-italic" style={{ fontWeight: 400 }}>Ledger.</span>
            </h1>
          </div>
          <p style={{ color: 'var(--pc-text-muted)', fontSize: '0.95rem', maxWidth: '400px', lineHeight: 1.8 }}>
            Review your collected properties of interest. You can submit a single unified inquiry request to the Heritage coordination desk.
          </p>
        </div>

        {formSubmitted ? (
          <div style={{ background: 'var(--pc-white)', border: '1px solid var(--pc-border)', padding: '6rem 3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto', boxShadow: 'var(--pc-shadow-premium)' }}>
            <span style={{ fontSize: '3rem', color: 'var(--pc-accent)' }}>❦</span>
            <h2 className="pc-serif" style={{ fontSize: '2.5rem', color: 'var(--pc-teal)', marginTop: '2rem', marginBottom: '1rem' }}>Ledger Dispatched</h2>
            <p style={{ color: 'var(--pc-text-muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '550px', margin: '0 auto 3rem' }}>
              Thank you, {fullName}. A dedicated Heritage Coordination Specialist has received your collection dossier. We will perform the deeds verification and contact you within one business day at <strong>{email}</strong>.
            </p>
            <a href={themeLink('/')} className="pc-btn-primary" style={{ textDecoration: 'none' }}>
              Return to global catalog
            </a>
          </div>
        ) : inquiries.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6rem', alignItems: 'start' }} className="pc-ledger-layout">
            <style dangerouslySetInnerHTML={{ __html: `
              @media (min-width: 1024px) {
                .pc-ledger-layout { grid-template-columns: 1fr 420px !important; }
              }
            ` }} />

            {/* Left Ledger Column - Collected listings */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid var(--pc-border)', paddingBottom: '1.5rem' }}>
                <span className="pc-caps" style={{ opacity: 0.5 }}>Active Registry Items ({inquiries.length})</span>
                <button 
                  onClick={handleClearRegistry}
                  style={{ background: 'transparent', border: 'none', color: 'var(--pc-accent)', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', cursor: 'pointer' }}
                >
                  Clear Collection
                </button>
              </div>

              <div className="pc-ledger-list">
                {inquiries.map((item) => (
                  <div 
                    key={item.id} 
                    className="pc-ledger-card"
                    style={{ 
                      background: 'var(--pc-white)', 
                      border: '1px solid var(--pc-border)', 
                      padding: '2.5rem', 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '2.5rem', 
                      position: 'relative' 
                    }}
                  >
                    <style dangerouslySetInnerHTML={{ __html: `
                      @media (min-width: 600px) {
                        .pc-ledger-card-inner { flex-direction: row !important; }
                      }
                    ` }} />
                    <div className="pc-ledger-card-inner" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                      {/* Image Thumbnail */}
                      <div style={{ width: '100%', maxWidth: '200px', height: '140px', border: '1px solid var(--pc-border)', overflow: 'hidden', flexShrink: 0 }}>
                        <img 
                          src={item.featured_image || '/themes/properties/classic/1.webp'} 
                          alt={item.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>

                      {/* Content details */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                          <h3 className="pc-serif" style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--pc-teal)', margin: 0 }}>
                            <a href={listingLink(item.slug)} style={{ color: 'inherit', textDecoration: 'none' }}>
                              {item.title}
                            </a>
                          </h3>
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            style={{ background: 'transparent', border: 'none', color: '#cc0000', fontSize: '1.2rem', cursor: 'pointer', opacity: 0.6 }}
                            title="Remove from Ledger"
                          >
                            ×
                          </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--pc-text-muted)', marginBottom: '1.5rem' }}>
                          <span>Region: {item.location}</span>
                          {item.year && <span>Est. {item.year}</span>}
                          {item.beds && <span>{item.beds} Beds</span>}
                          {item.area && <span>{item.area}</span>}
                        </div>

                        {/* Price display */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--pc-teal)', opacity: 0.5 }} className="pc-caps">Valuation</span>
                          <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--pc-teal)' }}>
                            {item.estimated_total || item.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rental Pricing Date Selector in Cart */}
                    {item.is_rental && (
                      <div style={{ background: 'var(--pc-bone)', border: '1px solid var(--pc-border)', padding: '2rem', marginTop: '1rem' }}>
                        <div className="pc-caps" style={{ fontSize: '0.65rem', marginBottom: '1.5rem', color: 'var(--pc-teal)', opacity: 0.5 }}>Estimated Lodging Rental Specifications</div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="pc-dates-subgrid">
                          <style dangerouslySetInnerHTML={{ __html: `
                            @media (min-width: 600px) {
                              .pc-dates-subgrid { grid-template-columns: repeat(2, 1fr) !important; }
                            }
                          ` }} />
                          <div>
                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--pc-teal)', display: 'block', marginBottom: '0.5rem' }} className="pc-caps">CHECK IN</label>
                            <input 
                              type="date" 
                              value={item.checkIn || ''} 
                              onChange={(e) => handleDateChange(item.id, 'checkIn', e.target.value)}
                              style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--pc-border)', background: 'white', fontFamily: 'var(--pc-font-body)', outline: 'none' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--pc-teal)', display: 'block', marginBottom: '0.5rem' }} className="pc-caps">CHECK OUT</label>
                            <input 
                              type="date" 
                              value={item.checkOut || ''} 
                              onChange={(e) => handleDateChange(item.id, 'checkOut', e.target.value)}
                              style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--pc-border)', background: 'white', fontFamily: 'var(--pc-font-body)', outline: 'none' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Form Column - Unified Dispatch Form */}
            <aside className="pc-inquiry-aside" style={{ position: 'sticky', top: '140px' }}>
              <div style={{ background: 'var(--pc-white)', border: '1px solid var(--pc-border)', padding: '3.5rem', boxShadow: 'var(--pc-shadow-premium)' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                  <div className="pc-caps" style={{ opacity: 0.4, marginBottom: '1rem' }}>Ledger Submission</div>
                  <h3 className="pc-serif" style={{ fontSize: '1.8rem', color: 'var(--pc-teal)', fontWeight: 900 }}>
                    Registry <span className="pc-italic" style={{ fontWeight: 400 }}>Dispatch.</span>
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--pc-text-muted)', marginTop: '0.5rem' }}>Dossier Allocation Node // 01</div>
                </div>

                <form onSubmit={handleInquirySubmit}>
                  <div className="pc-filter-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="pc-filter-label pc-caps" style={{ fontSize: '0.7rem' }}>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Audrey Hepburn"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pc-filter-input" 
                      style={{ background: 'white' }}
                    />
                  </div>

                  <div className="pc-filter-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="pc-filter-label pc-caps" style={{ fontSize: '0.7rem' }}>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="audrey@heritage.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pc-filter-input" 
                      style={{ background: 'white' }}
                    />
                  </div>

                  <div className="pc-filter-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="pc-filter-label pc-caps" style={{ fontSize: '0.7rem' }}>Contact Phone</label>
                    <input 
                      type="tel" 
                      placeholder="+44 20 7946 0958"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pc-filter-input" 
                      style={{ background: 'white' }}
                    />
                  </div>

                  <div className="pc-filter-group" style={{ marginBottom: '3rem' }}>
                    <label className="pc-filter-label pc-caps" style={{ fontSize: '0.7rem' }}>Special Coordination Mandate</label>
                    <textarea 
                      rows={5}
                      placeholder="Specify requirements, architectural provenance verification requests, or private viewing schedules..."
                      value={specialRegistryText}
                      onChange={(e) => setSpecialRegistryText(e.target.value)}
                      className="pc-filter-input" 
                      style={{ background: 'white', resize: 'none' }}
                    />
                  </div>

                  <button type="submit" className="pc-btn-primary" style={{ width: '100%', padding: '1.5rem' }}>
                    DISPATCH UNIFIED DOSSIER
                  </button>
                  {formError && (
                    <p role="alert" style={{ marginTop: '1rem', color: 'var(--pc-accent)', fontSize: '0.85rem', textAlign: 'center' }}>
                      {formError}
                    </p>
                  )}
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '3px', opacity: 0.3 }}>
                    OFFICIAL COORDINATOR DESK
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="pc-empty-state" style={{ border: '1px dashed var(--pc-border)', background: 'var(--pc-white)', maxWidth: '800px', margin: '0 auto' }}>
            <span style={{ fontSize: '2.5rem', color: 'var(--pc-teal)', opacity: 0.3 }}>❦</span>
            <h3 className="pc-serif" style={{ fontSize: '2.25rem', color: 'var(--pc-teal)', marginTop: '2rem', marginBottom: '1rem' }}>Ledger is Empty</h3>
            <p style={{ color: 'var(--pc-text-muted)', fontSize: '1rem', marginBottom: '4rem', maxWidth: '400px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
              No historic estates have been selected for active inquiry. Explore the dynamic registry catalog to build your heritage registry collection.
            </p>
            <a href={themeLink('/explore')} className="pc-btn-primary" style={{ textDecoration: 'none' }}>
              Explore the Registry
            </a>
          </div>
        )}

      </section>

    </div>
  );
}
