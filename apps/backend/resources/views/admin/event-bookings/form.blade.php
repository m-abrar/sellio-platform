{{--
    Administrative Events: Attendance Configuration
    
    This view serves as the authoritative interface for managing event 
    registrations. It orchestrates guest identity parameters, ticket 
    inventory allocation, revenue calculations, and lifecycle status 
    tracking (pending, confirmed, cancelled) to ensure accurate 
    attendance manifests.
    
    @extends adminlte::page
    @context Event Booking Management
    @variables EventBooking $booking The booking model instance.
    @variables Collection $events List of event assets for registration.
    @variables Collection $users List of platform members for principal mapping.
--}}
@extends('adminlte::page')

@section('title', ($booking->exists ? 'Modify' : 'Create') . ' Event Booking')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ticket-alt mr-2 text-primary opacity-50"></i> 
                    {{ $booking->exists ? 'Update Booking: #' . $booking->id : 'New Event Registration' }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $booking->exists ? 'Managing guest attendance and ticket lifecycle.' : 'Manually logging a new event registration for a guest principal.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.event-bookings.index') }}" class="btn btn-back shadow-sm">
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
          action="{{ $booking->exists ? route('admin.event-bookings.update', $booking->id) : route('admin.event-bookings.store') }}" 
          method="POST">
        @csrf
        @if($booking->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Content Column --}}
            <div class="col-md-8">
                {{-- Booking Information --}}
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
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Select Target Event</label>
                                    <select name="event_id" id="event_id" class="form-control select2" required>
                                        <option value="">-- Choose Event --</option>
                                        @foreach($events as $event)
                                            <option value="{{ $event->id }}" 
                                                    data-price="{{ $event->price }}"
                                                    {{ old('event_id', $booking->event_id) == $event->id ? 'selected' : '' }}>
                                                {{ $event->title }} (${{ number_format($event->price, 2) }})
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('event_id') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Associated Principal</label>
                                    <select name="user_id" class="form-control select2" required>
                                        <option value="">Associate User</option>
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
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Electronic Mail</label>
                                    <input type="email" name="email" class="form-control form-control-premium text-monospace" 
                                           value="{{ old('email', $booking->email) }}" required placeholder="guest@example.com">
                                    @error('email') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Telephonic Contact</label>
                                    <input type="text" name="phone" class="form-control form-control-premium" 
                                           value="{{ old('phone', $booking->phone) }}" placeholder="+1 234 567 890">
                                    @error('phone') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Ticket Quantity</label>
                                    <input type="number" name="quantity" id="quantity" min="1" class="form-control form-control-premium font-weight-bold" 
                                           value="{{ old('quantity', $booking->quantity ?? 1) }}" required>
                                    @error('quantity') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Aggregate Revenue</label>
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text bg-white border-right-0" style="border-radius: 12px 0 0 12px; border: 1px solid var(--border-light);">$</span>
                                        </div>
                                        <input type="number" step="0.01" name="total_price" id="total_price" class="form-control form-control-premium border-left-0 font-weight-bold text-success" 
                                               style="border-radius: 0 12px 12px 0;"
                                               value="{{ old('total_price', $booking->total_price ?? '0.00') }}" required readonly>
                                    </div>
                                    @error('total_price') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Lifecycle Status</label>
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
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Special Requirements / Notes</label>
                            <textarea name="notes" class="form-control" rows="4"
                                style="border-radius: 16px; border: 1px solid var(--border-light);"
                                placeholder="Guest requirements or administrative notes...">{{ old('notes', $booking->notes) }}</textarea>
                            @error('notes') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $booking,
                    'title' => 'BOOKING',
                    'back' => 'admin.event-bookings.index'
                ])

                {{-- Revenue Integrity --}}
                <div class="card border-0 shadow-premium mt-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Revenue Integrity</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="p-3 bg-light rounded-xl border border-light">
                            <p class="small text-muted mb-0 font-italic" style="line-height: 1.6;">
                                <i class="fas fa-info-circle mr-1 text-primary"></i> Total price is calculated automatically based on the selected event's base rate and the aggregate ticket quantity. Manual overrides are not permitted in this registry module.
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
                            <span class="small text-muted uppercase letter-spacing-1">Type</span>
                            <span class="small font-weight-bold text-primary">Event Ticketing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('js')
<script>
    $(document).ready(function() {
        const calculateTotal = () => {
            const selected = $('#event_id').find(':selected');
            const price = parseFloat(selected.data('price')) || 0;
            const qty = parseInt($('#quantity').val()) || 0;
            const total = price * qty;
            $('#total_price').val(total.toFixed(2));
        };

        $('#quantity').on('input change', calculateTotal);
        
        if (typeof $('.select2').select2 === 'function') {
            $('.select2').select2({
                theme: 'bootstrap4',
                width: '100%'
            });
            
            $('#event_id').on('select2:select', calculateTotal);
        }
        
        calculateTotal();
    });
</script>
@endpush
