const formatRelativeDate = (value: unknown): string => {
  if (!value) {
    return '—';
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    return 'Just now';
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export interface ReviewListItem {
  id: number;
  customer: string;
  avatar_url?: string | null;
  rating: number;
  comment: string;
  asset: string;
  date: string;
  partnerReply?: string | null;
}

export const normalizeReview = (record: Record<string, unknown>): ReviewListItem => {
  const user = record.user as Record<string, unknown> | undefined;
  const reviewable = record.reviewable as Record<string, unknown> | undefined;

  return {
    id: Number(record.id ?? 0),
    customer: typeof user?.name === 'string' ? user.name : 'Customer',
    avatar_url: typeof user?.avatar_url === 'string' ? user.avatar_url : null,
    rating: Number(record.rating ?? 0),
    comment: typeof record.comment === 'string' ? record.comment : '',
    asset: typeof reviewable?.title === 'string' ? reviewable.title : 'Listing',
    date: formatRelativeDate(record.created_at),
    partnerReply: typeof record.partner_reply === 'string' ? record.partner_reply : null,
  };
};
