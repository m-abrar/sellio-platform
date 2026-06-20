# Buyer Portal — Pending Tasks

Captured: 2026-06-20

---

## 1. Dashboard — Quick Actions: Numbers Flash Zeros on Load

The stats counters briefly show `0` for a few seconds before the real values appear.
Root cause is likely the `StatsContext` initialising with `0` defaults before the API
response returns. Fix should show a loading skeleton or suppress the counters until data
is ready rather than flashing zeros.

---

## 2. My Bookings — "View Details" Should Open a Detail Page

Currently "View Details" navigates to the **frontend listing page** of the booked item.
Instead it should open a **buyer-side booking detail page** that shows:
- Booking summary (dates, price, status)
- Listing link (moved here as a secondary action, e.g. "View Listing →")
- Applicable actions (cancel, download receipt, etc.)

The same pattern needs to be built for all of the following sections:

| Section | Current behaviour | Required behaviour |
|---|---|---|
| My Bookings | Opens frontend listing | Opens buyer booking detail page |
| Job Applications | Opens frontend listing | Opens buyer application detail page |
| Auto Inquiries | Opens frontend listing | Opens buyer inquiry detail page |
| Service Appointments | Opens frontend listing | Opens buyer appointment detail page |
| Service Quotes | Opens frontend listing | Opens buyer quote detail page |
| Classified Ads | Opens frontend listing | Opens buyer ad detail page |

Each detail page should surface the relevant data and actions for that record type, with
the listing link demoted to a secondary/contextual link inside the detail page.

---

## 3. Messages / Chat Screen — Remove Dummy Icons

There are static/non-functional icons visible in the chat UI. Remove them entirely rather
than leaving placeholder controls that do nothing.

---

## 4. Reviews Page — Edit Flow Needs Proper UI

The edit option exists but lacks a real interface. Needs a proper edit experience:
- Modal or inline edit form (star rating + text)
- Save / cancel actions
- Optimistic UI update or page refresh on success
- Consistent with the rest of the buyer portal design language (premium feel)

---

## 5. Detail Pages — Actions Need Premium Confirmation Dialogs

On booking, order, inquiry, and similar detail pages, actions such as **Delete**,
**Cancel**, **Edit** (whichever apply per record type) must use proper popups/modals:
- Professional, premium-looking confirmation dialogs (not browser `confirm()`)
- Clear action label, consequence text, and Cancel / Confirm buttons
- Destructive actions (delete, cancel) styled with a warning/danger tone
- Consistent component reusable across all detail page types

---

## 6. Settings → Profile — Location Field

**Question to resolve:** What is the Location field on the buyer profile for?
Decide its purpose and either:
- Surface it meaningfully in the product (e.g. pre-fill search radius, show on public
  profile), or
- Remove it from the settings form if it serves no function

---

## 7. Settings — Hide 2FA (Future Plan)

Two-Factor Authentication is visible in settings but not yet implemented.
**Action:** Hide the 2FA section from the buyer settings UI for now.

**Future plan note** (file in `_development/` for later):
- Implement TOTP-based 2FA (e.g. via `pragmarx/google2fa` or Laravel Fortify)
- UI: QR code setup flow, backup codes, "disable 2FA" confirmation
- Enforce 2FA optionally per user or admin-mandated for seller accounts
- Add 2FA bypass/recovery flow via email OTP

---

## 8. Settings → Notifications Tab — Full Plan Required

The Notifications tab has check/uncheck toggles but no backend wiring.
A complete plan is needed covering:

### 8a. What notifications to support
- New message received
- Booking confirmed / cancelled / updated
- Order status changed (placed, shipped, delivered)
- Job application status updated
- Appointment confirmed / reminder
- Review received
- Promotional / newsletter (opt-in only)
- System / admin announcements

### 8b. Delivery channels per notification type
- In-app (notification bell)
- Email
- (Future) Push / SMS

### 8c. Data model
- `notification_preferences` table: `user_id`, `notification_type`, `channel`, `enabled`
- Or a single JSON column on the `users` table for preferences

### 8d. Backend wiring
- API endpoint: `GET /api/notification-preferences` and `PATCH /api/notification-preferences`
- Toggle persistence on save (debounced or explicit Save button)
- Laravel notification classes should check user preference before dispatching

### 8e. UI
- Group toggles by category (Bookings, Messages, Orders, etc.)
- Per-category master toggle + per-channel granularity (Email / In-app)
- Show confirmation toast on save

---

## 9. Settings → Backend Tab — Review for End-User Relevance

The "Backend" tab is visible in buyer settings. Evaluate whether any of its content is
meaningful to an end user:
- If it exposes developer/admin options: **remove from buyer portal entirely**
- If it contains something genuinely useful (e.g. API token, integrations): **rename**
  the tab to something user-facing ("Integrations", "Developer", "API Access") and keep
  only user-relevant items
- Recommendation: likely should be hidden or removed for the standard buyer role


The location field in the buyer settings, can we connect to the actual location table? show as dropdown options.
and therefore, it may be used on the frontend to show matching listings results.

