'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/storefront-api';
import { RetreatBentoCard } from './components';
import { CatalogSyncAlert } from './components/CatalogSyncAlert';
import { loadVacationDetailPage } from './catalog';
import { redirectToPropertyBookingReserve } from '@/themes/properties/shared/property-booking-utils';
import { usePropertyThemeLink } from '@/themes/properties/shared/usePropertyThemeLink';
import {
  mapPropertyToVacationCard,
  type VacationRetreatCard,
} from './vacation-utils';

export default function ProductPage({ slug }: { slug: string }) {
  const router = useRouter();
  const themeLink = usePropertyThemeLink();

  const [retreat, setRetreat] = useState<VacationRetreatCard | null>(null);
  const [related, setRelated] = useState<VacationRetreatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [calculatingPrice, setCalculatingPrice] = useState(false);

  const [chefUpgrade, setChefUpgrade] = useState(false);
  const [yachtUpgrade, setYachtUpgrade] = useState(false);
  const [helicopterUpgrade, setHelicopterUpgrade] = useState(false);

  const [travelerName, setTravelerName] = useState('');
  const [travelerEmail, setTravelerEmail] = useState('');
  const [travelerPhone, setTravelerPhone] = useState('');
  const [travelerNotes, setTravelerNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRetreatDetails() {
      setLoading(true);
      setNotFound(false);
      const result = await loadVacationDetailPage(slug);

      if (result.mode === 'live' && result.property) {
        setRetreat(mapPropertyToVacationCard(result.property));
        setRelated(result.related.map((property, index) => mapPropertyToVacationCard(property, index)));
        setApiError(null);
      } else if (result.mode === 'not-found') {
        setRetreat(null);
        setRelated([]);
        setNotFound(true);
        setApiError(result.alertError);
      } else {
        setRetreat(null);
        setRelated([]);
        setNotFound(false);
        setApiError(result.alertError);
      }

      setLoading(false);
    }

    if (slug) {
      fetchRetreatDetails();
    }
  }, [slug]);

  useEffect(() => {
    if (!checkIn || !checkOut || !retreat) {
      setEstimatedPrice('');
      return;
    }

    setCalculatingPrice(true);

    async function calculatePrice() {
      try {
        const response = await api.calculateLodgingPrice(retreat!.id, checkIn, checkOut);
        if (response?.estimated_lodging_total) {
          let total = Number(String(response.estimated_lodging_total).replace(/[^0-9.-]+/g, ''));
          const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

          if (chefUpgrade) total += 150 * diffDays;
          if (yachtUpgrade) total += 1200 * diffDays;
          if (helicopterUpgrade) total += 650;

          setEstimatedPrice(`$${total.toLocaleString()}`);
        }
      } catch {
        const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        let total = retreat!.numericPrice * diffDays;

        if (chefUpgrade) total += 150 * diffDays;
        if (yachtUpgrade) total += 1200 * diffDays;
        if (helicopterUpgrade) total += 650;

        setEstimatedPrice(`$${total.toLocaleString()}`);
      } finally {
        setCalculatingPrice(false);
      }
    }

    calculatePrice();
  }, [checkIn, checkOut, chefUpgrade, yachtUpgrade, helicopterUpgrade, retreat]);

  const handleEscapeCheckout = (event: React.FormEvent) => {
    event.preventDefault();

    if (!retreat || !travelerName || !travelerEmail || !checkIn || !checkOut) {
      setFormError('Please complete all required booking details before checkout.');
      return;
    }

    setFormError(null);

    const upgradeNotes = [
      travelerNotes.trim(),
      chefUpgrade ? 'Chef upgrade requested' : '',
      yachtUpgrade ? 'Yacht upgrade requested' : '',
      helicopterUpgrade ? 'Helicopter transfer requested' : '',
    ]
      .filter(Boolean)
      .join('\n');

    redirectToPropertyBookingReserve(themeLink, {
      propertyId: retreat.id,
      checkIn,
      checkOut,
      guests: 2,
      fullName: travelerName,
      email: travelerEmail,
      phone: travelerPhone.trim() || undefined,
      message: upgradeNotes || undefined,
    });
  };

  if (loading) {
    return (
      <div className="pv-detail-loading">
        <div className="pv-detail-spinner" />
        <p className="pv-mono pv-detail-loading-copy">Loading retreat details...</p>
      </div>
    );
  }

  if (notFound || !retreat) {
    return (
      <div className="pv-empty-state pv-detail-empty">
        <span className="pv-empty-icon">⚠️</span>
        <h3>Retreat not found</h3>
        <p>{apiError || 'We could not locate the requested vacation retreat.'}</p>
        <button type="button" className="pv-btn-primary" onClick={() => router.push(themeLink('/'))}>
          Back to retreats
        </button>
      </div>
    );
  }

  return (
    <div className="pv-detail-page">
      <div className="pv-detail-back-wrap">
        <button type="button" className="pv-detail-back" onClick={() => router.push(themeLink('/'))}>
          ← Back to retreats
        </button>
      </div>

      {apiError && (
        <div className="pv-alert-slot">
          <CatalogSyncAlert error={apiError} />
        </div>
      )}

      <div className="ac-details-grid pv-detail-grid">
        <div>
          <div className="pv-detail-gallery">
            <img src={retreat.image} alt={retreat.title} className="pv-detail-image" />
          </div>

          <div className="pv-detail-specs-card">
            <h4>Vetted specifications</h4>
            <div className="pv-detail-specs-grid">
              <div><span>Total area</span><strong>{retreat.sqft}</strong></div>
              <div><span>Max occupancy</span><strong>{retreat.guests}</strong></div>
              <div><span>Bedrooms</span><strong>{retreat.bedrooms}</strong></div>
              <div><span>Bathrooms</span><strong>{retreat.bathrooms}</strong></div>
              <div><span>Constructed</span><strong>{retreat.yearBuilt || '—'}</strong></div>
              <div><span>Vibe score</span><strong className="pv-coral-text">{retreat.vibeScore}</strong></div>
            </div>
          </div>

          <div className="pv-detail-description-card">
            <h4>The retreat narrative</h4>
            <p>{retreat.description}</p>
          </div>
        </div>

        <div>
          <div className="pv-detail-summary-card">
            <div className="pv-mono pv-section-kicker">{retreat.category}</div>
            <h1>{retreat.title}</h1>
            <p className="pv-detail-location">{retreat.location}</p>
            <div className="pv-detail-price-row">
              <span>{retreat.price}</span>
              <small>/night</small>
            </div>
            <div className="pv-detail-rating">★ Retreat rating: {retreat.rating}</div>
          </div>

          <div className="pv-booking-card">
            <form onSubmit={handleEscapeCheckout} className="pv-booking-form">
              <h4>Request booking</h4>
              <p>Secure your check-in dates directly with the property host.</p>

              <label className="pv-booking-label">Check in *</label>
              <input type="date" required value={checkIn} onChange={(event) => setCheckIn(event.target.value)} />

              <label className="pv-booking-label">Check out *</label>
              <input type="date" required value={checkOut} onChange={(event) => setCheckOut(event.target.value)} />

              <div className="pv-upgrades-section">
                <span className="pv-mono">Optional upgrades</span>
                <label className="pv-upgrade-option">
                  <input type="checkbox" checked={chefUpgrade} onChange={() => setChefUpgrade((value) => !value)} />
                  <span>Private chef (+$150/day)</span>
                </label>
                <label className="pv-upgrade-option">
                  <input type="checkbox" checked={yachtUpgrade} onChange={() => setYachtUpgrade((value) => !value)} />
                  <span>Yacht charter (+$1,200/day)</span>
                </label>
                <label className="pv-upgrade-option">
                  <input
                    type="checkbox"
                    checked={helicopterUpgrade}
                    onChange={() => setHelicopterUpgrade((value) => !value)}
                  />
                  <span>Helicopter transfer (+$650)</span>
                </label>
              </div>

              <label className="pv-booking-label">Traveler name *</label>
              <input
                type="text"
                required
                value={travelerName}
                onChange={(event) => setTravelerName(event.target.value)}
                placeholder="Alice Wonderland"
              />

              <label className="pv-booking-label">Email *</label>
              <input
                type="email"
                required
                value={travelerEmail}
                onChange={(event) => setTravelerEmail(event.target.value)}
                placeholder="alice@example.com"
              />

              <label className="pv-booking-label">Phone</label>
              <input
                type="tel"
                value={travelerPhone}
                onChange={(event) => setTravelerPhone(event.target.value)}
                placeholder="+1 555 0100"
              />

              <label className="pv-booking-label">Notes</label>
              <textarea
                rows={3}
                value={travelerNotes}
                onChange={(event) => setTravelerNotes(event.target.value)}
                placeholder="Arrival time, special requests..."
              />

              {estimatedPrice && (
                <div className="pv-price-calculation-alert">
                  <span>Estimated total</span>
                  <strong>{calculatingPrice ? 'Calculating...' : estimatedPrice}</strong>
                </div>
              )}

              {formError && (
                <p className="prop-form-error" role="alert">
                  {formError}
                </p>
              )}

              <button type="submit" className="pv-btn-primary pv-booking-submit">
                Continue to secure booking
              </button>
            </form>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="pv-related-section">
          <div className="pv-mono pv-section-kicker">More retreats</div>
          <h3>Similar getaways nearby</h3>
          <div className="pv-retreat-grid">
            {related.map((item) => (
              <RetreatBentoCard
                key={item.id}
                {...item}
                onClick={() => router.push(themeLink(`/product/${item.slug}`))}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
