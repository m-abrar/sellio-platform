# Real-time (Pusher / Laravel Echo) — Admin App

## Setup

1. Create a free Pusher app at <https://pusher.com>.
2. Copy the credentials into `apps/backend/.env`:
   ```
   BROADCAST_CONNECTION=pusher
   PUSHER_APP_ID=your_app_id
   PUSHER_APP_KEY=your_app_key
   PUSHER_APP_SECRET=your_app_secret
   PUSHER_APP_CLUSTER=mt1
   VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
   VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
   ```
3. Rebuild the admin frontend: `npm run build` (inside `apps/backend`).

For **local development**, leave `BROADCAST_CONNECTION=log` — events are written to
`storage/logs/laravel.log` and nothing reaches the browser.

---

## Channels

| Channel | Type | Auth | Purpose |
|---------|------|------|---------|
| `listings-app-notifications-channel` | Public | None | Platform-wide admin alerts (`NewNotification`) |
| `App.Models.User.{id}` | Private | `Auth::id() === $id` | Per-user notifications (reviews, applications, plan events) |
| `chat.{conversationId}` | Private | Conversation participant | Chat messages, read receipts, typing indicators |

---

## Events

### `NewNotification` → `listings-app-notifications-channel`
Fired by `NotificationService`. Payload:
```json
{ "title": "...", "message": "...", "type": "info|success|warning|error" }
```
Handler in `echo.js` calls `showAdminToast()` and increments the badge counter.

### `NewMessageSent` → `chat.{conversationId}`
Fired by `User\MessageController::sendMessage` and `Partner\MessageController::sendMessage`.
```json
{ "id": 42, "conversation_id": 7, "sender_id": 3, "body": "...", "created_at": "..." }
```

### `MessageRead` → `chat.{conversationId}`
Fired by `markRead()` on both controllers (also auto-triggered in partner `show()`).
```json
{ "id": 42, "conversation_id": 7, "read_at": "2026-06-17T10:00:00Z" }
```

### `UserTyping` → `chat.{conversationId}`
Fired by `typing()` on both controllers (call on each keypress, debounced client-side).
```json
{ "conversation_id": 7, "user_id": 3, "user_name": "Alice" }
```

### `ReviewReceived` → `App.Models.User.{ownerId}`
### `JobApplicationReceived` → `App.Models.User.{jobOwnerId}`
### `ListingApproved` → `App.Models.User.{listingOwnerId}`
### `PaymentFailed` → `App.Models.User.{userId}`
### `PlanExpired` → `App.Models.User.{userId}`
All delivered via the private per-user channel and caught by the `.notification()` handler
wired in `echo.js`.

---

## Adding a new channel listener

```js
// In echo.js (or a dedicated module imported by echo.js)
window.Echo.private('some-channel')
    .listen('SomeEvent', (payload) => {
        // handle payload
    });
```

For **client events** (typing indicators, etc.) use `.whisper()` / `.listenForWhisper()`
if you prefer not to hit the server for each keystroke — requires Pusher channels enabled
for client events in your Pusher dashboard.
