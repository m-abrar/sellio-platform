import { apiClient, extractListData } from '../lib/apiClient';
import { normalizePayoutRecord } from '../lib/walletAdapter';

export const getPayments = async () => {
  const response = await apiClient.get('/dashboard/partner/payments');
  const records = extractListData<Record<string, unknown>>(response);

  return {
    data: records,
  };
};

export const getPayouts = async () => {
  const response = await apiClient.get('/dashboard/partner/wallet/history', {
    params: { per_page: 50 },
  });

  const records = extractListData<Record<string, unknown>>(response).filter(
    (record) => String(record.type) === 'withdraw',
  );

  return {
    data: {
      data: records.map(normalizePayoutRecord),
    },
  };
};
