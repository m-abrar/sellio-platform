# Executive Summary: Sellio API Resources Audit
**Status**: PENDING COMPLETION
**Audit Date**: May 2026
**Lead Architect**: Antigravity (Senior Laravel Architect)

## Overview
This registry serves as the master record for the high-fidelity audit of all Laravel API Resources within the Sellio platform. The audit focuses on data leakage, N+1 query prevention, multi-tenant safety, and enterprise-grade serialization patterns.

## Progress
- [x] Initial Registry Setup
- [x] Core Marketplace Resources (Product, Service, Classified, etc.)
- [x] Real Estate & Auto Resources (Property, Auto)
- [x] Transactional Resources (Order, Payment, Subscription)
- [x] User & Communication Resources (User, Message, Ticket)
- [x] Core Recruitment & Event Resources (Jobs, Events)
- [x] Metadata & Taxonomy Resources (Category, Tag, Amenity, etc.)

---

# Resource Audit: app/Http/Resources/UserResource.php

## Resource Purpose
Transforms user profile data for identity management and public attribution.

## Risk Level
**CRITICAL / SECURITY RISK**

## Problems Found

### Security
- **CRITICAL: Unprotected PII Exposure**: Exposes `email` (L20) and `phone` (L21) without any authentication check, role-based filtering, or `when()` guard. If this resource is used to attribute a listing to a vendor, it leaks their private contact information to every unauthenticated API consumer.

## Dangerous Exposed Fields
- `email`
- `phone`

## Production Ready
**NO**

---

# Resource Audit: app/Http/Resources/JobListingResource.php / EventResource.php

## Resource Purpose
Transforms high-ticket vertical listings for recruitment and event marketplaces.

## Risk Level
**CRITICAL**

## Problems Found

### Performance (N+1)
- **Severe Database Pressure**: Both resources suffer from extreme N+1 overhead on taxonomy, media, and owner relationships.
- **Dynamic Aggregate Queries**: `EventResource` (L88) performs a direct `avg('rating')` query per resource instantiation. In a list of 20 events, this triggers 20 separate aggregation queries instead of using a cached attribute or eager-loaded count.

## Production Ready
**NO**

---

# Resource Audit: app/Http/Resources/MessageResource.php / TicketResource.php / FavoriteResource.php

## Resource Purpose
Transforms user communications and preference data.

## Risk Level
**LOW**

## Problems Found

### Laravel Best Practices
- **SAFE**: Correctly utilizes `whenLoaded()` for relationships, ensuring minimal overhead during batch processing.

## Production Ready
**YES**

---

# Resource Audit: app/Http/Resources/OrderResource.php / OrderItemResource.php

## Resource Purpose
Transforms order and item data for customer history and administrative fulfillment.

## Risk Level
**CRITICAL**

## Problems Found

### Performance (N+1)
- **RELATIONAL LEAKAGE**: `OrderResource` (L46) and `OrderItemResource` (L23) both perform forced lazy-loading of parent relationships (`user` and `product`). In a typical "My Orders" list view with 20 orders, this will trigger 20+ redundant user queries and 50+ product queries (depending on item count).

### Security
- **Privacy Concern**: `OrderResource` exposes full shipping PII without conditional logic. This resource should be split into `PublicOrderResource` (for tracking) and `AdminOrderResource` (for fulfillment).

## Production Ready
**NO**

---

# Resource Audit: app/Http/Resources/CartResource.php / CartItemResource.php

## Resource Purpose
Transforms the active shopping cart state for the frontend checkout.

## Risk Level
**HIGH**

## Problems Found

### Performance
- **Forced Product Loading**: `CartItemResource` (L22-26) lazy loads the product model for every single item in the cart. A large cart will result in sluggish response times during quantity updates or removals.
- **Redundant Logic**: `CartResource` (L19) performs a manual sum on `items` while also attempting to load the `items` collection via `whenLoaded` (L17).

## Production Ready
**NO**

---

# Resource Audit: app/Http/Resources/SubscriptionResource.php / PlanResource.php

## Resource Purpose
Transforms SaaS subscription data and pricing plans.

## Risk Level
**LOW**

## Problems Found

### Laravel Best Practices
- **SAFE**: `SubscriptionResource` correctly utilizes `whenLoaded()` for the plan relationship (L27).

## Production Ready
**YES**

---

# Resource Audit: app/Http/Resources/PropertyResource.php

## Resource Purpose
Transforms property listings for real estate searches and bookings.

## Risk Level
**MEDIUM**

## Problems Found

### Laravel Best Practices
- **MIXED ADOPTION**: Correctly uses `whenLoaded()` for most model relationships (L52-85), which significantly reduces N+1 risks for core model data.

### Performance
- **CRITICAL N+1 (Media)**: Fails to use `whenLoaded` for Spatie Media collections. Every `PropertyResource` instantiation triggers `$this->getMedia(Property::GALLERY_MEDIA)` (L59), resulting in severe database overhead in list views.

## Dangerous Exposed Fields
- `hoa` (Internal financial data)
- `total_units`

## Production Ready
**NO**

---

# Resource Audit: app/Http/Resources/AutoResource.php

## Resource Purpose
Transforms vehicle listings for the automotive marketplace.

## Risk Level
**CRITICAL**

## Problems Found

### Performance
- **Extreme N+1 Overhead**: Does **NOT** use `whenLoaded` for taxonomy (`category`, `brand`), features, tags, media, or inquiries. This is one of the heaviest resources in the platform, likely causing significant latency in search results.

### Security
- **Data Leakage**: Exposes the full `vin_number` (L38) without a permission check. While common in some regions, it can be considered sensitive data depending on the client's privacy policy.

## Production Ready
**NO**

---

# Resource Audit: app/Http/Resources/PropertyBookingResource.php / PropertyVisitResource.php / AutoInquiryResource.php

## Resource Purpose
Transactional lead and booking resources for high-ticket verticals.

## Risk Level
**LOW (Admin Context)**

## Problems Found

### Security
- **Data Privacy**: These resources expose full PII (Name, Email, Phone, Message) without explicit permission checks. If these resources are ever reused in a public-facing API without strict filtering, they will lead to a GDPR/privacy violation.

## Production Ready
**YES**

---

# Resource Audit: app/Http/Resources/ProductResource.php

## Resource Purpose
Transforms the `Product` model for public marketplace and administrative views.

## Risk Level
**CRITICAL**

## Problems Found

### Security
- **Internal Data Exposure**: Exposes `low_stock_threshold` (L39). This is operational data intended for vendor/admin inventory management and should never be exposed in a public API resource.
- **Moderation Metadata**: Exposes `approved_at` (L97). While often benign, it reveals internal moderation timelines.

### Performance (N+1 Storm)
- **Lazy Media Loading**: Calls `$this->getMedia(Product::GALLERY_MEDIA)` (L58) without a `whenLoaded` check. In a collection of 50 products, this triggers 50+ additional database queries.
- **Relational Overhead**: Lazy loads `type`, `features`, `category`, `brand`, `tags`, and `user` (L47-87).
- **Count Queries**: Executing `$this->reviews()->count()` (L96) if `reviews_count` is missing results in a separate aggregate query per resource.

### Code Quality
- **Global Helper in Loop**: Calling `setting()` (L31) inside `toArray` results in repetitive configuration lookups for every item in a list.

## Dangerous Exposed Fields
- `low_stock_threshold`
- `stock_quantity` (for all users)

## Production Ready
**NO**

---

# Resource Audit: app/Http/Resources/ServiceResource.php / ClassifiedResource.php

## Resource Purpose
Transforms Service and Classified listings for the marketplace API.

## Risk Level
**CRITICAL**

## Problems Found

### Performance
- **Systemic N+1 Vulnerabilities**: Both resources suffer from extreme lazy-loading of taxonomy (`category`, `type`, `brand`, `tags`), media, and vendor profiles.
- **Aggregate Leakage**: `ServiceResource` executes count queries for `quotes` and `appointments` (L102-103) inside the resource layer.

### Data Exposure
- `approved_at` exposed globally.
- `zip_code` (L74) in `ClassifiedResource` might be sensitive depending on privacy settings.

## Production Ready
**NO**

---

# Resource Audit: app/Http/Resources/BlogResource.php

## Resource Purpose
Transforms blog posts for content delivery.

## Risk Level
**MEDIUM**

## Problems Found

### Performance
- **Heavy Payload**: Exposes full `content` (L19) in the default resource. This creates massive payloads when fetching a list of blog posts.
- **Lazy Loading**: N+1 issues on `media`, `category`, `tags`, and `user`.

### Code Quality
- **Typos**: Uses the key `'authorrr'` (L32), which is unprofessional and breaks API consistency with other resources using `'author'` or `'vendor'`.

## Production Ready
**NO**

---

# Resource Audit: app/Http/Resources/ReviewResource.php

## Resource Purpose
Transforms user reviews for display on listings.

## Risk Level
**LOW**

## Problems Found

### Laravel Best Practices
- **SAFE**: Correctly implements `whenLoaded()` for `user` and `reviewable` relationships (L28-29). This is the only resource in the batch that avoids forced N+1 queries.

## Production Ready
**YES**

---
