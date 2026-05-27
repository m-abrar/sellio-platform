import { apiRequest, buyerUrl } from './apiClient';

function toMessage(message: any) {
  return {
    id: message.id,
    conversation_id: message.conversation_id,
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    content: message.content || message.body,
    created_at: message.created_at,
  };
}

export const fetchMessages = async (conversationId?: number | string) => {
  const payload = await apiRequest<any>(
    buyerUrl(conversationId ? `/messages/${conversationId}` : '/messages'),
    { authenticated: true },
  );

  return (payload?.messages || []).map((message: any) => ({
    ...toMessage(message),
  }));
};

export const fetchConversations = async () => {
  const payload = await apiRequest<any>(buyerUrl('/messages'), { authenticated: true });
  const currentUserId = payload?.user?.id;

  return (payload?.conversations || []).map((conversation: any) => {
    const participant =
      conversation.partner_id === currentUserId
        ? conversation.user || {}
        : conversation.partner || conversation.user || {};

    return {
      id: conversation.id,
      name: participant.name || `Conversation #${conversation.id}`,
      avatar: participant.avatar_url || participant.avatar,
      lastMessage: conversation.last_message?.body || conversation.lastMessage?.body || conversation.last_message?.content || conversation.lastMessage?.content || '',
      time: conversation.updated_at,
      unread: conversation.unread_count || 0,
    };
  });
};

export const sendMessage = async (content: string, receiverId: number) => {
  const payload = await apiRequest<any>(buyerUrl(`/messages/${receiverId}`), {
    method: 'POST',
    authenticated: true,
    body: JSON.stringify({ body: content }),
  });

  const message = payload?.message || payload;

  return message?.id ? toMessage(message) : {
    id: Date.now(),
    conversation_id: receiverId,
    sender_id: undefined,
    receiver_id: undefined,
    content: message?.body || content,
    created_at: message?.created_at || new Date().toISOString(),
  };
};
