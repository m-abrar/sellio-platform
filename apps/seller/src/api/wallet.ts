import { apiClient, extractListData, unwrapData } from '../lib/apiClient';
import { normalizeWalletOverview, normalizeWalletTransaction } from '../lib/walletAdapter';

export const getWallet = async () => {
  const response = await apiClient.get('/dashboard/partner/wallet/overview');
  const overview = normalizeWalletOverview(unwrapData<Record<string, unknown>>(response));
  const rawTransactions = unwrapData<Record<string, unknown>>(response).transactions;
  const transactions = Array.isArray(rawTransactions)
    ? rawTransactions.map((record) => normalizeWalletTransaction(record as Record<string, unknown>))
    : [];

  return {
    data: {
      ...overview,
      pending_balance: overview.pendingPayouts,
      transactions,
    },
  };
};

export const withdrawFunds = async (amount: number) => {
  const response = await apiClient.post('/dashboard/partner/wallet/withdraw', { amount });
  return {
    data: unwrapData(response),
    message: response.data.message,
  };
};

export const getWalletHistory = async () => {
  const response = await apiClient.get('/dashboard/partner/wallet/history');
  const records = extractListData<Record<string, unknown>>(response);

  return {
    data: {
      data: records.map(normalizeWalletTransaction),
    },
  };
};
