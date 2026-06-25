<?php

/**
 * Routes for the Administrative Backend
 *
 * This file defines the core routing architecture for the Sellio administrative interface,
 * including dashboard analytics, resource management (Autos, Events, Jobs, Services,
 * Classifieds, Properties, Products), financial operations, user access control (RBAC),
 * and system configuration. All routes are protected by administrative middleware.
 */
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AddonController;
use App\Http\Controllers\Admin\AdvertisementController;
use App\Http\Controllers\Admin\AmenityController;
use App\Http\Controllers\Admin\AutoController;
use App\Http\Controllers\Admin\AutoInquiryController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\BookingLineItemController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ClassifiedController;
use App\Http\Controllers\Admin\ClassifiedInquiryController;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmailTemplateController;
use App\Http\Controllers\Admin\EventBookingController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\FeatureController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\JobApplicationController;
use App\Http\Controllers\Admin\JobController;
use App\Http\Controllers\Admin\LanguageController;
use App\Http\Controllers\Admin\LineItemController;
use App\Http\Controllers\Admin\ListingController;
use App\Http\Controllers\Admin\LocationController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\NewsletterSubscriberController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PageBuilderController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\PaymentGatewayController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\PropertyBookingController;
use App\Http\Controllers\Admin\PropertyController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SearchAnalyticsController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\ServiceAppointmentController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\ServiceQuoteController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SubscriptionController;
use App\Http\Controllers\Admin\SubscriptionQuotaController;
use App\Http\Controllers\Admin\SystemController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\ThemeController;
use App\Http\Controllers\Admin\TicketController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\TypeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WithdrawalController;
use App\Http\Controllers\Dashboard\MediaController;
use Illuminate\Support\Facades\Route;

Route::get('test-reach', function() { return "Global Reach Works"; });

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

        Route::controller(ActivityLogController::class)->prefix('activity-log')->name('activity-log.')->middleware('can:app-settings')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::delete('/clear', 'clearLog')->name('clear');
        }
        );

        /**
     * 2. LISTING & INVENTORY MANAGEMENT
     */
        Route::prefix('listings')->name('listings.')->group(function () {
            Route::get('/{status?}', [ListingController::class, 'index'])->name('index');
            Route::get('/{listing_type}/{listing_id}', [ListingController::class, 'edit'])->name('edit');
            Route::get('/{listing_type}/{listing_id}/analytics', [ListingController::class, 'analytics'])->name('analytics');
            Route::get('/{listing_type}/{listing_id}/edit', [ListingController::class, 'edit'])->name('edit.type');
            Route::delete('/{listing_type}/{listing_id}', [ListingController::class, 'destroy'])->name('destroy');
            Route::post('/{listing_type}/{listing_id}/approve', [ListingController::class, 'approve'])->name('approve');
            Route::post('/{listing_type}/{listing_id}/disapprove', [ListingController::class, 'disapprove'])->name('disapprove');
        });

        // Dedicated Vertical List Pages
        Route::middleware('can:manage-auto')->group(function () {
            Route::controller(AutoController::class)->prefix('autos')->name('autos.')->group(function () {
                Route::post('/{auto}/approve', 'approve')->name('approve');
                Route::post('/{auto}/disapprove', 'disapprove')->name('disapprove');
                Route::get('/{auto}/duplicate', 'duplicate')->name('duplicate');
            });
            Route::resource('autos', AutoController::class)->middleware('module:autos');
        });

        Route::middleware('can:manage-event')->group(function () {
            Route::controller(EventController::class)->prefix('events')->name('events.')->group(function () {
                Route::post('/{event}/approve', 'approve')->name('approve');
                Route::post('/{event}/disapprove', 'disapprove')->name('disapprove');
                Route::get('/{event}/duplicate', 'duplicate')->name('duplicate');
            });
            Route::resource('events', EventController::class)->middleware('module:events');
        });

        Route::middleware('can:manage-job')->group(function () {
            Route::controller(JobController::class)->prefix('jobs')->name('jobs.')->group(function () {
                Route::post('/{job}/approve', 'approve')->name('approve');
                Route::post('/{job}/disapprove', 'disapprove')->name('disapprove');
                Route::get('/{job}/duplicate', 'duplicate')->name('duplicate');
            });
            Route::resource('jobs', JobController::class)->middleware('module:jobs');
        });

        Route::middleware('can:manage-service')->group(function () {
            Route::controller(ServiceController::class)->prefix('services')->name('services.')->group(function () {
                Route::post('/{service}/approve', 'approve')->name('approve');
                Route::post('/{service}/disapprove', 'disapprove')->name('disapprove');
                Route::get('/{service}/duplicate', 'duplicate')->name('duplicate');
            });
            Route::resource('services', ServiceController::class)->middleware('module:services');
        });

        Route::middleware('can:manage-classified')->group(function () {
            Route::controller(ClassifiedController::class)->prefix('classifieds')->name('classifieds.')->group(function () {
                Route::post('/{classified}/approve', 'approve')->name('approve');
                Route::post('/{classified}/disapprove', 'disapprove')->name('disapprove');
                Route::get('/{classified}/duplicate', 'duplicate')->name('duplicate');
            });
            Route::resource('classifieds', ClassifiedController::class)->middleware('module:classifieds');
        });

        Route::middleware('can:manage-property')->group(function () {
            Route::controller(PropertyController::class)->prefix('properties')->name('properties.')->group(function () {
                Route::post('/{property}/approve', 'approve')->name('approve');
                Route::post('/{property}/disapprove', 'disapprove')->name('disapprove');
                Route::get('/{property}/duplicate', 'duplicate')->name('duplicate');
                Route::post('/{property}/toggle-featured', 'toggleFeatured')->name('toggle-featured');
            });
            Route::resource('properties', PropertyController::class)->middleware('module:properties');
        });

        Route::middleware('can:manage-product')->group(function () {
            Route::resource('products', ProductController::class)->middleware('module:products');
            Route::get('products/{product}/duplicate', [ProductController::class, 'duplicate'])->name('products.duplicate')->middleware('module:products');
            
            // Product Orders Management
            Route::controller(OrderController::class)->prefix('product-orders')->name('product-orders.')->middleware('module:products')->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{order}', 'show')->name('show');
                Route::get('/{order}/edit', 'edit')->name('edit');
                Route::put('/{order}', 'update')->name('update');
                Route::post('/bulk-update', 'bulkUpdate')->name('bulk-update');
                Route::post('/{order}/status', 'updateStatus')->name('update-status');
            });
        });

        /**
     * 3. SALES, BOOKINGS & FINANCE
     */
        Route::controller(BookingController::class)->prefix('bookings')->name('bookings.')->group(function () {
            // Dedicated Category Views (Pills Grouping equivalent)
            Route::get('/properties/property/{property}/{status?}', [PropertyBookingController::class, 'forProperty'])->name('properties.property')->middleware(['module:properties', 'can:manage-property']);
            Route::get('/properties/{status?}', [PropertyBookingController::class, 'index'])->name('properties')->middleware(['module:properties', 'can:manage-property']);
            Route::get('/autos/{status?}', [AutoInquiryController::class, 'index'])->name('autos')->middleware(['module:autos', 'can:manage-auto']);
            Route::get('/events/{status?}', [EventBookingController::class, 'index'])->name('events')->middleware(['module:events', 'can:manage-event']);
            Route::get('/jobs/{status?}', [JobApplicationController::class, 'index'])->name('jobs')->middleware(['module:jobs', 'can:manage-job']);
            Route::get('/services/{status?}', [ServiceQuoteController::class, 'index'])->name('services')->middleware(['module:services', 'can:manage-service']);
            Route::get('/classifieds/{status?}', [ClassifiedInquiryController::class, 'index'])->name('classifieds')->middleware(['module:classifieds', 'can:manage-classified']);

            Route::get('/show/{type}/{id}', 'show')->name('show');
            Route::delete('/destroy/{type}/{id}', 'destroy')->name('destroy');

            Route::get('/{status?}', 'index')->name('index')->where('status', '^(?!properties|autos|events|jobs|services|classifieds).*$');
        }
        );

        Route::resource('property-bookings', PropertyBookingController::class)->middleware(['module:properties', 'can:manage-property']);
        Route::resource('auto-inquiries', AutoInquiryController::class)->middleware(['module:autos', 'can:manage-auto']);
        Route::resource('event-bookings', EventBookingController::class)->middleware(['module:events', 'can:manage-event']);
        Route::resource('job-applications', JobApplicationController::class)->middleware(['module:jobs', 'can:manage-job']);
        Route::resource('service-quotes', ServiceQuoteController::class)->except(['create', 'store'])->middleware(['module:services', 'can:manage-service']);
        Route::resource('service-appointments', ServiceAppointmentController::class)->middleware(['module:services', 'can:manage-service']);
        Route::resource('classified-inquiries', ClassifiedInquiryController::class)->middleware(['module:classifieds', 'can:manage-classified']);

        Route::resource('transactions', TransactionController::class);

        Route::middleware('can:manage-withdrawals')->prefix('withdrawals')->name('withdrawals.')->group(function () {
            Route::controller(WithdrawalController::class)->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('/pending', 'pending')->name('pending');
                    Route::get('/failed', 'failed')->name('failed');
                    Route::get('/{withdrawal}', 'show')->name('show');
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
        Route::get('users/{user}/impersonate', [UserController::class, 'impersonate'])->name('users.impersonate')->middleware('can:manage-users');
        Route::get('stop-impersonating', [UserController::class, 'stopImpersonating'])->name('users.stop-impersonating');

        Route::middleware('can:app-settings')->group(function () {
            Route::resource('roles', RoleController::class);
            Route::resource('permissions', PermissionController::class);

            Route::controller(SettingController::class)->prefix('settings')->name('settings.')->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::get('/group/{section}', 'getSection')->name('group');
                    Route::post('/group/{section}/update', 'updateSection')->name('update.group');
                    Route::post('/verify-platform-url', 'verifyPlatformUrl')->name('verify.platform-url');
                }
                );

            });


        Route::controller(SystemController::class)->prefix('system')->name('system.')->group(function () {
            Route::get('/maintenance', 'maintenance')->name('maintenance');
            Route::get('/status', 'status')->name('status');
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
            Route::get('blogs/pending', [BlogController::class , 'pending'])->name('blogs.pending')->middleware('can:manage-blog');
            Route::resource('blogs', BlogController::class)->middleware('can:manage-blog');

            // Page Management Routes
            Route::resource('pages', PageController::class)->middleware('can:manage-pages');
            Route::get('pages/type/{type}', [PageController::class , 'index'])->name('pages.index.type')->middleware('can:manage-pages');

            Route::controller(PageBuilderController::class)->prefix('page-builder')->name('page-builder.')->middleware('role:super-admin')->group(function () {
            Route::get('/{page}', 'edit')->name('edit');
            Route::post('/{page}', 'update')->name('update');
        }
        );

        Route::controller(ContentController::class)->prefix('content')->name('content.')->middleware('can:manage-pages')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/edit/item/{id}', 'editItem')->name('edit.item');
            Route::get('/{page}/{theme_key?}', 'editPage')->name('edit');
            Route::post('/update', 'bulkUpdate')->name('bulk_update');
        }
        );

        Route::controller(MenuController::class)->prefix('menu')->name('menu.')->middleware('can:manage-menus')->group(function () {
            Route::get('/{theme?}', 'index')->name('index');
            Route::get('/{menu}/edit', 'edit')->name('edit');
            Route::post('/{menu}/update', 'updateStructure')->name('update_structure');
            Route::delete('/items/{item}', 'deleteItem')->name('delete_item');
            Route::put('/items/{item}', 'updateItem')->name('update_item');
        }
        );

        Route::resource('email-templates', EmailTemplateController::class)->except(['create', 'store', 'destroy'])->middleware('can:app-settings');
        Route::resource('advertisements', AdvertisementController::class)->middleware('can:manage-pages');
        Route::resource('testimonials', TestimonialController::class)->except(['show'])->middleware('can:manage-marketing');
        Route::get('newsletter-subscribers/export', [NewsletterSubscriberController::class, 'export'])->name('newsletter-subscribers.export')->middleware('can:manage-users');
        Route::resource('newsletter-subscribers', NewsletterSubscriberController::class)->middleware('can:manage-users');

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
        Route::controller(ReportController::class)->prefix('reports')->name('reports.')->middleware('can:view')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/bookings', 'bookings')->name('bookings');
            Route::get('/payments', 'payments')->name('payments');
            Route::get('/properties', 'properties')->name('properties');
            Route::get('/searches', [SearchAnalyticsController::class, 'index'])->name('searches');
        }
        );
        Route::get('payments-report', [ReportController::class , 'payments'])->name('payments_report');

        Route::controller(ThemeController::class)->middleware('can:manage-themes')->prefix('themes')->name('themes.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/{theme}/edit', 'edit')->name('edit');
            Route::post('/{theme}/update', 'update')->name('update');
            Route::post('/{theme}/activate', 'activate')->name('activate');
        }
        );

        Route::match(['get', 'post', 'delete'], 'mass-ticket-process', [TicketController::class, 'bulkUpdate'])->name('tickets.bulk-update');

        /**
         * 7. SUPPORT TICKETS
         */
        Route::controller(TicketController::class)->prefix('tickets')->name('tickets.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('{ticket}', 'show')->name('show');
            Route::post('{ticket}/reply', 'reply')->name('reply');
            Route::post('{ticket}/status', 'updateStatus')->name('status');
            Route::delete('{ticket}', 'destroy')->name('destroy');
        });

        /**
         * 8. LOCALIZATION MANAGEMENT
         */
        Route::controller(LanguageController::class)->prefix('languages')->name('languages.')->middleware('can:app-settings')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::post('/', 'store')->name('store');
            Route::get('/{language}/edit', 'edit')->name('edit');
            Route::post('/{language}/update', 'update')->name('update');
            Route::delete('/{language}', 'destroy')->name('destroy');
            Route::get('/{language}/translations', 'translations')->name('translations');
            Route::post('/{language}/translations', 'updateTranslations')->name('translations.update');
        });

        /**
     * 8. GLOBAL ATTRIBUTES
     */
        Route::resource('booking-line-items', BookingLineItemController::class)->except(['create', 'store']);

        Route::resources([
            'types' => TypeController::class ,
            'categories' => CategoryController::class ,
            'brands' => BrandController::class ,
            'locations' => LocationController::class ,
            'amenities' => AmenityController::class ,
            'features' => FeatureController::class ,
            'tags' => TagController::class ,
            'line-items' => LineItemController::class ,
            'addons' => AddonController::class ,
        ]);

        /**
         * SECTION: GLOBAL ASSETS (Administrative)
         */
    });

// --- GLOBAL MEDIA UTILITIES ---
// These routes are defined outside the 'admin.' name prefix to allow shared components
// to use 'upload.image' and 'delete.image' consistently across all dashboard contexts.
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::post('/upload-image', [MediaController::class, 'upload'])->name('upload.image');
    Route::post('/delete-image', [MediaController::class, 'delete'])->name('delete.image');
});
