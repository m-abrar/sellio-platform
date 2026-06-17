- [x] The footer is unfinished
  - NetworkFooter already wired in Layout.tsx. PulseFooter (unfinished placeholder) and RocketHeader (unused) deleted.

- [x] remove underscore everywhere in the theme (example: CONNECT_HUB), for the frontend readable text
  - Added `cleanSpec()` in ProductPage.tsx applied to workplace, employment type, experience level, and education spec card values. OpportunityGrid already used `cleanLabel` for badge display. VentureCard already used `replace(/_/g, ' ')`.

- [x] on the explore page, we have a sidebar, make sure the dropdown items are dynamic and real?
  - Categories and locations are populated from `result.response.sidebar` API response. Workplace types and experience levels have sensible static defaults (Remote/On-Site/Hybrid; Entry-level through Executive) that are overridden by API sidebar data when available.
  - Also cleaned sidebar filter labels ("Global Node Location" → "Location", "Workplace Architecture" → "Work Style", "Experience Tier" → "Experience Level") and fixed explore page header copy ("hypergrowth corporate ledger" → readable description).
