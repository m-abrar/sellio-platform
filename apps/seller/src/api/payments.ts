import { apiClient, extractListData } from '../lib/apiClient';

export const getPayments = async () => {
  const response = await apiClient.get('/dashboard/partner/payments');
  const records = extractListData<Record<string, unknown>>(response);

  return {
    data: records,
  };
};
