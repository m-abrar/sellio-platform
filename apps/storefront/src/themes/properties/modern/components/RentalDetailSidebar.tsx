'use client';

import type { Property } from '@sellio/types';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { AgentProfileCard } from './AgentProfileCard';
import type { PropertyBookingBlock, PropertyDetail } from '../property-detail-types';
import { getPropertyPrice } from '../property-utils';

interface RentalDetailSidebarProps {
  property: Property;
  detail: PropertyDetail;
  bookings: PropertyBookingBlock[];
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  estimation: { total_nights: number; estimated_lodging_total: string } | null;
  estimatingPrice: boolean;
}

export function RentalDetailSidebar({
  property,
  detail,
  bookings,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  estimation,
  estimatingPrice,
}: RentalDetailSidebarProps) {
  return (
    <aside className="pm-detail-sidebar pm-detail-sidebar--rental" aria-label="Book this rental">
      <section className="pm-sidebar-card pm-sidebar-booking">
        <span className="structure-grid-kicker">Book your stay</span>
        <p className="pm-sidebar-listing__price">{getPropertyPrice(property)}</p>
        {property.pricing?.price_per_night != null && (
          <p className="pm-sidebar-card__hint">
            {property.pricing.currency_symbol || '$'}
            {Number(property.pricing.price_per_night).toLocaleString()} per night
          </p>
        )}

        <div className="pm-date-row pm-date-row--sidebar">
          <label className="pm-field">
            <span className="pm-field__label">Check-in</span>
            <input
              className="pm-field__input"
              type="date"
              value={checkIn}
              onChange={(event) => onCheckInChange(event.target.value)}
            />
          </label>
          <label className="pm-field">
            <span className="pm-field__label">Check-out</span>
            <input
              className="pm-field__input"
              type="date"
              value={checkOut}
              onChange={(event) => onCheckOutChange(event.target.value)}
            />
          </label>
        </div>

        {estimation && (
          <div className="pm-stay-estimate pm-stay-estimate--compact" role="status">
            <span className="pm-stay-estimate__label">Stay estimate</span>
            <span className="pm-stay-estimate__value">
              {estimatingPrice
                ? 'Calculating…'
                : `${estimation.total_nights} nights · $${Number(estimation.estimated_lodging_total).toLocaleString()}`}
            </span>
          </div>
        )}

        <a href="#pm-inquiry" className="urban-btn-primary pm-sidebar-listing__cta">
          Check availability
        </a>
      </section>

      <AvailabilityCalendar
        bookings={bookings}
        minimumRentalDays={detail.minimum_rental_days}
      />

      <AgentProfileCard owner={detail.owner} brand={detail.brand} isRental variant="sidebar" />
    </aside>
  );
}
