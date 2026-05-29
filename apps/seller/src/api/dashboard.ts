import { apiClient, unwrapData } from '../lib/apiClient';
import { mapRecentListing } from '../lib/productAdapter';

interface PartnerWelcomeResponse {
  performanceData?: {
    total_views?: number;
    total_leads?: number;
    conversion_rate?: string | number;
  };
  earningChangeData?: {
    total?: number;
    currency_symbol?: string;
  };
  healthScoreData?: {
    score?: number;
    statusText?: string;
  };
  recentListings?: unknown[];
  partner?: {
    properties_count?: number;
    products_count?: number;
    autos_count?: number;
    events_count?: number;
    jobs_count?: number;
    services_count?: number;
    classifieds_count?: number;
    properties?: unknown[];
    products?: unknown[];
    autos?: unknown[];
    events?: unknown[];
    services?: unknown[];
    jobs?: unknown[];
    classifieds?: unknown[];
  };
  extraStats?: {
    unread_notifications?: number;
    unread_messages?: number;
    total_payouts?: number;
    lifetime_earnings?: number;
    wallet_balance?: number;
  };
}

export const getDashboardData = async () => {
  const [welcomeRes, analyticsRes] = await Promise.all([
    apiClient.get('/dashboard/partner/welcome'),
    apiClient.get('/dashboard/partner/analytics', { params: { period: 30 } }),
  ]);
  const payload = unwrapData<PartnerWelcomeResponse>(welcomeRes);
  const analyticsPayload = unwrapData<any>(analyticsRes);

  const recentListings = (payload.recentListings ?? []).map(mapRecentListing);

  // Calculate total active inventory counts from backend counts
  const activeInventory = 
    (payload.partner?.properties_count ?? 0) +
    (payload.partner?.autos_count ?? 0) +
    (payload.partner?.products_count ?? 0) +
    (payload.partner?.events_count ?? 0) +
    (payload.partner?.services_count ?? 0) +
    (payload.partner?.classifieds_count ?? 0) +
    (payload.partner?.jobs_count ?? 0);

  return {
    data: {
      stats: {
        activeInventory: activeInventory > 0 ? activeInventory : recentListings.length,
        urgentAlerts: Number(payload.performanceData?.total_leads ?? 0),
        marketViews: Number(payload.performanceData?.total_views ?? 0),
        totalRevenue: Number(payload.extraStats?.lifetime_earnings ?? 0),
        moduleCounts: {
          properties: payload.partner?.properties_count ?? 0,
          autos: payload.partner?.autos_count ?? 0,
          products: payload.partner?.products_count ?? 0,
          jobs: payload.partner?.jobs_count ?? 0,
          events: payload.partner?.events_count ?? 0,
          services: payload.partner?.services_count ?? 0,
          classifieds: payload.partner?.classifieds_count ?? 0,
        },
        alerts: {
          messages: payload.extraStats?.unread_messages ?? 0,
          notifications: payload.extraStats?.unread_notifications ?? 0,
        },
        revenue: {
          earnings: Number(payload.extraStats?.lifetime_earnings ?? 0),
          payouts: payload.extraStats?.total_payouts ?? 0,
        },
      },
      healthScore: payload.healthScoreData,
      earningChange: {
        ...payload.earningChangeData,
        total: Number(payload.extraStats?.wallet_balance ?? 0),
      },
      performance: payload.performanceData,
      recentListings,
      verticalsData: analyticsPayload.verticalsData ?? null,
    },
  };
};
