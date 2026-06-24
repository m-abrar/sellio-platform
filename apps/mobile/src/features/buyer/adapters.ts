import {
  BuyerActivityCard,
  BuyerAutoInquiryRecord,
  BuyerBookingRecord,
  BuyerClassifiedInquiryRecord,
  BuyerJobApplicationRecord,
  BuyerOrderRecord,
  BuyerServiceQuoteRecord,
  FavoriteListingCard,
  FavoriteRecord,
} from './types';
import { ListingApiRecord, ListingVertical } from '../listings/types';

const MORPH_TYPE_TO_VERTICAL: Record<string, ListingVertical> = {
  product: 'products',
  property: 'properties',
  auto: 'autos',
  event: 'events',
  joblisting: 'jobs',
  service: 'services',
  classified: 'classifieds',
};

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function verticalFromMorphType(type: string) {
  const modelName = type.split('\\').pop()?.toLowerCase() || '';
  return MORPH_TYPE_TO_VERTICAL[modelName] || null;
}

function money(value: unknown) {
  const amount = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(amount)
    ? `$${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : null;
}

function favoritePrice(record: ListingApiRecord, vertical: ListingVertical) {
  if (vertical === 'jobs') {
    const formatted = text(record.salary_range_formatted);
    if (formatted) return formatted;

    const minimum = money(record.salary_min);
    const maximum = money(record.salary_max);
    return minimum && maximum ? `${minimum} - ${maximum}` : minimum || maximum || 'Salary undisclosed';
  }

  return text(record.price_formatted)
    || money(record.sale_price)
    || money(record.base_price)
    || 'Price unavailable';
}

export function toFavoriteListingCard(favorite: FavoriteRecord): FavoriteListingCard | null {
  const record = favorite.favoritable;
  const vertical = verticalFromMorphType(favorite.favoritable_type);

  if (!record || !vertical) return null;

  return {
    favoriteId: favorite.id,
    listingId: String(record.id || favorite.favoritable_id),
    vertical,
    title: text(record.title) || text(record.name) || 'Untitled listing',
    slug: text(record.slug) || String(record.id || favorite.favoritable_id),
    price: favoritePrice(record, vertical),
    location: [text(record.city), text(record.state)].filter(Boolean).join(', ')
      || 'Location unavailable',
    imageUrl: text(record.thumbnail_url) || text(record.primary_image_url),
  };
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Date unavailable';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function activityMoney(value: unknown, symbol = '$') {
  const amount = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(amount)
    ? `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : null;
}

export function toBookingActivityCard(
  record: BuyerBookingRecord,
  isUpcoming: boolean,
): BuyerActivityCard {
  const isEvent = record.module === 'events' || Boolean(record.event);
  const isService = record.module === 'services' || Boolean(record.service);
  const isVisit = record.module === 'properties'
    && Boolean(record.scheduled_at)
    && !record.check_in_date;
  const kind = isEvent
    ? 'event_booking'
    : isService
      ? 'service_appointment'
      : isVisit
        ? 'property_visit'
        : 'property_booking';
  const listing = record.event || record.service || record.property || null;
  const date = record.occurrence?.start_date_time
    || record.check_in_date
    || record.scheduled_at
    || record.created_at;
  const amount = activityMoney(record.total_price ?? record.price);
  const detail = kind === 'event_booking'
    ? [record.ticket_type?.name, record.quantity ? `${record.quantity} ticket${record.quantity === 1 ? '' : 's'}` : null]
        .filter(Boolean)
        .join(' - ')
    : kind === 'property_booking'
      ? [record.guests ? `${record.guests} guest${record.guests === 1 ? '' : 's'}` : null, record.duration_nights ? `${record.duration_nights} nights` : null]
          .filter(Boolean)
          .join(' - ')
      : kind === 'property_visit'
        ? 'Scheduled property visit'
        : text(record.topic) || 'Service appointment';

  return {
    key: `booking:${kind}:${record.id}`,
    id: record.id,
    source: 'booking',
    kind,
    vertical: isEvent ? 'events' : isService ? 'services' : 'properties',
    title: text(listing?.title) || 'Booking',
    imageUrl: text(listing?.primary_image_url),
    status: text(record.status) || 'pending',
    secondaryStatus: null,
    amount,
    date,
    dateLabel: formatDate(date),
    detail: detail || 'Booking details',
    reference: `Booking #${record.id}`,
    slug: text(listing?.slug),
    isUpcoming,
    cancellationType: kind,
  };
}

export function toOrderActivityCard(record: BuyerOrderRecord): BuyerActivityCard {
  const firstItem = record.items[0];
  const remainingItems = Math.max(record.items.length - 1, 0);
  const totalQuantity = record.items.reduce((total, item) => total + item.quantity, 0);
  const title = text(firstItem?.product?.title)
    || text(firstItem?.product_name)
    || 'Product order';
  const date = record.created_at;

  return {
    key: `order:${record.id}`,
    id: record.id,
    source: 'order',
    kind: 'product_order',
    vertical: 'products',
    title: remainingItems > 0 ? `${title} + ${remainingItems} more` : title,
    imageUrl: text(firstItem?.product?.image),
    status: text(record.status) || 'pending',
    secondaryStatus: text(record.payment_status),
    amount: activityMoney(record.pricing.total_amount, record.pricing.currency_symbol || '$'),
    date,
    dateLabel: formatDate(date),
    detail: `${totalQuantity} item${totalQuantity === 1 ? '' : 's'} - ${record.payment_method.toUpperCase()}`,
    reference: record.order_number,
    slug: text(firstItem?.product?.slug),
    isUpcoming: false,
    cancellationType: null,
  };
}

export function toJobApplicationActivityCard(
  record: BuyerJobApplicationRecord,
): BuyerActivityCard {
  const minimumSalary = activityMoney(record.job?.salary_min);
  const maximumSalary = activityMoney(record.job?.salary_max);
  const salary = minimumSalary && maximumSalary
    ? `${minimumSalary} - ${maximumSalary}`
    : minimumSalary || maximumSalary;
  const date = record.created_at;

  return {
    key: `application:${record.id}`,
    id: record.id,
    source: 'application',
    kind: 'job_application',
    vertical: 'jobs',
    title: text(record.job?.title) || 'Job application',
    imageUrl: text(record.job?.primary_image_url),
    status: text(record.status) || 'pending',
    secondaryStatus: null,
    amount: salary,
    date,
    dateLabel: formatDate(date),
    detail: salary ? `Salary range ${salary}` : 'Application submitted',
    reference: `Application #${record.id}`,
    slug: text(record.job?.slug),
    isUpcoming: false,
    cancellationType: null,
  };
}

export function toAutoInquiryActivityCard(
  record: BuyerAutoInquiryRecord,
): BuyerActivityCard {
  const preferredSchedule = [
    text(record.preferred_date),
    text(record.preferred_time),
  ].filter(Boolean).join(' - ');
  const date = record.created_at;

  return {
    key: `auto_inquiry:${record.id}`,
    id: record.id,
    source: 'auto_inquiry',
    kind: 'vehicle_inquiry',
    vertical: 'autos',
    title: text(record.auto?.title) || 'Vehicle inquiry',
    imageUrl: text(record.auto?.primary_image_url),
    status: text(record.status) || 'pending',
    secondaryStatus: null,
    amount: null,
    date,
    dateLabel: formatDate(date),
    detail: preferredSchedule
      ? `Preferred visit ${preferredSchedule}`
      : 'Vehicle inquiry submitted',
    reference: `Inquiry #${record.id}`,
    slug: text(record.auto?.slug),
    isUpcoming: false,
    cancellationType: null,
  };
}

export function toServiceQuoteActivityCard(
  record: BuyerServiceQuoteRecord,
): BuyerActivityCard {
  const date = record.requested_date || record.created_at;
  const scope = text(record.scope_size);

  return {
    key: `service_quote:${record.id}`,
    id: record.id,
    source: 'service_quote',
    kind: 'service_quote',
    vertical: 'services',
    title: text(record.service?.title) || 'Service quote',
    imageUrl: text(record.service?.primary_image_url),
    status: text(record.status) || 'pending',
    secondaryStatus: null,
    amount: activityMoney(record.quoted_price),
    date,
    dateLabel: formatDate(date),
    detail: scope ? `Scope: ${scope}` : 'Quote requested',
    reference: `Quote #${record.id}`,
    slug: text(record.service?.slug),
    isUpcoming: false,
    cancellationType: null,
  };
}

export function toClassifiedInquiryActivityCard(
  record: BuyerClassifiedInquiryRecord,
): BuyerActivityCard {
  const classified = record.classified
    || record.classifiedAd
    || record.classifiedad
    || record.classified_ad
    || null;
  const price = text(classified?.price_formatted)
    || activityMoney(classified?.sale_price ?? classified?.base_price);
  const condition = text(classified?.condition_label);
  const brand = text(classified?.brand?.name);
  const date = record.created_at;

  return {
    key: `classified_inquiry:${record.id}`,
    id: record.id,
    source: 'classified_inquiry',
    kind: 'classified_inquiry',
    vertical: 'classifieds',
    title: text(classified?.title) || 'Classified inquiry',
    imageUrl: text(classified?.primary_image_url),
    status: text(record.status) || 'pending',
    secondaryStatus: null,
    amount: price,
    date,
    dateLabel: formatDate(date),
    detail: [condition, brand].filter(Boolean).join(' - ') || 'Classified inquiry submitted',
    reference: `Inquiry #${record.id}`,
    slug: text(classified?.slug),
    isUpcoming: false,
    cancellationType: null,
  };
}
