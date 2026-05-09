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

@section('title', ($booking->exists ? 'Modify' : 'Create') . ' Property Booking')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-alt mr-2 text-primary opacity-50"></i> 
                    {{ $booking->exists ? 'Modify Stay: ' . $booking->id : 'Create Manual Entry' }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $booking->exists ? 'Update occupancy intelligence, guest profiles, and financial ledger records.' : 'Register a new property reservation for an incoming guest principal.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.property-bookings.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Queue
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
                        <h3 class="card-title-main">Booking Parameters</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Guest Full Identity <span class="text-danger">*</span></label>
                            <input type="text" name="full_name" class="form-control form-control-hero @error('full_name') is-invalid @enderror" 
                                   value="{{ old('full_name', $booking->full_name) }}" required placeholder="e.g. John Doe">
                            @error('full_name') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Target Inventory Asset</label>
                                    <select name="property_id" id="property_id" class="form-control select2" required>
                                        <option value="">Select Asset</option>
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
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Associated Principal</label>
                                    <select name="user_id" class="form-control select2">
                                        <option value="">Guest / No Account</option>
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
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Electronic Contact</label>
                                    <input type="email" name="email" class="form-control form-control-premium text-monospace" 
                                           value="{{ old('email', $booking->email) }}" required placeholder="guest@example.com">
                                    @error('email') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Telephonic Contact</label>
                                    <input type="text" name="phone" class="form-control form-control-premium" 
                                           value="{{ old('phone', $booking->phone) }}" placeholder="+1 (555) 000-0000">
                                    @error('phone') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Check-In Chronology</label>
                                    <input type="date" name="check_in_date" class="form-control form-control-premium font-weight-bold" 
                                           value="{{ old('check_in_date', $booking->exists ? $booking->check_in_date->format('Y-m-d') : '') }}" required>
                                    @error('check_in_date') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Check-Out Chronology</label>
                                    <input type="date" name="check_out_date" class="form-control form-control-premium font-weight-bold" 
                                           value="{{ old('check_out_date', $booking->exists ? $booking->check_out_date->format('Y-m-d') : '') }}" required>
                                    @error('check_out_date') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Aggregate Guests</label>
                                    <input type="number" name="guests" min="1" class="form-control form-control-premium font-weight-bold text-center" 
                                           value="{{ old('guests', $booking->guests ?? 1) }}" required>
                                    @error('guests') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Settlement Status</label>
                                    <select name="status" class="form-control form-control-premium" required>
                                        @foreach(['pending', 'confirmed', 'cancelled'] as $st)
                                            <option value="{{ $st }}" {{ old('status', $booking->status ?? 'pending') == $st ? 'selected' : '' }}>
                                                {{ strtoupper($st) }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('status') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Aggregate Revenue</label>
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
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Administrative Intel / Guest Requests</label>
                            <textarea name="message" class="form-control textarea-premium" rows="3"
                                placeholder="Internal context or manual override rationale...">{{ old('message', $booking->message) }}</textarea>
                            @error('message') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Availability Calendar --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Availability Visualizer</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        @if(isset($calendarEvents))
                            <div id="calendar" class="fc-modern"></div>
                            <div class="mt-4 d-flex flex-wrap" style="gap: 15px;">
                                <div class="d-flex align-items-center"><span class="legend-dot" style="background-color: #fde68a; width: 12px; height: 12px; border-radius: 3px;"></span> <span class="small font-weight-bold text-muted uppercase ml-2 letter-spacing-1">Pending</span></div>
                                <div class="d-flex align-items-center"><span class="legend-dot" style="background-color: #bbf7d0; width: 12px; height: 12px; border-radius: 3px;"></span> <span class="small font-weight-bold text-muted uppercase ml-2 letter-spacing-1">Confirmed</span></div>
                                <div class="d-flex align-items-center"><span class="legend-dot" style="background-color: #fecaca; width: 12px; height: 12px; border-radius: 3px;"></span> <span class="small font-weight-bold text-muted uppercase ml-2 letter-spacing-1">Cancelled</span></div>
                                <div class="d-flex align-items-center"><span class="legend-dot" style="background-color: #93c5fd; width: 12px; height: 12px; border-radius: 3px;"></span> <span class="small font-weight-bold text-muted uppercase ml-2 letter-spacing-1">Current Focus</span></div>
                            </div>
                        @else
                            <div class="text-center py-5 bg-light rounded-xl border border-dashed border-light-soft">
                                <i class="fas fa-calendar-day fa-3x text-muted mb-3 opacity-25"></i>
                                <p class="text-muted small font-weight-bold uppercase letter-spacing-1 mb-0">Switch to inspection mode to visualize live occupancy</p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $booking,
                    'title' => 'RESERVATION',
                    'back' => 'admin.property-bookings.index'
                ])

                {{-- Financial Integrity --}}
                <div class="card border-0 shadow-premium mt-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Financial Integrity</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="p-3 bg-light rounded-xl border border-light leading-relaxed">
                            <p class="small text-muted mb-0 font-italic">
                                <i class="fas fa-info-circle mr-1 text-primary"></i> Manually creating a stay record will skip the payment gateway logic. Ensure you verify physical fund transfers before marking the status as <strong>CONFIRMED</strong>.
                            </p>
                        </div>
                    </div>
                </div>

                {{-- Meta Information --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Audit Trail</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="small text-muted uppercase letter-spacing-1">Created At</span>
                            <span class="small font-weight-bold">{{ $booking->created_at ? $booking->created_at->format('M d, Y') : 'Draft' }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="small text-muted uppercase letter-spacing-1">Source</span>
                            <span class="small font-weight-bold text-primary">Property Registry</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@stop

@section('css')
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<style>
    .fc-modern { border: none !important; }
    .fc .fc-toolbar-title { font-size: 1rem !important; font-weight: 800 !important; color: #1e293b !important; text-transform: uppercase; letter-spacing: 1px; }
    .fc .fc-button-primary { background-color: #fff !important; border: 1px solid #e2e8f0 !important; color: #64748b !important; font-weight: 700 !important; text-transform: uppercase; font-size: 0.65rem !important; border-radius: 30px !important; padding: 8px 16px !important; letter-spacing: 0.5px; }
    .fc .fc-button-primary:hover { background-color: #f8fafc !important; color: #007bff !important; border-color: #007bff !important; }
    .fc .fc-button-active { background-color: #007bff !important; color: #fff !important; border-color: #007bff !important; }
    .fc .fc-daygrid-day-number { font-size: 0.75rem !important; color: #64748b !important; font-weight: 700 !important; padding: 8px !important; }
    .fc .fc-col-header-cell-cushion { font-size: 0.7rem !important; font-weight: 800 !important; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8 !important; padding: 12px 0 !important; }
    .fc-event { border: 0 !important; border-radius: 4px !important; padding: 2px 4px !important; font-size: 0.7rem !important; font-weight: 700 !important; text-transform: uppercase; }
    
    /* Flatpickr Premium Overrides */
    .flatpickr-calendar { border: 0 !important; shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; border-radius: 12px !important; }
</style>
@stop

@push('js')
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script>
    $(document).ready(function() {
        // Initialize Flatpickr for Date Inputs
        flatpickr("input[type=date]", {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            allowInput: true
        });

        if (typeof $('.select2').select2 === 'function') {
            $('.select2').select2({
                theme: 'bootstrap4',
                width: '100%',
                placeholder: "Select Principal"
            });
        }

        @if(isset($calendarEvents))
            const calendarEl = document.getElementById('calendar');
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                },
                events: @json($calendarEvents),
                height: 'auto',
                eventDisplay: 'block',
                eventTextColor: '#1e293b',
                eventClassNames: 'shadow-xs border-0'
            });
            calendar.render();
        @endif
    });
</script>
@endpush
