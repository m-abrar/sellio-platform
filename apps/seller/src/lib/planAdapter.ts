export interface MembershipPlan {
  id: number;
  name: string;
  price: string;
  features: string[];
  status: 'Current' | 'Available';
  planId?: number;
  subscriptionId?: number;
}

const billingLabel = (period?: unknown): string => {
  if (typeof period !== 'string' || !period) {
    return '/mo';
  }

  return period === 'yearly' ? '/yr' : '/mo';
};

export const normalizePlan = (
  record: Record<string, unknown>,
  activePlanId?: number | null,
): MembershipPlan => {
  const features: string[] = [];

  if (record.max_listings) {
    features.push(`${record.max_listings} listings`);
  } else {
    features.push('Unlimited listings');
  }

  if (record.priority_support) {
    features.push('Priority support');
  } else {
    features.push('Standard support');
  }

  if (record.analytics_access) {
    features.push('Analytics access');
  }

  if (record.custom_branding) {
    features.push('Custom branding');
  }

  const planId = Number(record.id ?? 0);
  const isCurrent = activePlanId != null && activePlanId === planId;

  return {
    id: planId,
    planId,
    name: typeof record.title === 'string' ? record.title : 'Plan',
    price: `$${Number(record.price ?? 0)}${billingLabel(record.billing_period)}`,
    features,
    status: isCurrent ? 'Current' : 'Available',
  };
};

export const normalizeSubscription = (record: Record<string, unknown>) => {
  const plan = record.plan as Record<string, unknown> | undefined;

  return {
    id: Number(record.id ?? 0),
    planId: Number(record.plan_id ?? plan?.id ?? 0),
    status: typeof record.status === 'string' ? record.status : 'active',
    title: typeof record.title === 'string' ? record.title : typeof plan?.title === 'string' ? plan.title : 'Subscription',
    plan,
  };
};
