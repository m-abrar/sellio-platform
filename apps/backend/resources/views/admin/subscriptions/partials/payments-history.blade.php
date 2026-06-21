{{--
    Administrative Financial Component: Subscription Revenue Ledger
    
    This component provides a historical audit trail for all financial 
    transactions associated with a specific subscription enrollment. It 
    orchestrates the display of fiscal yields, transaction references, 
    settlement statuses, and temporal data, ensuring precise revenue 
    tracking and moderation for membership-based cashflow.
    
    @context Financial Management
    @variables Subscription $subscription The subscription model instance.
--}}
<div class="card card-premium shadow-sm border-0">
    <div class="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
            <i class="fas fa-receipt mr-2 text-primary opacity-50"></i> {{ __('All Transactions') }}
        </h3>
        <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
            <i class="fas fa-money-bill-wave mr-1 opacity-50"></i> {{ __('Total Yield') }}: {{ setting('currency_symbol', '$') }}{{ number_format($subscription->payments->sum('amount') ?? 0, 2) }}
        </span>
    </div>
    <div class="card-body p-0">
        @if($subscription->payments && $subscription->payments->count() > 0)
            <div class="table-responsive">
                <table class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4">{{ __('Reference') }}</th>
                            <th>{{ __('Amount') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th>{{ __('Method') }}</th>
                            <th class="pr-4 text-right">{{ __('Timestamp') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($subscription->payments as $payment)
                            <tr>
                                <td class="pl-4 align-middle">
                                    <span class="smallest font-weight-bold text-secondary uppercase letter-spacing-1">#{{ $payment->id }}</span>
                                </td>
                                <td class="align-middle font-weight-bold text-dark">
                                    {{ setting('currency_symbol', '$') }}{{ number_format($payment->amount, 2) }}
                                </td>
                                <td class="text-center align-middle">
                                    @php
                                        $statusMap = [
                                            'completed' => 'badge-success-light text-success',
                                            'pending'   => 'badge-warning-light text-warning',
                                            'failed'    => 'badge-danger-light text-danger',
                                            'refunded'  => 'badge-info-light text-info'
                                        ];
                                        $statusClass = $statusMap[$payment->status] ?? 'badge-secondary-light text-secondary';
                                    @endphp
                                    <span class="badge {{ $statusClass }} px-3 py-2 rounded-pill smallest font-weight-bold uppercase letter-spacing-1 min-width-90">
                                        {{ __($payment->status) }}
                                    </span>
                                </td>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-light mr-2 d-flex align-items-center justify-content-center icon-box-24">
                                            <i class="fas fa-credit-card smallest text-primary"></i>
                                        </div>
                                        <span class="smallest font-weight-bold text-dark uppercase letter-spacing-1">{{ __($payment->method ?? 'Manual') }}</span>
                                    </div>
                                </td>
                                <td class="pr-4 text-right align-middle">
                                    <span class="smallest font-weight-bold text-muted uppercase letter-spacing-1">{{ $payment->created_at->format('d M Y, H:i') }}</span>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="text-center py-5">
                <i class="fas fa-sync-alt fa-4x text-muted opacity-25 mb-3 d-block"></i>
                <h5 class="text-muted font-weight-bold">{{ __('No Transactions Detected') }}</h5>
                <p class="text-secondary small">{{ __('Financial records for this enrollment will be architected here.') }}</p>
            </div>
        @endif
    </div>
    @if($subscription->payments && $subscription->payments->count() > 0)
        <div class="card-footer bg-white border-top py-3 px-4">
            <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Total') }}: {{ $subscription->payments->count() }} {{ __('transaction(s) recorded') }}</div>
        </div>
    @endif
</div>
