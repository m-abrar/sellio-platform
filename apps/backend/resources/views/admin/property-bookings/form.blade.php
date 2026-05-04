@extends('adminlte::page')

@section('title', ($booking->exists ? 'Modify Stay' : 'Record Reservation') . ' | Real Estate Intelligence')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-alt mr-2 text-primary opacity-50"></i> 
                    {{ $booking->exists ? __('Modify Stay Record') : __('Record Reservation') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $booking->exists ? 'Update occupancy intelligence, guest profiles, and financial ledger records.' : 'Initialize a new property reservation for an incoming guest principal.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.property-bookings.index') }}" class="btn btn-back shadow-sm rounded-pill px-4">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Ledger
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="booking-form" 
          action="{{ $booking->exists ? route('admin.property-bookings.update', $booking->id) : route('admin.property-bookings.store') }}" 
          method="POST">
        @csrf
        @if($booking->exists) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Intelligence Column --}}
            <div class="col-md-8">
                <div class="card card-premium shadow-premium mb-4 border-0 overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> Reservation Intelligence
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Target Inventory Asset</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-home text-primary"></i></span>
                                    </div>
                                    <select name="property_id" id="property_id" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0 select2" required>
                                        <option value="">Select Asset</option>
                                        @foreach($properties as $property)
                                            <option value="{{ $property->id }}" {{ old('property_id', $booking->property_id) == $property->id ? 'selected' : '' }}>
                                                {{ $property->title }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                @error('property_id') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>

                            <div class="col-md-6 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Associated Principal</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-user-tie text-primary"></i></span>
                                    </div>
                                    <select name="user_id" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0 select2">
                                        <option value="">Guest / No Account</option>
                                        @foreach($users as $user)
                                            <option value="{{ $user->id }}" {{ old('user_id', $booking->user_id) == $user->id ? 'selected' : '' }}>
                                                {{ $user->name }} ({{ $user->email }})
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                @error('user_id') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>

                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Guest Full Identity</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-id-card text-primary"></i></span>
                                    </div>
                                    <input type="text" name="full_name" class="form-control border-0 shadow-none bg-white h-100 py-0 font-weight-bold" 
                                           value="{{ old('full_name', $booking->full_name) }}" required placeholder="e.g. John Doe">
                                </div>
                                @error('full_name') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>

                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Electronic Contact</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-envelope text-primary"></i></span>
                                    </div>
                                    <input type="email" name="email" class="form-control border-0 shadow-none bg-white h-100 py-0 text-monospace" 
                                           value="{{ old('email', $booking->email) }}" required placeholder="guest@example.com">
                                </div>
                                @error('email') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>

                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Telephonic Contact</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-phone text-primary"></i></span>
                                    </div>
                                    <input type="text" name="phone" class="form-control border-0 shadow-none bg-white h-100 py-0" 
                                           value="{{ old('phone', $booking->phone) }}" placeholder="+1 (555) 000-0000">
                                </div>
                                @error('phone') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>

                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Check-In Chronology</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-sign-in-alt text-primary"></i></span>
                                    </div>
                                    <input type="date" name="check_in_date" class="form-control border-0 shadow-none bg-white h-100 py-0 smallest font-weight-bold" 
                                           value="{{ old('check_in_date', $booking->exists ? $booking->check_in_date->format('Y-m-d') : '') }}" required>
                                </div>
                                @error('check_in_date') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>

                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Check-Out Chronology</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-sign-out-alt text-primary"></i></span>
                                    </div>
                                    <input type="date" name="check_out_date" class="form-control border-0 shadow-none bg-white h-100 py-0 smallest font-weight-bold" 
                                           value="{{ old('check_out_date', $booking->exists ? $booking->check_out_date->format('Y-m-d') : '') }}" required>
                                </div>
                                @error('check_out_date') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>

                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Aggregate Guests</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-users text-primary"></i></span>
                                    </div>
                                    <input type="number" name="guests" min="1" class="form-control border-0 shadow-none bg-white h-100 py-0 font-weight-bold text-center" 
                                           value="{{ old('guests', $booking->guests ?? 1) }}" required>
                                </div>
                                @error('guests') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>

                            <div class="col-12 mb-0">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Administrative Intel / Guest Requests</label>
                                <textarea name="message" class="form-control border shadow-xs bg-white p-3" rows="3"
                                    style="border-radius: 12px; font-size: 0.9rem;"
                                    placeholder="Internal context or manual override rationale...">{{ old('message', $booking->message) }}</textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Availability Calendar --}}
                <div class="card card-premium shadow-premium border-0 overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-calendar-check mr-2 text-primary opacity-50"></i> Availability Visualizer
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        @if(isset($calendarEvents))
                            <div id="calendar" class="fc-modern"></div>
                            <div class="mt-4 d-flex flex-wrap" style="gap: 15px;">
                                <div class="d-flex align-items-center"><span class="legend-dot" style="background-color: #fde68a; width: 12px; height: 12px; border-radius: 3px;"></span> <span class="smallest font-weight-bold text-muted uppercase ml-2 letter-spacing-1">Pending</span></div>
                                <div class="d-flex align-items-center"><span class="legend-dot" style="background-color: #bbf7d0; width: 12px; height: 12px; border-radius: 3px;"></span> <span class="smallest font-weight-bold text-muted uppercase ml-2 letter-spacing-1">Confirmed</span></div>
                                <div class="d-flex align-items-center"><span class="legend-dot" style="background-color: #fecaca; width: 12px; height: 12px; border-radius: 3px;"></span> <span class="smallest font-weight-bold text-muted uppercase ml-2 letter-spacing-1">Cancelled</span></div>
                                <div class="d-flex align-items-center"><span class="legend-dot" style="background-color: #93c5fd; width: 12px; height: 12px; border-radius: 3px;"></span> <span class="smallest font-weight-bold text-muted uppercase ml-2 letter-spacing-1">Current Focus</span></div>
                            </div>
                        @else
                            <div class="text-center py-5 bg-light rounded-xl border border-dashed">
                                <i class="fas fa-calendar-day fa-3x text-muted mb-3 opacity-25"></i>
                                <p class="text-muted smallest font-weight-bold uppercase letter-spacing-1 mb-0">Switch to inspection mode to visualize live occupancy</p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>

            {{-- Oversight Column --}}
            <div class="col-md-4">
                <div class="position-sticky" style="top: 20px; z-index: 10;">
                    {{-- Primary Action Card --}}
                    @include('admin._partials._form-actions', [
                        'model' => $booking,
                        'title' => 'RESERVATION',
                        'back' => 'admin.property-bookings.index'
                    ])

                    <div class="card card-premium shadow-premium mt-4 border-0 overflow-hidden" style="border-radius: 24px;">
                        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                            <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                                <i class="fas fa-file-invoice-dollar mr-2 text-primary opacity-50"></i> Financial Oversight
                            </h3>
                        </div>
                        <div class="card-body p-4">
                            <div class="mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Settlement Status</label>
                                <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-traffic-light text-primary"></i></span>
                                    </div>
                                    <select name="status" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0" required>
                                        @foreach(['pending', 'confirmed', 'cancelled'] as $st)
                                            <option value="{{ $st }}" {{ old('status', $booking->status ?? 'pending') == $st ? 'selected' : '' }}>
                                                {{ strtoupper($st) }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                            <div class="mb-0">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Aggregate Revenue ($)</label>
                                <div class="input-group border rounded shadow-xs bg-white overflow-hidden" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0 font-weight-bold text-primary">$</span>
                                    </div>
                                    <input type="number" step="0.01" name="total_price" class="form-control border-0 shadow-none bg-white h-100 py-0 font-weight-bold text-success" 
                                           value="{{ old('total_price', $booking->total_price ?? '0.00') }}" required placeholder="0.00">
                                </div>
                                <p class="text-muted smallest mt-2 mb-0 uppercase letter-spacing-1 opacity-75">
                                    <i class="fas fa-info-circle mr-1"></i> Total gross value including service fees.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@section('css')
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet">
<style>
    .fc-modern { border: none !important; }
    .fc .fc-toolbar-title { font-size: 1rem !important; font-weight: 800 !important; color: #1e293b !important; text-transform: uppercase; letter-spacing: 1px; }
    .fc .fc-button-primary { background-color: #fff !important; border: 1px solid #e2e8f0 !important; color: #64748b !important; font-weight: 700 !important; text-transform: uppercase; font-size: 0.65rem !important; border-radius: 30px !important; padding: 8px 16px !important; letter-spacing: 0.5px; }
    .fc .fc-button-primary:hover { background-color: #f8fafc !important; color: #007bff !important; border-color: #007bff !important; }
    .fc .fc-button-active { background-color: #007bff !important; color: #fff !important; border-color: #007bff !important; }
    .fc .fc-daygrid-day-number { font-size: 0.75rem !important; color: #64748b !important; font-weight: 700 !important; padding: 8px !important; }
    .fc .fc-col-header-cell-cushion { font-size: 0.7rem !important; font-weight: 800 !important; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8 !important; padding: 12px 0 !important; }
    .fc-event { border: 0 !important; border-radius: 4px !important; padding: 2px 4px !important; font-size: 0.7rem !important; font-weight: 700 !important; text-transform: uppercase; }
    
    .select2-container--bootstrap4 .select2-selection--single { height: 100% !important; border: 0 !important; background: transparent !important; }
    .select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered { line-height: 40px !important; padding-left: 0 !important; font-weight: 600 !important; font-size: 0.85rem !important; }
    .select2-container--bootstrap4 .select2-selection--single .select2-selection__arrow { top: 50% !important; transform: translateY(-50%) !important; }
    .rounded-xl { border-radius: 12px !important; }
</style>
@endsection

@section('js')
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
<script>
    $(document).ready(function() {
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: "Select Principal"
        });

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
@endsection
