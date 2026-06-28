# Theme Completion Plan: `autos/classic`

**Priority:** #16 — Classic/collector car marketplace; filter-by-era system + live auctions section are differentiators
**Theme path:** `apps/storefront/src/themes/autos/classic/`
**Audit score:** 7/10 — feature set is solid; code quality is the lowest in Phase 2: most of Page.tsx and ProductPage.tsx is inline-styled

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, InquiryConfirmationPage, Layout
- Components: ClassicHeader (CMS MenuNav + MenuActionButtons; hamburger ✓ with `aria-expanded` ✓), ClassicCarCard, AuctionCard, ClassicFooter (FooterMenuColumn × 2 ✓)
- Live API via `fetchVehiclesHome` + demo fallback via `resolveVehiclesFailure`
- `useThemeContent` throughout Page.tsx: hero, filters, collection title/count, empty state, auctions title, about section
- Vehicle filter system: make, model, year-era, price bracket — all stateful, client-side filtering
- Auction spotlight section with countdown display
- About section with image + copy
- `CatalogSyncAlert` for API errors
- ProductPage: specs grid (7 fields), inquiry form with offer price + phone + notes, `LiveChatWidget`, related vehicles

---

## Gaps & Issues to Fix

### 1. Missing Feature: Financing Calculator Widget

The primary feature gap for this theme. A calculator in the ProductPage right sidebar shows estimated monthly payments for collector car financing.

**Insert between the valuation card and the inquiry form in `ProductPage.tsx`:**

```tsx
const FinancingCalculator = ({ vehiclePrice }: { vehiclePrice: number }) => {
  const [downPct, setDownPct] = useState(0.2);
  const [termMonths, setTermMonths] = useState(60);
  const [interestRate, setInterestRate] = useState(5.9);

  const loanAmount = vehiclePrice * (1 - downPct);
  const r = interestRate / 100 / 12;
  const monthly = r === 0
    ? loanAmount / termMonths
    : loanAmount * r / (1 - Math.pow(1 + r, -termMonths));

  return (
    <div className="ac-financing-calculator">
      <h5 className="ac-calc-title">Classic Financing Estimator</h5>
      <div className="ac-calc-row">
        <label htmlFor="ac-down-pct">Down Payment: {Math.round(downPct * 100)}%</label>
        <input id="ac-down-pct" type="range" min="0.1" max="0.5" step="0.05"
          value={downPct} onChange={(e) => setDownPct(Number(e.target.value))}
          className="ac-calc-slider" aria-label="Down payment percentage"
        />
      </div>
      <div className="ac-calc-row">
        <label htmlFor="ac-term">Term</label>
        <select id="ac-term" value={termMonths} onChange={(e) => setTermMonths(Number(e.target.value))} className="ac-calc-select">
          {[36, 48, 60, 72, 84].map(m => <option key={m} value={m}>{m} months</option>)}
        </select>
      </div>
      <div className="ac-calc-row">
        <label htmlFor="ac-rate">Interest Rate: {interestRate}%</label>
        <input id="ac-rate" type="range" min="2" max="15" step="0.1"
          value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
          className="ac-calc-slider" aria-label="Interest rate"
        />
      </div>
      <div className="ac-calc-result" aria-live="polite">
        <span className="ac-calc-result-label">Est. Monthly Payment</span>
        <span className="ac-calc-result-value">${Math.round(monthly).toLocaleString()}/mo</span>
      </div>
      <p className="ac-calc-disclaimer">Estimate only. Actual financing terms may vary.</p>
    </div>
  );
};
```

- [ ] Create `FinancingCalculator` component in `components/index.tsx`
- [ ] Insert `<FinancingCalculator vehiclePrice={car.numericPrice} />` in `ProductPage.tsx` between the valuation card and the acquisitions form
- [ ] Add `.ac-financing-calculator`, `.ac-calc-title`, `.ac-calc-row`, `.ac-calc-slider`, `.ac-calc-select`, `.ac-calc-result`, `.ac-calc-result-label`, `.ac-calc-result-value`, `.ac-calc-disclaimer` to `styles.css`

---

### 2. `ProductPage.tsx` — `<style jsx global>` Spinner Keyframes

Lines 239–244 inject `@keyframes spin` via `<style jsx global>` (styled-jsx syntax — may not work without the babel plugin):

```tsx
<style jsx global>{`
  @keyframes spin { ... }
`}</style>
```

- [ ] Move `@keyframes acSpin { ... }` to `styles.css`
- [ ] Rename to `@keyframes acSpin` to avoid conflicts
- [ ] Add `.ac-loading-spinner { animation: acSpin 1s infinite linear; }` to `styles.css`
- [ ] Remove the `<style jsx global>` block
- [ ] The loading spinner `div` currently uses `animation: 'spin 1s infinite linear'` inline — change to `className="ac-loading-spinner"`

---

### 3. Dead Code: `FALLBACK_CARS` in Page.tsx and ProductPage.tsx

`Page.tsx` lines 25–30 and `ProductPage.tsx` lines 39–44 both define a `FALLBACK_CARS` constant that is never used (demo data comes from `resolveVehiclesFailure` / `resolveVehicleFailure`, not from this array).

- [ ] Remove `FALLBACK_CARS` from `Page.tsx` (lines 25–30) — verify it's unused
- [ ] Remove `FALLBACK_CARS` from `ProductPage.tsx` (lines 39–44) — verify it's unused

---

### 4. Hardcoded `FALLBACK_AUCTIONS` — Wrap in `useThemeContent`

`Page.tsx` lines 32–35: `FALLBACK_AUCTIONS` with 2 auction items is always rendered (even with live API). Should be CMS-configurable.

- [ ] Wrap each auction in `useThemeContent` / `useThemeMedia`:
  - `auction.1.title`, `auction.1.desc`, `auction.1.bid`, `auction.1.time`, `auction.1.image` × 2
- [ ] Use current values as defaults
- [ ] If both `auction.1.title` and `auction.2.title` are empty, hide the entire auctions section

---

### 5. `Page.tsx` — Inline Styles to Extract

**Hero section:**

| Element | Target class |
|---|---|
| Eyebrow `<p>` (line 232) | `.ac-hero-eyebrow` (textTransform, letterSpacing, fontWeight, marginBottom, color) |
| Description `<p>` (line 234) | `.ac-hero-description` (fontSize, marginBottom, lineHeight, textShadow) |
| Both CTA `<a>` tags (lines 238–239) | Add padding/fontSize to `.ac-btn-cta` or `.ac-hero-btn` CSS rule |

**Filter section:**

| Element | Target class |
|---|---|
| Filter header row div (line 246) | `.ac-filter-header` |
| Filter h2 (line 247) | Add `margin: 0` to `.ac-heading` or use `.ac-filter-title` |
| "Clear filters" button (lines 250–254) | `.ac-btn-clear` |
| Each filter `<label>` × 4 (lines 259, 276, 291, 307) | `.ac-filter-label` |

**Listings header:**

| Element | Target class |
|---|---|
| Header row div (line 336) | `.ac-listings-header` |
| Section title h2 (line 337) | Add `margin: 0` to `.ac-section-title` |
| Count span (line 338) | `.ac-listings-count` |

**Empty state:**

| Element | Target class |
|---|---|
| Container div (line 350) | `.ac-empty-state` |
| Emoji span (line 351) | `.ac-empty-icon` + `aria-hidden="true"` |
| h3 (line 352) | `.ac-empty-title` |
| p (line 353) | `.ac-empty-desc` |

**Listing card link (line 359):** `style={{ textDecoration, color, display }}` → `.ac-car-link`

**Auctions section h2 LIVE badge (line 369):**

```tsx
<span style={{ background: 'var(--ac-primary)', color: 'white', ... }}>LIVE</span>
```

→ `.ac-live-badge` CSS class

**About section:**

| Element | Target class |
|---|---|
| Section `style={{ background }}` (line 378) | `.ac-section--light` modifier |
| About image (line 382) | `.ac-about-img` |
| About text column (line 387) | `.ac-about-copy` |
| About h2 (line 388) | `.ac-about-title` |
| Both paragraphs (lines 389–394) | `.ac-about-lead`, `.ac-about-body` |

---

### 6. `ShimmerCard` — All Inline Styles

`Page.tsx` lines 89–98: `ShimmerCard` is entirely inline.

- [ ] Create `.ac-shimmer-card`, `.ac-shimmer-img`, `.ac-shimmer-body`, `.ac-shimmer-line`, `.ac-shimmer-line--wide`, `.ac-shimmer-line--medium`, `.ac-shimmer-line--narrow` CSS classes
- [ ] Extract all inline styles

---

### 7. `AuctionCard` — All Inline Styles

`components/index.tsx` lines 83–96:

- [ ] Create `.ac-auction-body`, `.ac-auction-title`, `.ac-auction-desc`, `.ac-auction-bid`, `.ac-auction-bid-amount` CSS classes
- [ ] Move `height: 300px` to `.ac-car-img.ac-auction-card-img` CSS rule
- [ ] Add `width: 75%; margin-top: 1rem` to `.ac-auction-btn` modifier
- [ ] "Place Bid Now" text → wrap in `useThemeContent('auction.bid_cta', 'Place Bid Now')`

---

### 8. `ClassicCarCard` — Inline Styles

`components/index.tsx` lines 62–72:

| Element | Target class |
|---|---|
| Card outer div cursor + transition (line 63) | Add `cursor: pointer; transition: ...` to `.ac-car-card` CSS |
| Card image (line 64) | Add `height: 220px; width: 100%; object-fit: cover` to `.ac-car-img` CSS |
| Car title h5 (line 66) | `.ac-car-title` |
| Car description p (line 67) | `.ac-car-desc` |
| CTA span (line 69) | Add `width: 100%; box-sizing: border-box; display: inline-block; text-align: center` to `.ac-btn-cta` CSS |
| "View Details" text | wrap in `useThemeContent('card.cta_label', 'View Details')` |

---

### 9. `ClassicHeader` — Logo Highlight Inline Styles

`components/index.tsx` lines 20–21:

```tsx
<span style={{ color: 'var(--ac-primary)' }}>{brandPrimary}</span>
<span style={{ color: 'var(--ac-dark)' }}>{brandSecondary}</span>
```

- [ ] Create `.ac-logo-primary { color: var(--ac-primary); }` and `.ac-logo-secondary { color: var(--ac-dark); }` in `styles.css`

---

### 10. `ClassicFooter` — Inline Styles + Copyright Year

**Inline styles (lines 114–139):**

| Element | Target class |
|---|---|
| Outer grid div (line 114) | `.ac-footer-grid` |
| Footer logo `<a>` (line 116) | `.ac-footer-logo` |
| Logo primary/secondary spans (lines 117–118) | `.ac-footer-logo-primary`, `.ac-footer-logo-secondary` |
| Description `<p>` (line 119) | `.ac-footer-desc` |
| Contact email/phone `<p>` × 2 (lines 133–134) | `.ac-footer-contact-item` |
| Footer bottom div (lines 137–139) | `.ac-footer-bottom` |

**Copyright year (line 108):**

```ts
const footerCopyright = useThemeContent('footer.copyright', '2026 Sellio. All rights reserved.');
// renders as: © 2026 Sellio. All rights reserved.
```

- [ ] Change default to use dynamic year: `const year = new Date().getFullYear(); useThemeContent(..., \`${year} Sellio. All rights reserved.\`)`

**Contact title (line 132):**
- `<h5>Contact Us</h5>` — hardcoded
- [ ] Wrap in `useThemeContent('footer.contact_title', 'Contact Us')`

---

### 11. `ProductPage.tsx` — Inline Styles to Extract

The entire ProductPage is inline-styled. Target class approach:

**Loading state (lines 236–246):**

| Element | Target class |
|---|---|
| Loading container div | `.ac-loading-state` |
| Loading spinner div | `.ac-loading-spinner` (animation moves to CSS) |
| Loading text p | `.ac-loading-text` |

**Not found state (lines 251–256):**

| Element | Target class |
|---|---|
| Container div | `.ac-not-found-state` |
| Emoji span | `.ac-not-found-icon` + `aria-hidden="true"` |
| h3 | `.ac-not-found-title` |
| p | `.ac-not-found-desc` |
| CTA link | add `text-decoration: none; display: inline-block` to `.ac-btn-cta` |

**Page wrapper (line 261):** `style={{ maxWidth: '1200px', margin, padding }}` → `.ac-product-wrapper`

**Back link (lines 263–269):**

| Element | Target class |
|---|---|
| Breadcrumb div | `.ac-breadcrumb` |
| Back link `<a>` | `.ac-breadcrumb-link` |

**Main grid (line 284):** `style={{ display, gridTemplateColumns, gap, alignItems }}` → `.ac-product-grid`

**Left column image card (lines 287–292):** → `.ac-product-image-card`

**Specs card (lines 296–336):**

| Element | Target class |
|---|---|
| Card container div | `.ac-specs-card` |
| Card title h4 | `.ac-specs-title` |
| Specs grid div | `.ac-specs-grid` |
| Each spec item div | `.ac-spec-item` |
| Spec label span | `.ac-spec-label` |
| Spec value span | `.ac-spec-value` |
| Appraisal value span | `.ac-spec-value--highlight` |

**Spec label emojis (lines 302, 307, 312, 317, 322, 327, 332):** Each emoji in a `<span>` — add `aria-hidden="true"` to the emoji portion.

**Description card (lines 339–346):** → `.ac-desc-card`, `.ac-desc-title`, `.ac-desc-body`

**Valuation card (lines 352–368):**

| Element | Target class |
|---|---|
| Card container | `.ac-valuation-card` |
| Title h1 | `.ac-valuation-title` |
| Dealer row | `.ac-valuation-dealer` |
| Price span | `.ac-valuation-price` |
| "Estimated Valuation" label | `.ac-valuation-label` |
| Location badge | `.ac-location-badge` |

**Acquisitions form (lines 371–448):**

| Element | Target class |
|---|---|
| Dark card container | `.ac-acquisition-card` |
| Form h4 | `.ac-acquisition-title` |
| Form description p | `.ac-acquisition-desc` |
| Form field wrapper div | `.ac-form-group` |
| Label (all 5) | `.ac-form-label` |
| Input/textarea (all 5) | `.ac-form-input` |
| Submit button | add width + padding to `.ac-btn-gold` CSS |
| Error p | `.ac-form-error` |

**Form labels: add `htmlFor` + `id` to all 5 form fields:**
- `client-name` (name)
- `client-email` (email)
- `offer-price` (offer)
- `client-phone` (phone)
- `client-notes` (notes textarea)

**Related section (lines 458–468):**

| Element | Target class |
|---|---|
| Section wrapper | `.ac-related-section` |
| Heading h3 | `.ac-related-title` |
| Card link `<a>` | `.ac-car-link` (add textDecoration, color, display) |

---

### 12. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Filter section** (`.ac-filter-section`): 4 dropdowns in a row — verify wrap to 2×2 or 1 column on mobile
- [ ] **Car grid** (`.ac-grid`): verify 1–2 columns on mobile
- [ ] **Auction grid** (`.ac-auction-grid`): verify 1 column on mobile
- [ ] **About grid** (`.ac-about-grid`): image + text — verify stacks on mobile
- [ ] **ProductPage main grid** (`.ac-product-grid`): 1.8fr + 1.2fr — verify stacks on mobile (sidebar moves below)
- [ ] **Specs grid**: `repeat(auto-fit, minmax(200px, 1fr))` — verify 1–2 columns on mobile
- [ ] **Financing calculator** (new): verify inputs/sliders are usable on touch

---

### 13. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using vehicle title and year
- [ ] `ExplorePage`: add descriptive title ("Browse Classic & Collector Cars")

---

## Completion Checklist Summary

```
NEW FEATURE
  [ ] FinancingCalculator: down payment slider, term select, rate slider, monthly output
  [ ] Insert in ProductPage between valuation card and acquisition form

DEAD CODE
  [ ] Remove unused FALLBACK_CARS from Page.tsx
  [ ] Remove unused FALLBACK_CARS from ProductPage.tsx

KEYFRAMES
  [ ] Move @keyframes spin → @keyframes acSpin in styles.css
  [ ] Remove <style jsx global> block from ProductPage loading state

AUCTIONS
  [ ] Wrap FALLBACK_AUCTIONS × 2 in useThemeContent / useThemeMedia

PAGE.TSX INLINE STYLES → CSS CLASSES
  [ ] Hero: eyebrow, description, CTA padding
  [ ] Filter: header row, h2, clear btn, all 4 filter labels
  [ ] Listings: header row, count span
  [ ] Empty state: container, icon, title, desc
  [ ] Car link: textDecoration/color/display
  [ ] LIVE badge
  [ ] About: section bg, img, copy col, title, paragraphs

SHIMMERCARD → CSS CLASSES
  [ ] All inline styles → .ac-shimmer-* CSS

AUCTIONCARD → CSS CLASSES
  [ ] All inline styles → .ac-auction-* CSS
  [ ] Bid CTA text → useThemeContent

CLASSICCARCARD → CSS CLASSES
  [ ] Cursor/transition, img height/fit, title, desc, CTA span
  [ ] "View Details" text → useThemeContent

CLASSICHEADER
  [ ] Logo spans → CSS classes

CLASSICFOOTER → CSS CLASSES
  [ ] Grid, logo, description, contact items, footer bottom
  [ ] Copyright year: dynamic fallback
  [ ] Contact title → useThemeContent

PRODUCTPAGE INLINE STYLES → CSS CLASSES (entire page)
  [ ] Loading state, not-found state
  [ ] Page wrapper, back link, main grid
  [ ] Image card, specs card + grid + items, desc card
  [ ] Valuation card: title, dealer, price, label, location badge
  [ ] Acquisition form: dark card, heading, desc, form groups + labels + inputs
  [ ] Submit button extra styles
  [ ] Related section: heading, card link

PRODUCTPAGE FORMS
  [ ] Add id + htmlFor to all 5 form label/input pairs

PRODUCTPAGE EMOJI ICONS
  [ ] Add aria-hidden="true" to spec label emojis

RESPONSIVE
  [ ] Filter section: 4 dropdowns → wrap on mobile
  [ ] Car grid: 1-2 col mobile
  [ ] Auction grid: 1 col mobile
  [ ] About grid: stack on mobile
  [ ] ProductPage: sidebar stacks below on mobile
  [ ] Specs grid: 1-2 col mobile
  [ ] Financing calculator: touch-friendly

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (title + year)
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Good useThemeContent; heavy inline styles; dead FALLBACK_CARS constant |
| `components/index.tsx` — ClassicHeader | Site nav | CMS nav ✓; aria-expanded ✓; logo inline spans |
| `components/index.tsx` — ClassicCarCard | Car card | Most styles inline |
| `components/index.tsx` — AuctionCard | Auction card | Entirely inline |
| `components/index.tsx` — ClassicFooter | Footer | FooterMenuColumn × 2 ✓; rest inline; copyright year |
| `ProductPage.tsx` | Vehicle detail + inquiry | Entirely inline; needs FinancingCalculator; form labels missing id/htmlFor |
| `ExplorePage.tsx` | Vehicle browse | Not audited |
| `InquiryConfirmationPage.tsx` | Post-inquiry | Not audited |
| `styles.css` | Styles | Will grow substantially after extraction |
