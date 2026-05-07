{{--
    Administrative Intelligence Component: Payable Attribution Protocol
    
    This partial orchestrates the visual mapping and navigation links 
    for transaction-linked entities. It facilitates the discovery of 
    originating subscriptions, property bookings, or event ticket purchases.
    
    @context Analytical Reporting
    @variables Model $payable The polymorphic entity associated with the transaction.
--}}
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
                // Assuming $payable->plan is eagerly loaded or accessible
                $planName = $payable->plan->title ?? 'N/A';
                $linkText = "Subscription to {$planName}";
                // NOTE: Using a placeholder route for now. Replace with actual route.
                $linkUrl = route('admin.reports.payments', absolute: false) . '?type=subscription'; 
                $icon = 'fas fa-rocket';
                $color = 'text-info';
                break;

            case 'PropertyBooking':
                $linkText = 'Property Booking: #' . $payable->id;
                // NOTE: Using bookings report as a placeholder destination. Replace with actual route.
                $linkUrl = route('admin.reports.bookings', absolute: false) . '?booking=' . $payable->id; 
                $icon = 'fas fa-house-door';
                $color = 'text-success';
                break;
                
            case 'EventBooking':
                $linkText = 'Event Ticket Purchase: #' . $payable->id;
                // NOTE: Using bookings report as a placeholder destination. Replace with actual route.
                $linkUrl = route('admin.reports.bookings', absolute: false) . '?booking=' . $payable->id; 
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
