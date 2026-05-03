@extends('adminlte::page')

@section('title', ($booking->exists ? 'Modify' : 'Create') . ' Event Booking')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ticket-alt mr-2 text-primary"></i> 
                    {{ $booking->exists ? 'Edit Booking: ' . $booking->booking_reference : 'Create Manual Entry' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $booking->exists ? 'Update registration details and attendee data.' : 'Register a new attendee for a specific event timeline.' }}
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
<div class="container-fluid">
    @include('admin.alert')

    <form id="booking-form" 
          action="{{ $booking->exists ? route('admin.event-bookings.update', $booking->id) : route('admin.event-bookings.store') }}" 
          method="POST">
        @csrf
        @if($booking->exists) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Left Column --}}
            <div class="col-md-8">
                <div class="card card-premium shadow-premium mb-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> Booking Parameters
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Select Event <span class="text-danger">*</span></label>
                                    <select name="event_id" id="event_id" class="form-control select2 @error('event_id') is-invalid @enderror" required>
                                        <option value="">-- Choose Event --</option>
                                        @foreach($events as $event)
                                            <option value="{{ $event->id }}" 
                                                    data-price="{{ $event->base_price }}"
                                                    {{ old('event_id', $booking->event_id) == $event->id ? 'selected' : '' }}>
                                                {{ $event->title }} (${{ number_format($event->base_price, 2) }})
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('event_id') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Attendee (User) <span class="text-danger">*</span></label>
                                    <select name="user_id" class="form-control select2 @error('user_id') is-invalid @enderror" required>
                                        <option value="">-- Select Customer --</option>
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
                                    <label class="font-weight-600">Ticket Quantity <span class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text bg-light border-right-0"><i class="fas fa-users text-muted"></i></span>
                                        </div>
                                        <input type="number" name="quantity" id="quantity" class="form-control border-left-0 @error('quantity') is-invalid @enderror" 
                                               value="{{ old('quantity', $booking->quantity ?? 1) }}" min="1" required>
                                    </div>
                                    @error('quantity') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Total Price ($) <span class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text bg-light border-right-0 font-weight-bold">$</span>
                                        </div>
                                        <input type="number" step="0.01" name="total_price" id="total_price" class="form-control border-left-0 @error('total_price') is-invalid @enderror" 
                                               value="{{ old('total_price', $booking->total_price ?? 0.00) }}" required>
                                    </div>
                                    @error('total_price') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="font-weight-600">Current Status <span class="text-danger">*</span></label>
                                    <select name="status" class="form-control @error('status') is-invalid @enderror" required>
                                        @foreach(['pending', 'approved', 'rejected', 'cancelled'] as $st)
                                            <option value="{{ $st }}" {{ old('status', $booking->status ?? 'pending') == $st ? 'selected' : '' }}>
                                                {{ strtoupper($st) }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('status') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="font-weight-600">Internal Remarks / Notes</label>
                            <textarea name="admin_note" class="form-control" rows="4" placeholder="e.g. Manual registration for VIP guest...">{{ old('admin_note', $booking->admin_note) }}</textarea>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right Column --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px; z-index: 10;">
                    {{-- Action Card --}}
                    @include('admin._partials._form-actions', [
                        'model' => $booking,
                        'title' => 'EVENT REGISTRY',
                        'back' => 'admin.event-bookings.index'
                    ])

                    <div class="card card-premium shadow-premium mt-4 overflow-hidden border-primary-soft" style="border: 1px solid rgba(70, 165, 172, 0.2);">
                        <div class="card-body p-4 bg-primary-soft">
                            <h6 class="font-weight-bold text-primary mb-3 smallest text-uppercase letter-spacing-1">Financial Integrity</h6>
                            <p class="text-muted small mb-0" style="line-height: 1.6;">
                                Manually creating a booking will skip the payment gateway logic. Ensure you verify physical fund transfers before marking the status as <strong>APPROVED</strong>.
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
    document.addEventListener('DOMContentLoaded', function () {
        const eventSelect = document.getElementById('event_id');
        const quantityInput = document.getElementById('quantity');
        const totalPriceInput = document.getElementById('total_price');

        function calculateTotal() {
            const selectedOption = eventSelect.options[eventSelect.selectedIndex];
            const basePrice = parseFloat(selectedOption.getAttribute('data-price')) || 0;
            const quantity = parseInt(quantityInput.value) || 0;
            
            if (basePrice > 0 && quantity > 0) {
                totalPriceInput.value = (basePrice * quantity).toFixed(2);
            }
        }

        eventSelect.addEventListener('change', calculateTotal);
        quantityInput.addEventListener('input', calculateTotal);

        // Initialize Select2 if available
        if (typeof $('.select2').select2 === 'function') {
            $('.select2').select2({
                theme: 'bootstrap4',
                width: '100%'
            });
            
            // Re-bind calculation on Select2 change
            $('#event_id').on('select2:select', calculateTotal);
        }
    });
</script>
@endpush

@include('admin._partials._toggle-card-css')
