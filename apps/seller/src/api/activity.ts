import { apiClient, extractListData, unwrapData } from '../lib/apiClient';
import { normalizeLeadRecord } from '../lib/leadAdapter';

const LEAD_ENDPOINTS: Record<string, Record<string, string>> = {
  properties: {
    bookings: '/dashboard/partner/leads/properties/bookings',
    visits: '/dashboard/partner/leads/properties/visits',
  },
  autos: {
    inquiries: '/dashboard/partner/leads/autos/inquiries',
  },
  events: {
    bookings: '/dashboard/partner/leads/events/bookings',
  },
  services: {
    quotes: '/dashboard/partner/leads/services/quotes',
    appointments: '/dashboard/partner/leads/services/appointments',
    inquiries: '/dashboard/partner/leads/services/quotes',
  },
  joblistings: {
    applications: '/dashboard/partner/leads/joblistings/applications',
  },
  classifieds: {
    inquiries: '/dashboard/partner/leads/classifieds/inquiries',
  },
};

const resolveLeadEndpoint = (module?: string, type?: string): string | null => {
  if (!module || !type) {
    return null;
  }

  return LEAD_ENDPOINTS[module]?.[type] ?? null;
};

export const getActivities = async (module?: string, type?: string) => {
  const endpoint = resolveLeadEndpoint(module, type);

  if (!endpoint) {
    return { data: { data: [] } };
  }

  const response = await apiClient.get(endpoint);
  const records = extractListData<Record<string, unknown>>(response);
  const items = records.map((record) => normalizeLeadRecord(record, module, type));

  return { data: { data: items } };
};

export const getActivityById = async (module: string | undefined, type: string | undefined, id: string) => {
  const baseEndpoint = resolveLeadEndpoint(module, type);
  
  if (baseEndpoint) {
    try {
      const response = await apiClient.get(`${baseEndpoint}/${id}`);
      const payload = unwrapData<any>(response);
      // Extract relation wrapper if exists, e.g. booking, inquiry, visit, quote, etc.
      const rawRecord = payload.booking || payload.inquiry || payload.visit || payload.application || payload.quote || payload.appointment || payload;
      const item = normalizeLeadRecord(rawRecord, module, type);
      return { data: item };
    } catch (error) {
      console.warn("Failed to fetch direct detail, falling back to list", error);
    }
  }

  const listResponse = await getActivities(module, type);
  const item = listResponse.data.data.find((entry) => String(entry.id) === String(id));

  return item ? { data: item } : null;
};

export const fetchAllLeadRecords = async (): Promise<Record<string, unknown>[]> => {
  const endpoints = Object.entries(LEAD_ENDPOINTS).flatMap(([module, types]) =>
    Object.entries(types).map(([type, endpoint]) => ({ module, type, endpoint })),
  );

  const uniqueEndpoints = [...new Map(endpoints.map((entry) => [entry.endpoint, entry])).values()];

  const responses = await Promise.all(
    uniqueEndpoints.map(async ({ endpoint, module, type }) => {
      try {
        const response = await apiClient.get(endpoint);
        return extractListData<Record<string, unknown>>(response).map((record) => ({
          ...record,
          __module: module,
          __type: type,
        }));
      } catch {
        return [];
      }
    }),
  );

  return responses.flat();
};
