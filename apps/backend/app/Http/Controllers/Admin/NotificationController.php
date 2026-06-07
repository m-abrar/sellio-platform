<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\NotificationResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\View\View;

/**
 * Class NotificationController
 * Orchestrates the administrative notification layer, translating polymorphic 
 * system alerts into semantic, human-readable UI components with localized tags.
 */
class NotificationController extends Controller
{

    /**
     * Display a paginated listing of notifications for the authenticated administrator.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $notifications = Auth::user()->notifications()->paginate(15);
        
        $styledNotifications = NotificationResource::collection($notifications)->resolve();

        return view('admin.notifications.index', compact('styledNotifications', 'notifications'));
    }

    /**
     * Mark all unread notifications as read for the authenticated administrator.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAllRead(): RedirectResponse
    {
        Auth::user()->unreadNotifications->markAsRead();
        
        return back()->with('success', __('All notifications marked as read!'));
    }
}
