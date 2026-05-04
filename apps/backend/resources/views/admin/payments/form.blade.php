@extends('adminlte::page')

@section('title', ($payment->exists ? 'Edit Transaction' : 'Record Transaction') . ' | Financial Intelligence')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-credit-card mr-2 text-primary opacity-50"></i>
                    {{ $payment->exists ? __('Modify Transaction') : __('Initialize Transaction') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $payment->exists ? 'Update financial ledger entry, reconcile gateway data, and audit fiscal history.' : 'Record manual settlements, capture offline revenue, and architect financial intelligence.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.payments.index') }}" class="btn-back shadow-sm">
                        <i class="fas fa-arrow-left mr-1"></i> RETURN TO LEDGER
                    </a>
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large mr-2"></i> Dashboard
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert') 

        <form id="payment-form" 
              action="{{ $payment->exists ? route('admin.payments.update', $payment->id) : route('admin.payments.store') }}" 
              method="POST">
            @csrf
            @if($payment->exists) @method('PATCH') @endif

            <div class="row pb-5">
                {{-- Main Form Architecture --}}
                <div class="col-md-8">
                    {{-- Card 1: Principal & Entity Intelligence --}}
                    <div class="card card-premium shadow-premium border-0 mb-4" style="border-radius: 24px;">
                        <div class="card-header border-0 bg-white py-4 px-4">
                            <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 float-none">
                                <i class="fas fa-id-card mr-2 text-primary opacity-50"></i> Principal & Entity Linkage
                            </h3>
                        </div>
                        <div class="card-body p-4 pt-0">
                            <div class="row">
                                <div class="col-md-12 mb-4">
                                    <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Associated Account (Principal)</label>
                                    <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-user-tie text-primary"></i></span>
                                        </div>
                                        <select name="user_id" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0 select2" required>
                                            <option value="">-- SEARCH PRINCIPAL DATABASE --</option>
                                            @foreach($users as $user)
                                                <option value="{{ $user->id }}" {{ old('user_id', $payment->user_id ?? '') == $user->id ? 'selected' : '' }}>
                                                    {{ $user->name }} (#{{ $user->id }}) — {{ $user->email }}
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                    @error('user_id') <small class="text-danger font-weight-bold mt-1 d-block ml-1">{{ $message }}</small> @enderror
                                </div>

                                <div class="col-md-6 mb-0">
                                    <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Registry Classification</label>
                                    <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-shapes text-primary"></i></span>
                                        </div>
                                        <select name="payable_type" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0" required>
                                            <option value="">Select Payable Type</option>
                                            @php
                                                $payableTypes = [
                                                    'App\Models\Subscription' => 'Platform Subscription', 
                                                    'App\Models\PropertyBooking' => 'Property Booking', 
                                                    'App\Models\EventBooking' => 'Event Ticketing',
                                                ];
                                                $currentPayableType = old('payable_type', $payment->payable_type ?? '');
                                            @endphp
                                            @foreach($payableTypes as $type => $label)
                                                <option value="{{ $type }}" {{ $currentPayableType == $type ? 'selected' : '' }}>{{ $label }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    @error('payable_type') <small class="text-danger font-weight-bold mt-1 d-block ml-1">{{ $message }}</small> @enderror
                                </div>

                                <div class="col-md-6 mb-0">
                                    <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Reference Identifier (#ID)</label>
                                    <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-hashtag text-primary"></i></span>
                                        </div>
                                        <input type="number" name="payable_id" class="form-control border-0 shadow-none bg-white h-100 py-0 font-weight-bold" required
                                            value="{{ old('payable_id', $payment->payable_id ?? '') }}" placeholder="e.g. 1042">
                                    </div>
                                    @error('payable_id') <small class="text-danger font-weight-bold mt-1 d-block ml-1">{{ $message }}</small> @enderror
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- Card 2: Financial Specification --}}
                    <div class="card card-premium shadow-premium border-0 mb-4" style="border-radius: 24px;">
                        <div class="card-header border-0 bg-white py-4 px-4">
                            <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 float-none">
                                <i class="fas fa-money-check-alt mr-2 text-primary opacity-50"></i> Transaction Specifications
                            </h3>
                        </div>
                        <div class="card-body p-4 pt-0">
                            <div class="row">
                                <div class="col-md-6 mb-4">
                                    <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Amount & Currency</label>
                                    <div class="input-group border rounded shadow-xs bg-white overflow-hidden" style="height: 46px; padding: 2px;">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text bg-white border-0 py-0 font-weight-bold text-primary">{{ setting('currency_symbol', '$') }}</span>
                                        </div>
                                        <input type="number" step="0.01" name="amount" class="form-control border-0 shadow-none bg-white h-100 py-0 font-weight-bold text-success text-lg" 
                                            value="{{ old('amount', $payment->amount ?? '') }}" required placeholder="0.00">
                                        <div class="input-group-append border-0">
                                            <input type="text" name="currency" class="form-control border-0 shadow-none bg-light h-100 py-0 text-center font-weight-bold smallest uppercase" 
                                                style="width: 80px;" value="{{ old('currency', $payment->currency ?? setting('currency_code', 'USD')) }}" required maxlength="3">
                                        </div>
                                    </div>
                                    @error('amount') <small class="text-danger font-weight-bold mt-1 d-block ml-1">{{ $message }}</small> @enderror
                                </div>

                                <div class="col-md-6 mb-4">
                                    <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Payment Protocol</label>
                                    <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-credit-card text-primary"></i></span>
                                        </div>
                                        <select name="payment_method" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0" required>
                                            @php $methods = ['stripe' => 'Stripe Intelligence', 'paypal' => 'PayPal Express', 'bank_transfer' => 'Institutional Transfer', 'manual' => 'Manual Reconciliation']; @endphp
                                            @foreach($methods as $val => $label)
                                                <option value="{{ $val }}" {{ old('payment_method', $payment->payment_method ?? '') == $val ? 'selected' : '' }}>{{ $label }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    @error('payment_method') <small class="text-danger font-weight-bold mt-1 d-block ml-1">{{ $message }}</small> @enderror
                                </div>

                                <div class="col-md-6 mb-0">
                                    <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Gateway Transaction ID</label>
                                    <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-fingerprint text-primary"></i></span>
                                        </div>
                                        <input type="text" name="transaction_id" class="form-control border-0 shadow-none bg-white h-100 py-0 text-monospace smallest" 
                                            value="{{ old('transaction_id', $payment->transaction_id ?? '') }}" 
                                            placeholder="Ext. Ref (e.g. pi_3M...)">
                                    </div>
                                </div>

                                <div class="col-md-6 mb-0">
                                    <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Lifecycle Status</label>
                                    <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-traffic-light text-primary"></i></span>
                                        </div>
                                        <select name="status" class="form-control border-0 custom-select shadow-none bg-white h-100 py-0" required>
                                            <option value="pending" {{ old('status', $payment->status ?? 'pending') == 'pending' ? 'selected' : '' }}>Awaiting Capture (Pending)</option>
                                            <option value="completed" {{ old('status', $payment->status ?? '') == 'completed' ? 'selected' : '' }}>Settled (Completed)</option>
                                            <option value="failed" {{ old('status', $payment->status ?? '') == 'failed' ? 'selected' : '' }}>Terminated (Failed)</option>
                                            <option value="refunded" {{ old('status', $payment->status ?? '') == 'refunded' ? 'selected' : '' }}>Reversed (Refunded)</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-12 mt-4">
                                    <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Settlement / Capture Timestamp (Optional)</label>
                                    <div class="input-group border rounded shadow-xs bg-white" style="height: 46px; padding: 2px;">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text bg-white border-0 py-0"><i class="fas fa-calendar-check text-primary"></i></span>
                                        </div>
                                        <input type="datetime-local" name="paid_at" class="form-control border-0 shadow-none bg-white h-100 py-0" 
                                            value="{{ old('paid_at', $payment->paid_at ? $payment->paid_at->format('Y-m-d\TH:i') : '') }}">
                                    </div>
                                    <p class="text-muted smallest mt-2 mb-0 uppercase letter-spacing-1 opacity-75">
                                        <i class="fas fa-info-circle mr-1"></i> Explicit date when funds were officially captured by the gateway or received manually.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- Card 3: Internal Context & Raw Data --}}
                    <div class="card card-premium shadow-premium border-0" style="border-radius: 24px;">
                        <div class="card-header border-0 bg-white py-4 px-4">
                            <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 float-none">
                                <i class="fas fa-file-invoice mr-2 text-primary opacity-50"></i> Internal Context & Intelligence
                            </h3>
                        </div>
                        <div class="card-body p-4 pt-0">
                            <div class="form-group mb-4">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Administrative Notes</label>
                                <textarea name="description" class="form-control border shadow-xs bg-white p-3" rows="3"
                                    style="border-radius: 12px; font-size: 0.95rem;"
                                    placeholder="Provide internal rationale or reconciliation notes...">{{ old('description', $payment->description ?? '') }}</textarea>
                            </div>

                            <div class="form-group mb-0">
                                <label class="smallest font-weight-bold text-secondary text-uppercase mb-2 letter-spacing-1">Gateway Metadata (JSON Intelligence)</label>
                                <textarea name="metadata" class="form-control border shadow-xs bg-white text-monospace smallest p-4" rows="8"
                                    style="border-radius: 15px; background: #fdfdfd !important; line-height: 1.6;"
                                    placeholder='{ "gateway_response": "..." }'>{{ old('metadata', $payment->exists ? json_encode($payment->metadata, JSON_PRETTY_PRINT) : '') }}</textarea>
                                <p class="text-muted smallest mt-3 mb-0 uppercase letter-spacing-1 opacity-75">
                                    <i class="fas fa-info-circle mr-1"></i> Original webhook or API response payload from the provider.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Right Column: Execution & Summary --}}
                <div class="col-md-4">
                    <div class="position-sticky" style="top: 20px;">
                        @include('admin.payments.partials.action-buttons')

                        @if($payment->exists && $payment->paid_at)
                        <div class="card card-premium shadow-premium border-0 mt-4 overflow-hidden" style="border-radius: 24px;">
                            <div class="card-body p-4 text-center">
                                <div class="icon-circle bg-success-soft text-success mx-auto mb-3" style="width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-check-circle fa-2x"></i>
                                </div>
                                <h6 class="font-weight-bold text-dark text-uppercase letter-spacing-1 mb-1">Settled & Captured</h6>
                                <p class="text-muted smallest uppercase letter-spacing-1 mb-0">{{ $payment->paid_at->format('M d, Y @ H:i') }}</p>
                            </div>
                        </div>
                        @endif
                    </div>
                </div>
            </div>
        </form>
    </div>
@endsection

@section('css')
<style>
    .text-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important; }
    .select2-container--bootstrap4 .select2-selection--single { height: 100% !important; border: 0 !important; background: transparent !important; }
    .select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered { line-height: 40px !important; padding-left: 0 !important; font-weight: 600 !important; font-size: 0.85rem !important; }
    .select2-container--bootstrap4 .select2-selection--single .select2-selection__arrow { top: 50% !important; transform: translateY(-50%) !important; }
    
    .nav-pills-premium .nav-link { color: #6c757d; border: 1px solid transparent; transition: all 0.3s ease; }
    .nav-pills-premium .nav-link:hover { background: #f8f9fa; color: #333; }
    .nav-pills-premium .nav-link.active { background: #fff !important; color: #007bff !important; border-color: #007bff; box-shadow: 0 4px 12px rgba(0,123,255,0.15); }
</style>
@endsection

@section('js')
<script>
    $(document).ready(function() {
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: "Target Principal"
        });
    });
</script>
@endsection
