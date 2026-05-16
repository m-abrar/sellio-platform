{{-- Assumes $service is passed --}}
<div class="booking-sidebar sticky-top" style="top: 20px;">
    
    {{-- Booking Card (Primary Action) --}}
    <div class="card glass-surface p-4 mb-3 shadow-sm border-0">
        <h4 class="fw-bold mb-3">Book Your Session</h4>
        
        <form action="{{ route('services.appointment.store', $service->slug) }}" method="POST">
            @csrf 
            <input type="hidden" name="service_id" value="{{ $service->id }}">
            
            {{-- Date Picker --}}
            <div class="mb-3">
                <label class="form-label small fw-bold text-muted">Select Date</label>
                <div class="input-group">
                    <span class="input-group-text bg-white"><i class="bi bi-calendar-event"></i></span>
                    <input type="date" name="booking_date" class="form-control" 
                           value="{{ old('booking_date', now()->addDay()->format('Y-m-d')) }}" 
                           min="{{ now()->addDay()->format('Y-m-d') }}" required>
                </div>
            </div>

            {{-- Time Slot Selection --}}
            <div class="mb-3">
                <label class="form-label small fw-bold text-muted">Available Time</label>
                <div class="input-group">
                    <span class="input-group-text bg-white"><i class="bi bi-clock"></i></span>
                    <select name="time_slot" class="form-select" required>
                        <option value="" selected disabled>Select Time Slot</option>
                        @isset($availableSlots)
                            @foreach ($availableSlots as $slot)
                                <option value="{{ $slot['time'] }}" {{ old('time_slot') == $slot['time'] ? 'selected' : '' }} @if (!$slot['is_available']) disabled @endif>
                                    {{ $slot['time'] }} @if (!$slot['is_available']) (Booked) @endif
                                </option>
                            @endforeach
                        @else
                            {{-- Placeholder Times for UI display --}}
                            <option value="09:00" {{ old('time_slot') == '09:00' ? 'selected' : '' }}>9:00 AM</option>
                            <option value="11:30" {{ old('time_slot') == '11:30' ? 'selected' : '' }}>11:30 AM</option>
                            <option value="14:00" {{ old('time_slot') == '14:00' ? 'selected' : '' }}>2:00 PM</option>
                        @endisset
                    </select>
                </div>
            </div>
            
            {{-- Service Package Selection --}}
            <div class="mb-4">
                <label class="form-label small fw-bold text-muted">Select Package</label>
                <select name="service_package_id" class="form-select py-2 @error('service_package_id') is-invalid @enderror" required>
                    <option value="" disabled {{ !request('package') && !old('service_package_id') ? 'selected' : '' }}>
                        Choose a tier...
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
                        {{-- Fallback if no packages exist --}}
                        <option value="base" selected>
                            Standard Service — ${{ number_format($service->price, 2) }}
                        </option>
                    @endif
                </select>

                @error('service_package_id')
                    <div class="invalid-feedback extra-small">{{ $message }}</div>
                @enderror

                @if($service->is_subscription)
                    <div class="form-text extra-small">
                        <i class="bi bi-info-circle me-1"></i> This is a subscription-based service.
                    </div>
                @endif
            </div>
            
            <div class="d-grid mb-3">
                <button type="submit" class="btn btn-lg fw-bold text-white btn-primary shadow-sm">
                    Confirm Booking <i class="bi bi-chevron-right ms-2 small"></i>
                </button>
            </div>
        </form>

        <div class="text-center small text-muted">
            Need help? <a href="{{ route('conversation.start', $service->user) }}" class="text-primary text-decoration-none fw-semibold">Message Provider</a>
        </div>
    </div>
    
    {{-- Cancellation Policy Card --}}
    <div class="card bg-danger bg-opacity-10 border-0 p-3 mb-3 rounded-3">
        <h6 class="fw-bold mb-2 text-danger small"><i class="bi bi-shield-exclamation me-2"></i>Cancellation Policy</h6>
        <p class="extra-small mb-0 text-danger opacity-75">
            {{ $service->cancellation_policy ?? 'Full refund for cancellations made 48 hours prior to the session.' }}
        </p>
    </div>
    
    {{-- Related Services Widget --}}
    @if (!empty($relatedServices) && $relatedServices->count() > 0)
    <div class="card glass-surface p-3 mb-3 border-0">
        <h6 class="fw-bold mb-3 small text-muted text-uppercase tracking-wider">Clients Also Booked</h6>
        <ul class="list-unstyled mb-0">
            @foreach ($relatedServices->take(3) as $related)
                <li class="mb-2 pb-2 border-bottom last-child-border-0">
                    <a href="{{ route('services.show', $related->slug) }}" class="text-decoration-none d-flex justify-content-between align-items-center">
                        <span class="small text-dark text-truncate me-2">{{ $related->title }}</span>
                        <span class="fw-bold text-success small">${{ number_format($related->price, 0) }}</span>
                    </a>
                </li>
            @endforeach
        </ul>
    </div>
    @endif
</div>