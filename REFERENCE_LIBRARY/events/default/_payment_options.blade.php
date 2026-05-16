<form id="payment-form" method="POST" action="{{ route('events.tickets.booking.processPayment', ['event' => $booking->event->slug, 'booking' => $booking->id]) }}">
    @csrf
    
    {{-- Hidden field to ensure total amount is passed, pulled from Order Summary partial --}}
    <input type="hidden" name="booking_id" value="{{ $booking->id }}">
    <input type="hidden" id="final_total_amount_input" name="amount" value="{{ number_format($booking->total_price * 1.05, 2, '.', '') }}"> 

    <h5 class="mb-3">Select Payment Method:</h5>
    
    <div class="form-check border p-3 mb-2 rounded">
        <input class="form-check-input" type="radio" name="payment_method" id="payment_stripe" value="stripe" checked required>
        <label class="form-check-label fw-bold" for="payment_stripe">
            Credit Card (Stripe)
        </label>
        <div class="small text-muted mt-1">Pay securely using Visa, MasterCard, or American Express.</div>
    </div>

    <div class="form-check border p-3 mb-2 rounded">
        <input class="form-check-input" type="radio" name="payment_method" id="payment_paypal" value="paypal" required>
        <label class="form-check-label fw-bold" for="payment_paypal">
            PayPal
        </label>
        <div class="small text-muted mt-1">You will be redirected to PayPal's website to complete your purchase.</div>
    </div>
    
    {{-- Placeholder for the actual payment gateway form fields (e.g., Stripe card input) --}}
    <div id="stripe-payment-fields" class="mt-4 p-3 border rounded bg-light">
        <p class="text-muted small">Card fields will load here...</p>
        {{-- You would integrate Stripe Elements or similar fields here --}}
    </div>
    
    <hr class="my-4">

    <button type="submit" class="btn btn-success btn-lg w-100">
        <i class="bi bi-lock-fill me-2"></i> Complete Order & Pay ${{ number_format($booking->total_price * 1.05, 2) }}
    </button>
    
</form>

@push('payment_scripts')
<script>
    // Simple script to toggle visibility based on payment method selection
    document.addEventListener('DOMContentLoaded', function () {
        const stripeFields = document.getElementById('stripe-payment-fields');
        document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'stripe') {
                    stripeFields.style.display = 'block';
                } else {
                    stripeFields.style.display = 'none';
                }
            });
        });
        // Initial state
        if (document.getElementById('payment_paypal').checked) {
             stripeFields.style.display = 'none';
        }
    });
</script>
@endpush