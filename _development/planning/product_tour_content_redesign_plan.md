# Sellio Interactive Product Tour Redesign Plan

**Created:** 2026-07-02  
**Scope:** `introduction/product-tour`  
**Status:** In progress — 15-page narrative structure implemented; real screenshot asset pass remains

## Objective

Turn the Sellio interactive product tour into a focused visual product story rather than a shortened copy of the main introduction page.

The main introduction page supports scanning, comparison, detailed research, FAQs, and conversion. A visitor who opens the product tour is showing a different intent: they are willing to move through a guided sequence. Each page turn should therefore reveal one clear idea, create curiosity, and lead naturally into the next page.

## Reading Psychology

### Main introduction page

- Visitors scan headings and jump between sections.
- Detailed feature lists and comparison tables are useful.
- Repetition can reinforce key selling points.
- FAQs, technical information, testimonials, and demos help visitors validate a buying decision.

### Interactive product tour

- Visitors expect a beginning, progression, and conclusion.
- Each page should answer one question and introduce the next.
- Visual storytelling should carry more weight than paragraphs or repeated card grids.
- Supporting detail should be available through a small “Read more” link to the relevant main-page section.
- The experience should stay short enough that reaching the final page feels achievable.

## Recommended 15-Page Flow

| Page | Topic | Purpose | Recommended presentation | Main-page link |
|---:|---|---|---|---|
| 1 | Cover | Establish Sellio and its central promise | Strong Sellio identity, concise value proposition, restrained motion | — |
| 2 | Imagine | Show how many marketplace ideas Sellio can support | A visual constellation of Properties, Jobs, Events, Services, Shopping, Classifieds, and Vehicles | `../index.php#modules` |
| 3 | Discover | Introduce intelligent marketplace discovery | Animated natural-language query transforming into filters and matching results | `../index.php#demos` |
| 4 | Connect | Show buyer and seller communication | Conversation graphic containing questions, offers, replies, and negotiation | `../index.php#ecosystem` |
| 5 | Buyer Journey | Demonstrate the complete customer journey | Search → View → Chat → Book → Pay timeline with progressive highlights | `../index.php#demos` |
| 6 | Seller Success | Explain how sellers publish and operate | Split presentation: listing creation on one side; orders, analytics, and earnings on the other | `../index.php#ecosystem` |
| 7 | Admin Control | Explain operational control and platform ownership | Control-centre diagram connecting users, listings, modules, payments, memberships, and reports | `../index.php#ecosystem` |
| 8 | Marketplace Universe | Present Sellio’s supported verticals | One illustrated marketplace landscape instead of two feature-card pages | `../index.php#modules` |
| 9 | Automation | Show how Sellio reduces routine work | “Your marketplace keeps moving” workflow showing approvals, reminders, notifications, and expirations | `../index.php#automation` |
| 10 | Every Screen | Demonstrate responsive delivery | Real Sellio desktop, tablet, and mobile screenshots inside device frames | `../index.php#mobile-ready` |
| 11 | Built to Own | Explain the self-hosted commercial advantage | Combine ownership messaging and the SaaS fee comparison into one simple visual | `../index.php#comparison` |
| 12 | Technology | Build technical confidence | Laravel, PHP, React, Next.js, MySQL, Bootstrap, Alpine, and Expo architecture | `../index.php#technology` |
| 13 | Launch Journey | Explain what happens after purchase | Download → Install → Import → Configure → Launch | `../index.php#how-it-works` |
| 14 | Customer Proof | Provide verified reassurance | Genuine, approved testimonials without an unverified customer-count headline | `../index.php#reviews` |
| 15 | Final Page | Convert interest into action | “One Platform. Unlimited Marketplaces.” with demo and purchase-oriented calls to action | `../index.php#demos` |

## Content to Remove or Consolidate

### Remove as standalone pages

- **Multi-Role Performance:** Buyer, seller, and admin roles are already communicated more clearly through the journey pages.
- **The 360° Ecosystem:** Repeats the same three roles without advancing the product-tour story.
- **Intelligence & Scale statistics:** Overlaps other pages and contains performance or usage claims that should only appear when independently verified.
- **FAQ:** The main page is a better location for detailed objections and answers. An FAQ page slows the product tour immediately before its conclusion.

### Consolidate

- Merge **Sell** and **Manage** into the Seller Success page.
- Merge **Industry Modules I** and **Industry Modules II** into Marketplace Universe.
- Merge **Own Your Marketplace** and **Stop Paying Monthly Fees** into Built to Own.
- Keep automation as a topic, but redesign it as a visual workflow rather than copying the landing-page text.

## Visual Direction

The redesigned product tour should avoid becoming a sequence of similar cards. Each important page should have its own visual grammar while remaining part of the same Sellio design system.

### Recommended visual formats

- Real product screenshots cropped into browser, dashboard, tablet, and phone frames.
- A marketplace constellation or illustrated landscape for supported verticals.
- A chat-thread composition for buyer and seller communication.
- A connected timeline for the buyer and launch journeys.
- A control-room diagram for the administration system.
- A split-screen operational view for the seller experience.
- A simple ownership comparison with minimal text and strong iconography.

### Asset principles

- Prefer real Sellio interfaces over generic stock dashboard images.
- Avoid unverifiable charts, revenue numbers, activity counters, or usage statistics.
- Use illustrations where a concept cannot be represented clearly with a screenshot.
- Keep important text readable without relying on hover interactions.
- Ensure every page remains understandable on tablet and mobile layouts.

## “Read More” Link Pattern

Selected pages should include a small, consistent link near the lower-left content edge:

> Explore this feature →

The link should:

- Open the relevant section of `introduction/index.php`.
- Remain visually secondary to the page-turn controls.
- Use explicit accessible text rather than a generic “Learn more.”
- Not cover or interfere with the page-edge flip hot zones.

Suggested labels include:

- Explore marketplace modules →
- See the complete buyer experience →
- Explore seller and admin tools →
- Review the ownership comparison →
- View the complete technology stack →
- Explore live demos →

## Main Introduction Page Support

The following small main-page adjustment will be needed when the redesign is implemented:

- Add `id="technology"` to the technology-stack section so page 12 has a stable destination.

Existing usable anchors include:

- `#automation`
- `#ecosystem`
- `#modules`
- `#comparison`
- `#how-it-works`
- `#reviews`
- `#mobile-ready`
- `#demos`

## Accuracy Rules

- Do not publish a customer-count claim unless a current verified figure is deliberately approved for marketing use.
- Only use genuine, approved customer testimonials.
- Do not claim “thousands of customers” or “5,000+ business owners.”
- Do not present uptime, daily listing volume, revenue, sales, or traffic figures unless they are verified and documented.
- Technical stack labels must match the applications currently shipped with Sellio.

## Implementation Sequence

1. [x] Confirm the final 15-page content order and copy.
2. [x] Inventory existing screenshots and identify missing visual assets; temporary Pexels placeholders documented in `introduction/product-tour/IMAGE_CREDITS.md`.
3. [x] Add the `#technology` anchor to the main introduction page.
4. [x] Rebuild the product-tour markup around the new page order.
5. [x] Create reusable styles for visual timelines, device frames, diagrams, and read-more links.
6. Add real screenshots or approved illustrations.
7. Verify page-turn navigation, keyboard controls, hot zones, links, and progress count.
8. Test desktop, tablet, and mobile layouts.
9. Review every numerical and testimonial claim before release.

## Expected Outcome

- Reduce the product tour from 21 pages to approximately 15 pages.
- Remove low-value repetition without weakening the product story.
- Give the product tour its own guided reading experience.
- Use the main introduction page as the deeper information layer.
- Improve the likelihood that visitors complete the product tour and continue into demos or detailed product sections.
