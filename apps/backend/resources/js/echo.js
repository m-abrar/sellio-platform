// resources/js/echo.js
//
// Real-time client for the admin app only.
// Set BROADCAST_CONNECTION=pusher + VITE_PUSHER_APP_KEY/CLUSTER in .env to activate.
// Storefront/buyer/seller apps have their own client setup (see their respective resources/js/).

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    wsHost: import.meta.env.VITE_PUSHER_HOST,
    wsPort: import.meta.env.VITE_PUSHER_PORT,
    wssPort: import.meta.env.VITE_PUSHER_PORT,
    enabledTransports: ['ws', 'wss'],
});

// --- Notification badge / toast helper ---
function showAdminToast(title, message, type = 'info') {
    // Dispatch a custom DOM event so the admin UI can render a toast
    // without this file coupling directly to the UI framework.
    window.dispatchEvent(new CustomEvent('sellio:notification', {
        detail: { title, message, type },
    }));

    // Also increment the unread badge counter if the element exists.
    const badge = document.querySelector('[data-notification-badge]');
    if (badge) {
        const current = parseInt(badge.textContent || '0', 10);
        badge.textContent = String(current + 1);
        badge.hidden = false;
    }
}

// --- Admin-wide notifications channel ---
// Receives platform events routed via NotificationService (partner alerts, system flags, etc.)
window.Echo.channel('listings-app-notifications-channel')
    .listen('NewNotification', (e) => {
        const title = e.title ?? 'New notification';
        const body  = e.message ?? e.body ?? '';
        const type  = e.type ?? 'info'; // 'info' | 'success' | 'warning' | 'error'
        showAdminToast(title, body, type);
    });

// --- Per-user private channel (new chat messages) ---
// Only wires up when the admin user's ID is available on the page.
const adminUserId = document.querySelector('meta[name="user-id"]')?.getAttribute('content');
if (adminUserId) {
    window.Echo.private(`App.Models.User.${adminUserId}`)
        .notification((notification) => {
            // Laravel broadcasts database-queued notifications here automatically
            // when the notifiable implements the `broadcastOn` channel.
            const title = notification.title ?? notification.type?.split('\\').pop() ?? 'Notification';
            const body  = notification.message ?? notification.body ?? '';
            const type  = notification.level ?? 'info';
            showAdminToast(title, body, type);
        });
}
