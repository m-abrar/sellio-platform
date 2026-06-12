export function formatBookingDateLong(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return value;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function countBookingNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return 0;
  }

  const parse = (value: string) => {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) {
      return null;
    }

    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  };

  const start = parse(checkIn);
  const end = parse(checkOut);

  if (!start || !end) {
    return 0;
  }

  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatBookingDate(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    return value;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatBookingStayRange(
  checkIn: string,
  checkOut: string,
  guests?: number,
): string {
  const range = `${formatBookingDate(checkIn)} → ${formatBookingDate(checkOut)}`;

  if (guests == null) {
    return range;
  }

  return `${range} · ${guests} guest${guests === 1 ? '' : 's'}`;
}

export type PropertyBookingReserveParams = {
  propertyId: number;
  checkIn: string;
  checkOut: string;
  guests?: number;
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
};

export function buildPropertyBookingReserveUrl(
  themeLink: (path: string) => string,
  params: PropertyBookingReserveParams,
): string {
  const search = new URLSearchParams({
    property_id: String(params.propertyId),
    check_in: params.checkIn,
    check_out: params.checkOut,
    guests: String(params.guests ?? 2),
    full_name: params.fullName.trim(),
    email: params.email.trim(),
    phone: params.phone?.trim() ?? '',
  });

  if (params.message?.trim()) {
    search.set('message', params.message.trim());
  }

  return themeLink(`/booking/reserve?${search}`);
}

export function redirectToPropertyBookingReserve(
  themeLink: (path: string) => string,
  params: PropertyBookingReserveParams,
): void {
  window.location.assign(buildPropertyBookingReserveUrl(themeLink, params));
}
