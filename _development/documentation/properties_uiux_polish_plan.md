# Properties UI/UX Polish Plan

Scope: active Laravel frontend property pages and booking flow.

Primary files:
- `apps/backend/resources/views/frontend/properties/**`
- `apps/backend/resources/views/components/frontend/listing-index.blade.php`
- `apps/backend/resources/views/components/frontend/detail-shell.blade.php`
- `apps/backend/resources/views/components/frontend/page-shell.blade.php`
- `apps/backend/public/frontend/css/style.css`

## 1. Unify Property Listing UX

- Fix `_card.blade.php` double column wrapping. `search.blade.php` already wraps each card in `.col`, and `_card.blade.php` currently does too.
- Standardize listing labels: `Rent` vs `Rental`, sale/rental badges, price formats, empty states.
- Add active filter count and clearer mobile filter state in `listing-index`.
- Improve cards: consistent image height, better title wrapping, bedroom/bath/area layout on small screens.

## 2. Refine Filter Sidebar

- Make sale/rental switch drive filter relevance more clearly.
- Hide sale-only price slider for rentals; show nightly/date filters with better copy.
- Add selected filter chips above results.
- Improve mobile filter drawer spacing, sticky action button, and reset affordance.
- Validate date range UX: prevent checkout before check-in and show unavailable states.

## 3. Upgrade Property Detail Pages

- Reduce heavy nested glass/card styling so sale and vacation pages feel cleaner.
- Make gallery feel more premium: better controls, photo count, optional thumbnail strip or view-all affordance.
- Add consistent section rhythm for summary, description, amenities, map, reviews, related.
- For sale pages, make `Schedule a Visit` feel like a lead form, not a booking form.
- For vacation pages, make booking sidebar the primary CTA and add trust/fee clarity near price.

## 4. Polish Availability and Booking Widget

- Consolidate inline CSS/JS from `_sidebar-booking.blade.php` and `_availability_calendar.blade.php` into shared CSS/JS where practical.
- Make selected date range, nights, guests, and total update feel like one compact quote card.
- Add clearer disabled-date explanation and minimum-stay messaging.
- Improve mobile sticky CTA so it does not obscure page bottom content.

## 5. Booking Flow: Step 1 Checkout

- Rename sections around user intent: `Stay Details`, `Enhance Your Stay`, `Guest Details`, `Review Total`.
- Make add-ons easier to scan with selectable rows, clearer quantity behavior, and selected state.
- Keep price summary sticky on desktop; turn it into a bottom summary/action bar on mobile.
- Add visible validation feedback for contact fields and guests.

## 6. Booking Flow: Step 2 Payment

- Keep the payment card preview, but simplify visual noise.
- Ensure demo card messaging is clearly marked as demo/dev-only if this ships publicly.
- Make the review/edit area more compact.
- Improve payment form accessibility: labels, autocomplete, error states, submit loading state.

## 7. Booking Flow: Step 3 Confirmation

- Split paid vs unpaid states more clearly.
- Use stronger primary action hierarchy: paid means itinerary/dashboard; unpaid means complete payment.
- Add booking reference, stay summary, host contact, and next steps in a cleaner receipt layout.
- Ensure copy is calm and consistent across statuses.

## 8. Design System Cleanup

- Create property/booking-specific utility classes in `public/frontend/css/style.css`.
- Reduce inline styles in Blade partials.
- Standardize radius, shadows, spacing, section titles, metric labels, button shapes.
- Check color contrast, keyboard focus, mobile overflow, and sticky sidebar behavior.

## 9. Quality Pass

- Run focused Blade/PHP tests that cover property booking routes.
- Add browser screenshots for property listing, sale detail, vacation detail, checkout, payment, and confirmation on desktop/mobile.
- Verify no layout overlap, no hidden CTA, and date/price calculations remain intact.

## Notes From Scan

- The booking flow already has good structure: stepper, summary sidebar, validation states, and payment breakdowns.
- Best path is iterative polish, not a rebuild.
- Several partials carry inline styles/scripts that should be gradually moved into shared assets.
