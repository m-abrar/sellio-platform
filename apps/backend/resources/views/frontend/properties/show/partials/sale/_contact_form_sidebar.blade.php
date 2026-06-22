@php
    $agentName = $property->user?->name ?? __('Agent');
    $agentFirstName = Str::before($agentName, ' ');
    $user = Auth::user();
@endphp

<div class="card detail-sidebar-card mb-4 overflow-hidden" id="visit-widget">
    <div class="card-header border-0 p-4" style="background:var(--primary-color)">
        <h4 class="fw-800 mb-1 text-white">
            <i class="bi-calendar-check-fill me-2"></i>{{ __('Schedule a Visit') }}
        </h4>
        <p class="small mb-0" style="color:rgba(255,255,255,.65)">
            {{ __('Share your preferred time and the agent will confirm availability.') }}
        </p>
    </div>

    <div class="card-body p-4">
        <h6 class="fw-800 mb-3 text-primary" style="font-size:.8rem;letter-spacing:.04em;text-transform:uppercase">
            <i class="bi bi-clock me-2" aria-hidden="true"></i>{{ __('Visit details') }}
        </h6>

        <form id="visitForm" action="{{ route('property.visit.store', $property->slug) }}" method="POST">
            @csrf
            <input type="hidden" name="property_id" value="{{ $property->id }}">
            <input type="hidden" name="scheduled_at" id="scheduled_at">

            <p id="visit-form-date-error" class="text-danger small fw-semibold d-none mb-3" role="alert">
                {{ __('Please select both a preferred date and time for your visit.') }}
            </p>

            {{-- Date & time in warm grouped container --}}
            <div class="visit-datetime-group mb-4">
                <div class="mb-3">
                    <label for="visit-date" class="form-label small fw-semibold">{{ __('Preferred Date') }}</label>
                    <input
                        type="date"
                        id="visit-date"
                        name="preferred_date"
                        class="form-control visit-input @error('preferred_date') is-invalid @enderror"
                        required
                        min="{{ now()->toDateString() }}"
                        value="{{ old('preferred_date') }}"
                    >
                    @error('preferred_date')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>

                <div class="mb-0">
                    <label for="visit-time" class="form-label small fw-semibold">{{ __('Preferred Time') }}</label>
                    <select id="visit-time" name="preferred_time" class="form-select visit-input @error('preferred_time') is-invalid @enderror" required>
                        <option value="" disabled selected>{{ __('Select a time slot') }}</option>
                        <option value="09:00:00" @selected(old('preferred_time') === '09:00:00')>{{ __('9:00 AM – 11:00 AM') }}</option>
                        <option value="11:00:00" @selected(old('preferred_time') === '11:00:00')>{{ __('11:00 AM – 1:00 PM') }}</option>
                        <option value="13:00:00" @selected(old('preferred_time') === '13:00:00')>{{ __('1:00 PM – 3:00 PM') }}</option>
                        <option value="15:00:00" @selected(old('preferred_time') === '15:00:00')>{{ __('3:00 PM – 5:00 PM') }}</option>
                    </select>
                    @error('preferred_time')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>
            </div>

            <div class="visit-divider mb-4"></div>

            <div class="mb-3">
                <label for="visit-full-name" class="form-label small fw-semibold">{{ __('Full Name') }}</label>
                <input
                    id="visit-full-name"
                    type="text"
                    name="full_name"
                    class="form-control visit-input @error('full_name') is-invalid @enderror"
                    placeholder="{{ __('Your full name') }}"
                    value="{{ old('full_name', $user->name ?? '') }}"
                    required
                >
                @error('full_name')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-3">
                <label for="visit-email" class="form-label small fw-semibold">{{ __('Email Address') }}</label>
                <input
                    id="visit-email"
                    type="email"
                    name="email"
                    class="form-control visit-input @error('email') is-invalid @enderror"
                    placeholder="{{ __('you@example.com') }}"
                    value="{{ old('email', $user->email ?? '') }}"
                    required
                >
                @error('email')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-3">
                <label for="visit-phone" class="form-label small fw-semibold">
                    {{ __('Phone Number') }} <span class="text-muted fw-normal">({{ __('optional') }})</span>
                </label>
                <input
                    id="visit-phone"
                    type="tel"
                    name="phone"
                    class="form-control visit-input @error('phone') is-invalid @enderror"
                    placeholder="{{ __('+1 (555) 000-0000') }}"
                    value="{{ old('phone') }}"
                >
                @error('phone')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-4">
                <label for="visit-notes" class="form-label small fw-semibold">
                    {{ __('Notes') }} <span class="text-muted fw-normal">({{ __('optional') }})</span>
                </label>
                <textarea
                    id="visit-notes"
                    name="notes"
                    class="form-control visit-input @error('notes') is-invalid @enderror"
                    placeholder="{{ __('Questions, access needs, or preferred contact method') }}"
                    rows="3"
                >{{ old('notes') }}</textarea>
                @error('notes')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-header-cta">
                    <i class="bi bi-send-fill me-2"></i>{{ __('Request visit') }}<i class="bi bi-arrow-right ms-2"></i>
                </button>
            </div>

            <p class="small text-center text-muted mt-3 mb-0">
                {{ __(':name will confirm your request shortly.', ['name' => $agentFirstName]) }}
            </p>
        </form>
    </div>
</div>

@push('styles')
<style>
/* ── Date/time warm group ─────────────────────────────────────────── */
.visit-datetime-group {
    background: rgba(248, 246, 243, 0.8);
    border: 1.5px solid rgba(15, 23, 42, 0.07);
    border-radius: 12px;
    padding: 16px;
}

/* ── Soft divider replacing <hr> ──────────────────────────────────── */
.visit-divider {
    height: 1.5px;
    background: rgba(15, 23, 42, 0.06);
    border-radius: 999px;
}

/* ── Softened form inputs ─────────────────────────────────────────── */
#visit-widget .visit-input {
    border-color: rgba(15, 23, 42, 0.1);
    border-radius: 10px;
    min-height: 46px;
    font-size: 0.88rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

#visit-widget .visit-input:focus {
    border-color: rgba(var(--primary-color-rgb), 0.4);
    box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.08);
}

#visit-widget .visit-input::placeholder {
    color: #9ca3af;
    font-size: 0.85rem;
}

#visit-widget textarea.visit-input {
    min-height: 80px;
    resize: none;
}
</style>
@endpush

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const visitForm = document.getElementById('visitForm');
            const dateInput = document.getElementById('visit-date');
            const timeInput = document.getElementById('visit-time');
            const scheduledAtInput = document.getElementById('scheduled_at');
            const dateError = document.getElementById('visit-form-date-error');

            if (!visitForm || !dateInput || !timeInput || !scheduledAtInput) {
                return;
            }

            visitForm.addEventListener('submit', function(event) {
                if (dateInput.value && timeInput.value) {
                    scheduledAtInput.value = dateInput.value + ' ' + timeInput.value;
                    dateError?.classList.add('d-none');
                    return;
                }

                event.preventDefault();
                dateError?.classList.remove('d-none');
            });
        });
    </script>
@endpush
