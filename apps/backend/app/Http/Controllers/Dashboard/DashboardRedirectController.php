<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Setting;

class DashboardRedirectController extends Controller
{
    /**
     * Redirect the user to their specific dashboard based on role.
     * Supports external React portals configured in Admin Settings.
     */
    public function __invoke(): RedirectResponse
    {
        $user = Auth::user();

        // 1. Administrators & Moderators (Always use internal Laravel Dashboard)
        if ($user->hasRole(['admin', 'super-admin', 'moderator'])) {
            return redirect()->route('admin.welcome');
        }

        // 2. Partners / Sellers (Prefer external React Portal if configured)
        if ($user->hasRole('partner')) {
            $url = Setting::get('url_partner');
            if ($url) {
                return redirect()->away($url);
            }
            abort(403, 'Your Partner Dashboard is currently being transitioned to a new portal. Please contact support if you need immediate access.');
        }

        // 3. Users / Buyers (Prefer external React Portal if configured)
        if ($user->hasRole('user')) {
            $url = Setting::get('url_user');
            if ($url) {
                return redirect()->away($url);
            }
            abort(403, 'Your User Dashboard is currently being transitioned to a new portal. Please contact support if you need immediate access.');
        }

        // Fallback for users with no assigned roles
        abort(403, 'Unauthorized: No dashboard assigned to your account role.');
    }
}
