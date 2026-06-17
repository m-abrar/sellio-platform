<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Dashboard\MediaController;
use App\Http\Controllers\Api\V1\Dashboard\Partner\{
    DashboardController,
    AnalyticsController,
    ActivityController,
    ProfileController,
    MessageController,
    ReviewController,
    PropertyController,
    AutoController,
    EventController,
    ServiceController,
    JobListingController,
    ClassifiedController,
    ProductController,
    PropertyBookingController,
    PropertyVisitController,
    AutoInquiryController,
    EventBookingController,
    ServiceQuoteController,
    ServiceAppointmentController,
    JobApplicationController,
    ClassifiedInquiryController,
    PlanController,
    SubscriptionController,
    PaymentController,
    WalletController,
    PayoutMethodController,
    NotificationController,
    CustomerController
};

/*
|--------------------------------------------------------------------------
| Partner Dashboard API Routes
|--------------------------------------------------------------------------
*/

/**
 * 1. CORE & ANALYTICS
 */
Route::get('welcome', [DashboardController::class, 'index']);
Route::get('analytics', [AnalyticsController::class, 'index']);
Route::get('analytics/listing/{type}/{id}', [AnalyticsController::class, 'listingAnalytics']);
Route::get('activities', [ActivityController::class, 'index']);

Route::prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);
    Route::post('read-all', [NotificationController::class, 'markAllAsRead']);
    Route::patch('{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('{notification}', [NotificationController::class, 'destroy']);
});

Route::prefix('customers')->group(function () {
    Route::get('/', [CustomerController::class, 'index']);
    Route::get('{customerKey}', [CustomerController::class, 'show']);
});

/**
 * 2. LEAD & INQUIRY MANAGEMENT
 */
Route::prefix('leads')->group(function () {
    // Real Estate
    Route::get('properties/bookings', [PropertyBookingController::class, 'index']);
    Route::get('properties/bookings/{propertyBooking}', [PropertyBookingController::class, 'show']);
    Route::get('properties/visits', [PropertyVisitController::class, 'index']);

    // Automotive
    Route::get('autos/inquiries', [AutoInquiryController::class, 'index']);

    // Events
    Route::get('events/bookings', [EventBookingController::class, 'index']);

    // Services
    Route::get('services/quotes', [ServiceQuoteController::class, 'index']);
    Route::get('services/appointments', [ServiceAppointmentController::class, 'index']);

    // Classifieds
    Route::get('classifieds/inquiries', [ClassifiedInquiryController::class, 'index']);

    // Job Applications
    Route::get('joblistings/applications', [JobApplicationController::class, 'index']);
    Route::patch('joblistings/applications/{jobApplication}', [JobApplicationController::class, 'update']);
});

/**
 * 3. LISTING RESOURCES (CRUD)
 */
Route::get('products/slug/{slug}', [ProductController::class, 'edit']);
Route::get('properties/form-data', [PropertyController::class, 'create']);
Route::get('properties/slug/{slug}', [PropertyController::class, 'show']);
Route::get('autos/form-data', [AutoController::class, 'create']);
Route::get('autos/slug/{slug}', [AutoController::class, 'show']);
Route::get('events/form-data', [EventController::class, 'create']);
Route::get('events/slug/{slug}', [EventController::class, 'show']);
Route::get('services/form-data', [ServiceController::class, 'create']);
Route::get('services/slug/{slug}', [ServiceController::class, 'show']);
Route::get('joblistings/form-data', [JobListingController::class, 'create']);
Route::get('joblistings/slug/{slug}', [JobListingController::class, 'show']);
Route::get('classifieds/form-data', [ClassifiedController::class, 'create']);
Route::get('classifieds/slug/{slug}', [ClassifiedController::class, 'show']);
Route::apiResources([
    'products'    => ProductController::class,
    'properties'  => PropertyController::class,
    'autos'       => AutoController::class,
    'events'      => EventController::class,
    'services'    => ServiceController::class,
    'joblistings' => JobListingController::class,
    'classifieds' => ClassifiedController::class,
]);

/**
 * 4. FINANCIALS & WALLET
 */
Route::get('payments', [PaymentController::class, 'index']);
Route::apiResource('plans', PlanController::class)->only(['index', 'show']);
Route::get('subscriptions/checkout', [SubscriptionController::class, 'checkout']);
Route::get('subscriptions/confirm', [SubscriptionController::class, 'confirmCheckout']);
Route::apiResource('subscriptions', SubscriptionController::class)->only(['index', 'store', 'destroy']);

Route::prefix('wallet')->group(function () {
    Route::get('overview', [WalletController::class, 'overview']);
    Route::get('history', [WalletController::class, 'history']);
    Route::get('withdrawals', [WalletController::class, 'withdrawals']);
    Route::post('withdraw', [WalletController::class, 'processWithdrawal']);
    Route::post('deposit', [WalletController::class, 'deposit']);
});

Route::prefix('payout-methods')->group(function () {
    Route::get('/', [PayoutMethodController::class, 'index']);
    Route::post('/', [PayoutMethodController::class, 'store']);
    Route::delete('{payoutMethod}', [PayoutMethodController::class, 'destroy']);
    Route::patch('{payoutMethod}/primary', [PayoutMethodController::class, 'setPrimary']);
});

/**
 * 5. REVIEWS, MESSAGING & MEDIA
 */
Route::prefix('reviews')->group(function () {
    Route::get('/', [ReviewController::class, 'index']);
    Route::post('{review}/reply', [ReviewController::class, 'reply']);
    Route::post('{review}/toggle-featured', [ReviewController::class, 'toggleFeatured']);
});

Route::prefix('messages')->group(function () {
    Route::get('/', [MessageController::class, 'index']);
    Route::get('{conversationId}', [MessageController::class, 'show']);
    Route::post('{conversationId}', [MessageController::class, 'sendMessage']);
    Route::patch('{conversationId}/read', [MessageController::class, 'markRead']);
    Route::post('{conversationId}/typing', [MessageController::class, 'typing']);
});

// Media (Spatie Integration)
Route::post('media/upload', [MediaController::class, 'upload']);
Route::delete('media/{media}', [MediaController::class, 'delete']);

/**
 * 6. PROFILE & SETTINGS
 */
Route::prefix('profile')->group(function () {
    Route::get('/', [ProfileController::class, 'edit']);
    Route::patch('/', [ProfileController::class, 'update']);
    Route::delete('/', [ProfileController::class, 'destroy']);
});
