import { apiClient, unwrapData } from '../lib/apiClient';

export interface AnalyticsChartPoint {
  name: string;
  views: number;
  leads: number;
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
