<?php

/**
 * API Routing Suite (V1)
 *
 * This file orchestrates the public and protected API surface for the Sellio platform.
 * It provides RESTful endpoints for multi-vertical marketplace exploration (Properties,
 * Autos, Products, Events, Jobs, Services, Classifieds), cart orchestration,
 * order processing, and Sanctum-based authentication workflows.
 */

use App\Http\Controllers\Api\ApiThemeController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\V1\ApiAmenityController;
use App\Http\Controllers\Api\V1\ApiAutoController;
use App\Http\Controllers\Api\V1\ApiBlogController;
use App\Http\Controllers\Api\V1\ApiBrandController;
use App\Http\Controllers\Api\V1\ApiCartController;
use App\Http\Controllers\Api\V1\ApiCheckoutController;
use App\Http\Controllers\Api\V1\ApiPaymentGatewayController;
use App\Http\Controllers\Api\V1\ApiCategoryController;
use App\Http\Controllers\Api\V1\ApiClassifiedController;
use App\Http\Controllers\Api\V1\ApiEventController;
use App\Http\Controllers\Api\V1\ApiFeatureController;
use App\Http\Controllers\Api\V1\ApiJobController;
use App\Http\Controllers\Api\V1\ApiLocationController;
use App\Http\Controllers\Api\V1\ApiMenuController;
use App\Http\Controllers\Api\V1\ApiOrderController;
use App\Http\Controllers\Api\V1\ApiProductController;
use App\Http\Controllers\Api\V1\ApiPropertyController;
use App\Http\Controllers\Api\V1\ApiServiceController;
use App\Http\Controllers\Api\V1\ApiTagController;
use App\Http\Controllers\Api\V1\ApiTestimonialController;
use App\Http\Controllers\Api\V1\ApiThemeContentController;
use App\Http\Controllers\Api\V1\ApiTypeController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\PasswordResetController;
use App\Http\Controllers\Api\V1\Auth\ProfileController;
use App\Http\Controllers\Api\V1\BrandSettingsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('themes')->group(function () {
    Route::get('/', [ApiThemeController::class, 'index']);
    Route::get('/active', [ApiThemeController::class, 'active']);
});

Route::prefix('v1')->group(function () {

// =======================
// Menu Routes
// =======================
Route::prefix('menus')->group(function () {
    Route::get('/', [ApiMenuController::class, 'index']);
    Route::get('{locationKey}', [ApiMenuController::class, 'show']);
});

// =======================
// Testimonial Routes
// =======================
Route::get('testimonials', [ApiTestimonialController::class, 'index']);
Route::get('theme-content', [ApiThemeContentController::class, 'show']);
Route::get('brand-settings', [BrandSettingsController::class, 'show']);

// =======================
// Category Routes
// =======================
Route::prefix('categories')->group(function () {
    Route::get('/', [ApiCategoryController::class, 'index']);
    Route::get('{slug}', [ApiCategoryController::class, 'show']);
});

// =======================
// Types Routes
// =======================
Route::prefix('types')->group(function () {
    Route::get('/', [ApiTypeController::class, 'index']);
    Route::get('{slug}', [ApiTypeController::class, 'show']);
});

// =======================
// Brand Routes
// =======================
Route::prefix('brands')->group(function () {
    Route::get('/', [ApiBrandController::class, 'index']);
    Route::get('{slug}', [ApiBrandController::class, 'show']);
});

// =======================
// Location Routes
// =======================
Route::prefix('locations')->group(function () {
    Route::get('/', [ApiLocationController::class, 'index']);
    Route::get('{slug}', [ApiLocationController::class, 'show']);
});

// =======================
// Tag Routes (New)
// =======================
Route::prefix('tags')->group(function () {
    Route::get('/', [ApiTagController::class, 'index']);
    Route::get('{slug}', [ApiTagController::class, 'show']);
});

// =======================
// Amenity Routes (New)
// =======================
Route::prefix('amenities')->group(function () {
    Route::get('/', [ApiAmenityController::class, 'index']);
    Route::get('{slug}', [ApiAmenityController::class, 'show']);
});

// =======================
// Feature Routes (New)
// =======================
Route::prefix('features')->group(function () {
    Route::get('/', [ApiFeatureController::class, 'index']);
    Route::get('{slug}', [ApiFeatureController::class, 'show']);
});

// =======================
// Blog Routes
// =======================
Route::prefix('blogs')->group(function () {
    Route::get('/', [ApiBlogController::class, 'index']);
    Route::get('category/{categorySlug}', [ApiBlogController::class, 'category']);
    Route::get('{slug}', [ApiBlogController::class, 'show']);
});

// =======================
// Product Public Routes
// =======================
Route::prefix('products')->middleware('module:products')->group(function () {
    Route::get('/', [ApiProductController::class, 'index']);
    Route::get('category/{categorySlug}', [ApiProductController::class, 'category']);
    Route::get('{slug}', [ApiProductController::class, 'show']);
    Route::post('{product}/calculate-price', [ApiProductController::class, 'calculatePrice'])
        ->middleware('throttle:api-write');
});

// =======================
// Property Routes
// =======================
Route::prefix('properties')->middleware('module:properties')->group(function () {
    Route::get('/', [ApiPropertyController::class, 'index']);
    Route::get('category/{categorySlug}', [ApiPropertyController::class, 'category']);
    Route::get('{slug}', [ApiPropertyController::class, 'show']);
    Route::post('{property}/calculate-lodging-price', [ApiPropertyController::class, 'calculateLodgingPrice'])
        ->middleware('throttle:api-write');
});

// =======================
// Vehicle / Auto Routes
// =======================
Route::prefix('vehicles')->middleware('module:autos')->group(function () {
    Route::get('/', [ApiAutoController::class, 'index']);
    Route::get('category/{categorySlug}', [ApiAutoController::class, 'category']);
    Route::get('{slug}', [ApiAutoController::class, 'show']);
});

// =======================
// Event Routes
// =======================
Route::prefix('events')->middleware('module:events')->group(function () {
    Route::get('/', [ApiEventController::class, 'index']);
    Route::get('category/{categorySlug}', [ApiEventController::class, 'category']);
    Route::get('{slug}', [ApiEventController::class, 'show']);
});

// =======================
// Job Routes
// =======================
Route::prefix('jobs')->middleware('module:jobs')->group(function () {
    Route::get('/', [ApiJobController::class, 'index']);
    Route::get('category/{categorySlug}', [ApiJobController::class, 'category']);
    Route::get('{slug}', [ApiJobController::class, 'show']);
});

// =======================
// Service Routes
// =======================
Route::prefix('services')->middleware('module:services')->group(function () {
    Route::get('/', [ApiServiceController::class, 'index']);
    Route::get('category/{categorySlug}', [ApiServiceController::class, 'category']);
    Route::get('{slug}', [ApiServiceController::class, 'show']);
});

// =======================
// Classified Routes
// =======================
Route::prefix('classifieds')->middleware('module:classifieds')->group(function () {
    Route::get('/', [ApiClassifiedController::class, 'index']);
    Route::get('category/{categorySlug}', [ApiClassifiedController::class, 'category']);
    Route::get('{slug}', [ApiClassifiedController::class, 'show']);
});

// =======================
// Payment Gateway Routes (Public config)
// =======================
Route::get('payment-gateways', [ApiPaymentGatewayController::class, 'index'])
    ->middleware('module:products');

// =======================
// Cart Routes (Guest + Auth)
// =======================
Route::prefix('cart')->middleware('module:products')->group(function () {
    Route::get('/', [ApiCartController::class, 'index']);
    Route::post('add/{product}', [ApiCartController::class, 'add'])->middleware('throttle:api-write');
    Route::patch('{id}', [ApiCartController::class, 'update'])->middleware('throttle:api-write');
    Route::delete('{id}', [ApiCartController::class, 'remove'])->middleware('throttle:api-write');
});

// =======================
// Checkout Routes (Auth Required)
// =======================
Route::middleware(['auth:sanctum', 'module:products'])->prefix('checkout')->group(function () {
    Route::get('context', [ApiCheckoutController::class, 'context']);
    Route::post('process/{gateway}', [ApiCheckoutController::class, 'processPayment'])->middleware('throttle:api-write');
    Route::match(['get', 'post'], 'confirm/{gateway}/{order}', [ApiCheckoutController::class, 'confirmPayment']);
});

// =======================
// Order Routes (Auth Required)
// =======================
Route::middleware(['auth:sanctum', 'module:products'])->prefix('orders')->group(function () {
    Route::get('/', [ApiOrderController::class, 'index']);
    Route::post('/', [ApiOrderController::class, 'store'])->middleware('throttle:api-write');
    Route::get('{orderNumber}', [ApiOrderController::class, 'show']);
});

// =======================
// Ticket Routes
// =======================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('tickets', [TicketController::class, 'index']);
    Route::post('tickets', [TicketController::class, 'store'])->middleware('throttle:api-write');
    Route::get('tickets/{ticket}', [TicketController::class, 'show']);
    Route::post('tickets/{ticket}/reply', [TicketController::class, 'reply'])->middleware('throttle:api-write');
});

// =======================
// Auth Routes
// =======================
Route::prefix('auth')->group(function () {
    Route::middleware('throttle:api-auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/password/email', [PasswordResetController::class, 'sendResetLinkEmail']);
        Route::post('/password/reset', [PasswordResetController::class, 'reset']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh-token', [AuthController::class, 'refresh']);

        // Profile Routes (api/v1/auth/me)
        Route::get('/me', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update'])->middleware('throttle:api-write');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->middleware('throttle:api-write');
    });
});
});
