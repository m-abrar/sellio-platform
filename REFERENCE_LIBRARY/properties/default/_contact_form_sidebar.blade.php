{{-- Schedule a Visit Widget --}}
@php
    // Assuming $property->user is the agent whose name we want for the CTA
    $agentName = $property->user->name ?? 'Agent';
    $agentFirstName = Str::before($agentName, ' ');
    // Auth Check for pre-filling contact fields
    $user = Auth::user();
@endphp

<div class="card glass-surface mb-4">
    <div class="card-header bg-primary text-white p-4 border-0">
        <h4 class="fw-800 mb-0"><i class="bi-calendar-check-fill me-2"></i>{{ __('Schedule a Visit') }}</h4>
    </div>
    <div class="card-body p-4">

    <h6 class="fw-bold mb-4">
        <i class="bi bi bi-envelope-paper me-2 text-primary-color"></i>
        {{ __('Fill in the required details') }}
    </h6>
    
    {{-- 💡 1. UPDATE FORM ACTION to the correct named route --}}
    <form id="visitForm" action="{{ route('property.visit.store', $property->slug) }}" method="POST">
        @csrf
        
        <input type="hidden" name="property_id" value="{{ $property->id }}">
        
        {{-- 💡 HIDDEN FIELD: This will hold the combined value the controller expects --}}
        <input type="hidden" name="scheduled_at" id="scheduled_at">

        {{-- 2. DATE PICKER (Original) --}}
        <div class="mb-3">
            <label for="visit-date" class="form-label small fw-semibold">Preferred Date</label>
            <input 
                type="date" 
                id="visit-date" 
                name="preferred_date" 
                class="form-control @error('preferred_date') is-invalid @enderror" 
                required 
                min="{{ now()->toDateString() }}"
                value="{{ old('preferred_date') }}"
            >
            @error('preferred_date')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        
        {{-- 3. TIME SLOT (Original) --}}
        <div class="mb-3">
            <label for="visit-time" class="form-label small fw-semibold">Preferred Time</label>
            <select id="visit-time" name="preferred_time" class="form-select @error('preferred_time') is-invalid @enderror" required>
                <option value="" disabled selected>Select a time slot</option>
                <option value="09:00:00" {{ old('preferred_time') == '09:00:00' ? 'selected' : '' }}>9:00 AM - 11:00 AM</option>
                <option value="11:00:00" {{ old('preferred_time') == '11:00:00' ? 'selected' : '' }}>11:00 AM - 1:00 PM</option>
                <option value="13:00:00" {{ old('preferred_time') == '13:00:00' ? 'selected' : '' }}>1:00 PM - 3:00 PM</option>
                <option value="15:00:00" {{ old('preferred_time') == '15:00:00' ? 'selected' : '' }}>3:00 PM - 5:00 PM</option>
                {{-- Note: Values are military time for easy concatenation (09:00:00) --}}
            </select>
            @error('preferred_time')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        
        <hr>

        {{-- 4. CONTACT FIELDS --}}
        <div class="mb-3">
            <input 
                type="text" 
                name="full_name" 
                class="form-control @error('full_name') is-invalid @enderror" 
                placeholder="Enter Your Full Name" 
                value="{{ old('full_name', $user->name ?? '') }}"
                required
            >
             @error('full_name')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        <div class="mb-3">
            <input 
                type="email" 
                name="email" 
                class="form-control @error('email') is-invalid @enderror" 
                placeholder="Enter Your Email Address" 
                value="{{ old('email', $user->email ?? '') }}"
                required
            >
             @error('email')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        <div class="mb-4">
            <input 
                type="tel" 
                name="phone" 
                class="form-control @error('phone') is-invalid @enderror" 
                placeholder="Enter Your Phone Number" 
                value="{{ old('phone') }}"
            >
             @error('phone')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        <div class="mb-4">
            <textarea 
                name="notes" 
                class="form-control @error('notes') is-invalid @enderror" 
                placeholder="Any special requests or notes?"
            >{{ old('notes') }}</textarea>
             @error('notes')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        {{-- High-Impact CTA Button --}}
        <div class="d-grid">
            <button type="submit" class="btn btn-lg fw-bold text-white btn-primary-theme shadow-primary-md">
                <i class="bi bi-send-fill me-2"></i>Send Request
            </button>
        </div>
        
        <p class="small text-center text-muted mt-3 mb-0">
            {{ $agentFirstName }} will confirm your request shortly.
        </p>
    </form>
    </div>
</div>

{{-- 💡 JAVASCRIPT: Logic to combine Date and Time --}}
<script>
    document.getElementById('visitForm').addEventListener('submit', function(event) {
        const dateInput = document.getElementById('visit-date');
        const timeInput = document.getElementById('visit-time');
        const scheduledAtInput = document.getElementById('scheduled_at');

        // Check if both fields have values
        if (dateInput.value && timeInput.value) {
            // Combine the date and time strings into the 'YYYY-MM-DD HH:MM:SS' format required by the controller/database
            // The time values are stored as military time (e.g., 09:00:00)
            scheduledAtInput.value = dateInput.value + ' ' + timeInput.value;
        } else {
            // Prevent submission if either field is missing (even though 'required' should handle this)
            event.preventDefault();
            alert('Please select both a preferred date and time for your visit.');
        }

        // The form will now submit, sending the combined value in the hidden 'scheduled_at' field.
    });
</script>