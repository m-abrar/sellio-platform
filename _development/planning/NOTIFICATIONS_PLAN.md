# Buyer Notifications — Implementation Plan

Status: **Frozen / Not started**
Captured: 2026-06-20

The Notifications tab has been removed from buyer Settings until this module is fully
implemented. This document captures the full plan so it can be picked up cleanly later.

---

## What we want to support

| Notification type             | Trigger                                          |
|-------------------------------|--------------------------------------------------|
| New message received          | Partner or user sends a chat message             |
| Booking confirmed             | Partner confirms a property / event booking      |
| Booking cancelled             | Either party cancels a booking                   |
| Booking reminder              | 24 h before a confirmed booking date             |
| Job application status update | Partner accepts / rejects an application         |
| Service appointment confirmed | Partner confirms a service appointment           |
| Service quote received        | Partner responds to a service quote request      |
| Auto inquiry reply            | Partner responds to an auto inquiry              |
| Review received               | Someone leaves a review on a listing you own     |
| Promotional / newsletter      | Marketing opt-in (must be opt-in only)           |
| System / admin announcements  | Platform-level notices from admin                |

---

## Delivery channels

| Channel   | Notes                                              |
|-----------|----------------------------------------------------|
| In-app    | Notification bell in the buyer portal nav bar      |
| Email     | Laravel Mailable + queue; respect opt-out          |
| Push      | Future — browser Push API or mobile (FCM)          |
| SMS       | Future — Twilio or similar                         |

---

## Data model

### Option A — JSON column on users (simpler, already has `preferences`)

Store preferences in the existing `users.preferences` JSON column:

```json
{
  "notifications": {
    "new_message":        { "in_app": true,  "email": true  },
    "booking_confirmed":  { "in_app": true,  "email": true  },
    "booking_cancelled":  { "in_app": true,  "email": true  },
    "booking_reminder":   { "in_app": true,  "email": true  },
    "application_update": { "in_app": true,  "email": false },
    "appointment":        { "in_app": true,  "email": true  },
    "quote_received":     { "in_app": true,  "email": false },
    "auto_inquiry_reply": { "in_app": true,  "email": false },
    "review_received":    { "in_app": true,  "email": false },
    "marketing":          { "in_app": false, "email": false },
    "announcements":      { "in_app": true,  "email": false }
  }
}
```

**Pros:** No migration, works with existing `updateUserProfile` endpoint.
**Cons:** No indexed querying per channel/type.

### Option B — Dedicated table (normalised, recommended for scale)

```sql
CREATE TABLE notification_preferences (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(60) NOT NULL,   -- e.g. 'new_message'
  channel     VARCHAR(20) NOT NULL,   -- 'in_app' | 'email' | 'push'
  enabled     BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE KEY  uq_user_type_channel (user_id, type, channel)
);
```

**Pros:** Easy to query per channel, add new channels without schema change.
**Cons:** Requires migration + seeding defaults.

**Recommended: Option A to ship quickly, migrate to Option B if needed later.**

---

## Backend

### API endpoints

```
GET  /api/dashboard/user/notification-preferences
     → Returns the user's preferences map (all types × all channels)

PATCH /api/dashboard/user/notification-preferences
     Body: { type: string, channel: string, enabled: boolean }
     → Updates a single preference, returns the full updated map
```

### Laravel notifications

Each `Notification` class must check user preference before dispatching:

```php
public function via(object $notifiable): array
{
    $prefs = $notifiable->preferences['notifications'] ?? [];
    $channels = [];
    if ($prefs[$this->type]['in_app'] ?? true)  $channels[] = 'database';
    if ($prefs[$this->type]['email']  ?? true)   $channels[] = 'mail';
    return $channels;
}
```

---

## Frontend (buyer portal)

### Settings → Notifications tab

- Re-add `Bell` icon and `'notifications'` to the tabs array in `SettingsView.tsx`
- Group toggles by category:
  - **Bookings** — confirmed, cancelled, reminder
  - **Messages** — new message
  - **Applications & Inquiries** — job apps, auto inquiries, service quotes, appointments
  - **Reviews** — review received
  - **Marketing** — promotional emails (opt-in only, off by default)
  - **System** — announcements (cannot be disabled)
- Each row: toggle label + per-channel chips (In-app / Email)
- Persist immediately on toggle via PATCH with a Sonner toast on success/error

### Notification bell (nav bar)

- Show unread count badge from `stats.notificationCount`
- Clicking opens a dropdown panel (or navigates to `/notifications`)
- Mark all as read button

---

## Files to create / modify

| File | Action |
|------|--------|
| `database/migrations/xxxx_create_notification_preferences_table.php` | If going with Option B |
| `app/Http/Controllers/Api/V1/Dashboard/User/NotificationPreferenceController.php` | New |
| `routes/api/dashboard/user.php` | Add preference routes |
| `app/Notifications/*.php` | Update `via()` to check prefs |
| `apps/buyer/src/views/SettingsView.tsx` | Re-add Notifications tab |
| `apps/buyer/src/api/notificationPreferenceApi.ts` | New — GET/PATCH calls |

---

## Open questions before starting

1. Go with Option A (JSON) or Option B (table)?
2. Should "System / admin announcements" be forcibly enabled (non-toggleable)?
3. Do we need an in-app notification bell panel in this sprint, or just the preferences UI?
4. Email templates — use the existing `DynamicEmail` / `EmailTemplate` system or plain Mailables?
