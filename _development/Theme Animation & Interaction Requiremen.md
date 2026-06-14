# Theme Animation & Interaction Requirements

## 1. Buttons & CTAs

- Primary CTA: scale up `1.03` on hover with a subtle shadow lift; press down to `0.97` on click.
- Secondary/outline buttons: transition border color and background fill on hover (`200ms ease`).
- Submit/loading states: spinner replaces text with a fade crossfade, not a jump.
- Disabled state: opacity transition rather than instant grey-out.
- Destructive actions (cancel, clear): brief shake animation on click to signal danger.

## 2. Cards (Product, Listing, Job, Vehicle, etc.)

- Lift shadow and translate `Y -4px` on hover (`transform` + `box-shadow`, `200ms ease-out`).
- Image scale `1.04` inside its container on card hover (`overflow: hidden`, no layout shift).
- Price/badge highlight pulse on first render (once, not looping).
- Favorite/heart icon: pop scale animation on toggle (`1 -> 1.3 -> 1`, spring-like).
- "New" / "Featured" badges: slide in from left on initial page load (stagger by card index).

## 3. Navigation & Headers

- Nav links: underline grows from center on hover (pseudo-element width `0 -> 100%`).
- Mobile menu: slide and fade in, not instant appear; overlay fades in behind.
- Sticky header: subtle shadow appears on scroll (only after `60px`, smooth transition).
- Active nav item: indicator bar slides between items (not hard jump).
- Logo: no animation; keep static for brand stability.

## 4. Forms & Inputs

- Input focus: border color transition (`200ms`) and very subtle inner glow (`box-shadow`).
- Label behavior: float up and shrink when focused or filled (floating label pattern).
- Validation errors: slide down from above the field (not layout jump), red border transition.
- Form submission: button transitions to spinner, fields become read-only with `50%` opacity.
- Success redirect: brief checkmark flash before `window.location.assign` fires (`150ms` delay).
- Textarea: smooth height expansion while typing if auto-resize is used.

## 5. Page Load & Entry Animations

- Hero section: fade and translate `Y 20px -> 0` on mount (`300ms`, `ease-out`).
- Staggered card grid: cards fade in with `50ms` delay per item (cap at 8 items to avoid slow feel).
- Skeleton loaders: shimmer sweep animation (`linear-gradient` moving left-to-right).
- Page transitions: fade out current, fade in next (Next.js `usePathname` + CSS transition).
- Images: fade in when loaded (`onLoad -> add .loaded class` with `opacity 0 -> 1`).

## 6. Explore / Listing Grid

- Filter sidebar toggles: slide and fade (not instant show/hide).
- Filter chips applied: slide in from left, close button scales in.
- Filter reset: chips scatter-fade out (stagger), grid re-renders with fade.
- Load More button: reveals new cards with stagger fade-in (not instant append).
- Empty state illustration: gentle float animation (`translateY(0) -> translateY(-6px)`, loop, `3s ease-in-out`).

## 7. Modals, Drawers & Overlays

- Modals: scale from `0.95 -> 1` and fade in; overlay fades in; dismiss reverses both.
- Bottom sheets (mobile): translate `Y 100% -> 0`, spring easing.
- Tooltips: fade and scale from `0.9 -> 1` on show, instant hide (do not animate dismiss).
- Alert banners: slide down from top, auto-dismiss with slide back up.

## 8. Confirmation Pages

- Success icon (checkmark circle): draw-on animation using SVG `stroke-dasharray`.
- Reference number: count up from 0 to actual ID (`300ms`, `requestAnimationFrame`).
- "What's next" steps: stagger fade-in `80ms` apart after icon animation completes.
- CTA buttons: bounce in softly after the above sequence (total `~800ms` from load).

## 9. Image Galleries & Media

- Main product image swap: crossfade (`200ms`) rather than hard cut.
- Thumbnail selection: active indicator slides between thumbs.
- Zoom on hover (product photos only): `transform-origin` follows cursor position.
- Lazy images: blur-up effect (tiny blurred placeholder -> sharp on load).

## 10. Micro-interactions

- Star/rating tap: star fills with a ripple from the click point.
- Copy-to-clipboard button: brief "Copied!" tooltip fades in then out automatically.
- Accordion / FAQ expand: height transition (`max-height` approach) and chevron rotates `180deg`.
- Tab switchers: active indicator bar slides horizontally between tabs.
- Pagination: page number highlights with scale and color on click.
- Scroll-to-top button: fade in after `400px` scroll, smooth scroll on click.

## 11. Booking & Checkout Flows

- Step indicator: completed steps get a checkmark draw-in; active step pulses once.
- Date picker day selection: ripple effect on click, range highlight fades in.
- Price summary update: numbers animate (count up/down) when quantities change.
- "Proceed" button: arrow icon shifts right on hover.

## 12. Vertical-Specific Notes

| Vertical | Specific requirement |
| --- | --- |
| Events | Ticket quantity stepper: +/- buttons pulse on press; count flips (slot-machine style). |
| Properties | Map pins: drop in with bounce on load; hover shows card slide-up from pin. |
| Jobs | Apply button: "Submitting..." with animated dots; on success checkmark draw-in. |
| Autos | Gallery image: Ken Burns pan effect on hero image; spec rows highlight on hover. |
| Classifieds | Offer price field: shimmer on focus to draw attention. |
| Services | Consultant avatar: ring pulse animation on hover (availability indicator). |
| Ecommerce | Add to cart: item flies to cart icon (parabolic path, CSS keyframes). |
| Unifieds | Theme switcher: cards flip/fade when switching themes. |

## 13. Performance Constraints

- All animations must use `transform` and `opacity` only (no animating `height`, `width`, `top`, `left`, or `margin`) to keep them on the compositor thread.
- `prefers-reduced-motion` media query must be respected: all animations collapse to instant.
- No animation longer than `400ms` for UI feedback; use `600-800ms` only for entry sequences.
- Looping animations (empty state float, shimmer) must pause when tab is hidden (`visibilitychange`).
- Spring physics preferred over linear easing for interactive elements; use `ease-out` for entry and `ease-in` for exit.

## 14. Implementation Approach

- Use CSS custom properties for duration and easing so themes can tune values per brand.
- Shared animation utility classes in each vertical's `shared/` CSS (for example, `.fade-in-up`, `.scale-in`, `.stagger-[1-8]`).
- JavaScript-driven animations only when CSS alone cannot achieve it (for example, SVG draw-on, count-up).
- Avoid `react-spring` / `framer-motion` unless already in the dependency tree; CSS transitions and Tailwind `transition-*` classes are preferred for bundle size.
