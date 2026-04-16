<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class NotificationController extends Controller
{
    protected function mapNotificationForDisplay($notification)
    {
        $data = $notification->data;
        $customType = $data['type'] ?? 'default';
        
        $rawType = Str::afterLast($notification->type, '\\');
        
        $tag = 'New';
        $iconClass = 'fa-bell text-primary';
        $tagClass = 'bg-primary';
        
        $message = $data['message'] ?? 'System Notification';

        if ($customType === 'alert') {
            $tag = 'Urgent';
            $iconClass = 'fa-exclamation-circle text-danger';
            $tagClass = 'bg-danger';
        } elseif ($customType === 'flag') {
            $tag = 'Flagged'; 
            $iconClass = 'fa-flag text-warning';
            $tagClass = 'bg-warning';
        } elseif ($customType === 'review') {
            $tag = 'Review';
            $iconClass = 'fa-user-check text-success'; 
            $tagClass = 'bg-success';
        } elseif ($customType === 'report') {
            $tag = 'Report';
            $iconClass = 'fa-user-slash text-warning';
            $tagClass = 'bg-warning';
        } elseif ($customType === 'new') {
            $tag = 'Support';
            $iconClass = 'fa-headset text-info';
            $tagClass = 'bg-info';
        }

        return [
            'id' => $notification->id,
            'message' => $message, 
            'url' => $data['url'] ?? '#',
            'created_at_human' => $notification->created_at->diffForHumans(),
            'read_at' => $notification->read_at,
            'is_read' => (bool) $notification->read_at,
            'tag' => $tag,
            'icon_class' => 'fa ' . $iconClass,
            'tag_class' => $tagClass,
        ];
    }

    public function index()
    {
        $notifications = Auth::user()->notifications()->paginate(15);
        
        $styledNotifications = $notifications->through(function ($note) {
            return $this->mapNotificationForDisplay($note);
        });

        return view('admin.notifications.index', compact('styledNotifications', 'notifications'));
    }

    public function markAllRead()
    {
        Auth::user()->unreadNotifications->markAsRead();
        return back()->with('success', 'All notifications marked as read!');
    }
}
