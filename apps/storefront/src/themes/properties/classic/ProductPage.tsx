'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { EstateCard } from './components';
import { NeighborhoodStats } from './components/NeighborhoodStats';
import { FALLBACK_ESTATES } from './fallback-data';
import { redirectToPropertyBookingReserve } from '@/themes/properties/shared/property-booking-utils';
import { submitPropertyInquiry } from '@/themes/properties/shared/submit-property-inquiry';
import { useClassicThemeLink } from './hooks/useClassicThemeLink';
import { useDemoFallbackAllowed } from './hooks/useDemoFallbackAllowed';

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useClassicThemeLink();
  const allowDemoCatalog = useDemoFallbackAllowed();
  const [property, setProperty] = useState<Property | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [estimatingPrice, setEstimatingPrice] = useState(false);
  const [estimation, setEstimation] = useState<{ total_nights: number; estimated_lodging_total: string } | null>(null);
  const [inquiryAdded, setInquiryAdded] = useState(false);
  const [collectNotice, setCollectNotice] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const response = await api.getPropertyDetails(slug);
        if (response && response.success && response.data) {
          setProperty(response.data);
          setRelated(response.related_properties || []);
          setUseFallback(false);
        } else {
          loadFallback();
        }
      } catch {
        loadFallback();
      } finally {
        setLoading(false);
      }
    };

    const loadFallback = () => {
      if (!allowDemoCatalog) {
        setProperty(null);
        setRelated([]);
        setUseFallback(false);
        return;
      }

      const matched = FALLBACK_ESTATES.find((estate) => estate.slug === slug);
      if (matched) {
        setProperty(matched);
        setRelated(FALLBACK_ESTATES.filter((estate) => estate.slug !== slug).slice(0, 3));
        setUseFallback(true);
        return;
      }

      setProperty(null);
      setRelated([]);
      setUseFallback(false);
    };

    loadDetails();
  }, [slug, allowDemoCatalog]);

  useEffect(() => {
    const calculatePrice = async () => {
      if (!property || !checkIn || !checkOut) return;
      setEstimatingPrice(true);
      try {
        if (useFallback) {
          const inDate = new Date(checkIn);
          const outDate = new Date(checkOut);
          const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          const pricePerNight = Number(property.price_per_night || 2500);
          setEstimation({
            total_nights: diffDays,
            estimated_lodging_total: (pricePerNight * diffDays).toFixed(2),
          });
        } else {
          const result = await api.calculateLodgingPrice(property.id, checkIn, checkOut);
          setEstimation(result);
        }
      } catch {
        setEstimation(null);
      } finally {
        setEstimatingPrice(false);
      }
    };
    calculatePrice();
  }, [checkIn, checkOut, property, useFallback]);

  useEffect(() => {
    if (!property) return;
    const currentList = JSON.parse(localStorage.getItem('sellio_classic_inquiries') || '[]');
    const exists = currentList.some((item: { id: number }) => item.id === property.id);
    setInquiryAdded(exists);
  }, [property]);

  const handleAddToRegistry = () => {
    if (!property) return;
    const currentList = JSON.parse(localStorage.getItem('sellio_classic_inquiries') || '[]');

    if (!currentList.some((item: { id: number }) => item.id === property.id)) {
      const updatedList = [
        ...currentList,
        {
          id: property.id,
          title: property.title,
          slug: property.slug,
          featured_image: property.featured_image || property.thumbnail_image,
          location: property.location?.title || property.city,
          price: property.pricing?.price_formatted || property.base_price,
          year: property.specs?.year_built || property.year_built,
          beds: property.specs?.bedrooms ?? property.number_of_bedrooms,
          baths: property.specs?.bathrooms ?? property.number_of_bathrooms,
          area: property.specs?.area_formatted || `${property.area_sq_ft} SQFT`,
          is_rental: property.is_rental,
          checkIn,
          checkOut,
          guests,
        },
      ];
      localStorage.setItem('sellio_classic_inquiries', JSON.stringify(updatedList));
      setInquiryAdded(true);
      setCollectNotice(true);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !fullName || !email) return;

    setSubmitError(null);

    const isRentalListing = property.is_rental || property.status?.is_rental;

    if (isRentalListing && checkIn && checkOut) {
      if (useFallback) {
        setSubmitError('Live booking requires the property API. Demo listings cannot reserve dates.');
        return;
      }

      redirectToPropertyBookingReserve(themeLink, {
        propertyId: property.id,
        checkIn,
        checkOut,
        guests: Number(guests) || 2,
        fullName,
        email,
        message: message.trim() || undefined,
      });
      return;
    }

    setIsSubmitting(true);

    const result = await submitPropertyInquiry({
      propertyId: property.id,
      useFallback,
      storageKey: 'sellio_classic_inquiries',
      fullName,
      email,
      message: message.trim() || undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      demoRecord: {
        id: Date.now(),
        property_id: property.id,
        property_title: property.title,
        contact_name: fullName,
        contact_email: email,
        message,
        check_in: checkIn || null,
        check_out: checkOut || null,
        submitted_at: new Date().toISOString(),
      },
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    setInquirySubmitted(true);
    setFullName('');
    setEmail('');
    setMessage('');
    setCheckIn('');
    setCheckOut('');
  };

  if (loading) {
    return (
      <div className="pc-listing-page">
        <div className="pc-listing-loading">
          <h2 className="pc-listing-loading__title pc-italic">Retrieving Provenance...</h2>
          <div className="pc-listing-loading__rule" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pc-listing-page pc-page-shell">
        <div className="pc-listing-not-found pc-empty-state">
          <h2 className="pc-serif">Estate Not Found</h2>
          <p>The requested listing could not be found in the Global Heritage Registry.</p>
          <a href={themeLink('/')} className="pc-btn-primary">
            Return to Registry Homepage
          </a>
        </div>
      </div>
    );
  }

  const isRental = property.is_rental || property.status?.is_rental;
  const displayTitle = property.title;
  const displayPrice =
    property.pricing?.price_formatted ||
    (property.base_price ? `$${Number(property.base_price).toLocaleString()}` : '$1,000,000');
  const displayLocation = property.location?.title
    ? `${property.location.title}, ${property.location.country || ''}`
    : property.city && property.country
      ? `${property.city}, ${property.country}`
      : 'Global Registry';
  const displayYear = property.specs?.year_built || property.year_built || '1800';
  const displayImage = property.featured_image || property.thumbnail_image || '/themes/properties/classic/1.webp';

  const beds = property.specs?.bedrooms ?? property.number_of_bedrooms ?? 4;
  const baths = property.specs?.bathrooms ?? property.number_of_bathrooms ?? 3;
  const area =
    property.specs?.area_formatted ||
    (property.area_sq_ft ? `${property.area_sq_ft.toLocaleString()} SQFT` : '4,200 SQFT');
  const guestsCount = property.specs?.max_guests ?? property.maximum_guests ?? 4;
  const parking = property.specs?.parking_spots ?? property.number_of_parking_spots ?? 2;
  const categoryName = property.specs?.category || property.category?.title || 'Heritage Listing';
  const listingType = isRental ? 'Seasonal Rental' : property.is_sale ? 'Estate Sale' : 'Heritage Listing';

  const specs = [
    { label: 'Bedrooms', value: `${beds} Rooms` },
    { label: 'Bathrooms', value: `${baths} Baths` },
    { label: 'Total Area', value: area },
    { label: 'Guests Max', value: `${guestsCount} Guests` },
    { label: 'Parking', value: `${parking} Spots` },
    { label: 'HOA Fees', value: property.hoa ? `$${property.hoa}/mo` : 'Included' },
  ];

  return (
    <div className="pc-listing-page">
      <section className="pc-product-hero-container" aria-label={`${displayTitle} hero`}>
        <div className="pc-product-hero-media">
          <img src={displayImage} alt={displayTitle} />
        </div>
        <div className="pc-product-hero-scrim" aria-hidden="true" />

        <div className="pc-product-hero-overlay">
          <div>
            <nav className="pc-listing-crumb" aria-label="Breadcrumb">
              <a href={themeLink('/')}>Registry</a>
              <span className="pc-listing-crumb__sep" aria-hidden="true">
                /
              </span>
              <a href={themeLink('/explore')}>Catalogue</a>
              <span className="pc-listing-crumb__sep" aria-hidden="true">
                /
              </span>
              <span className="pc-listing-crumb__current">{displayTitle}</span>
            </nav>

            <div className="pc-listing-hero-meta">
              <span className="pc-caps pc-listing-hero-meta__tag">{categoryName}</span>
              <span className="pc-listing-hero-meta__rule" aria-hidden="true" />
              <span className="pc-caps pc-listing-hero-meta__tag">Est. {displayYear}</span>
            </div>

            <h1 className="pc-listing-hero-title">{displayTitle}</h1>
          </div>

          <div className="pc-listing-hero-price">
            <div className="pc-caps pc-listing-hero-price__label">Valuation</div>
            <div className="pc-listing-hero-price__value">{displayPrice}</div>
          </div>
        </div>
      </section>

      <div className="pc-listing-meta-shell">
        <div className="pc-listing-meta-bar" role="list">
        <div className="pc-listing-meta-bar__item" role="listitem">
          <span className="pc-caps pc-listing-meta-bar__label">Location</span>
          <span className="pc-listing-meta-bar__value">{displayLocation}</span>
        </div>
        <div className="pc-listing-meta-bar__item" role="listitem">
          <span className="pc-caps pc-listing-meta-bar__label">Listing Type</span>
          <span className="pc-listing-meta-bar__value">{listingType}</span>
        </div>
        <div className="pc-listing-meta-bar__item" role="listitem">
          <span className="pc-caps pc-listing-meta-bar__label">Accommodation</span>
          <span className="pc-listing-meta-bar__value">
            {beds} Bed · {baths} Bath
          </span>
        </div>
        <div className="pc-listing-meta-bar__item" role="listitem">
          <span className="pc-caps pc-listing-meta-bar__label">Total Area</span>
          <span className="pc-listing-meta-bar__value">{area}</span>
        </div>
        </div>
      </div>

      <section className="pc-section pc-product-detail-section">
        <div className="pc-details-grid">
          <div className="pc-listing-content">
            <article className="pc-prose-block">
              <div className="pc-caps pc-section-eyebrow">Historic Account</div>
              <h2 className="pc-listing-prose-title">
                Provenance <span className="pc-italic">Overview.</span>
              </h2>
              <p className="pc-listing-prose-body">{property.description}</p>
            </article>

            <div className="pc-prose-block">
              <div className="pc-caps pc-section-eyebrow">Architectural Registry</div>
              <div className="pc-specs-subgrid">
                {specs.map((spec) => (
                  <div key={spec.label} className="pc-spec-card">
                    <div className="pc-caps pc-spec-card__label">{spec.label}</div>
                    <div className="pc-spec-card__value">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <NeighborhoodStats property={property} />

            {property.amenities && property.amenities.length > 0 && (
              <div className="pc-prose-block">
                <div className="pc-caps pc-section-eyebrow">Luxury Amenities</div>
                <div className="pc-amenity-list">
                  {property.amenities.map((amenity) => (
                    <span key={amenity.id} className="pc-amenity-tag">
                      {amenity.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {property.features && property.features.length > 0 && (
              <div className="pc-prose-block">
                <div className="pc-caps pc-section-eyebrow">Unique Fealty Features</div>
                <div className="pc-feats-grid">
                  {property.features.map((feature) => (
                    <div key={feature.id} className="pc-feature-item">
                      <span className="pc-feature-item__mark" aria-hidden="true">
                        ◆
                      </span>
                      <span>
                        {feature.title}
                        {feature.pivot?.value ? `: ${feature.pivot.value}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.gallery && property.gallery.length > 0 && (
              <div className="pc-prose-block">
                <div className="pc-caps pc-section-eyebrow">Provenance Gallery</div>
                <div className="pc-gallery-grid">
                  {property.gallery.map((img: string, idx: number) => (
                    <div key={idx} className="pc-gallery-item">
                      <img src={img} alt={`${displayTitle} gallery ${idx + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="pc-inquiry-panel" aria-label="Inquiry desk">
            <div className="pc-inquiry-card">
              <header className="pc-inquiry-card__header">
                <div className="pc-caps pc-section-eyebrow">Inquiry Desk</div>
                <h3 className="pc-inquiry-card__title">
                  Manorial <span className="pc-italic">Inquiry.</span>
                </h3>
                <p className="pc-inquiry-card__location">{displayLocation}</p>
              </header>

              {collectNotice && (
                <p className="pc-inquiry-notice" role="status">
                  Estate added to your Heritage Collection.{' '}
                  <a href={themeLink('/cart')}>View inquiry ledger →</a>
                </p>
              )}

              <button
                type="button"
                onClick={handleAddToRegistry}
                className={`pc-btn-primary pc-inquiry-collect-btn${inquiryAdded ? ' is-collected' : ''}`}
                disabled={inquiryAdded}
              >
                {inquiryAdded ? '✓ Added to Heritage Collection' : 'Collect for Inquiry'}
              </button>

              <div className="pc-inquiry-divider">
                <span className="pc-inquiry-divider__line" aria-hidden="true" />
                <span className="pc-inquiry-divider__label">Or submit inquiry</span>
                <span className="pc-inquiry-divider__line" aria-hidden="true" />
              </div>

              {inquirySubmitted && (
                <p className="pc-inquiry-notice pc-inquiry-notice--success" role="status">
                  Thank you. A Heritage Coordinator will contact you shortly.
                </p>
              )}

              <form className="pc-inquiry-form" onSubmit={handleInquirySubmit}>
                {submitError && (
                  <p className="pc-inquiry-notice" role="alert">{submitError}</p>
                )}
                {isRental && (
                  <div className="pc-inquiry-rental-box">
                    <div className="pc-caps pc-inquiry-rental-box__title">Estimated Lodging Rental</div>
                    <div className="pc-inquiry-fields">
                      <div className="pc-filter-group">
                        <label className="pc-filter-label pc-caps" htmlFor="pc-check-in-date">Check In Date</label>
                        <input
                          id="pc-check-in-date"
                          type="date"
                          required
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                        />
                      </div>
                      <div className="pc-filter-group">
                        <label className="pc-filter-label pc-caps" htmlFor="pc-check-out-date">Check Out Date</label>
                        <input
                          id="pc-check-out-date"
                          type="date"
                          required
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                        />
                      </div>
                      <div className="pc-filter-group">
                        <label className="pc-filter-label pc-caps" htmlFor="pc-patron-guests">Patron Guests</label>
                        <select id="pc-patron-guests" value={guests} onChange={(e) => setGuests(e.target.value)}>
                          {[...Array(guestsCount)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} Patron{i > 0 ? 's' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {checkIn && checkOut && (
                      <div className="pc-inquiry-estimate">
                        {estimatingPrice ? (
                          <span className="pc-inquiry-estimate__nights">Calculating rates…</span>
                        ) : estimation ? (
                          <>
                            <span className="pc-inquiry-estimate__nights">
                              {estimation.total_nights} Nights Rental
                            </span>
                            <span className="pc-inquiry-estimate__total">
                              ${Number(estimation.estimated_lodging_total).toLocaleString()}
                            </span>
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                )}

                <div className="pc-filter-group">
                  <label className="pc-filter-label pc-caps" htmlFor="pc-inquiry-name">Full Name</label>
                  <input
                    id="pc-inquiry-name"
                    type="text"
                    required
                    placeholder="Grace Bennett"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pc-filter-input"
                  />
                </div>

                <div className="pc-filter-group">
                  <label className="pc-filter-label pc-caps" htmlFor="pc-inquiry-email">Email Address</label>
                  <input
                    id="pc-inquiry-email"
                    type="email"
                    required
                    placeholder="grace@pemberley.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pc-filter-input"
                  />
                </div>

                <div className="pc-filter-group">
                  <label className="pc-filter-label pc-caps" htmlFor="pc-inquiry-message">Message</label>
                  <textarea
                    id="pc-inquiry-message"
                    rows={4}
                    placeholder="Inquire on architectural provenance and deed allocation details..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="pc-filter-input pc-filter-textarea"
                  />
                </div>

                <button type="submit" className="pc-btn-primary pc-inquiry-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Dispatch Direct Inquiry'}
                </button>
              </form>

              <footer className="pc-inquiry-card__footer">Heritage Coordination Desk</footer>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="pc-related-section" aria-label="Related listings">
          <div className="pc-testimonials-heading">
            <div className="pc-caps pc-section-eyebrow">Heritage Affiliations</div>
            <h2 className="pc-section-title">
              Related <span className="pc-italic">Provenance.</span>
            </h2>
          </div>

          <div className="pc-estate-grid">
            {related.map((relatedProperty) => (
              <EstateCard key={relatedProperty.id} property={relatedProperty} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
