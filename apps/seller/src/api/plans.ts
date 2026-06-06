import { apiClient, extractListData, unwrapData } from '../lib/apiClient';
import { normalizePlan, normalizeSubscription } from '../lib/planAdapter';

export const getPlans = async () => {
  const response = await apiClient.get('/dashboard/partner/plans');
  const records = extractListData<Record<string, unknown>>(response);

  return {
    data: records,
  };
};

export const getSubscriptions = async () => {
  const response = await apiClient.get('/dashboard/partner/subscriptions');
  const records = extractListData<Record<string, unknown>>(response);

  return {
    data: records.map(normalizeSubscription),
  };
};

export const confirmSubscriptionCheckout = async (sessionId: string) => {
  const response = await apiClient.get('/dashboard/partner/subscriptions/confirm', {
    params: { session_id: sessionId },
  });

  const payload = unwrapData<Record<string, unknown>>(response);

  return {
    message: response.data.message,
    checkoutUrl: typeof payload?.checkout_url === 'string' ? payload.checkout_url : null,
  };
};

export const subscribeToPlan = async (planId: number) => {
  const response = await apiClient.get('/dashboard/partner/subscriptions/checkout', {
    params: { plan_id: planId },
  });

  const payload = unwrapData<Record<string, unknown>>(response);

  return {
    message: response.data.message,
    checkoutUrl: typeof payload?.checkout_url === 'string' ? payload.checkout_url : null,
  };
};

export const cancelSubscription = async (subscriptionId: number) => {
  const response = await apiClient.delete(`/dashboard/partner/subscriptions/${subscriptionId}`);

  return {
    message: response.data.message,
  };
};

export const getMembershipPlans = async () => {
  const [plansResponse, subscriptionsResponse] = await Promise.all([
    getPlans(),
    getSubscriptions(),
  ]);

  const activeSubscription = subscriptionsResponse.data.find(
    (subscription) => subscription.status === 'active' || subscription.status === 'on_trial',
  );

  const activePlanId = activeSubscription?.planId ?? null;

  return {
    data: {
      data: plansResponse.data.map((plan) => normalizePlan(plan, activePlanId)),
      activeSubscription,
    },
  };
};

export const getMembershipOverview = getMembershipPlans;
