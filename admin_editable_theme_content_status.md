# Admin-Editable Theme Content Status
2: 
3: Last updated: 2026-05-26
4: Last reconciled: 2026-05-26 after completing 100% of all 52 seeded storefront themes.
5: 
6: This tracks storefront themes converted to the structured theme-content slot system used by `/admin/content`.
7: 
8: Definition of complete: the theme has admin-editable homepage slots wired through the storefront, fallback defaults in `apps/storefront/src/lib/theme-content-defaults.ts`, and seeded/admin defaults in the backend content registry.
9: 
10: ## Summary
11: 
12: | Status | Count |
13: | :--- | ---: |
14: | Complete | 52 |
15: | Pending | 0 |
16: | Total seeded themes | 52 |
17: 
18: Latest completed batch: All remaining Classifieds, Unifieds, Properties, Jobs, and Services themes.
19: 
20: ## Complete
21: 
22: | Vertical | Theme Key | Theme |
23: | :--- | :--- | :--- |
24: | Autos | `autos_classic` | Autos Classic / Dealer |
25: | Autos | `autos_electric` | Autos Electric / Green Cars |
26: | Autos | `autos_luxury` | Autos Luxury / Premium |
27: | Autos | `autos_modern` | Autos Modern / Showcase |
28: | Autos | `autos_used` | Autos Used / Marketplace |
29: | Classifieds | `classifieds_deals` | Classifieds Deals / Bargain |
30: | Classifieds | `classifieds_elite` | Classifieds Elite |
31: | Classifieds | `classifieds_general` | Classifieds General / Marketplace |
32: | Classifieds | `classifieds_local` | Classifieds Local / Community |
33: | Classifieds | `classifieds_modern` | Classifieds Modern / Card Style |
34: | Classifieds | `classifieds_premium` | Classifieds Premium |
35: | Ecommerce | `ecommerce_default` | Ecommerce Standard |
36: | Ecommerce | `ecommerce_electronics` | Ecommerce Electronics |
37: | Ecommerce | `ecommerce_fashion` | Ecommerce Fashion |
38: | Ecommerce | `ecommerce_luxury` | Ecommerce Luxury |
39: | Events | `events_classic` | Events Classic |
40: | Events | `events_corporate` | Events Corporate |
41: | Events | `events_creative` | Events Creative |
42: | Events | `events_festival` | Events Festival / Outdoor |
43: | Events | `events_music` | Events Music / Concert |
44: | Jobs | `jobs_blue_collar` | Jobs Blue-Collar / Local |
45: | Jobs | `jobs_corporate` | Jobs Corporate / Professional |
46: | Jobs | `jobs_freelance` | Jobs Freelance / Gig Economy |
47: | Jobs | `jobs_modern` | Jobs Modern |
48: | Jobs | `jobs_startup` | Jobs Startup / Modern |
49: | Jobs | `jobs_tech` | Jobs Tech / IT |
50: | Properties | `properties_classic` | Properties Classic |
51: | Properties | `properties_commercial` | Properties Commercial Real Estate |
52: | Properties | `properties_investment` | Investment / ROI Focused |
53: | Properties | `properties_luxury` | Properties Luxury |
54: | Properties | `properties_map` | Properties Map View |
55: | Properties | `properties_modern` | Properties Modern |
56: | Properties | `properties_neighborhood` | Neighborhood Focused |
57: | Properties | `properties_platinum` | Properties Platinum |
58: | Properties | `properties_rental` | Properties Rental / Vacation |
59: | Properties | `properties_showcase` | Single Property Showcase |
60: | Properties | `properties_unified` | Properties Unified / All-in-One |
61: | Properties | `properties_urban` | Properties Urban |
62: | Properties | `properties_vacation` | Properties Vacation |
63: | Services | `services_corporate` | Services Corporate / Agency |
64: | Services | `services_creative` | Services Creative / Studio |
65: | Services | `services_health` | Services Health & Wellness |
66: | Services | `services_local` | Services Home / Local |
67: | Services | `services_marketplace` | Services Marketplace / Freelance |
68: | Unified | `unifieds_classic` | Universal Classic |
69: | Unified | `unifieds_default` | Universal Default |
70: | Unified | `unifieds_interactive` | Universal Interactive |
71: | Unified | `unifieds_marketplace` | Universal Marketplace |
72: | Unified | `unifieds_mega` | Universal Mega |
73: | Unified | `unifieds_minimal` | Universal Minimal |
74: | Unified | `unifieds_modern` | Universal Modern |
75: | Unified | `unifieds_standard` | Universal Standard |
76: 
77: ## Pending
78: 
79: *No pending themes.*
80: 
81: ## Update Rules
82: 
83: - Move a theme from Pending to Complete only after storefront hooks, frontend defaults, backend defaults, and admin slot visibility are all in place.
84: - Keep this file in sync when adding new seeded themes to `apps/backend/database/seeders/ThemeSeeder.php`.
85: - This file tracks admin-editable content slots only. API-backed listing/product status is tracked separately in `dynamic_themes_report.md`.
