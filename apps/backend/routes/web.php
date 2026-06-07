<?php

/**
 * Standard Web Routes
 *
 * This file serves as the primary ingress point for the Sellio storefront and
 * guest-facing experience. It orchestrates the public marketplace discovery,
 * module-specific booking engines (Real Estate, Automotive, Events, Services, etc.),
 * cart/checkout flows, and CMS page rendering.
 */
use App\Http\Controllers\AdminBarContextController;
use App\Http\Controllers\AdminBarStatusController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\AutoController;
use App\Http\Controllers\AutoInquiryController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ClassifiedController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\Dashboard\DashboardRedirectController;
use App\Http\Controllers\EventBookingController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventTicketController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PropertyBookingController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyVisitController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| 1. CORE SYSTEM ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/admin-bar/status', AdminBarStatusController::class)->name('admin-bar.status');
Route::get('/admin-bar/context', AdminBarContextController::class)->name('admin-bar.context');

Route::middleware(['built_in_website'])->group(function () {
    Route::get('/', HomeController::class)->name('index');
    Route::get('/home', HomeController::class)->name('home');
    Route::get('/logout', [LogoutController::class, 'logout'])->name('signout');

    // Multi-Role Dashboard Entry Point
    Route::get('/dashboard/redirect', DashboardRedirectController::class)
        ->middleware(['auth'])
        ->name('dashboard');


    /** BLOGS **/
    Route::prefix('blogs')->name('blogs.')->middleware('module:blogs')->group(function () {
        Route::get('/', [BlogController::class, 'index'])->name('index');
        Route::get('/search', [BlogController::class, 'search'])->name('search');
        Route::get('/{blog:slug}', [BlogController::class, 'show'])->name('show');
    });


    /*
    |--------------------------------------------------------------------------
    | 2. MARKETPLACE: PUBLIC SEARCH & VIEW
    |--------------------------------------------------------------------------
    */

    /** CLASSIFIEDS **/
    Route::prefix('classifieds')->name('classifieds.')->middleware('module:classifieds')->group(function () {
        Route::get('/', [ClassifiedController::class, 'index'])->name('index');
        Route::get('/search', [ClassifiedController::class, 'search'])->name('search');
        Route::get('/{classified:slug}', [ClassifiedController::class, 'show'])->name('show');
    });

    /** SERVICES **/
    Route::prefix('services')->name('services.')->middleware('module:services')->group(function () {
        Route::get('/', [ServiceController::class, 'index'])->name('index');
        Route::get('/search', [ServiceController::class, 'search'])->name('search');
        Route::get('/{service:slug}', [ServiceController::class, 'show'])->name('show');
        
        // Booking Handlers
        Route::get('/appointment/calculate-price', [ServiceController::class, 'calculatePrice'])->name('appointment.calculatePrice');
        Route::post('/consultation/{service:slug}/store', [ServiceController::class, 'consultationStore'])->middleware('auth')->name('consultation.store');
        // Route::post('/booking/store', [ServiceController::class, 'bookingStore'])->middleware('auth')->name('booking.store');
        Route::post('/appointment/{service:slug}/store', [ServiceController::class, 'appointmentStore'])->middleware('auth')->name('appointment.store');
        Route::post('/quote/{service:slug}/store', [ServiceController::class, 'quoteStore'])->middleware('auth')->name('quote.store');
    });

    /** JOBS **/
    Route::prefix('jobs')->name('jobs.')->middleware('module:jobs')->group(function () {
        Route::get('/', [JobController::class, 'index'])->name('index');
        Route::get('/search', [JobController::class, 'search'])->name('search');
        Route::get('/{job:slug}', [JobController::class, 'show'])->name('show');
        
        // Applications
        Route::get('/{job:slug}/apply', [JobApplicationController::class, 'apply'])->name('apply');
        Route::post('/{job:slug}/apply', [JobApplicationController::class, 'store'])->name('apply.store');
        Route::get('/{job:slug}/confirmation/{application}', [JobApplicationController::class, 'confirmation'])->name('application.confirmation');
    });

    /** AUTOMOTIVE **/
    Route::prefix('vehicles')->name('autos.')->middleware('module:autos')->group(function () {
        Route::get('/', [AutoController::class, 'index'])->name('index');
        Route::get('/search', [AutoController::class, 'search'])->name('search');
        Route::get('/{auto:slug}', [AutoController::class, 'show'])->name('show');
        Route::post('/{auto:slug}/inquiry', [AutoInquiryController::class, 'store'])->name('inquiry.store');
        Route::get('/{auto:slug}/inquiry/{inquiry}', [AutoInquiryController::class, 'show'])->name('inquiry.confirmation');
    });

    /** REAL ESTATE **/
    Route::prefix('properties')->name('properties.')->middleware('module:properties')->group(function () {
        Route::get('/', [PropertyController::class, 'index'])->name('index');
        Route::get('/search', [PropertyController::class, 'search'])->name('search');
        Route::get('/{property:slug}', [PropertyController::class, 'show'])->name('show');
        Route::get('/{property:slug}/calendar', [PropertyController::class, 'calendar'])->name('calendar');
        Route::get('/{property}/calculate-lodging-price', [PropertyController::class, 'calculateLodgingPrice'])->name('calculate-lodging-price');
    });

    /** EVENTS **/
    Route::prefix('events')->name('events.')->middleware('module:events')->group(function () {
        Route::get('/', [EventController::class, 'index'])->name('index');
        Route::get('/search', [EventController::class, 'search'])->name('search');
        Route::get('/{event:slug}', [EventController::class, 'show'])->name('show');
        Route::get('/{event:slug}/occurrences', [EventController::class, 'occurrences'])->name('occurrences');
        Route::get('/{event:slug}/tickets', [EventTicketController::class, 'index'])->name('tickets.index');
    });

    /** PRODUCTS **/
    Route::prefix('products')->name('products.')->middleware('module:products')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/search', [ProductController::class, 'search'])->name('search');
        Route::get('/{product:slug}', [ProductController::class, 'show'])->name('show');
        
        // Dynamic Pricing for variations/addons
        Route::get('/{product}/calculate-dynamic-price', [ProductController::class, 'calculateDynamicPrice'])->name('calculate-dynamic-price');
    });


    /** TAXONOMIES **/
    Route::get('/category/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');
    Route::get('/brand/{brand:slug}', [BrandController::class, 'show'])->name('brands.show');
    Route::get('/tag/{tag:slug}', [TagController::class, 'show'])->name('tags.show');
    Route::get('/type/{type:slug}', [TypeController::class, 'show'])->name('types.show');

    /*
    |--------------------------------------------------------------------------
    | 3. CHECKOUT & BOOKING ENGINE
    |--------------------------------------------------------------------------
    */

    Route::prefix('checkout')->name('checkout.')->middleware('module:products')->group(function () {
        Route::get('/', [CheckoutController::class, 'showCheckout'])->name('index');
        Route::post('/process/{gateway}', [CheckoutController::class, 'processPayment'])->name('process');
        Route::get('/confirm/{gateway}/{order}', [CheckoutController::class, 'confirmPayment'])->name('confirm');
        Route::get('/success', [CheckoutController::class, 'showSuccess'])->name('order.success');
    });

    // Property Booking Logic
    Route::prefix('property/{property:slug}')->name('property.')->middleware('module:properties')->group(function () {
        Route::post('/booking/start', [PropertyBookingController::class, 'startFromWidget'])->name('booking.start');
        Route::get('/booking/{start_date}/{end_date}/checkout', [PropertyBookingController::class, 'checkout'])->name('booking.checkout');
        Route::post('/booking', [PropertyBookingController::class, 'store'])->middleware('auth')->name('booking.store');
        Route::get('/booking/{booking}/payment', [PropertyBookingController::class, 'payment'])->middleware('auth')->name('booking.payment');
        Route::get('/booking/{booking}/payment/confirm/{gateway}', [PropertyBookingController::class, 'confirmPayment'])->middleware('auth')->name('booking.payment.confirm');
        Route::get('/booking/{booking}', [PropertyBookingController::class, 'show'])->name('booking.confirmation');
        
        Route::prefix('visits')->name('visit.')->group(function () {
            Route::get('create', [PropertyVisitController::class, 'create'])->name('create');
            Route::post('/', [PropertyVisitController::class, 'store'])->name('store');
            Route::get('{visit}', [PropertyVisitController::class, 'show'])->name('show');
            Route::post('{visit}/cancel', [PropertyVisitController::class, 'cancel'])->middleware('auth')->name('cancel');
        });
    });
    Route::post('/property/booking/{booking}/payment', [PropertyBookingController::class, 'processPayment'])->middleware('auth')->name('property.booking.processPayment');

    // Ticket Booking Logic
    Route::prefix('events/{event:slug}/booking')->name('events.tickets.booking.')->middleware('module:events')->group(function () {
        Route::post('/ticket/{ticket}/book', [EventBookingController::class, 'store'])->name('store');
        Route::get('/{booking}/checkout', [EventBookingController::class, 'checkout'])->name('checkout');
        Route::put('/{booking}/details', [EventBookingController::class, 'updateDetails'])->name('update_details');
        Route::get('/{booking}/payment/confirm/{gateway}', [EventBookingController::class, 'confirmPayment'])->name('payment.confirm');
        Route::post('/{booking}/pay', [EventBookingController::class, 'processPayment'])->name('processPayment');
        Route::get('/{booking}/confirmation', [EventBookingController::class, 'confirmation'])->name('confirmation');
    });



    /** SHOPPING CART **/
    Route::prefix('cart')->name('cart.')->middleware('module:products')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('index');
        Route::post('/add/{product}', [CartController::class, 'add'])->name('add');
        Route::patch('/update/{cartItem}', [CartController::class, 'update'])->name('update');
        Route::delete('/remove/{cartItem}', [CartController::class, 'remove'])->name('remove');
        Route::post('/clear', [CartController::class, 'clear'])->name('clear');
    });

    /** PRODUCT ORDERS **/
    Route::middleware(['auth', 'module:products'])->group(function () {
        Route::prefix('orders')->name('orders.')->group(function () {
            // Place the order (Transition from Cart to Order)
            Route::post('/place-order', [OrderController::class, 'store'])->name('store');
            
            // Order History and Invoice
            Route::get('/', [OrderController::class, 'index'])->name('index');
            Route::get('/{order_number}', [OrderController::class, 'show'])->name('show');
        });
    });


    /*
    |--------------------------------------------------------------------------
    | 4. INTERACTION, CMS & UTILITIES
    |--------------------------------------------------------------------------
    */

    // Static Pages
    Route::controller(PageController::class)->group(function () {
        Route::get('about', 'about')->name('about');
        Route::get('contact', 'contact')->name('contact');
        Route::post('contact', 'sendContact')->name('contact.send');
        Route::get('faq', 'faq')->name('faq');
        Route::get('privacy-policy', 'privacyPolicy')->name('privacy-policy');
        Route::get('terms', 'terms')->name('terms');
    });

    // User Profiles & Reviews
    Route::get('/partner/{user:username}', [PartnerController::class, 'show'])->name('partner.profile');
    Route::get('/alias/users/{user:username}', fn($user) => redirect()->route('partner.profile', $user))->name('users.show');

    Route::post('/reviews/{type}/{id}', [ReviewController::class, 'store'])->middleware('auth')->name('reviews.store')->whereNumber('id');
    Route::get('/conversation/{user:username}', [ConversationController::class, 'start'])->middleware('auth')->name('conversation.start');

    // Newsletter
    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
    Route::get('/newsletter/confirm/{token}', [NewsletterController::class, 'confirm'])->name('newsletter.confirm');

    // Demo & Support
    Route::get('/landing-page/{group}/{type}', [HomeController::class, 'landing'])->name('landing.page');
    Route::get('/#', [HomeController::class, 'index'])->name('#');
});

// --- PUBLIC UTILITY ROUTES (Exempt from built-in website toggle) ---
// Payment Webhooks must stay accessible for background processing
Route::post('/webhooks/{gateway}', [WebhookController::class, 'handle'])
    ->middleware('throttle:60,1')
    ->name('webhooks.handle');

require __DIR__.'/auth.php';

use App\Http\Controllers\Auth\SocialLoginController;

// Socialite Routes
Route::prefix('auth')->group(function () {
    // Redirect to Provider
    Route::get('{provider}/redirect', [SocialLoginController::class, 'redirect'])
        ->name('login.social');

    // Callback from Provider
    Route::get('{provider}/callback', [SocialLoginController::class, 'callback'])
        ->name('login.social.callback');
});

