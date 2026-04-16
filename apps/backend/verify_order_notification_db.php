<?php

use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderStatusChanged;
use Illuminate\Support\Facades\Notification;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing Order Status (DB CHANNEL ONLY)...\n";

$order = Order::first();
$user = $order->user;

// Only use database channel to avoid SMTP errors
$user->notify(new OrderStatusChanged($order));

echo "Notification dispatched.\n";

$notification = $user->notifications()->latest()->first();
if ($notification && $notification->type === OrderStatusChanged::class) {
    echo "SUCCESS: Database notification found!\n";
    print_r($notification->data);
} else {
    echo "FAILED: Database notification not found.\n";
}
