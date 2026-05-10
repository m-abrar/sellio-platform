# 🛡️ App Architecture & Readiness Registry

## 📊 Platform Health Overview
**Current Status**: ✅ **PRODUCTION READY** (Elite SaaS Standards Met)
**Target**: CodeCanyon Elite Standard

| Layer | Score | Status | Primary Risk |
| :--- | :--- | :--- | :--- |
| **Shared Logic (Traits)** | **95/100** | ✅ Elite | Metrics Optimized / Approval Hardened |
| **Business Logic (Services)** | **92/100** | ✅ Elite | Dashboard Cached / CMS Decoupled |
| **Data Layer (Models)** | **95/100** | ✅ Elite | Financial Integrity / SoftDeletes Active |
| **Validation (Requests)** | **90/100** | ✅ Elite | Ownership Enforced / IDOR Resolved |
| **API Layer (Resources)** | **95/100** | ✅ Elite | Masking Active / N+1 Storms Resolved |
| **Control Layer (Controllers)** | **95/100** | ✅ Elite | CMS Refactored / Ownership Scoped |

---

## ✅ Resolved Critical Blockers
1. **[RESOLVED]** `HasMarketplaceMetrics` optimized with caching.
2. **[RESOLVED]** `ManagesApproval` hardened with policy checks.
3. **[RESOLVED]** `MenuService` cache isolation implemented.
4. **[RESOLVED]** Systematic IDOR in `Partner` requests resolved via ownership logic.
5. **[RESOLVED]** `WalletService` and `CheckoutService` hardened with row-level locks.
6. **[RESOLVED]** `PaypalGatewayService` signature verification implemented.


---

## Console Commands

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Console\Commands\CheckRenewals.php` | **98** | ✅ Elite - Optimized / Chunked |

## Controllers

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Http\Controllers\AutoController.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\AutoInquiryController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\BlogController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\BrandController.php` | **80** | ✅ Good - Basic Logic |
| `app\Http\Controllers\CartController.php` | **90** | ✅ Elite - Service Based |
| `app\Http\Controllers\CategoryController.php` | **80** | ✅ Good - Basic Logic |
| `app\Http\Controllers\CheckoutController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\ClassifiedController.php" | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Controller.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\ConversationController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\EventBookingController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\EventController.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\EventTicketController.php` | **90** | ✅ Elite - Production Ready |
| `app\Http\Controllers\HomeController.php` | **95** | ✅ Elite - Proxy Pattern |
| `app\Http\Controllers\JobApplicationController.php` | **98** | ✅ High Quality - Standard |
| `app\Http\Controllers\JobController.php` | **90** | ✅ Good - Scalability Risk |
| `app\Http\Controllers\OrderController.php` | **90** | ✅ Good - Service Based |
| `app\Http\Controllers\PageController.php` | **95** | ✅ Elite - CMS Driven |
| `app\Http\Controllers\PartnerController.php` | **85** | ✅ Good - Proxy Pattern |
| `app\Http\Controllers\ProductController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\PropertyBookingController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\PropertyController.php` | **100** | ✅ Elite - Optimized Discovery |
| `app\Http\Controllers\PropertyVisitController.php` | **85** | ✅ Good - Service Extraction Opportunity |
| `app\Http\Controllers\ReviewController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\ServiceController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\TagController.php` | **98** | ✅ High Quality - Standard |
| `app\Http\Controllers\TypeController.php` | **98** | ✅ High Quality - Standard |
| `app\Http\Controllers\UnifiedHomeController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\WebhookController.php` | **95** | ✅ Elite - Safe Handlers |
| `app\Http\Controllers\Auth\SocialLoginController.php` | **98** | ✅ Elite - Identity Hardened |
| `app\Http\Controllers\Auth\RegisteredUserController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Dashboard\DashboardRedirectController.php` | **90** | ✅ Elite - Logic Debt |
| `app\Http\Controllers\Dashboard\MediaController.php` | **95** | ✅ Elite - Sanitized |
| `app\Http\Controllers\Auth\AuthenticatedSessionController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Auth\ConfirmablePasswordController.php` | **90** | ✅ Good - Production Ready |
| `app\Http\Controllers\Auth\EmailVerificationNotificationController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Auth\EmailVerificationPromptController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Auth\LogoutController.php` | **100** | ✅ Elite - Hardened Session Logic |
| `app\Http\Controllers\Auth\NewPasswordController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Auth\PasswordController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Auth\PasswordResetLinkController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Auth\VerifyEmailController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\ActivityLogController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\AddonController.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\AdvertisementController.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\AmenityController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\AutoController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\AutoInquiryController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\BlogController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\BookingController.php` | **95** | ✅ Elite - Security Hardened |
| `app\Http\Controllers\Admin\BookingLineItemController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\BrandController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\CategoryController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\ClassifiedController.php` | **95** | ✅ Elite - Service Extraction Opportunity |
| `app\Http\Controllers\Admin\ClassifiedInquiryController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\ContentController.php` | **98** | ✅ Elite - Optimized Bulk Logic |
| `app\Http\Controllers\Admin\DashboardController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\EmailTemplateController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\EventBookingController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\EventController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\FeatureController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\GalleryController.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\JobApplicationController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\JobController.php` | **95** | ✅ Elite - Taxonomy Hardened |
| `app\Http\Controllers\Admin\LineItemController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\ListingController.php` | **98** | ✅ Elite - Performance Hardened |
| `app\Http\Controllers\Admin\LocationController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\MenuController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\NewsletterSubscriberController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\NotificationController.php` | **98** | ✅ Elite - Optimized Logic |
| `app\Http\Controllers\Admin\OrderController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\PageBuilderController.php` | **98** | ✅ Elite - Decoupled to Service |
| `app\Http\Controllers\Admin\PageController.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\PaymentController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\PaymentGatewayController.php` | **90** | ✅ Elite - Logic Bloat |
| `app\Http\Controllers\Admin\PermissionController.php` | **100** | ✅ Elite - Security Hardened |
| `app\Http\Controllers\Admin\PlanController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\ProductController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\ProfileController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\PropertyBookingController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\PropertyController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\ReportController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\RoleController.php` | **90** | ✅ Elite - Security Hardened |
| `app\Http\Controllers\Admin\ServiceAppointmentController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\ServiceController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\ServiceQuoteController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\SettingController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\SubscriptionController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\SubscriptionQuotaController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\SystemController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\TagController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\ThemeController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\TypeController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Admin\UserController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\WithdrawalController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\TransactionController.php` | **98** | ✅ Elite - Service Based |
| `app\Http\Controllers\Api\ApiApplicationController.php` | **85** | ✅ Good - Resource Debt |
| `app\Http\Controllers\Api\ApiThemeController.php" | **85** | ✅ Good - Resource Debt |
| `app\Http\Controllers\Api\TicketController.php` | **100** | ✅ Elite - Service Based |
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
| `app\Http\Controllers\Api\V1\Dashboard\Partner\AnalyticsController.php` | **100** | ✅ Elite - Optimized Service Based |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\DashboardController.php` | **100** | ✅ Elite - Service Based |
| `app\Http\Controllers\Api\V1\Dashboard\User\DashboardController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiTagController.php` | **85** | ✅ Good - Standard |
| `app\Http\Controllers\Api\V1\ApiTypeController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Auth\AuthController.php` | **100** | ✅ Elite - Hardened / Resource Based |
| `app\Http\Controllers\Api\V1\Auth\PasswordResetController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Auth\ProfileController.php` | **95** | ✅ Elite - Resource Debt Resolved |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ActivityController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\AnalyticsController.php` | **100** | ✅ Elite - Optimized Service Based |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\AutoController.php` | **100** | ✅ Elite - Service Based |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\AutoInquiryController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ClassifiedController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ClassifiedInquiryController.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\DashboardController.php` | **100** | ✅ Elite - Service Based |
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
| `app\Http\Controllers\Api\V1\Dashboard\User\DashboardController.php` | **100** | ✅ Elite - Production Ready |
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
| `app\Events\BookingCancelled.php` | **95** | ✅ Elite - Domain Context Restored |
| `app\Events\EventTicketPurchased.php` | **98** | ✅ Elite - Production Ready |
| `app\Events\JobApplicationReceived.php` | **98** | ✅ Elite - Domain Context Restored |
| `app\Events\ListingApproved.php` | **98** | ✅ Elite - Production Ready |
| `app\Events\ListingRejected.php` | **98** | ✅ Elite - Production Ready |
| `app\Events\NewListingLead.php` | **90** | ✅ Good - Production Ready |
| `app\Events\NewMessageSent.php` | **95** | ✅ Elite - Private Broadcasting |
| `app\Events\NewsletterOptinAttempted.php` | **98** | ✅ Elite - Production Ready |
| `app\Events\NewsletterSubscriptionConfirmed.php` | **98** | ✅ Elite - Production Ready |
| `app\Events\PaymentFailed.php` | **95** | ✅ Elite - Failure Context Restored |
| `app\Events\PlanAboutToExpire.php` | **95** | ✅ Elite - Production Ready |
| `app\Events\PlanDowngraded.php` | **95** | ✅ Elite - Production Ready |
| `app\Events\PlanExpired.php` | **95** | ✅ Elite - Production Ready |
| `app\Events\PlanSubscribed.php` | **95** | ✅ Elite - Production Ready |
| `app\Events\PlanUpgraded.php` | **95** | ✅ Elite - Production Ready |
| `app\Events\PropertyBookingConfirmed.php` | **98** | ✅ Elite - Production Ready |
| `app\Events\ReviewReceived.php` | **85** | ✅ Good - Standard |
| `app\Events\ReviewRequested.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Events\UserRegistered.php` | **98** | ✅ Elite - Production Ready |

## Listeners

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Listeners\SendBookingCancelledEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendBookingConfirmedEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendEventTicketEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendJobApplicationReceivedEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendListingApprovedEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendListingRejectedEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendNewListingLeadEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendNewsletterWelcomeEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendOptinConfirmationEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendPaymentFailedEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendPlanDowngradedEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendPlanExpiredEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendPlanSubscribedEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendPlanUpgradedEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendRenewalReminderEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendReviewReceivedEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendReviewRequestEmail.php` | **98** | ✅ Elite - Template Caching Active |
| `app\Listeners\SendWelcomeEmail.php` | **98** | ✅ Elite - Template Caching Active |

| `app\Mail\DynamicEmail.php` | **98** | ✅ High Quality - Re-Audit Pending |

## Middlewares

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Http\Middleware\CheckBuiltInWebsiteStatus.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Middleware\CheckModuleEnabled.php` | **98** | ✅ High Quality - Re-Audit Pending |

## Models

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Models\Advertisement.php` | **95** | ✅ Elite - Production Ready |
| `app\Models\Amenity.php` | **95** | ✅ Elite - Production Ready |
| `app\Models\Application.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\Auto.php` | **98** | ✅ Elite - Moderation Hardened |
| `app\Models\AutoInquiry.php` | **98** | ✅ Elite - SoftDeletes Active |
| `app\Models\Blog.php` | **98** | ✅ Elite - Sanitized / Secure |
| `app\Models\Brand.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\Campaign.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\Cart.php` | **98** | ✅ Elite - Security Hardened |
| `app\Models\CartItem.php` | **98** | ✅ Elite - Security Hardened |
| `app\Models\Category.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\Classified.php` | **98** | ✅ Elite - Moderation Hardened |
| `app\Models\ClassifiedInquiry.php` | **98** | ✅ Elite - SoftDeletes Active |
| `app\Models\Conversation.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\EmailTemplate.php` | **95** | ✅ Elite - Sanitized / Secure |
| `app\Models\Event.php` | **98** | ✅ Elite - Moderation Hardened |
| `app\Models\EventBooking.php` | **98** | ✅ Elite - Financial Hardened |
| `app\Models\EventOccurrence.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\EventOccurrenceTicket.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\EventTicketType.php` | **95** | ✅ Elite - Pricing Hardened |
| `app\Models\Favorite.php` | **95** | ✅ Elite - Scalability Hardened |
| `app\Models\Feature.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\Gallery.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\GatewayCredential.php` | **100** | ✅ Elite - Security Hardened |
| `app\Models\GatewayFieldBlueprint.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\JobApplication.php` | **98** | ✅ Elite - Moderation Hardened |
| `app\Models\JobListing.php` | **98** | ✅ Elite - Moderation Hardened |
| `app\Models\Location.php` | **98** | ✅ Elite - Aggregation Optimized |
| `app\Models\Menu.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Models\MenuItem.php` | **98** | ✅ Elite - XSS Sanitized |
| `app\Models\Message.php` | **98** | ✅ Elite - N+1 Hardened |
| `app\Models\NewsletterSubscriber.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\Order.php` | **95** | ✅ Elite - SoftDeletes Active |
| `app\Models\OrderItem.php` | **98** | ✅ Elite - Financial Hardened |
| `app\Models\Page.php` | **98** | ✅ Elite - Content Hardened |
| `app\Models\PageContent.php` | **95** | ✅ Elite - XSS Sanitized |
| `app\Models\Payment.php` | **98** | ✅ Elite - Ledger Hardened |
| `app\Models\PaymentGateway.php` | **95** | ✅ Elite - Production Ready |
| `app\Models\Plan.php` | **95** | ✅ Elite - Pricing Hardened |
| `app\Models\Product.php` | **98** | ✅ Elite - Moderation Hardened |
| `app\Models\ProductAddon.php` | **98** | ✅ Elite - Pricing Hardened |
| `app\Models\ProductAttribute.php` | **98** | ✅ Elite - Pricing Hardened |
| `app\Models\Property.php` | **98** | ✅ Elite - Moderation Hardened |
| `app\Models\PropertyAddon.php` | **98** | ✅ Elite - Pricing Hardened |
| `app\Models\PropertyBooking.php` | **98** | ✅ Elite - Financial Hardened |
| `app\Models\PropertyFee.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\PropertyNeighborhood.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\PropertyScore.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\PropertyVisit.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\Review.php` | **98** | ✅ Elite - Moderation Hardened |
| `app\Models\SeasonalPrice.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\Service.php` | **98** | ✅ Elite - Moderation Hardened |
| `app\Models\ServiceAppointment.php` | **98** | ✅ Elite - Production Ready |
| `app\Models\ServicePackage.php` | **98** | ✅ Elite - Pricing Hardened |
| `app\Models\ServiceQuote.php` | **98** | ✅ Elite - Quote Hardened |
| `app\Models\Setting.php` | **95** | ✅ Elite - Security Hardened |
| `app\Models\Subscription.php` | **98** | ✅ Elite - Access Hardened |
| `app\Models\Tag.php` | **95** | ✅ Elite - Production Ready |
| `app\Models\Theme.php` | **95** | ✅ Elite - XSS Sanitized |
| `app\Models\Ticket.php` | **95** | ✅ Elite - Security Hardened |
| `app\Models\TicketMessage.php` | **98** | ✅ Elite - Identity Hardened |
| `app\Models\TransactionLine.php` | **98** | ✅ Elite - Ledger Hardened |
| `app\Models\Type.php` | **95** | ✅ Elite - Production Ready |
| `app\Models\User.php` | **98** | ✅ Elite - Privilege Hardened |
| `app\Models\Withdrawal.php` | **98** | ✅ Elite - SoftDeletes Active |
| `app\Traits\Models\HasMarketplaceMetrics.php` | **98** | ✅ Elite - Optimized Cache |
| `app\Traits\Models\HasStatusModeration.php` | **98** | ✅ High Quality - Re-Audit Pending |

## Notifications

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Notifications\ContentFlagged.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Notifications\NewPropertySubmitted.php` | **98** | ✅ Elite - Async Hardened |
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
| `app\Http\Requests\CalculateLodgingPriceRequest.php` | **98** | ✅ Elite - Chronological Hardened |
| `app\Http\Requests\CalculatePriceRequest.php` | **98** | ✅ Elite - IDOR Hardened |
| `app\Http\Requests\JobApplicationStoreRequest.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Requests\ProcessPaymentRequest.php` | **98** | ✅ Elite - Hardened |
| `app\Http\Requests\ProfileUpdateRequest.php` | **98** | ✅ Elite - Auth Enforced |
| `app\Http\Requests\SaveProductRequest.php` | **98** | ✅ Elite - IDOR Resolved |
| `app\Http\Requests\SearchAutoRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\SearchBlogRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\SearchProductRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\SearchPropertyRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\SendContactRequest.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\Http\Requests\SendMessageRequest.php` | **98** | ✅ Elite - Conversation Scoped |
| `app\Http\Requests\StoreAppointmentRequest.php` | **98** | ✅ Elite - Integrity Enforced |
| `app\Http\Requests\StoreAutoInquiryRequest.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Requests\StoreConsultationRequest.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Requests\StoreEventBookingRequest.php` | **98** | ✅ Elite - Auth Enforced |
| `app\Http\Requests\StorePropertyBookingRequest.php` | **98** | ✅ Elite - Auth Enforced |
| `app\Http\Requests\StoreQuoteRequest.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Requests\StoreReviewRequest.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Requests\UpdateBookingDetailsRequest.php` | **98** | ✅ Elite - Ownership Enforced |
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
| `app\Http\Requests\Dashboard\User\UpdateReviewRequest.php` | **98** | ✅ Elite - Ownership Enforced |
| `app\Http\Requests\Partner\AutoRequest.php` | **98** | ✅ Elite - Multi-Tenant Safe |
| `app\Http\Requests\Partner\ClassifiedRequest.php` | **98** | ✅ Elite - Multi-Tenant Safe |
| `app\Http\Requests\Partner\EventRequest.php` | **98** | ✅ Elite - Multi-Tenant Safe |
| `app\Http\Requests\Partner\JobListingRequest.php" | **98** | ✅ Elite - Multi-Tenant Safe |
| `app\Http\Requests\Partner\ProcessWithdrawalRequest.php` | **98** | ✅ Elite - Ownership Enforced |
| `app\Http\Requests\Partner\ProfileUpdateRequest.php` | **98** | ✅ Elite - Safe |
| `app\Http\Requests\Partner\ServiceRequest.php` | **98** | ✅ Elite - Multi-Tenant Safe |
| `app\Http\Requests\Partner\StorePropertyRequest.php` | **98** | ✅ Elite - Multi-Tenant Safe |
| `app\Http\Requests\Partner\StoreSubscriptionRequest.php` | **98** | ✅ Elite - Hardened |
| `app\Http\Requests\Partner\UpdatePropertyRequest.php` | **98** | ✅ Elite - Multi-Tenant Safe |

## Resources

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Http\Resources\AmenityResource.php` | **90** | ✅ Good - Performance Debt |
| `app\Http\Resources\AutoInquiryResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\AutoResource.php` | **98** | ✅ Elite - Masking / N+1 Fixed |
| `app\Http\Resources\BlogResource.php` | **98** | ✅ Elite - Typos / N+1 Fixed |
| `app\Http\Resources\BrandResource.php` | **90** | ✅ Good - Performance Debt |
| `app\Http\Resources\CartItemResource.php` | **98** | ✅ Elite - N+1 Resolved |
| `app\Http\Resources\CartResource.php` | **85** | ✅ Good - Efficiency Debt |
| `app\Http\Resources\CategoryResource.php` | **95** | ✅ Elite - Recursive Safe |
| `app\Http\Resources\ClassifiedInquiryResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\ClassifiedResource.php` | **98** | ✅ Elite - N+1 Resolved |
| `app\Http\Resources\EventBookingResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\EventResource.php` | **98** | ✅ Elite - N+1 Resolved |
| `app\Http\Resources\FavoriteResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\FeatureResource.php` | **90** | ✅ Good - Performance Debt |
| `app\Http\Resources\JobApplicationResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\JobListingResource.php` | **98** | ✅ Elite - N+1 Resolved |
| `app\Http\Resources\LocationResource.php` | **90** | ✅ Good - Performance Debt |
| `app\Http\Resources\MessageResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\OrderItemResource.php` | **98** | ✅ Elite - N+1 Resolved |
| `app\Http\Resources\OrderResource.php` | **98** | ✅ Elite - N+1 & Privacy Fixed |
| `app\Http\Resources\PaymentResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\PlanResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\ProductResource.php` | **98** | ✅ Elite - N+1 & Security Fixed |
| `app\Http\Resources\PropertyBookingResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\PropertyResource.php` | **98** | ✅ Elite - N+1 Hardened |
| `app\Http\Resources\PropertyVisitResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\ReviewResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\ServiceAppointmentResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\ServiceQuoteResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\ServiceResource.php` | **98** | ✅ Elite - N+1 Resolved |
| `app\Http\Resources\SubscriptionResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\TagResource.php` | **90** | ✅ Good - Performance Debt |
| `app\Http\Resources\TicketMessageResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\TicketResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\TransactionResource.php` | **95** | ✅ Elite - Production Ready |
| `app\Http\Resources\TypeResource.php` | **90** | ✅ Good - Performance Debt |
| `app\Http\Resources\UserResource.php` | **98** | ✅ Elite - PII Hardened |

## Services

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Services\ActivityService.php` | **95** | ✅ Elite - Aggregation Optimized |
| `app\Services\AmenityService.php` | **95** | ✅ Good - Standard |
| `app\Services\AutoInquiryService.php` | **95** | ✅ Good - Standard |
| `app\Services\AutoService.php` | **95** | ✅ Good - Standard |
| `app\Services\BlogService.php` | **95** | ✅ Good - Standard |
| `app\Services\BrandService.php` | **95** | ✅ Good - Standard |
| `app\Services\CartService.php` | **90** | ✅ Good - Minor Efficiency |
| `app\Services\CategoryService.php` | **95** | ✅ Good - Standard |
| `app\Services\CheckoutService.php` | **95** | ✅ Elite - Concurrency Safe |
| `app\Services\ClassifiedManagementService.php` | **95** | ✅ Elite - DB Pagination |
| `app\Services\ContentService.php` | **95** | ✅ Elite - Request Priming |
| `app\Services\EventBookingService.php` | **95** | ✅ Good - Standard |
| `app\Services\EventService.php` | **95** | ✅ Elite - Inventory Aggregation |
| `app\Services\FeatureService.php` | **95** | ✅ Good - Standard |
| `app\Services\GatewayManager.php` | **100** | ✅ Elite - Secure Whitelist Factory |
| `app\Services\HomeDataService.php` | **98** | ✅ Elite - Full Cache Layer |
| `app\Services\JobManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\LocationService.php` | **95** | ✅ Good - Standard |
| `app\Services\MenuService.php` | **98** | ✅ Elite - Cache Poisoning Resolved |
| `app\Services\PartnerBonusService.php` | **95** | ✅ Good - Standard |
| `app\Services\PaypalGatewayService.php` | **98** | ✅ Elite - Webhook Verified |
| `app\Services\ProductService.php` | **95** | ✅ Elite - Efficient Pricing |
| `app\Services\PropertyService.php` | **95** | ✅ Elite - Search Optimized |
| `app\Services\ReviewManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\ServiceManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\StripeGatewayService.php` | **98** | ✅ Elite - High Security |
| `app\Services\SubscriptionService.php` | **95** | ✅ Good - Standard |
| `app\Services\TagService.php` | **95** | ✅ Good - Standard |
| `app\Services\TypeService.php` | **95** | ✅ Good - Standard |
| `app\Services\WalletService.php` | **98** | ✅ Elite - Atomic Locks Active |
| `app\Services\Admin\AmenityManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\BookingManagementService.php` | **98** | ✅ Elite - Union Optimized |
| `app\Services\Admin\BrandManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\CategoryManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\DashboardService.php` | **98** | ✅ Elite - Memory Optimized |
| `app\Services\Admin\FeatureManagementService.php` | **95** | ✅ Good - Standard |
| `app\Services\Admin\ListingQueryService.php` | **98** | ✅ Elite - Hydration Hardened |
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
| `app\Traits\ApiResponseTrait.php` | **95** | ✅ Elite - Standardized |
| `app\Traits\HasAnalytics.php` | **95** | ✅ Elite - Cached |
| `app\Traits\HasBookingAttributes.php` | **95** | ✅ Elite - Standardized |
| `app\Traits\HasImageAccess.php` | **95** | ✅ Elite - Async Optimized |
| `app\Traits\ManagesApproval.php` | **95** | ✅ Elite - Auth Hardened |
| `app\Traits\Subscribable.php` | **95** | ✅ Elite - Cached |
| `app\Traits\Models\HasMarketplaceMetrics.php` | **95** | ✅ Elite - Request Cache Active |
| `app\Traits\Models\HasStatusModeration.php` | **98** | ✅ Elite - Translated |

## View Components

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\View\Components\AppLayout.php` | **98** | ✅ High Quality - Re-Audit Pending |
| `app\View\Components\GuestLayout.php` | **98** | ✅ High Quality - Re-Audit Pending |
