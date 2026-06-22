{{-- Assumes $service is passed --}}
<div class="booking-sidebar">

    {{-- Booking Card (Primary Action) --}}
    <div class="card detail-sidebar-card mb-3 overflow-hidden">
        <div class="card-header border-0 p-4" style="background:var(--primary-color)">
            <h4 class="fw-800 mb-1 text-white"><i class="bi bi-calendar-check-fill me-2"></i>{{ __('Book your session') }}</h4>
        </div>
        <div class="card-body p-4">
        <h6 class="fw-800 mb-3" style="font-size:.8rem;letter-spacing:.04em;text-transform:uppercase;color:var(--primary-color)">
            <i class="bi bi-clock me-2"></i>{{ __('Booking details') }}
        </h6>
        <form action="{{ route('services.appointment.store', $service->slug) }}" method="POST">
            @csrf
            <input type="hidden" name="service_id" value="{{ $service->id }}">

            {{-- Date Picker --}}
            <div class="mb-3">
                <label class="form-label small fw-semibold text-muted">{{ __('Select date') }}</label>
                <div class="input-group rounded-3 overflow-hidden" style="border:1.5px solid rgba(15,23,42,.12)">
                    <span class="input-group-text bg-white border-0"><i class="bi bi-calendar-event" style="color:var(--primary-color)"></i></span>
                    <input type="date" name="booking_date" class="form-control border-0 shadow-none"
                           value="{{ old('booking_date', now()->addDay()->format('Y-m-d')) }}"
                           min="{{ now()->addDay()->format('Y-m-d') }}" required>
                </div>
            </div>

            {{-- Time Slot Selection --}}
            <div class="mb-3">
                <label class="form-label small fw-semibold text-muted">{{ __('Available time') }}</label>
                <div class="input-group rounded-3 overflow-hidden" style="border:1.5px solid rgba(15,23,42,.12)">
                    <span class="input-group-text bg-white border-0"><i class="bi bi-clock" style="color:var(--primary-color)"></i></span>
                    <select name="time_slot" class="form-select border-0 shadow-none" required>
                        <option value="" selected disabled>{{ __('Select time slot') }}</option>
                        @isset($availableSlots)
                            @foreach ($availableSlots as $slot)
                                <option value="{{ $slot['time'] }}" {{ old('time_slot') == $slot['time'] ? 'selected' : '' }} @if (!$slot['is_available']) disabled @endif>
                                    {{ $slot['time'] }} @if (!$slot['is_available']) ({{ __('Booked') }}) @endif
                                </option>
                            @endforeach
                        @else
                            <option value="09:00" {{ old('time_slot') == '09:00' ? 'selected' : '' }}>9:00 AM</option>
                            <option value="11:30" {{ old('time_slot') == '11:30' ? 'selected' : '' }}>11:30 AM</option>
                            <option value="14:00" {{ old('time_slot') == '14:00' ? 'selected' : '' }}>2:00 PM</option>
                        @endisset
                    </select>
                </div>
            </div>

            {{-- Service Package Selection --}}
            <div class="mb-4">
                <label class="form-label small fw-semibold text-muted">{{ __('Select package') }}</label>
                <select name="service_package_id" class="form-select py-2 shadow-none rounded-3 @error('service_package_id') is-invalid @enderror" style="border:1.5px solid rgba(15,23,42,.12)" required>
                    <option value="" disabled {{ !request('package') && !old('service_package_id') ? 'selected' : '' }}>
                        {{ __('Choose a tier…') }}
                    </option>

                    @if ($service->packages->isNotEmpty())
                        @foreach ($service->packages->sortBy('sort_order') as $package)
                            <option value="{{ $package->id }}"
                                {{ (old('service_package_id') == $package->id || request('package') == $package->id) ? 'selected' : '' }}>
                                {{ $package->title }} — {{ $package->price_formatted }}
                                @if($package->billing_period !== 'one-time') ({{ $package->billing_period }}) @endif
                                @if($package->is_popular) ★ @endif
                            </option>
                        @endforeach
                    @else
                        <option value="base" selected>
                            {{ __('Standard Service') }} — ${{ number_format($service->price, 2) }}
                        </option>
                    @endif
                </select>

                @error('service_package_id')
                    <div class="invalid-feedback extra-small">{{ $message }}</div>
                @enderror

                @if($service->is_subscription)
                    <div class="form-text extra-small">
                        <i class="bi bi-info-circle me-1"></i> {{ __('This is a subscription-based service.') }}
                    </div>
                @endif
            </div>

            <div class="d-grid mb-3">
                <button type="submit" class="btn btn-primary btn-header-cta">
                    {{ __('Confirm booking') }}<i class="bi bi-arrow-right ms-2"></i>
                </button>
            </div>
        </form>

        <div class="text-center small text-muted">
            {{ __('Need help?') }} <a href="{{ route('conversation.start', $service->user) }}" class="text-decoration-none fw-semibold" style="color:var(--primary-color)">{{ __('Message provider') }}</a>
        </div>
        </div>
    </div>

    {{-- Cancellation Policy Card --}}
    <div class="card detail-sidebar-card p-3 mb-3" style="border-left:3px solid var(--primary-color)">
        <h6 class="fw-semibold mb-2 small" style="color:var(--primary-color)"><i class="bi bi-shield-exclamation me-2"></i>{{ __('Cancellation policy') }}</h6>
        <p class="extra-small mb-0 text-muted">
            {{ $service->cancellation_policy ?? __('Full refund for cancellations made 48 hours prior to the session.') }}
        </p>
    </div>

    {{-- Related Services Widget --}}
    @if (!empty($relatedServices) && $relatedServices->count() > 0)
    <div class="card detail-sidebar-card p-3 mb-3">
        <h6 class="fw-semibold mb-3 small text-muted text-uppercase tracking-wider">{{ __('Clients also booked') }}</h6>
        <ul class="list-unstyled mb-0">
            @foreach ($relatedServices->take(3) as $related)
                <li class="mb-2 pb-2 border-bottom last-child-border-0">
                    <a href="{{ route('services.show', $related->slug) }}" class="text-decoration-none d-flex justify-content-between align-items-center">
                        <span class="small text-dark text-truncate me-2">{{ $related->title }}</span>
                        <span class="fw-semibold small" style="color:var(--primary-color)">${{ number_format($related->price, 0) }}</span>
                    </a>
                </li>
            @endforeach
        </ul>
    </div>
    @endif
</div>
