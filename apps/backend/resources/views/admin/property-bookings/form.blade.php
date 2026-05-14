{{--
    Administrative Real Estate: Booking Lifecycle Configuration
    
    This view serves as the authoritative interface for managing property 
    reservation records. It orchestrates complex data entry for guest 
    identities, chronological occupancy parameters (check-in/out), 
    financial settlements, and visualizes real-time inventory availability 
    through an integrated calendar engine.
    
    @extends adminlte::page
    @context Property Operational Administration
    @variables PropertyBooking $booking The booking model instance being modified.
    @variables Collection $properties List of available real estate assets.
    @variables Collection $users List of platform members for principal assignment.
--}}
@extends('adminlte::page')

@section('title', ($booking->exists ? __('Modify') : __('Create')) . ' ' . __('Property Booking'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-alt mr-2 text-primary opacity-50"></i> 
                    {{ $booking->exists ? __('Modify Stay: ') . $booking->id : __('Create Manual Entry') }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $booking->exists ? __('Update occupancy intelligence, guest profiles, and financial ledger records.') : __('Register a new property reservation for an incoming guest principal.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.property-bookings.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to Queue') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form id="booking-form" 
          action="{{ $booking->exists ? route('admin.property-bookings.update', $booking->id) : route('admin.property-bookings.store') }}" 
          method="POST">
        @csrf
        @if($booking->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Content Column --}}
            <div class="col-md-8">
                {{-- Booking Parameters --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Booking Parameters') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Guest Full Identity') }} <span class="text-danger">*</span></label>
                            <input type="text" name="full_name" class="form-control form-control-hero @error('full_name') is-invalid @enderror" 
                                   value="{{ old('full_name', $booking->full_name) }}" required placeholder="{{ __('e.g. John Doe') }}">
                            @error('full_name') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Target Inventory Asset') }}</label>
                                    <select name="property_id" id="property_id" class="form-control select2" required>
                                        <option value="">{{ __('Select Asset') }}</option>
                                        @foreach($properties as $property)
                                            <option value="{{ $property->id }}" {{ old('property_id', $booking->property_id) == $property->id ? 'selected' : '' }}>
                                                {{ $property->title }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('property_id') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Associated Principal') }}</label>
                                    <select name="user_id" class="form-control select2">
                                        <option value="">{{ __('Guest / No Account') }}</option>
                                        @foreach($users as $user)
                                            <option value="{{ $user->id }}" {{ old('user_id', $booking->user_id) == $user->id ? 'selected' : '' }}>
                                                {{ $user->name }} ({{ $user->email }})
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('user_id') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Electronic Contact') }}</label>
                                    <input type="email" name="email" class="form-control form-control-premium text-monospace" 
                                           value="{{ old('email', $booking->email) }}" required placeholder="{{ __('guest@example.com') }}">
                                    @error('email') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Telephonic Contact') }}</label>
                                    <input type="text" name="phone" class="form-control form-control-premium" 
                                           value="{{ old('phone', $booking->phone) }}" placeholder="+1 (555) 000-0000">
                                    @error('phone') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Check-In Chronology') }}</label>
                                    <input type="date" name="check_in_date" class="form-control form-control-premium font-weight-bold" 
                                           value="{{ old('check_in_date', $booking->exists ? $booking->check_in_date->format('Y-m-d') : '') }}" required>
                                    @error('check_in_date') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Check-Out Chronology') }}</label>
                                    <input type="date" name="check_out_date" class="form-control form-control-premium font-weight-bold" 
                                           value="{{ old('check_out_date', $booking->exists ? $booking->check_out_date->format('Y-m-d') : '') }}" required>
                                    @error('check_out_date') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Aggregate Guests') }}</label>
                                    <input type="number" name="guests" min="1" class="form-control form-control-premium font-weight-bold text-center" 
                                           value="{{ old('guests', $booking->guests ?? 1) }}" required>
                                    @error('guests') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Settlement Status') }}</label>
                                    <select name="status" class="form-control form-control-premium" required>
                                        @foreach(['pending', 'confirmed', 'cancelled'] as $st)
                                            <option value="{{ $st }}" {{ old('status', $booking->status ?? 'pending') == $st ? 'selected' : '' }}>
                                                {{ strtoupper(__($st)) }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('status') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Aggregate Revenue') }}</label>
                                    <div class="input-group-premium">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">$</span>
                                        </div>
                                        <input type="number" step="0.01" name="total_price" class="form-control font-weight-bold text-success" 
                                               value="{{ old('total_price', $booking->total_price ?? '0.00') }}" required placeholder="0.00">
                                    </div>
                                    @error('total_price') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Administrative Intel / Guest Requests') }}</label>
                            <textarea name="message" class="form-control textarea-premium" rows="3"
                                placeholder="{{ __('Internal context or manual override rationale...') }}">{{ old('message', $booking->message) }}</textarea>
                            @error('message') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Availability Calendar --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Availability Visualizer') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        @if(isset($calendarEvents))
                            <div id="calendar-config" data-events='@json($calendarEvents)'></div>
                            <div id="calendar" class="fc-modern"></div>
                            <div class="mt-4 d-flex flex-wrap gap-15">
                                <div class="d-flex align-items-center"><span class="legend-dot bg-fde68a"></span> <span class="small font-weight-bold text-muted uppercase ml-2 letter-spacing-1">{{ __('Pending') }}</span></div>
                                <div class="d-flex align-items-center"><span class="legend-dot bg-bbf7d0"></span> <span class="small font-weight-bold text-muted uppercase ml-2 letter-spacing-1">{{ __('Confirmed') }}</span></div>
                                <div class="d-flex align-items-center"><span class="legend-dot bg-fecaca"></span> <span class="small font-weight-bold text-muted uppercase ml-2 letter-spacing-1">{{ __('Cancelled') }}</span></div>
                                <div class="d-flex align-items-center"><span class="legend-dot bg-93c5fd"></span> <span class="small font-weight-bold text-muted uppercase ml-2 letter-spacing-1">{{ __('Current Focus') }}</span></div>
                            </div>
                        @else
                            <div class="text-center py-5 bg-light rounded-xl border border-dashed border-light-soft">
                                <i class="fas fa-calendar-day fa-3x text-muted mb-3 opacity-25"></i>
                                <p class="text-muted small font-weight-bold uppercase letter-spacing-1 mb-0">{{ __('Switch to inspection mode to visualize live occupancy') }}</p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $booking,
                    'title' => __('RESERVATION'),
                    'back' => 'admin.property-bookings.index'
                ])

                {{-- Financial Integrity --}}
                <div class="card border-0 shadow-premium mt-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">{{ __('Financial Integrity') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="p-3 bg-light rounded-xl border border-light leading-relaxed">
                            <p class="small text-muted mb-0 font-italic">
                                <i class="fas fa-info-circle mr-1 text-primary"></i> {{ __('Manually creating a stay record will skip the payment gateway logic. Ensure you verify physical fund transfers before marking the status as') }} <strong>{{ __('CONFIRMED') }}</strong>.
                            </p>
                        </div>
                    </div>
                </div>

                {{-- Meta Information --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">{{ __('Audit Trail') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="small text-muted uppercase letter-spacing-1">{{ __('Created At') }}</span>
                            <span class="small font-weight-bold">{{ $booking->created_at ? $booking->created_at->format('M d, Y') : __('Draft') }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="small text-muted uppercase letter-spacing-1">{{ __('Source') }}</span>
                            <span class="small font-weight-bold text-primary">{{ __('Property Registry') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@stop

@stop

@push('js')
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="{{ asset('admin-assets/pages/property-bookings-form.js') }}"></script>
@endpush
