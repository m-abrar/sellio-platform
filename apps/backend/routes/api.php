<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ApiBlogController;
use App\Http\Controllers\Api\V1\ApiCategoryController;
use App\Http\Controllers\Api\V1\ApiTypeController;
use App\Http\Controllers\Api\V1\ApiBrandController;
use App\Http\Controllers\Api\V1\ApiLocationController;
use App\Http\Controllers\Api\V1\ApiProductController;
use App\Http\Controllers\Api\V1\ApiTagController;
use App\Http\Controllers\Api\V1\ApiAmenityController;
use App\Http\Controllers\Api\V1\ApiFeatureController;
use App\Http\Controllers\Api\V1\ApiPropertyController;
use App\Http\Controllers\Api\V1\ApiAutoController;
use App\Http\Controllers\Api\V1\ApiEventController;
use App\Http\Controllers\Api\V1\ApiJobController;
use App\Http\Controllers\Api\V1\ApiServiceController;
use App\Http\Controllers\Api\V1\ApiClassifiedController;
use App\Http\Controllers\Api\V1\ApiCartController;
use App\Http\Controllers\Api\V1\ApiOrderController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\ApiThemeController;
use Illuminate\Http\Request;

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
    Route::post('{product}/calculate-price', [ApiProductController::class, 'calculatePrice']);
});

// =======================
// Property Routes
// =======================
Route::prefix('properties')->middleware('module:properties')->group(function () {
    Route::get('/', [ApiPropertyController::class, 'index']);
    Route::get('category/{categorySlug}', [ApiPropertyController::class, 'category']);
    Route::get('{slug}', [ApiPropertyController::class, 'show']);
    Route::post('{property}/calculate-lodging-price', [ApiPropertyController::class, 'calculateLodgingPrice']);
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
// Cart Routes (Guest + Auth)
// =======================
Route::prefix('cart')->middleware('module:products')->group(function () {
    Route::get('/', [ApiCartController::class, 'index']);
    Route::post('add/{product}', [ApiCartController::class, 'add']);
    Route::patch('{id}', [ApiCartController::class, 'update']);
    Route::delete('{id}', [ApiCartController::class, 'remove']);
});

// =======================
// Order Routes (Auth Required)
// =======================
Route::middleware(['auth:sanctum', 'module:products'])->prefix('orders')->group(function () {
    Route::get('/', [ApiOrderController::class, 'index']);
    Route::post('/', [ApiOrderController::class, 'store']);
    Route::get('{orderNumber}', [ApiOrderController::class, 'show']);
});

// =======================
// Ticket Routes
// =======================
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tickets', \App\Http\Controllers\Api\TicketController::class)->only(['index', 'store', 'show']);
    Route::post('tickets/{ticket}/reply', [\App\Http\Controllers\Api\TicketController::class, 'reply']);
});

// =======================
// Auth Routes
// =======================
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/password/email', [\App\Http\Controllers\Api\V1\Auth\PasswordResetController::class, 'sendResetLinkEmail']);
    Route::post('/password/reset', [\App\Http\Controllers\Api\V1\Auth\PasswordResetController::class, 'reset']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh-token', [AuthController::class, 'refresh']);

        // Profile Routes (api/v1/auth/me)
        Route::get('/me', [\App\Http\Controllers\Api\V1\Auth\ProfileController::class, 'show']);
    });
});
});