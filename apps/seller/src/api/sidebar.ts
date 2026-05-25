import { apiClient, unwrapData } from '../lib/apiClient';

interface ActivityModule {
  name: string;
  count: number;
}

interface ActivityResponse {
  modules?: ActivityModule[];
}

const moduleCountMap: Record<string, string> = {
  Properties: 'activity_properties',
  Events: 'activity_events',
  Autos: 'activity_autos',
  Jobs: 'activity_joblistings',
  Services: 'activity_services',
  Classifieds: 'activity_classifieds',
};

export const getSidebarCounts = async () => {
  const response = await apiClient.get('/dashboard/partner/activities');
  const payload = unwrapData<ActivityResponse>(response);

  const counts: Record<string, number> = {
    activity_properties: 0,
    activity_events: 0,
    activity_autos: 0,
    activity_joblistings: 0,
    activity_services: 0,
    activity_classifieds: 0,
    activity_products: 0,
    customers: 0,
    reviews: 0,
    messages: 0,
    notifications: 0,
    wallet: 0,
    payouts: 0,
    memberships: 0,
    analytics: 0,
  };

  for (const module of payload.modules ?? []) {
    const key = moduleCountMap[module.name];
    if (key) {
      counts[key] = module.count;
    }
  }

  return { data: counts };
};
