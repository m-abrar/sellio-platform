@php
    $agentName = $property->user?->name ?? __('Agent');
    $agentFirstName = Str::before($agentName, ' ');
    $user = Auth::user();
@endphp

<div class="card glass-surface mb-4">
    <div class="card-header bg-primary text-white p-4 border-0">
        <h4 class="fw-800 mb-0"><i class="bi-calendar-check-fill me-2"></i>{{ __('Schedule a Visit') }}</h4>
    </div>

    <div class="card-body p-4">
        <h6 class="fw-bold mb-4">
            <i class="bi bi-envelope-paper me-2 text-primary-color"></i>
            {{ __('Fill in the required details') }}
        </h6>

        <form id="visitForm" action="{{ route('property.visit.store', $property->slug) }}" method="POST">
            @csrf

            <input type="hidden" name="property_id" value="{{ $property->id }}">
            <input type="hidden" name="scheduled_at" id="scheduled_at">

            <div class="mb-3">
                <label for="visit-date" class="form-label small fw-semibold">{{ __('Preferred Date') }}</label>
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

            <div class="mb-3">
                <label for="visit-time" class="form-label small fw-semibold">{{ __('Preferred Time') }}</label>
                <select id="visit-time" name="preferred_time" class="form-select @error('preferred_time') is-invalid @enderror" required>
                    <option value="" disabled selected>{{ __('Select a time slot') }}</option>
                    <option value="09:00:00" @selected(old('preferred_time') === '09:00:00')>{{ __('9:00 AM - 11:00 AM') }}</option>
                    <option value="11:00:00" @selected(old('preferred_time') === '11:00:00')>{{ __('11:00 AM - 1:00 PM') }}</option>
                    <option value="13:00:00" @selected(old('preferred_time') === '13:00:00')>{{ __('1:00 PM - 3:00 PM') }}</option>
                    <option value="15:00:00" @selected(old('preferred_time') === '15:00:00')>{{ __('3:00 PM - 5:00 PM') }}</option>
                </select>
                @error('preferred_time')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <hr>

            <div class="mb-3">
                <input
                    type="text"
                    name="full_name"
                    class="form-control @error('full_name') is-invalid @enderror"
                    placeholder="{{ __('Enter Your Full Name') }}"
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
                    placeholder="{{ __('Enter Your Email Address') }}"
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
                    placeholder="{{ __('Enter Your Phone Number') }}"
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
                    placeholder="{{ __('Any special requests or notes?') }}"
                >{{ old('notes') }}</textarea>
                @error('notes')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="d-grid">
                <button type="submit" class="btn btn-lg fw-bold text-white btn-primary-theme shadow-primary-md">
                    <i class="bi bi-send-fill me-2"></i>{{ __('Send Request') }}
                </button>
            </div>

            <p class="small text-center text-muted mt-3 mb-0">
                {{ __(':name will confirm your request shortly.', ['name' => $agentFirstName]) }}
            </p>
        </form>
    </div>
</div>

<script>
    document.getElementById('visitForm').addEventListener('submit', function(event) {
        const dateInput = document.getElementById('visit-date');
        const timeInput = document.getElementById('visit-time');
        const scheduledAtInput = document.getElementById('scheduled_at');

        if (dateInput.value && timeInput.value) {
            scheduledAtInput.value = dateInput.value + ' ' + timeInput.value;
        } else {
            event.preventDefault();
            alert('{{ __('Please select both a preferred date and time for your visit.') }}');
        }
    });
</script>
