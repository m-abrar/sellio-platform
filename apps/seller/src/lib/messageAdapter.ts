const formatDate = (value: unknown): string => {
  if (!value) {
    return '—';
  }

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export interface ConversationListItem {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  avatarUrl?: string | null;
  inquiriable?: {
    id: number;
    title: string;
    slug: string;
    type: string;
    price?: string;
    image?: string | null;
    details?: string;
    viewUrl?: string;
  } | null;
}

export interface ThreadMessage {
  id: number;
  body: string;
  senderId: number;
  createdAt: string;
  isMine: boolean;
}

export const normalizeConversation = (
  record: Record<string, unknown>,
  partnerId: number,
): ConversationListItem => {
  const user = record.user as Record<string, unknown> | undefined;
  const lastMessage = record.last_message as Record<string, unknown> | undefined;
  const lastMessageAlt = record.lastMessage as Record<string, unknown> | undefined;
  const message = lastMessage ?? lastMessageAlt;
  const inquiriable = record.inquiriable as Record<string, any> | undefined;

  let inquiriableData = null;
  if (inquiriable) {
    // Resolve vertical type label
    const rawType = String(inquiriable.type_label ?? record.inquiriable_type ?? 'Listing');
    let typeLabel = 'Listing';
    let vertical = 'products';

    if (rawType.includes('Property')) {
      typeLabel = 'Property';
      vertical = 'properties';
    } else if (rawType.includes('Auto') || rawType.includes('Vehicle')) {
      typeLabel = 'Auto';
      vertical = 'autos';
    } else if (rawType.includes('Event')) {
      typeLabel = 'Event';
      vertical = 'events';
    } else if (rawType.includes('Service')) {
      typeLabel = 'Service';
      vertical = 'services';
    } else if (rawType.includes('Job')) {
      typeLabel = 'JobListing';
      vertical = 'joblistings';
    } else if (rawType.includes('Classified')) {
      typeLabel = 'Classified';
      vertical = 'classifieds';
    } else if (rawType.includes('Product')) {
      typeLabel = 'Product';
      vertical = 'products';
    }

    // Resolve price formatting
    let price = '—';
    if (inquiriable.pricing?.price_formatted) {
      price = inquiriable.pricing.price_formatted;
    } else if (inquiriable.pricing?.formatted) {
      price = inquiriable.pricing.formatted;
    } else if (inquiriable.base_price) {
      price = `$${Number(inquiriable.base_price).toLocaleString()}`;
    } else if (inquiriable.salary_formatted) {
      price = inquiriable.salary_formatted;
    } else if (inquiriable.price_formatted) {
      price = inquiriable.price_formatted;
    }

    // Resolve image
    let image = null;
    const media = inquiriable.media ?? [];
    if (inquiriable.featured_image) {
      image = inquiriable.featured_image;
    } else if (Array.isArray(media) && media.length > 0) {
      image = media[0]?.original_url ?? media[0]?.url ?? null;
    }

    inquiriableData = {
      id: Number(inquiriable.id ?? 0),
      title: typeof inquiriable.title === 'string' ? inquiriable.title : (typeof inquiriable.name === 'string' ? inquiriable.name : 'Untitled Listing'),
      slug: typeof inquiriable.slug === 'string' ? inquiriable.slug : '',
      type: typeLabel,
      price,
      image,
      details: inquiriable.short_description ?? inquiriable.description ?? '',
      viewUrl: `/dashboard/${vertical}/edit/${inquiriable.slug}`,
    };
  }

  return {
    id: Number(record.id ?? 0),
    sender: typeof user?.name === 'string' ? user.name : 'Customer',
    subject: typeof record.subject === 'string' ? record.subject : 'Conversation',
    preview: typeof message?.body === 'string' ? message.body : 'No messages yet',
    date: formatDate(message?.created_at ?? record.updated_at),
    unread: Boolean(record.unread_count ?? record.unread ?? false),
    avatarUrl: typeof user?.avatar_url === 'string' ? user.avatar_url : null,
    inquiriable: inquiriableData,
  };
};

export const normalizeThreadMessage = (
  record: Record<string, unknown>,
  partnerId: number,
): ThreadMessage => ({
  id: Number(record.id ?? 0),
  body: typeof record.body === 'string' ? record.body : '',
  senderId: Number(record.sender_id ?? 0),
  createdAt: formatDate(record.created_at),
  isMine: Number(record.sender_id ?? 0) === partnerId,
});
