export interface WalletOverview {
  balance: number;
  lifetimeEarnings: number;
  approvedPayouts: number;
  pendingPayouts: number;
  rejectedPayouts: number;
}

export interface WalletTransaction {
  id: number;
  type: 'earning' | 'payout' | 'refund';
  title: string;
  amount: string;
  date: string;
  status: string;
  payable_type?: string;
  payable_id?: number;
  meta?: Record<string, unknown>;
  url?: string;
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
  approvedPayouts: Number(payload.approvedPayouts ?? 0),
  pendingPayouts: Number(payload.pendingPayouts ?? 0),
  rejectedPayouts: Number(payload.rejectedPayouts ?? 0),
});

export const normalizeWalletTransaction = (record: Record<string, unknown>): WalletTransaction => {
  const type = String(record.type ?? '');
  const amountValue = Number(record.amount ?? 0);
  const meta = (record.meta ?? {}) as Record<string, unknown>;
  const isWithdrawal = type === 'withdraw';
  const isDeposit = type === 'deposit';

  let uiType: WalletTransaction['type'] = 'refund';
  const isRefund = isDeposit && (
    meta.type === 'withdrawal_refund' ||
    String(meta.description || '').toLowerCase().includes('refund')
  );

  if (isRefund) {
    uiType = 'refund';
  } else if (isDeposit) {
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

  const rawStatus = typeof record.status === 'string' ? record.status : '';
  let statusText = 'Pending';
  if (rawStatus === 'approved') {
    statusText = 'Approved';
  } else if (rawStatus === 'completed') {
    statusText = 'Completed';
  } else if (rawStatus === 'rejected') {
    statusText = 'Rejected';
  } else if (rawStatus === 'pending') {
    statusText = 'Pending';
  } else {
    statusText = record.confirmed ? 'Completed' : 'Pending';
  }

  const payableType = record.payable_type ? String(record.payable_type) : '';
  const payableId = record.payable_id ? Number(record.payable_id) : 0;
  
  let resolvedType = payableType.replace(/^App\\Models\\/, '');
  let resolvedId = payableId;
  
  if (!resolvedType && meta.description && typeof meta.description === 'string') {
    const match = meta.description.match(/Payment completed for (\w+) #(\d+)/i);
    if (match) {
      resolvedType = match[1];
      resolvedId = Number(match[2]);
    }
  }

  let url: string | undefined = undefined;

  if (resolvedType && resolvedId) {
    if (resolvedType === 'PropertyBooking') {
      url = `/dashboard/properties/bookings/${resolvedId}`;
    } else if (resolvedType === 'EventBooking') {
      url = `/dashboard/events/bookings/${resolvedId}`;
    } else if (resolvedType === 'Order') {
      url = `/dashboard/products/orders/${resolvedId}`;
    } else if (resolvedType === 'Subscription') {
      url = `/dashboard/memberships`;
    }
  } else if (type === 'withdraw' || uiType === 'payout') {
    url = `/dashboard/wallet`;
  }

  return {
    id: Number(record.id ?? 0),
    type: uiType,
    title,
    amount: signedAmount,
    date: formatDate(record.created_at),
    status: statusText,
    payable_type: record.payable_type ? String(record.payable_type) : undefined,
    payable_id: record.payable_id ? Number(record.payable_id) : undefined,
    meta: meta,
    url,
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

  const rawStatus = typeof record.status === 'string' ? record.status : '';
  let statusText = 'Pending';
  if (rawStatus === 'approved') {
    statusText = 'Approved';
  } else if (rawStatus === 'completed') {
    statusText = 'Completed';
  } else if (rawStatus === 'rejected') {
    statusText = 'Rejected';
  } else if (rawStatus === 'pending') {
    statusText = 'Pending';
  } else {
    statusText = record.confirmed ? 'Completed' : 'Pending';
  }

  return {
    id: Number(record.id ?? 0),
    amount: `$${Math.abs(amountValue).toFixed(2)}`,
    status: statusText,
    date: formatDate(record.created_at),
    method,
  };
};
