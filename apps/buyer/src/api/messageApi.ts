import { apiRequest, buyerUrl } from './apiClient';

export const fetchMessages = async () => {
  const payload = await apiRequest<any>(buyerUrl('/messages'), { authenticated: true });
  return (payload?.messages || []).map((message: any) => ({
    id: message.id,
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    content: message.content || message.body,
    created_at: message.created_at,
  }));
};

export const fetchConversations = async () => {
  const payload = await apiRequest<any>(buyerUrl('/messages'), { authenticated: true });
  return (payload?.conversations || []).map((conversation: any) => {
    const participant = conversation.partner || conversation.user || {};
    return {
      id: conversation.id,
      name: participant.name || `Conversation #${conversation.id}`,
      avatar: participant.avatar_url || participant.avatar,
      lastMessage: conversation.last_message?.body || conversation.lastMessage?.content || '',
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
  return {
    id: message?.id || Date.now(),
    sender_id: message?.sender_id,
    receiver_id: message?.receiver_id,
    content: message?.body || content,
    created_at: message?.created_at || new Date().toISOString(),
  };
};
