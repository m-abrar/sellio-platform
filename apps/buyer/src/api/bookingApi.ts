import { STOREFRONT_BASE_URL } from '../config/api';
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
  if (payload && typeof payload === 'object') {
    if ('upcomingBookings' in payload || 'pastBookings' in payload) {
      return [
        ...collectionData(payload.upcomingBookings),
        ...collectionData(payload.pastBookings),
      ];
    }
  }
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
  void type;
  void bookingDate;
  // Redirect to Storefront product page for actual checkout
  window.location.assign(`${STOREFRONT_BASE_URL}/product/${encodeURIComponent(itemId)}`);
  return { id: 0, item_id: itemId, status };
};

export const cancelBooking = async (id: number, module?: string, type?: string) => {
  let endpoint = '';
  const cleanModule = module?.toLowerCase();

  if (cleanModule === 'jobs') {
    endpoint = `/inquiries/applications/${id}`;
  } else if (cleanModule === 'autos') {
    endpoint = `/inquiries/auto-inquiries/${id}`;
  } else if (cleanModule === 'classifieds') {
    endpoint = `/inquiries/classified-inquiries/${id}`;
  } else if (cleanModule === 'services' && type === 'quote') {
    endpoint = `/inquiries/service-quotes/${id}`;
  } else if (cleanModule === 'services') {
    endpoint = `/inquiries/service-appointments/${id}`;
  } else {
    endpoint = `/bookings/${id}`;
  }

  await apiRequest<any>(buyerUrl(endpoint), {
    method: 'DELETE',
    authenticated: true,
  });
};
