{{--
| --------------------------------------------------------------------------
| Schedule a Test Drive Widget
| --------------------------------------------------------------------------
| Allows a user to request a test drive appointment for a specific auto listing.
| Assumes $auto variable is available.
--}}
@php
    // Assuming $auto->user is the dealer/sales contact
    $dealer = $auto->user;
    $dealerFirstName = Str::before($dealer->name ?? 'Dealer', ' ');
@endphp

<div class="card glass-surface p-4 mb-4">
    
    <h4 class="fw-bold mb-3">
        <i class="bi bi-calendar-check-fill me-2 text-primary-color"></i>Request a Test Drive
    </h4>

    {{-- Form action updated to the new dedicated route --}}
    <form action="{{ route('autos.inquiry.store', $auto->slug) }}" method="POST">
        @csrf
        
        <input type="hidden" name="auto_id" value="{{ $auto->id }}">
        
        {{-- Contact Information Fields --}}
        <div class="mb-3">
            <label for="td-name" class="form-label small fw-semibold">Your Full Name</label>
            <input type="text" id="td-name" name="full_name" class="form-control" placeholder="John Doe" 
                value="{{ old('full_name') }}" required>
        </div>
        
        <div class="mb-3">
            <label for="td-email" class="form-label small fw-semibold">Email Address</label>
            <input type="email" id="td-email" name="email" class="form-control" placeholder="john.doe@example.com" 
                value="{{ old('email') }}" required>
        </div>
        
        <div class="mb-4">
            <label for="td-phone" class="form-label small fw-semibold">Phone Number (Optional)</label>
            <input type="tel" id="td-phone" name="phone" class="form-control" placeholder="(555) 555-5555"
                value="{{ old('phone') }}">
        </div>

        <hr class="my-4">

        {{-- Preferred Date Input --}}
        <div class="mb-3">
            <label for="td-date" class="form-label small fw-semibold">Preferred Date</label>
            <input type="date" id="td-date" name="preferred_date" class="form-control" 
                value="{{ old('preferred_date') }}" required>
        </div>
        
        {{-- Preferred Time Slot Select --}}
        <div class="mb-4">
            <label for="td-time" class="form-label small fw-semibold">Time Slot</label>
            <select id="td-time" name="preferred_time" class="form-select" required>
                <option value="" disabled {{ !old('preferred_time') ? 'selected' : '' }}>Select a time slot...</option>
                <option value="AM" {{ old('preferred_time') === 'AM' ? 'selected' : '' }}>Morning (9:00 AM - 12:00 PM)</option>
                <option value="PM" {{ old('preferred_time') === 'PM' ? 'selected' : '' }}>Afternoon (1:00 PM - 5:00 PM)</option>
                <option value="Anytime" {{ old('preferred_time') === 'Anytime' ? 'selected' : '' }}>Any Available Time</option>
            </select>
        </div>

        {{-- Optional Message/Notes --}}
        <div class="mb-4">
            <label for="td-message" class="form-label small fw-semibold">Message/Notes (Optional)</label>
            <textarea id="td-message" name="message" class="form-control" rows="3" 
                placeholder="I have a few questions about financing.">{{ old('message') }}</textarea>
        </div>
        
        {{-- CTA Button --}}
        <div class="d-grid">
            <button type="submit" class="btn btn-lg fw-bold text-white btn-primary-theme shadow-primary-md">
                <i class="bi bi-car-front-fill me-2"></i>Submit Inquiry
            </button>
        </div>

        {{-- Confirmation Message --}}
        <small class="d-block text-center text-muted mt-2">
            {{ $dealerFirstName }} will contact you to confirm the appointment.
        </small>
    </form>
</div>
