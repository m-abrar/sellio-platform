import { apiClient, unwrapData } from '../lib/apiClient';
import { normalizeConversation, normalizeThreadMessage } from '../lib/messageAdapter';

export const getConversations = async () => {
  const response = await apiClient.get('/dashboard/partner/messages/');
  const payload = unwrapData<{
    conversations?: Record<string, unknown>[];
    user?: Record<string, unknown>;
  }>(response);

  const partnerId = Number(payload.user?.id ?? 0);
  const conversations = (payload.conversations ?? []).map((record) =>
    normalizeConversation(record, partnerId),
  );

  return {
    data: {
      data: conversations,
      partnerId,
    },
  };
};

export const getMessages = getConversations;

export const getConversationThread = async (conversationId: number) => {
  const response = await apiClient.get(`/dashboard/partner/messages/${conversationId}`);
  const payload = unwrapData<{
    activeConversation?: Record<string, unknown>;
    messages?: Record<string, unknown>[];
    user?: Record<string, unknown>;
  }>(response);

  const partnerId = Number(payload.user?.id ?? 0);

  return {
    data: {
      conversation: payload.activeConversation
        ? normalizeConversation(payload.activeConversation, partnerId)
        : null,
      messages: (payload.messages ?? []).map((message) => normalizeThreadMessage(message, partnerId)),
      partnerId,
    },
  };
};

export const sendMessage = async (conversationId: number, body: string) => {
  const response = await apiClient.post(`/dashboard/partner/messages/${conversationId}`, { body });

  return {
    data: unwrapData(response),
    message: response.data.message,
  };
};
