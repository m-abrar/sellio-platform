'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { redirectToPropertyBookingReserve } from '@/themes/properties/shared/property-booking-utils';
import { submitPropertyInquiry } from '@/themes/properties/shared/submit-property-inquiry';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import { LUXURY_FALLBACK_ESTATES } from './fallback-data';

interface ProductPageProps {
  slug: string;
}

interface RelatedCardProps {
  title: string;
  price: string;
  location: string;
  tag: string;
  image: string;
  slug: string;
}

const RelatedCard = ({ title, price, location, tag, image, slug }: RelatedCardProps) => {
  const themeLink = usePropertyThemeLink();
  return (
    <a href={themeLink(`/product/${slug}`)} className="estate-card-premium estate-card-link">
      <div className="estate-card-img-overflow">
        <img src={image} alt={title} className="estate-card-img" loading="lazy" />
      </div>
      <div className="estate-card-info">
        <span className="estate-card-tag">{tag}</span>
        <h3 className="estate-card-title pl-related-card-title">{title}</h3>
        <div className="estate-card-meta">
          <span className="estate-card-price">{price}</span>
          <span className="estate-card-location">{location.toUpperCase()}</span>
        </div>
      </div>
    </a>
  );
};

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = usePropertyThemeLink();
  const [property, setProperty] = useState<Property | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [estimatingPrice, setEstimatingPrice] = useState(false);
  const [estimation, setEstimation] = useState<{ total_nights: number; estimated_lodging_total: string } | null>(null);
  const [inquiryAdded, setInquiryAdded] = useState(false);
  const [registryFeedback, setRegistryFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [inquiryDispatched, setInquiryDispatched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadFallback = () => {
      const matched = LUXURY_FALLBACK_ESTATES.find((e) => e.slug === slug);
      if (matched) {
        setProperty(matched);
        setRelated(LUXURY_FALLBACK_ESTATES.filter((e) => e.slug !== slug).slice(0, 2));
      } else {
        setProperty(LUXURY_FALLBACK_ESTATES[0] ?? null);
        setRelated(LUXURY_FALLBACK_ESTATES.slice(1, 3));
      }
      setUseFallback(true);
    };

    const loadDetails = async () => {
      setLoading(true);
      try {
        const response = await api.getPropertyDetails(slug);
        if (response?.success && response.data) {
          setProperty(response.data);
          setRelated(response.related_properties || []);
          setUseFallback(false);
          setApiError(null);
        } else {
          setApiError('Database returned unsuccessful details payload. Using fallback.');
          loadFallback();
        }
      } catch (err: unknown) {
        setApiError(err instanceof Error ? err.message : String(err));
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [slug]);

  useEffect(() => {
    const calculatePrice = async () => {
      if (!property || !checkIn || !checkOut) return;
      setEstimatingPrice(true);
      try {
        if (useFallback) {
          const inDate = new Date(checkIn);
          const outDate = new Date(checkOut);
          const diffDays = Math.max(1, Math.ceil(Math.abs(outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
          const basePriceVal = Number(property.pricing?.base_price || property.base_price || 25000);
          setEstimation({ total_nights: diffDays, estimated_lodging_total: (basePriceVal * 0.001 * diffDays).toFixed(2) });
        } else {
          const result = await api.calculateLodgingPrice(property.id, checkIn, checkOut);
          setEstimation(result);
        }
      } catch (err) {
        console.warn('Calculation of seasonal rates failed.', err);
      } finally {
        setEstimatingPrice(false);
      }
    };
    calculatePrice();
  }, [checkIn, checkOut, property, useFallback]);

  useEffect(() => {
    if (!property) return;
    const currentList: { id: number }[] = JSON.parse(localStorage.getItem('sellio_luxury_inquiries') || '[]');
    setInquiryAdded(currentList.some((item) => item.id === property.id));
  }, [property]);

  const handleAddToRegistry = () => {
    if (!property) return;
    const currentList: { id: number }[] = JSON.parse(localStorage.getItem('sellio_luxury_inquiries') || '[]');
    if (!currentList.some((item) => item.id === property.id)) {
      const updatedList = [...currentList, {
        id: property.id, title: property.title, slug: property.slug,
        featured_image: property.featured_image || property.thumbnail_image,
        location: property.location?.title || property.city,
        price: property.pricing?.price_formatted || property.base_price,
        beds: property.specs?.bedrooms ?? property.number_of_bedrooms,
        baths: property.specs?.bathrooms ?? property.number_of_bathrooms,
        area: property.specs?.area_formatted || `${property.area_sq_ft} SQFT`,
      }];
      localStorage.setItem('sellio_luxury_inquiries', JSON.stringify(updatedList));
      setInquiryAdded(true);
      setRegistryFeedback('Estate collected successfully for direct coordination.');
    } else {
      const updatedList = currentList.filter((item) => item.id !== property.id);
      localStorage.setItem('sellio_luxury_inquiries', JSON.stringify(updatedList));
      setInquiryAdded(false);
      setRegistryFeedback('Estate removed from your Heritage collection.');
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !fullName || !email) {
      setFormError('Please complete the required details before dispatch.');
      return;
    }
    setFormError(null);

    const isRentalListing = property.is_rental || property.status === 'rental';
    if (isRentalListing && checkIn && checkOut) {
      if (useFallback) {
        setFormError('Live booking requires the property API. Demo listings cannot reserve dates.');
        return;
      }
      redirectToPropertyBookingReserve(themeLink, {
        propertyId: property.id, checkIn, checkOut,
        guests: Number(guests) || 2, fullName, email,
        message: message.trim() || undefined,
      });
      return;
    }

    setIsSubmitting(true);
    const result = await submitPropertyInquiry({
      propertyId: property.id, useFallback,
      storageKey: 'sellio_luxury_inquiries',
      fullName, email, message: message.trim() || undefined,
      checkIn: checkIn || undefined, checkOut: checkOut || undefined,
      demoRecord: {
        id: Date.now(), property_id: property.id, property_title: property.title,
        contact_name: fullName, contact_email: email, message,
        check_in: checkIn || null, check_out: checkOut || null,
        submitted_at: new Date().toISOString(),
      },
    });
    setIsSubmitting(false);

    if (!result.ok) { setFormError(result.error); return; }

    setInquiryDispatched(true);
    setFullName(''); setEmail(''); setMessage(''); setCheckIn(''); setCheckOut('');
  };

  if (loading) {
    return (
      <div className="pl-loading-state">
        <h2 className="pl-loading-title">Decoding Provenance Ledgers...</h2>
        <div className="pl-loading-divider" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pl-notfound-state">
        <h2 className="pl-notfound-title">Estate Not Found</h2>
        <p className="pl-notfound-body">The requested listing signature could not be matched with the Global Heritage Catalog.</p>
        <a href={themeLink('/')} className="luxury-btn-primary">Return to Homepage</a>
      </div>
    );
  }

  const isRental = property.is_rental || property.status === 'rental';
  const displayTitle = property.title;
  const displayPrice = property.pricing?.price_formatted || (property.base_price ? `$${Number(property.base_price).toLocaleString()}` : '$1,000,000');
  const displayLocation = property.location?.title
    ? `${property.location.title}, ${property.location.country || ''}`
    : (property.city && property.country ? `${property.city}, ${property.country}` : 'Global Registry');
  const displayYear = property.specs?.year_built || property.year_built || '1815';
  const displayImage = property.featured_image || property.primary_image_url || '/themes/properties/luxury/3.webp';

  const beds = property.specs?.bedrooms ?? property.number_of_bedrooms ?? 5;
  const baths = property.specs?.bathrooms ?? property.number_of_bathrooms ?? 4;
  const area = property.specs?.area_formatted || (property.area_sq_ft ? `${property.area_sq_ft.toLocaleString()} SQFT` : '8,500 SQFT');
  const guestsCount = property.specs?.max_guests ?? property.maximum_guests ?? 8;
  const parking = property.specs?.parking_spots ?? property.number_of_parking_spots ?? 3;
  const categoryName = property.specs?.category || property.category?.title || 'Signature Estate';

  const specs = [
    { label: 'BEDROOMS', value: `${beds} Rooms` },
    { label: 'BATHROOMS', value: `${baths} Baths` },
    { label: 'TOTAL AREA', value: area },
    { label: 'MAX OCCUPANCY', value: `${guestsCount} Guests` },
    { label: 'PARKING DESK', value: `${parking} Spots` },
    { label: 'HOA DUES', value: property.hoa ? `$${property.hoa}/mo` : 'Included' },
  ];

  return (
    <div className="luxury-premium-wrapper">

      {/* Hero */}
      <section className="pl-hero">
        <div className="pl-hero-overlay">
          <img src={displayImage} alt={displayTitle} />
        </div>
        <div className="pl-hero-gradient" />
        <div className="pl-hero-content-bar">
          <div>
            <div className="pl-hero-meta">
              <span className="pl-hero-category">{categoryName.toUpperCase()}</span>
              <div className="pl-hero-divider" aria-hidden="true" />
              <span className="pl-hero-year">EST. {displayYear}</span>
            </div>
            <h1 className="pl-hero-title">{displayTitle}</h1>
          </div>
          <div className="pl-hero-price-card" aria-label={`Acquisition valuation: ${displayPrice}`}>
            <span className="pl-hero-price-label">ACQUISITION_VALUATION</span>
            <div className="pl-hero-price-value">{displayPrice}</div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="pl-details-section">

        {useFallback && apiError && (
          <div className="pl-api-alert" role="alert">
            <span className="pl-api-alert-title">System Provenance Connection Alert</span>
            <p className="pl-api-alert-body">
              This listing is running in <strong>Offline Provenance Fallback Mode</strong> due to database connections trace error.
            </p>
            <div className="pl-api-alert-trace">{apiError}</div>
          </div>
        )}

        <div className="luxury-details-container">

          {/* Left: descriptions & specs */}
          <div>

            {/* Provenance */}
            <div className="pl-section-block">
              <span className="pl-section-label">HISTORIC_ACCOUNT</span>
              <h2 className="pl-provenance-title">
                Provenance &amp; <em>Narrative.</em>
              </h2>
              <div className="pl-provenance-body">{property.description}</div>
            </div>

            {/* Architectural registry */}
            <div className="pl-section-block">
              <span className="pl-section-label">ARCHITECTURAL_REGISTRY</span>
              <div className="luxury-spec-grid">
                {specs.map((s) => (
                  <div key={s.label} className="luxury-spec-tile">
                    <div className="pl-spec-label">{s.label}</div>
                    <div className="pl-spec-value">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="pl-section-block">
                <span className="pl-section-label">PREMIUM_AMENITIES</span>
                <div className="pl-amenity-chips">
                  {property.amenities.map((a) => (
                    <div key={a.id} className="pl-amenity-chip">❦ {a.title.toUpperCase()}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="pl-section-block">
                <span className="pl-section-label">FEALTY_SPECIFICATIONS</span>
                <div className="pc-feats-grid">
                  {property.features.map((f) => (
                    <div key={f.id} className="pl-feature-item">
                      <span className="pl-feature-icon" aria-hidden="true">❖</span>
                      <span>{f.title}{f.pivot?.value ? `: ${f.pivot.value}` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {property.gallery && property.gallery.length > 0 && (
              <div>
                <span className="pl-section-label">PROVENANCE_VISUAL_LEDGER</span>
                <div className="luxury-gallery-grid">
                  {property.gallery.map((img: string, idx: number) => (
                    <div key={idx} className="luxury-gallery-img-wrapper">
                      <img src={img} alt={`${displayTitle} — gallery photo ${idx + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: inquiry card */}
          <aside>
            <div className="luxury-inquiry-card">

              <div className="pl-inquiry-header">
                <span className="pl-inquiry-desk-label">CONCIERGE_DESK</span>
                <h3 className="luxury-inquiry-title">
                  Manorial <span>Inquiry.</span>
                </h3>
                <span className="pl-inquiry-location">{displayLocation.toUpperCase()}</span>
              </div>

              <button
                onClick={handleAddToRegistry}
                className={`pl-registry-btn${inquiryAdded ? ' pl-registry-btn-active' : ''}`}
              >
                {inquiryAdded ? '✓ ADDED TO HERITAGE REGISTRY' : '❦ COLLECT FOR DIRECT INQUIRY'}
              </button>
              {registryFeedback && (
                <p role="status" className="pl-registry-feedback">{registryFeedback}</p>
              )}

              <div className="pl-inquiry-divider">
                <div className="pl-inquiry-divider-line" aria-hidden="true" />
                <span className="pl-inquiry-divider-text">OR DISPATCH COORDINATION</span>
                <div className="pl-inquiry-divider-line" aria-hidden="true" />
              </div>

              {inquiryDispatched ? (
                <div role="status" className="pl-inquiry-success">
                  <span className="pl-inquiry-success-icon" aria-hidden="true">✦</span>
                  <p className="pl-inquiry-success-body">
                    An Estate Heritage Coordinator has been notified. We will verify architectural provenance and contact you shortly.
                  </p>
                  <button
                    type="button"
                    className="luxury-btn-primary pl-form-submit"
                    onClick={() => setInquiryDispatched(false)}
                  >
                    DISPATCH ANOTHER INQUIRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit}>

                  {isRental && (
                    <div className="pl-estimator-block">
                      <span className="pl-estimator-label">LODGING_RENTAL_ESTIMATOR</span>
                      <div className="pl-estimator-fields">
                        <div>
                          <label className="pl-form-label" htmlFor="pl-check-in">CHECK IN DATE</label>
                          <input
                            id="pl-check-in"
                            type="date"
                            required
                            className="pl-estimator-input"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="pl-form-label" htmlFor="pl-check-out">CHECK OUT DATE</label>
                          <input
                            id="pl-check-out"
                            type="date"
                            required
                            className="pl-estimator-input"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="pl-form-label" htmlFor="pl-patron-count">PATRON COUNT</label>
                          <select
                            id="pl-patron-count"
                            className="pl-estimator-input pl-estimator-select"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                          >
                            {Array.from({ length: guestsCount }, (_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1} Patron{i > 0 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {checkIn && checkOut && (
                        <div className="pl-estimator-result">
                          {estimatingPrice ? (
                            <span className="pl-estimator-calculating">Calculating Manorial Seasonal Rates...</span>
                          ) : estimation ? (
                            <>
                              <span className="pl-estimator-result-nights">{estimation.total_nights} NIGHTS LODGING</span>
                              <span className="pl-estimator-result-price">${Number(estimation.estimated_lodging_total).toLocaleString()}</span>
                            </>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pl-form-field">
                    <label className="pl-form-label" htmlFor="pl-full-name">FULL NAME</label>
                    <input
                      id="pl-full-name"
                      type="text"
                      required
                      placeholder="Grace Bennett"
                      className="pl-form-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="pl-form-field">
                    <label className="pl-form-label" htmlFor="pl-email">EMAIL ADDRESS</label>
                    <input
                      id="pl-email"
                      type="email"
                      required
                      placeholder="grace@pemberley.com"
                      className="pl-form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="pl-form-field">
                    <label className="pl-form-label" htmlFor="pl-message">PATRON MESSAGE</label>
                    <textarea
                      id="pl-message"
                      rows={4}
                      placeholder="Inquire on structural provenance, dynamic title registry, or manorial deeds allocation..."
                      className="pl-form-input pl-form-textarea"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="luxury-btn-primary pl-form-submit"
                    disabled={isSubmitting}
                  >
                    DISPATCH DIRECT INQUIRY
                  </button>
                  {formError && (
                    <p role="alert" className="pl-form-error">{formError}</p>
                  )}
                </form>
              )}

              <div className="pl-inquiry-footer-note">HERITAGE_COORDINATION_DESK</div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related affiliations */}
      {related && related.length > 0 && (
        <section className="pl-related-section">
          <div className="pl-related-inner">
            <div className="pl-related-header">
              <span className="pl-section-label">HERITAGE_AFFILIATIONS</span>
              <h3 className="pl-related-title">
                Related <em>Provenance.</em>
              </h3>
            </div>
            <div className="showcase-grid">
              {related.map((estate, idx) => {
                const price = estate.pricing?.price_formatted || (estate.base_price ? `$${Number(estate.base_price).toLocaleString()}` : '');
                const loc = estate.location?.title || estate.city || 'Exclusive Location';
                const tag = estate.is_featured ? 'FEATURED' : 'SIGNATURE';
                const image = estate.featured_image || estate.primary_image_url || '/themes/properties/luxury/3.webp';
                return (
                  <RelatedCard
                    key={estate.id || idx}
                    title={estate.title}
                    price={price}
                    location={loc}
                    tag={tag}
                    image={image}
                    slug={estate.slug}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
