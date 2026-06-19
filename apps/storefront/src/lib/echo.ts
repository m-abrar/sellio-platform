import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { readAuthToken } from '@/lib/auth-storage';

declare global {
  interface Window { Pusher: typeof Pusher; }
}

let echo: Echo<'pusher'> | null = null;
const desiredConvoIds = new Map<number, number>();
const subscribedConvoIds = new Set<number>();

function resolveKey(): string {
  return (process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '').trim();
}

function resolveCluster(): string {
  return (process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? 'mt1').trim();
}

function resolveAuthEndpoint(apiBase: string): string {
  return apiBase.replace(/\/$/, '') + '/broadcasting/auth';
}

function dispatch(name: string, detail: unknown): void {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

function buildAuthorizer(apiBase: string) {
  return (channel: { name: string }) => ({
    authorize: (socketId: string, callback: (err: Error | null, data: { auth: string } | null) => void) => {
      const token = readAuthToken();
      if (!token) {
        callback(new Error('No auth token'), null);
        return;
      }
      fetch(resolveAuthEndpoint(apiBase), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ socket_id: socketId, channel_name: channel.name }),
      })
        .then(async (res) => {
          if (!res.ok) {
            console.error('[Echo] Auth failed', res.status, channel.name);
            callback(new Error(`Auth HTTP ${res.status}`), null);
            return;
          }
          callback(null, (await res.json()) as { auth: string });
        })
        .catch((err: unknown) => {
          console.error('[Echo] Auth network error', channel.name, err);
          callback(err instanceof Error ? err : new Error('Auth error'), null);
        });
    },
  });
}

function doSubscribeConvo(conversationId: number): void {
  if (!echo) return;
  if (subscribedConvoIds.has(conversationId)) return;

  subscribedConvoIds.add(conversationId);
  const channel = echo.private(`chat.${conversationId}`);

  (channel as unknown as { subscribed: (cb: () => void) => void }).subscribed(() => {
    console.log(`[Echo] ✓ Subscribed to private-chat.${conversationId}`);
  });
  (channel as unknown as { error: (cb: (s: unknown) => void) => void }).error((status: unknown) => {
    console.error(`[Echo] ✗ Channel error private-chat.${conversationId}`, status);
  });

  channel.listen('.NewMessageSent', (e: unknown) => dispatch('sellio:new-message', e));
}

export function connectEcho(apiBase: string): void {
  if (echo) {
    subscribedConvoIds.clear();
    echo.disconnect();
    echo = null;
  }

  const key = resolveKey();
  if (!key) {
    console.warn('[Echo] NEXT_PUBLIC_PUSHER_APP_KEY not set — real-time disabled.');
    return;
  }

  window.Pusher = Pusher;
  Pusher.logToConsole = process.env.NODE_ENV === 'development';

  echo = new Echo({
    broadcaster: 'pusher',
    key,
    cluster: resolveCluster(),
    forceTLS: true,
    authorizer: buildAuthorizer(apiBase) as Echo<'pusher'>['options']['authorizer'],
  });

  echo.connector.pusher.connection.bind('connected', () => {
    console.log('[Echo] Pusher connected ✓');
    subscribedConvoIds.clear();
    desiredConvoIds.forEach((_count, id) => doSubscribeConvo(id));
  });

  echo.connector.pusher.connection.bind('error', (err: unknown) => {
    console.error('[Echo] Connection error:', err);
  });

  echo.connector.pusher.connection.bind('failed', () => {
    console.error('[Echo] Connection failed — check NEXT_PUBLIC_PUSHER_APP_KEY / CLUSTER');
  });
}

export function subscribeToConversation(conversationId: number): () => void {
  desiredConvoIds.set(conversationId, (desiredConvoIds.get(conversationId) ?? 0) + 1);

  if (echo?.connector?.pusher?.connection?.state === 'connected') {
    doSubscribeConvo(conversationId);
  }

  return () => {
    const next = (desiredConvoIds.get(conversationId) ?? 1) - 1;
    if (next > 0) { desiredConvoIds.set(conversationId, next); return; }
    desiredConvoIds.delete(conversationId);
    subscribedConvoIds.delete(conversationId);
    echo?.leave(`chat.${conversationId}`);
  };
}

export function getSocketId(): string | null {
  return echo?.connector?.pusher?.connection?.socket_id ?? null;
}

export function disconnectEcho(): void {
  desiredConvoIds.clear();
  subscribedConvoIds.clear();
  echo?.disconnect();
  echo = null;
}
