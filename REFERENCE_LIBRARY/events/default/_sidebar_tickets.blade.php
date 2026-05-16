{{-- Blade: put JSON in a single-quoted data attribute using @json to avoid HTML quote breaking --}}


<div class="ticket-sidebar sticky-top" style="top: 20px;">
    
    {{-- Hidden data for JavaScript to use --}}
    <div id="all-ticket-data"
     data-inventory='@json($allTicketData)'
     data-booking-route="{{ route('events.tickets.booking.store', ['event' => $event->slug, 'ticket' => '__TICKET_ID__']) }}"
     style="display: none;"></div>

    {{-- 1. Occurrence Picker --}}
    <div class="card glass-surface p-4 border border-primary-light shadow-lg mb-4">
        <h4 class="fw-bold mb-3"><i class="bi bi-calendar-event me-2 text-primary-color"></i>Select Date</h4>
        
        @if ($allTicketData->isNotEmpty())
            <form id="occurrence-selection-form">
                
                {{-- START OF FIX: Add a fixed-height scroll container --}}
                <div id="date-options-scroll" style="max-height: 250px; overflow-y: auto; border-bottom: 1px solid #eee; margin-bottom: 15px;">
                {{-- END OF FIX --}}
                    
                    @foreach ($allTicketData as $occurrenceId => $data)
                        <div class="form-check mb-2">
                            <input class="form-check-input occurrence-radio" type="radio" 
                                name="selected_occurrence_id" 
                                id="occurrence-{{ $occurrenceId }}" 
                                value="{{ $occurrenceId }}">
                            <label class="form-check-label fw-semibold" for="occurrence-{{ $occurrenceId }}">
                                {{ $data['start_date_formatted'] }}
                            </label>
                        </div>
                    @endforeach

                {{-- START OF FIX --}}
                </div>
                {{-- END OF FIX --}}

                {{-- Optional: Show a message if scrolling is needed --}}
                @if (count($allTicketData) > 5) {{-- Assuming 5 items fit before scroll is needed --}}
                    <small class="text-muted d-block mt-2">Scroll for more dates...</small>
                @endif
            </form>
        @else
            <div class="alert alert-info">There are no upcoming dates available for booking.</div>
        @endif
    </div>

    {{-- 2. Dynamic Ticket Purchase Card --}}
    <div class="card glass-surface p-4 border border-primary-light shadow-lg mb-4">
        <h4 class="fw-bold mb-3"><i class="bi bi-ticket-fill me-2 text-primary-color"></i>Get Your Tickets</h4>
        
        {{-- Countdown Timer Placeholder (will be updated by JS) --}}
        <div id="countdown-wrapper" class="d-none">
            <div class="bg-danger-theme text-white text-center p-2 rounded mb-3 small fw-bold">
                Registration Closes In: 
                <span class="d-block fs-5 fw-bolder" 
                      id="countdown-timer" 
                      data-countdown-to="">
                      00 Days 00:00:00
                </span>
            </div>
        </div>
        
        {{-- Booking Form Container --}}
        <form id="booking-form" action="" method="POST" class="d-none">
            @csrf 
            
            {{-- Hidden field to store the selected occurrence ID --}}
            <input type="hidden" name="event_occurrence_id" id="form-occurrence-id">
            
            <h6 class="fw-semibold mb-3">Select Ticket Type and Quantity:</h6>

            {{-- Dynamic Ticket Rows will be injected here --}}
            <div id="ticket-rows-container"></div>
            
            <hr class="mt-4 mb-3">

            {{-- Dynamic Summary --}}
            <div class="d-flex justify-content-between align-items-center mb-4">
                <span class="fw-bold fs-5">Total:</span>
                <span class="fw-bolder fs-3 text-primary-color" id="total-price">$0</span> 
            </div>

            <div class="d-grid mb-3">
                <button type="submit" id="checkout-button" class="btn btn-lg fw-bold text-white btn-primary-theme" disabled>
                    <i class="bi bi-cart-fill me-2"></i>Proceed to Checkout
                </button>
            </div>
        </form>
        
        {{-- Placeholder for when no date is selected --}}
        <div id="no-selection-message" class="text-center py-4 border rounded">
            Select an event date above to view ticket options.
        </div>
    </div>
    
    {{-- ... Rest of the sidebar content ... --}}
    
</div>