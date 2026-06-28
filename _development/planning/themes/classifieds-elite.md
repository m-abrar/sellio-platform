# classifieds/elite — Completion Plan

**Theme identity:** SELLIO_ELITE — boutique luxury classifieds for serious collectors  
**Design system:** Bodoni Moda (display serif) + Plus Jakarta Sans (body sans) | Dark gold palette (`#050505` bg / `#d4af37` gold) | Glassmorphism header and modal  
**CSS prefix:** `elite-` (form error uses `ce-`, chat uses `sl-` — inconsistent; see Bug 12–13)  
**Wrapper class:** `classifieds-premium-wrapper`  
**Current score:** 8.5/10 — standout QuickView overlay, exceptional demo data, cohesive luxury identity; needs 15 bug fixes, 3 missing pages, and inquiry confirmation re-skin  
**Target:** Submission-ready 9.5/10

---

## Current State Audit

### Pages that exist
| Page | File | Status |
|------|------|--------|
| Homepage / Catalog | `Page.tsx` | Complete — hero, category pills, spotlight carousel, grid with QuickView overlay |
| Listing detail | `ProductPage.tsx` | Complete — image, specs, seller card, inquiry form, related listings, live chat widget |
| Inquiry confirmation | `InquiryConfirmationPage.tsx` → shared | Wired but uses WRONG theme's styles (see Bug 14) |
| About | — | **Missing** |
| Contact | — | **Missing** |
| FAQ | — | **Missing** |

### No ExplorePage — by design
The homepage doubles as the catalog with client-side category + search filtering. This is correct for a curated luxury theme — a broad explore page would undermine the boutique, curation-first positioning. The `/explore` URL does not need to exist.

### Components that exist
| Component | Notes |
|-----------|-------|
| `EliteHeader` | Sticky frosted-glass header, `SELLIO_ELITE` logo in Bodoni Moda, flat MenuNav + MenuActionButtons |
| `DiamondFooter` | Full-black footer, logo, tagline, 3 FooterMenuColumn instances, copyright, "🔒 Secure & Verified" |
| `PremiumCard` | Card with hover overlay (quick view + favorite + share), staggered button animation, Bodoni Moda title |
| `PremiumHeader` | **Dead code** — legacy component with `onPostClick` prop, not used in Layout |
| `PremiumFooter` | **Dead code** — legacy duplicate of DiamondFooter |
| `CuratedListingCard` | **Explicitly `() => null`** — obsolete placeholder |

### What's architecturally excellent (do not change)
- Dark/gold palette is fully consistent across hero, categories, spotlight, cards, modal, product page, footer
- QuickView glassmorphism overlay with `eliteScaleUp` spring animation (scale 0.9 → 1 with 1.56 bounce) — standout feature
- PremiumCard 3-button overlay with staggered `transition-delay` (0.05s/0.1s/0.15s) — best hover micro-interaction in the codebase
- Spotlight carousel: next/prev navigation, featured-item priority, gradient overlay with location meta — polished
- `fetchClassifiedsHome` / `resolveClassifiedsFailure` resilience pattern — consistent with other themes
- Fallback data in `fallback-elite.ts` — 6 genuinely world-class luxury assets (1963 Ferrari 250 GTO at $72M, Monet at $54M, Macallan 1926 at $1.9M, Patek Philippe Tourbillon at $3.2M, Pink Star Diamond at $71.2M, Koenigsegg Jesko Absolut at $3.4M)
- Inquiry form labels are luxury-domain — "Encrypted Terminal Email", "Proposed Acquisition Capital Offer" — memorable differentiation
- `elite-shimmer` keyframe defined for skeleton loading — good infrastructure (see Bug 6 for usage issue)

---

## Bugs to Fix (15 items)

### Bug 1: `elite-product-wrapper` references undefined CSS variables

In `styles.css` lines 733–735:
```css
.elite-product-wrapper {
    background-color: var(--prem-bg-main);  /* ← UNDEFINED — falls back to white */
    font-family: var(--prem-font);          /* ← UNDEFINED — falls back to system font */
```
And `elite-booking-input` also references `var(--prem-font)`.

Only `--prem-bg` and `--prem-sans` are defined. Fix:
```css
.elite-product-wrapper {
    background-color: var(--prem-bg);
    font-family: var(--prem-sans);
```
```css
.elite-booking-input {
    font-family: var(--prem-sans);
```

### Bug 2: `--prem-shadow-sm` referenced but never defined

Referenced in 4 CSS rules:
```css
.elite-product-gallery      { box-shadow: var(--prem-shadow-sm); }
.elite-product-description-card { box-shadow: var(--prem-shadow-sm); }
.elite-product-seller-card  { box-shadow: var(--prem-shadow-sm); }
.elite-product-booking-drawer { box-shadow: var(--prem-shadow-sm); }
```
All fall back to `none`. Add to `:root`:
```css
--prem-shadow-sm: 0 4px 20px rgba(0, 0, 0, 0.6);
```

### Bug 3: QuickView "Submit Inquiry" button opens Admin URL

In `Page.tsx` line 406–410:
```tsx
<button 
  className="elite-modal-cta"
  onClick={() => window.open(adminCreateClassifiedUrl, '_blank', 'noopener,noreferrer')}
>
  {inquiryButton}   {/* label: "Submit Inquiry" */}
```
This button says "Submit Inquiry" but opens `/admin/classifieds/create` (the Admin panel). It should navigate to the listing's detail page where the actual inquiry form lives.

**Fix:**
```tsx
<button
  className="elite-modal-cta"
  onClick={() => {
    setQuickViewAsset(null);
    window.location.href = themeLink(`/product/${quickViewAsset.slug}`);
  }}
>
  {prospectusButton}   {/* label: "View Listing Details" */}
```
Use `prospectusButton` for QuickView (it already says "View Listing Details"), and rename `inquiryButton` usage to the detail page's "Submit Member Prospectus Request." The two labels were swapped.

### Bug 4: Skeleton loading uses inline `pulse` animation, not `elite-shimmer`

All skeleton elements use:
```tsx
<div className="elite-card" style={{ animation: 'pulse 1.5s infinite' }}>
```
But `pulse` is defined inside a `<style jsx global>` block (JSX inline), while `elite-shimmer` is the proper CSS keyframe already in `styles.css`. The `elite-shimmer` class is defined but never applied.

**Fix:** Replace all skeleton loading elements:
- `style={{ animation: 'pulse 1.5s infinite' }}` → `className="elite-shimmer"` on image wrappers
- Add background-color to the shimmer class for dark theme:
```css
.elite-shimmer {
    background: linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%);
    background-size: 200% 100%;
    animation: elite-shimmer 1.6s ease-in-out infinite;
}
```
Remove the `<style jsx global>` block from `Page.tsx` and `ProductPage.tsx` entirely.

### Bug 5: Spotlight arrow buttons use `<` / `>` text

```tsx
<button className="spotlight-arrow" onClick={handlePrevSpotlight}>&lt;</button>
<button className="spotlight-arrow" onClick={handleNextSpotlight}>&gt;</button>
```
ASCII `<` and `>` are typographically wrong for a luxury theme. Replace with `←` / `→` or inline SVG chevrons:
```tsx
<button className="spotlight-arrow" onClick={handlePrevSpotlight} title="Previous">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
</button>
```

### Bug 6: Emojis used for icons throughout — wrong for a luxury dark theme

Multiple instances:
- `📍` in spotlight location overlay and product badge
- `🛡️` in spotlight category label and product meta header
- `🔗` on share action button in PremiumCard
- `👁️` on quick view action button in PremiumCard
- `♡` / `❤️` on favorite button (acceptable exception — hearts are conventional)
- `🏺` in related listings section title
- `💼`, `✉️`, `🖥️` in QuickView modal sharing icons
- `🔒` in footer copyright line

Replace all except `♡` / `❤️` with inline SVG icons. The luxury aesthetic requires consistent, scalable iconography — not platform-dependent emoji rendering.

**Quick implementation:** Use simple SVG paths for eye, shield, link/chain, pin, and briefcase. Keep them in a local `icons.tsx` or inline in the component.

### Bug 7: QuickView sharing icons are deceptive

All three sharing "action" buttons in the QuickView modal call `navigator.clipboard.writeText()`:
```tsx
<button onClick={() => handleShareClick(title, 'Encrypted Mail')}>✉️</button>
<button onClick={() => handleShareClick(title, 'Wholesale Brokerage')}>💼</button>
<button onClick={() => handleShareClick(title, 'Share')}>🖥️</button>
```
`handleShareClick` just copies the title to clipboard, but the tooltip says "Send Encrypted Prospectus" and "Broker Invitation." These are misleading.

**Fix:** Simplify to one or two clear actions:
1. **Copy link** — calls `navigator.clipboard.writeText(window.location.origin + themeLink('/product/' + quickViewAsset.slug))` — gives the actual listing URL
2. **Share** (optional) — calls `navigator.share()` if available, falls back to clipboard

Remove the "Encrypted Mail" and "Wholesale Brokerage" misleading labels.

### Bug 8: Seller card hardcodes "Global Advisory Vaults"

```tsx
<div className="elite-product-seller-avatar">GA</div>
<h5 className="elite-product-seller-name">Global Advisory Vaults</h5>
<span className="elite-product-seller-badge">🔒 Vetted Advisory Custodian &bull; {getAssetLocation(item)}</span>
```
The seller is always "Global Advisory Vaults" regardless of who listed the item.

**Fix:** Use `item.contact?.name` or `item.contact?.company` if available:
```tsx
const sellerName = item.contact?.company || item.contact?.name || 'Global Advisory Vaults';
const sellerInitials = sellerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

<div className="elite-product-seller-avatar">{sellerInitials}</div>
<h5 className="elite-product-seller-name">{sellerName}</h5>
```

### Bug 9: `ce-form-error` class is missing from `styles.css`

```tsx
{formError && <div className="ce-form-error">{formError}</div>}
```
The class `ce-form-error` is used in the inquiry form but not defined in `styles.css`. The error message renders as unstyled text.

**Fix:** Add to `styles.css`:
```css
.ce-form-error {
    background-color: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.35);
    border-radius: 6px;
    color: #f87171;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    padding: 0.75rem 1rem;
}
```

### Bug 10: `sl-chat-section` and `sl-chat-section-label` CSS classes likely undefined

```tsx
<div className="sl-chat-section">
  <p className="sl-chat-section-label">Have questions?</p>
  <LiveChatWidget ... />
</div>
```
The `sl-` prefix is used nowhere else in the elite theme's CSS. These classes either come from a global stylesheet or are unstyled.

**Fix:** Rename to `elite-` prefix and add minimal CSS:
```tsx
<div className="elite-chat-section">
  <p className="elite-chat-section-label">Have questions?</p>
  <LiveChatWidget ... />
</div>
```
```css
.elite-chat-section { margin-top: 0.5rem; }
.elite-chat-section-label {
    color: var(--prem-muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
}
```

### Bug 11: Inquiry confirmation page uses `classifieds/local` theme components

`InquiryConfirmationPage.tsx` → `ClassifiedInquiryConfirmationPage` uses:
```tsx
<div className="classifieds-local-wrapper">
  <LocalHeader locationName="Inquiry sent" ... />
  // ... uses `cl-inquiry-*` CSS classes
  <LocalFooter />
</div>
```
The shared confirmation page hardcodes `classifieds/local` header/footer and CSS (`cl-inquiry-*`). After submitting an inquiry from the dark gold luxury elite theme, the buyer lands on a **light-colored, neighbourhood-classifieds-style** confirmation page — completely out of brand.

**Fix:** Create `EliteInquiryConfirmationPage.tsx` that wraps the confirmation data in elite styles. Do NOT use the shared component — copy the essential logic (fetch inquiry, show snapshot) and render inside the elite wrapper:

```tsx
return (
  <div className="classifieds-premium-wrapper">
    {/* EliteHeader is already in Layout.tsx — this page is inside Layout */}
    <div className="elite-product-container" style={{ maxWidth: 700 }}>
      <div className="elite-inquiry-confirm-box">
        {/* Success icon in gold, reference number, summary table, CTAs */}
      </div>
    </div>
  </div>
);
```
Since `InquiryConfirmationPage` is rendered inside `Layout.tsx`, the `EliteHeader` and `DiamondFooter` are already wrapping it — only the inner page content needs to use elite styles. The fix is to not use the shared component's outer wrapper at all.

### Bug 12: `DiamondFooter` copyright hardcodes `2026 Sellio`

```tsx
<span>© 2026 Sellio. All rights reserved.</span>
```
Should use `useThemeContent` for the site name, and `new Date().getFullYear()` for the year:
```tsx
const currentYear = new Date().getFullYear();
<span>© {currentYear} {siteName}. All rights reserved.</span>
```

### Bug 13: `PremiumHeader` and `PremiumFooter` dead code should be removed

`luxury-components.tsx` exports:
- `PremiumHeader` — takes `onPostClick` prop; not used anywhere; the real header is `EliteHeader`
- `PremiumFooter` — not used anywhere; the real footer is `DiamondFooter`
- `CuratedListingCard` — explicitly `() => null`

These three should be deleted from `luxury-components.tsx` to reduce confusion and bundle size. The `components/index.ts` re-exports everything from `luxury-components.tsx`, so removing these dead exports cleans the public component surface.

### Bug 14: Related listings title uses `🏺` emoji and all-caps

```tsx
<h3 className="elite-related-title">🏺 Other High-Value Vaults</h3>
```
Two issues:
1. `🏺` (amphora emoji) is inconsistent with the luxury aesthetic
2. The `elite-related-title` CSS includes `text-transform: uppercase` and `letter-spacing: 2px` — combined with "Other High-Value Vaults" it reads oddly

Fix: `"Other Curated Acquisitions"` without the emoji. Or use a `—` divider:
```tsx
<h3 className="elite-related-title">Other Curated Acquisitions</h3>
```

### Bug 15: Grid stagger animations conflict with loading skeleton animation

The CSS has:
```css
.elite-grid > *:nth-child(1) { animation: elite-scale-in 300ms 30ms ease-out both; }
/* ... through :nth-child(8) */
```
These apply to ALL children of `.elite-grid`, including loading skeleton cards. During loading, skeletons play `elite-scale-in` (correct) then when `elite-shimmer` is added — there will be two animations fighting. The loading skeletons should have a different class wrapping them so grid stagger only applies to real cards.

Fix: Wrap skeleton cards in `.elite-grid--loading` variant:
```css
.elite-grid:not(.elite-grid--loading) > *:nth-child(1) { animation: elite-scale-in 300ms 30ms ease-out both; }
```

---

## Missing Pages to Build

### Page 1: About (`AboutPage.tsx`)

**URL:** `/about`

#### 1.1 Hero
- Dark background (matches elite-hero), centered
- Gold kicker: `"ABOUT THE VAULT"` in uppercase + letter-spacing
- H1 in Bodoni Moda: `"Where the world's rarest acquisitions find a home."`
- Lead in Plus Jakarta Sans muted: 2 sentences on the boutique mission
- No CTA buttons needed — the about page sets tone, not conversion

#### 1.2 Trust pillars — 4-item horizontal grid
Reuse `.elite-stat-item` style with additional copy:
1. **Verified Custodians** — Every seller is identity-verified and appraisal-credentialed before listing
2. **Museum-Grade Authentication** — Assets carry independent certification from recognized appraisal authorities
3. **Private Registry** — All transactions are handled through encrypted private correspondence
4. **Global Advisory Network** — Vault partners in Geneva, London, Tokyo, New York, and Dubai

CSS: `.elite-about-pillars` — 4-col grid on desktop, 2-col tablet, 1-col mobile

#### 1.3 Categories showcase — 4 cards
One card per core category (Motors, Fine Art, Rare Vintages, Horology):
- Dark card background `#121212`, gold border on hover
- Small category label (gold, uppercase, tracking)
- Title with a specific exemplar from fallback data ("Exotic Motors · Ferrari 250 GTO")
- One-line descriptor

#### 1.4 Process — 3 dark steps
Vertical numbered list:
1. **Authentication** — Sellers provide provenance documents, appraisal certificates, and ownership records
2. **Listing** — Assets are vetted by our advisory team and listed in the private registry
3. **Acquisition** — Buyers submit a prospectus memorandum; the seller reviews and initiates encrypted correspondence

CSS: `.elite-about-steps` — numbered circles in gold (`#d4af37`), connected by a thin gold line on desktop

#### 1.5 Final CTA
Gold separator line, centered:
`"Ready to acquire?"` + `elite-modal-cta` button → `/` (back to catalog)

---

### Page 2: Contact (`ContactPage.tsx`)

**URL:** `/contact`

#### 2.1 Hero
- Gold kicker: `"PRIVATE ENQUIRIES"`
- H1: `"Reach our advisory office."`
- Lead: "Our team responds within 24 business hours. All correspondence is handled discreetly."

#### 2.2 Two-column layout

**Left col — Contact form:**
Fields using `elite-booking-input` / `elite-booking-label` styling:
- **Name** — "Your name or entity"
- **Email** — "Correspondence terminal"
- **Enquiry type** `<select>`: Asset acquisition / Asset listing / Authentication request / Partnership / General
- **Message** `<textarea>` — "Describe your request in confidence..."
- Submit `elite-modal-cta` button: "SUBMIT ENQUIRY"

On submit → show inline confirmation (not a redirect):
```
[Gold checkmark]
ENQUIRY RECEIVED
Reference #{CE-XXXXXXXX}
We will contact you within 24 business hours.
```

**Right col — Contact information:**
Dark `#121212` card(s) with gold borders:
1. Private Office — Location: Geneva / London
2. Response time — Within 24 business hours
3. Discretion — All enquiries handled in strict confidence

CSS: `.elite-contact-layout` — 2-col on 1024px+, 1-col below

---

### Page 3: FAQ (`FaqPage.tsx`)

**URL:** `/faq`

#### 3.1 Hero
- Gold kicker: `"PRIVATE REGISTRY GUIDE"`
- H1: `"Common questions about the vault."`

#### 3.2 FAQ Accordion (new component: `EliteFaqAccordion`)

Use `<details>/<summary>` with gold arrow rotation animation:
```css
.elite-faq-summary::after {
  content: '+';
  color: var(--prem-accent);
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}
details[open] .elite-faq-summary::after {
  content: '−';
}
```

**Buying (7 questions):**
1. What types of assets are listed? → Exotic motors, fine art, rare spirits, luxury horology, gemstones, and select collectibles authenticated by expert appraisers.
2. How do I enquire about a specific acquisition? → Click "View Listing Details" on any asset, complete the prospectus memorandum form, and our advisory team facilitates the introduction.
3. What is a Vault ID? → Each listed asset receives a unique vault identifier (e.g., `VAULT_GENEVA_12`) linked to its authentication record and custodian registry.
4. Are prices negotiable? → Most listings accept a capital offer via the "Proposed Acquisition Capital" field in the prospectus form.
5. How is payment handled? → All financial arrangements are made privately between buyer and seller with advisory facilitation. We do not process payments directly.
6. Can I inspect an asset before acquiring? → Yes. Request a physical inspection through the prospectus form; availability depends on the custodian's vault location.
7. How do I know a listing is authentic? → Every listed asset carries a condition grade and certification label (e.g., "Classiche A+", "Certified Museum Grade") from the respective authority.

**Selling (5 questions):**
1. How do I list an asset? → Log in to the admin portal, select "Create Classified," and complete the asset registration form with authentication documentation.
2. What categories can I list in? → Exotic Motors, Fine Art, Rare Vintages, Luxury Horology, Gemstones & Jewellery, and select Collectibles.
3. Is there a listing fee? → Consult our advisory team via the contact form for the current commission structure.
4. How will buyers contact me? → Through a private prospectus memorandum. You receive the buyer's contact details and decide whether to initiate correspondence.
5. Can I mark an asset as featured? → Yes — featured status places your asset in the Curated Spotlight of the Week carousel at the top of the catalog.

CSS: `.elite-faq-section` — each category in a dark card, `elite-faq-summary` with border-bottom on open, `elite-faq-answer` fades in

#### 3.3 Bottom CTA
`"Still have questions?"` + `elite-modal-cta` → `/contact`

---

## Inquiry Confirmation Page — Full Restyle

The fix for Bug 11 requires building `EliteInquiryConfirmationPage.tsx` to replace the shared local-theme page.

This renders inside `Layout.tsx` (so EliteHeader + DiamondFooter are already present):

```tsx
// EliteInquiryConfirmationPage.tsx
return (
  <div className="elite-inquiry-page">
    <div className="elite-inquiry-box">
      
      {/* Gold success icon */}
      <div className="elite-inquiry-icon">
        <svg ...checkmark... />
      </div>

      <span className="elite-inquiry-kicker">PROSPECTUS DELIVERED</span>
      <h1 className="elite-inquiry-headline">Your acquisition enquiry has been received.</h1>
      <p className="elite-inquiry-lead">
        The custodian has been notified and will initiate correspondence within 24 business hours.
      </p>

      <div className="elite-inquiry-ref">
        Reference <strong>#{referenceId}</strong>
      </div>

      {/* Summary table in dark card */}
      <div className="elite-inquiry-summary">
        <div className="elite-inquiry-row">
          <span>Asset</span>
          <strong>{listingTitle}</strong>
        </div>
        {offerPrice && <div className="elite-inquiry-row">...</div>}
        ...
      </div>

      {/* CTAs */}
      <div className="elite-inquiry-cta-row">
        <a href={themeLink('/')} className="elite-modal-cta">Return to Catalog</a>
        {listingSlug && <a href={themeLink(`/product/${listingSlug}`)} className="elite-btn-ghost">Back to listing</a>}
      </div>
    </div>
  </div>
);
```

New CSS classes:
```css
.elite-inquiry-page { padding: 5rem 5%; min-height: 60vh; display: flex; align-items: center; justify-content: center; }
.elite-inquiry-box { max-width: 620px; width: 100%; background: #121212; border: 1px solid var(--prem-border); border-radius: 16px; padding: 3rem; text-align: center; }
.elite-inquiry-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(212,175,55,0.12); border: 1px solid var(--prem-accent); color: var(--prem-accent); display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; }
.elite-inquiry-kicker { font-size: 0.75rem; font-weight: 900; letter-spacing: 4px; color: var(--prem-accent); text-transform: uppercase; display: block; margin-bottom: 1rem; }
.elite-inquiry-headline { font-family: var(--prem-serif); font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem; }
.elite-inquiry-lead { color: var(--prem-muted); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.5rem; }
.elite-inquiry-ref { background: rgba(212,175,55,0.06); border: 1px dashed var(--prem-border); border-radius: 6px; padding: 0.75rem 1.5rem; margin-bottom: 2rem; font-size: 0.85rem; color: var(--prem-muted); }
.elite-inquiry-ref strong { color: var(--prem-accent); font-family: monospace; letter-spacing: 1px; }
.elite-inquiry-summary { text-align: left; background: #0d0d0d; border: 1px solid var(--prem-border); border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem; }
.elite-inquiry-row { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.03); padding: 0.75rem 0; font-size: 0.85rem; color: var(--prem-muted); }
.elite-inquiry-row strong { color: #ffffff; text-align: right; max-width: 60%; }
.elite-inquiry-cta-row { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.elite-btn-ghost { padding: 0.85rem 2rem; background: transparent; border: 1px solid var(--prem-border); color: var(--prem-muted); font-weight: 700; font-size: 0.8rem; letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none; border-radius: 4px; transition: var(--prem-transition); }
.elite-btn-ghost:hover { border-color: var(--prem-accent); color: var(--prem-accent); }
```

---

## Design System Verification

### Palette — confirmed and clean
| Token | Value | Usage |
|-------|-------|-------|
| `--prem-primary` | `#111111` | (unused — alias for card bg?) |
| `--prem-accent` | `#d4af37` | Gold — all highlights, active states, prices, kickers |
| `--prem-bg` | `#050505` | Page background |
| `--prem-card` | `#121212` | All card backgrounds |
| `--prem-text` | `#ffffff` | All body text |
| `--prem-muted` | `#8e8e93` | Secondary copy, labels, nav links |
| `--prem-serif` | `Bodoni Moda` | Titles, prices, spotlight name, product title |
| `--prem-sans` | `Plus Jakarta Sans` | Body, nav, labels, buttons |
| `--prem-border` | `rgba(212,175,55,0.12)` | All borders — consistently gold-tinted |
| `--prem-transition` | `all 0.45s cubic-bezier(0.25,1,0.5,1)` | All transitions — premium feel |

**No hardcoded colour leaks found** — the palette is remarkably consistent. Gold (`#d4af37`) appears nowhere as a hardcoded hex outside of `:root` (it appears in box-shadows but not in colour properties).

**One issue:** `--prem-primary: #111111` is defined but never used. Can stay — no harm.

### Typography
- **Bodoni Moda** (400/700/900 upright + 400 italic) via Google Fonts — used for hero title, spotlight title, card title, related section title, product title, price displays — **all correct**
- **Plus Jakarta Sans** (300/400/500/600/700/800) via Google Fonts — used for everything else — **all correct**
- Both fonts loaded in a single `@import url('https://fonts.googleapis.com/...')` — **good**

### Missing variable additions (for Bugs 1 and 2)
```css
:root {
    /* Add these */
    --prem-bg-main: var(--prem-bg);     /* alias for product wrapper (use --prem-bg) */
    --prem-font: var(--prem-sans);      /* alias for input font-family */
    --prem-shadow-sm: 0 4px 20px rgba(0, 0, 0, 0.6);
}
```
Or better: fix the property names directly in the affected rules (cleaner than adding alias variables).

---

## Responsive QA Checklist

Test at **375px**, **768px**, **1024px**, **1280px**.

### Homepage
| Breakpoint | What to check |
|------------|--------------|
| 375px | Hero: `clamp(3rem, 7vw, 5.75rem)` — verify min size is still impactful; search bar pill stays intact; category pills scroll horizontally |
| 768px | Spotlight carousel: 1-col (breakpoint at 992px max-width) — verify content col reads well single-stacked; grid: 2 col via `auto-fill minmax(320px, 1fr)` |
| 1024px | Navigation: no hamburger (EliteHeader has no mobile drawer — **critical gap**, see below) |
| 1280px | All sections full-width; spotlight carousel 2-col |

**Critical gap: No mobile hamburger in EliteHeader**

`EliteHeader.tsx` renders `MenuNav` and `MenuActionButtons` inline — no media query, no hamburger button, no drawer. At 375px, the header nav links will overflow or break layout.

**Fix:** Add hamburger button + slide-in drawer to `EliteHeader`:
```tsx
const [drawerOpen, setDrawerOpen] = useState(false);
// ...
<button className="elite-hamburger" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
  {/* 3-line SVG */}
</button>
<div className={`elite-mobile-drawer ${drawerOpen ? 'is-open' : ''}`}>
  <button className="elite-drawer-close" onClick={() => setDrawerOpen(false)}>×</button>
  <MenuNav location="main_header" flat className="elite-drawer-nav" linkClassName="elite-nav-link" renderItem={defaultNavItemRenderer} />
  <MenuActionButtons buttonClassName="elite-btn-login" as="button" onAction={() => { setDrawerOpen(false); }} />
</div>
```
```css
.elite-hamburger { display: none; }
@media (max-width: 1024px) {
  .elite-hamburger { display: flex; }
  .elite-nav-panel { display: none; }
  .elite-mobile-drawer { position: fixed; top: 0; right: -100%; width: 320px; height: 100vh; background: #0d0d0d; border-left: 1px solid var(--prem-border); z-index: 2000; transition: var(--prem-transition); padding: 3rem 2rem; }
  .elite-mobile-drawer.is-open { right: 0; }
}
```

### Product detail page
| Breakpoint | What to check |
|------------|--------------|
| 375px | `elite-product-main-grid` — 1-col at 992px (defined in CSS); specs grid (`elite-product-specs-grid`) is `repeat(2, 1fr)` — stays 2-col even at 375px where cells may be too narrow |
| 375px | Specs cells at 375px — each cell has `padding: 1rem 1.25rem` and font-size 0.7rem label + 1rem value; at half the container width (~160px) this may be tight — consider 1-col on 768px and below |

Add:
```css
@media (max-width: 768px) {
  .elite-product-specs-grid { grid-template-columns: 1fr; }
}
```

### QuickView modal
| Breakpoint | What to check |
|------------|--------------|
| 375px | `.elite-modal-box { max-width: 520px }` with `width: 90%` — OK; image height 240px — verify renders correctly |
| Mobile keyboard | When the form in modal overlay opens keyboard, ensure `overflow-y: auto` on modal box |

---

## Demo Content Assessment

### Fallback data quality: Exceptional
The 6 items in `fallback-elite.ts` are:
1. 1963 Ferrari 250 GTO — $72M — 3 `is_featured: true` items: items 1, 2, 4
2. Claude Monet Water Lilies — $54M — `is_featured: true`
3. Macallan 1926 Whisky — $1.9M — `is_featured: false` (spotlight won't include this unless items 1/2/4 fill 3 slots)
4. Patek Philippe Sky Moon — $3.2M — `is_featured: true`
5. Pink Star Diamond Ring — $71.2M — `is_featured: false` (taxonomy: `art` — not `jewelry` — consider taxonomy fix)
6. Koenigsegg Jesko Absolut — $3.4M — `is_featured: false`

Featured items (1, 2, 4) fill the spotlight carousel exactly (3 featured → 3 spotlight slots). ✓

**Gap 1:** Pink Star Diamond (`id: 5`) is categorized as `art` (`taxonomy.category: "art"`) but it's jewelry/gemstones. The `getAssetCategoryLabel` function maps `art` → "Fine Art Portfolio". A $71M diamond being categorized as "Fine Art Portfolio" is semantically wrong. Fix: add `jewelry` or `gemstones` category, or rename item 5's taxonomy to `jewelry`.

**Gap 2:** The `ELITE_DEMO_CATEGORIES` in `shared/fallback-data.ts` need to align with actual `taxonomy.category` values in `fallback-elite.ts`. Verify that `ELITE_DEMO_CATEGORIES` includes entries that match `motors`, `art`, `spirits`, `horology`.

**Gap 3:** Spotlight carousel title hardcodes `"CURATED SPOTLIGHT OF THE WEEK"` but uses `useThemeContent('spotlight.tag', ...)` — good, admin can override. Similarly all text is `useThemeContent`-backed. ✓

---

## CodeCanyon Submission Checklist

- [x] **Distinct palette**: Pitch-black / warm gold — cannot be confused with any other Sellio theme ✓
- [x] **Minimum 3 custom components**: `EliteHeader`, `DiamondFooter`, `PremiumCard`, QuickView modal, Spotlight carousel — far exceeded ✓
- [x] **Fallback data**: 6 world-class luxury assets with full pricing, media, taxonomy, status fields ✓
- [x] **No Lorem ipsum**: All copy is luxury-domain language ✓
- [x] **Consistent header/footer**: `EliteHeader` + `DiamondFooter` in `Layout.tsx` ✓
- [x] **Pages beyond homepage + detail**: `InquiryConfirmationPage` exists ✓
- [ ] **Responsive**: Missing mobile hamburger in `EliteHeader` — **critical** ❌
- [ ] **About / Contact / FAQ pages**: Missing ❌
- [ ] **Bug fixes (15 items)**: Several critical (undefined CSS vars, wrong admin URL in QuickView CTA, wrong theme on confirmation page) ❌
- [ ] **Inquiry confirmation restyle**: Uses `classifieds/local` theme — must replace ❌
- [ ] **Remove dead code**: `PremiumHeader`, `PremiumFooter`, `CuratedListingCard` ❌
- [ ] **Replace emojis with SVG icons**: All `📍`, `🛡️`, `🏺`, `💼`, `✉️`, `🖥️` ❌

---

## Priority Order

1. **Bug 3** (QuickView opens admin URL instead of listing) — User-facing breakage, visible in every demo
2. **Bug 11** (Inquiry confirmation shows wrong theme) — Breaks the complete flow demo
3. **Bug 1 + 2** (Undefined CSS variables on product page) — Visual breakage on the detail page
4. **Mobile hamburger** (EliteHeader has no mobile nav) — CodeCanyon reviewer will check at 375px
5. **Bug 4** (Skeleton uses wrong animation) + **Bug 15** (Grid stagger/shimmer conflict) — Polish
6. **Bug 5** (Arrow `<`/`>` → SVG chevrons) + **Bug 6** (Emojis → SVG icons) — Luxury brand coherence
7. **Bug 7** (Deceptive sharing icons) + **Bug 8** (Hardcoded seller name)
8. **Bug 9** + **Bug 10** (Missing CSS classes for form error + chat section)
9. **Bug 12** (Hardcoded year in footer) + **Bug 13** (Dead code removal) + **Bug 14** (Emoji in related title)
10. **About + Contact + FAQ pages** — Static pages required for submission
11. **Responsive QA** — Final sweep
12. **Demo content gap** (Pink Star taxonomy fix)

---

## Estimated Work

| Task | Effort |
|------|--------|
| Bug fixes 1–15 | 3.5 hours |
| Mobile hamburger + drawer | 1.5 hours |
| Inquiry confirmation restyle | 2 hours |
| About page | 2.5 hours |
| Contact page | 2 hours |
| FAQ page + accordion component | 2.5 hours |
| Emoji → SVG icon pass | 1 hour |
| Responsive QA | 1.5 hours |
| **Total** | **~17 hours** |

This theme has the best visual identity in Phase 1 — the gold/dark system is tight and the QuickView overlay is genuinely impressive. The 17-hour estimate is driven by the confirmation page restyle and the sheer number of small (but visible) bugs. Once fixed, this is an easy 9.5/10.
