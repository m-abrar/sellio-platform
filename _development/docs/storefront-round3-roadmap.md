# Storefront Round 3 Roadmap — Full Transactional Flow

Goal: complete all **52 themes** with the full journey:

`Home → Explore → Product → Cart/Booking → Checkout → Payment → Confirmation`

Last updated: 2026-06-11

---

## Phase 0 — Platform plumbing ✅

## Phase 1 — Golden templates (in progress)

| Task | Status | Notes |
|------|:------:|-------|
| `ApiPaymentGatewayController` — active gateways + publishable keys | ✅ | `GET /api/v1/payment-gateways` |
| `ApiCheckoutController` — context, process, confirm | ✅ | Mirrors web `CheckoutController` as JSON |
| `@sellio/api-client` — cart, auth, checkout methods | ✅ | Credentials + Bearer token |
| Storefront `AuthProvider` | ✅ | Login/register for checkout |
| App routes `/checkout`, `/checkout/confirmation/[orderNumber]` | ✅ | Theme-aware via `loadThemeSubpage` |
| `UnifiedCheckoutPage` shared component | ✅ | Golden path for unifieds |
| Wire `unifieds_minimal` cart → checkout | ✅ | Removes simulated checkout |

**Phase 0 exit criteria:** `unifieds_minimal` completes browse → cart → checkout → order confirmation (Stripe sandbox when configured).

---

## Phase 1 — Golden templates (9 pilots)

| # | Theme | Home | Explore | Product | Cart/Book | Checkout | Status |
|---|-------|:----:|:-------:|:-------:|:---------:|:--------:|:------:|
| 1 | `unifieds_minimal` | ✅ | ✅ | ✅ | ✅ | ✅ | Phase 0 pilot |
| 2 | `ecommerce_default` | ✅ | ✅ | ✅ | ✅ | ✅ | API cart + themed checkout |
| 2b | `ecommerce_fashion` | ✅ | ✅ | ✅ | ✅ | ✅ | Themed checkout |
| 2c | `ecommerce_electronics` | ✅ | ✅ | ✅ | ✅ | ✅ | Themed checkout |
| 2d | `ecommerce_luxury` | ✅ | ✅ | ✅ | ✅ | ✅ | Themed checkout |
| 3 | `properties_rental` | ✅ | ✅ | ✅ | ✅ | ✅ | API booking + `/booking` payment |
| 4 | `properties_modern` | ✅ | ✅ | ✅ | ✅ | ✅ | Sale inquiry API + rental booking |
| 5 | `autos_modern` | ✅ | ✅ | ✅ | ✅ | — | Vehicle inquiry API |
| 6 | `events_corporate` | ✅ | ✅ | ✅ | ✅ | ✅ | Ticket booking + `/booking` payment |
| 7 | `jobs_startup` | ✅ | ✅ | ✅ | ✅ | — | Application API (auth required) |
| 8 | `services_marketplace` | ✅ | ✅ | ✅ | ✅ | — | Native explore + consultation API |
| 9 | `classifieds_local` | ✅ | ⬜ | ✅ | ⬜ | ⬜ | Explore + inquiry API |

---

## Phase 2–9 — Theme rollout (43 remaining)

Clone from golden template per vertical. See conversation roadmap for per-theme order.

### Vertical completion tracker

| Vertical | Total | 100% complete |
|----------|------:|:-------------:|
| Unifieds | 8 | 1 |
| Ecommerce | 4 | 4 |
| Properties | 13 | 2 |
| Autos | 5 | 1 |
| Events | 5 | 1 |
| Jobs | 6 | 1 |
| Services | 5 | 1 |
| Classifieds | 6 | 0 |
| **Total** | **52** | **11** |

---

## Per-theme definition of done

```
□ Preview: ?theme= and /preview/{key}/ on all routes
□ Home: live API, loading, empty, error, mobile OK
□ Explore: native ExplorePage (not cross-vertical fallback)
□ Product: slug fetch, 404, related items, vertical CTA → real API
□ Cart/Booking: server cart or booking API (not localStorage)
□ Checkout: themed /checkout or /booking route
□ Payment: gateway charge succeeds in sandbox (where applicable)
□ Confirmation: reference ID shown
□ Auth: guest → login → resume checkout
□ Demo fallback: never on transaction paths
□ CSS scoped, no cross-theme leak
□ Browser QA: desktop + 390px, clean console
```

---

## Backend API still needed (post Phase 0)

| Endpoint | Vertical | Priority |
|----------|----------|:--------:|
| `POST /v1/properties/{id}/bookings` | Properties rental | ✅ |
| `POST /v1/property-bookings/{id}/pay` | Properties | ✅ |
| `POST /v1/events/{id}/bookings` | Events | ✅ |
| `POST /v1/event-bookings/{id}/pay` | Events | ✅ |
| `POST /v1/vehicles/{id}/inquiries` | Autos | ✅ |
| `POST /v1/jobs/{slug}/applications` | Jobs | ✅ |
| `POST /v1/services/{id}/consultations` | Services | ✅ |
| `POST /v1/classifieds/{slug}/inquiries` | Classifieds | P2 |
| `POST /v1/properties/{id}/inquiries` | Properties sale | ✅ |

---

## References

- Round 1: `_development/docs/storefront-round1-roadmap.md`
- Round 2: `_development/docs/storefront-round2-roadmap.md`
- Dynamic status: `_development/planning/dynamic_themes_report.md`
- Theme registry: `apps/storefront/THEME_MASTER_INVENTORY.md`
