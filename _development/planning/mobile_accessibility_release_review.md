# Mobile Accessibility and Layout Review

Updated: 2026-06-28

## Reviewed surfaces

- Authentication, registration, password reset, profile, and password management.
- Marketplace discovery, listing details, favorites, and buyer activity.
- Reviews, inbox, conversation detail, notifications, cart, and payment return.

## Checks completed

- Protected and form-heavy screens use safe-area containers.
- Login, registration, profile, password, listing forms, and message composition account for the keyboard.
- Scrollable screens retain controls on small displays instead of relying on fixed-height layouts.
- Loading, empty, offline, error, and authenticated states have deterministic component-state coverage.
- Critical icon-only and transaction controls have button roles and spoken labels.
- Cart quantity targets use a minimum 44 by 44 touch area.
- Images that communicate listing or profile context include accessibility labels or a text fallback.
- Dark surfaces preserve high-contrast primary text, status text, and action labels.
- Android microphone permission from development tooling is explicitly blocked because the app does not record audio.

## Manual release checks

- Verify VoiceOver and TalkBack traversal on signed preview builds.
- Verify keyboard avoidance on the smallest supported Android and iOS screen sizes.
- Verify system font scaling at 200 percent before store submission.
