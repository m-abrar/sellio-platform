import { ListingApiRecord, ListingCardItem, ListingDetailItem, ListingVertical } from './types';

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function nested(record: Record<string, unknown> | undefined, key: string) {
  return record?.[key];
}

function join(values: unknown[], fallback: string) {
  const parts = values.map(text).filter((value): value is string => Boolean(value));
  return parts.length ? parts.join(' · ') : fallback;
}

function locationFor(record: ListingApiRecord, vertical: ListingVertical) {
  if (vertical === 'products') {
    const category = nested(record.taxonomy, 'category');
    return text(
      category && typeof category === 'object'
        ? (category as Record<string, unknown>).title
        : category,
    ) || 'Online';
  }

  if (vertical === 'jobs') {
    return text(nested(record.location, 'display')) || 'Remote';
  }

  return join([
    nested(record.location, 'title'),
    nested(record.location, 'city'),
    nested(record.location, 'state'),
  ], 'Location unavailable');
}

function priceFor(record: ListingApiRecord, vertical: ListingVertical) {
  if (vertical === 'jobs') {
    return text(nested(record.compensation, 'range_compact')) || 'Salary undisclosed';
  }

  if (vertical === 'events') {
    return text(nested(record.ticketing, 'price_formatted'))
      || (nested(record.ticketing, 'is_free') ? 'Free' : 'Price unavailable');
  }

  return text(nested(record.pricing, 'formatted'))
    || text(nested(record.pricing, 'price_formatted'))
    || text(nested(record.pricing, 'formatted_short'))
    || 'Price unavailable';
}

function imageFor(record: ListingApiRecord, vertical: ListingVertical) {
  switch (vertical) {
    case 'products':
      return text(nested(record.media, 'featured_image'));
    case 'properties':
      return text(record.featured_image) || text(record.thumbnail_image);
    case 'autos':
      return text(nested(record.media, 'preview')) || text(nested(record.media, 'main_photo'));
    case 'events':
      return text(nested(record.media, 'preview')) || text(nested(record.media, 'poster'));
    case 'jobs':
      return text(nested(record.company, 'logo_card')) || text(nested(record.company, 'logo'));
    case 'services':
      return text(nested(record.media, 'main_photo'));
    case 'classifieds':
      return text(nested(record.media, 'thumbnail')) || text(nested(record.media, 'main_photo'));
  }
}

function detailsFor(record: ListingApiRecord, vertical: ListingVertical) {
  switch (vertical) {
    case 'products':
      return join([
        nested(record.inventory, 'stock_quantity'),
        nested(record.specs, 'type'),
      ], text(record.short_description) || 'Marketplace product');
    case 'properties':
      return join([
        nested(record.specs, 'bedrooms') != null ? `${nested(record.specs, 'bedrooms')} beds` : null,
        nested(record.specs, 'bathrooms') != null ? `${nested(record.specs, 'bathrooms')} baths` : null,
        nested(record.specs, 'area_formatted'),
      ], text(record.short_description) || 'Property listing');
    case 'autos':
      return join([
        nested(record.specs, 'year') != null ? String(nested(record.specs, 'year')) : null,
        nested(record.specs, 'make'),
        nested(record.specs, 'mileage'),
      ], text(record.short_description) || 'Vehicle listing');
    case 'events':
      return join([
        nested(record.specs, 'type'),
        nested(record.specs, 'event_genre'),
      ], 'Upcoming event');
    case 'jobs':
      return join([
        nested(record.company, 'name'),
        nested(record.employment, 'type'),
        nested(record.employment, 'workplace'),
      ], 'Open position');
    case 'services': {
      const category = nested(record.professional, 'category');
      return join([
        category && typeof category === 'object'
          ? (category as Record<string, unknown>).title
          : category,
        record.short_description,
      ], 'Professional service');
    }
    case 'classifieds':
      return join([
        nested(record.item_specs, 'condition_label'),
        nested(record.item_specs, 'quantity') != null
          ? `Qty ${nested(record.item_specs, 'quantity')}`
          : null,
      ], text(record.short_description) || 'Classified listing');
  }
}

export function toListingCard(record: ListingApiRecord, vertical: ListingVertical): ListingCardItem {
  return {
    id: String(record.id),
    vertical,
    title: text(record.title) || text(record.name) || 'Untitled listing',
    slug: text(record.slug) || String(record.id),
    price: priceFor(record, vertical),
    location: locationFor(record, vertical),
    details: detailsFor(record, vertical),
    imageUrl: imageFor(record, vertical),
  };
}

export function toListingDetail(
  record: ListingApiRecord,
  vertical: ListingVertical,
): ListingDetailItem {
  return {
    ...toListingCard(record, vertical),
    description: text(record.description)
      || text(record.short_description)
      || 'No description has been provided for this listing.',
  };
}
