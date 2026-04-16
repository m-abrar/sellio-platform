<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Setting;
use Illuminate\Support\Facades\Auth;

class CheckBuiltInWebsiteStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $status = Setting::get('built_in_website_status', 'active');

        // If the status is 'redirect' (disabled)
        if ($status === 'redirect') {
            // Check if user is logged in
            $user = Auth::user();

            // EXEMPTIONS: 
            // 1. Always allow auth-related routes to prevent infinite loops
            // 2. Allow administrators to preview the site even if disabled
            if ($request->is('login') || 
                $request->is('logout') || 
                $request->is('password/*') || 
                $request->is('register') ||
                $request->is('dashboard*') || // EXEMPT the dashboard redirector itself
                $request->routeIs(['login', 'logout', 'password.*', 'register', 'dashboard'])) {
                return $next($request);
            }

            // 1. Admins, Super-Admins, and Moderators are ALWAYS allowed to see the 
            //    Laravel frontend (useful for content management and previewing).
            $isAdmin = $user && $user->hasRole(['admin', 'super-admin', 'moderator']);
            if ($isAdmin) {
                return $next($request);
            }

            // 2. Partners and Users are redirected to their respective React portals 
            //    (via the /dashboard redirector) if the built-in website is toggled off.
            // 3. Guests are sent to the login screen (via the /dashboard redirector).
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
