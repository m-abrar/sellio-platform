{{--
    Administrative Financial Module: Transaction card Component
    
    This partial renders a high-fidelity visual representation of a single 
    financial transaction. It prioritizes clarity in fiscal value, 
    settlement status, and relationship mapping between the platform 
    and the guest principal.
--}}
<div class="col-xl-4 col-md-6 mb-4">
    <div class="card h-100 border-0 shadow-premium rounded-24 overflow-hidden transition-all hover-shadow-premium">
        {{-- Card Header: Status & Method --}}
        <div class="card-header border-0 bg-white py-3 px-4 d-flex align-items-center justify-content-between">
            @php
                $statusMap = [
                    'completed' => 'badge-success-light text-success',
                    'failed'    => 'badge-danger-light text-danger',
                    'refunded'  => 'badge-info-light text-info',
                    'pending'   => 'badge-warning-light text-warning',
                ];
                $statusClass = $statusMap[$payment->status] ?? 'badge-secondary-light text-secondary';
                
                $methodMap = [
                    'stripe' => ['icon' => 'fab fa-cc-stripe', 'class' => 'text-indigo'],
                    'paypal' => ['icon' => 'fab fa-paypal', 'class' => 'text-primary'],
                    'manual' => ['icon' => 'fas fa-hand-holding-usd', 'class' => 'text-success'],
                ];
                $m = $methodMap[$payment->payment_method] ?? ['icon' => 'fas fa-wallet', 'class' => 'text-muted'];
            @endphp
            <span class="badge {{ $statusClass }} px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                {{ __($payment->status) }}
            </span>
            <span class="smallest font-weight-bold uppercase letter-spacing-1 {{ $m['class'] }}">
                <i class="{{ $m['icon'] }} mr-1"></i> {{ $payment->payment_method }}
            </span>
        </div>

        {{-- Card Body: Value & Principal --}}
        <div class="card-body px-4 pt-2">
            <div class="text-center mb-4">
                <h2 class="font-weight-bold text-dark mb-0">
                    <span class="smallest font-weight-normal opacity-50 mr-1 text-uppercase">{{ $payment->currency }}</span>{{ number_format($payment->amount, 2) }}
                </h2>
                <p class="smallest text-muted uppercase letter-spacing-1 mt-1 mb-0">{{ __('Settlement Value') }}</p>
            </div>

            <div class="d-flex align-items-center p-3 bg-light-soft rounded-xl mb-4 border border-light-soft">
                @if($payment->user)
                    <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center shadow-xs icon-box-40 rounded-12">
                        <span class="small font-weight-bold text-primary">{{ strtoupper(substr($payment->user->name, 0, 1)) }}</span>
                    </div>
                    <div class="overflow-hidden">
                        <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1 text-truncate">{{ $payment->user->name }}</span>
                        <small class="text-muted text-monospace smallest smallest-0-7 text-truncate d-block">{{ $payment->user->email }}</small>
                    </div>
                @else
                    <div class="icon-box-soft bg-secondary-soft mr-3 d-flex align-items-center justify-content-center shadow-xs icon-box-40 rounded-12">
                        <i class="fas fa-user-secret text-secondary"></i>
                    </div>
                    <div>
                        <span class="badge badge-secondary-light text-secondary px-2 py-1 rounded-pill smallest font-weight-bold uppercase">{{ __('External Principal') }}</span>
                    </div>
                @endif
            </div>

            <div class="row text-center mb-2">
                <div class="col-6 border-right">
                    <p class="smallest text-muted uppercase letter-spacing-1 mb-1">{{ __('Intel Focus') }}</p>
                    <div class="font-weight-bold text-dark smallest text-uppercase letter-spacing-1 text-truncate px-1">
                        @include('admin.payments.partials._payable_link', ['payable' => $payment->payable])
                    </div>
                </div>
                <div class="col-6">
                    <p class="smallest text-muted uppercase letter-spacing-1 mb-1">{{ __('Temporal') }}</p>
                    <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1">
                        {{ ($payment->paid_at ?? $payment->created_at)->format('d M, Y') }}
                    </div>
                </div>
            </div>
        </div>

        {{-- Card Footer: Metadata & Actions --}}
        <div class="card-footer bg-white border-0 py-3 px-4 d-flex align-items-center justify-content-between">
            <div class="text-monospace smallest text-muted opacity-50 smallest-0-65" title="{{ __('Gateway Reference') }}">
                #{{ Str::limit($payment->transaction_id ?? '---', 10) }}
            </div>
            <div class="btn-group btn-group-premium">
                <a href="{{ route('admin.payments.edit', $payment->id) }}" class="btn text-info" data-toggle="tooltip" title="{{ __('Modify Record') }}"><i class="fas fa-edit"></i></a>
                <form id="delete-form-card-{{ $payment->id }}" action="{{ route('admin.payments.destroy', $payment->id) }}" method="POST" class="d-inline">
                    @csrf @method('DELETE')
                    <button type="button" class="btn text-danger" data-toggle="tooltip" title="{{ __('Void Record') }}" onclick="confirmDelete('delete-form-card-{{ $payment->id }}', '{{ __('Void Transaction?') }}', '{{ __('This action will permanently remove this financial record.') }}', '{{ __('Confirm') }}')"><i class="fas fa-trash-alt"></i></button>
                </form>
            </div>
        </div>
    </div>
</div>
