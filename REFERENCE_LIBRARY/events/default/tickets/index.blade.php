@extends('frontend._layouts._app')

{{-- Define the variables for the parent layout --}}
@section('title', 'Select Tickets for: ' . $event->title) 
@section('body_class', 'has-body-glow')

@section('content')

    <div class="row pt-4 g-4 justify-content-center">
        <div class="col-lg-8 main-content">
            
            {{-- Breadcrumbs Partial --}}
            @include('frontend.themes.events.default.show.partials._breadcrumbs', [
                'current_step' => 'Tickets',
                'event_title'  => $event->title,
                'event_slug'   => $event->slug,
            ])

            <h1 class="mb-4">
                <i class="bi bi-ticket-detailed me-2 text-primary-color"></i> 
                Select Your Tickets
            </h1>
            
            <p class="lead text-muted">{{ $event->subtitle ?? 'Choose your preferred ticket type and event date.' }}</p>

            @if ($event->occurrences->isEmpty() || $ticketTypes->isEmpty())
                <div class="alert alert-warning text-center mt-5">
                    No tickets or upcoming dates are currently available for this event.
                </div>
            @else
                {{-- Form starts here, handles submission of selected tickets and quantity --}}
                <form method="POST" action="{{ route('events.tickets.booking.store', ['event' => $event->slug, 'ticket' => ':TICKET_ID']) }}" id="ticket-selection-form">
                    @csrf
                    
                    {{-- 1. Occurrence Selection (If multiple dates exist) --}}
                    @if ($event->occurrences->count() > 1)
                        <div class="card p-4 shadow-sm mb-4">
                            <h3 class="card-title mb-3 border-bottom pb-2">
                                <i class="bi bi-calendar me-2"></i> Select Date
                            </h3>
                            <select name="occurrence_id" class="form-select form-select-lg" required>
                                <option value="" disabled selected>Choose an event date...</option>
                                @foreach ($event->occurrences as $occurrence)
                                    <option value="{{ $occurrence->id }}">
                                        {{ $occurrence->start_date_time->format('F jS, Y') }} - 
                                        {{ $occurrence->start_date_time->format('h:i A') }}
                                        ({{ $occurrence->is_virtual ? 'Online' : $occurrence->venue_name }})
                                    </option>
                                @endforeach
                            </select>
                            @error('occurrence_id')<div class="text-danger small mt-2">{{ $message }}</div>@enderror
                        </div>
                    @else
                        {{-- If only one occurrence, include it as a hidden field --}}
                        <input type="hidden" name="occurrence_id" value="{{ $event->occurrences->first()->id }}">
                    @endif

                    {{-- 2. Ticket Type Selection --}}
                    <div class="card p-4 shadow-sm mb-4">
                        <h3 class="card-title mb-3 border-bottom pb-2">
                            <i class="bi bi-cash me-2"></i> Choose Ticket Type
                        </h3>
                        
                        @foreach ($ticketTypes as $ticketType)
                            <div class="row align-items-center border-bottom py-3 ticket-row g-3">
                                {{-- Ticket Info (Left) --}}
                                <div class="col-md-7">
                                    <h5 class="mb-1 fw-bold">{{ $ticketType->title }}</h5>
                                    <p class="small text-muted mb-0">{{ $ticketType->description }}</p>
                                    @if ($ticketType->is_free)
                                        <span class="badge bg-success-theme">FREE</span>
                                    @elseif ($ticketType->sale_ends_at && $ticketType->sale_ends_at->isFuture())
                                        <span class="badge bg-warning-theme">Sale Ends {{ $ticketType->sale_ends_at->diffForHumans() }}</span>
                                    @endif
                                </div>
                                
                                {{-- Price & Quantity (Right) --}}
                                <div class="col-md-5 d-flex align-items-center justify-content-end">
                                    <div class="me-3 text-end">
                                        <div class="fs-5 fw-bold text-success-theme">
                                            @if ($ticketType->is_free)
                                                Free
                                            @else
                                                ${{ number_format($ticketType->price, 2) }}
                                            @endif
                                        </div>
                                        <div class="small text-muted">
                                            {{ $ticketType->available_quantity > 0 ? $ticketType->available_quantity . ' left' : 'Sold Out' }}
                                        </div>
                                    </div>

                                    <div class="input-group" style="width: 130px;">
                                        {{-- Input name structure: tickets[TICKET_ID] = QUANTITY --}}
                                        <select name="tickets[{{ $ticketType->id }}]" class="form-select ticket-quantity" 
                                                data-ticket-id="{{ $ticketType->id }}" 
                                                {{ $ticketType->available_quantity <= 0 ? 'disabled' : '' }}>
                                            @for ($i = 0; $i <= min(10, $ticketType->available_quantity); $i++)
                                                <option value="{{ $i }}">{{ $i }}</option>
                                            @endfor
                                        </select>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                        
                        @error('tickets')<div class="text-danger small mt-2">Please select at least one ticket.</div>@enderror
                    </div>

                    {{-- 3. Proceed Button --}}
                    <div class="text-end">
                        <button type="submit" id="proceed-to-checkout" class="btn btn-primary-theme btn-lg px-5" disabled>
                            Proceed to Checkout 
                            <i class="bi bi-arrow-right-short ms-2"></i>
                        </button>
                    </div>

                </form>
            @endif
        </div>
    </div>
    
@endsection

@section('head_extra')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ticket-selection-form');
    const quantitySelectors = form.querySelectorAll('.ticket-quantity');
    const checkoutButton = document.getElementById('proceed-to-checkout');
    
    // Function to check if any quantity is selected
    function checkSelection() {
        let totalSelected = 0;
        let selectedTicketId = null;

        quantitySelectors.forEach(select => {
            const quantity = parseInt(select.value);
            if (quantity > 0) {
                totalSelected += quantity;
                selectedTicketId = select.getAttribute('data-ticket-id');
            }
        });

        if (totalSelected > 0 && selectedTicketId) {
            checkoutButton.removeAttribute('disabled');
            // Update the form action URL with the first selected ticket ID for the route binding
            let actionUrl = form.action.replace(':TICKET_ID', selectedTicketId);
            form.action = actionUrl;
        } else {
            checkoutButton.setAttribute('disabled', 'disabled');
            // Reset the action URL placeholder
            form.action = form.action.replace(selectedTicketId, ':TICKET_ID'); 
        }
    }

    // Attach event listeners to all quantity selectors
    quantitySelectors.forEach(select => {
        select.addEventListener('change', checkSelection);
    });

    // Initial check on page load
    checkSelection();
});
</script>
@endsection