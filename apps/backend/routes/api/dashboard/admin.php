<?php

use Illuminate\Support\Facades\Route;

// --- ADMIN DASHBOARD CONTROLLERS ---
use App\Http\Controllers\Admin\{
    // 1. Core System & Auth
    DashboardController,
    UserController,
    ProfileController,
    RoleController,
    PermissionController,
    ActivityLogController,

    // 2. Main Resources
    PropertyController,
    ListingController,
    TypeController,
    CategoryController,
    BrandController,
    AmenityController,
    FeatureController,
    TagController,
    LocationController,

    // 3. Bookings & Financials
    BookingController,
    PropertyBookingController,
    BookingLineItemController,
    LineItemController,
    AddonController,
    TransactionController,
    WithdrawalController,

    // 4. Inquiries
    AutoInquiryController,
    ClassifiedInquiryController,
    EventBookingController,
    JobApplicationController,
    ServiceAppointmentController,
    ServiceQuoteController,

    // 5. Subscription & Payments
    PlanController,
    SubscriptionController,
    SubscriptionQuotaController,
    PaymentController,
    PaymentGatewayController,

    // 6. Content & Settings
    BlogController,
    PageController,
    PageBuilderController,
    ContentController,
    MenuController,
    ApplicationController,
    ThemeController,
    EmailTemplateController,
    AdvertisementController,
    NewsletterSubscriberController,
    NotificationController,
    ReportController,
    SettingController
};

// Global Dashboard Controllers
use App\Http\Controllers\Dashboard\MediaController;

/*
|--------------------------------------------------------------------------
| Admin Dashboard Routes
|--------------------------------------------------------------------------
*/

Route::name('dashboard.admin.')->group(function () {

    /**
     * 1. DASHBOARD & SYSTEM ACTIVITY
     */
    Route::get('/welcome', [DashboardController::class, 'index'])->name('welcome');

    Route::controller(NotificationController::class)->prefix('notifications')->name('notifications')->group(function () {
        Route::get('/', 'index'); 
        Route::post('/read-all', 'markAllRead')->name('.readall');
    });

    Route::controller(ActivityLogController::class)->prefix('activity-log')->name('activity-log.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::delete('/clear', 'clearLog')->name('clear');
    });

    /**
     * 2. LISTING & INVENTORY MANAGEMENT
     */
    Route::controller(ListingController::class)->prefix('listings')->name('listings.')->group(function () {
        Route::get('/{status?}', 'index')->name('index');
        Route::get('/{type}/{id}', 'edit')->name('edit');
        Route::get('/{type}/{id}/edit', 'editByType')->name('edit.type');
        Route::delete('/{type}/{id}', 'destroy')->name('destroy');
        Route::post('/{type}/{id}/approve', 'approve')->name('approve');
        Route::post('/{type}/{id}/disapprove', 'disapprove')->name('disapprove');
    });

    Route::get('properties/{property}/duplicate', [PropertyController::class, 'duplicate'])->name('properties.duplicate');
    Route::resource('properties', PropertyController::class);

    /**
     * 3. SALES, BOOKINGS & FINANCE
     */
    Route::controller(BookingController::class)->prefix('bookings')->name('bookings.')->group(function () {
        Route::get('/{status?}', 'index')->name('index'); 
        Route::get('/show/{type}/{id}', 'show')->name('show');
        Route::delete('/destroy/{type}/{id}', 'destroy')->name('destroy');
    });

    Route::resource('property-bookings', PropertyBookingController::class);
    Route::resource('auto-inquiries', AutoInquiryController::class);
    Route::resource('event-bookings', EventBookingController::class);
    Route::resource('job-applications', JobApplicationController::class);
    Route::resource('service-quotes', ServiceQuoteController::class);
    Route::resource('service-appointments', ServiceAppointmentController::class);
    Route::resource('classified-inquiries', ClassifiedInquiryController::class);
    
    Route::resource('transactions', TransactionController::class);

    Route::middleware('can:manage-withdrawals')->prefix('withdrawals')->name('withdrawals.')->group(function () {
        Route::controller(WithdrawalController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/pending', 'pending')->name('pending');
            Route::get('/failed', 'failed')->name('failed');
            Route::post('/{withdrawal}/approve', 'approve')->name('approve');
            Route::post('/{withdrawal}/reject', 'reject')->name('reject');
        });
    });

    /**
     * 4. USER & ACCESS CONTROL (RBAC)
     */
    Route::controller(UserController::class)->group(function () {
        Route::get('users/buyers', 'buyers')->name('users.buyers');
        Route::get('users/partners', 'partners')->name('users.partners');
    });

    Route::controller(ProfileController::class)->group(function () {
        Route::get('profile/edit', 'edit')->name('profile.edit');
        Route::put('profile/update', 'update')->name('profile.update');
    });

    Route::resource('users', UserController::class);

    Route::middleware('role:super-admin')->group(function () {
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
        
        Route::controller(SettingController::class)->prefix('settings')->name('settings.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/group/{section}', 'getSection')->name('group');
            Route::post('/group/{section}/update', 'updateSection')->name('update.group');
        });
    });

    /**
     * 5. CMS, BLOGS, THEMES & MARKETING
     */
    // Blog Management Routes
    Route::get('blogs/pending', [BlogController::class, 'pending'])->name('blogs.pending');
    Route::resource('blogs', BlogController::class);

    // Page Management Routes
    Route::resource('pages', PageController::class);
    Route::get('pages/type/{type}', [PageController::class, 'index'])->name('pages.index.type');

    Route::middleware('role:super-admin')->controller(PageBuilderController::class)->prefix('page-builder')->name('page-builder.')->group(function () {
        Route::get('/{id}', 'edit')->name('edit');
        Route::post('/{id}', 'update')->name('update');
    });

    Route::controller(ContentController::class)->prefix('content')->name('content.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/edit/item/{id}', 'editItem')->name('edit.item');
        Route::get('/{page}/{theme_key?}', 'editPage')->name('edit');
        Route::post('/update', 'bulkUpdate')->name('bulk_update');
    });

    Route::controller(MenuController::class)->prefix('menu')->name('menu.')->group(function () {
        Route::get('/{theme?}', 'index')->name('index');
        Route::get('/{menu}/edit', 'edit')->name('edit');
        Route::post('/{menu}/update', 'updateStructure')->name('update_structure');
        Route::delete('/items/{item}', 'deleteItem')->name('delete_item');
        Route::put('/items/{item}', 'updateItem')->name('update_item');
    });

    Route::resource('email-templates', EmailTemplateController::class)->except(['create', 'store', 'destroy']);
    Route::resource('advertisements', AdvertisementController::class);
    Route::resource('newsletter-subscribers', NewsletterSubscriberController::class);

    /**
     * 6. SUBSCRIPTIONS & GATEWAYS
     */
    Route::get('plans/{plan}/duplicate', [PlanController::class, 'duplicate'])->name('plans.duplicate');
    Route::resource('plans', PlanController::class);

    Route::controller(SubscriptionController::class)->prefix('subscriptions')->name('subscriptions.')->group(function () {
        Route::post('/{subscription}/renew', 'renew')->name('renew');
        Route::get('/active', 'index')->name('active')->defaults('status', 'active');
        Route::get('/pending', 'index')->name('pending')->defaults('status', 'pending');
    });
    Route::resource('subscriptions', SubscriptionController::class);

    Route::prefix('payments')->name('payments.')->group(function() {
        Route::get('/', [PaymentController::class, 'index'])->name('index');
        Route::get('/failed', [PaymentController::class, 'failed'])->name('failed');
        Route::get('/duplicate', [PaymentController::class, 'duplicate'])->name('duplicate');
    });
    Route::resource('payments', PaymentController::class)->except(['index']);

    Route::resource('subscription-quotas', SubscriptionQuotaController::class)->only(['index', 'edit', 'update']);
    Route::post('subscription-quotas/{subscriptionQuota}/reset', [SubscriptionQuotaController::class, 'reset'])->name('subscription-quotas.reset');

    Route::controller(PaymentGatewayController::class)->prefix('payment-gateways')->name('payment-gateways.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{gateway}/edit', 'edit')->name('edit');
        Route::put('/{gateway}', 'update')->name('update');
    });

    /**
     * 7. ANALYTICS & APPEARANCE
     */
    Route::controller(ReportController::class)->prefix('reports')->name('reports.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/bookings', 'bookings')->name('bookings');
        Route::get('/payments', 'payments')->name('payments');
        Route::get('/properties', 'properties')->name('properties');
    });
    Route::get('payments-report', [ReportController::class, 'payments'])->name('payments_report');

    Route::controller(ThemeController::class)->prefix('themes')->name('themes.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{id}/edit', 'edit')->name('edit');
        Route::post('/{id}/update', 'update')->name('update');
        Route::post('/{id}/activate', 'activate')->name('activate');
    });

    /**
     * 8. GLOBAL ATTRIBUTES
     */
    Route::resources([
        'types'              => TypeController::class,
        'categories'         => CategoryController::class,
        'brands'             => BrandController::class,
        'locations'          => LocationController::class,
        'amenities'          => AmenityController::class,
        'features'           => FeatureController::class,
        'tags'               => TagController::class,
        'booking-line-items' => BookingLineItemController::class,
        'line-items'         => LineItemController::class,
        'addons'             => AddonController::class,
    ]);
});

/**
 * SECTION: GLOBAL ASSETS
 */
Route::post('/upload-image', [MediaController::class, 'upload'])->name('upload.image');
Route::post('/delete-image', [MediaController::class, 'delete'])->name('delete.image');