<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


return Application::configure(basePath: dirname(__DIR__))
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
            // Admin API Routes
            Route::middleware(['api', 'auth:sanctum', 'role:admin|super-admin'])
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
        $middleware->web(append: [
            // LoadTheme::class removed
        ]);
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'module' => \App\Http\Middleware\CheckModuleEnabled::class,
            'built_in_website' => \App\Http\Middleware\CheckBuiltInWebsiteStatus::class,
        ]);
        // Add this to ensure CORS headers are attached even if auth fails
        $middleware->validateCsrfTokens(except: [
            'api/*', 
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
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                    'errors' => $e->errors(),
                ], 422);
            }
        });

    })->create();