# Mobile Responsiveness Plan — Seller Panel

**Breakpoint targets:** 375px (phone) · 768px (tablet) · 1024px+ (desktop)

---

## Status: Already Done

All 9 listing index pages — grouped container + compact mobile rows pattern applied.

- [x] PropertiesPage
- [x] AutosPage
- [x] EventsPage
- [x] ClassifiedsPage
- [x] JobsPage
- [x] ServicesPage
- [x] ProductsPage
- [x] CustomersPage
- [x] ActivityPage

---

## Tier 1 — Core UX (highest traffic, fix first)

| Page | Current Problem | Fix |
|---|---|---|
| **DashboardHome** | Stat cards + chart widgets overflow or collapse badly | Stack KPI cards 2-col on mobile; charts need `ResponsiveContainer` height guard |
| **MessagesPage** | Two-pane sidebar+thread layout — unusable at 375px | Mobile: full-screen thread drawer, inbox list fills screen; back button returns to list |
| **WalletPage** | Wide balance card + transaction table | Stack balance hero; convert table to grouped mobile rows |
| **NotificationsPage** | Per-item cards probably fine but padding/truncation unchecked | Audit padding; ensure long text wraps not clips |
| **TransactionsPage** | Desktop table — no confirmed mobile view | Add compact mobile rows same as index pages |
| **SettingsPage** | Multi-tab form with side-by-side field grids | Stack tabs vertically on mobile; fields go single-column |

- [x] DashboardHome
- [x] MessagesPage
- [x] WalletPage
- [x] NotificationsPage
- [x] TransactionsPage
- [x] SettingsPage

---

## Tier 2 — Detail / View Pages

Gallery + two-column layout (info left, sidebar right) built desktop-first.

**Fix pattern for all:** sidebar column stacks below main content on mobile (`col-span-full` default, `lg:col-span-1` restored). Gallery goes full-width. Metadata chips wrap naturally.

- [x] PropertyDetailPage
- [x] AutoDetailPage
- [x] EventDetailPage
- [x] JobDetailPage
- [x] ServiceDetailPage
- [x] ClassifiedDetailPage
- [x] ProductDetailPage
- [x] CustomerDetailPage — stats cards + purchase history table
- [x] ActivityDetailPage — booking/inquiry details in wide card

---

## Tier 3 — Create / Edit Forms

7 forms: CreateProperty, CreateAuto, CreateEvent, CreateClassified, CreateJob, CreateService, CreateProduct.

**Common problems:**
- `grid-cols-2` / `grid-cols-3` field rows squeeze badly at 375px
- MediaStudio / image upload zone may have fixed pixel widths
- Long multi-section forms need `space-y-6` instead of side-by-side panels

**Fix pattern:** Every form section defaults to `grid-cols-1`, steps up to `sm:grid-cols-2` or `lg:grid-cols-3`. Upload zones use `w-full` not fixed widths.

- [x] CreateProperty
- [x] CreateAuto
- [x] CreateEvent
- [x] CreateClassified
- [x] CreateJob
- [x] CreateService
- [x] CreateProduct

---

## Tier 4 — Analytics

| Page | Problem |
|---|---|
| **AnalyticsPage** | Charts have fixed width; stat grids overflow |
| **ListingAnalyticsPage** | Same + possibly desktop-only table |
| **LiveInteractionsPage** | Real-time feed — check card widths |
| **AnalyticsChartWidget** | Recharts `<BarChart width={X}>` needs `ResponsiveContainer` |

- [x] AnalyticsPage
- [x] ListingAnalyticsPage
- [x] LiveInteractionsPage
- [x] AnalyticsChartWidget

---

## Tier 5 — Remaining

| Page | Note |
|---|---|
| **ReviewsPage** | Star rating + reply textarea — audit card width |
| **MembershipsPage** | Pricing cards — likely fine; check feature list wrapping |
| **Login** | Single centered card — likely fine; audit input padding |
| **Error404** | Centered layout — likely fine |

- [x] ReviewsPage
- [x] MembershipsPage
- [x] Login
- [x] Error404

---

## Test Protocol (run after fixing each page)

1. DevTools → **375px** (iPhone SE) — no horizontal scroll, no clipped buttons
2. DevTools → **768px** (iPad) — mid-point layout looks intentional
3. Long text truncates OR wraps — not broken in both directions
4. Tap targets ≥ 44px height (buttons, row clicks)
5. Empty states centered and not overflowing

---

## Execution Order

1. **Tier 1** — DashboardHome · WalletPage · TransactionsPage (share "cards + table" pattern), then MessagesPage (drawer), then SettingsPage
2. **Tier 2** — All 9 detail pages (same fix repeated)
3. **Tier 3** — All 7 create/edit forms (same fix repeated)
4. **Tier 4** — Analytics (chart-specific `ResponsiveContainer` fixes)
5. **Tier 5** — Reviews · Memberships · Login · 404


Make the header responsive carefully once again.