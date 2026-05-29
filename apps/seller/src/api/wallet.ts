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

export const withdrawFunds = async (amount: number, payoutMethodId: string | number) => {
  const response = await apiClient.post('/dashboard/partner/wallet/withdraw', { 
    amount,
    payout_method_id: payoutMethodId,
  });
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

export const getPayoutMethods = async () => {
  const response = await apiClient.get('/dashboard/partner/payout-methods');
  return {
    data: extractListData<Record<string, unknown>>(response),
  };
};

export const createPayoutMethod = async (type: string, details: Record<string, any>) => {
  const response = await apiClient.post('/dashboard/partner/payout-methods', {
    type,
    details,
  });
  return {
    data: unwrapData(response),
    message: response.data.message,
  };
};

export const deletePayoutMethod = async (id: string | number) => {
  const response = await apiClient.delete(`/dashboard/partner/payout-methods/${id}`);
  return {
    message: response.data.message,
  };
};

export const setPrimaryPayoutMethod = async (id: string | number) => {
  const response = await apiClient.patch(`/dashboard/partner/payout-methods/${id}/primary`);
  return {
    data: unwrapData(response),
    message: response.data.message,
  };
};

export const depositFunds = async (amount: number, cardDetails?: any) => {
  const response = await apiClient.post('/dashboard/partner/wallet/deposit', {
    amount,
    card_details: cardDetails,
  });
  return {
    data: unwrapData(response),
    message: response.data.message,
  };
};
