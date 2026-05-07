# 🛡️ Audit Partial: App Architecture

## Console Commands

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Console\Commands\CheckRenewals.php` | **100** | ✅ Elite - Production Ready |

## Controllers

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Http\Controllers\AutoController.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\AutoInquiryController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\BlogController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\BrandController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\CartController.php` | **90** | ✅ Elite - Service Based |
| `app\Http\Controllers\CategoryController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\CheckoutController.php` | **30** | 🔴 Critical - Price Manipulation Risk |
| `app\Http\Controllers\ClassifiedController.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Controller.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\ConversationController.php` | **75** | 🟠 Warning - Logic Debt |
| `app\Http\Controllers\EventBookingController.php` | **30** | 🔴 Critical - Price Manipulation Risk |
| `app\Http\Controllers\EventController.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\EventTicketController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\HomeController.php` | **95** | ✅ Elite - Proxy Pattern |
| `app\Http\Controllers\JobApplicationController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\JobController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\OrderController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\PageController.php` | **60** | 🟠 Warning - Stub Logic |
| `app\Http\Controllers\PartnerController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\ProductController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\PropertyBookingController.php` | **65** | 🟠 Warning - IDOR Ownership Risk |
| `app\Http\Controllers\PropertyController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\PropertyVisitController.php` | **85** | ✅ Good - Service Extraction Opportunity |
| `app\Http\Controllers\ReviewController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\ServiceController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\TagController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\TypeController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\UnifiedHomeController.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\WebhookController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\ActivityLogController.php` | **75** | 🟠 Warning - Logic Debt |
| `app\Http\Controllers\Admin\AddonController.php` | **85** | ✅ Good - Inline Validation |
| `app\Http\Controllers\Admin\AdvertisementController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\AmenityController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\AutoController.php` | **72** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\AutoInquiryController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\BlogController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\BookingController.php` | **75** | 🟠 Warning - Security Debt |
| `app\Http\Controllers\Admin\BookingLineItemController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\BrandController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\CategoryController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\ClassifiedController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\ClassifiedInquiryController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\ContentController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\DashboardController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\EmailTemplateController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\EventBookingController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\EventController.php` | **72** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\FeatureController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\GalleryController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\JobApplicationController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\JobController.php` | **72** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\LineItemController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\ListingController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\LocationController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\MenuController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\NewsletterSubscriberController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\NotificationController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\OrderController.php` | **70** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\PageBuilderController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\PageController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\PaymentController.php` | **68** | 🟠 Warning - Rigid Polymorphism |
| `app\Http\Controllers\Admin\PaymentGatewayController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\PermissionController.php` | **100** | ✅ Elite - Security Hardened |
| `app\Http\Controllers\Admin\PlanController.php` | **72** | 🟠 Warning - Logic Bloat |
| `app\Http\Controllers\Admin\ProductController.php` | **70** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\ProfileController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\PropertyBookingController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\PropertyController.php` | **72** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\ReportController.php` | **68** | 🟠 Warning - Logic Bloat |
| `app\Http\Controllers\Admin\RoleController.php` | **90** | ✅ Elite - Security Hardened |
| `app\Http\Controllers\Admin\ServiceAppointmentController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\ServiceController.php` | **72** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\Admin\ServiceQuoteController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\SettingController.php` | **65** | 🟠 Warning - Logic Bloat |
| `app\Http\Controllers\Admin\SubscriptionController.php` | **72** | 🟠 Warning - Renewal Logic Debt |
| `app\Http\Controllers\Admin\SubscriptionQuotaController.php` | **85** | ✅ Good - Logic Bloat |
| `app\Http\Controllers\Admin\SystemController.php` | **75** | 🟠 Warning - Security Debt |
| `app\Http\Controllers\Admin\TagController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\ThemeController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\TicketController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\TransactionController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\TypeController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Admin\UserController.php` | **95** | ✅ Elite - Service Based |
| `app\Http\Controllers\Admin\WithdrawalController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\ApiApplicationController.php` | **85** | ✅ Good - Resource Debt |
| `app\Http\Controllers\Api\ApiThemeController.php` | **85** | ✅ Good - Resource Debt |
| `app\Http\Controllers\Api\TicketController.php` | **78** | 🟠 Warning - Protocol Debt |
| `app\Http\Controllers\Api\V1\ApiAmenityController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiAutoController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiBlogController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiBrandController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiCartController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiCategoryController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiClassifiedController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiEventController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiFeatureController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiJobController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiLocationController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiOrderController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiProductController.php` | **92** | ✅ Elite - Security Debt |
| `app\Http\Controllers\Api\V1\ApiPropertyController.php` | **98** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiServiceController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiTagController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\ApiTypeController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Auth\AuthController.php` | **40** | 🔴 Critical - Privilege Escalation Risk |
| `app\Http\Controllers\Api\V1\Auth\PasswordResetController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Auth\ProfileController.php` | **88** | ✅ Elite - Resource Debt |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ActivityController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\AnalyticsController.php` | **45** | 🔴 Critical - Severe Logic Bloat |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\AutoController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\AutoInquiryController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ClassifiedController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ClassifiedInquiryController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\DashboardController.php` | **75** | 🟠 Warning - Trait Debt |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\EventBookingController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\EventController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\JobApplicationController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\JobListingController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\MessageController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\PaymentController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\PlanController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ProductController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ProfileController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\PropertyBookingController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\PropertyController.php` | **88** | ✅ Elite - Manual Auth Debt |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\PropertyVisitController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ReviewController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ServiceAppointmentController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ServiceController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\ServiceQuoteController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\SubscriptionController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\WalletController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\Partner\WithdrawalController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\AutoInquiryController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\BookingController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\ClassifiedInquiryController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\DashboardController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\EventBookingController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\FavoriteController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\JobApplicationController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\MessageController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\PaymentController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\PropertyBookingController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\ReviewController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\ServiceAppointmentController.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Controllers\Api\V1\Dashboard\User\ServiceQuoteController.php` | **100** | ✅ Elite - Production Ready |

## Events

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Events\BookingCancelled.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\EventTicketPurchased.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\JobApplicationReceived.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\ListingApproved.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\ListingRejected.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\NewListingLead.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\NewMessageSent.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\NewsletterOptinAttempted.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\NewsletterSubscriptionConfirmed.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\PaymentFailed.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\PlanAboutToExpire.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\PlanDowngraded.php" | **100** | ✅ Elite - Production Ready |
| `app\Events\PlanExpired.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\PlanSubscribed.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\PlanUpgraded.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\PropertyBookingConfirmed.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\ReviewReceived.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\ReviewRequested.php` | **100** | ✅ Elite - Production Ready |
| `app\Events\UserRegistered.php` | **100** | ✅ Elite - Production Ready |

## Listeners

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Listeners\SendBookingCancelledEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendBookingConfirmedEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendEventTicketEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendJobApplicationReceivedEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendListingApprovedEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendListingRejectedEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendNewListingLeadEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendNewsletterWelcomeEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendOptinConfirmationEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendPaymentFailedEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendPlanDowngradedEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendPlanExpiredEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendPlanSubscribedEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendPlanUpgradedEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendRenewalReminderEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendReviewReceivedEmail.php" | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendReviewRequestEmail.php` | **100** | ✅ Elite - Production Ready |
| `app\Listeners\SendWelcomeEmail.php` | **100** | ✅ Elite - Production Ready |

## Mail

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Mail\DynamicEmail.php` | **100** | ✅ Elite - Production Ready |

## Middlewares

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Http\Middleware\CheckBuiltInWebsiteStatus.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Middleware\CheckModuleEnabled.php` | **100** | ✅ Elite - Production Ready |

## Models

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Models\Advertisement.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Amenity.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Application.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Auto.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\AutoInquiry.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Blog.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Brand.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Campaign.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Cart.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\CartItem.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Category.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Classified.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\ClassifiedInquiry.php" | **100** | ✅ Elite - Production Ready |
| `app\Models\Conversation.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\EmailTemplate.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Event.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\EventBooking.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\EventOccurrence.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\EventOccurrenceTicket.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\EventTicketType.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Favorite.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Feature.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Gallery.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\GatewayCredential.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\GatewayFieldBlueprint.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\JobApplication.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\JobListing.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Location.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Menu.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\MenuItem.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Message.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\NewsletterSubscriber.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Order.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\OrderItem.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Page.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\PageContent.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Payment.php" | **100** | ✅ Elite - Production Ready |
| `app\Models\PaymentGateway.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Plan.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Product.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\ProductAddon.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\ProductAttribute.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Property.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\PropertyAddon.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\PropertyBooking.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\PropertyFee.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\PropertyNeighborhood.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\PropertyScore.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\PropertyVisit.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Review.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\SeasonalPrice.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Service.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\ServiceAppointment.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\ServicePackage.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\ServiceQuote.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Setting.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Subscription.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Tag.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Theme.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Ticket.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\TicketMessage.php" | **100** | ✅ Elite - Production Ready |
| `app\Models\TransactionLine.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Type.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\User.php` | **100** | ✅ Elite - Production Ready |
| `app\Models\Withdrawal.php` | **100** | ✅ Elite - Production Ready |
| `app\Traits\Models\HasMarketplaceMetrics.php` | **100** | ✅ Elite - Production Ready |
| `app\Traits\Models\HasStatusModeration.php` | **100** | ✅ Elite - Production Ready |

## Notifications

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Notifications\ContentFlagged.php` | **100** | ✅ Elite - Production Ready |
| `app\Notifications\NewPropertySubmitted.php` | **100** | ✅ Elite - Production Ready |
| `app\Notifications\OrderStatusChanged.php` | **100** | ✅ Elite - Production Ready |

## Observers

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Observers\CartItemObserver.php` | **100** | ✅ Elite - Production Ready |

## Others

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\helpers.php` | **100** | ✅ Elite - Production Ready |
| `app\Contracts\PaymentGatewayService.php` | **100** | ✅ Elite - Production Ready |
| `app\DTOs\ContentResult.php` | **100** | ✅ Elite - Production Ready |
| `app\Jobs\RegenerateMediaJob.php` | **100** | ✅ Elite - Production Ready |
| `app\Menu\Filters\ModuleFilter.php` | **100** | ✅ Elite - Production Ready |

## Policies

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Policies\ThemePolicy.php` | **100** | ✅ Elite - Production Ready |

## Providers

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Providers\AppServiceProvider.php` | **100** | ✅ Elite - Production Ready |

## Requests

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Http\Requests\CalculateLodgingPriceRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\CalculatePriceRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\JobApplicationStoreRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\ProcessPaymentRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\ProfileUpdateRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\SaveProductRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\SearchAutoRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\SearchBlogRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\SearchProductRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\SearchPropertyRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\SendContactRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\SendMessageRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\StoreAppointmentRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\StoreAutoInquiryRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\StoreConsultationRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\StoreEventBookingRequest.php" | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\StorePropertyBookingRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\StoreQuoteRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\StoreReviewRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\UpdateBookingDetailsRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\AdvertisementRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\AmenityRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\AutoRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\BrandRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\CategoryRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\ClassifiedRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\EventRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\FeatureRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\JobListingRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\LocationRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\ProductRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\PropertyRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\ServiceRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\TagRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\TypeRequest.php" | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\UserStoreRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\Tickets\ReplyTicketRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Admin\Tickets\UpdateTicketStatusRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Api\Tickets\ReplyTicketRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Api\Tickets\StoreTicketRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Auth\LoginRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Auth\RegisterRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Auth\ResetPasswordRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Auth\SendResetLinkEmailRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Auth\UpdatePasswordRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Auth\UpdateProfileRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Dashboard\User\UpdateProfileRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Dashboard\User\UpdateReviewRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Partner\AutoRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Partner\ClassifiedRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Partner\EventRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Partner\JobListingRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Partner\ProcessWithdrawalRequest.php" | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Partner\ProfileUpdateRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Partner\ServiceRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Partner\StorePropertyRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Partner\StoreSubscriptionRequest.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Requests\Partner\UpdatePropertyRequest.php` | **100** | ✅ Elite - Production Ready |

## Resources

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Http\Resources\AmenityResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\AutoInquiryResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\AutoResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\BlogResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\BrandResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\CartItemResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\CartResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\CategoryResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\ClassifiedInquiryResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\ClassifiedResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\EventBookingResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\EventResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\FavoriteResource.php" | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\FeatureResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\JobApplicationResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\JobListingResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\LocationResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\MessageResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\OrderItemResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\OrderResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\PaymentResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\PlanResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\ProductResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\PropertyBookingResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\PropertyResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\PropertyVisitResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\ReviewResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\ServiceAppointmentResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\ServiceQuoteResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\ServiceResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\SubscriptionResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\TagResource.php" | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\TicketMessageResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\TicketResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\TransactionResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\TypeResource.php` | **100** | ✅ Elite - Production Ready |
| `app\Http\Resources\UserResource.php` | **100** | ✅ Elite - Production Ready |

## Services

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Services\ActivityService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\AmenityService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\AutoInquiryService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\AutoService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\BlogService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\BrandService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\CartService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\CategoryService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\CheckoutService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\ClassifiedManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\ContentService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\EventBookingService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\EventService.php" | **100** | ✅ Elite - Production Ready |
| `app\Services\FeatureService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\GatewayManager.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\HomeDataService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\JobManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\LocationService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\MenuService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\PartnerBonusService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\PaypalGatewayService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\ProductService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\PropertyService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\ReviewManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\ServiceManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\StripeGatewayService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\SubscriptionService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\TagService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\TypeService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\WalletService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Admin\AmenityManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Admin\BookingManagementService.php" | **100** | ✅ Elite - Production Ready |
| `app\Services\Admin\BrandManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Admin\CategoryManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Admin\DashboardService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Admin\FeatureManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Admin\ListingQueryService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Admin\LocationManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Admin\TagManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Admin\TicketManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Admin\TypeManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Admin\UserManagementService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Partner\AutoService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Partner\ClassifiedService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Partner\EventBookingService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Partner\EventService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Partner\JobListingService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Partner\ProfileService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Partner\PropertyService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Partner\PropertyVisitService.php` | **100** | ✅ Elite - Production Ready |
| `app\Services\Partner\ReviewService.php" | **100** | ✅ Elite - Production Ready |
| `app\Services\Partner\ServiceService.php` | **100** | ✅ Elite - Production Ready |

## Traits

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\Traits\ApiResponseTrait.php` | **100** | ✅ Elite - Production Ready |
| `app\Traits\HasAnalytics.php` | **100** | ✅ Elite - Production Ready |
| `app\Traits\HasBookingAttributes.php` | **100** | ✅ Elite - Production Ready |
| `app\Traits\HasImageAccess.php` | **100** | ✅ Elite - Production Ready |
| `app\Traits\ManagesApproval.php` | **100** | ✅ Elite - Production Ready |
| `app\Traits\Subscribable.php` | **100** | ✅ Elite - Production Ready |

## View Components

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `app\View\Components\AppLayout.php` | **100** | ✅ Elite - Production Ready |
| `app\View\Components\GuestLayout.php` | **100** | ✅ Elite - Production Ready |

---

# Detailed Controller Audit Reports

- `Admin\OrderController.php` | **70** | 🟠 Warning - Fat Controller |

---

# Detailed Controller Audit Reports

## Controller Audit: app/Http/Controllers/CheckoutController.php

### Controller Purpose
Orchestrates the multi-gateway checkout process, payment initiation, and 3D Secure confirmation.

### Risk Level
CRITICAL

### Problems Found

### Security
- **Price Manipulation**: `processPayment` (L75) takes the `amount` directly from the request parameter: `$amount = $request->input('amount')`. This is a catastrophic vulnerability allowing any user to pay a modified price (e.g., $0.01) by intercepting the request.
- **Missing Validation**: No server-side verification of the order total against the cart contents during payment processing.

### CodeCanyon Compliance
- **Stub Data**: `orderData` is mocked with `rand()` (L44-49). This is a critical rejection risk for marketplace products as it indicates incomplete business logic.

### Architecture
- **Insecure Redirects**: Relies on session data for success references (L157) which can be unreliable if the user session expires during the 3DS redirect.

## Controller Audit: app/Http/Controllers/CartController.php

### Controller Purpose
Manages the shopping cart lifecycle, including item additions, quantity updates, and persistence.

### Risk Level
LOW

### Problems Found
- **Security Gap**: `update` (L82) and `remove` (L97) methods accept an integer ID. While delegated to `CartService`, there is no explicit ownership check at the controller or route level to ensure the ID belongs to the current user's session.

## Controller Audit: app/Http/Controllers/AutoInquiryController.php

### Controller Purpose
Handles customer inquiries and test drive requests for vehicles.

### Risk Level
LOW

### Problems Found
- **Authorization**: Uses a private helper method `authorizeInquiryAccess` (L95) instead of formal Laravel Policies. While functional, it increases future technical debt.

## Controller Audit: app/Http/Controllers/ConversationController.php

### Controller Purpose
Manages the initialization of messaging threads between buyers and partners.

### Risk Level
LOW

### Problems Found
- **Architecture**: Direct model creation (`Conversation::create`) inside the controller. This logic should be moved to a `MessagingService` to ensure consistency with the rest of the platform's service-oriented architecture.

- `Admin\OrderController.php` | **70** | 🟠 Warning - Fat Controller |
| `app\Http\Controllers\EventBookingController.php` | **30** | 🔴 Critical - Price Manipulation Risk |

---

# Detailed Controller Audit Reports

| `app\Http\Controllers\EventBookingController.php` | **30** | 🔴 Critical - Price Manipulation Risk |
| `app\Http\Controllers\PropertyBookingController.php` | **65** | 🟠 Warning - IDOR Ownership Risk |

---

# Detailed Controller Audit Reports

| `app\Http\Controllers\PropertyBookingController.php` | **65** | 🟠 Warning - IDOR Ownership Risk |
| `app\Http\Controllers\PropertyVisitController.php` | **85** | ✅ Good - Service Extraction Opportunity |

---

# Detailed Controller Audit Reports

| `app\Http\Controllers\PropertyVisitController.php` | **85** | ✅ Good - Service Extraction Opportunity |

---

# Detailed Controller Audit Reports

## Controller Audit: app/Http/Controllers/Admin/PaymentController.php

### Controller Purpose
Orchestrates the administrative financial ledger, managing polymorphic payments and transaction auditing.

### Risk Level
MEDIUM

### Problems Found

### Architecture
- **Rigid Polymorphism**: `store` (L115) and `update` (L157) hardcode `payable_type` to `Subscription::class`. This violates polymorphic principles and creates high technical debt for future marketplace verticals (Orders, Leads).
- **Logic Debt**: Financial logic should be abstracted into a `PaymentLedgerService`.

### Security
- **Authorization**: Missing formal Policy checks for sensitive ledger modifications.

## Controller Audit: app/Http/Controllers/Admin/PermissionController.php

### Controller Purpose
Administrative security granularities and RBAC management.

### Risk Level
LOW

### Security
- **Authorization**: **Excellent**. Implements full Laravel Policy enforcement (`viewAny`, `create`, `update`, `delete`).

## Controller Audit: app/Http/Controllers/Admin/PlanController.php

### Controller Purpose
Manages subscription plans, pricing tiers, and resource quotas.

### Risk Level
MEDIUM

### Problems Found

### Architecture
- **Logic Bloat**: Data normalization and quota nullification logic (L158) are trapped in the controller. Should be in a `PlanRequest` or `PlanService`.
- **Validation**: Manual validation method instead of dedicated FormRequests.

## Controller Audit: app/Http/Controllers/Admin/ProductController.php

### Controller Purpose
Administrative lifecycle of marketplace products, including relational sync and asset replication.

### Risk Level
MEDIUM

### Problems Found

### Architecture
- **Fat Controller**: `store` and `update` handle complex relational synchronization (tags, attributes, addons) within direct transaction blocks.
- **Service Layer Missing**: Duplication logic and relational integrity checks should reside in a `ProductManagementService`.

### Security
- **Authorization**: Missing Policy checks.

| `app\Http\Controllers\PropertyVisitController.php` | **85** | ✅ Good - Service Extraction Opportunity |

---

# Detailed Controller Audit Reports

| `app\Http\Controllers\Admin\SystemController.php` | **75** | 🟠 Warning - Security Debt |

---

# Detailed Controller Audit Reports

## Controller Audit: app/Http/Controllers/Api/ApiApplicationController.php

### Controller Purpose
Retrieves active application configuration based on headers or database defaults for mobile/frontend apps.

### Risk Level
LOW

### Problems Found

### API Quality
- **Resource Debt**: Returns raw Model data (`data => $application`) instead of a dedicated `ApplicationResource`. This exposes internal database fields (like `deleted_at` or sensitive timestamps) to the public API.

### Architecture
- **Missing Abstraction**: Identification logic (X-App-Key header check) is inside the controller; should be handled by a Middleware or IdentificationService.

## Controller Audit: app/Http/Controllers/Api/TicketController.php

### Controller Purpose
Manages user support tickets and communication threads via the API.

### Risk Level
MEDIUM

### Problems Found

### API Quality
- **Non-Standard Protocol**: Uses HTTP `210` (L42) for resource creation. Industry standards require `201`.
- **Inconsistent Response**: Returns raw message model in reply (L80) but uses Resource for index.

### Security
- **Authorization Debt**: Uses manual `if ($ticket->user_id !== auth()->id())` checks instead of formal Laravel Policies. This increases the risk of IDOR vulnerabilities if a check is missed in future methods.

## Controller Audit: app/Http/Controllers/Api/ApiThemeController.php

### Controller Purpose
Retrieves active theme configurations and global site settings for API consumers.

### Risk Level
LOW

### Problems Found

### Architecture
- **Logic Entrapment**: Setting keys (`site_name`, etc.) are hardcoded in the controller (L38).
- **Resource Debt**: Manually merges settings into a model array (L43) instead of using a Resource to handle the transformation.

| `app\Http\Controllers\Api\V1\ApiAmenityController.php` | **100** | ✅ Elite - Production Ready |

---

# Detailed Controller Audit Reports

| `app\Http\Controllers\Api\V1\ApiCategoryController.php` | **100** | ✅ Elite - Production Ready |

---

# Detailed Controller Audit Reports

## Controller Audit: app/Http/Controllers/Api/V1/ApiFeatureController.php

### Controller Purpose
Discovery and retrieval of platform features and attributes.

### Risk Level
LOW

### Architecture
- **Elite Standards**: Perfect implementation of the Service-Resource pattern.

## Controller Audit: app/Http/Controllers/Api/V1/ApiLocationController.php

### Controller Purpose
Discovery of platform locations, regional metrics, and geospatial retrieval.

### Risk Level
LOW

### Architecture
- **Elite Standards**: High quality delegation to `LocationService` with correct additional metadata for regional stats.

| `app\Http\Controllers\Api\V1\Auth\ProfileController.php` | **88** | ✅ Elite - Resource Debt |

---

# Detailed Controller Audit Reports

## Controller Audit: app/Http/Controllers/Api/V1/Dashboard/Partner/AnalyticsController.php

### Controller Purpose
Aggregates performance metrics (views, leads, earnings) across all partner listings for the analytics dashboard.

### Risk Level
CRITICAL

### Problems Found

### Architecture
- **Severe Logic Bloat**: The controller contains over 400 lines of complex query building, performance math, and chart data formatting. This is a clear violation of the "Thin Controller" mandate.
- **Service Layer Missing**: All calculations for conversion rates, daily lead/view trends, and revenue aggregation MUST be moved to an `AnalyticsService`.
- **Maintenance Debt**: The manual iteration through multiple listing types (L361) to build performance stats is fragile and will cause significant performance issues as the partner's listing count grows.

## Controller Audit: app/Http/Controllers/Api/V1/Dashboard/Partner/DashboardController.php

### Controller Purpose
Primary data aggregator for the partner dashboard overview.

### Risk Level
MEDIUM

### Problems Found

### Architecture
- **Trait Debt**: Uses traits (`Listings`, `DashboardDataPreparation`) to hide "Fat Controller" symptoms. This creates hidden dependencies and makes the data flow harder to trace.
- **Logic Bloat**: Manual collection collapsing and enrichment (L74) should be moved to a service.

## Controller Audit: app/Http/Controllers/Api/V1/Dashboard/Partner/PropertyController.php

### Controller Purpose
Partner-side management of property listings, including resource quota enforcement.

### Risk Level
LOW-MEDIUM

### Problems Found

### Architecture
- **Logic Bloat**: `handleMedia` (L125) resides in the controller.
- **Security Debt**: Relies on manual `user_id` filtering (L30, L74, etc.) instead of formal Laravel Policies.

## Controller Audit: app/Http/Controllers/Api/V1/Auth/ProfileController.php

### Controller Purpose
Manages user profile retrieval, updates, and security credentials via the API.

### Risk Level
LOW

### Problems Found

### API Quality
- **Resource Debt**: Manually maps user fields in `show` (L18) and `update` (L39). Should be refactored into a `UserResource` to ensure consistent field mapping and prevent future field exposure leaks.

## Controller Audit: app/Http/Controllers/Api/V1/ApiCategoryController.php

### Controller Purpose
Orchestrates API-driven categorical hierarchy and breadcrumb mapping.

### Risk Level
LOW

### Architecture
- **Elite Standards**: Perfect implementation of Service-Resource pattern with correct metadata injection for breadcrumbs.

## Controller Audit: app/Http/Controllers/Api/V1/ApiClassifiedController.php

### Controller Purpose
Faceted search and discovery for classified marketplace listings.

### Risk Level
LOW

### Architecture
- **API Quality**: Excellent use of `additional` metadata to provide sidebar filter options in a single request.

## Controller Audit: app/Http/Controllers/Api/V1/ApiProductController.php

### Controller Purpose
Lifecycle management of marketplace products, variation pricing, and media synchronization.

### Risk Level
LOW-MEDIUM

### Problems Found

### Architecture
- **Logic Bloat**: `handleMedia` (L130) is inside the controller. While specific to the request flow, it could be abstracted into a `MediaManagementService` to keep the controller strictly thin.

### Security
- **Authorization Debt**: Relies on manual `where('user_id', auth()->id())` filters (L76, L169) for ownership verification. Should be moved to formal Laravel Policies to ensure consistent enforcement across all API endpoints.

## Controller Audit: app/Http/Controllers/Api/V1/ApiAmenityController.php

### Controller Purpose
Discovery and retrieval of platform amenities.

### Risk Level
LOW

### Architecture
- **Elite Standards**: Perfect implementation of the Service-Resource pattern.

## Controller Audit: app/Http/Controllers/Admin/SystemController.php

### Controller Purpose
Orchestrates administrative maintenance, system optimization, and environment diagnostic protocols.

### Risk Level
MEDIUM

### Problems Found

### Security
- **Missing Granular Authorization**: Relies entirely on global route middleware. Sensitive operations like `optimize`, `clearCache`, and `regenerateMedia` lack internal Policy/Gate checks, posing a risk of system-wide DOS if middleware is bypassed.

### Architecture
- **Missing Service Layer**: System maintenance operations should be delegated to a `MaintenanceService` to allow for CLI and Job-based triggers outside the HTTP context.

## Controller Audit: app/Http/Controllers/Admin/SubscriptionController.php

### Controller Purpose
Manages user subscriptions, renewal cycles, and platform access control.

### Risk Level
MEDIUM

### Problems Found

### Architecture
- **Renewal Logic Entrapment**: The logic for calculating renewal windows and status synchronization (L96-109) is trapped in the controller. This prevents reuse in automated billing cron jobs.
- **Validation**: Manual validation inside methods instead of FormRequests.

## Controller Audit: app/Http/Controllers/Admin/SubscriptionQuotaController.php

### Controller Purpose
Oversight of subscription resource consumption (listings, featured slots).

### Risk Level
LOW

### Problems Found
- **Logic Bloat**: Manual reset and update logic for usage metrics resides in the controller. Should be moved to a `QuotaManagementService`.

## Controller Audit: app/Http/Controllers/PropertyVisitController.php

### Controller Purpose
Orchestrates the scheduling and management of physical property viewing appointments (Leads).

### Risk Level
LOW

### Problems Found

### Architecture
- **Fat Methods**: `store` (L44-94) handles validation, activity logging, and model creation directly.
- **Service Layer Opportunities**: Lead generation and activity logging should be moved to a `LeadManagementService`.

### Security
- **Authorization**: Correctly checks ownership in `show` and `cancel`.

## Controller Audit: app/Http/Controllers/ReviewController.php

### Controller Purpose
Manages polymorphic reviews across all marketplace verticals.

### Risk Level
LOW

### Architecture
- **Service Layer**: Excellent delegation to `ReviewManagementService`.
- **Polymorphism**: Correct resolution of reviewable models.

### Security
- **Integrity**: Robust duplicate prevention logic (L46).

## Controller Audit: app/Http/Controllers/PropertyBookingController.php

### Controller Purpose
Manages the booking lifecycle for real estate properties, coordinating checkout and payment confirmation.

### Risk Level
MEDIUM-HIGH

### Problems Found

### Security
- **IDOR / Missing Ownership Verification**: The `authorizeBooking` helper (L188-193) only verifies that a booking belongs to a property ID: `if ($booking->property_id !== $property->id)`. It **fails to check** if the booking belongs to the currently authenticated user: `auth()->id() !== $booking->user_id`.
- **Exploit Vector**: An attacker can view any user's payment page or confirmation receipt by simply iterating through booking IDs in the URL.

### Architecture
- **Service Layer**: Excellent use of `PropertyService` for complex breakdown calculations.

## Controller Audit: app/Http/Controllers/ProductController.php

### Controller Purpose
Handles retail product discovery, searching, and dynamic price calculations.

### Risk Level
LOW

### Architecture
- **Service Layer**: High-fidelity delegation to `ProductService`.
- **Security**: Robust whitelisting of theme variants and input validation.

## Controller Audit: app/Http/Controllers/EventBookingController.php

### Controller Purpose
Manages the lifecycle of event ticket bookings, including availability checks and payment processing.

### Risk Level
CRITICAL

### Problems Found

### Security
- **Price Manipulation**: `processPayment` (L164) takes the `amount` directly from the request parameter: `$request->amount`. This allows users to pay an arbitrary amount for tickets by modifying the form or API request.
- **Transaction Safety**: `store` method (L81-98) performs multiple DB writes (Booking creation, Ticket increment) without a formal transaction block in the controller.

### Architecture
- **Fat Controller**: Significant business logic for price calculation and availability checks reside in the controller.
- **Authorization**: Uses internal private helper `authorizeBooking` instead of formal Laravel Policies.

## Controller Audit: app/Http/Controllers/EventController.php

### Controller Purpose
Public discovery and detailed viewing for event listings.

### Risk Level
LOW

### Architecture
- **Service Layer**: High quality delegation to `EventService`.
- **Performance**: Correct use of eager loading for occurrences and ticket types.

## Controller Audit: app/Http/Controllers/JobApplicationController.php

### Controller Purpose
Manages the submission and confirmation of job applications.

### Risk Level
LOW

### Architecture
- **Service Layer**: Perfect delegation to `JobManagementService`.
- **Security**: Robust ownership checks in `confirmation` (L90).

## Controller Audit: app/Http/Controllers/CheckoutController.php

### Controller Purpose
Orchestrates the administrative lifecycle of the Real Estate vertical, managing complex relational data and seasonal pricing.

### Risk Level
MEDIUM

### Problems Found
- **Missing Policies**: Relies on global admin middleware; lacks fine-grained Policy/Gate checks for CRUD operations.
- **Fat Controller**: `store` and `update` handle excessive relational logic (amenities, features, neighborhoods, prices).
- **Relational Bloat**: Direct manual synchronization of complex nested arrays inside controller methods.

### Maintainability
- **Extraction Needed**: Logic for `syncSeasonalPrices` and hierarchical feature mapping should reside in a `PropertyService`.

## Dangerous Methods
- `store()`: Large transaction block with direct input handling.
- `update()`: Deletes/recreates relationships (`neighborhoods()->delete()`) inside a transaction.

## Large/Complex Methods
- `store()` (L89-143)
- `update()` (L186-226)

## Service Layer Opportunities
- Migrate all `DB::transaction` blocks and relational sync logic to `App\Services\PropertyService`.

## Transaction Safety
SAFE (Uses `DB::transaction`)

## Authorization Safety
UNSAFE (Missing Policies)

## Validation Safety
SAFE (Uses `PropertyRequest`)

## Laravel Best Practices
FAIL (Violates Separation of Concerns)

## Production Ready
NO

---

# Controller Audit: app/Http/Controllers/Admin/UserController.php

### Controller Purpose
Manages platform identities, roles, and specialized profile transitions (Buyers/Partners).

### Risk Level
LOW

### Problems Found
- **Authorization**: Hardcoded checks for `super-admin` role rather than using Policies.

### Architecture
- **Service Layer**: Excellent delegation to `UserManagementService`.

## Dangerous Methods
NONE

## Transaction Safety
SAFE

## Authorization Safety
MEDIUM (Hardcoded checks)

## Validation Safety
SAFE (Uses `UserStoreRequest`)

## Laravel Best Practices
PASS

## Production Ready
YES

---

# Controller Audit: app/Http/Controllers/Admin/SettingController.php

### Controller Purpose
Central configuration engine for platform environment, themes, and feature toggles.

### Risk Level
MEDIUM

### Problems Found

### Security
- **XSS Risk**: No sanitization for raw code blocks (`google_analytics`, `custom_head_code`).
- **Validation**: Inline validation rules in `getValidationRules` instead of FormRequests.

### Architecture
- **Fat Methods**: `saveSettingsData` is an anti-pattern (large loop with multiple conditional protocols).
- **Performance**: N+1/Repeated `updateOrCreate` calls in a loop.

## Service Layer Opportunities
- Move setting persistence logic and file handling to `App\Services\Admin\SettingService`.

## Transaction Safety
UNSAFE (No transaction for bulk setting updates)

## Authorization Safety
UNSAFE (Missing Policies)

## Validation Safety
FAIL (Inline rules)

## Laravel Best Practices
FAIL

## Production Ready
NO

---

# Controller Audit: app/Http/Controllers/Api/V1/Auth/AuthController.php

### Controller Purpose
API Authentication Gateway (Login, Registration, Logout, Token Refresh).

### Risk Level
MEDIUM

### Problems Found

### Security
- **Dynamic Role Assignment**: `register` method (L83) assigns roles based on request input: `$user->assignRole($request->role)`. While currently mitigated by `RegisterRequest` validation (`in:user,partner`), this pattern is inherently fragile and prone to future privilege escalation if validation rules are relaxed.
- **Architectural Debt**: Role assignment and token generation logic embedded in the controller instead of an `AuthService`.

## Dangerous Methods
- `register()`: Potentially unsafe role assignment if request validation is modified.

## Transaction Safety
SAFE

## Authorization Safety
MEDIUM (Protected by request validation whitelist)

## Validation Safety
SAFE (Uses `RegisterRequest`)

## Laravel Best Practices
FAIL (Business logic in controller)

## Production Ready
NO (Requires architectural refactor)

---

# Controller Audit: app/Http/Controllers/Api/V1/Dashboard/Partner/DashboardController.php

### Controller Purpose
Unified performance and analytics dashboard for Marketplace Partners.

### Risk Level
MEDIUM

### Problems Found

### Performance
- **Query Bloat**: `getUnifiedRecentListings` executes 6 separate database queries for every page load (Properties, Events, Autos, Services, Classifieds, Jobs).
- **Optimization Needed**: Should use SQL `UNION` or a centralized `Listing` model to reduce database roundtrips.

### Architecture
- **Logic Debt**: Use of traits (`Listings`, `DashboardDataPreparation`) is a "Service-lite" pattern; should be moved to a dedicated `PartnerDashboardService`.

## Dangerous Methods
- `getUnifiedRecentListings()`: N+6 query pattern.

## Service Layer Opportunities
- Migrate to `App\Services\Api\PartnerDashboardService`.

## Transaction Safety
SAFE (Read-only)

## Authorization Safety
MEDIUM (Relies on route middleware)

## Validation Safety
PASS

## Laravel Best Practices
FAIL (Architecture debt)

## Production Ready
NO

---

# Controller Audit: app/Http/Controllers/Admin/AutoController.php

### Controller Purpose
Orchestrates the automotive vertical (listings, replication, status moderation).

### Risk Level
MEDIUM

### Problems Found

### Architecture
- **Fat Controller**: `replicate` method and nested attribute syncing handled directly.
- **Service Layer**: Missing.

## Transaction Safety
UNSAFE

## Authorization Safety
UNSAFE

## Validation Safety
SAFE

## Laravel Best Practices
FAIL

## Production Ready
NO

---

# Controller Audit: app/Http/Controllers/Admin/EventController.php

### Controller Purpose
Orchestrates the event vertical (ticketing, occurrences, approvals).

### Risk Level
MEDIUM

### Problems Found

### Architecture
- **Fat Controller**: Handles replication and model lifecycle directly.
- **Service Layer**: Missing.

## Transaction Safety
UNSAFE

## Authorization Safety
UNSAFE

## Validation Safety
SAFE

## Laravel Best Practices
FAIL

## Production Ready
NO

---

# Controller Audit: app/Http/Controllers/Admin/JobController.php

### Controller Purpose
Recruitment vertical command center (listings, employer mapping).

### Risk Level
MEDIUM

### Problems Found

### Architecture
- **Fat Controller**: Logic for replication and application counting embedded in controller.
- **Service Layer**: Missing.

## Transaction Safety
UNSAFE

## Authorization Safety
UNSAFE

## Validation Safety
SAFE

## Laravel Best Practices
FAIL

## Production Ready
NO

---

# Controller Audit: app/Http/Controllers/HomeController.php

### Controller Purpose
Primary entry point for the marketplace landing experience.

### Risk Level
LOW

### Architecture
- **Proxy Pattern**: Delegates to `UnifiedHomeController`. Clean separation of routing entry from business logic.

## Production Ready
YES

---

# Controller Audit: app/Http/Controllers/UnifiedHomeController.php

### Controller Purpose
Dynamic multi-module landing page orchestration.

### Risk Level
LOW

### Architecture
- **Service Layer**: Excellent delegation to `HomeDataService`.

## Production Ready
YES

---

# Controller Audit: app/Http/Controllers/PageController.php

### Controller Purpose
Static content pages (About, FAQ, Privacy) and Contact form management.

### Risk Level
MEDIUM

### Problems Found

### CodeCanyon Compliance
- **Incomplete Functionality**: `sendContact` is a stub (L47-49). It returns success without actually processing the message or sending notifications. This is a critical rejection risk for marketplace products.

### Architecture
- **Logic Debt**: Contact processing should be moved to a `ContactService` or `MailAction`.

## Production Ready
NO (Requires contact logic implementation)

---

# Controller Audit: app/Http/Controllers/BlogController.php

### Controller Purpose
Public blog article discovery and rendering.

### Risk Level
LOW

### Architecture
- **Service Layer**: Perfect delegation to `BlogService`.
- **Validation**: Uses `SearchBlogRequest`.

## Production Ready
YES

---

# Controller Audit: app/Http/Controllers/Admin/ServiceController.php

### Controller Purpose
Orchestrates the professional services vertical (listings, providers, quotes).

### Risk Level
MEDIUM

### Problems Found

### Architecture
- **Missing Service Layer**: Direct model interaction and replication logic.
- **Fat Controller**: Handles professional parameters and quote metrics directly.

## Transaction Safety
UNSAFE

## Authorization Safety
UNSAFE

## Validation Safety
SAFE

## Laravel Best Practices
FAIL

## Production Ready
NO

---

# Controller Audit: app/Http/Controllers/Admin/ReportController.php

### Controller Purpose
Analytical hub for financial trends, revenue analysis, and vertical performance.

### Risk Level
MEDIUM

### Problems Found

### Architecture
- **Logic Bloat**: The controller is responsible for complex KPI calculations, date range sanitation, and trend data formatting.
- **Missing Service Layer**: All analytical logic is trapped inside private methods; not reusable for API or CLI reporting.

### Performance
- **Query Density**: Multiple heavy queries in a single request without caching mechanisms.

## Dangerous Methods
- `payments()`: Direct `DB::raw` usage and multiple aggregate queries.

## Service Layer Opportunities
- Migrate to `App\Services\AnalyticsService`.

## Transaction Safety
SAFE (Read-only)

## Authorization Safety
UNSAFE (Missing Policies)

## Validation Safety
MEDIUM (Manual date parsing)

## Laravel Best Practices
FAIL (Violation of Separation of Concerns)

## Production Ready
NO

---

# Controller Audit: app/Http/Controllers/Admin/RoleController.php

### Controller Purpose
Administrative security archetypes and RBAC management.

### Risk Level
LOW

### Problems Found

### Security
- **Authorization**: Excellent use of Policies.

### Architecture
- **Validation**: Inline validation in `store`/`update`. Move to `RoleRequest`.

## Transaction Safety
SAFE

## Authorization Safety
SAFE

## Validation Safety
MEDIUM (Inline rules)

## Laravel Best Practices
PASS

## Production Ready
YES

---

# Controller Audit: app/Http/Controllers/Admin/CategoryController.php

### Controller Purpose
Manates the platform's multi-level taxonomy and vertical-specific categorization.

### Risk Level
LOW

### Architecture
- **Service Layer**: Excellent delegation to `CategoryManagementService`.
- **Validation**: Uses `CategoryRequest` with robust authorization checks.

## Production Ready
YES

---

# Controller Audit: app/Http/Controllers/Admin/LocationController.php

### Controller Purpose
Administrative management of geographical locations and regional metadata.

### Risk Level
LOW

### Architecture
- **Service Layer**: Excellent delegation to `LocationManagementService`.

## Production Ready
YES

---

# Controller Audit: app/Http/Controllers/AutoController.php

### Controller Purpose
Public automotive discovery and vehicle detail orchestration.

### Risk Level
LOW

### Architecture
- **Service Layer**: Excellent delegation to `AutoService`.
- **Validation**: Uses `SearchAutoRequest`.

## Production Ready
YES

---

# Controller Audit: app/Http/Controllers/ClassifiedController.php

### Controller Purpose
Public classified listings discovery and detailed viewing.

### Risk Level
LOW

### Architecture
- **Service Layer**: Excellent delegation to `ClassifiedManagementService`.

## Production Ready
YES

---

# Controller Audit: app/Http/Controllers/Admin/ActivityLogController.php

### Controller Purpose
Orchestrates the administrative audit trail across heterogeneous marketplace verticals.

### Risk Level
LOW

### Problems Found
- **Logic Debt**: The localized filter registry (models mapping) is hardcoded in the constructor (L44-83). This creates a high maintenance burden for new marketplace modules.
- **Authorization**: Hardcoded role check (`super-admin`) in `clearLog` instead of using Policies.

## Controller Audit: app/Http/Controllers/Admin/BookingController.php

### Controller Purpose
Centralized administrative hub for managing inquiries and bookings across all verticals.

### Risk Level
MEDIUM

### Problems Found
- **Security Gap**: Dynamic model instantiation (L75) lacks a whitelist. An attacker could potentially probe for other model classes by manipulating the `type` parameter.
- **Authorization**: Missing formal Policies for unified management.
- **Architecture**: Collection decoration logic (L50-61) should be encapsulated in a Resource or Service.

## Controller Audit: app/Http/Controllers/Admin/AddonController.php

### Controller Purpose
Administrative management of marketplace supplements and extra offerings.

### Risk Level
LOW

### Problems Found
- **Validation**: Inline validation used instead of FormRequests.
- **Authorization**: Missing Policy checks.

## Controller Audit: app/Http/Controllers/Admin/OrderController.php

### Controller Purpose
Orchestrates the administrative lifecycle of product orders, managing fulfillment and inventory synchronization.

### Risk Level
MEDIUM

### Problems Found
- **Fat Controller**: `store` method (L65-122) contains excessive business logic, including manual stock decrement and unique identifier generation (`ORD-` random string).
- **Architecture**: Order fulfillment and notification logic should be abstracted into an `OrderService`.
- **Authorization**: Missing Policy checks for sensitive fulfillment operations.

---

# Overall Controllers Audit Summary

## Security Score: 3/10
## Architecture Score: 7/10
## Scalability Score: 6/10
## Performance Score: 7/10
## Maintainability Score: 6/10
## API Quality Score: 9/10

## CodeCanyon Readiness: CRITICAL RISK (Rejection Likely)

## Most Dangerous Controllers
- `Http\Controllers\CheckoutController.php` (Price Manipulation)
- `Http\Controllers\EventBookingController.php` (Price Manipulation)
- `Http\Controllers\PropertyBookingController.php` (IDOR / Ownership)
- `Api\V1\Auth\AuthController.php` (Fragile Role Assignment)
- `Admin\SettingController.php` (Logic bloat & Security exposure)
- `Admin\ReportController.php` (Deep logic debt)
- `PageController.php` (Stub logic / Incomplete feature)
- `Admin\BookingController.php` (Dynamic Model Risk)
- `Admin\OrderController.php` (Fat Controller / Coupled Inventory)
