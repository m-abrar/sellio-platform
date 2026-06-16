## Completed

- [x] Fixed all internal/protocol language in `Page.tsx` defaults: `CORE_V4_PROTOCOL` → `Modern Marketplace`; hero description cleaned of "high-fidelity distribution node" jargon; `INITIALIZE NODE` → `Browse the catalog`; `VIEW ARCHITECTURE` → `Explore listings`; status bar items `1.4M_NODES_ACTIVE`/`LATENCY: 8ms`/`DISTRIBUTION_READY: TRUE`/`ENCRYPTION: AES_256` → buyer-facing equivalents; `LIVE_NEXUS_FEED` → `Live Catalog`; `Synchronized Listings.` → `Featured Listings.`; offline/empty state copy cleaned; mid-section and CTA copy de-jargoned.
- [x] Fixed showcase bullet list: `Dynamic Schema Mapping`/`Real-time Global Sync`/`High-Fidelity UI DNA`/`Institutional Security Nodes` → `Multi-Vertical Platform`/`Real-Time Catalog Updates`/`Mobile-First Design`/`Secure Transactions`.
- [x] Fixed product card: `NEXUS_{product.id}` badge → `#{product.id}`; fallback description cleaned of Nexus Prime jargon; `"Open Sync"` CTA → `View listing`; `'Sync quote'` price fallback → `'Price on request'`.
- [x] Converted hero CTA buttons and final section CTA from `<button onClick={() => router.push(...)}>` to `<a href={themeLink(...)}>` links; removed now-unused `useRouter` import.
- [x] Fixed `NexusHeader`: logo `<div className="unp-logo">NEXUSPRIME</div>` → `<a href={themeLink('/')}>` using `useUnifiedThemeLink`.
- [x] Fixed `NexusBentoGrid`: `CORE_ENGINE` kicker → `One Platform`; bento side copy de-jargoned.
- [x] Fixed `NexusPricing`: `NODAL_SUBSCRIPTION` kicker → `Subscription Plans`; `Siloed Capacity Plans.` → `Plans & Pricing.`; plan features replaced with buyer-facing copy; plan button `ACTIVATE NODE` → `<a>Get started</a>` linking to `/explore`.
- [x] Fixed `NexusFooter`: logo `<div>NEXUSPRIME</div>` → `<a href={themeLink('/')}>` link; description and copyright `© 2026 SELLIO_NEXUSPRIME_OS // CORE_ACTIVE` → `© 2026 Sellio. All rights reserved.`
- [x] Updated ThemeSeeder `unifieds_modern` section: all 24 content values cleaned to match updated code defaults.
- [x] Verified: `npm.cmd run lint` (0 errors), `/preview/unifieds_modern` HTTP 200.

## Open

