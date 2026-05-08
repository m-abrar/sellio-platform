# Executive Summary: Sellio Events & Listeners Audit
**Status**: PENDING COMPLETION
**Audit Date**: May 2026
**Lead Architect**: Antigravity (Senior Laravel Architect)

## Overview
This registry serves as the master record for the high-fidelity audit of all Laravel Events and Listeners within the Sellio platform. The audit focuses on queue safety, scalability, failure handling, and enterprise-grade event-driven patterns.

## Progress
- [x] Initial Registry Setup
- [x] Transactional Events (Booking, Payment, Subscription)
- [x] Marketplace Events (Listings, Leads, Reviews)
- [ ] Account & Marketing Events (User Reg, Newsletter)
- [x] Listeners & Queue Architecture (Partial)

---

# Event Audit: app/Events/BookingCancelled.php

## Event Purpose
Signals that a booking has been cancelled and a refund has been initiated.

## Risk Level
**LOW**

## Problems Found

### Architecture
- **Missing Domain Context**: Passes `User`, `itemTitle`, and `refundAmount` individually instead of the `Booking` model. This prevents listeners from accessing other critical booking metadata (e.g., cancellation reason, original dates) without modifying the event or performing additional queries.

## Payload Risks
- Loss of context (Booking model absent).

## Production Ready
**YES**

---

# Event Audit: app/Events/EventTicketPurchased.php

## Event Purpose
Triggered after a successful event ticket purchase to initiate delivery.

## Risk Level
**MEDIUM**

## Problems Found

### Architecture
- **Model Ambiguity**: Imports `App\Models\Ticket` (L9). In the Sellio ecosystem, `Ticket` is the support ticket model. Event tickets should use vertical-specific models (e.g., `EventOccurrenceTicket`). This likely causes logic errors in the listener.

## Production Ready
**NO (Logic Ambiguity)**

---

# Event Audit: app/Events/JobApplicationReceived.php / ListingApproved.php / ListingRejected.php

## Event Purpose
Core moderation and lead lifecycle events for the recruitment and marketplace verticals.

## Risk Level
**MEDIUM**

## Problems Found

### Architecture
- **Tight Coupling (URL generation)**: These events pass generated URLs (`applicationLink`, `liveUrl`) in the constructor. URL generation is a view/presentation concern and should be handled by the listener or notification class to allow for different channel formats (SMS vs. Email).
- **Model Inconsistency**: `JobApplicationReceived` uses the generic `Listing` model instead of the specialized `JobListing` model.

## Production Ready
**YES**

---

# Listener Audit: app/Listeners/SendBookingCancelledEmail.php / SendEventTicketEmail.php / SendJobApplicationReceivedEmail.php / SendListingApprovedEmail.php / SendListingRejectedEmail.php

## Listener Purpose
Automated email dispatchers for transactional and moderation workflows using dynamic templates.

## Risk Level
**MEDIUM**

## Problems Found

### Queue Safety
- **SAFE**: Correctly implements `ShouldQueue`.

### Performance
- **N+1 Database Queries**: Every listener execution triggers a database query to fetch the `EmailTemplate` by key (e.g., L45). In a high-traffic marketplace, this creates unnecessary database pressure. Templates **MUST** be cached.
- **Lazy Loading Risk**: Accessing attributes like `$ticket->event->title` or `$listing->title` inside the listener triggers lazy loading if the relationships weren't eager-loaded during event dispatching.

### Maintainability
- **Hardcoded Logic**: `SendBookingCancelledEmail.php` hardcodes the currency as 'USD' (L49). This violates multi-currency requirements for CodeCanyon distribution.

## Suggested Refactors
- Implement a `TemplateCacheService` to retrieve email blueprints.
- Move URL generation logic out of Events and into these Listeners.

## Queue Safety
**SAFE**

## Production Ready
**NO (Performance & Hardcoding issues)**

---

# Event Audit: app/Events/NewMessageSent.php

## Event Purpose
Broadcasting real-time message notifications and syncing chat UI state.

## Risk Level
**CRITICAL / SECURITY RISK**

## Problems Found

### Security
- **CRITICAL: Public Channel Broadcasting**: The event broadcasts on a **Public Channel** (`new Channel('chat.' . ...)`) instead of a `PrivateChannel` (L36). This allows any user (or malicious actor) to eavesdrop on any private conversation by simply subscribing to the numeric conversation ID.
- **Data Leakage**: The broadcast payload (L50-57) includes the full message `body`. Combined with the public channel, this exposes private user communications to unauthorized parties.

## Suggested Improvements
- Migrate to `PrivateChannel` with appropriate authorization logic in `routes/channels.php`.
- Minimize broadcast payload; ideally, broadcast only the message ID and let the client fetch it via an authorized API request.

## Event Safety
**UNSAFE**

## Production Ready
**NO**

---

# Event Audit: app/Events/NewsletterOptinAttempted.php / NewsletterSubscriptionConfirmed.php

## Event Purpose
Managing the lifecycle of marketing mailing lists (Double Opt-in).

## Risk Level
**MEDIUM**

## Problems Found

### Architecture
- **Model Name Collision**: These events import `App\Models\Subscription` (L8). In the Sellio core, `Subscription` refers to SaaS partner plans. Newsletter records reside in `NewsletterSubscriber`. This naming collision creates significant risk for developer error and logic corruption in listeners.

## Production Ready
**NO (Architectural Debt)**

---

# Event Audit: app/Events/NewListingLead.php / PaymentFailed.php

## Event Purpose
Marketplace lead generation and financial recovery signals.

## Risk Level
**LOW**

## Problems Found

### Architecture
- **Missing Failure Context**: `PaymentFailed` only passes `User` and `Plan`. It lacks the specific `Payment` record or the gateway error message, forcing listeners to perform expensive lookups or guess the failure reason.

## Production Ready
**YES**

---

# Listener Audit: app/Listeners/SendNewListingLeadEmail.php / SendNewsletterWelcomeEmail.php / SendOptinConfirmationEmail.php / SendPaymentFailedEmail.php

## Listener Purpose
Automated dispatchers for marketplace leads and marketing onboarding.

## Risk Level
**MEDIUM**

## Problems Found

### Performance
- **N+1 Database Pressure**: Recurring un-cached queries for `EmailTemplate` blueprints.

### Code Quality
- **Hardcoded URLs**: `SendNewsletterWelcomeEmail` and `SendOptinConfirmationEmail` hardcode URL paths (e.g., `/newsletter/confirm/`) instead of using named routes. This will break if the platform's routing structure is customized.

## Suggested Refactors
- Use `route()` helpers for all generated URLs.
- Implement a caching layer for `EmailTemplate`.

## Queue Safety
**SAFE**

## Production Ready
**NO**

---

# Event Audit: app/Events/PlanAboutToExpire.php / PlanDowngraded.php / PlanExpired.php / PlanSubscribed.php / PlanUpgraded.php

## Event Purpose
The lifecycle signals for the SaaS subscription engine.

## Risk Level
**LOW**

## Problems Found

### Architecture
- **Inconsistent Payload**: These events vary in their payload (some pass `Plan`, some only `Subscription`). While correct for their specific context, the lack of a standardized `SubscriptionEvent` base or interface makes listener maintenance slightly harder.

## Production Ready
**YES**

---

# Listener Audit: app/Listeners/SendRenewalReminderEmail.php / SendPlanDowngradedEmail.php / SendPlanExpiredEmail.php / SendPlanSubscribedEmail.php / SendPlanUpgradedEmail.php

## Listener Purpose
Automated dispatchers for SaaS subscription lifecycle notifications.

## Risk Level
**MEDIUM**

## Problems Found

### Performance
- **RECURRING: N+1 Template Queries**: Every listener triggers a `EmailTemplate::where('key', ...)->first()` call. In a multi-tenant SaaS environment with thousands of renewals/subscriptions, this will create a significant database bottleneck.
- **Lazy Loading**: Attributes like `$subscription->plan->title` are frequently accessed without ensuring the `plan` relationship was eager-loaded in the event.

### Failure Handling
- **Missing Error Recovery**: These listeners do not implement a `failed()` method. If the `DynamicEmail` fails to dispatch (e.g., mail server down), the failure is logged by the worker but there is no specific logic to notify administrators or retry with a fallback.

## Suggested Refactors
- Implement a global `TemplateRepository` with caching.
- Eager load the `plan` relationship in the event constructors.

## Queue Safety
**SAFE**

## Production Ready
**NO**

---

# Event Audit: app/Events/PropertyBookingConfirmed.php

## Event Purpose
Signals a successful property booking to initiate confirmation workflows.

## Risk Level
**MEDIUM**

## Problems Found

### Architecture
- **Model Ambiguity**: Imports `App\Models\Booking` (L9). In the real estate vertical, property bookings reside in `PropertyBooking`. Using the generic `Booking` model likely breaks vertical-specific listeners or requires dangerous type-checking inside the listener.

## Production Ready
**NO**

---

# Event Audit: app/Events/ReviewReceived.php / ReviewRequested.php

## Event Purpose
Managing the reputation and feedback lifecycle of the marketplace.

## Risk Level
**LOW**

## Problems Found

### Code Quality
- **Polymorphic Safety**: Correctly utilizes `Illuminate\Database\Eloquent\Model` for the reviewable item, ensuring scalability across different verticals (Cars, Jobs, Products).

## Production Ready
**YES**

---

# Event Audit: app/Events/UserRegistered.php

## Event Purpose
Triggered after account creation to initiate onboarding.

## Risk Level
**LOW**

## Problems Found

### Code Quality
- **Boilerplate Debt**: The `broadcastOn` method (L34) contains default Laravel boilerplate code (`new PrivateChannel('channel-name')`). While harmless as the event doesn't implement `ShouldBroadcast`, it indicates a lack of final polish for a premium CodeCanyon product.

## Production Ready
**YES**

---

# Listener Audit: app/Listeners/SendBookingConfirmedEmail.php / SendReviewReceivedEmail.php / SendWelcomeEmail.php

## Listener Purpose
Automated onboarding and transactional confirmations.

## Risk Level
**MEDIUM**

## Problems Found

### Performance
- **RECURRING: N+1 Template Queries**: Consistent pattern of un-cached `EmailTemplate` lookups.

### Maintainability
- **Hardcoded Logic**: `SendBookingConfirmedEmail` hardcodes 'USD' (L57).
- **Hardcoded URLs**: `SendReviewReceivedEmail` uses hardcoded URL paths (L46).

## Suggested Refactors
- Standardize on `route()` helpers.
- Implement a `CurrencyService` to avoid hardcoding USD.

## Queue Safety
**SAFE**

## Production Ready
**NO**

---

# Overall Events & Listeners Audit Summary

## Security Score
4/10

## Scalability Score
6/10

## Queue Architecture Score
8/10

## Performance Score
5/10

## Maintainability Score
6/10

## Failure Handling Score
4/10

## Multi-Tenant Safety Score
7/10

## CodeCanyon Readiness
**NOT READY**

## Most Dangerous Events
- `NewMessageSent.php` (Public Channel Broadcasting)

## Most Dangerous Listeners
- All `Send...Email` listeners (Un-cached Template Queries)

## Queue Bottlenecks
- Synchronous database queries inside every queued job for templates.

## Event Storm Risks
- High volume chat systems using `NewMessageSent` will flood the database with template queries for every message notification.

## Critical Security Issues
- **Private Chat Eavesdropping**: `NewMessageSent` broadcasts on a public channel, allowing anyone to read private messages by subscribing to a conversation ID.

## Weak Architectures
- Hardcoded URLs and currencies in listeners.
- Model name collisions (`Subscription` vs `NewsletterSubscriber`).

## Suggested Queue Improvements
- Implement `TemplateCache` to reduce DB load by 100% per notification.
- Add `failed()` methods to important transactional listeners for error alerting.

## Suggested Refactors
- Migrate all broadcasting to `PrivateChannel`.
- Standardize model naming to avoid vertical collisions.

## Estimated Reviewer Outcome
**POSSIBLE REJECTION** (Security issue in chat broadcasting is a critical fail).
