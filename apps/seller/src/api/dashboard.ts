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
    properties?: unknown[];
    products?: unknown[];
    autos?: unknown[];
    events?: unknown[];
    services?: unknown[];
    jobs?: unknown[];
    classifieds?: unknown[];
  };
}

const countCollection = (value: unknown): number => {
  if (Array.isArray(value)) return value.length;
  return 0;
};

export const getDashboardData = async () => {
  const response = await apiClient.get('/dashboard/partner/welcome');
  const payload = unwrapData<PartnerWelcomeResponse>(response);

  const recentListings = (payload.recentListings ?? []).map(mapRecentListing);

  return {
    data: {
      stats: {
        activeInventory: recentListings.length,
        urgentAlerts: Number(payload.performanceData?.total_leads ?? 0),
        marketViews: Number(payload.performanceData?.total_views ?? 0),
        totalRevenue: Number(payload.earningChangeData?.total ?? 0),
        moduleCounts: {
          properties: countCollection(payload.partner?.properties),
          autos: countCollection(payload.partner?.autos),
          products: countCollection(payload.partner?.products),
          jobs: countCollection(payload.partner?.jobs),
        },
        alerts: {
          messages: 0,
          notifications: 0,
        },
        revenue: {
          earnings: Number(payload.earningChangeData?.total ?? 0),
          payouts: 0,
        },
      },
      healthScore: payload.healthScoreData,
      earningChange: payload.earningChangeData,
      performance: payload.performanceData,
      recentListings,
    },
  };
};
