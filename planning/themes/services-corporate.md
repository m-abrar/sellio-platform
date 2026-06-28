# Theme Completion Plan: `services/corporate`

**Priority:** #28 (Phase 4) — B2B consulting/services; navy/white professional aesthetic
**Theme path:** `apps/storefront/src/themes/services/corporate/`
**Audit score:** 7/10 — Strong page structure with `DynamicTestimonials`, case studies section, about section, services grid; held back by `CorporateFooter` being entirely hardcoded and several data arrays not going through `useThemeContent`

---

## What's Already Done

- `CorporateHeader`: hamburger, `MenuNav`, `MenuActionButtons` (mobile + desktop)
- `CaseStudyCard`, `CorporateFooter`, `TestimonialCard` (unused — superseded by `DynamicTestimonials`)
- `ServiceCard` component (defined in components but unused — API-driven services use inline rendering in Page.tsx)
- `DynamicTestimonials` integration ✓
- Services API grid with skeletons + empty state + CSS classes ✓
- About section with `useThemeMedia` for image ✓
- `resolveServicesFailure` demo fallback ✓
- `CatalogSyncAlert` ✓
- `useThemeContent` for: hero title/desc/CTAs, services title/desc, about title/desc, case studies title/desc, CTA title/desc/button
- Anchor-based smooth scroll: "Get in Touch" → `#contact` CTA section ✓

---

## Gaps & Issues to Fix

### 1. Primary Missing Feature: Contact Form

The CTA section has `id="contact"` and both header and hero CTA buttons scroll to it, but it contains only a banner and a CTA button — no actual contact form. B2B clients expect a real inquiry form.

- [ ] Add `ContactForm` component (name, company, email, message, service interest select)
- [ ] Place within or below the `#contact` CTA section
- [ ] Client-side form (no backend required for theme demo — `onSubmit` shows a success message)
- [ ] `useThemeContent` keys for labels: `contact.form_name_label`, `contact.form_email_label`, `contact.form_company_label`, `contact.form_message_label`, `contact.form_submit_label`, `contact.success_message`
- [ ] CSS: `.sc-contact-form`, `.sc-form-group`, `.sc-form-label`, `.sc-form-input`, `.sc-form-textarea`, `.sc-form-select`, `.sc-form-submit`

---

### 2. `CorporateFooter` — Entirely Hardcoded

The footer component contains no `useThemeContent` calls. Every string — brand name, description, social icons, contact address, phone, email, copyright — is hardcoded directly:

```tsx
<h5 ...>Corporate Services</h5>
<p ...>Providing strategic consulting and innovative solutions...</p>
{['fb', 'tw', 'in', 'ig'].map((social) => ( <div ...>•</div> ))}  // dot placeholders!
// Contact Us column:
<p ...>123 Business Rd, City, State 12345</p>
<p ...>+1 (123) 456-7890</p>
<p ...>info@corporateservices.com</p>
// Footer bottom:
© 2026 Sellio. All rights reserved.
```

The social icons are literal `•` dot characters — these are **placeholder stub icons**.

- [ ] Add `useThemeContent` to `CorporateFooter` for: `footer.brand_label`, `footer.description`, `footer.contact_address`, `footer.contact_phone`, `footer.contact_email`, `footer.copyright`
- [ ] Replace social dot stubs with `MenuNav location="social_footer"` (same pattern as other themes):
  ```tsx
  <MenuNav
    location="social_footer"
    flat
    renderItem={(item, { href, onNavigate }) => (
      <a href={href} className="sc-social-link" onClick={onNavigate}>
        {item.title.charAt(0)}
      </a>
    )}
  />
  ```
- [ ] Move footer grid to `.sc-footer-grid` CSS class (currently `style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '4rem' }}`)
- [ ] Move all brand section element styles to CSS classes
- [ ] `FooterMenuColumn × 2`: both use `titleStyle` → use `titleClassName="sc-footer-col-title"` + CSS
- [ ] Footer bottom `style={{ borderTop, paddingTop, textAlign, color, fontSize }}` → `.sc-footer-bottom`
- [ ] Copyright: dynamic year `{footerCopyright || \`© ${new Date().getFullYear()} Sellio. All rights reserved.\`}`

---

### 3. `CorporateHeader` — Inline Styles + Missing `aria-expanded`

**Hamburger (lines 27–35):** Missing `aria-expanded`.
- [ ] Add `aria-expanded={isOpen}` to hamburger `<button>`

**Logo link (line 20):** `style={{ color: 'inherit', textDecoration: 'none' }}`
→ `.sc-logo a { color: inherit; text-decoration: none; }` CSS

**Logo second word (line 22):** `style={{ color: 'var(--sc-text-dim)' }}`
→ `.sc-logo-dim { color: var(--sc-text-dim); }` CSS class

---

### 4. Hardcoded Data Arrays → `useThemeContent`

**Case studies array (Page.tsx lines 43–47):**
```tsx
const caseStudies = [
  { title: 'GlobalTech Solutions', description: '...40%...', image: '/themes/services/corporate/12.webp' },
  { title: 'Innovate Pharmaceuticals', description: '...10% market share...', image: '/themes/services/corporate/13.webp' },
  { title: 'Future Retail Group', description: '...25% increase...', image: '/themes/services/corporate/14.webp' },
];
```
→ `useThemeContent`/`useThemeMedia` per case study:

| Key | Default |
|---|---|
| `case_studies.item_1_title` | `'GlobalTech Solutions'` |
| `case_studies.item_1_description` | `'Implemented a new operational strategy...'` |
| `case_studies.item_1_image` | `useThemeMedia('case_studies.item_1_image', '/themes/services/corporate/12.webp')` |
| ... × 3 | |

**"Why Partner" checklist (Page.tsx lines 176–185):**
```tsx
{[
  'Proven Track Record of Success',
  'Expert Team with Diverse Industry Experience',
  'Tailored Solutions for Unique Challenges',
  'Data-Driven Insights and Strategies',
  'Unwavering Commitment to Client Satisfaction',
].map((item) => (...))}
```
→ `useThemeContent('about.checklist', 'Proven Track Record of Success|Expert Team...|...').split('|')`

**`serviceIcons` constant (Page.tsx line 17):** `['01', '02', '03', '04', '05', '06']` — numeric placeholders used as service card icons.
- [ ] Replace with a set of meaningful icon characters or abbreviations styled via CSS (e.g., use the service index to select an icon class), OR use `useThemeContent` to let the admin set icon labels per service

**`DynamicTestimonials` title + subtitle (Page.tsx lines 206–208):**
```tsx
<DynamicTestimonials
  title="What Our Clients Say"
  subtitle="Hear from those who have experienced our impact firsthand."
  ...
```
→ `useThemeContent('testimonials.title', 'What Our Clients Say')` and `useThemeContent('testimonials.subtitle', 'Hear from those who have experienced our impact firsthand.')`

---

### 5. `Page.tsx` — Inline Styles

**Hero h1 (line 92):** `style={{ marginBottom: '1.5rem', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}` → add to `#sc-hero-section .sc-heading-xl` in CSS

**Hero description (line 100):** `style={{ fontSize, marginBottom, fontWeight, opacity, textShadow }}` → `.sc-hero-desc`

**Hero CTA row (line 103):** `style={{ display, gap, justifyContent, flexWrap }}` → `.sc-hero-cta-row`

**API service card title (line 151):** `style={{ fontFamily, fontWeight, color, marginBottom, fontSize }}` → `.sc-service-link-card h4` CSS

**API service card description (line 152):** `style={{ color, lineHeight, fontSize }}` → `.sc-service-link-card p` CSS

**API service card category (line 156):** `style={{ fontSize, color, marginTop }}` → `.sc-service-category-label`

**About section image wrapper (line 167):** `style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}` → `.sc-about-img-wrapper`

**About image (line 168):** `style={{ width, height, minHeight, objectFit, display, boxShadow }}` → `.sc-about-img`

**About title (line 171):** `style={{ fontSize, marginBottom }}` → `.sc-about-title`

**About description (line 172):** `style={{ fontSize, color, marginBottom, lineHeight }}` → `.sc-about-desc`

**About checklist wrapper (line 175):** `style={{ display, flexDirection, gap, fontSize, fontWeight, color }}` → `.sc-about-checklist`

**About checklist items (line 183):** `style={{ display, gap, alignItems }}` → `.sc-checklist-item`

**About checkmark span (line 184):** `style={{ color: 'var(--sc-accent)', fontWeight: 'bold' }}` → `.sc-checkmark { color: var(--sc-accent); font-weight: bold; }`

**Case study link (line 199):** `style={{ textDecoration, color }}` → `.sc-case-link { text-decoration: none; color: inherit; }`

**CTA section wrapper (line 219):** `style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}` → `.sc-cta-content`

**CTA title (line 220):** `style={{ fontSize, color, marginBottom }}` → `.sc-cta-title`

**CTA description (line 221):** `style={{ fontSize, marginBottom, opacity }}` → `.sc-cta-desc`

**CTA button (line 224):** `style={{ background, color, fontWeight, padding }}` → `.sc-btn--white`

---

### 6. Components — Inline Styles

**`CaseStudyCard` (components/index.tsx lines 74–83):**
- h5: `style={{ fontFamily, fontWeight, color, marginBottom, fontSize }}` → `.sc-case-card h5`
- p: `style={{ color, fontSize, marginBottom, lineHeight }}` → `.sc-case-card p`
- "Read More →" link: `style={{ color, textDecoration, fontWeight, fontSize }}` → `.sc-case-link`

**`ServiceCard`** (components/index.tsx — unused, but still in the component file):
- h4 and p both inline → same pattern as above

**`TestimonialCard`** (also unused — `DynamicTestimonials` renders its own cards):
- Can be deleted, or leave as dead code — low priority
- [ ] Optional: remove `TestimonialCard` if `DynamicTestimonials` fully replaces it

---

### 7. Responsive Review

- [ ] Services grid: 6 cards at 375px — verify wrapping
- [ ] Why Partner checklist: readable at 375px
- [ ] About section: 2-column grid at 768px → 1-column stack on mobile
- [ ] Case studies grid: 3 cards → 1 column on mobile
- [ ] Contact form: full-width on mobile

---

## Completion Checklist Summary

```
PRIMARY FEATURE
  [ ] ContactForm component
  [ ] Form in #contact section
  [ ] useThemeContent keys for all form labels
  [ ] CSS: sc-contact-form, sc-form-group, etc.

FOOTER (CRITICAL — entirely hardcoded)
  [ ] useThemeContent for brand, description, contact info, copyright
  [ ] MenuNav social_footer replacing • dot stubs
  [ ] Footer grid → .sc-footer-grid CSS
  [ ] Brand section elements → CSS classes
  [ ] FooterMenuColumn × 2: titleStyle → titleClassName + CSS
  [ ] Footer bottom → .sc-footer-bottom CSS
  [ ] Dynamic copyright year

HEADER
  [ ] aria-expanded on hamburger
  [ ] Logo link inline → CSS
  [ ] Logo dim word inline → CSS

HARDCODED DATA → useThemeContent
  [ ] Case studies × 3: title, description, image
  [ ] Why Partner checklist × 5 → pipe-split
  [ ] serviceIcons → meaningful icons or CSS
  [ ] DynamicTestimonials title + subtitle

PAGE.TSX — INLINE STYLES → CSS
  [ ] Hero h1 textShadow + marginBottom → CSS
  [ ] Hero desc → .sc-hero-desc
  [ ] Hero CTA row → .sc-hero-cta-row
  [ ] API service card title + desc + category → CSS
  [ ] About image wrapper → .sc-about-img-wrapper
  [ ] About image → .sc-about-img
  [ ] About title, desc → CSS
  [ ] About checklist + items + checkmark → CSS
  [ ] Case link → .sc-case-link CSS
  [ ] CTA wrapper, title, desc, button → CSS

COMPONENTS — INLINE STYLES → CSS
  [ ] CaseStudyCard h5, p, link → CSS
  [ ] Optional: delete unused TestimonialCard

RESPONSIVE
  [ ] Services grid, about section, case studies → mobile check
  [ ] Contact form full-width
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Good `useThemeContent`; case studies + checklist hardcoded; heavy inline styles |
| `components/index.tsx` — CorporateHeader | Nav | Missing `aria-expanded`; logo inline |
| `components/index.tsx` — CaseStudyCard | Case study | Inline styles |
| `components/index.tsx` — TestimonialCard | Testimonial | Unused (DynamicTestimonials handles it); inline styles |
| `components/index.tsx` — CorporateFooter | Footer | Entirely hardcoded; social stubs; no `useThemeContent` |
| `ProductPage.tsx` | Service detail | Not audited |
