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
ProductController,
OrderController,
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
ThemeController,
EmailTemplateController,
AdvertisementController,
NewsletterSubscriberController,
NotificationController,
ReportController,
TicketController,
SettingController,
SystemController,
GalleryController
};

// Global Dashboard Controllers
use App\Http\Controllers\Dashboard\MediaController;

/* |-------------------------------------------------------------------------- | Admin Dashboard Routes |-------------------------------------------------------------------------- */

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'role:admin|super-admin|moderator'])
    ->group(function () {

        Route::get('/', function () {
            return redirect()->route('admin.welcome');
        });

        /**
     * 1. DASHBOARD & SYSTEM ACTIVITY
     */
        Route::get('/welcome', [DashboardController::class , 'index'])->name('welcome');
        Route::get('/dashboard/ecommerce', [DashboardController::class , 'ecommerceIndex'])->name('dashboard.ecommerce');

        Route::controller(NotificationController::class)->prefix('notifications')->name('notifications')->group(function () {
            Route::get('/', 'index');
            Route::post('/read-all', 'markAllRead')->name('.readall');
        }
        );

        Route::controller(ActivityLogController::class)->prefix('activity-log')->name('activity-log.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::delete('/clear', 'clearLog')->name('clear');
        }
        );

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
        }
        );

        // Dedicated Vertical List Pages
        // Route::get('autos/{status?}', [ListingController::class , 'index'])->defaults('type', 'auto')->name('autos.index');
        Route::get('autos/{auto}/duplicate', [\App\Http\Controllers\Admin\AutoController::class, 'duplicate'])->name('autos.duplicate')->middleware('module:autos');
        Route::resource('autos', \App\Http\Controllers\Admin\AutoController::class)->middleware('module:autos');
        // Route::get('events/{status?}', [ListingController::class , 'index'])->defaults('type', 'event')->name('events.index');
        Route::get('events/{event}/duplicate', [\App\Http\Controllers\Admin\EventController::class, 'duplicate'])->name('events.duplicate')->middleware('module:events');
        Route::resource('events', \App\Http\Controllers\Admin\EventController::class)->middleware('module:events');
        // Route::get('jobs/{status?}', [ListingController::class , 'index'])->defaults('type', 'joblisting')->name('jobs.index');
        Route::get('jobs/{job}/duplicate', [\App\Http\Controllers\Admin\JobController::class, 'duplicate'])->name('jobs.duplicate')->middleware('module:jobs');
        Route::resource('jobs', \App\Http\Controllers\Admin\JobController::class)->middleware('module:jobs');
        // Route::get('services/{status?}', [ListingController::class , 'index'])->defaults('type', 'service')->name('services.index');
        Route::get('services/{service}/duplicate', [\App\Http\Controllers\Admin\ServiceController::class, 'duplicate'])->name('services.duplicate')->middleware('module:services');
        Route::resource('services', \App\Http\Controllers\Admin\ServiceController::class)->middleware('module:services');
        // Route::get('classifieds/{status?}', [ListingController::class , 'index'])->defaults('type', 'classified')->name('classifieds.index');
        Route::get('classifieds/{classified}/duplicate', [\App\Http\Controllers\Admin\ClassifiedController::class, 'duplicate'])->name('classifieds.duplicate')->middleware('module:classifieds');
        Route::resource('classifieds', \App\Http\Controllers\Admin\ClassifiedController::class)->middleware('module:classifieds');
        // Route::get('properties/{status?}', [ListingController::class , 'index'])->defaults('type', 'property')->name('properties.index');

        Route::get('properties/{property}/duplicate', [PropertyController::class , 'duplicate'])->name('properties.duplicate')->middleware('module:properties');
        Route::resource('properties', PropertyController::class)->middleware('module:properties');
        Route::resource('products', ProductController::class)->middleware('module:products');
        
        Route::controller(OrderController::class)->prefix('product-orders')->name('product-orders.')->middleware('module:products')->group(function () {
            Route::post('/{order}/status', 'updateStatus')->name('update-status');
        });
        Route::resource('product-orders', OrderController::class)->middleware('module:products');

        /**
     * 3. SALES, BOOKINGS & FINANCE
     */
        Route::controller(BookingController::class)->prefix('bookings')->name('bookings.')->group(function () {
            // Dedicated Category Views (Pills Grouping equivalent)
            Route::get('/properties/{status?}', [PropertyBookingController::class, 'index'])->name('properties')->middleware('module:properties');
            Route::get('/autos/{status?}', [AutoInquiryController::class, 'index'])->name('autos')->middleware('module:autos');
            Route::get('/events/{status?}', [EventBookingController::class, 'index'])->name('events')->middleware('module:events');
            Route::get('/jobs/{status?}', [JobApplicationController::class, 'index'])->name('jobs')->middleware('module:jobs');
            Route::get('/services/{status?}', [ServiceQuoteController::class, 'index'])->name('services')->middleware('module:services');
            Route::get('/classifieds/{status?}', [ClassifiedInquiryController::class, 'index'])->name('classifieds')->middleware('module:classifieds');

            Route::get('/show/{type}/{id}', 'show')->name('show');
            Route::delete('/destroy/{type}/{id}', 'destroy')->name('destroy');

            Route::get('/{status?}', 'index')->name('index')->where('status', '^(?!properties|autos|events|jobs|services|classifieds).*$');
        }
        );

        Route::resource('property-bookings', PropertyBookingController::class)->middleware('module:properties');
        Route::resource('auto-inquiries', AutoInquiryController::class)->middleware('module:autos');
        Route::resource('event-bookings', EventBookingController::class)->middleware('module:events');
        Route::resource('job-applications', JobApplicationController::class)->middleware('module:jobs');
        Route::resource('service-quotes', ServiceQuoteController::class)->middleware('module:services');
        Route::resource('service-appointments', ServiceAppointmentController::class)->middleware('module:services');
        Route::resource('classified-inquiries', ClassifiedInquiryController::class)->middleware('module:classifieds');

        Route::resource('transactions', TransactionController::class);

        Route::middleware('can:manage-withdrawals')->prefix('withdrawals')->name('withdrawals.')->group(function () {
            Route::controller(WithdrawalController::class)->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('/pending', 'pending')->name('pending');
                    Route::get('/failed', 'failed')->name('failed');
                    Route::post('/{withdrawal}/approve', 'approve')->name('approve');
                    Route::post('/{withdrawal}/reject', 'reject')->name('reject');
                }
                );
            }
            );

            /**
         * 4. USER & ACCESS CONTROL (RBAC)
         */
            Route::controller(UserController::class)->middleware('can:manage-users')->group(function () {
            Route::get('users/buyers', 'buyers')->name('users.buyers');
            Route::get('users/partners', 'partners')->name('users.partners');
            Route::post('users/{user}/approve', 'approve')->name('users.approve');
        }
        );

        Route::controller(ProfileController::class)->group(function () {
            Route::get('profile/edit', 'edit')->name('profile.edit');
            Route::put('profile/update', 'update')->name('profile.update');
        }
        );

        Route::resource('users', UserController::class)->middleware('can:manage-users');

        Route::middleware('can:app-settings')->group(function () {
            Route::resource('roles', RoleController::class);
            Route::resource('permissions', PermissionController::class);

            Route::controller(SettingController::class)->prefix('settings')->name('settings.')->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('/group/{section}', 'getSection')->name('group');
                    Route::post('/group/{section}/update', 'updateSection')->name('update.group');
                }
                );

            });


        Route::controller(SystemController::class)->prefix('system')->name('system.')->group(function () {
            Route::get('/maintenance', 'maintenance')->name('maintenance');
            Route::post('/cache/clear', 'clearCache')->name('cache.clear');
            Route::post('/config/clear', 'clearConfig')->name('config.clear');
            Route::post('/route/clear', 'clearRoute')->name('route.clear');
            Route::post('/view/clear', 'clearView')->name('view.clear');
            Route::post('/optimize', 'optimize')->name('optimize');
            Route::post('/storage-link', 'storageLink')->name('storage.link');
            Route::post('/media/regenerate', 'regenerateMedia')->name('media.regenerate');
        });

        Route::resource('gallery', GalleryController::class)->except(['create', 'show', 'edit']);
        
        // --- 5. CMS, BLOGS, THEMES & MARKETING ---


            /**
         * 5. CMS, BLOGS, THEMES & MARKETING
         */
            // Blog Management Routes
            Route::get('blogs/pending', [BlogController::class , 'pending'])->name('blogs.pending');
            Route::resource('blogs', BlogController::class);

            // Page Management Routes
            Route::resource('pages', PageController::class);
            Route::get('pages/type/{type}', [PageController::class , 'index'])->name('pages.index.type');

            Route::controller(PageBuilderController::class)->prefix('page-builder')->name('page-builder.')->group(function () {
            Route::get('/{id}', 'edit')->name('edit');
            Route::post('/{id}', 'update')->name('update');
        }
        );

        Route::controller(ContentController::class)->prefix('content')->name('content.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/{page}/{theme_key?}', 'editPage')->name('edit');
            Route::get('/edit/item/{id}', 'editItem')->name('edit.item');
            Route::post('/update', 'bulkUpdate')->name('bulk_update');
        }
        );

        Route::controller(MenuController::class)->prefix('menu')->name('menu.')->group(function () {
            Route::get('/{theme?}', 'index')->name('index');
            Route::get('/{menu}/edit', 'edit')->name('edit');
            Route::post('/{menu}/update', 'updateStructure')->name('update_structure');
            Route::delete('/items/{item}', 'deleteItem')->name('delete_item');
            Route::put('/items/{item}', 'updateItem')->name('update_item');
        }
        );

        Route::resource('email-templates', EmailTemplateController::class)->except(['create', 'store', 'destroy'])->middleware('can:app-settings');
        Route::resource('advertisements', AdvertisementController::class);
        Route::get('newsletter-subscribers/export', [NewsletterSubscriberController::class, 'export'])->name('newsletter-subscribers.export');
        Route::resource('newsletter-subscribers', NewsletterSubscriberController::class);

        /**
     * 6. SUBSCRIPTIONS & GATEWAYS
     */
        Route::get('plans/{plan}/duplicate', [PlanController::class , 'duplicate'])->name('plans.duplicate')->middleware('can:app-settings');
        Route::resource('plans', PlanController::class)->middleware('can:app-settings');

        Route::controller(SubscriptionController::class)->middleware('can:app-settings')->prefix('subscriptions')->name('subscriptions.')->group(function () {
            Route::post('/{subscription}/renew', 'renew')->name('renew');
            Route::get('/active', 'index')->name('active')->defaults('status', 'active');
            Route::get('/pending', 'index')->name('pending')->defaults('status', 'pending');
        }
        );
        Route::resource('subscriptions', SubscriptionController::class)->middleware('can:app-settings');

        Route::prefix('payments')->name('payments.')->group(function () {
            Route::get('/', [PaymentController::class , 'index'])->name('index');
            Route::get('/failed', [PaymentController::class , 'failed'])->name('failed');
            Route::get('/duplicate', [PaymentController::class , 'duplicate'])->name('duplicate');
        }
        );
        Route::resource('payments', PaymentController::class)->except(['index']);

        Route::resource('subscription-quotas', SubscriptionQuotaController::class)->only(['index', 'edit', 'update'])->middleware('can:app-settings');
        Route::post('subscription-quotas/{subscriptionQuota}/reset', [SubscriptionQuotaController::class , 'reset'])->name('subscription-quotas.reset')->middleware('can:app-settings');

        Route::controller(PaymentGatewayController::class)->middleware('can:app-settings')->prefix('payment-gateways')->name('payment-gateways.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/{gateway}/edit', 'edit')->name('edit');
            Route::put('/{gateway}', 'update')->name('update');
        }
        );

        /**
     * 7. ANALYTICS & APPEARANCE
     */
        Route::controller(ReportController::class)->prefix('reports')->name('reports.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/bookings', 'bookings')->name('bookings');
            Route::get('/payments', 'payments')->name('payments');
            Route::get('/properties', 'properties')->name('properties');
        }
        );
        Route::get('payments-report', [ReportController::class , 'payments'])->name('payments_report');

        Route::controller(ThemeController::class)->middleware('can:app-settings')->prefix('themes')->name('themes.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/{theme}/edit', 'edit')->name('edit');
            Route::post('/{theme}/update', 'update')->name('update');
            Route::post('/{theme}/activate', 'activate')->name('activate');
        }
        );

        /**
         * 7. SUPPORT TICKETS
         */
        Route::controller(TicketController::class)->prefix('tickets')->name('tickets.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/{ticket}', 'show')->name('show');
            Route::post('/{ticket}/reply', 'reply')->name('reply');
            Route::post('/{ticket}/status', 'updateStatus')->name('status');
        }
        );

        /**
     * 8. GLOBAL ATTRIBUTES
     */
        Route::resources([
            'types' => TypeController::class ,
            'categories' => CategoryController::class ,
            'brands' => BrandController::class ,
            'locations' => LocationController::class ,
            'amenities' => AmenityController::class ,
            'features' => FeatureController::class ,
            'tags' => TagController::class ,
            'booking-line-items' => BookingLineItemController::class ,
            'line-items' => LineItemController::class ,
            'addons' => AddonController::class ,
        ]);
    });

/**
 * SECTION: GLOBAL ASSETS
 */
Route::post('/upload-image', [MediaController::class , 'upload'])->name('upload.image');
Route::post('/admin/delete-image', [MediaController::class , 'delete'])->name('delete.image');