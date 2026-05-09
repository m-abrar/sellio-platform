<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;

    /**
     * Create a new notification instance.
     */
    public function __construct($order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $statusLabel = str_replace('_', ' ', $this->order->status);

        return (new MailMessage)
            ->subject('Order Update: #' . $this->order->order_number)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('The status of your order #' . $this->order->order_number . ' has been updated to **' . ucfirst($statusLabel) . '**.')
            ->when($this->order->tracking_number, function ($mail) {
                return $mail->line('Tracking Number: **' . $this->order->tracking_number . '**');
            })
            ->action('View Order Details', url('/account/orders/' . $this->order->id))
            ->line('Thank you for shopping with us!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'status' => $this->order->status,
            'message' => 'Your order #' . $this->order->order_number . ' is now ' . str_replace('_', ' ', $this->order->status) . '.',
        ];
    }
}
