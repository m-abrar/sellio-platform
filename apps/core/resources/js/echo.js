// resources/js/echo.js

import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    wsHost: import.meta.env.VITE_PUSHER_HOST,
    wsPort: import.meta.env.VITE_PUSHER_PORT,
    wssPort: import.meta.env.VITE_PUSHER_PORT,
    enabledTransports: ["ws", "wss"],
});

// OPTIONAL: Enable client-side debugging (highly recommended for testing)
window.Pusher.logToConsole = true; 


// Start listening to a public channel named 'abrar-test-channel'
window.Echo.channel('listings-app-notifications-channel')
    .listen('NewNotification', (e) => {
        // 
    });