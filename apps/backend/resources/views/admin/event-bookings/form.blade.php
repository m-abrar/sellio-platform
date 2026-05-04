@extends('adminlte::page')

@section('title', ($booking->exists ? 'Modify' : 'Create') . ' Event Booking | Executive Registry')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ticket-alt mr-2 text-primary opacity-50"></i> 
                    {{ $booking->exists ? 'Update Booking: #' . $booking->id : 'New Event Registration' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $booking->exists ? 'Managing guest attendance and ticket lifecycle.' : 'Manually logging a new event registration for a guest principal.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.event-bookings.index') }}" class="btn btn-back shadow-sm rounded-pill px-4">
                    <i class="fas fa-arrow-left mr-1"></i> BACK TO QUEUE
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="booking-form" 
          action="{{ $booking->exists ? route('admin.event-bookings.update', $booking->id) : route('admin.event-bookings.store') }}" 
          method="POST">
        @csrf
        @if($booking->exists) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Primary column --}}
            <div class="col-md-8">
                <div class="card card-premium shadow-premium mb-4 border-0 overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1" style="font-size: 1.1rem;">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> Booking Parameters
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Select Target Event</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-calendar-alt text-primary"></i></span>
                                    </div>
                                    <select name="event_id" id="event_id" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0 select2" required>
                                        <option value="">-- Choose Event --</option>
                                        @foreach($events as $event)
                                            <option value="{{ $event->id }}" 
                                                    data-price="{{ $event->price }}"
                                                    {{ old('event_id', $booking->event_id) == $event->id ? 'selected' : '' }}>
                                                {{ $event->title }} (${{ number_format($event->price, 2) }})
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                @error('event_id') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-6 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Associated Principal</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-user-tie text-primary"></i></span>
                                    </div>
                                    <select name="user_id" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0 select2" required>
                                        <option value="">Associate User</option>
                                        @foreach($users as $user)
                                            <option value="{{ $user->id }}" {{ old('user_id', $booking->user_id) == $user->id ? 'selected' : '' }}>
                                                {{ $user->name }} ({{ $user->email }})
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                @error('user_id') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Guest Full Identity</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-id-card text-primary"></i></span>
                                    </div>
                                    <input type="text" name="full_name" class="form-control border-0 shadow-none bg-white h-100 py-0 font-weight-bold" 
                                           value="{{ old('full_name', $booking->full_name) }}" required placeholder="e.g. John Doe">
                                </div>
                                @error('full_name') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Electronic Mail</label>
                                <div class="input-group input-group-premium shadow-xs">
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
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-phone text-primary"></i></span>
                                    </div>
                                    <input type="text" name="phone" class="form-control border-0 shadow-none bg-white h-100 py-0" 
                                           value="{{ old('phone', $booking->phone) }}" placeholder="+1 234 567 890">
                                </div>
                                @error('phone') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Ticket Quantity</label>
                                <div class="input-group input-group-premium shadow-xs">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-users text-primary"></i></span>
                                    </div>
                                    <input type="number" name="quantity" id="quantity" min="1" class="form-control border-0 shadow-none bg-white h-100 py-0 font-weight-bold text-center" 
                                           value="{{ old('quantity', $booking->quantity ?? 1) }}" required>
                                </div>
                                @error('quantity') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Lifecycle Status</label>
                                <div class="input-group input-group-premium shadow-xs">
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
                                @error('status') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Aggregate Revenue ($)</label>
                                <div class="input-group border rounded shadow-xs bg-white overflow-hidden" style="height: 46px; padding: 2px;">
                                    <div class="input-group-prepend border-0">
                                        <span class="input-group-text bg-white border-0 py-0 font-weight-bold text-primary">$</span>
                                    </div>
                                    <input type="number" step="0.01" name="total_price" id="total_price" class="form-control border-0 shadow-none bg-white h-100 py-0 font-weight-bold text-success" 
                                           value="{{ old('total_price', $booking->total_price ?? '0.00') }}" required readonly>
                                </div>
                                @error('total_price') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                            </div>
                        </div>

                        <div class="col-12 mb-0">
                            <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Special Requirements / Notes</label>
                            <textarea name="notes" class="form-control border shadow-xs bg-white p-3" rows="4"
                                style="border-radius: 12px; font-size: 0.9rem;"
                                placeholder="Guest requirements or administrative notes...">{{ old('notes', $booking->notes) }}</textarea>
                            @error('notes') <small class="text-danger font-weight-bold mt-1 d-block">{{ $message }}</small> @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Sidebar column --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px; z-index: 10;">
                    {{-- Action Card --}}
                    @include('admin._partials._form-actions', [
                        'model' => $booking,
                        'title' => 'EVENT BOOKING',
                        'back' => 'admin.event-bookings.index'
                    ])

                    <div class="card card-premium shadow-premium mt-4 border-0 overflow-hidden">
                        <div class="card-body p-4 bg-primary-soft">
                            <h6 class="font-weight-bold text-primary mb-3 smallest text-uppercase letter-spacing-1">Revenue Integrity</h6>
                            <p class="text-muted small mb-0" style="line-height: 1.6;">
                                Total price is calculated automatically based on the selected event's base rate and the aggregate ticket quantity. Manual overrides are not permitted in this registry module.
                            </p>
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
        
        // Initialize Select2 if available
        if (typeof $('.select2').select2 === 'function') {
            $('.select2').select2({
                theme: 'default',
                width: '100%'
            });
            
            // Re-bind calculation on Select2 change
            $('#event_id').on('select2:select', calculateTotal);
        }
        
        // Run initial calc
        calculateTotal();
    });
</script>
@endpush
