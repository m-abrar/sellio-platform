'use client';

import type { Property } from '@/types';
import type { PropertyDetail } from '../property-detail-types';
import { formatMoney } from '../property-detail-utils';
import { getPropertyPrice } from '../property-utils';

interface PriceBreakdownTableProps {
  property: PropertyDetail;
}

export function PriceBreakdownTable({ property }: PriceBreakdownTableProps) {
  const symbol = property.pricing?.currency_symbol || '$';
  const rows: Array<{ label: string; value: string; highlight?: boolean }> = [];

  rows.push({
    label: 'Listed price',
    value: getPropertyPrice(property as Property),
    highlight: true,
  });

  if (property.pricing?.active_price != null) {
    rows.push({
      label: 'Active price',
      value: formatMoney(property.pricing.active_price, symbol),
    });
  }

  if (property.pricing?.base_price != null) {
    rows.push({
      label: 'Base price',
      value: formatMoney(property.pricing.base_price, symbol),
    });
  }

  if (property.pricing?.sale_price != null && Number(property.pricing.sale_price) > 0) {
    rows.push({
      label: 'Sale price',
      value: formatMoney(property.pricing.sale_price, symbol),
    });
  }

  if (property.pricing?.price_per_night != null) {
    rows.push({
      label: 'Nightly rate',
      value: `${formatMoney(property.pricing.price_per_night, symbol)} / night`,
    });
  }

  if (property.pricing?.hoa != null || property.hoa) {
    rows.push({
      label: 'HOA',
      value:
        property.pricing?.hoa_formatted ||
        `${formatMoney(property.pricing?.hoa ?? property.hoa, symbol)} / mo`,
    });
  }

  property.fees?.forEach((fee) => {
    const suffix = fee.charge_type ? ` (${fee.charge_type})` : '';
    rows.push({
      label: fee.title + suffix,
      value: formatMoney(fee.amount, symbol),
    });
  });

  property.addons?.forEach((addon) => {
    rows.push({
      label: addon.title,
      value: formatMoney(addon.price, symbol),
    });
  });

  property.seasonal_prices?.forEach((season) => {
    const range =
      season.start_date && season.end_date
        ? `${season.start_date} → ${season.end_date}`
        : 'Seasonal window';
    rows.push({
      label: `${season.season_name} (${range})`,
      value: formatMoney(season.price, symbol),
    });
  });

  return (
    <section className="pm-detail-block">
      <span className="structure-grid-kicker">Pricing</span>
      <h2 className="pm-detail-block__title">Price breakdown</h2>
      <table className="pm-price-table">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className={row.highlight ? 'pm-price-table__highlight' : undefined}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
