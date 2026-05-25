import { apiClient, extractListData } from '../lib/apiClient';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  route?: string | null;
}

export const getNotifications = async (unreadOnly = false) => {
  const response = await apiClient.get('/dashboard/partner/notifications/', {
    params: unreadOnly ? { unread: 1 } : undefined,
  });

  const notifications = extractListData<NotificationItem>(response);

  return {
    data: {
      data: notifications,
    },
    meta: response.data.meta,
  };
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await apiClient.patch(`/dashboard/partner/notifications/${notificationId}/read`);

  return {
    data: response.data.data,
    message: response.data.message,
  };
};

export const markAllNotificationsAsRead = async () => {
  const response = await apiClient.post('/dashboard/partner/notifications/read-all');

  return {
    data: response.data.data,
    message: response.data.message,
  };
};

export const deleteNotification = async (notificationId: string) => {
  const response = await apiClient.delete(`/dashboard/partner/notifications/${notificationId}`);

  return {
    message: response.data.message,
  };
};
