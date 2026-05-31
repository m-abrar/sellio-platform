'use client';

import type { Property } from '@sellio/types';
import { getPropertyPrice } from '../property-utils';

interface SidebarListingCardProps {
  property: Property;
  isRental: boolean;
  estimation: { total_nights: number; estimated_lodging_total: string } | null;
  estimatingPrice: boolean;
  inquiryHref?: string;
}

export function SidebarListingCard({
  property,
  isRental,
  estimation,
  estimatingPrice,
  inquiryHref = '#pm-inquiry',
}: SidebarListingCardProps) {
  return (
    <section className="pm-sidebar-card pm-sidebar-listing">
      <span className="structure-grid-kicker">Pricing</span>
      <p className="pm-sidebar-listing__price">{getPropertyPrice(property)}</p>
      {isRental && property.pricing?.price_per_night != null && (
        <p className="pm-sidebar-card__hint">
          From{' '}
          {property.pricing.currency_symbol || '$'}
          {Number(property.pricing.price_per_night).toLocaleString()} / night
        </p>
      )}
      {isRental && estimation && (
        <div className="pm-stay-estimate pm-stay-estimate--compact" role="status">
          <span className="pm-stay-estimate__label">Stay estimate</span>
          <span className="pm-stay-estimate__value">
            {estimatingPrice
              ? 'Calculating…'
              : `${estimation.total_nights} nights · $${Number(estimation.estimated_lodging_total).toLocaleString()}`}
          </span>
        </div>
      )}
      <a href={inquiryHref} className="urban-btn-primary pm-sidebar-listing__cta">
        Request a viewing
      </a>
    </section>
  );
}
