import type { EventTicketDataMap } from '@sellio/types';

export type EventTicketOption = {
  occurrenceId: number;
  occurrenceLabel: string;
  ticketTypeId: number;
  ticketName: string;
  price: number;
  available: number;
};

export function buildEventTicketOptions(ticketData: EventTicketDataMap): EventTicketOption[] {
  return Object.entries(ticketData).flatMap(([occurrenceId, occurrence]) =>
    occurrence.inventory.map((item) => ({
      occurrenceId: Number(occurrenceId),
      occurrenceLabel: occurrence.start_date_formatted,
      ticketTypeId: item.id,
      ticketName: item.name,
      price: item.price,
      available: item.available,
    })),
  );
}

export function eventTicketOptionKey(option: EventTicketOption): string {
  return `${option.occurrenceId}-${option.ticketTypeId}`;
}

export function getFirstEventTicketOption(
  ticketData: EventTicketDataMap | undefined,
): EventTicketOption | null {
  if (!ticketData) {
    return null;
  }

  const options = buildEventTicketOptions(ticketData).filter((option) => option.available > 0);
  return options[0] ?? buildEventTicketOptions(ticketData)[0] ?? null;
}
