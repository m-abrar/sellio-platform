@php
    $dealer = $auto->user;
    $dealerFirstName = Str::before($dealer->name ?? 'Dealer', ' ');
@endphp

<div class="card detail-sidebar-card mb-4 overflow-hidden" id="test-drive-widget">
    <div class="card-header border-0 p-4" style="background:var(--primary-color)">
        <h4 class="fw-800 mb-1 text-white">
            <i class="bi bi-car-front-fill me-2"></i>{{ __('Request a Test Drive') }}
        </h4>
        <p class="small mb-0" style="color:rgba(255,255,255,.65)">
            {{ __('Pick a date and the dealer will confirm your slot.') }}
        </p>
    </div>

    <div class="card-body p-4">
        <form action="{{ route('autos.inquiry.store', $auto->slug) }}" method="POST">
            @csrf
            <input type="hidden" name="auto_id" value="{{ $auto->id }}">

            <div class="mb-3">
                <label for="td-name" class="form-label small fw-semibold">{{ __('Your Full Name') }}</label>
                <input type="text" id="td-name" name="full_name"
                    class="form-control td-input"
                    placeholder="{{ __('John Doe') }}"
                    value="{{ old('full_name') }}" required>
            </div>

            <div class="mb-3">
                <label for="td-email" class="form-label small fw-semibold">{{ __('Email Address') }}</label>
                <input type="email" id="td-email" name="email"
                    class="form-control td-input"
                    placeholder="{{ __('john.doe@example.com') }}"
                    value="{{ old('email') }}" required>
            </div>

            <div class="mb-4">
                <label for="td-phone" class="form-label small fw-semibold">
                    {{ __('Phone Number') }} <span class="text-muted fw-normal">({{ __('optional') }})</span>
                </label>
                <input type="tel" id="td-phone" name="phone"
                    class="form-control td-input"
                    placeholder="{{ __('(555) 555-5555') }}"
                    value="{{ old('phone') }}">
            </div>

            <div class="td-divider mb-4"></div>

            {{-- Date & time in warm grouped container --}}
            <div class="td-datetime-group mb-4">
                <div class="mb-3">
                    <label for="td-date" class="form-label small fw-semibold">{{ __('Preferred Date') }}</label>
                    <input type="date" id="td-date" name="preferred_date"
                        class="form-control td-input"
                        value="{{ old('preferred_date') }}" required>
                </div>
                <div class="mb-0">
                    <label for="td-time" class="form-label small fw-semibold">{{ __('Time Slot') }}</label>
                    <select id="td-time" name="preferred_time" class="form-select td-input" required>
                        <option value="" disabled {{ !old('preferred_time') ? 'selected' : '' }}>{{ __('Select a time slot') }}</option>
                        <option value="AM" {{ old('preferred_time') === 'AM' ? 'selected' : '' }}>{{ __('Morning (9:00 AM – 12:00 PM)') }}</option>
                        <option value="PM" {{ old('preferred_time') === 'PM' ? 'selected' : '' }}>{{ __('Afternoon (1:00 PM – 5:00 PM)') }}</option>
                        <option value="Anytime" {{ old('preferred_time') === 'Anytime' ? 'selected' : '' }}>{{ __('Any Available Time') }}</option>
                    </select>
                </div>
            </div>

            <div class="mb-4">
                <label for="td-message" class="form-label small fw-semibold">
                    {{ __('Notes') }} <span class="text-muted fw-normal">({{ __('optional') }})</span>
                </label>
                <textarea id="td-message" name="message"
                    class="form-control td-input"
                    rows="3"
                    placeholder="{{ __('I have a few questions about financing.') }}">{{ old('message') }}</textarea>
            </div>

            <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-header-cta">
                    <i class="bi bi-send-fill me-2"></i>{{ __('Submit inquiry') }}<i class="bi bi-arrow-right ms-2"></i>
                </button>
            </div>

            <p class="small text-center text-muted mt-3 mb-0">
                {{ __(':name will contact you to confirm the appointment.', ['name' => $dealerFirstName]) }}
            </p>
        </form>
    </div>
</div>

@push('styles')
<style>
/* ── Date/time warm group ─────────────────────────────────────────── */
.td-datetime-group {
    background: rgba(248, 246, 243, 0.8);
    border: 1.5px solid rgba(15, 23, 42, 0.07);
    border-radius: 12px;
    padding: 16px;
}

/* ── Soft divider ─────────────────────────────────────────────────── */
.td-divider {
    height: 1.5px;
    background: rgba(15, 23, 42, 0.06);
    border-radius: 999px;
}

/* ── Softened inputs ──────────────────────────────────────────────── */
#test-drive-widget .td-input {
    border-color: rgba(15, 23, 42, 0.1);
    border-radius: 10px;
    min-height: 46px;
    font-size: 0.88rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

#test-drive-widget .td-input:focus {
    border-color: rgba(var(--primary-color-rgb), 0.4);
    box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.08);
}

#test-drive-widget .td-input::placeholder {
    color: #9ca3af;
    font-size: 0.85rem;
}

#test-drive-widget textarea.td-input {
    min-height: 80px;
    resize: none;
}
</style>
@endpush
