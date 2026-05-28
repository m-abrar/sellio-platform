import { apiClient, extractListData } from '../lib/apiClient';

export interface CustomerListItem {
  id: number;
  key: string;
  name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: string;
  status: string;
  joined: string;
  avatar_url?: string | null;
  last_interaction_at?: string | null;
  interactions?: Array<Record<string, unknown>>;
}

export const getCustomers = async () => {
  const response = await apiClient.get('/dashboard/partner/customers/');
  const customers = extractListData<CustomerListItem>(response);

  return {
    data: {
      data: customers,
    },
    meta: response.data.meta,
  };
};

export const getCustomerById = async (id: string) => {
  const response = await apiClient.get(`/dashboard/partner/customers/${encodeURIComponent(id)}`);
  const customer = response.data.data as CustomerListItem;

  return customer ? { data: customer } : null;
};

export const getCustomerByKey = async (key: string) => getCustomerById(key);
