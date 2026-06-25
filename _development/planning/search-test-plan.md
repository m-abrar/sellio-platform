# Search Parameter Test Plan — All Verticals

**Status: 2 confirmed bugs found via static analysis before testing.**
The Services sidebar is completely broken (3 mismatched param names).
Products has a brand filter array/integer mismatch. Other verticals look
correct from the code but need runtime confirmation.

---

## Known Bugs (confirmed from code, test first)

### Bug 1 — Services sidebar: all 3 filters silently dropped

The sidebar sends these field names, but `SearchServiceRequest::rules()` only validates different names.
`$request->validated()` strips anything not in the rules, so none of these reach the query:

| Sidebar sends | Request expects | Effect |
|---|---|---|
| `name="q"` | `search` | keyword filter always ignored |
| `name="location_id"` | `location` | location filter always ignored |
| `name="category"` (int) | `category_id` | category filter always ignored |
| `is_project_based`, `is_subscription`, `is_urgent`, `is_remote` | not in rules | always ignored |

**The hero search form on the homepage is correct** (`search`, `location`, `category_id`) —
so the bug only manifests from the sidebar on `/services`.

**Fix:** In `resources/views/frontend/services/_partials/_sidebar_filter.blade.php`, rename:
- line 28: `name="q"` → `name="search"`
- line 42: `name="location_id"` → `name="location"`
- line 77: `name="category"` → `name="category_id"`
- line 5: `request('category')` → `request('category_id')` (keeps select highlighted after submit)
- `is_project_based`, `is_subscription`, `is_urgent`, `is_remote` → add to `SearchServiceRequest::rules()` and `ServiceManagementService::searchServices()`

---

### Bug 2 — Products sidebar: brand checkboxes send array, request expects integer

The sidebar uses `name="brand[]"` (array of checkboxes) but `SearchProductRequest` validates
`brand` as `nullable|integer|exists:brands,id`. An array fails integer validation →
redirect with error or filter silently dropped.

`on_sale` and `in_stock` from the sidebar also have no corresponding rules → silently stripped.

**Fix:** Decide whether brand filtering is single or multi-select, then align the rule and query accordingly.

---

## Test Steps — Per Vertical

Run these in the browser against `http://127.0.0.1:8000`.

---

### 1. Properties — `/properties`

Form sends: `q`, `location` (int ID), `property_type` (sale|rental), `category` (int ID), `max_price`

| Step | Action | What to verify |
|---|---|---|
| A | Type a keyword in hero search, submit | URL has `?q=…`, results contain that word in title |
| B | Select a location in hero, submit | URL has `?location=N`, all results show that location |
| C | Select "For Sale", submit | URL has `?property_type=sale`, no rental cards appear |
| D | Select "For Rent", submit | URL has `?property_type=rental`, no for-sale cards |
| E | Set max price in hero, submit | URL has `?max_price=N`, no result exceeds that price |
| F | Use sidebar keyword + type + location combined, submit | URL has all 3 params, results respect all three |
| G | Direct URL: `?q=NORESULTSXYZ` | Empty state shown, not full listing |

---

### 2. Products — `/products`

Form sends: `q`, `category` (int ID), `location` (int ID), `min_price`, `max_price`
Sidebar also sends: `brand[]` (broken), `on_sale`, `in_stock`

| Step | Action | What to verify |
|---|---|---|
| A | Type keyword in hero search, submit | URL has `?q=…`, results filtered |
| B | Select a category in hero, submit | URL has `?category=N`, results are that category only |
| C | Set min/max price in hero, submit | URL reflects prices, results in range |
| D | Apply sidebar filters (keyword + category + price slider) | All 3 appear in URL and filter results |
| E | Check brand checkboxes — select one brand, click Apply | Does it redirect with a validation error? Does `brand` appear in URL? Are results filtered? |
| F | Check `on_sale` and `in_stock` toggles | Do they appear in URL? Do results respect them? (Expected: silently ignored) |

---

### 3. Services — `/services`

Hero form sends: `search`, `location`, `category_id` (all correct)
Sidebar sends: `q`, `location_id`, `category` (all broken — Bug 1)

| Step | Action | What to verify |
|---|---|---|
| A | **Hero form**: type keyword, pick location + category, submit | URL has `search`, `location`, `category_id` — results filtered |
| B | **Sidebar keyword** (`q` field): type a term, click Apply | URL has `q=…` NOT `search=…` — results are NOT filtered (Bug 1 confirmed) |
| C | **Sidebar location**: pick a location, click Apply | URL has `location_id=…` NOT `location=…` — all services still appear |
| D | **Sidebar category**: pick a category, click Apply | URL has `category=…` NOT `category_id=…` — all services still appear |
| E | Manual URL test after fix: `?search=plumber&location=1&category_id=2` | Results correctly filtered by all three |

---

### 4. Autos — `/autos`

Form sends: `make` (text), `location` (int ID), `category` (int ID), `type` (selling|lease), `transmission`

| Step | Action | What to verify |
|---|---|---|
| A | Type a make/brand in hero, submit | URL has `?make=…`, results match that make |
| B | Select location + category, submit | Both appear in URL, results filtered |
| C | Select "For Sale" type, submit | URL `?type=selling`, only sale listings |
| D | Select "Lease", submit | URL `?type=lease`, only lease listings |
| E | Select transmission, submit | URL `?transmission=Automatic`, results filtered |

---

### 5. Jobs — `/jobs`

Form sends: `search`, `location` (slug), `workplace_type`, `category` (slug)

| Step | Action | What to verify |
|---|---|---|
| A | Type job title/company, submit | URL has `?search=…`, results filtered |
| B | Select a location (slug), submit | URL has `?location=slug-value`, results in that city |
| C | Select Remote workplace, submit | URL has `?workplace_type=remote`, only remote jobs |
| D | Select a category (slug), submit | URL has `?category=slug`, results in that category |
| E | Combined: search + location + workplace_type | All 3 in URL, all 3 applied |

---

### 6. Events — `/events`

Form sends: `search`, `location` (slug), `category` (slug), `date`

| Step | Action | What to verify |
|---|---|---|
| A | Type event name, submit | URL has `?search=…`, results filtered |
| B | Pick a date, submit | URL has `?date=YYYY-MM-DD`, only events on/after that date |
| C | Select location + category, submit | Both in URL, results filtered |

---

### 7. Classifieds — `/classifieds`

Form sends: `search`, `location` (slug), `category` (slug), `min_price`, `max_price`

| Step | Action | What to verify |
|---|---|---|
| A | Type keyword, submit | URL has `?search=…`, results filtered |
| B | Select location (slug), submit | Results only from that location |
| C | Set price range, submit | Results within price range |
| D | Combined: keyword + location + category | All 3 in URL, all applied |

---

### 8. Blogs — `/blogs`

Form sends: `search`, `category` (slug), `sort`

| Step | Action | What to verify |
|---|---|---|
| A | Type keyword, submit | URL has `?search=…`, relevant posts shown |
| B | Select a category (slug), submit | Only posts in that category |
| C | Sort by "Latest" and "Most Popular" | Order changes between the two |

---

### 9. AI Smart Search (homepage)

| Step | Action | What to verify |
|---|---|---|
| A | Type "3 bedroom house under $400k" → Search | Redirects to `/properties` with correct params in URL |
| B | Type "remote marketing job" → Search | Redirects to `/jobs?search=…&workplace_type=remote` |
| C | Type "used Toyota under $15k" → Search | Redirects to `/autos?make=Toyota&price_max=15000` |
| D | Verify redirect URL params match the target vertical's expected param names | Check each param in the URL against the FormRequest rules |

---

## Quick Reference — Correct Param Names Per Vertical

| Vertical | Keyword | Location | Category | Price |
|---|---|---|---|---|
| Properties | `q` | `location` (int) | `category` (int) | `max_price` |
| Autos | `make` | `location` (int) | `category` (int) | `price_min` / `price_max` |
| Services hero | `search` | `location` (int) | `category_id` (int) | `min_price` / `max_price` |
| Services sidebar | **`search`** ← fix from `q` | **`location`** ← fix from `location_id` | **`category_id`** ← fix from `category` | `max_price` |
| Products | `q` | `location` (int) | `category` (int) | `min_price` / `max_price` |
| Jobs | `search` | `location` (slug) | `category` (slug) | — |
| Events | `search` | `location` (slug) | `category` (slug) | — |
| Classifieds | `search` | `location` (slug) | `category` (slug) | `min_price` / `max_price` |
| Blogs | `search` | — | `category` (slug) | — |
