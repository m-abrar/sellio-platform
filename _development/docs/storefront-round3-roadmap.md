# Storefront Round 3 Roadmap — Full Transactional Flow

Goal: complete all **52 themes** with the full journey:

`Home → Explore → Product → Cart/Booking → Checkout → Payment → Confirmation`

Last updated: 2026-06-11

---

## Phase 0 — Platform plumbing (in progress)

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
| 1 | `unifieds_minimal` | ✅ | ✅ | ✅ | ✅ | 🔄 | Phase 0 pilot |
| 2 | `ecommerce_default` | ✅ | ✅ | ✅ | ✅ | ⬜ | |
| 3 | `properties_rental` | ✅ | ✅ | ✅ | ⬜ | ⬜ | Booking flow |
| 4 | `properties_modern` | ✅ | ✅ | ✅ | ⬜ | ⬜ | Inquiry + rental |
| 5 | `autos_modern` | ✅ | ✅ | ✅ | ⬜ | ⬜ | Inquiry API |
| 6 | `events_corporate` | ✅ | ✅ | ✅ | ⬜ | ⬜ | Ticket booking |
| 7 | `jobs_startup` | ✅ | ✅ | ✅ | ⬜ | ⬜ | Application API |
| 8 | `services_marketplace` | ✅ | ⬜ | ✅ | ⬜ | ⬜ | Explore + lead API |
| 9 | `classifieds_local` | ✅ | ⬜ | ✅ | ⬜ | ⬜ | Explore + inquiry API |

---

## Phase 2–9 — Theme rollout (43 remaining)

Clone from golden template per vertical. See conversation roadmap for per-theme order.

### Vertical completion tracker

| Vertical | Total | 100% complete |
|----------|------:|:-------------:|
| Unifieds | 8 | 0 |
| Ecommerce | 4 | 0 |
| Properties | 13 | 0 |
| Autos | 5 | 0 |
| Events | 5 | 0 |
| Jobs | 6 | 0 |
| Services | 5 | 0 |
| Classifieds | 6 | 0 |
| **Total** | **52** | **0** |

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
| `POST /v1/properties/{id}/bookings` | Properties rental | P1 |
| `POST /v1/bookings/{id}/pay` | Properties | P1 |
| `POST /v1/events/{id}/bookings` | Events | P1 |
| `POST /v1/event-bookings/{id}/pay` | Events | P1 |
| `POST /v1/vehicles/{slug}/inquiries` | Autos | P2 |
| `POST /v1/jobs/{slug}/applications` | Jobs | P2 |
| `POST /v1/services/{slug}/consultations` | Services | P2 |
| `POST /v1/classifieds/{slug}/inquiries` | Classifieds | P2 |
| `POST /v1/properties/{slug}/inquiries` | Properties sale | P2 |

---

## References

- Round 1: `_development/docs/storefront-round1-roadmap.md`
- Round 2: `_development/docs/storefront-round2-roadmap.md`
- Dynamic status: `_development/planning/dynamic_themes_report.md`
- Theme registry: `apps/storefront/THEME_MASTER_INVENTORY.md`
