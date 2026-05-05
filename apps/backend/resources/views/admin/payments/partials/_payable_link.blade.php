@php
    /** @var \Illuminate\Database\Eloquent\Model|null $payable The model associated with the payment (e.g., EventBooking, Subscription) */
    
    // Default values for deleted or null payable items
    $linkText = 'Deleted Item';
    $linkUrl = '#';
    $icon = 'fas fa-trash'; // Using Font Awesome for consistency
    $color = 'text-muted';

    if ($payable) {
        $modelName = class_basename($payable);
        $icon = 'fas fa-question-circle'; // Default icon for unknown types
        $linkUrl = '#'; 
        $color = 'text-secondary';

        switch ($modelName) {
            case 'Subscription':
                $planName = $payable->plan->title ?? 'N/A';
                $linkText = "Subscription to {$planName}";
                $linkUrl = route('admin.subscriptions.index', absolute: false); 
                $icon = 'fas fa-rocket';
                $color = 'text-info';
                break;

            case 'PropertyBooking':
                $linkText = 'Property Booking: #' . $payable->id;
                $linkUrl = url('/admin/bookings/show/PropertyBooking/' . $payable->id); 
                $icon = 'fas fa-home';
                $color = 'text-success';
                break;
                
            case 'EventBooking':
                $linkText = 'Event Ticket: #' . $payable->id;
                $linkUrl = url('/admin/bookings/show/EventBooking/' . $payable->id); 
                $icon = 'fas fa-calendar-alt';
                $color = 'text-warning';
                break;
                
            default:
                $linkText = $modelName . ' Payment';
                $color = 'text-secondary';
                break;
        }
    }
@endphp

<a href="{{ $linkUrl }}" class="font-weight-bold {{ $color }}">
    <i class="{{ $icon }} mr-1"></i>
    {{ $linkText }}
</a>
