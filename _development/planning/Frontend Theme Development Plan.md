# Frontend Theme Development Plan

Last updated: 2026-06-28

**Overall audit score: 6.2/10** — ~30% of 52 themes are skeletal or near-duplicate.
**Target after cleanup: 30 themes at 7/10+** — a focused, polished product.

---

## Bundle 1 — Real Estate Pro · Progress

| Theme | Status | Notes |
|---|---|---|
| `properties/modern` | ✅ Complete | Inline styles extracted; About + Contact pages added; SEO metadata; accessibility audit |
| `properties/rental` | ✅ Complete | Core extraction done; colour consistency fixed; About/Contact/FAQ deferred |
| `properties/luxury` | ✅ Complete | Inline extraction across 7 files; hardcoded strings → useThemeContent; SEO done |
| `properties/classic` | ✅ Complete | dangerouslySetInnerHTML removed; AgentBioPage + NeighborhoodStats built; newsletter bug fixed; responsive + SEO deferred |
| `properties/vacation` | 🔄 Active | ProductPage audit next: host profile, amenity icons, booking calendar; then inline extraction |

---

## Phase 1 — Polish & Submit
> Already 8.5–9/10. Needs QA pass, responsive review, demo content check only. ~1–2 days each.

| # | Theme | Score | Notes |
|---|---|---|---|
| 1 | `properties/modern` | ✅ 9/10 | ✅ **Complete.** Flagship. Real estate is #1 CodeCanyon category. 61 files, 42 components, calendar, gallery, filtering. → [Detailed plan](themes/properties-modern.md) |
| 2 | `ecommerce/b2b` | 9/10 | B2B marketplace sells at premium. Quote requests, bulk ordering, multi-page (blog, contact, about). → [Detailed plan](themes/ecommerce-b2b.md) |
| 3 | `properties/rental` | ✅ 8.5/10 | ✅ **Complete (core done).** Airbnb-style rental demand. Availability calendars, host features, booking flow. → [Detailed plan](themes/properties-rental.md) |
| 4 | `unifieds/marketplace` | 8.5/10 | Widest buyer pool. Multi-vertical homepage, rich filtering, editorial sections. → [Detailed plan](themes/unifieds-marketplace.md) |
| 4b | `unifieds/default` | 7.5/10 | Foundation theme — needs full discovery layer to match Laravel homepage. → [Detailed plan](themes/unifieds-default.md) |
| 5 | `classifieds/elite` | 8.5/10 | Underserved luxury/collectibles niche. Spotlight carousel, QuickView overlay, favorites. → [Detailed plan](themes/classifieds-elite.md) |
| 6 | `jobs/startup` | 8.5/10 | Tech startup job boards in demand. Equity visualization, application forms. → [Detailed plan](themes/jobs-startup.md) |
| 7 | `events/music` | 8.5/10 | Festival/music platforms. 18 files, lineup grid, editorial sections. → [Detailed plan](themes/events-music.md) |

---

## Phase 2 — Small Gaps
> 7.5–8/10. Need 1–2 extra components, responsive pass, typography/color confirmation. ~3–5 days each.

| # | Theme | Score | What's Missing |
|---|---|---|---|
| 8 | `ecommerce/fashion` | 8/10 | Cart/checkout flow review; strong editorial identity already exists. → [Detailed plan](themes/ecommerce-fashion.md) |
| 9 | `properties/luxury` | ✅ 8/10 | ✅ **Complete (core done).** Gold palette consistent; inline extraction done across all files. → [Detailed plan](themes/properties-luxury.md) |
| 10 | `autos/luxury` | 8/10 | Vehicle spec display + comparison component. → [Detailed plan](themes/autos-luxury.md) |
| 11 | `properties/classic` | ✅ 8.5/10 | ✅ **Complete (core done; responsive + SEO deferred).** AgentBioPage + NeighborhoodStats built; dangerouslySetInnerHTML removed; newsletter fixed. → [Detailed plan](themes/properties-classic.md) |
| 12 | `events/corporate` | 8/10 | Speaker grid + sponsor row components. → [Detailed plan](themes/events-corporate.md) |
| 13 | `classifieds/general` | 7/10 | Category filter breadcrumb + saved search UI. → [Detailed plan](themes/classifieds-general.md) |
| 14 | `classifieds/local` | 7/10 | Map embed + community board section. → [Detailed plan](themes/classifieds-local.md) |
| 15 | `ecommerce/default` | 7.5/10 | Review/rating display + wishlist component. → [Detailed plan](themes/ecommerce-default.md) |
| 16 | `autos/classic` | 7.5/10 | Financing calculator widget. → [Detailed plan](themes/autos-classic.md) |
| 17 | `services/marketplace` | 7.5/10 | Provider verification badge + booking confirmation page. → [Detailed plan](themes/services-marketplace.md) |
| 18 | `jobs/tech` | 7/10 | Terminal UI is clever but needs mobile fallback styling. → [Detailed plan](themes/jobs-tech.md) |

---

## Phase 3 — Medium Work
> 5.5–7/10. Needs new components, stronger visual identity, sometimes a full color/typography pass. ~1 week each.

| # | Theme | Score | What Needs Doing |
|---|---|---|---|
| 19 | `autos/modern` | 7/10 | Differentiate from luxury — bold hero + search filter bar. → [Detailed plan](themes/autos-modern.md) |
| 20 | `ecommerce/electronics` | 7/10 | Spec comparison table + tech-forward color scheme. → [Detailed plan](themes/ecommerce-electronics.md) |
| 21 | `properties/vacation` | 🔄 7.5/10 | 🔄 **Active — Bundle 1 next.** Host profile + amenity icons + booking calendar; heavy inline styles in RetreatBentoCard, ExperienceStats, EscapeFooter. → [Detailed plan](themes/properties-vacation.md) |
| 22 | `classifieds/deals` | 6/10 | Countdown timer component + "ending soon" urgency badge. → [Detailed plan](themes/classifieds-deals.md) |
| 23 | `events/creative` | 7/10 | Artist/speaker showcase + colorful hero (only 639 CSS lines — needs visual lift). → [Detailed plan](themes/events-creative.md) |
| 24 | `events/festival` | 7/10 | Lineup grid + stage schedule + ticket pricing component. → [Detailed plan](themes/events-festival.md) |
| 25 | `autos/electric` | 5/10 | **Remove all hardcoded Tesla/Rivian/Kia/Lucid fallback data.** Add real EV specs (range, charging time, battery). → [Detailed plan](themes/autos-electric.md) |
| 26 | `autos/used` | 5.5/10 | Full styling pass needed (only 602 CSS lines). Add vehicle history section. → [Detailed plan](themes/autos-used.md) |
| 27 | `jobs/blue_collar` | 6/10 | Certification badge + industrial hero section (only 646 CSS lines). → [Detailed plan](themes/jobs-blue-collar.md) |

---

## Phase 4 — Invest More
> Needs significant rework. Only tackle after Phase 3 is complete.

| # | Theme | Score | Decision Point |
|---|---|---|---|
| 28 | `services/corporate` | 7/10 | Add case study grid + testimonial section — or merge into `services/marketplace`. → [Detailed plan](themes/services-corporate.md) |
| 29 | `services/creative` | 6.5/10 | Portfolio grid + pricing table — agency market is real, worth finishing. → [Detailed plan](themes/services-creative.md) |
| 30 | `classifieds/premium` | 8/10 | Overlaps heavily with `elite` — rebrand as auction-specific or cut entirely. → [Detailed plan](themes/classifieds-premium.md) |

---

## Ignore for now — work on them later

| Group | Themes | Reason |
|---|---|---|
| Skeletal properties | `neighborhood`, `investment`, `unified`, `urban`, `showcase`, `platinum`, `commercial`, `map` | Thin wrappers, no visual identity, no custom component depth. |
| Duplicate jobs | `corporate`, `modern`, `freelance` | Near-identical to each other, no differentiator. |
| Weak services | `health`, `local` | Emoji icons (🔧, 🏠), generic grid — not production-ready. |
| Duplicate ecommerce | `luxury` | Overlaps with `fashion` without adding value. |
| Skeletal unifieds | `interactive`, `mega`, `classic`, `standard` | Clones of `default` with minimal CSS. |
| Events baseline | `classic` | Generic, no niche value. |
| Classifieds stub | `modern` | Incomplete stub. |

Ignoring **22 themes** leaves **30 well-differentiated themes** — a stronger CodeCanyon product than 52 uneven ones.

---

## Submission Strategy

### Fastest Path to First Submission
Phase 1 alone (7 themes) is already submission-ready. List as **"Pack 1: Flagship Themes"** while finishing Phase 2 in parallel.

### Suggested Bundle Groupings

| Bundle | Themes | Positioning |
|---|---|---|
| **Real Estate Pro** | `properties/modern`, `properties/rental`, `properties/luxury`, `properties/classic`, `properties/vacation` | #1 demand category |
| **Commerce Suite** | `ecommerce/b2b`, `ecommerce/fashion`, `ecommerce/default`, `ecommerce/electronics` | Wide ecommerce market |
| **Classifieds & Jobs** | `unifieds/marketplace`, `classifieds/elite`, `classifieds/general`, `classifieds/local`, `jobs/startup`, `jobs/tech` | Multi-vertical marketplace buyers |
| **Autos** | `autos/luxury`, `autos/classic`, `autos/modern`, `autos/electric`, `autos/used` | Niche auto dealer market |
| **Events & Services** | `events/music`, `events/corporate`, `events/creative`, `events/festival`, `services/marketplace`, `services/corporate` | Events/agency buyers |

### Expected CodeCanyon Reception

| Scenario | Estimated Stars |
|---|---|
| Submit all 52 themes now | 3.5–4 ★ |
| Trim to 30 themes (remove skeletal) | 4.2–4.5 ★ |
| Phase 1–2 complete + trimmed | 4.5–4.8 ★ |

---

## Quality Benchmarks (What "Done" Means Per Phase)

A theme is ready to submit when it meets all of these:

- [ ] Distinct color palette and typography — cannot be confused with a sibling theme at a glance
- [ ] Minimum 3 custom components beyond Layout/Page/ProductPage
- [ ] All pages responsive at 375px, 768px, 1280px
- [ ] No hardcoded demo data in component files (fallback data in `fallback-data.ts` only)
- [ ] ProductPage fully wired to live API with fallback
- [ ] No placeholder copy ("Lorem ipsum", "Coming soon", "TODO")
- [ ] Consistent header/footer styling across all pages
- [ ] At least one page beyond homepage + product detail (booking, contact, inquiry, quote, etc.)
