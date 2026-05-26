import { toActivity } from './adapters';
import { apiRequest, buyerUrl, collectionData } from './apiClient';

export const fetchBookings = async (type: string = 'booking') => {
  const payload = await apiRequest<any>(buyerUrl('/bookings'), { authenticated: true });
  const items = collectionData(payload?.bookings || payload);
  return items.map(toActivity);
};

export const createBuyerActivity = async ({
  itemId,
  type = 'booking',
  bookingDate,
  status = 'pending',
}: {
  itemId: string;
  type?: 'booking' | 'quote';
  bookingDate?: string;
  status?: 'pending' | 'confirmed';
}) => {
  void itemId;
  void type;
  void bookingDate;
  void status;

  throw new Error(
    'Buyer transaction creation needs the matching Laravel endpoint payload before it can be submitted.',
  );
};

export const cancelBooking = async (id: number) => {
  void id;
  throw new Error('Buyer activity cancellation is not exposed by the Laravel buyer API yet.');
};
