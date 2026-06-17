import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window { Pusher: typeof Pusher; }
}

let echo: Echo<'pusher'> | null = null;

function authEndpoint(apiBase: string): string {
  return apiBase.replace(/\/$/, '') + '/broadcasting/auth';
}

function dispatch(name: string, detail: unknown): void {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function connectEcho(userId: number, token: string, apiBase: string): void {
  if (echo) disconnectEcho();

  const key = import.meta.env.VITE_PUSHER_APP_KEY;
  if (!key) {
    console.warn('[Echo] VITE_PUSHER_APP_KEY is not set — real-time disabled');
    return;
  }

  window.Pusher = Pusher;
  Pusher.logToConsole = true;

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

  // Fire sellio:echo-ready only after the WebSocket is actually connected,
  // not immediately after new Echo() — this ensures subscriptions don't race auth.
  echo.connector.pusher.connection.bind('connected', () => {
    console.log('[Echo] Pusher connected ✓');
    window.dispatchEvent(new Event('sellio:echo-ready'));
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
  console.log(`[Echo] subscribeToConversation(${conversationId}) — echo=${echo ? 'exists' : 'null'}`);
  if (!echo) return () => {};

  const channel = echo.private(`chat.${conversationId}`);

  // Subscription lifecycle — look for these in console after Pusher connects
  (channel as any).subscribed(() => {
    console.log(`[Echo] ✓ Subscribed to private-chat.${conversationId}`);
  });
  (channel as any).error((status: unknown) => {
    console.error(`[Echo] ✗ Failed to subscribe to private-chat.${conversationId}`, status);
  });

  channel
    .listen('.NewMessageSent', (e: unknown) => {
      console.log('[Echo] NewMessageSent received on chat.' + conversationId, e);
      dispatch('sellio:new-message', e);
    })
    .listen('.MessageRead', (e: unknown) => dispatch('sellio:message-read', e))
    .listen('.UserTyping', (e: unknown) => dispatch('sellio:typing', e));

  return () => { echo?.leave(`chat.${conversationId}`); };
}

export function disconnectEcho(): void {
  echo?.disconnect();
  echo = null;
}
