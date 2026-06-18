import { apiClient, unwrapData } from '../lib/apiClient';
import { normalizeConversation, normalizeThreadMessage } from '../lib/messageAdapter';

function threadQuery(options?: { bustCache?: boolean; skipRead?: boolean }): string {
  const params = new URLSearchParams();
  if (options?.skipRead) params.set('skip_read', '1');
  if (options?.bustCache) params.set('_', String(Date.now()));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const getConversations = async (options?: { bustCache?: boolean }) => {
  const url = options?.bustCache
    ? `/dashboard/partner/messages/?_=${Date.now()}`
    : '/dashboard/partner/messages/';
  const response = await apiClient.get(url);
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

export const getConversationThread = async (
  conversationId: number,
  options?: { bustCache?: boolean; skipRead?: boolean },
) => {
  const response = await apiClient.get(
    `/dashboard/partner/messages/${conversationId}${threadQuery(options)}`,
  );
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
