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
