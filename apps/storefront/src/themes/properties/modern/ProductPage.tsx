'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { useClientReady } from '@/hooks/useClientReady';
import {
  DetailPageHeader,
  ProductDetailHero,
  ProductDetailLoadingShell,
  ProductDetailMain,
  ProductInquirySection,
  RelatedStructures,
  RentalDetailSidebar,
  SaleDetailSidebar,
} from './components';
import { useModernThemeLink } from './hooks/useModernThemeLink';
import { useDemoFallbackAllowed } from './hooks/useDemoFallbackAllowed';
import { FALLBACK_ESTATES } from './fallback-data';
import { enrichDemoDetail } from './demo-detail-enrichment';
import { getListingMode } from './listing-mode';
import { asPropertyDetail, normalizeTags } from './property-detail-utils';
import type { PropertyBookingBlock, PropertyDetail } from './property-detail-types';
import { collectPropertyImages, getPropertySpecs } from './property-utils';

const DEMO_RENTAL_BOOKINGS: PropertyBookingBlock[] = [
  { start: '2026-06-10', end: '2026-06-18', color: '#0ea5e9' },
  { start: '2026-07-01', end: '2026-07-08', color: '#0ea5e9' },
  { start: '2026-08-15', end: '2026-08-22', color: '#0ea5e9' },
];

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const clientReady = useClientReady();
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

  const listingMode = detail ? getListingMode(detail) : 'sale';
  const isRental = listingMode === 'rental';

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
        listing_mode: listingMode,
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

  if (!clientReady || loading) {
    return <ProductDetailLoadingShell />;
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
  const specs = getPropertySpecs(property);
  const tags = normalizeTags(detail);

  return (
    <main className={`pm-detail-page pm-detail-page--${listingMode}`}>
      <DetailPageHeader title={property.title} />

      {useFallback && (
        <div className="pm-detail-demo-banner" role="status">
          Preview mode — showing sample data because the live API is unavailable.
        </div>
      )}

      <ProductDetailHero
        property={property}
        detail={detail}
        listingMode={listingMode}
        images={images}
        activeImageIndex={activeImageIndex}
        onSelectImage={setActiveImageIndex}
        specs={specs}
        tags={tags}
      />

      <div className={`pm-detail-layout pm-detail-layout--${listingMode}`}>
        <ProductDetailMain
          listingMode={listingMode}
          detail={detail}
          description={property.description}
          shortDescription={detail.short_description}
          amenities={detail.amenities}
          features={detail.features}
          scores={detail.scores}
          neighborhoods={detail.neighborhoods}
        />

        {listingMode === 'rental' ? (
          <RentalDetailSidebar
            property={property}
            detail={detail}
            bookings={bookings}
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            estimation={estimation}
            estimatingPrice={estimatingPrice}
          />
        ) : (
          <SaleDetailSidebar property={property} detail={detail} />
        )}
      </div>

      <ProductInquirySection
        listingMode={listingMode}
        isSubmitted={isSubmitted}
        form={form}
        formErrors={formErrors}
        checkIn={checkIn}
        checkOut={checkOut}
        estimation={estimation}
        estimatingPrice={estimatingPrice}
        onFormChange={setForm}
        onCheckInChange={setCheckIn}
        onCheckOutChange={setCheckOut}
        onSubmit={handleSubmit}
      />

      <RelatedStructures properties={related} />
    </main>
  );
}
