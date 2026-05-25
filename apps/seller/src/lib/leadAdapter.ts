const listingTitle = (record: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const relation = record[key] as Record<string, unknown> | undefined;
    if (relation?.title && typeof relation.title === 'string') {
      return relation.title;
    }
  }

  return 'Listing';
};

const customerName = (record: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }

    const relation = record[key] as Record<string, unknown> | undefined;
    if (relation?.name && typeof relation.name === 'string') {
      return relation.name;
    }
  }

  return 'Customer';
};

const formatStatus = (status: unknown): string => {
  if (typeof status !== 'string' || !status) {
    return 'Pending';
  }

  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const formatAmount = (value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return String(value);
  }

  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const formatDate = (value: unknown): string => {
  if (!value) {
    return '—';
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export interface ActivityListItem {
  id: number;
  asset: string;
  customer: string;
  status: string;
  amount: string;
  date: string;
  raw: Record<string, unknown>;
}

export const normalizeLeadRecord = (
  record: Record<string, unknown>,
  module?: string,
  type?: string,
): ActivityListItem => {
  const id = Number(record.id ?? 0);

  if (module === 'properties' && type === 'bookings') {
    return {
      id,
      asset: listingTitle(record, ['property']),
      customer: customerName(record, ['full_name', 'user']),
      status: formatStatus(record.status),
      amount: formatAmount(record.total_price),
      date: formatDate(record.created_at),
      raw: record,
    };
  }

  if (module === 'properties' && type === 'visits') {
    return {
      id,
      asset: listingTitle(record, ['property']),
      customer: customerName(record, ['full_name', 'user']),
      status: formatStatus(record.status),
      amount: '—',
      date: formatDate(record.scheduled_at ?? record.created_at),
      raw: record,
    };
  }

  if (module === 'autos' && type === 'inquiries') {
    return {
      id,
      asset: listingTitle(record, ['auto']),
      customer: customerName(record, ['full_name', 'user']),
      status: formatStatus(record.status),
      amount: '—',
      date: formatDate(record.created_at),
      raw: record,
    };
  }

  if (module === 'events' && type === 'bookings') {
    return {
      id,
      asset: listingTitle(record, ['event']),
      customer: customerName(record, ['full_name', 'user']),
      status: formatStatus(record.status),
      amount: formatAmount(record.total_price),
      date: formatDate(record.created_at),
      raw: record,
    };
  }

  if (module === 'services' && type === 'quotes') {
    return {
      id,
      asset: listingTitle(record, ['service']),
      customer: customerName(record, ['full_name', 'user']),
      status: formatStatus(record.status),
      amount: formatAmount(record.quoted_price),
      date: formatDate(record.created_at),
      raw: record,
    };
  }

  if (module === 'services' && type === 'appointments') {
    return {
      id,
      asset: listingTitle(record, ['service']),
      customer: customerName(record, ['full_name', 'user']),
      status: formatStatus(record.status),
      amount: formatAmount(record.price),
      date: formatDate(record.scheduled_at ?? record.created_at),
      raw: record,
    };
  }

  if (module === 'joblistings' && type === 'applications') {
    return {
      id,
      asset: listingTitle(record, ['job', 'job_listing']),
      customer: customerName(record, ['full_name', 'user']),
      status: formatStatus(record.status),
      amount: '—',
      date: formatDate(record.created_at),
      raw: record,
    };
  }

  if (module === 'classifieds' && type === 'inquiries') {
    return {
      id,
      asset: listingTitle(record, ['classifiedad', 'classified']),
      customer: customerName(record, ['full_name', 'user']),
      status: formatStatus(record.status),
      amount: '—',
      date: formatDate(record.created_at),
      raw: record,
    };
  }

  return {
    id,
    asset: listingTitle(record, ['property', 'auto', 'event', 'service', 'job', 'classifiedad']),
    customer: customerName(record, ['full_name', 'user']),
    status: formatStatus(record.status),
    amount: formatAmount(record.total_price ?? record.quoted_price ?? record.price),
    date: formatDate(record.created_at),
    raw: record,
  };
};
