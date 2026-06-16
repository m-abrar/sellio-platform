# Firebase & Pusher/Realtime Survey

Survey date: 2026-06-16. Scope: apps/backend (Laravel), apps/storefront, apps/buyer, apps/seller.

## A. Firebase

**Status: not integrated.** No `firebase`, `firebase-admin`, or FCM packages in any `composer.json`/`package.json`. The only Firebase-adjacent dependency is `@google/genai` (apps/buyer, apps/seller), which is for Gemini AI features, unrelated to Firebase.

There is currently no:
- FCM push notification channel
- Device/token registration table or model
- Firebase Auth/Firestore/Realtime DB usage anywhere

## B. Pusher / Broadcasting (Laravel Echo)

### Server side
- `apps/backend/config/broadcasting.php:1-89` — supports Reverb, Pusher, Ably, Redis, log, null drivers, but default connection is **`null`** (`.env.example:36` sets `BROADCAST_CONNECTION=log`). Nothing actually broadcasts in any environment today.
- `pusher/pusher-php-server` ^7.2 is installed (composer.json:17) but unused since broadcasting is off.
- `laravel/reverb` (self-hosted WS alternative) is **not installed**.
- `apps/backend/routes/channels.php:1-26` — only two channels defined:
  - `App.Models.User.{id}` (line 12, private user channel)
  - `chat.{conversationId}` (line 16-25, authorized for conversation participants)
- Only **one** event actually broadcasts: `app/Events/NewMessageSent.php:13` (implements `ShouldBroadcast`, channel `chat.{conversation_id}`, line 35), fired from `MessageController.php:93-94`.
- The other ~19 domain events (`ReviewReceived`, `JobApplicationReceived`, `ListingApproved`, `PaymentFailed`, `PlanExpired`, etc. in `app/Events/`) are queue/notification-only — none implement `ShouldBroadcast`.

### Client side
- `apps/backend/resources/js/echo.js:1-27` — Laravel Echo 2.2.7 + Pusher.js 8.4.0 (package.json:46,51) configured, but:
  - Listener on `listings-app-notifications-channel` for `NewNotification` (lines 24-27) is an **empty stub** — does nothing on receipt.
  - Requires `VITE_PUSHER_APP_KEY` / `VITE_PUSHER_APP_CLUSTER` (lines 10-11), which are **not present** in `.env.example`.
  - This is the *admin* app only. **Storefront, buyer, and seller apps have zero Echo/Pusher client code** — no real-time notifications reach customer-facing surfaces at all.

### Notifications (DB/email only, no realtime/push)
- `app/Notifications/Partner/PartnerAlertNotification.php:9` — database channel only.
- `app/Notifications/OrderStatusChanged.php:10` — mail + database.
- `app/Notifications/ContentFlagged.php`, `NewPropertySubmitted.php` — database only.
- `app/Services/Partner/NotificationService.php` — writes to DB, no WebSocket/FCM dispatch, no retry on failure.
- `Message` model has `read_at` (`app/Models/Message.php:17`, migration line 31) but no broadcast of read receipts, no typing indicator, no "seen" status on conversations, no `delivered_at`.

## C. Package versions

All current — no version-bump action needed:
- `pusher/pusher-php-server` ^7.2
- `laravel-echo` ^2.2.7
- `pusher-js` ^8.4.0
- `laravel/reverb` — absent (optional self-hosted alternative to Pusher; evaluate for cost reasons)

## D. Improvement opportunities

### Quick wins (low effort, high value)
- [ ] Set `BROADCAST_CONNECTION=pusher` in real environments; broadcasting is currently a no-op everywhere (`config/broadcasting.php`, `.env.example:36`)
- [ ] Add `VITE_PUSHER_APP_KEY` / `VITE_PUSHER_APP_CLUSTER` (and server-side `PUSHER_APP_ID/KEY/SECRET/CLUSTER`) to `.env.example`
- [ ] Implement the empty `NewNotification` handler in `echo.js:24-27` (toast/badge update instead of no-op)
- [ ] Broadcast read receipts on `Message.read_at` update (extend `NewMessageSent` or add `MessageRead` event)

### Real-time coverage gaps
- [ ] Make high-value events broadcastable: `ReviewReceived`, `JobApplicationReceived`, `ListingApproved`, `PaymentFailed`, `PlanExpired`, `OrderStatusChanged` (currently queue/DB-only)
- [ ] Add presence channels for online/offline status (e.g. conversation participants, partner dashboard)
- [ ] Add typing-indicator event for chat (`chat.{conversationId}` channel exists, no typing event uses it)
- [ ] Bring real-time notifications to **storefront/buyer/seller** apps — currently only the admin app has any Echo client, so customers never get live updates (order status, chat replies, listing approval)

### Reliability / operability
- [ ] No retry/backoff or dead-letter handling for failed broadcasts or notification sends
- [ ] No fallback path (e.g. polling) if Pusher is unreachable client-side
- [ ] No rate limiting on broadcast-triggering actions (chat spam could flood channels)
- [ ] Evaluate `laravel/reverb` as a self-hosted alternative to Pusher to cut third-party cost once volume grows

### Push notifications (Firebase/FCM) — net new
- [ ] Decide if mobile/PWA push is actually in scope; if yes:
  - [ ] Add `firebase-admin` (backend) and device-token model/migration
  - [ ] Add token registration endpoint + multi-device support
  - [ ] Add `fcm` as a notification channel alongside `mail`/`database` for the existing Notification classes
  - [ ] Consider topic-based messaging for broadcast-style alerts (e.g. plan expiry, promotions)

### Documentation
- [ ] Document Pusher/Echo setup (credentials, channel list, event payloads) — currently undocumented
- [ ] Add a short README in `apps/backend/resources/js/` explaining `echo.js` and how to add new channel listeners
