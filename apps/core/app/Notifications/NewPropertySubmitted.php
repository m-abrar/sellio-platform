<?php

namespace App\Notifications;

use App\Models\Property;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewPropertySubmitted extends Notification
{
    use Queueable;

    public function __construct(public Property $property) {}

    public function via($notifiable)
    {
        return ['database'];
        // You can also add: 'mail', 'broadcast'
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "New property listing submitted: {$this->property->title}",
            'property_id' => $this->property->id,
            'url' => route('properties.show', $this->property->id)
        ];
    }
}
