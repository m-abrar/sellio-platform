## Completed

- [x] Rewrite all frontend content/copy to focus on end user, not theme features. Rewrote hero, highlight, collection, category, testimonial, and CTA copy in `Page.tsx`, the explore page intro in `ExplorePage.tsx`, and the footer tagline in `components/index.tsx` to describe buyer/seller value (finding listings fast, transparent pricing, listing in minutes) instead of describing the theme's own visual design ("Precision Design", "pure marketplace aesthetics", a design-journal quote about the theme itself).
- [x] Refactor data fetching to support all verticals, not just classifieds. Moved the multi-vertical catalog logic (`fetchAllVerticals`, `fetchVerticalDetail`) from `unifieds/default` into `unifieds/shared/multiVertical.ts` so it can be reused by other theme variants. `minimal/Page.tsx`, `ExplorePage.tsx`, and `ProductPage.tsx` now fetch and render listings across products, properties, autos, jobs, services, events, and classifieds (vertical filter chips on Explore, vertical-aware detail page with the matching inquiry/apply/consultation form via a new `InteractionForms.tsx`), and `index.ts` now exports the inquiry/application/consultation confirmation pages those forms redirect to.

## Pending

Task: Polish the "Minimal" theme to make it look production-ready and premium, without losing minimalism.
