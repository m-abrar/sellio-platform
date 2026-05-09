{{--
    Administrative Financial Partial: Lifecycle Action Interface
    
    This component provides the primary interaction gateway for 
    transaction persistence and lifecycle management. It orchestrates 
    ledger commitment, voiding operations, and provides real-time 
    financial context (revenue aggregation) for the associated 
    payable entity, ensuring consistent operational control in the 
    sidebar vertical.
    
    @context Financial Management
    @variables Payment $payment The payment model instance.
--}}
<div class="card card-sidebar-premium mb-4">
    <div class="card-header border-0 d-flex align-items-center">
        <h5 class="card-title-side">
            <i class="fas fa-cog mr-2 text-primary"></i> {{ __('Lifecycle Management') }}
        </h5>
    </div>

    <div class="card-body">
        {{-- Primary Action --}}
        <div class="mb-4">
            <button form="payment-form" type="submit" class="btn btn-submit-premium btn-block font-weight-bold small uppercase letter-spacing-1 py-3 shadow-glow">
                <i class="fas fa-save mr-2"></i> {{ $payment->exists ? __('Update Record') : __('Commit Transaction') }}
            </button>
        </div>

        {{-- Action Group --}}
        @if($payment->exists)
        <div class="row mb-4 px-2">
            <div class="col-6 px-1">
                <a href="{{ route('admin.payments.index') }}" class="btn btn-light btn-block border shadow-sm py-2 small font-weight-bold uppercase letter-spacing-1 rounded-pill text-muted">
                    <i class="fas fa-undo mr-1 text-warning"></i> {{ __('Revert') }}
                </a>
            </div>
            <div class="col-6 px-1">
                <form id="delete-form-{{ $payment->id }}" action="{{ route('admin.payments.destroy', $payment->id) }}" method="POST">
                    @csrf @method('DELETE')
                    <button type="button" class="btn btn-light btn-block border shadow-sm py-2 small font-weight-bold uppercase letter-spacing-1 rounded-pill text-danger"
                            onclick="confirmDelete('delete-form-{{ $payment->id }}', '{{ __('Void Transaction?') }}', '{{ __('This will permanently remove this financial record from the ledger.') }}', '{{ __('Confirm') }}')">
                        <i class="fas fa-trash-alt mr-1"></i> {{ __('Void') }}
                    </button>
                </form>
            </div>
        </div>
        @endif

        {{-- Financial Context Widgets --}}
        @if($payment->exists && $payment->payable && method_exists($payment->payable, 'payments'))
        <div class="space-y-3">
            <div class="p-3 border rounded-xl shadow-premium bg-white d-flex align-items-center mb-3">
                <div class="icon-square-premium mr-3">
                    <i class="fas fa-layer-group text-primary small"></i>
                </div>
                <div>
                    <div class="small text-muted font-weight-bold uppercase letter-spacing-1">{{ __('Activity Volume') }}</div>
                    <div class="font-weight-bold text-dark h5 mb-0">{{ $payment->payable->payments->count() }} <span class="small text-muted">{{ __('Records') }}</span></div>
                </div>
            </div>

            <div class="p-3 border rounded-xl shadow-premium bg-white d-flex align-items-center mb-3">
                <div class="icon-square-premium mr-3" style="color: var(--success) !important;">
                    <i class="fas fa-money-bill-wave small"></i>
                </div>
                <div>
                    <div class="small text-muted font-weight-bold uppercase letter-spacing-1">{{ __('Aggregate Revenue') }}</div>
                    <div class="font-weight-bold text-dark h5 mb-0">{{ $payment->currency }} {{ number_format($payment->payable->payments->where('status', 'completed')->sum('amount'), 2) }}</div>
                </div>
            </div>
        </div>
        @endif

        {{-- Meta Intelligence --}}
        @if($payment->exists)
        <div class="mt-4 pt-4 border-top">
            <div class="d-flex justify-content-between mb-2">
                <span class="small text-muted font-weight-bold uppercase letter-spacing-1">{{ __('Origination') }}</span>
                <span class="small text-dark font-weight-bold uppercase letter-spacing-1">{{ $payment->created_at->format('d M Y') }}</span>
            </div>
            <div class="d-flex justify-content-between">
                <span class="small text-muted font-weight-bold uppercase letter-spacing-1">{{ __('Last Update') }}</span>
                <span class="small text-dark font-weight-bold uppercase letter-spacing-1">{{ $payment->updated_at->diffForHumans() }}</span>
            </div>
        </div>
        @endif
    </div>
</div>
