import { apiRequest, buyerUrl, collectionData } from './apiClient';

export interface NotificationItem {
  id: string;
  type: 'order' | 'booking' | 'message' | 'favorite' | 'appointment' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export const fetchNotifications = async (unreadOnly = false): Promise<NotificationItem[]> => {
  const payload = await apiRequest<any>(
    buyerUrl(unreadOnly ? '/notifications?unread=1' : '/notifications'),
    { authenticated: true },
  );

  return collectionData(payload).map((n: any) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    date: n.date,
    read: n.read,
  }));
};

export const markNotificationAsRead = async (id: string): Promise<NotificationItem> => {
  const payload = await apiRequest<any>(
    buyerUrl(`/notifications/${id}/read`),
    { method: 'PATCH', authenticated: true },
  );

  return {
    id: payload.id,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    date: payload.date,
    read: payload.read,
  };
};

export const markAllNotificationsAsRead = async (): Promise<{ marked: number }> => {
  return await apiRequest<any>(
    buyerUrl('/notifications/read-all'),
    { method: 'POST', authenticated: true },
  );
};

export const deleteNotification = async (id: string): Promise<void> => {
  await apiRequest<void>(
    buyerUrl(`/notifications/${id}`),
    { method: 'DELETE', authenticated: true },
  );
};
