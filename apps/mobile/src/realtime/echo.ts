import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';
import { API_URL } from '../config/api';
import { getStoredToken } from '../auth/sessionStorage';
import { MessageRecord } from '../features/buyer/types';

export type RealtimeConnectionState = 'disabled' | 'connecting' | 'connected' | 'unavailable';

interface ConversationHandlers {
  onMessage: (message: MessageRecord) => void;
  onRead: (payload: { id: number; conversation_id: number; read_at: string }) => void;
  onTyping: (payload: { conversation_id: number; user_id: number; user_name: string }) => void;
  onConnectionState: (state: RealtimeConnectionState) => void;
}

export async function subscribeToConversationRealtime(
  conversationId: number,
  handlers: ConversationHandlers,
) {
  const key = process.env.EXPO_PUBLIC_PUSHER_APP_KEY?.trim();
  const cluster = process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER?.trim() || 'mt1';
  const token = await getStoredToken();

  if (!key || !token) {
    handlers.onConnectionState('disabled');
    return () => {};
  }

  handlers.onConnectionState('connecting');

  const echo = new Echo<'pusher'>({
    broadcaster: 'pusher',
    client: Pusher,
    key,
    cluster,
    forceTLS: true,
    authorizer: (channel: { name: string }) => ({
      authorize: async (
        socketId: string,
        callback: (error: Error | null, data: { auth: string } | null) => void,
      ) => {
        try {
          const response = await fetch(`${API_URL}/broadcasting/auth`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ socket_id: socketId, channel_name: channel.name }),
          });
          if (!response.ok) throw new Error(`Broadcast authentication failed (${response.status}).`);
          callback(null, await response.json());
        } catch (error) {
          callback(error instanceof Error ? error : new Error('Broadcast authentication failed.'), null);
        }
      },
    }),
  });

  const connection = (echo.connector as unknown as { pusher: { connection: { bind: (event: string, handler: () => void) => void } } }).pusher.connection;
  connection.bind('connected', () => handlers.onConnectionState('connected'));
  connection.bind('unavailable', () => handlers.onConnectionState('unavailable'));
  connection.bind('failed', () => handlers.onConnectionState('unavailable'));

  echo.private(`chat.${conversationId}`)
    .listen('.NewMessageSent', handlers.onMessage)
    .listen('.MessageRead', handlers.onRead)
    .listen('.UserTyping', handlers.onTyping);

  return () => {
    echo.leave(`chat.${conversationId}`);
    echo.disconnect();
  };
}
