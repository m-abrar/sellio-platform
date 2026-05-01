<div class="card shadow-sm border-0 rounded-lg card-actions mb-4">
    <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <h5 class="mb-0"><i class="fas fa-credit-card text-muted mr-2"></i>Manage Payment</h5>
    </div>

    <div class="card-body p-4">

        {{-- Save Box with Metadata --}}
        <div class="border rounded p-3 mb-4 bg-light d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <button form="payment-form" type="submit" class="btn btn-primary d-flex align-items-center mr-3">
                    <i class="fas fa-save mr-2"></i> Save Payment
                </button>
            </div>
            <div class="d-flex align-items-center mt-3 mt-md-0">
                @if($payment->exists && $payment->creator)
                    <img src="{{ $payment->creator->avatar_url }}" alt="Avatar" class="rounded-circle mr-2" width="40" height="40">
                    <div>
                        <div class="small text-muted">Created By</div>
                        <div>{{ $payment->creator->name }}</div>
                    </div>
                @endif
            </div>
        </div>

        {{-- Action Buttons --}}
        <div class="d-flex flex-wrap align-items-stretch mb-4 justify-content-between">
            <div class="d-flex">
                @if($payment->exists)
                    <a href="{{ route('admin.payments.show', $payment->id) }}" target="_blank"
                       class="btn btn-outline-info btn-sm d-flex align-items-center mr-2 mb-2">
                        <i class="fas fa-eye mr-1"></i> Preview
                    </a>

                    <a href="{{ route('admin.payments.duplicate', $payment->id) }}"
                       class="btn btn-outline-warning btn-sm d-flex align-items-center mr-2 mb-2">
                        <i class="fas fa-copy mr-1"></i> Duplicate
                    </a>
                @endif
            </div>

            <div class="d-flex">
                @if($payment->exists)
                    <form action="{{ route('admin.payments.destroy', $payment->id) }}" method="POST"
                          onsubmit="return confirm('Are you sure you want to delete this payment?');" class="d-flex mb-2">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger btn-sm d-flex align-items-center justify-content-center rounded-circle" style="width: 30px; height: 30px;">
                            <i class="fas fa-trash-alt text-white" style="font-size: 14px;"></i>
                        </button>
                    </form>
                @endif
            </div>
        </div>

        {{-- Payment Statistics --}}
        @if($payment->exists)
        <div class="row text-center">
            <div class="col-md-4 mb-3">
                <div class="bg-light border rounded p-3">
                    <div class="text-muted small">Total Payments</div>
                    <h4 class="mb-0">{{ $payment->subscription->payments_count ?? 0 }}</h4>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="bg-light border rounded p-3">
                    <div class="text-muted small">Total Revenue</div>
                    <h4 class="mb-0">{{ setting('currency_symbol') }}{{ number_format($payment->subscription?->payments?->sum('amount') ?? 0, 2) }}</h4>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="bg-light border rounded p-3">
                    <div class="text-muted small">Avg. Payment Amount</div>
                    <h4 class="mb-0">{{ setting('currency_symbol') }}{{ number_format($payment->subscription?->payments?->avg('amount') ?? 0, 2) }}</h4>
                </div>
            </div>
        </div>
        @endif

        {{-- Status Display --}}
        <div class="d-flex justify-content-between align-items-center border rounded bg-white p-3 mb-3">
            <span class="text-muted">Status</span>
            <span class="badge {{ $payment->exists && $payment->status=='completed' ? 'bg-success' : ($payment->exists && $payment->status=='pending' ? 'bg-warning' : 'bg-danger') }}">
                {{ $payment->exists ? ucfirst($payment->status) : 'N/A' }}
            </span>
        </div>

        {{-- Meta Info --}}
        @if($payment->exists)
            <div class="border-top pt-3 mt-3 text-muted small">
                <div class="d-flex justify-content-between mb-1">
                    <span>Created:</span>
                    <span>{{ $payment->created_at->format('d M Y') ?? '-' }}</span>
                </div>
                <div class="d-flex justify-content-between">
                    <span>Last Updated:</span>
                    <span>{{ $payment->updated_at->format('d M Y') ?? '-' }}</span>
                </div>
            </div>
        @endif

    </div>
</div>

<style>
.card-actions .btn {
    transition: all 0.2s ease;
}
.card-actions .btn:hover,
.card-actions .btn:focus {
    transform: translateY(-4px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}
</style>
