'use client';

import { useEffect, useState } from 'react';
import { api } from '@sellio/api-client';
import type { Property } from '@sellio/types';
import { useClientReady } from '@/hooks/useClientReady';
import { CatalogRegistryAlert } from './components/explore';
import {
  DetailPageHeader,
  LeaseEstimatorSection,
  ProductDetailHero,
  ProductDetailLoadingShell,
  ProductDetailMain,
  RelatedRentals,
  RentalApplicationSidebar,
  type RentalApplicationReceipt,
} from './components/detail';
import { useDemoFallbackAllowed } from './hooks/useDemoFallbackAllowed';
import { filterRentalProperties } from './catalog';
import { enrichDemoDetail } from './demo-detail-enrichment';
import { FALLBACK_RENTALS } from './fallback-data';
import { asPropertyDetail } from './property-detail-utils';
import type { PropertyBookingBlock, PropertyDetail } from './property-detail-types';
import { collectPropertyImages, getMonthlyRent } from './property-utils';
import { useRentalThemeLink } from './hooks/useRentalThemeLink';

const DEMO_RENTAL_BOOKINGS: PropertyBookingBlock[] = [
  { start: '2026-06-10', end: '2026-06-18' },
  { start: '2026-07-01', end: '2026-07-08' },
  { start: '2026-08-15', end: '2026-08-22' },
];

interface ProductPageProps {
  slug: string;
}

export default function ProductPage({ slug }: ProductPageProps) {
  const clientReady = useClientReady();
  const themeLink = useRentalThemeLink();
  const allowDemo = useDemoFallbackAllowed();

  const [property, setProperty] = useState<Property | null>(null);
  const [detail, setDetail] = useState<PropertyDetail | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<PropertyBookingBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [calculatingPrice, setCalculatingPrice] = useState(false);
  const [lodgingBreakdown, setLodgingBreakdown] = useState<{
    total_nights: number;
    estimated_lodging_total: string;
  } | null>(null);

  const [downPayment, setDownPayment] = useState(2000);
  const [leaseDuration, setLeaseDuration] = useState('12');
  const [tenantName, setTenantName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingReceipt, setBookingReceipt] = useState<RentalApplicationReceipt | null>(null);
  const [addFiber, setAddFiber] = useState(false);
  const [addParking, setAddParking] = useState(false);
  const [addValet, setAddValet] = useState(false);

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
          setRelated(filterRentalProperties(response.related_properties || []).slice(0, 3));
          setBookings((response.bookings as PropertyBookingBlock[]) || []);
          setUseFallback(false);
          setApiError(null);
        } else {
          loadFallback();
        }
      } catch (error) {
        if (!isMounted) return;
        setApiError(error instanceof Error ? error.message : String(error));
        loadFallback();
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    function loadFallback() {
      if (!allowDemo) {
        setProperty(null);
        setDetail(null);
        setRelated([]);
        setBookings([]);
        setUseFallback(false);
        return;
      }

      const matched = FALLBACK_RENTALS.find((rental) => rental.slug === slug);
      if (matched) {
        const loaded = enrichDemoDetail(slug, asPropertyDetail(matched));
        setProperty(matched);
        setDetail(loaded);
        setRelated(FALLBACK_RENTALS.filter((rental) => rental.slug !== slug).slice(0, 3));
        setBookings(DEMO_RENTAL_BOOKINGS);
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
  }, [slug, allowDemo]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [property?.id]);

  useEffect(() => {
    if (!property || !checkIn || !checkOut) {
      setLodgingBreakdown(null);
      return;
    }

    const calculateLivePrice = async () => {
      setCalculatingPrice(true);
      try {
        if (useFallback) {
          const nights = Math.max(
            1,
            Math.round(
              (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24),
            ),
          );
          const daily = getMonthlyRent(property) / 30;
          const estimated = Math.round(daily * nights);
          setLodgingBreakdown({
            total_nights: nights,
            estimated_lodging_total: `$${estimated.toLocaleString()}`,
          });
        } else {
          const response = await api.calculateLodgingPrice(property.id, checkIn, checkOut);
          if (response) {
            setLodgingBreakdown({
              total_nights: response.total_nights,
              estimated_lodging_total: response.estimated_lodging_total,
            });
          }
        }
      } catch {
        const nights = Math.max(
          1,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24),
          ),
        );
        const daily = getMonthlyRent(property) / 30;
        setLodgingBreakdown({
          total_nights: nights,
          estimated_lodging_total: `$${Math.round(daily * nights).toLocaleString()}`,
        });
      } finally {
        setCalculatingPrice(false);
      }
    };

    calculateLivePrice();
  }, [checkIn, checkOut, property, useFallback]);

  const calculateLongTermRent = () => {
    if (!property) return 0;
    const base = getMonthlyRent(property);
    const savings = Math.round(downPayment * 0.05);
    const durationBonus = leaseDuration === '24' ? 150 : leaseDuration === '12' ? 50 : 0;
    return Math.max(800, base - savings - durationBonus);
  };

  const handleCheckoutSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!property || !tenantName.trim() || !tenantEmail.trim() || !tenantPhone.trim()) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));

    const finalMonthlyRent = calculateLongTermRent();
    let totalAddons = 0;
    if (addFiber) totalAddons += 80;
    if (addParking) totalAddons += 150;
    if (addValet) totalAddons += 35;

    const receipt: RentalApplicationReceipt = {
      orderId: `RE-${Math.floor(100000 + Math.random() * 900000)}`,
      propertyTitle: property.title,
      tenantName: tenantName.trim(),
      leaseDuration: `${leaseDuration} months`,
      downPaymentPaid: `$${downPayment.toLocaleString()}`,
      utilityAddons: { addonsTotal: `$${totalAddons.toLocaleString()}` },
      netMonthlyTotal: `$${(finalMonthlyRent + totalAddons).toLocaleString()}`,
    };

    try {
      const existing = localStorage.getItem('sellio_properties_rental_orders');
      const orderList = existing ? JSON.parse(existing) : [];
      orderList.unshift(receipt);
      localStorage.setItem('sellio_properties_rental_orders', JSON.stringify(orderList));
    } catch {
      /* ignore storage errors in preview */
    }

    setBookingReceipt(receipt);
    setIsSubmitting(false);
  };

  const resetApplication = () => {
    setBookingReceipt(null);
    setCheckIn('');
    setCheckOut('');
    setTenantName('');
    setTenantEmail('');
    setTenantPhone('');
  };

  if (!clientReady || loading) {
    return <ProductDetailLoadingShell />;
  }

  if (!property || !detail) {
    return (
      <main className="pr-detail-page">
        <section className="pr-not-found">
          <span className="pr-kicker">Not found</span>
          <h1 className="pr-section-title">Listing could not be loaded</h1>
          <p className="pr-lead" style={{ margin: '0 auto 2rem' }}>
            {apiError ||
              'This rental does not exist, or the listing API is unavailable.'}
          </p>
          <a href={themeLink('/explore')} className="pr-btn-primary">
            Browse rentals
          </a>
        </section>
      </main>
    );
  }

  const images = collectPropertyImages(property);

  return (
    <main className="pr-detail-page">
      <DetailPageHeader title={property.title} />

      {useFallback && apiError && (
        <div className="pr-alert-slot">
          <CatalogRegistryAlert variant="demo" error={apiError} />
        </div>
      )}

      <ProductDetailHero
        property={property}
        detail={detail}
        images={images}
        activeImageIndex={activeImageIndex}
        onSelectImage={setActiveImageIndex}
      />

      <div className="pr-detail-layout">
        <div className="pr-detail-main-column">
          <ProductDetailMain
            detail={detail}
            description={property.description}
            amenities={detail.amenities}
            title={property.title}
          />
          <LeaseEstimatorSection
            downPayment={downPayment}
            leaseDuration={leaseDuration}
            estimatedRent={calculateLongTermRent()}
            onDownPaymentChange={setDownPayment}
            onLeaseDurationChange={setLeaseDuration}
          />
        </div>

        <RentalApplicationSidebar
          property={property}
          detail={detail}
          bookings={bookings}
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
          lodgingBreakdown={lodgingBreakdown}
          calculatingPrice={calculatingPrice}
          tenantName={tenantName}
          tenantEmail={tenantEmail}
          tenantPhone={tenantPhone}
          addFiber={addFiber}
          addParking={addParking}
          addValet={addValet}
          isSubmitting={isSubmitting}
          receipt={bookingReceipt}
          onTenantNameChange={setTenantName}
          onTenantEmailChange={setTenantEmail}
          onTenantPhoneChange={setTenantPhone}
          onAddFiberChange={setAddFiber}
          onAddParkingChange={setAddParking}
          onAddValetChange={setAddValet}
          onSubmit={handleCheckoutSubmit}
          onResetReceipt={resetApplication}
        />
      </div>

      <RelatedRentals properties={related} onNavigate={resetApplication} />
    </main>
  );
}
