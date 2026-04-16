<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gates access to module-specific routes.
 *
 * Usage in routes: ->middleware('module:properties')
 * If the module is disabled via Settings → Module Activation, returns 404.
 */
class CheckModuleEnabled
{
    public function handle(Request $request, Closure $next, string $module): Response
    {
        if (!module_enabled($module)) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'This module is disabled.',
                ], 404);
            }
            abort(404);
        }

        return $next($request);
    }
}
