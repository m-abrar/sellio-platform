<?php

use App\Http\Middleware\ApplyDynamicCorsOrigins;
use App\Http\Middleware\CheckBuiltInWebsiteStatus;
use App\Http\Middleware\CheckModuleEnabled;
use App\Http\Middleware\LogPublicSearch;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Middleware\RoleMiddleware;


$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: [
            __DIR__ . '/../routes/auth.php',
            __DIR__ . '/../routes/admin.php',
            __DIR__ . '/../routes/dashboard/partner.php',
            __DIR__ . '/../routes/dashboard/user.php',
            __DIR__ . '/../routes/web.php',
        ],
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        
        // Register custom API files here
        then: function () {
            // Admin API Routes — admins and super-admins get full access;
            // moderators get access to content routes only (gated further inside).
            Route::middleware(['api', 'auth:sanctum', 'role:admin|super-admin|moderator'])
                ->prefix('api/dashboard/admin')
                ->name('api.dashboard.admin.')
                ->group(base_path('routes/api/dashboard/admin.php'));

            // Partner API Routes
            Route::middleware(['api', 'auth:sanctum', 'role:partner|admin|super-admin'])
                ->prefix('api/dashboard/partner')
                ->name('api.dashboard.partner.')
                ->group(base_path('routes/api/dashboard/partner.php'));

            // User API Routes
            Route::middleware(['api', 'auth:sanctum'])
                ->prefix('api/dashboard/user')
                ->name('api.dashboard.user.')
                ->group(base_path('routes/api/dashboard/user.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->prepend(ApplyDynamicCorsOrigins::class);
        $middleware->statefulApi();
        $middleware->api(prepend: [
            ThrottleRequests::class . ':api',
        ]);
        $middleware->web(append: [
            // LoadTheme::class removed
        ]);
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'module' => CheckModuleEnabled::class,
            'built_in_website' => CheckBuiltInWebsiteStatus::class,
            'log_search' => LogPublicSearch::class,
        ]);
        // Add this to ensure CORS headers are attached even if auth fails
        $middleware->validateCsrfTokens(except: [
            'api/*',
            'webhooks/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // 404 — Model not found (e.g. findOrFail, firstOrFail)
        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => __('The requested resource was not found.'),
                ], 404);
            }
        });

        // 403 — Unauthorized action (e.g. policy / manual abort(403))
        $exceptions->render(function (AuthorizationException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage() ?: __('You are not authorized to perform this action.'),
                ], 403);
            }
        });

        // 401 — Unauthenticated (no valid Sanctum token)
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => __('Unauthenticated. Please log in and provide a valid token.'),
                ], 401);
            }
        });

        // 422 — Validation Exception
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        // 419 — CSRF token mismatch/expiry (e.g. session expired in a background AJAX tab)
        $exceptions->render(function (TokenMismatchException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => __('Your session has expired. Please refresh the page and try again.'),
                ], 419);
            }
        });

        // Database Connection Error — Dedicated Polish Screen
        $exceptions->render(function (QueryException $e, Request $request) {
            $isConnectionError = str_contains($e->getMessage(), '[2002]') || 
                               str_contains($e->getMessage(), 'Connection refused');
            
            if ($isConnectionError) {
                if ($request->expectsJson() || $request->is('api/*')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Database service is currently unavailable. Please try again later.',
                        'code' => 'DB_CONNECTION_REFUSED'
                    ], 503);
                }
                return response()->view('errors.db-error', [], 503);
            }
        });

    })
    ->withSchedule(function () {
        Schedule::command('app:check-renewals')->dailyAt('08:00');
        Schedule::command('app:check-expired-subscriptions')->dailyAt('08:15');
    })->create();

// Prefer the shared-hosting document root when present, otherwise use
// Laravel's conventional public directory.
foreach (['public_html', 'public'] as $publicDirectory) {
    $publicPath = $app->basePath($publicDirectory);

    if (is_dir($publicPath)) {
        $app->usePublicPath($publicPath);
        break;
    }
}

return $app;
