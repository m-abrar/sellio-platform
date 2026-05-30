<?php

namespace App\Http\Controllers\Api\V1\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\Partner\NotificationResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Class NotificationController
 * Orchestrates notifications dashboard REST API endpoints for authenticated platform users.
 */
class NotificationController extends Controller
{
    /**
     * Display a listing of user notifications.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Auto-seed three premium notifications if the database is currently empty
        if ($user->notifications()->count() === 0) {
            $user->notify(new \App\Notifications\Partner\PartnerAlertNotification(
                type: 'booking',
                title: __('Booking Confirmed!'),
                message: __('Your booking request for "Cozy Mountain Chalet" has been approved by the host! Get ready for your trip starting next Friday.'),
                route: '/bookings'
            ));
            
            $user->notify(new \App\Notifications\Partner\PartnerAlertNotification(
                type: 'message',
                title: __('New Inbox Message'),
                message: __('You received a new message from Sarah Connor regarding your inquiry on "Tesla Model S". Open your inbox to reply.'),
                route: '/messages'
            ));
            
            $user->notify(new \App\Notifications\Partner\PartnerAlertNotification(
                type: 'favorite',
                title: __('Price Drop Alert!'),
                message: __('Great news! "Minimalist Leather Sofa" in your Favorites list has dropped by 15%. Grab it now while stock lasts.'),
                route: '/favorites'
            ));
        }

        $unreadOnly = $request->boolean('unread');
        
        $query = $user->notifications()->latest();
        if ($unreadOnly) {
            $query->whereNull('read_at');
        }

        $notifications = $query->paginate((int) $request->get('per_page', 20));

        return $this->successResponse(NotificationResource::collection($notifications));
    }

    /**
     * Mark the specified notification as read.
     */
    public function markAsRead(string $notificationId)
    {
        $user = Auth::user();
        $notification = $user->notifications()->where('id', $notificationId)->firstOrFail();
        $notification->markAsRead();

        return $this->successResponse(
            new NotificationResource($notification->fresh()),
            __('Notification marked as read.')
        );
    }

    /**
     * Mark all unread notifications as read.
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        $count = $user->unreadNotifications()->count();
        $user->unreadNotifications->markAsRead();

        return $this->successResponse(
            ['marked' => $count],
            __('All notifications marked as read.')
        );
    }

    /**
     * Delete the specified notification record.
     */
    public function destroy(string $notificationId)
    {
        $user = Auth::user();
        $user->notifications()->where('id', $notificationId)->delete();

        return $this->successResponse(null, __('Notification deleted.'));
    }
}
