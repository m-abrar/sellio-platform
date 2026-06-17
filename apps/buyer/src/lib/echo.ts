import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window { Pusher: typeof Pusher; }
}

let echo: Echo<'pusher'> | null = null;

function authEndpoint(apiBase: string): string {
  return apiBase.replace(/\/api\/?$/, '') + '/broadcasting/auth';
}

function dispatch(name: string, detail: unknown): void {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function connectEcho(userId: number, token: string, apiBase: string): void {
  if (echo) disconnectEcho();

  const key = import.meta.env.VITE_PUSHER_APP_KEY;
  if (!key) return;

  window.Pusher = Pusher;

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
  if (!echo) return () => {};

  echo.private(`chat.${conversationId}`)
    .listen('.NewMessageSent', (e: unknown) => dispatch('sellio:new-message', e))
    .listen('.MessageRead', (e: unknown) => dispatch('sellio:message-read', e))
    .listen('.UserTyping', (e: unknown) => dispatch('sellio:typing', e));

  return () => { echo?.leave(`chat.${conversationId}`); };
}

export function disconnectEcho(): void {
  echo?.disconnect();
  echo = null;
}
