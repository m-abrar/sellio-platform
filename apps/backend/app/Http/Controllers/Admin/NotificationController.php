<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
     * Semantically map a raw database notification into a standardized UI display object.
     *
     * @param  mixed  $notification
     * @return array{id: string, message: string, url: string, created_at_human: string, read_at: mixed, is_read: bool, tag: string, icon_class: string, tag_class: string}
     */
    protected function mapNotificationForDisplay($notification): array
    {
        $data = $notification->data;
        $customType = $data['type'] ?? 'default';
        
        $tag = __('New');
        $iconClass = 'fa-bell text-primary';
        $tagClass = 'bg-primary';
        $message = $data['message'] ?? __('System Notification');

        // Semantic Category Mapping
        if ($customType === 'alert') {
            $tag = __('Urgent');
            $iconClass = 'fa-exclamation-circle text-danger';
            $tagClass = 'bg-danger';
        } elseif ($customType === 'flag') {
            $tag = __('Flagged'); 
            $iconClass = 'fa-flag text-warning';
            $tagClass = 'bg-warning';
        } elseif ($customType === 'review') {
            $tag = __('Review');
            $iconClass = 'fa-user-check text-success'; 
            $tagClass = 'bg-success';
        } elseif ($customType === 'report') {
            $tag = __('Report');
            $iconClass = 'fa-user-slash text-warning';
            $tagClass = 'bg-warning';
        } elseif ($customType === 'new') {
            $tag = __('Support');
            $iconClass = 'fa-headset text-info';
            $tagClass = 'bg-info';
        }

        return [
            'id'               => $notification->id,
            'message'          => $message, 
            'url'              => $data['url'] ?? '#',
            'created_at_human' => $notification->created_at->diffForHumans(),
            'read_at'          => $notification->read_at,
            'is_read'          => (bool) $notification->read_at,
            'tag'              => $tag,
            'icon_class'       => 'fa ' . $iconClass,
            'tag_class'        => $tagClass,
        ];
    }

    /**
     * Display a paginated listing of notifications for the authenticated administrator.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $notifications = Auth::user()->notifications()->paginate(15);
        
        $styledNotifications = $notifications->through(function ($note) {
            return $this->mapNotificationForDisplay($note);
        });

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
