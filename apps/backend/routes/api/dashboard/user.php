<?php

use Illuminate\Support\Facades\Route;

// --- USER (BUYER) DASHBOARD CONTROLLERS ---
use App\Http\Controllers\Api\V1\Dashboard\User\{
    // 1. Account & Engagement
    DashboardController,
    FavoriteController,
    ReviewController,
    MessageController,
    BookingController,
    NotificationController,
    PushTokenController,

    // 2. Lead & Inquiry Management
    AutoInquiryController,
    ServiceQuoteController,
    ServiceAppointmentController,
    JobApplicationController,
    ClassifiedInquiryController
};

// MediaController moved one level up to Dashboard
use App\Http\Controllers\Dashboard\MediaController;

/*
|--------------------------------------------------------------------------
| User Dashboard Routes (Buyer)
|--------------------------------------------------------------------------
| This file manages routes for the end-user/buyer profile.
| Focused on: Bookings, Favorites, Inquiries, and Messaging.
|
*/

Route::group([], function () {

    /**
     * 1. CORE DASHBOARD
     */
    Route::get('welcome', [DashboardController::class, 'welcome'])->name('welcome');
    Route::get('profile', [DashboardController::class, 'profile'])->name('profile');
    Route::put('profile', [DashboardController::class, 'updateProfile'])->name('profile.update');
    Route::get('settings', [DashboardController::class, 'settings'])->name('settings');

    /**
     * 2. ACTIVITY & ENGAGEMENT
     */
    // Favorites Management
    Route::prefix('favorites')->name('favorites.')->group(function () {
        Route::get('/', [FavoriteController::class, 'index'])->name('index');
        Route::get('status', [FavoriteController::class, 'status'])->name('status');
        Route::post('statuses', [FavoriteController::class, 'statuses'])->name('statuses');
        Route::post('/', [FavoriteController::class, 'store'])->name('store');
        Route::delete('{favorite}', [FavoriteController::class, 'remove'])->name('remove'); // Changed to DELETE for REST
    });

    // Bookings & Orders
    Route::get('bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::delete('bookings/{id}', [BookingController::class, 'cancel'])->name('bookings.cancel');

    // Reviews
    Route::resource('reviews', ReviewController::class)->only(['index', 'show', 'store', 'edit', 'update', 'destroy']);

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('read-all', [NotificationController::class, 'markAllAsRead']);
        Route::patch('{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('push-token', [PushTokenController::class, 'store']);
        Route::delete('push-token', [PushTokenController::class, 'destroy']);
        Route::delete('{notification}', [NotificationController::class, 'destroy']);
    });

    /**
     * 3. LEAD & INQUIRY TRACKING
     */
    Route::prefix('inquiries')->group(function () {
        Route::resource('applications', JobApplicationController::class);
        Route::resource('auto-inquiries', AutoInquiryController::class);
        Route::resource('service-quotes', ServiceQuoteController::class);
        Route::resource('service-appointments', ServiceAppointmentController::class);
        Route::resource('classified-inquiries', ClassifiedInquiryController::class);
    });

    /**
     * 4. MESSAGING & COMMUNICATIONS
     */
    Route::prefix('messages')->name('messages.')->group(function () {
        Route::get('{conversationId?}', [MessageController::class, 'index'])->name('index');
        Route::post('start', [MessageController::class, 'start'])->name('start');
        Route::post('{conversationId}', [MessageController::class, 'sendMessage'])->name('send');
        Route::patch('{conversationId}/read', [MessageController::class, 'markRead'])->name('read');
        Route::post('{conversationId}/typing', [MessageController::class, 'typing'])->name('typing')->middleware('throttle:30,1');
    });

    /**
     * 5. UTILITY & MEDIA
     */
    // AJAX Helpers
    // Route::get('events/render-occurrence-row', [EventController::class, 'renderOccurrenceRow'])->name('events.render-occurrence-row');

    // Profile Media Management
    Route::post('/upload-image', [MediaController::class, 'upload'])->name('upload.image');
    Route::post('/delete-image', [MediaController::class, 'delete'])->name('delete.image');

});
