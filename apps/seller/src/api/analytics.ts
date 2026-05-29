import { apiClient, unwrapData } from '../lib/apiClient';

export interface AnalyticsChartPoint {
  name: string;
  views: number;
  leads: number;
}

export interface DetailedListingPerformance {
  title: string;
  type: string;
  id: number;
  views: number;
  leads: number;
  revenue: number;
  conversion_rate: string;
}

export interface AnalyticsPayload {
  performanceData: {
    total_views: number;
    total_leads: number;
    conversion_rate: string;
    avg_response_time: string;
  };
  totalEarnings: number;
  chartData: {
    labels: string[];
    datasets: Array<{ label: string; data: number[] }>;
  };
  days: number;
  verticalsData?: Record<string, {
    views: number;
    leads: number;
    conversion_rate: string;
    chartPoints: Array<{ name: string; views: number; leads: number }>;
  }>;
  detailedPerformance?: DetailedListingPerformance[];
}

export const getAnalytics = async (period = 30) => {
  const response = await apiClient.get('/dashboard/partner/analytics', {
    params: { period },
  });

  const payload = unwrapData<AnalyticsPayload>(response);
  const views = payload.chartData?.datasets?.[0]?.data ?? [];
  const leads = payload.chartData?.datasets?.[1]?.data ?? [];
  const labels = payload.chartData?.labels ?? [];

  const chartPoints: AnalyticsChartPoint[] = labels.map((label, index) => ({
    name: label,
    views: Number(views[index] ?? 0),
    leads: Number(leads[index] ?? 0),
  }));

  return {
    data: {
      ...payload,
      chartPoints,
    },
  };
};

export interface ListingAnalyticsPayload {
  listing: {
    id: number;
    title: string;
    slug: string;
    type: string;
  };
  performanceData: {
    total_views: number;
    total_leads: number;
    conversion_rate: string;
    total_revenue: number;
  };
  chartPoints: Array<{ name: string; views: number; leads: number }>;
}

export const getListingAnalytics = async (type: string, id: number | string, period = 30) => {
  const response = await apiClient.get(`/dashboard/partner/analytics/listing/${type}/${id}`, {
    params: { period },
  });
  return unwrapData<ListingAnalyticsPayload>(response);
};
