{{--
    Administrative Finance Partial: Linked Booking Intelligence
    
    This component provides a summary of the booking record associated with 
    a transaction. It displays guest identities, stay chronologies, 
    and asset information to provide immediate context for financial 
    reconciliation tasks.
    
    @context Transaction Management
    @variables Transaction $transaction The active transaction context.
--}}
<!-- Booking Details Card -->
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title">Booking Details</h3>
        <!-- Edit Booking Button on the right -->
        <a href="{{ route('admin.bookings.edit', $transaction->booking->id) }}" class="btn btn-sm btn-info ml-auto">
            Edit Booking
        </a>
    </div>
    <div class="card-body">
        <div class="booking-details">
            <p><strong>Booking ID:</strong> #{{ $transaction->booking->id }}</p>
            <p><strong>Guest Name:</strong> {{ $transaction->booking->first_name }} {{ $transaction->booking->last_name }}</p>
            <p><strong>Dates:</strong> {{ \Carbon\Carbon::parse($transaction->booking->start_date)->format('d M, Y') }} - {{ \Carbon\Carbon::parse($transaction->booking->end_date)->format('d M, Y') }}</p>
            <p><strong>Total Price:</strong> {{ setting('currency_symbol') }}{{ number_format($transaction->booking->total_price, 2) }}</p>
            <p><strong>Property:</strong> {{ $transaction->booking->property->title }}</p>
        </div>
    </div>
</div>
