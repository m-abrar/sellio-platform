export type EventBookingReserveParams = {
  eventId: number;
  occurrenceId: number;
  ticketTypeId: number;
  quantity?: number;
  fullName: string;
  email: string;
  phone?: string;
};

export function buildEventBookingReserveUrl(
  themeLink: (path: string) => string,
  params: EventBookingReserveParams,
): string {
  const search = new URLSearchParams({
    event_id: String(params.eventId),
    event_occurrence_id: String(params.occurrenceId),
    event_ticket_type_id: String(params.ticketTypeId),
    quantity: String(params.quantity ?? 1),
    full_name: params.fullName.trim(),
    email: params.email.trim(),
  });

  if (params.phone?.trim()) {
    search.set('phone', params.phone.trim());
  }

  return themeLink(`/booking/reserve?${search}`);
}

export function redirectToEventBookingReserve(
  themeLink: (path: string) => string,
  params: EventBookingReserveParams,
): void {
  window.location.assign(buildEventBookingReserveUrl(themeLink, params));
}
