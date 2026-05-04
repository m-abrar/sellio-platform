<div class="card card-premium shadow-sm border-0 mb-4 overflow-hidden">
    <div class="card-header bg-white border-0 py-4 px-4">
        <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1">
            <i class="fas fa-cog mr-2 text-primary opacity-50"></i> Lifecycle Management
        </h3>
    </div>

    <div class="card-body px-4 pb-4">
        {{-- Primary Action --}}
        <div class="p-3 mb-4 rounded-xl bg-light border shadow-xs d-flex align-items-center justify-content-between">
            <button form="payment-form" type="submit" class="btn btn-primary btn-block font-weight-bold smallest uppercase letter-spacing-1 py-3 shadow-sm kinetic-hover">
                <i class="fas fa-save mr-2"></i> {{ $payment->exists ? 'Update Record' : 'Commit Transaction' }}
            </button>
        </div>

        {{-- Action Group --}}
        @if($payment->exists)
        <div class="row mb-4 px-2">
            <div class="col-6 px-1">
                <a href="{{ route('admin.payments.index') }}" class="btn btn-white btn-block border shadow-xs py-2 smallest font-weight-bold uppercase letter-spacing-1 kinetic-hover">
                    <i class="fas fa-undo mr-1 text-warning"></i> Revert
                </a>
            </div>
            <div class="col-6 px-1">
                <form id="delete-form-{{ $payment->id }}" action="{{ route('admin.payments.destroy', $payment->id) }}" method="POST">
                    @csrf @method('DELETE')
                    <button type="button" class="btn btn-white btn-block border shadow-xs py-2 smallest font-weight-bold uppercase letter-spacing-1 kinetic-hover text-danger"
                            onclick="confirmDelete('delete-form-{{ $payment->id }}', 'Void Transaction?', 'This will permanently remove this financial record from the ledger.', 'Confirm')">
                        <i class="fas fa-trash-alt mr-1"></i> Void
                    </button>
                </form>
            </div>
        </div>
        @endif

        {{-- Financial Context Widgets --}}
        @if($payment->exists && $payment->payable && method_exists($payment->payable, 'payments'))
        <div class="space-y-3">
            <div class="p-3 border rounded-xl shadow-xs bg-white d-flex align-items-center mb-3">
                <div class="icon-box-soft bg-primary-soft mr-3 shadow-xs d-flex align-items-center justify-content-center" style="width: 42px; height: 42px; border-radius: 10px;">
                    <i class="fas fa-layer-group text-primary smallest"></i>
                </div>
                <div>
                    <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">Activity Volume</div>
                    <div class="font-weight-bold text-dark h5 mb-0">{{ $payment->payable->payments->count() }} <span class="smallest text-muted">Records</span></div>
                </div>
            </div>

            <div class="p-3 border rounded-xl shadow-xs bg-white d-flex align-items-center mb-3">
                <div class="icon-box-soft bg-success-soft mr-3 shadow-xs d-flex align-items-center justify-content-center" style="width: 42px; height: 42px; border-radius: 10px;">
                    <i class="fas fa-money-bill-wave text-success smallest"></i>
                </div>
                <div>
                    <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">Aggregate Revenue</div>
                    <div class="font-weight-bold text-dark h5 mb-0">{{ $payment->currency }} {{ number_format($payment->payable->payments->where('status', 'completed')->sum('amount'), 2) }}</div>
                </div>
            </div>
        </div>
        @endif

        {{-- Meta Intelligence --}}
        @if($payment->exists)
        <div class="mt-4 pt-4 border-top">
            <div class="d-flex justify-content-between mb-2">
                <span class="smallest text-muted font-weight-bold uppercase letter-spacing-1">Origination</span>
                <span class="smallest text-dark font-weight-bold uppercase letter-spacing-1">{{ $payment->created_at->format('d M Y') }}</span>
            </div>
            <div class="d-flex justify-content-between">
                <span class="smallest text-muted font-weight-bold uppercase letter-spacing-1">Last Update</span>
                <span class="smallest text-dark font-weight-bold uppercase letter-spacing-1">{{ $payment->updated_at->diffForHumans() }}</span>
            </div>
        </div>
        @endif
    </div>
</div>

<style>
    .rounded-xl { border-radius: 12px !important; }
    .bg-primary-soft { background: rgba(0, 123, 255, 0.08) !important; }
    .bg-success-soft { background: rgba(40, 167, 69, 0.08) !important; }
    .kinetic-hover { transition: all 0.2s ease-in-out; }
    .kinetic-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
</style>
