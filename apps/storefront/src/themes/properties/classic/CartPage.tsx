'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
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

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('sellio_classic_inquiries') || '[]');
    setInquiries(list);
    setLoading(false);
  }, []);

  const handleDateChange = async (id: number, field: 'checkIn' | 'checkOut', value: string) => {
    const updated = inquiries.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });

    setInquiries(updated);
    localStorage.setItem('sellio_classic_inquiries', JSON.stringify(updated));

    const item = updated.find(i => i.id === id);
    if (item && item.checkIn && item.checkOut) {
      try {
        let result: { total_nights: number; estimated_lodging_total: string };

        const isFallback = allowDemoCatalog && FALLBACK_ESTATE_IDS.has(item.id);
        if (isFallback) {
          const inDate = new Date(item.checkIn);
          const outDate = new Date(item.checkOut);
          const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          const priceRaw = String(item.price).replace(/[^0-9.]/g, '');
          const priceNum = Number(priceRaw) || 2500;
          result = {
            total_nights: diffDays,
            estimated_lodging_total: (priceNum * diffDays).toFixed(2),
          };
        } else {
          result = await api.calculateLodgingPrice(item.id, item.checkIn, item.checkOut);
        }

        const calculatedList = updated.map(i => {
          if (i.id === id) {
            return {
              ...i,
              estimated_total: `$${Number(result.estimated_lodging_total).toLocaleString()}`,
            };
          }
          return i;
        });
        setInquiries(calculatedList);
        localStorage.setItem('sellio_classic_inquiries', JSON.stringify(calculatedList));
      } catch (err) {
        console.warn('Failed estimating price dynamically for rental registry entry.', err);
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
    setFormSubmitted(true);
    localStorage.removeItem('sellio_classic_inquiries');
    setInquiries([]);
  };

  if (loading) {
    return (
      <div className="pc-cart-loading">
        <h2 className="pc-italic pc-cart-loading-title">Synchronizing Ledger...</h2>
        <div className="pc-cart-loading-divider" />
      </div>
    );
  }

  return (
    <div className="pc-page-shell">

      <section className="pc-section pc-section--listing">

        <div className="pc-page-header pc-page-header--bottom">
          <div>
            <div className="pc-caps pc-section-eyebrow">Heritage Registry Inquiry</div>
            <h1 className="pc-serif pc-section-title">
              Your <span className="pc-italic pc-heading-light">Ledger.</span>
            </h1>
          </div>
          <p className="pc-page-header-desc">
            Review your collected properties of interest. You can submit a single unified inquiry request to the Heritage coordination desk.
          </p>
        </div>

        {formSubmitted ? (
          <div className="pc-cart-submitted">
            <span className="pc-cart-submitted-ornament">❦</span>
            <h2 className="pc-serif pc-cart-submitted-title">Ledger Dispatched</h2>
            <p className="pc-cart-submitted-desc">
              Thank you, {fullName}. A dedicated Heritage Coordination Specialist has received your collection dossier. We will perform the deeds verification and contact you within one business day at <strong>{email}</strong>.
            </p>
            <a href={themeLink('/')} className="pc-btn-primary">
              Return to global catalog
            </a>
          </div>
        ) : inquiries.length > 0 ? (
          <div className="pc-ledger-layout">

            {/* Left Ledger Column */}
            <div>
              <div className="pc-ledger-header">
                <span className="pc-caps pc-ledger-count">Active Registry Items ({inquiries.length})</span>
                <button
                  onClick={handleClearRegistry}
                  className="pc-ledger-clear-btn"
                >
                  Clear Collection
                </button>
              </div>

              <div className="pc-ledger-list">
                {inquiries.map((item) => (
                  <div key={item.id} className="pc-ledger-card">
                    <div className="pc-ledger-card-inner">
                      {/* Image Thumbnail */}
                      <div className="pc-ledger-thumb">
                        <img
                          src={item.featured_image || '/themes/properties/classic/1.webp'}
                          alt={item.title}
                        />
                      </div>

                      {/* Content */}
                      <div className="pc-ledger-content">
                        <div className="pc-ledger-title-row">
                          <h3 className="pc-serif pc-ledger-title">
                            <a href={listingLink(item.slug)}>{item.title}</a>
                          </h3>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="pc-ledger-remove-btn"
                            title="Remove from Ledger"
                          >
                            ×
                          </button>
                        </div>

                        <div className="pc-ledger-meta">
                          <span>Region: {item.location}</span>
                          {item.year && <span>Est. {item.year}</span>}
                          {item.beds && <span>{item.beds} Beds</span>}
                          {item.area && <span>{item.area}</span>}
                        </div>

                        <div className="pc-ledger-price-row">
                          <span className="pc-caps pc-ledger-valuation-label">Valuation</span>
                          <span className="pc-ledger-price-value">
                            {item.estimated_total || item.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rental Date Selector */}
                    {item.is_rental && (
                      <div className="pc-ledger-rental-box">
                        <div className="pc-caps pc-ledger-rental-label">Estimated Lodging Rental Specifications</div>
                        <div className="pc-dates-subgrid">
                          <div>
                            <label className="pc-caps pc-cart-date-label">CHECK IN</label>
                            <input
                              type="date"
                              value={item.checkIn || ''}
                              onChange={(e) => handleDateChange(item.id, 'checkIn', e.target.value)}
                              className="pc-cart-date-input"
                            />
                          </div>
                          <div>
                            <label className="pc-caps pc-cart-date-label">CHECK OUT</label>
                            <input
                              type="date"
                              value={item.checkOut || ''}
                              onChange={(e) => handleDateChange(item.id, 'checkOut', e.target.value)}
                              className="pc-cart-date-input"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dispatch Form */}
            <aside className="pc-inquiry-aside">
              <div className="pc-inquiry-dispatch-panel">
                <div className="pc-dispatch-header">
                  <div className="pc-caps pc-dispatch-eyebrow">Ledger Submission</div>
                  <h3 className="pc-serif pc-dispatch-title">
                    Registry <span className="pc-italic pc-heading-light">Dispatch.</span>
                  </h3>
                  <div className="pc-dispatch-sublabel">Dossier Allocation Node // 01</div>
                </div>

                <form onSubmit={handleInquirySubmit} className="pc-dispatch-form">
                  <div className="pc-filter-group">
                    <label className="pc-filter-label pc-caps">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Audrey Hepburn"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pc-filter-input"
                    />
                  </div>

                  <div className="pc-filter-group">
                    <label className="pc-filter-label pc-caps">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="audrey@heritage.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pc-filter-input"
                    />
                  </div>

                  <div className="pc-filter-group">
                    <label className="pc-filter-label pc-caps">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="+44 20 7946 0958"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pc-filter-input"
                    />
                  </div>

                  <div className="pc-filter-group">
                    <label className="pc-filter-label pc-caps">Special Coordination Mandate</label>
                    <textarea
                      rows={5}
                      placeholder="Specify requirements, architectural provenance verification requests, or private viewing schedules..."
                      value={specialRegistryText}
                      onChange={(e) => setSpecialRegistryText(e.target.value)}
                      className="pc-filter-input"
                    />
                  </div>

                  <button type="submit" className="pc-btn-primary pc-dispatch-submit">
                    DISPATCH UNIFIED DOSSIER
                  </button>
                  {formError && (
                    <p role="alert" className="pc-dispatch-error">{formError}</p>
                  )}
                </form>

                <div className="pc-caps pc-dispatch-footer-label">
                  OFFICIAL COORDINATOR DESK
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="pc-empty-state pc-empty-state--centered">
            <span className="pc-empty-ornament">❦</span>
            <h3 className="pc-serif pc-empty-title">Ledger is Empty</h3>
            <p>
              No historic estates have been selected for active inquiry. Explore the dynamic registry catalog to build your heritage registry collection.
            </p>
            <a href={themeLink('/explore')} className="pc-btn-primary">
              Explore the Registry
            </a>
          </div>
        )}

      </section>

    </div>
  );
}
