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
        Route::delete('{favorite}', [FavoriteController::class, 'remove'])->name('remove'); // Changed to DELETE for REST
    });

    // Bookings & Orders
    Route::get('bookings', [BookingController::class, 'index'])->name('bookings.index');

    // Reviews
    Route::resource('reviews', ReviewController::class)->only(['index', 'show', 'edit', 'update', 'destroy']);

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
        Route::post('{conversationId}', [MessageController::class, 'sendMessage'])->name('send');
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
