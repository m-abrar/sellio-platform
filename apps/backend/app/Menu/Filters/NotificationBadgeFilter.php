<?php

namespace App\Menu\Filters;

use Illuminate\Support\Facades\Auth;
use JeroenNoten\LaravelAdminLte\Menu\Filters\FilterInterface;

class NotificationBadgeFilter implements FilterInterface
{
    public function transform($item)
    {
        if (isset($item['id']) && $item['id'] === 'notifications_menu' && Auth::check()) {
            $item['label'] = Auth::user()->unreadNotifications()->count();
        }

        return $item;
    }
}
