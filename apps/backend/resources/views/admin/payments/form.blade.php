{{--
    Administrative Financial Module: Transaction Configuration
    
    This view serves as the primary interface for managing financial 
    ledger entries. It orchestrates principal account linkage, payable 
    entity association, specification of fiscal amounts, gateway 
    reconciliation (transaction IDs), and lifecycle status management, 
    ensuring precise Payment Details across all platform 
    revenue channels.
    
    @extends adminlte::page
    @context Financial Management
    @variables Payment $payment The payment model instance.
    @variables Collection $users Available principal accounts.
--}}
@extends('adminlte::page')

@section('title', ($payment->exists ? __('Edit Transaction') : __('Record Transaction')) . ' | ' . __('Payment Details'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-credit-card mr-2 text-primary opacity-50"></i>
                    {{ $payment->exists ? __('Modify Transaction') : __('Initialize Transaction') }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $payment->exists ? __('Update payment record, reconcile gateway data, and review transaction history.') : __('Record manual settlements and capture offline revenue.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.payments.index') }}" class="btn-back shadow-sm">
                        <i class="fas fa-arrow-left mr-1"></i> {{ __('RETURN TO LEDGER') }}
                    </a>
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large mr-2"></i> {{ __('Dashboard') }}
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
                    <div class="card border-0 shadow-premium mb-4 rounded-xl">
                        <div class="card-header border-0 bg-white py-4 px-4">
                            <h5 class="card-title-main">
                                <i class="fas fa-id-card mr-2 text-primary opacity-50"></i> {{ __('Principal & Entity Linkage') }}
                            </h5>
                        </div>
                        <div class="card-body p-4 pt-0">
                            <div class="row">
                                <div class="col-md-12 mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Associated Account (Principal)') }}</label>
                                    <div class="input-group input-group-premium">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text"><i class="fas fa-user-tie text-xs"></i></span>
                                        </div>
                                        <select name="user_id" class="form-control select2" required>
                                            <option value="">-- {{ __('SEARCH PRINCIPAL DATABASE') }} --</option>
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
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Type') }}</label>
                                    <div class="input-group input-group-premium">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text"><i class="fas fa-shapes text-xs"></i></span>
                                        </div>
                                        <select name="payable_type" class="form-control" required>
                                            <option value="">{{ __('Select Payable Type') }}</option>
                                            @php
                                                $payableTypes = [
                                                    'App\Models\Subscription' => __('Platform Subscription'), 
                                                    'App\Models\PropertyBooking' => __('Property Booking'), 
                                                    'App\Models\EventBooking' => __('Event Ticketing'),
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
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Reference Identifier (#ID)') }}</label>
                                    <div class="input-group input-group-premium">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text"><i class="fas fa-hashtag text-xs"></i></span>
                                        </div>
                                        <input type="number" name="payable_id" class="form-control font-weight-bold" required
                                            value="{{ old('payable_id', $payment->payable_id ?? '') }}" placeholder="{{ __('e.g. 1042') }}">
                                    </div>
                                    @error('payable_id') <small class="text-danger font-weight-bold mt-1 d-block ml-1">{{ $message }}</small> @enderror
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- Card 2: Financial Specification --}}
                    <div class="card border-0 shadow-premium mb-4 rounded-xl">
                        <div class="card-header border-0 bg-white py-4 px-4">
                            <h5 class="card-title-main">
                                <i class="fas fa-money-check-alt mr-2 text-primary opacity-50"></i> {{ __('Transaction Specifications') }}
                            </h5>
                        </div>
                        <div class="card-body p-4 pt-0">
                            <div class="row">
                                <div class="col-md-6 mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Amount & Currency') }}</label>
                                    <div class="input-group input-group-premium">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text font-weight-bold text-xs">{{ setting('currency_symbol', '$') }}</span>
                                        </div>
                                        <input type="number" step="0.01" name="amount" class="form-control font-weight-bold text-success text-lg" 
                                            value="{{ old('amount', $payment->amount ?? '') }}" required placeholder="0.00">
                                        <div class="input-group-append border-0">
                                            <input type="text" name="currency" class="form-control text-center font-weight-bold small uppercase bg-light border-0 col-media-80" 
                                                 value="{{ old('currency', $payment->currency ?? setting('currency_code', 'USD')) }}" required maxlength="3">
                                        </div>
                                    </div>
                                    @error('amount') <small class="text-danger font-weight-bold mt-1 d-block ml-1">{{ $message }}</small> @enderror
                                </div>

                                <div class="col-md-6 mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Payment Protocol') }}</label>
                                    <div class="input-group input-group-premium">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text"><i class="fas fa-credit-card text-xs"></i></span>
                                        </div>
                                        <select name="payment_method" class="form-control" required>
                                            @php $methods = ['stripe' => __('Stripe'), 'paypal' => __('PayPal Express'), 'bank_transfer' => __('Institutional Transfer'), 'manual' => __('Manual Reconciliation')]; @endphp
                                            @foreach($methods as $val => $label)
                                                <option value="{{ $val }}" {{ old('payment_method', $payment->payment_method ?? '') == $val ? 'selected' : '' }}>{{ $label }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    @error('payment_method') <small class="text-danger font-weight-bold mt-1 d-block ml-1">{{ $message }}</small> @enderror
                                </div>

                                <div class="col-md-6 mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Gateway Transaction ID') }}</label>
                                    <div class="input-group input-group-premium">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text"><i class="fas fa-fingerprint text-xs"></i></span>
                                        </div>
                                        <input type="text" name="transaction_id" class="form-control text-monospace smallest" 
                                            value="{{ old('transaction_id', $payment->transaction_id ?? '') }}" 
                                            placeholder="{{ __('Ext. Ref (e.g. pi_3M...)') }}">
                                    </div>
                                </div>

                                <div class="col-md-6 mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Status') }}</label>
                                    <div class="input-group input-group-premium">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text"><i class="fas fa-traffic-light text-xs"></i></span>
                                        </div>
                                        <select name="status" class="form-control" required>
                                            <option value="pending" {{ old('status', $payment->status ?? 'pending') == 'pending' ? 'selected' : '' }}>{{ __('Awaiting Capture (Pending)') }}</option>
                                            <option value="completed" {{ old('status', $payment->status ?? '') == 'completed' ? 'selected' : '' }}>{{ __('Settled (Completed)') }}</option>
                                            <option value="failed" {{ old('status', $payment->status ?? '') == 'failed' ? 'selected' : '' }}>{{ __('Terminated (Failed)') }}</option>
                                            <option value="refunded" {{ old('status', $payment->status ?? '') == 'refunded' ? 'selected' : '' }}>{{ __('Reversed (Refunded)') }}</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-md-12 mt-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Settlement / Capture Timestamp (Optional)') }}</label>
                                    <div class="input-group input-group-premium">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text"><i class="fas fa-calendar-check text-xs"></i></span>
                                        </div>
                                        <input type="datetime-local" name="paid_at" class="form-control" 
                                            value="{{ old('paid_at', $payment->paid_at ? $payment->paid_at->format('Y-m-d\TH:i') : '') }}">
                                    </div>
                                    <p class="text-muted smallest mt-2 mb-0 uppercase letter-spacing-1 opacity-75">
                                        <i class="fas fa-info-circle mr-1"></i> {{ __('Explicit date when funds were officially captured by the gateway or received manually.') }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- Card 3: Internal Context & Raw Data --}}
                    <div class="card border-0 shadow-premium rounded-xl">
                        <div class="card-header border-0 bg-white py-4 px-4">
                            <h5 class="card-title-main">
                                <i class="fas fa-file-invoice mr-2 text-primary opacity-50"></i> {{ __('Internal Notes') }}
                            </h5>
                        </div>
                        <div class="card-body p-4 pt-0">
                            <div class="form-group mb-4">
                                <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Administrative Notes') }}</label>
                                <textarea name="description" class="form-control border shadow-xs bg-white p-3 rounded-xl font-0-95" rows="3"
                                     placeholder="{{ __('Provide internal rationale or reconciliation notes...') }}">{{ old('description', $payment->description ?? '') }}</textarea>
                            </div>

                            <div class="form-group mb-0">
                                <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Gateway Metadata (JSON)') }}</label>
                                <textarea name="metadata" class="form-control border shadow-xs bg-white text-monospace smallest p-4 rounded-15 bg-light-fdfdfd leading-1-6" rows="8"
                                     placeholder='{ "gateway_response": "..." }'>{{ old('metadata', $payment->exists ? json_encode($payment->metadata, JSON_PRETTY_PRINT) : '') }}</textarea>
                                <p class="text-muted smallest mt-3 mb-0 uppercase letter-spacing-1 opacity-75">
                                    <i class="fas fa-info-circle mr-1"></i> {{ __('Original webhook or API response payload from the provider.') }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Right Column: Execution & Summary --}}
                <div class="col-md-4">
                    <div class="position-sticky top-100">
                        @include('admin.payments.partials.action-buttons')

                        @if($payment->exists && $payment->paid_at)
                        <div class="card border-0 shadow-premium mt-4 overflow-hidden rounded-xl">
                            <div class="card-body p-4 text-center">
                                <div class="icon-circle bg-success-soft text-success mx-auto mb-3 icon-box-60 rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="fas fa-check-circle fa-2x"></i>
                                </div>
                                <h5 class="card-title-side mb-1">{{ __('Settled & Captured') }}</h5>
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

@section('js')
<script>
    $(document).ready(function() {
        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: "{{ __('Target Principal') }}"
        });
    });
</script>
@endsection
