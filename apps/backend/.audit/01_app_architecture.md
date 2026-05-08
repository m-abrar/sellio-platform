# 🛡️ App Architecture & Readiness Registry

## 📊 Platform Health Overview
**Current Status**: 🔴 **NOT PRODUCTION READY** (Critical Security & Performance Debt)
**Target**: CodeCanyon Elite Standard

| Layer | Score | Status | Primary Risk |
| :--- | :--- | :--- | :--- |
| **Business Logic (Services)** | **35/100** | 🔴 Critical | Webhook Spoofing / Double-Spend Race Conditions |
| **Data Layer (Models)** | **30/100** | 🔴 Critical | Financial Integrity / Moderation Bypasses |
| **Validation (Requests)** | **30/100** | 🔴 Critical | Systematic Multi-Tenant IDOR Vulnerabilities |
| **API Layer (Resources)** | **40/100** | 🔴 Critical | PII Leaks (SSN/Phone) / Forced N+1 Storms |
| **Control Layer (Controllers)** | **45/100** | 🟠 Warning | Price Manipulation / Mass Assignment Risks |

---

## 🛑 Critical Blockers (P0)
1. **Financial Fraud**: `PaypalGatewayService` lacks webhook signature verification.
2. **Identity Breach**: `UserResource` exposes user emails/phones/IDs to public API consumers.
3. **Data Theft**: Systematic IDOR in `Partner` requests allows unauthorized resource modification.
4. **Race Conditions**: `WalletService` and `CheckoutService` lack row-level database locks.

---

## Console Commands

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Console\Commands\CheckRenewals.php` | **98** | ✅ High Quality - Re-Audit Pending |

## Controllers

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Http\Controllers\AutoController.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\AutoInquiryController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\BlogController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\BrandController.php` | **80** | ✅ Good - Basic Logic |
| `app\Http\Controllers\CartController.php` | **90** | ✅ Elite - Service Based |
| `app\Http\Controllers\CategoryController.php` | **80** | ✅ Good - Basic Logic |
| `app\Http\Controllers\CheckoutController.php` | **30** | 🔴 Critical - Price Manipulation Risk |
| `app\Http\Controllers\ClassifiedController.php" | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Controller.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\ConversationController.php` | **75** | 🟠 Warning - Logic Debt |
| `app\Http\Controllers\EventBookingController.php` | **30** | 🔴 Critical - Price Manipulation Risk |
| `app\Http\Controllers\EventController.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\EventTicketController.php` | **90** | ✅ Elite - Production Ready |
| `app\Http\Controllers\HomeController.php` | **95** | ✅ Elite - Proxy Pattern |
| `app\Http\Controllers\JobApplicationController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\JobController.php` | **90** | ✅ Good - Scalability Risk |
| `app\Http\Controllers\OrderController.php` | **90** | ✅ Good - Service Based |
| `app\Http\Controllers\PageController.php` | **60** | 🟠 Warning - Stub Logic |
| `app\Http\Controllers\PartnerController.php` | **85** | ✅ Good - Proxy Pattern |
| `app\Http\Controllers\ProductController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\PropertyBookingController.php` | **65** | 🟠 Warning - IDOR Ownership Risk |
| `app\Http\Controllers\PropertyController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\PropertyVisitController.php` | **85** | ✅ Good - Service Extraction Opportunity |
| `app\Http\Controllers\ReviewController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\ServiceController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\TagController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\TypeController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\UnifiedHomeController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\WebhookController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Auth\SocialLoginController.php` | **75** | 🟠 Warning - Logic Debt |
| `app\Http\Controllers\Auth\RegisteredUserController.php` | **85** | ✅ Good - Service Extraction Opportunity |
| `app\Http\Controllers\Dashboard\DashboardRedirectController.php` | **90** | ✅ Elite - Logic Debt |
| `app\Http\Controllers\Dashboard\MediaController.php` | **10** | 🔴 Critical - RCE/Injection Risk |
| `app\Http\Controllers\Auth\AuthenticatedSessionController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Auth\ConfirmablePasswordController.php` | **90** | ✅ Good - Production Ready |
| `app\Http\Controllers\Auth\EmailVerificationNotificationController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Auth\EmailVerificationPromptController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Auth\LogoutController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Auth\NewPasswordController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Auth\PasswordController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Auth\PasswordResetLinkController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Auth\VerifyEmailController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\ActivityLogController.php` | **75** | 🟠 Warning - Logic Debt |
| `app\Http\Controllers\Admin\AddonController.php` | **85** | ✅ Good - Inline Validation |
| `app\Http\Controllers\Admin\AdvertisementController.php` | **90** | ✅ Elite - Logic Bloat |
| `app\Http\Controllers\Admin\AmenityController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\AutoController.php` | **72** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\AutoInquiryController.php` | **75** | 🟠 Warning - Scale Risk |
| `app\Http\Controllers\Admin\BlogController.php` | **85** | ✅ Good - Service Extraction Opportunity |
| `app\Http\Controllers\Admin\BookingController.php` | **75** | 🟠 Warning - Security Debt |
| `app\Http\Controllers\Admin\BookingLineItemController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\BrandController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\CategoryController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\ClassifiedController.php` | **95** | ✅ Elite - Service Extraction Opportunity |
| `app\Http\Controllers\Admin\ClassifiedInquiryController.php` | **75** | 🟠 Warning - Scale Risk |
| `app\Http\Controllers\Admin\ContentController.php` | **85** | ✅ Good - Performance/Validation Debt |
| `app\Http\Controllers\Admin\DashboardController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\EmailTemplateController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\EventBookingController.php` | **75** | 🟠 Warning - Scale Risk |
| `app\Http\Controllers\Admin\EventController.php` | **72** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\FeatureController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\GalleryController.php` | **95** | ✅ Elite - Logic Bloat |
| `app\Http\Controllers\Admin\JobApplicationController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\JobController.php` | **72** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\LineItemController.php` | **95** | ✅ Elite - Logic Bloat |
| `app\Http\Controllers\Admin\ListingController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\LocationController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\MenuController.php` | **85** | ✅ Good - Performance/Logic Debt |
| `app\Http\Controllers\Admin\NewsletterSubscriberController.php` | **70** | 🟠 Warning - Scale Risk |
| `app\Http\Controllers\Admin\NotificationController.php` | **85** | ✅ Good - Logic Bloat |
| `app\Http\Controllers\Admin\OrderController.php` | **70** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\PageBuilderController.php` | **72** | 🟠 Warning - Massive Logic Bloat |
| `app\Http\Controllers\Admin\PageController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\PaymentController.php` | **68** | 🟠 Warning - Rigid Polymorphism |
| `app\Http\Controllers\Admin\PaymentGatewayController.php` | **90** | ✅ Elite - Logic Bloat |
| `app\Http\Controllers\Admin\PermissionController.php` | **100** | ✅ Elite - Security Hardened |
| `app\Http\Controllers\Admin\PlanController.php` | **72** | 🟠 Warning - Logic Bloat |
| `app\Http\Controllers\Admin\ProductController.php` | **70** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\ProfileController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\PropertyBookingController.php` | **75** | 🟠 Warning - Scale Risk |
| `app\Http\Controllers\Admin\PropertyController.php` | **72** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\ReportController.php` | **68** | 🟠 Warning - Logic Bloat |
| `app\Http\Controllers\Admin\RoleController.php` | **90** | ✅ Elite - Security Hardened |
| `app\Http\Controllers\Admin\ServiceAppointmentController.php` | **75** | 🟠 Warning - Scale Risk |
| `app\Http\Controllers\Admin\ServiceController.php` | **72** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\ServiceQuoteController.php` | **85** | ✅ Good - Scale Risk |
| `app\Http\Controllers\Admin\SettingController.php` | **65** | 🟠 Warning - Logic Bloat |
| `app\Http\Controllers\Admin\SubscriptionController.php` | **72** | 🟠 Warning - Renewal Logic Debt |
| `app\Http\Controllers\Admin\SubscriptionQuotaController.php` | **85** | ✅ Good - ServiceExtraction |
| `app\Http\Controllers\Admin\SystemController.php` | **75** | 🟠 Warning - Policy Debt |
| `app\Http\Controllers\Admin\TagController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\ThemeController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\TypeController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\UserController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\WithdrawalController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\TransactionController.php` | **65** | 🟠 Warning - Scale Risk |
| `app\Http\Controllers\Api\ApiApplicationController.php` | **85** | ✅ Good - Resource Debt |
| `app\Http\Controllers\Api\ApiThemeController.php" | **85** | ✅ Good - Resource Debt |
| `app\Http\Controllers\Api\TicketController.php` | **78** | 🟠 Warning - Protocol Debt |
| `app\Http\Controllers\Api\V1\ApiAmenityController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\ApiAutoController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Api\V1\ApiBlogController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\ApiBrandController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\ApiCartController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Api\V1\ApiCategoryController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\ApiClassifiedController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Api\V1\ApiEventController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Api\V1\ApiFeatureController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\ApiJobController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Api\V1\ApiLocationController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\ApiOrderController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\ApiProductController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Api\V1\ApiPropertyController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\ApiServiceController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Api\V1\Auth\PasswordResetController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Auth\ProfileController.php` | **85** | ✅ Good - Resource Debt |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\AnalyticsController.php` | **40** | 🔴 Critical - Performance / Fat Controller |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\DashboardController.php` | **80** | ✅ Good - Trait Debt |
| `app\Http\Controllers\Api\V1\Dashboard\User\DashboardController.php` | **85** | ✅ Good - Response Inconsistency |
| `app\Http\Controllers\Api\V1\ApiTagController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\ApiTypeController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Auth\AuthController.php` | **40** | 🔴 Critical - Privilege Escalation Risk |
| `app\Http\Controllers\Api\V1\Auth\PasswordResetController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Auth\ProfileController.php` | **88** | ✅ Elite - Resource Debt |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ActivityController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\AnalyticsController.php` | **45** | 🔴 Critical - Severe Logic Bloat |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\AutoController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\AutoInquiryController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ClassifiedController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ClassifiedInquiryController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\DashboardController.php` | **75** | 🟠 Warning - Trait Debt |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\EventBookingController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\EventController.php` | **90** | ✅ Good - Service Extraction Opportunity |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\JobApplicationController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\JobListingController.php` | **90** | ✅ Good - Service Extraction Opportunity |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\MessageController.php` | **90** | ✅ Good - Resource Debt |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\PaymentController.php" | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\PlanController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ProductController.php` | **90** | ✅ Good - Service Extraction Opportunity |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ProfileController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\PropertyBookingController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\PropertyController.php` | **90** | ✅ Good - Media Logic Debt |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\PropertyVisitController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ReviewController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ServiceAppointmentController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ServiceController.php` | **90** | ✅ Good - Service Extraction Opportunity |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ServiceQuoteController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\SubscriptionController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\WalletController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\WithdrawalController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\AutoInquiryController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\BookingController.php` | **85** | ✅ Good - Performance Risk |
| `app\Http\Controllers\Api\V1\Dashboard\User\ClassifiedInquiryController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\DashboardController.php` | **85** | ✅ Good - Response Inconsistency |
| `app\Http\Controllers\Api\V1\Dashboard\User\EventBookingController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\FavoriteController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Dashboard\User\JobApplicationController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\MessageController.php` | **90** | ✅ Good - Resource Debt |
| `app\Http\Controllers\Api\V1\Dashboard\User\PaymentController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\PropertyBookingController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\ReviewController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\ServiceAppointmentController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\ServiceQuoteController.php` | **95** | ✅ Elite - Production Ready |

## Events

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Events\BookingCancelled.php` | **85** | ✅ Good - Context Debt |
| `app\Events\EventTicketPurchased.php` | **60** | 🟠 Warning - Model Ambiguity |
| `app\Events\JobApplicationReceived.php` | **70** | 🟠 Warning - Model Inconsistency |
| `app\Events\ListingApproved.php` | **75** | 🟠 Warning - Presentation Debt |
| `app\Events\ListingRejected.php` | **75** | 🟠 Warning - Presentation Debt |
| `app\Events\NewListingLead.php` | **90** | ✅ Good - Production Ready |
| `app\Events\NewMessageSent.php` | **10** | 🔴 Critical - Public Broadcasting Risk |
| `app\Events\NewsletterOptinAttempted.php` | **60** | 🟠 Warning - Model Name Collision |
| `app\Events\NewsletterSubscriptionConfirmed.php` | **60** | 🟠 Warning - Model Name Collision |
| `app\Events\PaymentFailed.php` | **85** | ✅ Good - Failure Context Debt |
| `app\Events\PlanAboutToExpire.php` | **95** | ✅ Elite - Production Ready |
| `app\Events\PlanDowngraded.php` | **95** | ✅ Elite - Production Ready |
| `app\Events\PlanExpired.php` | **95** | ✅ Elite - Production Ready |
| `app\Events\PlanSubscribed.php` | **95** | ✅ Elite - Production Ready |
| `app\Events\PlanUpgraded.php` | **95** | ✅ Elite - Production Ready |
| `app\Events\PropertyBookingConfirmed.php` | **60** | 🟠 Warning - Model Ambiguity |
| `app\Events\ReviewReceived.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Events\ReviewRequested.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Events\UserRegistered.php` | **85** | ✅ Good - Boilerplate Debt |

## Listeners

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Listeners\SendBookingCancelledEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendBookingConfirmedEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendEventTicketEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendJobApplicationReceivedEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendListingApprovedEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendListingRejectedEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendNewListingLeadEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendNewsletterWelcomeEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendOptinConfirmationEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendPaymentFailedEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendPlanDowngradedEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendPlanExpiredEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendPlanSubscribedEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendPlanUpgradedEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendRenewalReminderEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendReviewReceivedEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendReviewRequestEmail.php` | **55** | 🟠 Warning - N+1 Template Query |
| `app\Listeners\SendWelcomeEmail.php` | **55** | 🟠 Warning - N+1 Template Query |

| `app\Mail\DynamicEmail.php` | **98** | ✅ High Quality - Re-Audit Pending |

## Middlewares

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Http\Middleware\CheckBuiltInWebsiteStatus.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Middleware\CheckModuleEnabled.php` | **98** | ✅ High Quality - Re-Audit Pending |

## Models

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Models\Advertisement.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\Amenity.php` | **85** | ✅ Good - Column Sprawl |
| `app\Models\Application.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\Auto.php` | **45** | 🟠 Warning - Moderation Bypass Risk |
| `app\Models\AutoInquiry.php` | **85** | ✅ Good - Response Privacy |
| `app\Models\Blog.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\Brand.php` | **70** | 🟠 Warning - N+1 Count Risk |
| `app\Models\Campaign.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\Cart.php` | **40** | 🔴 Critical - Total Manipulation Risk |
| `app\Models\CartItem.php` | **40** | 🔴 Critical - Price Manipulation Risk |
| `app\Models\Category.php` | **65** | 🟠 Warning - N+1 / Recursive Debt |
| `app\Models\Classified.php` | **45** | 🟠 Warning - Moderation Bypass Risk |
| `app\Models\ClassifiedInquiry.php` | **85** | ✅ Good - Response Privacy |
| `app\Models\Conversation.php` | **95** | ✅ Elite - Production Ready |
| `app\Models\EmailTemplate.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\Event.php` | **45** | 🟠 Warning - Moderation Bypass Risk |
| `app\Models\EventBooking.php` | **20** | 🔴 Critical - Financial Fraud Risk |
| `app\Models\EventOccurrence.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\EventOccurrenceTicket.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\EventTicketType.php` | **85** | ✅ Good - Pricing Exposure |
| `app\Models\Favorite.php` | **60** | 🟠 Warning - Scalability Bottleneck |
| `app\Models\Feature.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\Gallery.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\GatewayCredential.php` | **100** | ✅ Elite - Security Hardened |
| `app\Models\GatewayFieldBlueprint.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\JobApplication.php` | **85** | ✅ Good - Status Exposure |
| `app\Models\JobListing.php` | **45** | 🟠 Warning - Moderation Bypass Risk |
| `app\Models\Location.php` | **65** | 🟠 Warning - N+1 Count Risk |
| `app\Models\Menu.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\MenuItem.php` | **75** | 🟠 Warning - Stored XSS Risk |
| `app\Models\Message.php` | **30** | 🔴 Critical - User Impersonation Risk |
| `app\Models\NewsletterSubscriber.php` | **85** | ✅ Good - Confirmation Bypass |
| `app\Models\Order.php` | **20** | 🔴 Critical - Financial Ledger Risk |
| `app\Models\OrderItem.php` | **20** | 🔴 Critical - Price Manipulation Risk |
| `app\Models\Page.php` | **60** | 🟠 Warning - Stored XSS Risk |
| `app\Models\PageContent.php` | **60** | 🟠 Warning - Stored XSS Risk |
| `app\Models\Payment.php` | **20** | 🔴 Critical - Financial Ledger Risk |
| `app\Models\PaymentGateway.php` | **85** | ✅ Good - N+1 Config Risk |
| `app\Models\Plan.php` | **85** | ✅ Good - Pricing Exposure |
| `app\Models\Product.php` | **45** | 🟠 Warning - Moderation Bypass Risk |
| `app\Models\ProductAddon.php` | **45** | 🟠 Warning - Price Manipulation Risk |
| `app\Models\ProductAttribute.php` | **45** | 🟠 Warning - Price Manipulation Risk |
| `app\Models\Property.php` | **45** | 🟠 Warning - Moderation Bypass Risk |
| `app\Models\PropertyAddon.php` | **45** | 🟠 Warning - Price Manipulation Risk |
| `app\Models\PropertyBooking.php` | **25** | 🔴 Critical - Financial Fraud / N+1 Risk |
| `app\Models\PropertyFee.php" | **85** | ✅ Good - Pricing Exposure |
| `app\Models\PropertyNeighborhood.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\PropertyScore.php` | **85** | ✅ Good - Score Exposure |
| `app\Models\PropertyVisit.php` | **85** | ✅ Good - Status Exposure |
| `app\Models\Review.php` | **30** | 🔴 Critical - Self-Approval Vulnerability |
| `app\Models\SeasonalPrice.php` | **85** | ✅ Good - Pricing Exposure |
| `app\Models\Service.php` | **45** | 🟠 Warning - Moderation Bypass Risk |
| `app\Models\ServiceAppointment.php` | **85** | ✅ Good - Status Exposure |
| `app\Models\ServicePackage.php` | **85** | ✅ Good - Pricing Exposure |
| `app\Models\ServiceQuote.php` | **30** | 🔴 Critical - Quote Hijacking Risk |
| `app\Models\Setting.php` | **70** | 🟠 Warning - XSS Risk |
| `app\Models\Subscription.php` | **20** | 🔴 Critical - Access Theft Risk |
| `app\Models\Tag.php` | **65** | 🟠 Warning - N+1 Count Risk |
| `app\Models\Theme.php` | **65** | 🟠 Warning - Stored XSS Risk |
| `app\Models\Ticket.php` | **80** | ✅ Good - Priority Escalation Risk |
| `app\Models\TicketMessage.php` | **30** | 🔴 Critical - User Impersonation Risk |
| `app\Models\TransactionLine.php` | **25** | 🔴 Critical - Ledger Corruption Risk |
| `app\Models\Type.php` | **65** | 🟠 Warning - N+1 Count Risk |
| `app\Models\User.php` | **30** | 🔴 Critical - Privilege Escalation Risk |
| `app\Models\Withdrawal.php` | **20** | 🔴 Critical - Financial Theft Risk |
| `app\Traits\Models\HasMarketplaceMetrics.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Traits\Models\HasStatusModeration.php` | **98** | ✅ High Quality - Re-Audit Pending |

## Notifications

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Notifications\ContentFlagged.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Notifications\NewPropertySubmitted.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Notifications\OrderStatusChanged.php` | **98** | ✅ High Quality - Re-Audit Pending |

## Observers

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Observers\CartItemObserver.php` | **98** | ✅ High Quality - Re-Audit Pending |

## Others

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\helpers.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Contracts\PaymentGatewayService.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\DTOs\ContentResult.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Jobs\RegenerateMediaJob.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Menu\Filters\ModuleFilter.php` | **98** | ✅ High Quality - Re-Audit Pending |

## Policies

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Policies\ThemePolicy.php` | **98** | ✅ High Quality - Re-Audit Pending |

## Providers

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Providers\AppServiceProvider.php` | **98** | ✅ High Quality - Re-Audit Pending |

## Requests

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Http\Requests\CalculateLodgingPriceRequest.php` | **65** | 🟠 Warning - Chronological Gap |
| `app\Http\Requests\CalculatePriceRequest.php` | **60** | 🟠 Warning - Floating ID Risk |
| `app\Http\Requests\JobApplicationStoreRequest.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Requests\ProcessPaymentRequest.php` | **20** | 🔴 Critical - Auth/PCI Gap |
| `app\Http\Requests\ProfileUpdateRequest.php` | **30** | 🔴 Critical - Missing Auth |
| `app\Http\Requests\SaveProductRequest.php` | **25** | 🔴 Critical - IDOR Risk |
| `app\Http\Requests\SearchAutoRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\SearchBlogRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\SearchProductRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\SearchPropertyRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\SendContactRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\SendMessageRequest.php` | **20** | 🔴 Critical - Global Access Risk |
| `app\Http\Requests\StoreAppointmentRequest.php` | **45** | 🟠 Warning - Integrity Debt |
| `app\Http\Requests\StoreAutoInquiryRequest.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Requests\StoreConsultationRequest.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Requests\StoreEventBookingRequest.php` | **30** | 🔴 Critical - IDOR / Data Risk |
| `app\Http\Requests\StorePropertyBookingRequest.php` | **30** | 🔴 Critical - IDOR / Data Risk |
| `app\Http\Requests\StoreQuoteRequest.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Requests\StoreReviewRequest.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Requests\UpdateBookingDetailsRequest.php` | **35** | 🔴 Critical - Unsafe Auth |
| `app\Http\Requests\Admin\AdvertisementRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Admin\AmenityRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Admin\AutoRequest.php` | **90** | ✅ Good - Validation Debt |
| `app\Http\Requests\Admin\BrandRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Admin\CategoryRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Admin\ClassifiedRequest.php` | **90** | ✅ Good - Validation Debt |
| `app\Http\Requests\Admin\EventRequest.php` | **90** | ✅ Good - Validation Debt |
| `app\Http\Requests\Admin\FeatureRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Admin\JobListingRequest.php` | **90** | ✅ Good - Validation Debt |
| `app\Http\Requests\Admin\LocationRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Admin\ProductRequest.php` | **90** | ✅ Good - Validation Debt |
| `app\Http\Requests\Admin\PropertyRequest.php` | **90** | ✅ Good - Validation Debt |
| `app\Http\Requests\Admin\ServiceRequest.php` | **90** | ✅ Good - Validation Debt |
| `app\Http\Requests\Admin\TagRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Admin\TypeRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Admin\UserStoreRequest.php` | **95** | ✅ Elite - Safe Roles |
| `app\Http\Requests\Admin\Tickets\ReplyTicketRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Admin\Tickets\UpdateTicketStatusRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Api\Tickets\ReplyTicketRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Api\Tickets\StoreTicketRequest.php` | **85** | ✅ Good - Priority Escalation |
| `app\Http\Requests\Auth\LoginRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Auth\RegisterRequest.php` | **98** | ✅ Elite - Safe Roles |
| `app\Http\Requests\Auth\ResetPasswordRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Auth\SendResetLinkEmailRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Auth\UpdatePasswordRequest.php` | **90** | ✅ Good - Proof Verification Debt |
| `app\Http\Requests\Auth\UpdateProfileRequest.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Requests\Dashboard\User\UpdateProfileRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Dashboard\User\UpdateReviewRequest.php` | **40** | 🔴 Critical - Self-Edit IDOR |
| `app\Http\Requests\Partner\AutoRequest.php` | **15** | 🔴 Critical - Multi-Tenant IDOR |
| `app\Http\Requests\Partner\ClassifiedRequest.php` | **15** | 🔴 Critical - Multi-Tenant IDOR |
| `app\Http\Requests\Partner\EventRequest.php` | **15** | 🔴 Critical - Multi-Tenant IDOR |
| `app\Http\Requests\Partner\JobListingRequest.php` | **15** | 🔴 Critical - Multi-Tenant IDOR |
| `app\Http\Requests\Partner\ProcessWithdrawalRequest.php` | **20** | 🔴 Critical - Financial IDOR |
| `app\Http\Requests\Partner\ProfileUpdateRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\Partner\ServiceRequest.php` | **15** | 🔴 Critical - Multi-Tenant IDOR |
| `app\Http\Requests\Partner\StorePropertyRequest.php` | **85** | ✅ Good - Validation Debt |
| `app\Http\Requests\Partner\StoreSubscriptionRequest.php` | **30** | 🔴 Critical - Unsafe Access |
| `app\Http\Requests\Partner\UpdatePropertyRequest.php` | **15** | 🔴 Critical - Multi-Tenant IDOR |

## Resources

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Http\Resources\AmenityResource.php` | **90** | ✅ Good - Performance Debt |
| `app\Http\Resources\AutoInquiryResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\AutoResource.php` | **30** | 🔴 Critical - N+1 Storm & VIN Leak |
| `app\Http\Resources\BlogResource.php` | **50** | 🟠 Warning - Typos & Payload Debt |
| `app\Http\Resources\BrandResource.php` | **90** | ✅ Good - Performance Debt |
| `app\Http\Resources\CartItemResource.php` | **40** | 🔴 Critical - Forced N+1 |
| `app\Http\Resources\CartResource.php` | **85** | ✅ Good - Efficiency Debt |
| `app\Http\Resources\CategoryResource.php` | **95** | ✅ Elite - Recursive Safe |
| `app\Http\Resources\ClassifiedInquiryResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\ClassifiedResource.php` | **30** | 🔴 Critical - N+1 Storm |
| `app\Http\Resources\EventBookingResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\EventResource.php` | **30** | 🔴 Critical - N+1 & Dynamic Aggregates |
| `app\Http\Resources\FavoriteResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\FeatureResource.php` | **90** | ✅ Good - Performance Debt |
| `app\Http\Resources\JobApplicationResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\JobListingResource.php` | **30** | 🔴 Critical - N+1 Storm |
| `app\Http\Resources\LocationResource.php` | **90** | ✅ Good - Performance Debt |
| `app\Http\Resources\MessageResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\OrderItemResource.php` | **40** | 🔴 Critical - Forced N+1 |
| `app\Http\Resources\OrderResource.php` | **40** | 🔴 Critical - Forced N+1 & Privacy |
| `app\Http\Resources\PaymentResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\PlanResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\ProductResource.php` | **30** | 🔴 Critical - N+1 Storm & Internal Leak |
| `app\Http\Resources\PropertyBookingResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\PropertyResource.php` | **65** | 🟠 Warning - Mixed N+1 Adoption |
| `app\Http\Resources\PropertyVisitResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\ReviewResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\ServiceAppointmentResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\ServiceQuoteResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\ServiceResource.php` | **30** | 🔴 Critical - N+1 Storm |
| `app\Http\Resources\SubscriptionResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\TagResource.php` | **90** | ✅ Good - Performance Debt |
| `app\Http\Resources\TicketMessageResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\TicketResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\TransactionResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\TypeResource.php` | **90** | ✅ Good - Performance Debt |
| `app\Http\Resources\UserResource.php` | **10** | 🔴 Critical - Unprotected PII Leak |

## Services

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Services\ActivityService.php` | **25** | 🔴 Critical - Database Hammer |
| `app\Services\AmenityService.php` | **95** | ✅ Good - Standard |
| `app\Services\AutoInquiryService.php` | **95** | ✅ Good - Standard |
| `app\Services\AutoService.php` | **95** | ✅ Good - Standard |
| `app\Services\BlogService.php` | **95** | ✅ Good - Standard |
| `app\Services\BrandService.php` | **95** | ✅ Good - Standard |
| `app\Services\CartService.php` | **90** | ✅ Good - Minor Efficiency |
| `app\Services\CategoryService.php` | **95** | ✅ Good - Standard |
| `app\Services\CheckoutService.php` | **40** | 🔴 Critical - Stock Race Condition |
| `app\Services\ClassifiedManagementService.php` | **40** | 🔴 Critical - Memory Bloat Pagination |
| `app\Services\ContentService.php` | **55** | 🟠 Warning - Admin Query Explosion |
| `app\Services\EventBookingService.php` | **95** | ✅ Good - Standard |
| `app\Services\EventService.php` | **35** | 🔴 Critical - In-Memory Bottleneck |
| `app\Services\FeatureService.php` | **95** | ✅ Good - Standard |
| `app\Services\GatewayManager.php` | **100** | ✅ Elite - Strategy Pattern |
| `app\Services\HomeDataService.php` | **85** | ✅ Good - Missing Cache |
| `app\Services\JobManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\LocationService.php` | **95** | ✅ Good - Standard |
| `app\Services\MenuService.php` | **100** | ✅ Elite - Cache Strategy |
| `app\Services\PartnerBonusService.php` | **95** | ✅ Good - Standard |
| `app\Services\PaypalGatewayService.php` | **10** | 🔴 Critical - Fraud Risk (No Webhook Verification) |
| `app\Services\ProductService.php` | **95** | ✅ Elite - Efficient Pricing |
| `app\Services\PropertyService.php` | **45** | 🔴 Critical - Search-Time N+1 |
| `app\Services\ReviewManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\ServiceManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\StripeGatewayService.php` | **98** | ✅ Elite - High Security |
| `app\Services\SubscriptionService.php` | **95** | ✅ Good - Standard |
| `app\Services\TagService.php` | **95** | ✅ Good - Standard |
| `app\Services\TypeService.php` | **95** | ✅ Good - Standard |
| `app\Services\WalletService.php` | **25** | 🔴 Critical - Double-Spend Risk |
| `app\Services\Admin\AmenityManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\BookingManagementService.php` | **100** | ✅ Elite - Unified Hydration |
| `app\Services\Admin\BrandManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\CategoryManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\DashboardService.php` | **20** | 🔴 Critical - God Service Bottleneck |
| `app\Services\Admin\FeatureManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\ListingQueryService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\LocationManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\TagManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\TicketManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\TypeManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\UserManagementService.php` | **100** | ✅ Elite - Identity Security |
| `app\Services\Partner\AutoService.php` | **95** | ✅ Good - Standard |
| `app\Services\Partner\ClassifiedService.php` | **95** | ✅ Good - Standard |
| `app\Services\Partner\EventBookingService.php` | **95** | ✅ Good - Standard |
| `app\Services\Partner\EventService.php` | **95** | ✅ Good - Standard |
| `app\Services\Partner\JobListingService.php` | **95** | ✅ Good - Standard |
| `app\Services\Partner\ProfileService.php` | **95** | ✅ Good - Standard |
| `app\Services\Partner\PropertyService.php` | **95** | ✅ Good - Standard |
| `app\Services\Partner\PropertyVisitService.php` | **95** | ✅ Good - Standard |
| `app\Services\Partner\ReviewService.php` | **95** | ✅ Good - Standard |
| `app\Services\Partner\ServiceService.php` | **95** | ✅ Good - Standard |

## Traits

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Traits\ApiResponseTrait.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Traits\HasAnalytics.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Traits\HasBookingAttributes.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Traits\HasImageAccess.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Traits\ManagesApproval.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Traits\Subscribable.php` | **98** | ✅ High Quality - Re-Audit Pending |

## View Components

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\View\Components\AppLayout.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\View\Components\GuestLayout.php` | **98** | ✅ High Quality - Re-Audit Pending |
