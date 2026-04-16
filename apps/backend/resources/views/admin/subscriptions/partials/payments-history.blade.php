<div class="card shadow-sm rounded-3 border-0">
    <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <h3 class="card-title font-weight-bold text-dark">Transaction Records</h3>
        <span class="badge badge-pill badge-light border px-3 py-2">
            Total Revenue: {{ setting('currency_symbol', '$') }}{{ number_format($subscription->payments->sum('amount') ?? 0, 2) }}
        </span>
    </div>
    <div class="card-body p-0">
        @if($subscription->payments && $subscription->payments->count() > 0)
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="border-0 text-uppercase small font-weight-bold py-3 pl-4">ID</th>
                            <th class="border-0 text-uppercase small font-weight-bold py-3">Amount</th>
                            <th class="border-0 text-uppercase small font-weight-bold py-3">Status</th>
                            <th class="border-0 text-uppercase small font-weight-bold py-3">Method</th>
                            <th class="border-0 text-uppercase small font-weight-bold py-3 pr-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($subscription->payments as $payment)
                            <tr>
                                <td class="pl-4 py-3 text-muted">#{{ $payment->id }}</td>
                                <td class="py-3 font-weight-bold text-dark">
                                    {{ setting('currency_symbol', '$') }}{{ number_format($payment->amount, 2) }}
                                </td>
                                <td class="py-3">
                                    @php
                                        $statusClass = [
                                            'completed' => 'badge-success',
                                            'pending'   => 'badge-warning',
                                            'failed'    => 'badge-danger',
                                            'refunded'  => 'badge-info'
                                        ][$payment->status] ?? 'badge-secondary';
                                    @endphp
                                    <span class="badge {{ $statusClass }} px-2 py-1">
                                        {{ ucfirst($payment->status) }}
                                    </span>
                                </td>
                                <td class="py-3 text-muted">
                                    <i class="fas fa-credit-card mr-1 small"></i> 
                                    {{ $payment->method ?? 'Manual' }}
                                </td>
                                <td class="py-3 pr-4 text-muted small">
                                    {{ $payment->created_at->format('d M Y, H:i') }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="text-center py-5">
                <i class="fas fa-receipt fa-3x text-light mb-3"></i>
                <p class="text-muted">No payments have been recorded for this subscription yet.</p>
            </div>
        @endif
    </div>
    @if($subscription->payments && $subscription->payments->count() > 0)
        <div class="card-footer bg-white border-top text-right">
            <small class="text-muted">Showing {{ $subscription->payments->count() }} transaction(s)</small>
        </div>
    @endif
</div>

<style>
    .table thead th {
        letter-spacing: 0.05em;
        color: #8898aa;
    }
    .table tbody tr {
        transition: background-color 0.2s ease;
    }
    .table tbody tr:hover {
        background-color: #f8f9fe;
    }
</style>
