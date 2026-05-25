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
    WalletController
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
Route::get('activities', [ActivityController::class, 'index']);

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

    // Job Applications
    Route::get('joblistings/applications', [JobApplicationController::class, 'index']);
    Route::patch('joblistings/applications/{jobApplication}', [JobApplicationController::class, 'update']);
});

/**
 * 3. LISTING RESOURCES (CRUD)
 */
Route::get('products/slug/{slug}', [ProductController::class, 'edit']);
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
Route::apiResource('subscriptions', SubscriptionController::class)->only(['index', 'store', 'destroy']);

Route::prefix('wallet')->group(function () {
    Route::get('overview', [WalletController::class, 'overview']);
    Route::get('history', [WalletController::class, 'history']);
    Route::post('withdraw', [WalletController::class, 'processWithdrawal']);
});

/**
 * 5. REVIEWS, MESSAGING & MEDIA
 */
Route::prefix('reviews')->group(function () {
    Route::get('/', [ReviewController::class, 'index']);
    Route::post('{review}/reply', [ReviewController::class, 'reply']);
});

Route::prefix('messages')->group(function () {
    Route::get('/', [MessageController::class, 'index']);
    Route::get('{conversationId}', [MessageController::class, 'show']);
    Route::post('{conversationId}', [MessageController::class, 'sendMessage']);
});

// Media (Spatie Integration)
Route::post('media/upload', [MediaController::class, 'upload']);
Route::delete('media/{media}', [MediaController::class, 'delete']);

/**
 * 6. PROFILE & SETTINGS
 */
Route::prefix('profile')->group(function () {
    Route::get('/', [ProfileController::class, 'show']); 
    Route::patch('/', [ProfileController::class, 'update']);
    Route::delete('/', [ProfileController::class, 'destroy']);
});
