export interface WalletOverview {
  balance: number;
  lifetimeEarnings: number;
  pendingWithdrawals: number;
}

export interface WalletTransaction {
  id: number;
  type: 'earning' | 'payout' | 'refund';
  title: string;
  amount: string;
  date: string;
  status: string;
}

const formatDate = (value: unknown): string => {
  if (!value) {
    return '—';
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const normalizeWalletOverview = (payload: Record<string, unknown>): WalletOverview => ({
  balance: Number(payload.balance ?? 0),
  lifetimeEarnings: Number(payload.lifetimeEarnings ?? 0),
  pendingWithdrawals: Number(payload.pendingWithdrawals ?? 0),
});

export const normalizeWalletTransaction = (record: Record<string, unknown>): WalletTransaction => {
  const type = String(record.type ?? '');
  const amountValue = Number(record.amount ?? 0);
  const meta = (record.meta ?? {}) as Record<string, unknown>;
  const isWithdrawal = type === 'withdraw';
  const isDeposit = type === 'deposit';

  let uiType: WalletTransaction['type'] = 'refund';
  if (isDeposit) {
    uiType = 'earning';
  } else if (isWithdrawal) {
    uiType = 'payout';
  }

  const signedAmount = isDeposit
    ? `+$${Math.abs(amountValue).toFixed(2)}`
    : `-$${Math.abs(amountValue).toFixed(2)}`;

  const title =
    (typeof meta.description === 'string' && meta.description) ||
    (typeof meta.title === 'string' && meta.title) ||
    (isWithdrawal ? 'Withdrawal Request' : isDeposit ? 'Wallet Deposit' : 'Wallet Transaction');

  return {
    id: Number(record.id ?? 0),
    type: uiType,
    title,
    amount: signedAmount,
    date: formatDate(record.created_at),
    status: record.confirmed ? 'Completed' : 'Pending',
  };
};

export interface PayoutRecord {
  id: number;
  amount: string;
  status: string;
  date: string;
  method: string;
}

export const normalizePayoutRecord = (record: Record<string, unknown>): PayoutRecord => {
  const amountValue = Number(record.amount ?? 0);
  const meta = record.meta as Record<string, unknown> | undefined;
  const method = typeof meta?.method === 'string' ? meta.method : 'Wallet Withdrawal';

  return {
    id: Number(record.id ?? 0),
    amount: `$${Math.abs(amountValue).toFixed(2)}`,
    status: record.confirmed ? 'Completed' : 'Pending',
    date: formatDate(record.created_at),
    method,
  };
};
