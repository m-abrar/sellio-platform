@extends('adminlte::page')

@section('title', ($booking->exists ? 'Modify' : 'Create') . ' Property Booking')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-alt mr-2 text-primary"></i> 
                    {{ $booking->exists ? 'Edit Booking: #' . $booking->id : 'Manual Reservation' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $booking->exists ? 'Update occupancy details and financial records.' : 'Initialize a new property reservation for a guest.' }}
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
<div class="container-fluid">
    @include('admin.alert')

    <form id="booking-form" 
          action="{{ $booking->exists ? route('admin.property-bookings.update', $booking->id) : route('admin.property-bookings.store') }}" 
          method="POST">
        @csrf
        @if($booking->exists) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Left Column: Main Data --}}
            <div class="col-md-8">
                <div class="card card-premium shadow-premium mb-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> Reservation Parameters
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Select Property <span class="text-danger">*</span></label>
                                    <select name="property_id" id="property_id" class="form-control select2 @error('property_id') is-invalid @enderror" required>
                                        <option value="">-- Choose Listing --</option>
                                        @foreach($properties as $property)
                                            <option value="{{ $property->id }}" {{ old('property_id', $booking->property_id) == $property->id ? 'selected' : '' }}>
                                                {{ $property->title }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('property_id') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Associated User (Optional)</label>
                                    <select name="user_id" class="form-control select2 @error('user_id') is-invalid @enderror">
                                        <option value="">-- Guest / No Account --</option>
                                        @foreach($users as $user)
                                            <option value="{{ $user->id }}" {{ old('user_id', $booking->user_id) == $user->id ? 'selected' : '' }}>
                                                {{ $user->name }} ({{ $user->email }})
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('user_id') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Guest Name <span class="text-danger">*</span></label>
                                    <input type="text" name="full_name" class="form-control @error('full_name') is-invalid @enderror" 
                                           value="{{ old('full_name', $booking->full_name) }}" required>
                                    @error('full_name') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Email Address <span class="text-danger">*</span></label>
                                    <input type="email" name="email" class="form-control @error('email') is-invalid @enderror" 
                                           value="{{ old('email', $booking->email) }}" required>
                                    @error('email') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Contact Phone</label>
                                    <input type="text" name="phone" class="form-control @error('phone') is-invalid @enderror" 
                                           value="{{ old('phone', $booking->phone) }}">
                                    @error('phone') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Check-In <span class="text-danger">*</span></label>
                                    <input type="date" name="check_in_date" class="form-control @error('check_in_date') is-invalid @enderror" 
                                           value="{{ old('check_in_date', $booking->exists ? $booking->check_in_date->format('Y-m-d') : '') }}" required>
                                    @error('check_in_date') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Check-Out <span class="text-danger">*</span></label>
                                    <input type="date" name="check_out_date" class="form-control @error('check_out_date') is-invalid @enderror" 
                                           value="{{ old('check_out_date', $booking->exists ? $booking->check_out_date->format('Y-m-d') : '') }}" required>
                                    @error('check_out_date') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Total Guests <span class="text-danger">*</span></label>
                                    <input type="number" name="guests" min="1" class="form-control @error('guests') is-invalid @enderror" 
                                           value="{{ old('guests', $booking->guests ?? 1) }}" required>
                                    @error('guests') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="font-weight-600">Special Requests / Notes</label>
                            <textarea name="message" class="form-control" rows="4">{{ old('message', $booking->message) }}</textarea>
                        </div>
                    </div>
                </div>

                {{-- Availability Calendar --}}
                <div class="card card-premium shadow-premium overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-calendar-check mr-2 text-primary opacity-50"></i> Availability Visualizer
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        @if(isset($calendarEvents))
                            <div id="calendar" class="fc-modern"></div>
                            <div class="mt-4 d-flex flex-wrap" style="gap: 15px;">
                                <div class="d-flex align-items-center"><span class="legend-dot" style="background-color: #fde68a;"></span> <span class="smallest font-weight-bold text-muted uppercase ml-2">Pending</span></div>
                                <div class="d-flex align-items-center"><span class="legend-dot" style="background-color: #bbf7d0;"></span> <span class="smallest font-weight-bold text-muted uppercase ml-2">Confirmed</span></div>
                                <div class="d-flex align-items-center"><span class="legend-dot" style="background-color: #fecaca;"></span> <span class="smallest font-weight-bold text-muted uppercase ml-2">Cancelled</span></div>
                                <div class="d-flex align-items-center"><span class="legend-dot" style="background-color: #93c5fd;"></span> <span class="smallest font-weight-bold text-muted uppercase ml-2">Editing</span></div>
                            </div>
                        @else
                            <div class="text-center py-5 bg-light rounded-24px">
                                <i class="fas fa-calendar-day fa-3x text-muted mb-3 opacity-25"></i>
                                <p class="text-muted small uppercase letter-spacing-1 mb-0">Switch to Edit mode to visualize live occupancy</p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>

            {{-- Right Column: Actions & Financials --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px; z-index: 10;">
                    {{-- Action Card --}}
                    @include('admin._partials._form-actions', [
                        'model' => $booking,
                        'title' => 'RESERVATION',
                        'back' => 'admin.property-bookings.index'
                    ])

                    <div class="card card-premium shadow-premium mt-4 overflow-hidden border-primary-soft">
                        <div class="card-header bg-white border-0 py-3 px-4">
                            <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">Financial Oversight</h3>
                        </div>
                        <div class="card-body p-4">
                            <div class="form-group mb-4">
                                <label class="font-weight-600">Status <span class="text-danger">*</span></label>
                                <select name="status" class="form-control @error('status') is-invalid @enderror" required>
                                    @foreach(['pending', 'confirmed', 'cancelled'] as $st)
                                        <option value="{{ $st }}" {{ old('status', $booking->status ?? 'pending') == $st ? 'selected' : '' }}>
                                            {{ strtoupper($st) }}
                                        </option>
                                    @endforeach
                                </select>
                                @error('status') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                            <div class="form-group mb-0">
                                <label class="font-weight-600">Total Price ($) <span class="text-danger">*</span></label>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text font-weight-bold">$</span>
                                    </div>
                                    <input type="number" step="0.01" name="total_price" class="form-control @error('total_price') is-invalid @enderror" 
                                           value="{{ old('total_price', $booking->total_price ?? '0.00') }}" required>
                                </div>
                                @error('total_price') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('css')
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet">
<style>
    .legend-dot { width: 12px; height: 12px; border-radius: 4px; display: inline-block; }
    .fc-modern { border: none !important; }
    .fc .fc-toolbar-title { font-size: 1.1rem !important; font-weight: 700 !important; color: #1e293b !important; text-transform: uppercase; letter-spacing: 0.5px; }
    .fc .fc-button-primary { background-color: #fff !important; border-color: #edf2f7 !important; color: #64748b !important; font-weight: 600 !important; text-transform: uppercase; font-size: 0.7rem !important; border-radius: 10px !important; }
    .fc .fc-button-primary:hover { background-color: #f8fafc !important; color: var(--primary) !important; }
    .fc .fc-button-active { background-color: var(--primary) !important; color: #fff !important; border-color: var(--primary) !important; }
    .fc .fc-daygrid-day-number { font-size: 0.8rem !important; color: #64748b !important; font-weight: 600 !important; }
</style>
@endpush

@push('js')
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof $('.select2').select2 === 'function') {
            $('.select2').select2({
                theme: 'bootstrap4',
                width: '100%',
                placeholder: "-- Select --"
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
                eventClassNames: 'shadow-xs border-0 rounded-pill px-2'
            });
            calendar.render();
        @endif
    });
</script>
@endpush

@include('admin._partials._toggle-card-css')
