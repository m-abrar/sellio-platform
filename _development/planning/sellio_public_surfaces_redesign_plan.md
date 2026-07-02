# Sellio Public Surfaces Redesign Plan

**Created:** 2026-07-02  
**Reference surface:** `introduction/listing-description/index.php` and its partials  
**Targets:** Product Tour, Introduction Page, Customer Documentation, API/Reviewer Documentation  
**Status:** In progress — shared public-content registry implemented and wired to the listing description and Product Tour

## Objective

Bring Sellio's public-facing materials into one recognizable product family without making every surface look or read the same.

The finished listing description becomes the source of truth for visual character, terminology, proof standards, and product positioning. The other surfaces should inherit its design language while adapting to different reader intent:

- **Listing description:** evaluate the product and decide whether it is relevant.
- **Product Tour:** follow a concise visual story from idea to launch.
- **Introduction Page:** scan, compare, explore demos, and convert.
- **Documentation:** complete a task accurately and recover when something goes wrong.

## Reference Design Language

### Visual principles

- Editorial layouts rather than generic SaaS dashboard cards.
- Warm light surfaces balanced by deep navy product sections.
- Sellio green as the primary action color.
- Blue, orange, and violet used as controlled secondary accents.
- Inter for body copy and Sora for high-impact display headings.
- Compact eyebrow labels that establish context before a headline.
- Strong section rhythm with alternating background treatments.
- Real Sellio screenshots before abstract marketing illustrations.
- Rounded but disciplined geometry; avoid excessive glassmorphism and glow.
- Spacious layouts with one dominant idea per composition.

### Content principles

- Lead with the seven real marketplace verticals.
- Use “buyer,” “seller,” and “administrator” consistently.
- Prefer plain English over invented enterprise terminology.
- Never publish unverified counts, speed scores, revenue, uptime, or launch-time guarantees.
- Describe configuration-dependent features as configurable, not universally active.
- Distinguish application source from hosted services and third-party accounts.
- Use actual stack versions from package manifests.
- Link claims to live demos, documentation, or real screenshots whenever practical.

### Shared reusable assets

- Sellio logo and brand lockup.
- Storefront preview library under `introduction/images`.
- Real admin, seller, buyer, and mobile screenshots to be captured.
- Shared vertical names and descriptions.
- Verified technology stack list.
- Verified payment-gateway list.
- Verified installation sequence.
- Common CTA labels and URL registry.

---

## 1. Product Tour (Formerly Flipbook)

### Reader intent

The visitor has chosen a guided experience. They are more patient than a landing-page scanner but less patient than a documentation reader. Each page turn must advance the story.

### Target experience

- Keep the tour between 12 and 15 pages.
- Give each page one primary message.
- Use the listing-description typography, color tokens, and editorial restraint.
- Preserve page-turn interaction, keyboard navigation, progress indicator, and edge controls.
- Use real product screens where the story refers to an implemented interface.
- Use diagrams only for concepts that screenshots cannot explain clearly.

### Proposed page flow

1. **Cover:** Sellio and the complete multi-purpose marketplace promise.
2. **Imagine:** Seven marketplace directions branching from one foundation.
3. **Discover:** Natural input → AI processing → website results.
4. **Connect:** Listing-aware buyer and seller conversation.
5. **Buyer journey:** Search → view → chat → buy/book/apply/inquire.
6. **Seller success:** Create listings, manage activity, track operations.
7. **Admin control:** Modules, users, moderation, payments, settings, and reports.
8. **Marketplace modules:** Products, properties, vehicles, events, jobs, services, classifieds.
9. **Automation:** Rules, notifications, expirations, and background tasks.
10. **Every screen:** Storefront, dashboards, and mobile customer experience.
11. **Built to own:** Source, deployment, data, and customization.
12. **Technology:** Verified backend, web, storefront, mobile, and realtime stack.
13. **Installation:** Requirements → environment → administrator → modules/data → finish.
14. **Proof:** Real screenshots, approved customer comments, and demo links only.
15. **Final action:** Explore demos, documentation, or the listing description.

### Design work

- Replace remaining old flipbook-era CSS naming with `product-tour-*` naming where practical.
- Introduce shared color and typography tokens matching the listing description.
- Create page templates for:
  - editorial statement;
  - real screenshot;
  - three-step process;
  - role workflow;
  - module map;
  - final CTA.
- Add a small chapter label and consistent “Explore in detail” link.
- Reduce visual density on mobile instead of merely shrinking desktop compositions.
- Add reduced-motion support for page turns and animated diagrams.

### Content and accuracy work

- Replace temporary Pexels images with real Sellio screenshots.
- Review the three customer quotations before publication.
- Remove any remaining generic or unsupported AI wording.
- Verify technology versions immediately before release.
- Ensure every deep link targets an existing introduction-page anchor.

### Acceptance criteria

- 12–15 pages with a coherent beginning, middle, and conclusion.
- No repeated pages that explain the same roles or benefits.
- No unsupported metric or customer-count claims.
- Every screenshot has meaningful alt text.
- All page turns, keyboard controls, progress state, and deep links work.
- Desktop, tablet, small-screen, and reduced-motion behavior verified.

---

## 2. Introduction Page

### Reader intent

The visitor is scanning quickly. They need to understand what Sellio is, see evidence, compare options, and choose a next action without following a fixed sequence.

### Current issues to address

- The current page mixes several visual generations and overlapping messages.
- Role sections and ecosystem sections repeat similar concepts.
- Old “Intelligence & Scale” source blocks and unsupported sample metrics should be removed physically, not only hidden/commented.
- “3 Steps to Profit” is too sales-heavy and should become an accurate launch/setup sequence.
- Placeholder social, legal, API, changelog, and license links need real destinations or removal.
- The page should use real product screenshots instead of schematic dashboard graphics.
- Content and terminology must match the listing description.

### Recommended information architecture

1. **Hero:** One platform, seven marketplace directions, two primary CTAs.
2. **Evaluation bar:** Live demo, product tour, documentation, and dashboard access.
3. **Marketplace module explorer:** Seven real verticals with concrete customer actions.
4. **Real product preview:** Storefront plus admin/seller/buyer views.
5. **Connected workflows:** Buy, book, apply, quote, and inquire.
6. **Three workspaces:** Administrator, seller, and buyer.
7. **Mobile experience:** Expo/React Native buyer journey with real screens.
8. **Ownership:** Self-hosting, source access, configuration, and data control.
9. **Technology and integrations:** Verified stack and supported gateways.
10. **Installation:** Accurate guided installer sequence.
11. **Customer proof:** Approved statements only; omit counts unless verified.
12. **FAQ:** Concrete purchase, hosting, customization, and support questions.
13. **Demo catalog:** Sticky filters and real preview links.
14. **Final CTA and footer:** No placeholder destinations.

### Design work

- Rebuild section styling from shared listing-description tokens.
- Keep the listing description’s editorial clarity but allow more interaction.
- Use a sticky desktop chapter navigation and compact mobile section menu.
- Convert the module grid into an interactive vertical explorer.
- Add a real screenshot theater with labeled Admin, Seller, Buyer, Storefront, and Mobile tabs.
- Keep the Product Tour invitation, but align its colors and typography with the new system.
- Retain the sticky demo filter and floating back-to-top control.
- Normalize buttons, pills, cards, border radii, shadows, and section spacing.
- Add reduced-motion and keyboard-visible focus states.

### Content and accuracy work

- Physically delete retired performance and fake-metric sections.
- Replace “profit,” “elite,” “enterprise,” and similar inflated language.
- Verify all demo counts against the live configured catalog.
- Verify all testimonials and rating values or remove them.
- Align technology and payment language with the listing description.
- Keep PayPal unadvertised until its declared dependency and runtime path are verified.

### Acceptance criteria

- A new visitor can identify Sellio’s purpose and seven verticals within the hero viewport.
- Each major section answers a distinct buyer question.
- No duplicate ecosystem/role/performance sections.
- No placeholder links or invented metrics.
- All demo filters, theme controls, CTAs, and navigation work.
- Lighthouse/accessibility review completed without relying on claimed scores in marketing copy.

---

## 3. Documentation(s)

### Documentation surfaces in scope

1. **Customer documentation:** `documentation/index.html`
2. **API reference:** generated Scramble/OpenAPI documentation and related links
3. **Reviewer documentation:** `documentation/reviewer`
4. **Installer guidance:** customer-facing steps that mirror `apps/backend/public/install`
5. **Portal setup guidance:** backend, storefront, seller, buyer, and mobile setup

### Reader intent

Documentation readers are task-oriented. Visual personality should build trust, but clarity, searchability, completeness, and accuracy take priority over marketing presentation.

### Current issues to address

- Some headings use inflated language such as “engineered for performance,” “executive security,” and “advanced intelligence.”
- Technical content needs version verification against live package manifests.
- Installation documentation must match the current browser installer.
- Separate portal setup instructions need clearer boundaries and environment-variable tables.
- The current long single page is difficult to maintain and review section by section.
- API, background jobs, payments, mobile, deployment, and troubleshooting need stronger task-based navigation.
- Reviewer reports are useful internally but should remain separate from customer documentation.

### Recommended documentation architecture

#### Getting started

- Product and package overview
- Supported marketplace modules
- System requirements
- Package contents
- Installation using the browser installer
- First administrator login
- Post-install checklist

#### Configure Sellio

- Application URL and environment
- Database and storage
- Queue and scheduler
- Mail and notifications
- Realtime messaging
- Payment gateways
- Maps and geolocation
- Languages and RTL considerations
- Branding and content

#### Operate the platform

- Administrator workspace
- Seller workspace
- Buyer workspace
- Products and orders
- Properties and bookings
- Vehicles and inquiries
- Events and tickets
- Jobs and applications
- Services, quotes, and appointments
- Classifieds and inquiries
- Memberships, wallet, withdrawals, and reports

#### Applications and APIs

- Laravel backend
- Next.js storefront
- React seller panel
- React buyer panel
- Expo/React Native mobile app
- REST API authentication
- API reference and example requests
- Webhooks and realtime events

#### Maintain and troubleshoot

- Caches, queues, scheduler, and logs
- Updating safely
- Backups and rollback preparation
- Common installer issues
- CORS and API URL issues
- Upload/storage issues
- Payment debugging
- Mobile connectivity and deep links
- Support request checklist

### Design system for documentation

- Use Inter for body copy and Sora only for major page titles.
- Use the warm-paper/navy/green palette in a quieter form.
- Keep code blocks neutral, high-contrast, and copyable.
- Use blue for information, orange for warnings, green for successful checks, and red only for destructive or security-critical actions.
- Add persistent search, breadcrumb, “On this page,” and previous/next navigation.
- Add version badges and “Last verified” metadata to technical pages.
- Use task cards sparingly; prefer headings, steps, tables, and code blocks.
- Provide print-friendly and reduced-motion styles.

### Content and accuracy work

- Audit every current section against routes, manifests, installer steps, and environment examples.
- Remove claims that belong in marketing rather than documentation.
- Replace generic architecture language with actual application boundaries.
- Generate environment-variable tables from maintained examples where possible.
- Keep gateway documentation limited to registered and runtime-verified services.
- Clearly label optional services and third-party account requirements.
- Add explicit warnings before destructive migration, cache, queue, or filesystem commands.
- Separate customer documentation from reviewer QA evidence.

### Documentation implementation approach

- Split the monolithic customer document into maintainable partials or pages.
- Store navigation and page metadata in one manifest.
- Add automated internal-link and missing-anchor checks.
- Add a lightweight documentation search index.
- Keep code examples copyable and tested where practical.
- Add screenshot replacement notes and consistent asset naming.
- Link to generated API documentation rather than duplicating endpoint schemas manually.

### Acceptance criteria

- A new buyer can install Sellio using only the supplied documentation.
- Each application has setup, environment, build, and deployment guidance.
- Every command identifies its working directory and expected outcome.
- No marketing-only claims appear as technical facts.
- No broken navigation, anchors, assets, or placeholder links.
- Customer and reviewer documentation are visibly separated.
- Version-sensitive pages show a verified date and relevant application version.

---

## Shared Content Registry

Create a small maintained source of truth for public surfaces containing:

- Product name and current version.
- Seven vertical names and one-sentence descriptions.
- Application names and URLs.
- Technology versions.
- Supported payment gateways.
- Demo credentials intended for publication.
- Documentation and support URLs.
- Approved testimonials.
- License/support wording.
- Screenshot asset paths and replacement status.

This registry can initially be a PHP configuration file used by introduction surfaces and mirrored into documentation build metadata. It should prevent stack versions, counts, links, and labels from drifting between pages.

### Implementation status

- [x] Added `introduction/public-content.php` as the PHP source of truth.
- [x] Added `introduction/public-content.json` as a documentation-friendly mirror.
- [x] Wired listing-description metadata, cover, URLs, stack, gateways, and demo accounts.
- [x] Wired Product Tour metadata, version, and technology labels.
- [x] Added `_development/scripts/validate-public-content.php` to detect version and retired-claim drift.
- [ ] Wire the Introduction Page to the registry during its redesign.
- [ ] Consume the JSON mirror from the documentation rebuild.

## Recommended Execution Order

1. **Shared foundation:** tokens, terminology, URL registry, screenshot inventory, and accuracy checklist.
2. **Product Tour:** finish the contained 12–15-page narrative first.
3. **Introduction Page:** rebuild the larger conversion surface using the stabilized components and assets.
4. **Customer Documentation:** restructure navigation and rewrite task-critical setup content.
5. **API and portal documentation:** connect generated references and application-specific guides.
6. **Reviewer documentation:** refresh submission evidence separately.
7. **Cross-surface QA:** links, versions, claims, responsive behavior, accessibility, and visual consistency.

## Definition of Done

- All three public surface families clearly belong to Sellio.
- Each surface respects its reader’s intent instead of copying the same layout and copy.
- Terminology, versions, links, and feature claims are consistent.
- Real screenshots replace temporary or schematic visuals where applicable.
- No unsupported metrics, guarantees, customer counts, or gateway claims remain.
- All public links and navigation paths pass an automated check.
- Desktop, tablet, mobile, keyboard, and reduced-motion behavior are verified.
