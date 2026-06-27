import {
  ListingApiRecord,
  ListingCardItem,
  ListingDetailFact,
  ListingDetailItem,
  ListingVertical,
  EventOccurrenceOption,
  ServicePackageOption,
} from './types';

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function nested(record: Record<string, unknown> | undefined, key: string) {
  return record?.[key];
}

function nestedRecord(record: Record<string, unknown> | undefined, key: string) {
  const value = nested(record, key);
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function display(value: unknown) {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
}

function title(value: unknown) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return display((value as Record<string, unknown>).title)
      || display((value as Record<string, unknown>).name);
  }

  return display(value);
}

function fact(label: string, value: unknown, suffix = ''): ListingDetailFact | null {
  const resolved = display(value);
  return resolved ? { label, value: `${resolved}${suffix}` } : null;
}

function compactFacts(values: Array<ListingDetailFact | null>) {
  return values.filter((value): value is ListingDetailFact => Boolean(value));
}

function dateTime(value: unknown) {
  const resolved = display(value);
  if (!resolved) return null;

  const date = new Date(resolved);
  return Number.isNaN(date.getTime()) ? resolved : date.toLocaleString();
}

function yesNo(value: unknown, yes: string, no: string) {
  return typeof value === 'boolean' ? (value ? yes : no) : null;
}

function join(values: unknown[], fallback: string) {
  const parts = values.map(text).filter((value): value is string => Boolean(value));
  return parts.length ? parts.join(' - ') : fallback;
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

function factsFor(record: ListingApiRecord, vertical: ListingVertical): ListingDetailFact[] {
  const billingType = nestedRecord(record.pricing, 'billing_type');
  const transactionType = nestedRecord(record.pricing, 'transaction_type');

  switch (vertical) {
    case 'products':
      return compactFacts([
        fact('Category', title(nested(record.taxonomy, 'category'))),
        fact('Brand', title(nested(record.taxonomy, 'brand'))),
        fact('Type', nested(record.specs, 'type')),
        fact('Availability', nested(record.inventory, 'stock_quantity')),
        fact('Weight', nested(record.specs, 'weight')),
        fact('Dimensions', nested(record.specs, 'dimensions')),
      ]);
    case 'properties':
      return compactFacts([
        fact('Property type', nested(record.specs, 'property_type')),
        fact('Bedrooms', nested(record.specs, 'bedrooms')),
        fact('Bathrooms', nested(record.specs, 'bathrooms')),
        fact('Maximum guests', nested(record.specs, 'max_guests')),
        fact('Area', nested(record.specs, 'area_formatted')),
        fact('Year built', nested(record.specs, 'year_built')),
        fact('Parking spaces', nested(record.specs, 'parking_spots')),
        fact('Minimum stay', nested(record.specs, 'minimum_rental_days'), ' days'),
      ]);
    case 'autos':
      return compactFacts([
        fact('Year', nested(record.specs, 'year')),
        fact('Make', nested(record.specs, 'make')),
        fact('Model', nested(record.specs, 'model')),
        fact('Mileage', nested(record.specs, 'mileage')),
        fact('Transmission', nested(record.specs, 'transmission')),
        fact('Engine', nested(record.specs, 'engine')),
        fact('Drivetrain', nested(record.specs, 'drivetrain')),
        fact('Exterior color', nested(record.specs, 'exterior_color')),
      ]);
    case 'events':
      return compactFacts([
        fact('Starts', dateTime(nested(record.schedule, 'start_at'))),
        fact('Ends', dateTime(nested(record.schedule, 'end_at'))),
        fact('Format', yesNo(nested(record.schedule, 'is_virtual'), 'Virtual event', 'In-person event')),
        fact('Type', nested(record.specs, 'type')),
        fact('Genre', nested(record.specs, 'event_genre')),
        fact('Venue size', nested(record.specs, 'venue_size')),
        fact('Tickets left', nested(record.ticketing, 'tickets_left')),
      ]);
    case 'jobs':
      return compactFacts([
        fact('Company', nested(record.company, 'name')),
        fact('Employment', nested(record.employment, 'type')),
        fact('Workplace', nested(record.employment, 'workplace')),
        fact('Education', nested(record.employment, 'education')),
        fact('Salary', nested(record.compensation, 'range_full')),
        fact('Apply by', dateTime(nested(record.status, 'deadline'))),
      ]);
    case 'services':
      return compactFacts([
        fact('Category', title(nested(record.professional, 'category'))),
        fact('Provider', nested(record.provider, 'name')),
        fact('Availability', yesNo(nested(record.operations, 'is_open'), 'Open now', 'Currently closed')),
        fact('Hours', nested(record.operations, 'hours_label')),
        fact('Operating days', nested(record.operations, 'days_label')),
        fact('Service radius', nested(record.operations, 'radius')),
        fact('Billing', yesNo(nested(billingType, 'is_subscription'), 'Subscription',
          nested(billingType, 'is_project_based') ? 'Project based' : 'Standard')),
      ]);
    case 'classifieds':
      return compactFacts([
        fact('Category', title(nested(record.taxonomy, 'category'))),
        fact('Brand', title(nested(record.taxonomy, 'brand'))),
        fact('Condition', nested(record.item_specs, 'condition_label')),
        fact('Available for', yesNo(nested(transactionType, 'for_rent'), 'Rent',
          nested(transactionType, 'for_sale') ? 'Sale' : 'Inquiry')),
        fact('Quantity', nested(record.item_specs, 'quantity')),
        fact('Item age', nested(record.item_specs, 'age_years'), ' years'),
        fact('Dimensions', nested(record.item_specs, 'dimensions')),
        fact('Shipping', yesNo(nested(record.status, 'is_shipping'), 'Available', 'Not available')),
      ]);
  }
}

function primaryActionFor(record: ListingApiRecord, vertical: ListingVertical) {
  switch (vertical) {
    case 'products':
      return { label: 'ADD TO CART', description: 'Product checkout is not available in the mobile app yet.' };
    case 'properties':
      return nested(record.status, 'is_rental')
        ? { label: 'BOOK THIS PROPERTY', description: 'Property booking is not available in the mobile app yet.' }
        : { label: 'ASK ABOUT THIS PROPERTY', description: 'Property inquiries are not available in the mobile app yet.' };
    case 'autos':
      return { label: 'ASK ABOUT THIS VEHICLE', description: 'Vehicle inquiries are not available in the mobile app yet.' };
    case 'events':
      return { label: 'RESERVE TICKETS', description: 'Event booking is not available in the mobile app yet.' };
    case 'jobs':
      return { label: 'APPLY FOR THIS JOB', description: 'Job applications are not available in the mobile app yet.' };
    case 'services':
      return { label: 'REQUEST A QUOTE', description: 'Service quotes are not available in the mobile app yet.' };
    case 'classifieds':
      return { label: 'CONTACT THE SELLER', description: 'Classified inquiries are not available in the mobile app yet.' };
  }
}

function servicePackagesFor(record: ListingApiRecord): ServicePackageOption[] {
  if (!Array.isArray(record.packages)) return [];

  return record.packages.flatMap((servicePackage) => {
    const packageTitle = text(servicePackage.title);
    if (!packageTitle) return [];

    return [{
      id: String(servicePackage.id),
      title: packageTitle,
      price: text(servicePackage.price_display)
        || display(servicePackage.price)
        || 'Price on request',
      description: text(servicePackage.description),
    }];
  });
}

function eventOccurrencesFor(record: ListingApiRecord): EventOccurrenceOption[] {
  if (!Array.isArray(record.occurrences) || !Array.isArray(record.ticket_types)) return [];

  const ticketTitles = new Map(
    record.ticket_types.map((ticket) => [String(ticket.id), text(ticket.title) || 'Event ticket']),
  );

  return record.occurrences.flatMap((occurrence) => {
    const occurrenceId = String(occurrence.id);
    const startsAt = dateTime(occurrence.start_date_time);
    if (!startsAt) return [];

    const tickets = Object.entries(occurrence.inventory || {}).flatMap(([ticketId, inventory]) => {
      const availableQuantity = Number(inventory.available_quantity || 0);
      if (!Number.isFinite(availableQuantity) || availableQuantity < 1) return [];

      return [{
        id: ticketId,
        title: ticketTitles.get(ticketId) || 'Event ticket',
        price: text(inventory.price_formatted)
          || display(inventory.price)
          || 'Price unavailable',
        availableQuantity,
      }];
    });

    return tickets.length ? [{
      id: occurrenceId,
      label: startsAt,
      venue: text(occurrence.venue_details),
      tickets,
    }] : [];
  });
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
  const primaryAction = primaryActionFor(record, vertical);

  return {
    ...toListingCard(record, vertical),
    description: text(record.description)
      || text(record.short_description)
      || 'No description has been provided for this listing.',
    facts: factsFor(record, vertical),
    primaryActionLabel: primaryAction.label,
    primaryActionDescription: primaryAction.description,
    servicePackages: vertical === 'services' ? servicePackagesFor(record) : [],
    isRentalProperty: vertical === 'properties' && nested(record.status, 'is_rental') === true,
    eventOccurrences: vertical === 'events' ? eventOccurrencesFor(record) : [],
  };
}
