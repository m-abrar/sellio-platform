import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { resolvePusherCluster, resolvePusherKey } from '../config/resolvePusherConfig';

declare global {
  interface Window { Pusher: typeof Pusher; }
}

let echo: Echo<'pusher'> | null = null;
let activeConvoId: number | null = null;
let subscribedConvoId: number | null = null;

function authEndpoint(apiBase: string): string {
  return apiBase.replace(/\/$/, '') + '/broadcasting/auth';
}

function dispatch(name: string, detail: unknown): void {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

function buildAuthorizer(getToken: () => string | null, apiBase: string) {
  return (channel: { name: string }) => ({
    authorize: (socketId: string, callback: (error: Error | null, authData: { auth: string } | null) => void) => {
      const token = getToken();
      if (!token) {
        callback(new Error('No auth token'), null);
        return;
      }

      fetch(authEndpoint(apiBase), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          socket_id: socketId,
          channel_name: channel.name,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            console.error('[Echo] Auth failed', response.status, channel.name);
            callback(new Error(`Auth HTTP ${response.status}`), null);
            return;
          }
          callback(null, (await response.json()) as { auth: string });
        })
        .catch((err) => {
          console.error('[Echo] Auth network error', channel.name, err);
          callback(err instanceof Error ? err : new Error('Auth network error'), null);
        });
    },
  });
}

function doSubscribeConvo(conversationId: number): void {
  if (!echo) return;
  if (subscribedConvoId === conversationId) return;

  if (subscribedConvoId !== null) {
    echo.leave(`chat.${subscribedConvoId}`);
  }

  subscribedConvoId = conversationId;
  const channel = echo.private(`chat.${conversationId}`);

  (channel as any).subscribed(() => {
    console.log(`[Echo] ✓ Subscribed to private-chat.${conversationId}`);
  });
  (channel as any).error((status: unknown) => {
    console.error(`[Echo] ✗ Channel error private-chat.${conversationId}`, status);
    dispatch('sellio:echo-channel-error', { conversationId, status });
  });

  channel
    .listen('.NewMessageSent', (e: unknown) => {
      dispatch('sellio:new-message', e);
    })
    .listen('.MessageRead', (e: unknown) => dispatch('sellio:message-read', e))
    .listen('.UserTyping', (e: unknown) => dispatch('sellio:typing', e));
}

export function connectEcho(
  userId: number,
  getToken: () => string | null,
  apiBase: string,
): void {
  const pendingConvoId = activeConvoId;

  if (echo) {
    subscribedConvoId = null;
    echo.disconnect();
    echo = null;
  }

  activeConvoId = pendingConvoId;

  const key = resolvePusherKey();
  if (!key) {
    console.warn('[Echo] Pusher app key is not set — real-time disabled.');
    return;
  }

  window.Pusher = Pusher;
  Pusher.logToConsole = import.meta.env.DEV;

  echo = new Echo({
    broadcaster: 'pusher',
    key,
    cluster: resolvePusherCluster(),
    forceTLS: true,
    authorizer: buildAuthorizer(getToken, apiBase) as Echo<'pusher'>['options']['authorizer'],
  });

  echo.connector.pusher.connection.bind('connected', () => {
    console.log('[Echo] Pusher connected ✓');
    subscribedConvoId = null;
    if (activeConvoId !== null) {
      doSubscribeConvo(activeConvoId);
    }
    dispatch('sellio:echo-connected', { userId });
  });

  echo.connector.pusher.connection.bind('error', (err: unknown) => {
    console.error('[Echo] Pusher connection error:', err);
  });

  echo.connector.pusher.connection.bind('failed', () => {
    console.error('[Echo] Pusher connection failed — check key/cluster');
  });

  echo.private(`App.Models.User.${userId}`)
    .notification((n: Record<string, unknown>) => {
      dispatch('sellio:notification', {
        title: (n.title as string) ?? 'Notification',
        message: (n.message as string) ?? (n.body as string) ?? '',
        type: (n.level as string) ?? 'info',
      });
      window.dispatchEvent(new Event('sellio_notifications_updated'));
    });
}

export function subscribeToConversation(conversationId: number): () => void {
  activeConvoId = conversationId;

  if (echo?.connector?.pusher?.connection?.state === 'connected') {
    doSubscribeConvo(conversationId);
  }

  return () => {
    if (activeConvoId === conversationId) activeConvoId = null;
    if (subscribedConvoId === conversationId) subscribedConvoId = null;
    echo?.leave(`chat.${conversationId}`);
  };
}

export function getSocketId(): string | null {
  return echo?.connector?.pusher?.connection?.socket_id ?? null;
}

export function disconnectEcho(): void {
  activeConvoId = null;
  subscribedConvoId = null;
  echo?.disconnect();
  echo = null;
}
