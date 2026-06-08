'use client';

import type { Property } from '@sellio/types';
import { AgentProfileCard } from './AgentProfileCard';
import type { PropertyDetail } from '../property-detail-types';
import { formatMoney } from '../property-detail-utils';
import { getPropertyPrice } from '../property-utils';

interface SaleDetailSidebarProps {
  property: Property;
  detail: PropertyDetail;
}

function getPricePerSqFt(property: Property): string | null {
  const price = Number(property.pricing?.sale_price ?? property.pricing?.base_price ?? property.base_price);
  const sqFt = property.area_sq_ft ?? property.specs?.area_sq_ft;
  if (!price || !sqFt) return null;
  return formatMoney(price / Number(sqFt), property.pricing?.currency_symbol || '$');
}

export function SaleDetailSidebar({ property, detail }: SaleDetailSidebarProps) {
  const pricePerSqFt = getPricePerSqFt(property);

  return (
    <aside className="pm-detail-sidebar pm-detail-sidebar--sale" aria-label="Purchase summary">
      <section className="pm-sidebar-card pm-sidebar-offer">
        <span className="structure-grid-kicker">Offer summary</span>
        <p className="pm-sidebar-listing__price">{getPropertyPrice(property)}</p>
        {pricePerSqFt && (
          <p className="pm-sidebar-card__hint">{pricePerSqFt} per sq ft</p>
        )}
        {property.pricing?.hoa != null && (
          <p className="pm-sidebar-card__hint">
            HOA{' '}
            {property.pricing.hoa_formatted ||
              `${property.pricing.currency_symbol || '$'}${Number(property.pricing.hoa).toLocaleString()}/mo`}
          </p>
        )}
        <ul className="pm-sale-highlights">
          <li>Verified listing details</li>
          <li>Schedule a private showing</li>
          <li>Work with a licensed agent</li>
        </ul>
        <a href="#pm-inquiry" className="urban-btn-primary pm-sidebar-listing__cta">
          Schedule a showing
        </a>
      </section>

      <AgentProfileCard owner={detail.owner} brand={detail.brand} isRental={false} variant="sidebar" />
    </aside>
  );
}
