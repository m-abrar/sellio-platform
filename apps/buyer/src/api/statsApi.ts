import { apiRequest, buyerUrl } from './apiClient';

export const fetchUserStats = async () => {
  const payload = await apiRequest<any>(buyerUrl('/welcome'), { authenticated: true });
  const stats = payload?.stats || {};

  return {
    favoritesCount: Number(stats.favoritesCount ?? stats.totalFavorites ?? 0),
    bookingsCount: Number(stats.bookingsCount ?? stats.totalBookings ?? 0),
    messagesCount: Number(stats.messagesCount ?? stats.totalMessages ?? 0),
    appsCount: Number(stats.appsCount ?? stats.applicationsCount ?? 0),
    appointmentsCount: Number(stats.appointmentsCount ?? 0),
    quotesCount: Number(stats.quotesCount ?? 0),
    inquiriesCount: Number(stats.inquiriesCount ?? stats.activeInquiries ?? 0),
    classifiedsActivityCount: Number(stats.classifiedsActivityCount ?? 0),
    reviewsCount: Number(stats.reviewsCount ?? 0),
    propertiesCount: Number(stats.propertiesCount ?? 0),
    autosCount: Number(stats.autosCount ?? 0),
    eventsCount: Number(stats.eventsCount ?? 0),
    servicesCount: Number(stats.servicesCount ?? 0),
    jobsCount: Number(stats.jobsCount ?? 0),
    classifiedsCount: Number(stats.classifiedsCount ?? 0),
    productsCount: Number(stats.productsCount ?? 0),
    totalItemsCount: Number(stats.totalItemsCount ?? 0),
  };
};
