# Seller Portal — Pending Tasks

Captured: 2026-06-20

---

## Reported by user

### Customers page — placeholder/dummy data
Find out if the Customers module is using placeholder or dummy data and replace with real API data.

---

### Audit all pages for placeholder/static data
Find any other pages in the seller portal that are still showing static or fake data.

---

### Title truncation on listing pages
`/dashboard/properties` — the listing title loses the last character(s) due to the `truncate` CSS class.
Check all other vertical listing pages for the same issue.

---

### Property save error
`The selected fees.0.type is invalid. (and 11 more errors)`
Saving a property listing triggers this validation error. Fix the fees payload sent to the backend.

---

### Event save error
`The existing_media_ids.0 field must be an integer.`
Saving an event triggers this validation error. Fix the media IDs payload.

---

### Ticket Pricing Tiers — delete button
The delete button on Ticket Pricing Tiers shows a full label and takes too much space.
Change it to an icon-only button.

---

### Job edit save error
`The salary max field must be greater than or equal to 85. (and 1 more error)`
Saving an edited job listing triggers this validation error. Fix the salary field constraints/payload.

---

### Description placement on listing view pages
`/dashboard/products/view/[slug]` — move the description from the sidebar into the main content area.
Apply the same change to all other vertical listing view pages.

---

## Found during codebase audit (2026-06-20)

### Settings — "Coming soon" sections are hidden but not implemented
Three settings sections are hidden behind `comingSoon: true` flags in `SettingsPage.tsx`:
- **Two-Factor Authentication** (Security & Access)
- **Password Control** (Update credentials)
- **Alert Preferences** (Configure system alerts)

These need to either be implemented or properly deferred to a planning doc.

---

### Analytics — Export CSV button is non-functional
`AnalyticsPage.tsx` — the Export CSV button has no `onClick` handler. It is currently a
placeholder CTA with a comment calling it out. Wire it up or remove it.

---

### Dashboard — dummy activity feed when no real data
`DashboardHome.tsx` — when `activities.length === 0` the dashboard renders hardcoded fake
interactions with celebrity names (Julian Vance, Sarah Connor, Michael Ross, etc.).
Replace with a proper empty state component instead of fake data.

---

### Dashboard — activity feed limited to 6 items, no pagination
`DashboardHome.tsx` — only shows `activities.slice(0, 6)`. There is no "View all" link or
pagination. Add a link to the full activity/leads list.

---

### Events & Media Studio — `Math.random()` used for temporary IDs
`CreateEvent.tsx` and `MediaStudio.tsx` — temporary client-side IDs are generated with
`Math.random()`. Replace with `crypto.randomUUID()` to avoid potential collisions.

---

### Activity API — errors swallowed silently
`activity.ts` — `fetchAllLeadRecords()` catches all errors with an empty `catch {}` block
and returns an empty array without logging. Add error logging or surface the error to the UI.

---

### Google Maps picker — disabled without API key
`GoogleMapPicker.tsx` — shows a "Map picker disabled" message and falls back to a plain
text input when no Google Maps API key is configured.
Ensure the API key is set in admin settings, or document the setup step clearly.

---

replace the content copy which gives a feeling of ai generated english
can we use the simple and regular english words that are already used in codecanyon products?