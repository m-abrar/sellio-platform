'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import {
  AgentProfileCard,
  AmenityGrid,
  AvailabilityCalendar,
  DetailBreadcrumbs,
  FeatureList,
  ListingBadges,
  SidebarListingCard,
  MediaLinks,
  NeighborhoodList,
  PriceBreakdownTable,
  PropertyMapEmbed,
  RelatedStructures,
  RulesAndPolicies,
  ScoresPanel,
  StructureSpecBar,
  TagList,
} from './components';
import { useModernThemeLink } from './hooks/useModernThemeLink';
import { useDemoFallbackAllowed } from './hooks/useDemoFallbackAllowed';
import { FALLBACK_ESTATES } from './fallback-data';
import { enrichDemoDetail } from './demo-detail-enrichment';
import {
  asPropertyDetail,
  normalizeTags,
} from './property-detail-utils';
import type { PropertyBookingBlock, PropertyDetail } from './property-detail-types';
import {
  collectPropertyImages,
  getPropertyLocation,
  getPropertyPrice,
  getPropertySpecs,
} from './property-utils';

const DEMO_RENTAL_BOOKINGS: PropertyBookingBlock[] = [
  { start: '2026-06-10', end: '2026-06-18', color: '#0ea5e9' },
  { start: '2026-07-01', end: '2026-07-08', color: '#0ea5e9' },
  { start: '2026-08-15', end: '2026-08-22', color: '#0ea5e9' },
];

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const themeLink = useModernThemeLink();
  const allowDemoCatalog = useDemoFallbackAllowed();

  const [property, setProperty] = useState<Property | null>(null);
  const [detail, setDetail] = useState<PropertyDetail | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<PropertyBookingBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [estimatingPrice, setEstimatingPrice] = useState(false);
  const [estimation, setEstimation] = useState<{
    total_nights: number;
    estimated_lodging_total: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProperty() {
      setLoading(true);
      try {
        const response = await api.getPropertyDetails(slug);
        if (!isMounted) return;

        if (response?.success && response.data) {
          const loaded = asPropertyDetail(response.data);
          setProperty(response.data);
          setDetail(loaded);
          setRelated(response.related_properties || []);
          setBookings((response.bookings as PropertyBookingBlock[]) || []);
          setUseFallback(false);
        } else {
          loadFallback();
        }
      } catch (error: unknown) {
        if (!isMounted) return;
        console.error('Failed to load properties modern detail:', error);
        loadFallback();
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    function loadFallback() {
      if (!allowDemoCatalog) {
        setProperty(null);
        setDetail(null);
        setRelated([]);
        setBookings([]);
        setUseFallback(false);
        return;
      }

      const matched =
        FALLBACK_ESTATES.find((estate) => estate.slug === slug) || null;
      if (matched) {
        const loaded = enrichDemoDetail(slug, asPropertyDetail(matched));
        setProperty(matched);
        setDetail(loaded);
        setRelated(FALLBACK_ESTATES.filter((estate) => estate.slug !== slug).slice(0, 3));
        const rental =
          Boolean(matched.is_rental) ||
          matched.specs?.property_type?.toLowerCase() === 'rent';
        setBookings(rental ? DEMO_RENTAL_BOOKINGS : []);
        setUseFallback(true);
        return;
      }

      setProperty(null);
      setDetail(null);
      setRelated([]);
      setBookings([]);
      setUseFallback(false);
    }

    loadProperty();
    return () => {
      isMounted = false;
    };
  }, [slug, allowDemoCatalog]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [property?.id]);

  const isRental = Boolean(
    detail?.is_rental ||
      detail?.status &&
        typeof detail.status === 'object' &&
        detail.status.is_rental ||
      detail?.specs?.property_type?.toLowerCase() === 'rent',
  );

  useEffect(() => {
    const calculatePrice = async () => {
      if (!property || !isRental || !checkIn || !checkOut) {
        setEstimation(null);
        return;
      }

      setEstimatingPrice(true);
      try {
        if (useFallback) {
          const inDate = new Date(checkIn);
          const outDate = new Date(checkOut);
          const diffDays =
            Math.ceil(Math.abs(outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)) ||
            1;
          const nightly = Number(property.pricing?.price_per_night || 420);
          setEstimation({
            total_nights: diffDays,
            estimated_lodging_total: (nightly * diffDays).toFixed(2),
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
  }, [checkIn, checkOut, property, useFallback, isRental]);

  const validateForm = () => {
    const errors: { name?: string; email?: string } = {};
    if (!form.name.trim()) errors.name = 'Full name is required.';
    if (!form.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Enter a valid email address.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!property || !validateForm()) return;

    try {
      const stored = JSON.parse(
        localStorage.getItem('sellio_properties_modern_inquiries') || '[]',
      );
      stored.push({
        id: Date.now(),
        property_id: property.id,
        property_title: property.title,
        contact_name: form.name.trim(),
        contact_email: form.email.trim(),
        message: form.message.trim(),
        check_in: checkIn || null,
        check_out: checkOut || null,
        submitted_at: new Date().toISOString(),
      });
      localStorage.setItem('sellio_properties_modern_inquiries', JSON.stringify(stored));
      setIsSubmitted(true);
      setForm({ name: '', email: '', message: '' });
      setCheckIn('');
      setCheckOut('');
      setFormErrors({});
    } catch (error) {
      console.error('Failed to persist property inquiry:', error);
    }
  };

  if (loading) {
    return (
      <main className="pm-detail-page" aria-busy="true">
        <div className="urban-detail-back-skeleton" />
        <section className="pm-detail-bento pm-detail-bento--loading">
          <div className="pm-gallery-main pm-detail-skeleton" />
          <div className="pm-detail-glass pm-detail-skeleton" />
        </section>
      </main>
    );
  }

  if (!property || !detail) {
    return (
      <main className="pm-detail-page">
        <section className="urban-detail-state" role="status">
          <div className="urban-detail-kicker">Not found</div>
          <h1>Property could not be loaded</h1>
          <p>
            This property does not exist, or the listing API is unavailable in production mode.
          </p>
          <a href={themeLink('/')} className="urban-btn-primary">
            Back to properties
          </a>
        </section>
      </main>
    );
  }

  const images = collectPropertyImages(property);
  const activeImage = images[activeImageIndex] || images[0];
  const specs = getPropertySpecs(property);
  const tags = normalizeTags(detail);
  const amenities = detail.amenities || [];
  const features = detail.features || [];
  const scores = detail.scores || [];
  const neighborhoods = detail.neighborhoods || [];

  return (
    <main className="pm-detail-page">
      <div className="pm-detail-header">
        <DetailBreadcrumbs title={property.title} />
        <a href={themeLink('/')} className="urban-detail-back">
          &larr; Back to properties
        </a>
      </div>

      {useFallback && (
        <div className="pm-detail-demo-banner" role="status">
          Preview mode — showing sample data because the live API is unavailable.
        </div>
      )}

      <section className="pm-detail-bento">
        <div className="pm-gallery">
          <div className="pm-gallery-main">
            <img src={activeImage} alt={property.title} />
          </div>
          {images.length > 1 && (
            <div className="pm-gallery-thumbs">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`pm-gallery-thumb ${index === activeImageIndex ? 'pm-gallery-thumb--active' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <article className="pm-detail-glass">
          <ListingBadges property={detail} />
          <div className="urban-detail-kicker">{specs.category}</div>
          <h1 className="pm-detail-title">{property.title}</h1>
          <div className="urban-detail-price">{getPropertyPrice(property)}</div>
          {detail.short_description && property.description && (
            <p className="urban-detail-lede">{detail.short_description}</p>
          )}

          <StructureSpecBar
            beds={specs.beds}
            baths={specs.baths}
            area={specs.area}
            parking={specs.parking}
            year={specs.year}
          />

          <div className="urban-detail-specs">
            <div>
              <span>Location</span>
              <strong>{getPropertyLocation(property)}</strong>
            </div>
            {property.specs?.property_type && (
              <div>
                <span>Listing Type</span>
                <strong>{property.specs.property_type}</strong>
              </div>
            )}
          </div>

          <TagList tags={tags} variant="inline" />
        </article>
      </section>

      <div className="pm-detail-layout">
        <div className="pm-detail-main">
          {property.description ? (
            <section className="pm-detail-block pm-detail-description-block">
              <span className="structure-grid-kicker">Overview</span>
              <h2 className="pm-detail-block__title">About this property</h2>
              <div className="pm-detail-description__body">{property.description}</div>
            </section>
          ) : detail.short_description ? (
            <section className="pm-detail-block pm-detail-description-block">
              <span className="structure-grid-kicker">Overview</span>
              <h2 className="pm-detail-block__title">About this property</h2>
              <div className="pm-detail-description__body">{detail.short_description}</div>
            </section>
          ) : null}
          <PriceBreakdownTable property={detail} />
          <AmenityGrid amenities={amenities} />
          <FeatureList features={features} />
          {isRental && (
            <AvailabilityCalendar
              bookings={bookings}
              minimumRentalDays={detail.minimum_rental_days}
            />
          )}
          <ScoresPanel scores={scores} />
          <PropertyMapEmbed property={detail} />
          <NeighborhoodList neighborhoods={neighborhoods} />
          <RulesAndPolicies rules={detail.rules} policies={detail.policies} />
          <MediaLinks video={detail.video} virtualTour={detail.virtual_tour} />
        </div>

        <aside className="pm-detail-sidebar" aria-label="Booking summary">
          <SidebarListingCard
            property={property}
            isRental={isRental}
            estimation={estimation}
            estimatingPrice={estimatingPrice}
          />
          <AgentProfileCard
            owner={detail.owner}
            brand={detail.brand}
            isRental={isRental}
            variant="sidebar"
          />
        </aside>
      </div>

      <section
        id="pm-inquiry"
        className="pm-inquiry-section"
        aria-labelledby="pm-inquiry-title"
      >
        <div className="pm-inquiry-glass">
          <div className="pm-inquiry-intro">
            <div className="urban-detail-kicker">Contact</div>
            <h2 id="pm-inquiry-title" className="pm-inquiry-title">
              Request a viewing
            </h2>
            <p className="pm-inquiry-copy">
              Share your contact details and preferred visit times. The listing agent or host will
              confirm availability and follow up with you.
            </p>
            {isRental && estimation && (
              <div className="pm-stay-estimate" role="status">
                <span className="pm-stay-estimate__label">Stay estimate</span>
                <span className="pm-stay-estimate__value">
                  {estimatingPrice
                    ? 'Calculating rates...'
                    : `${estimation.total_nights} nights · $${Number(estimation.estimated_lodging_total).toLocaleString()}`}
                </span>
              </div>
            )}
          </div>

          <div className="pm-inquiry-form-panel">
              {isSubmitted ? (
                <div className="pm-inquiry-success" role="status">
                  <span className="pm-inquiry-success__kicker">Request sent</span>
                  <p>
                    Thank you. Your viewing request has been submitted. We will contact you using
                    the details you provided.
                  </p>
                </div>
              ) : (
                <form className="pm-inquiry-form" onSubmit={handleSubmit} noValidate>
                  {isRental && (
                    <div className="pm-date-row">
                      <label className="pm-field">
                        <span className="pm-field__label">Check-in</span>
                        <input
                          className="pm-field__input"
                          type="date"
                          value={checkIn}
                          onChange={(event) => setCheckIn(event.target.value)}
                        />
                      </label>
                      <label className="pm-field">
                        <span className="pm-field__label">Check-out</span>
                        <input
                          className="pm-field__input"
                          type="date"
                          value={checkOut}
                          onChange={(event) => setCheckOut(event.target.value)}
                        />
                      </label>
                    </div>
                  )}
                  <label className="pm-field">
                    <span className="pm-field__label">Full name</span>
                    <input
                      className="pm-field__input"
                      required
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      aria-invalid={Boolean(formErrors.name)}
                    />
                    {formErrors.name && <span className="pm-form-error">{formErrors.name}</span>}
                  </label>
                  <label className="pm-field">
                    <span className="pm-field__label">Email</span>
                    <input
                      className="pm-field__input"
                      required
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      aria-invalid={Boolean(formErrors.email)}
                    />
                    {formErrors.email && <span className="pm-form-error">{formErrors.email}</span>}
                  </label>
                  <label className="pm-field">
                    <span className="pm-field__label">Message</span>
                    <textarea
                      className="pm-field__textarea"
                      rows={4}
                      placeholder="Preferred tour times, access requirements, or questions about this property."
                      value={form.message}
                      onChange={(event) => setForm({ ...form, message: event.target.value })}
                    />
                  </label>
                  <button className="urban-btn-primary pm-inquiry-submit" type="submit">
                    Send inquiry
                  </button>
                </form>
              )}
          </div>
        </div>
      </section>

      <RelatedStructures properties={related} />
    </main>
  );
}
