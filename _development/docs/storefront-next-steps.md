# Storefront Next Steps

## Recommended Order

1. Test the full rental booking flow end to end:
   Pick dates in the sidebar, continue booking, complete checkout, reach the payment step, and confirm the final confirmation page.

2. Remove asset uncertainty:
   Make sure Flatpickr styling and behavior always come from bundled Vite assets in production.

3. Create real pending and confirmed test data:
   Add a seeder or factory state so the availability calendar can always be tested with booked and pending ranges.

4. Polish the mobile rental detail page:
   Verify the sidebar booking widget and main availability calendar feel clean and usable on phones.

5. Audit other storefront single pages:
   Review products, autos, services, and events for similar data/view mismatch issues.

## Recommended Next Task

Continue with regression coverage for the rental booking and storefront single-page flows.

## Progress

- Completed: Rental booking flow tested end to end through checkout, payment, and confirmation.
- Completed: Flatpickr is loaded from bundled Vite assets, and frontend date-picker calls now guard against missing assets.
- Completed: Added deterministic seeded pending and confirmed rental bookings for availability-calendar testing.
- Completed: Mobile rental detail page checked at phone width with no horizontal overflow; sidebar date picker and calendar render correctly.
- Completed: Product, vehicle, service, event, and rental property single pages audited with browser checks.
