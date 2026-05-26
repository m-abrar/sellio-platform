import { toActivity } from './adapters';
import { apiRequest, buyerUrl, collectionData } from './apiClient';

function activityEndpoint(type = 'booking', module?: string) {
  if (module === 'jobs') return '/inquiries/applications';
  if (module === 'autos') return '/inquiries/auto-inquiries';
  if (module === 'classifieds') return '/inquiries/classified-inquiries';
  if (module === 'services' && type === 'quote') return '/inquiries/service-quotes';
  if (module === 'services') return '/inquiries/service-appointments';
  return '/bookings';
}

function activityItems(payload: any, module?: string) {
  if (module === 'classifieds') return collectionData(payload?.inquiries || payload);
  return collectionData(payload?.bookings || payload);
}

export const fetchBookings = async (type: string = 'booking', module?: string) => {
  const payload = await apiRequest<any>(buyerUrl(activityEndpoint(type, module)), { authenticated: true });
  const items = activityItems(payload, module);
  return items.map((item, index) => toActivity(item, index, module || 'products'));
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
