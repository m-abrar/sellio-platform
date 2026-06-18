import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window { Pusher: typeof Pusher; }
}

let echo: Echo<'pusher'> | null = null;

// Conversation the component wants to watch.  echo.ts re-subscribes on every
// connect/reconnect so the component never needs to handle timing itself.
let activeConvoId: number | null = null;
// Tracks which conversation channel is currently subscribed to prevent duplicate listeners.
let subscribedConvoId: number | null = null;

function authEndpoint(apiBase: string): string {
  return apiBase.replace(/\/$/, '') + '/broadcasting/auth';
}

function dispatch(name: string, detail: unknown): void {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

function doSubscribeConvo(conversationId: number): void {
  if (!echo) return;

  if (subscribedConvoId !== null && subscribedConvoId !== conversationId) {
    echo.leave(`chat.${subscribedConvoId}`);
  }

  echo.leave(`chat.${conversationId}`);
  subscribedConvoId = conversationId;
  const channel = echo.private(`chat.${conversationId}`);

  (channel as any).subscribed(() => {
    console.log(`[Echo] ✓ Subscribed to private-chat.${conversationId}`);
  });
  (channel as any).error((status: unknown) => {
    console.error(`[Echo] ✗ Auth failed for private-chat.${conversationId}`, status);
  });

  channel
    .listen('.NewMessageSent', (e: unknown) => {
      console.log('[Echo] NewMessageSent on chat.' + conversationId, e);
      dispatch('sellio:new-message', e);
    })
    .listen('.MessageRead', (e: unknown) => dispatch('sellio:message-read', e))
    .listen('.UserTyping', (e: unknown) => dispatch('sellio:typing', e));
}

export function connectEcho(userId: number, token: string, apiBase: string): void {
  const pendingConvoId = activeConvoId;

  if (echo) {
    subscribedConvoId = null;
    echo.disconnect();
    echo = null;
  }

  activeConvoId = pendingConvoId;

  const key = import.meta.env.VITE_PUSHER_APP_KEY;
  if (!key) {
    console.warn('[Echo] VITE_PUSHER_APP_KEY is not set — real-time disabled');
    return;
  }

  window.Pusher = Pusher;
  Pusher.logToConsole = import.meta.env.DEV;

  echo = new Echo({
    broadcaster: 'pusher',
    key,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
    forceTLS: true,
    authEndpoint: authEndpoint(apiBase),
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  });

  echo.connector.pusher.connection.bind('connected', () => {
    console.log('[Echo] Pusher connected ✓');
    subscribedConvoId = null;
    if (activeConvoId !== null) {
      console.log(`[Echo] Re-subscribing to chat.${activeConvoId}`);
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
    })
    .listen('.ReviewReceived', (e: Record<string, unknown>) => {
      dispatch('sellio:notification', {
        title: 'New Review',
        message: `Rating: ${e.rating ?? '?'} — ${e.listing ?? 'your listing'}`,
        type: 'info',
        payload: e,
      });
      window.dispatchEvent(new Event('sellio_notifications_updated'));
    })
    .listen('.JobApplicationReceived', (e: Record<string, unknown>) => {
      dispatch('sellio:notification', {
        title: 'New Job Application',
        message: `A new application arrived for "${e.job_title ?? 'your listing'}"`,
        type: 'info',
        payload: e,
      });
      window.dispatchEvent(new Event('sellio_notifications_updated'));
    })
    .listen('.ListingApproved', (e: Record<string, unknown>) => {
      dispatch('sellio:notification', {
        title: 'Listing Approved',
        message: `"${e.listing_title ?? 'Your listing'}" is now live.`,
        type: 'success',
        payload: e,
      });
      window.dispatchEvent(new Event('sellio_notifications_updated'));
    })
    .listen('.PaymentFailed', (e: Record<string, unknown>) => {
      dispatch('sellio:notification', {
        title: 'Payment Failed',
        message: 'A payment could not be processed. Please check your payment method.',
        type: 'error',
        payload: e,
      });
      window.dispatchEvent(new Event('sellio_notifications_updated'));
    })
    .listen('.PlanExpired', (e: Record<string, unknown>) => {
      dispatch('sellio:notification', {
        title: 'Plan Expired',
        message: `Your "${e.plan_name ?? 'subscription'}" plan has expired.`,
        type: 'warning',
        payload: e,
      });
      window.dispatchEvent(new Event('sellio_notifications_updated'));
    });
}

export function subscribeToConversation(conversationId: number): () => void {
  const state = echo?.connector?.pusher?.connection?.state ?? 'no-echo';
  console.log(`[Echo] subscribeToConversation(${conversationId}) state=${state}`);

  activeConvoId = conversationId;

  if (state === 'connected') {
    // Already connected — subscribe immediately.
    doSubscribeConvo(conversationId);
  }
  // Otherwise the 'connected' handler above subscribes once the WS is ready.

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
