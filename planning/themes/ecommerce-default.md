# Theme Completion Plan: `ecommerce/default`

**Priority:** #15 — Foundation ecommerce; full commerce flow (cart/checkout/product detail) already wired
**Theme path:** `apps/storefront/src/themes/ecommerce/default/`
**Audit score:** 7.5/10 — commerce flow complete; primary gaps are missing review/wishlist features, hardcoded footer, and string flexibility

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, CartPage, CheckoutPage, CheckoutConfirmationPage, CheckoutConfirmPage, Layout
- Components: ShopHeader (CMS MenuNav + MenuUtilityNav; hamburger implemented), EcommerceProductCard, CategoryRibbon, TransactionFooter (CMS social via MenuNav)
- `useThemeContent` throughout Page.tsx: hero, feature card, collection section, newsletter
- Live API via `fetchProductsCatalog` + demo fallback via `resolveProductsFailure`
- ProductPage: gallery with thumbnail switching, tab navigation (description/reviews/shipping), add-to-cart, cart notice, assurance section, skeleton loading
- `CatalogSyncAlert` for API errors

---

## Gaps & Issues to Fix

### 1. Missing Feature: Review/Rating Display

The ProductPage has a "Reviews" tab but shows placeholder text ("Reviews are ready for integration..."). This should show actual review content driven by `useThemeContent`.

```tsx
{activeTab === 'reviews' && (
  <>
    <h2>{reviewsTitle}</h2>
    <div className="ed-reviews-summary">
      <span className="ed-rating-stars" aria-label={ratingAriaLabel}>{'★'.repeat(Math.floor(Number(ratingScore)))}</span>
      <span className="ed-rating-count">{ratingCount}</span>
    </div>
    <div className="ed-review-list">
      {[1, 2, 3].map(i => {
        const author = useThemeContent(`reviews.review_${i}_author`, '');
        const text = useThemeContent(`reviews.review_${i}_text`, '');
        const stars = useThemeContent(`reviews.review_${i}_stars`, '5');
        if (!author && !text) return null;
        return (
          <div key={i} className="ed-review-card">
            <div className="ed-review-header">
              <strong className="ed-review-author">{author}</strong>
              <span className="ed-review-stars" aria-label={`${stars} out of 5 stars`}>
                {'★'.repeat(Number(stars))}
              </span>
            </div>
            <p className="ed-review-text">{text}</p>
          </div>
        );
      })}
    </div>
  </>
)}
```

- [ ] Add `useThemeContent` keys: `reviews.title`, `reviews.rating_score`, `reviews.rating_count` and 3× `reviews.review_N_author/text/stars`
- [ ] Add default content for 3 mock reviews
- [ ] Add `.ed-reviews-summary`, `.ed-rating-stars`, `.ed-rating-count`, `.ed-review-list`, `.ed-review-card`, `.ed-review-header`, `.ed-review-author`, `.ed-review-stars`, `.ed-review-text` to `styles.css`

---

### 2. Missing Feature: Wishlist Button

A save/wishlist toggle on product cards and ProductPage detail — a key differentiator for an ecommerce theme.

**On `EcommerceProductCard`** (inside `.ed-img-frame`):

```tsx
<button
  type="button"
  className={`ed-wishlist-btn${isWishlisted ? ' ed-wishlist-btn--active' : ''}`}
  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
  onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
>
  <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
</button>
```

**On `ProductPage`** (below the add-to-cart button):

```tsx
<button
  type="button"
  className={`ed-btn-secondary ed-wishlist-page-btn${isWishlisted ? ' ed-wishlist-page-btn--active' : ''}`}
  onClick={handleWishlistToggle}
  aria-pressed={isWishlisted}
>
  {isWishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
</button>
```

- [ ] Create `useWishlist(productId)` hook in `ecommerce/shared/useWishlist.ts` — localStorage key `ed_wishlist`, returns `[isWishlisted, toggleWishlist]`
- [ ] Add wishlist toggle button to `EcommerceProductCard` (positioned top-right of image frame)
- [ ] Add wishlist button to `ProductPage` below the "Add to cart" button
- [ ] Add `.ed-wishlist-btn`, `.ed-wishlist-btn--active`, `.ed-wishlist-page-btn`, `.ed-wishlist-page-btn--active` to `styles.css`

---

### 3. `TransactionFooter` — Hardcoded `footerGroups` Array

`components/index.tsx` lines 17–42: Static 3-group footer nav (Shop, Customer Care, Storefront) with hardcoded links.

- [ ] Remove the `footerGroups` constant and its render block
- [ ] Replace with `FooterMenuColumn` × 3 using `footer_column_1/2/3` menu locations
- [ ] Import `FooterMenuColumn` from `@/components/menu/FooterMenuColumn`
- [ ] Add `titleClassName="ed-footer-col-title"` (or `titleStyle` temporarily until CSS is added)

---

### 4. `TransactionFooter` — Copyright Year + Encoding Bug

Line 185–190:

```ts
const copyright = useThemeContent('footer.copyright', '© 2026 Sellio Shop. All rights reserved.');
const footerCopyright = copyright.replace(/Â?©/g, '(c)');
```

Two issues: (1) hardcoded year in default; (2) the `.replace()` turns `©` into `(c)` — a bug from double-encoding during a past copy-paste.

- [ ] Change the `useThemeContent` default to `''`
- [ ] Remove the `.replace()` call entirely
- [ ] Render: `{copyright || \`© ${new Date().getFullYear()} Sellio Shop. All rights reserved.\`}`

---

### 5. `ShopHeader` — Missing `aria-expanded` + Logo Inline Style

**`aria-expanded` (line 60–70):**

```tsx
<button className={`ed-hamburger ...`} onClick={...} aria-label="Toggle navigation">
```

- [ ] Add `aria-expanded={isOpen}`

**Logo brand highlight (line 57):**

```tsx
<span style={{ color: 'var(--ed-blue)' }}>{brandHighlight}</span>
```

- [ ] Create `.ed-logo-highlight { color: var(--ed-blue); }` in `styles.css`; replace inline style with `className="ed-logo-highlight"`

---

### 6. `Page.tsx` — Hardcoded Category Ribbon Labels

Lines 179–183:

```tsx
<CategoryRibbon label="New Arrivals" count="Latest drops" href={themeLink('/explore')} />
<CategoryRibbon label="Essentials" count="Everyday edit" href={themeLink('/explore')} />
<CategoryRibbon label="Outerwear" count="Layering pieces" href={themeLink('/explore')} />
<CategoryRibbon label="Accessories" count="Finishing touches" href={themeLink('/explore')} />
```

- [ ] Wrap each label and subtext in `useThemeContent`:
  - `category.1.label` / `category.1.subtext`, and × 4
- [ ] Use current values as defaults

---

### 7. `Page.tsx` — Hardcoded `shopAdvantages` Array

Lines 12–28: 3 advantage cards with title and detail text are hardcoded.

- [ ] Wrap titles and details in `useThemeContent`:
  - `advantage.1.title` / `advantage.1.detail` × 3 items

---

### 8. `Page.tsx` — Other Hardcoded Strings

| String | Suggested key |
|---|---|
| `'View cart'` (hero secondary CTA, line 134) | `hero.secondary_cta_label` |
| `'Ready for product detail, cart, and checkout.'` (feature card, line 159) | `hero.feature_description` |

---

### 9. `Page.tsx` — Newsletter Form Non-Functional

Lines 270–275:

```tsx
<div className="ed-newsletter-form">
  <input type="email" placeholder={newsletterPlaceholder} />
  <button type="button" className="ed-btn-primary">{newsletterButton}</button>
</div>
```

Problems: no `<form>` wrapper, no `aria-label` on input, button type is "button" not "submit", no success state.

- [ ] Wrap in `<form onSubmit={handleSubscribe}>` with `[email, setEmail]` and `[subscribed, setSubscribed]` state
- [ ] Add `aria-label="Email address"` (or `id` + `<label>`) to the input
- [ ] Change button to `type="submit"`
- [ ] On success: show `<p role="status">You're in! Check your inbox for confirmation.</p>`

---

### 10. `ProductPage.tsx` — Hardcoded Strings

Many strings are hardcoded in `ProductPage.tsx` — they should be configurable:

| String | Suggested key |
|---|---|
| `'Back to shop'` (line 152) | `product.back_label` |
| `'Product unavailable'` (line 133) | `product.error_kicker` |
| `'Product could not be loaded.'` (line 136) | `product.error_title` |
| Spec labels: `'Availability'`, `'Delivery'`, `'Returns'` (lines 202–212) | `product.spec_availability`, `product.spec_delivery`, `product.spec_returns` |
| Spec values: `'Ready to ship'`, `'2-5 business days'`, `'30-day returns'` | Same keys with `_value` suffix |
| Assurance: `'Secure checkout'`, `'Live catalog'` + descriptions (lines 225–233) | `product.assurance_1_title/desc`, `product.assurance_2_title/desc` |
| Tab labels: `'Description'`, `'Reviews'`, `'Shipping'` (lines 250–251) | `product.tab_description`, `product.tab_reviews`, `product.tab_shipping` |
| `'Product details'` (tab panel heading) | `product.tab_description_heading` |
| `'Customer reviews'` | `product.tab_reviews_heading` |
| `'Shipping and returns'` | `product.tab_shipping_heading` |
| Tab panel body text for shipping | `product.shipping_description` |

- [ ] Add `useThemeContent` calls for each key at the top of `ProductPage`
- [ ] Inline style on error state div (line 133): `style={{ marginBottom: '1rem' }}` → add `margin-bottom: 1rem` to `.ed-state-kicker` in `styles.css`

---

### 11. Remove `PremiumProductCard` (Unused)

`components/index.tsx` lines 137–160: `PremiumProductCard` is defined but not used in any page file.

- [ ] Verify it's not imported anywhere (`Grep 'PremiumProductCard'`)
- [ ] If confirmed unused, remove the component

---

### 12. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Hero section**: two-column (text + image) — verify stacks correctly on mobile (image below text)
- [ ] **Category ribbon strip** (`.ed-category-strip`): 4 ribbons in a row — verify horizontal scroll or flex-wrap on mobile; if wrapped, verify 2×2 layout
- [ ] **Product grid** (`.ed-product-grid`): verify 1–2 columns on mobile
- [ ] **ProductPage detail grid** (`.ed-detail-grid`): gallery + details side by side → stacked on mobile
- [ ] **ProductPage thumbnail gallery** (`.ed-detail-gallery`): horizontal scroll strip — verify adequate touch target sizes
- [ ] **Newsletter form**: input + button side by side → stacked on mobile
- [ ] **Footer grid** (`.ed-footer-grid`): after switching to `FooterMenuColumn`, verify responsive column layout

---

### 13. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using product title and price
- [ ] `ExplorePage`: add descriptive title ("Shop All Products")

---

## Completion Checklist Summary

```
NEW FEATURES
  [ ] Review/rating display: 3× useThemeContent reviews in Reviews tab
  [ ] Wishlist toggle: useWishlist hook, button on EcommerceProductCard + ProductPage

FOOTER
  [ ] Replace hardcoded footerGroups → FooterMenuColumn × 3
  [ ] Fix copyright: remove .replace() bug; use dynamic year fallback

HEADER
  [ ] Add aria-expanded={isOpen} to hamburger button
  [ ] Logo highlight span: inline style → .ed-logo-highlight CSS class

PAGE.TSX STRINGS → useThemeContent
  [ ] Category ribbon labels × 4 (label + subtext)
  [ ] Shop advantages title + detail × 3
  [ ] Hero secondary CTA label
  [ ] Hero feature card description

NEWSLETTER FORM
  [ ] Wrap in <form> with onSubmit
  [ ] Add aria-label to email input
  [ ] Change button type to submit
  [ ] Add success state

PRODUCTPAGE STRINGS → useThemeContent
  [ ] Back label, error kicker + title
  [ ] Spec labels + values × 3
  [ ] Assurance titles + descriptions × 2
  [ ] Tab labels × 3
  [ ] Tab panel headings × 3
  [ ] Shipping body text

PRODUCTPAGE INLINE STYLE
  [ ] Error state mono div: marginBottom → CSS class

CLEANUP
  [ ] Remove unused PremiumProductCard component (verify first)

RESPONSIVE
  [ ] Hero: stack on mobile
  [ ] Category ribbon: mobile wrap/scroll
  [ ] Product grid: 1-2 col mobile
  [ ] ProductPage: gallery + details stack
  [ ] Newsletter form: stack on mobile
  [ ] Footer grid: column layout after switch

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (title + price)
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Good useThemeContent; category ribbons + advantages hardcoded; newsletter form non-functional |
| `components/index.tsx` — ShopHeader | Site nav | CMS nav ✓; hamburger ✓; missing aria-expanded; logo highlight inline |
| `components/index.tsx` — EcommerceProductCard | Product card | Clean; needs wishlist toggle button |
| `components/index.tsx` — CategoryRibbon | Category link | Clean; labels hardcoded in Page.tsx |
| `components/index.tsx` — TransactionFooter | Footer | footerGroups hardcoded; copyright year + encoding bug; social CMS nav ✓ |
| `ProductPage.tsx` | Product detail | Good structure, tabs, gallery; all labels hardcoded; needs wishlist button |
| `ExplorePage.tsx` | Product browse | Not audited |
| `CartPage.tsx` | Cart | Delegates to shared |
| `CheckoutPage.tsx` | Checkout | Delegates to shared |
| `styles.css` | Styles | Will grow with review + wishlist + ribbon classes |
