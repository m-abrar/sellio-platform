<?php

use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderStatusChanged;
use Illuminate\Support\Facades\Notification;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing Order Status Notification...\n";

$order = Order::first();
if (!$order) {
    echo "No orders found to test.\n";
    exit;
}

$user = $order->user;
if (!$user) {
    echo "This order has no user associated.\n";
    exit;
}

echo "Order found: #" . $order->order_number . "\n";
echo "User: " . $user->email . "\n";

// Change status
$order->status = Order::STATUS_SHIPPED;
$order->tracking_number = 'TRK-VERIFY-123';
$order->save();

echo "Status updated to Shipped.\n";

// Notify
$user->notify(new OrderStatusChanged($order));

echo "Notification dispatched.\n";

// Check database notifications
$notification = $user->notifications()->latest()->first();
if ($notification && $notification->type === OrderStatusChanged::class) {
    echo "SUCCESS: Database notification found!\n";
    print_r($notification->data);
} else {
    echo "FAILED: Database notification not found.\n";
}
