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

  return {
    id: Number(record.id ?? 0),
    sender: typeof user?.name === 'string' ? user.name : 'Customer',
    subject: typeof record.subject === 'string' ? record.subject : 'Conversation',
    preview: typeof message?.body === 'string' ? message.body : 'No messages yet',
    date: formatDate(message?.created_at ?? record.updated_at),
    unread: Boolean(record.unread_count ?? record.unread ?? false),
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
