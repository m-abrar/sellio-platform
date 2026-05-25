<?php

namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

use App\Http\Controllers\Controller;
use App\Http\Resources\Partner\NotificationResource;
use App\Services\Partner\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function __construct(private NotificationService $notificationService)
    {
    }

    public function index(Request $request)
    {
        $partner = Auth::user();
        $this->notificationService->syncUnread($partner);

        $unreadOnly = $request->boolean('unread');
        $notifications = $this->notificationService->paginate(
            $partner,
            $unreadOnly ?: null,
            (int) $request->get('per_page', 20)
        );

        return $this->successResponse(NotificationResource::collection($notifications));
    }

    public function markAsRead(string $notification)
    {
        $record = $this->notificationService->markAsRead(Auth::user(), $notification);

        return $this->successResponse(
            new NotificationResource($record),
            __('Notification marked as read.')
        );
    }

    public function markAllAsRead()
    {
        $count = $this->notificationService->markAllAsRead(Auth::user());

        return $this->successResponse(
            ['marked' => $count],
            __('All notifications marked as read.')
        );
    }

    public function destroy(string $notification)
    {
        $this->notificationService->delete(Auth::user(), $notification);

        return $this->successResponse(null, __('Notification deleted.'));
    }
}
