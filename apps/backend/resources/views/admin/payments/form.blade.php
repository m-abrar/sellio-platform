@extends('adminlte::page')

@section('title', isset($payment) ? 'Edit Payment' : 'Add Payment')

@section('content_header')
    <h1>{{ isset($payment) ? 'Edit Payment' : 'Add Payment' }}</h1>
@stop

@section('content')

{{-- Assume this includes livewire, alert messages, etc. --}}
@include('admin.alert') 

<div class="row pb-5">

    <div class="col-md-8">
        <div class="position-sticky">

            <form id="payment-form" 
                  action="{{ isset($payment) ? route('admin.payments.update', $payment->id) : route('admin.payments.store') }}" 
                  method="POST">
                @csrf
                @if(isset($payment)) @method('PATCH') @endif

                <ul class="nav nav-pills mb-3 p-1 bg-white shadow-sm rounded-pill" id="paymentTabs" role="tablist" style="width: fit-content;">
                    <li class="nav-item">
                        <a class="nav-link active px-4 py-2 rounded-pill" id="details-tab" data-toggle="tab" href="#details" role="tab">
                            <i class="fas fa-info-circle mr-1"></i> Payment Details
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link px-4 py-2 rounded-pill" id="metadata-tab" data-toggle="tab" href="#metadata" role="tab">
                            <i class="fas fa-box mr-1"></i> Metadata / Gateway Data
                        </a>
                    </li>
                    {{-- Only show history on edit page --}}
                    @if(isset($payment))
                    <li class="nav-item">
                        <a class="nav-link px-4 py-2 rounded-pill" id="history-tab" data-toggle="tab" href="#history" role="tab">
                            <i class="fas fa-history mr-1"></i> Related Payments
                        </a>
                    </li>
                    @endif
                </ul>

                <div class="tab-content" id="paymentTabContent">

                    <div class="tab-pane fade show active" id="details" role="tabpanel">
                        <div class="card shadow-sm rounded-3 mb-4">
                            <div class="card-header border-bottom fw-bold">
                                <h3 class="card-title">Payment Info</h3>
                            </div>
                            <div class="card-body">

                                <div class="row">


                                    <div class="form-group col-md-6">
                                        <label>Associated Model (Payable Type)</label>
                                        <select name="payable_type" class="form-control" required>
                                            <option value="">-- Select Payable Type --</option>
                                            @php
                                                // List all possible models this payment can be linked to.
                                                $payableTypes = [
                                                    'App\Models\Subscription', 
                                                    'App\Models\PropertyBooking', 
                                                    'App\Models\EventBooking',
                                                    // Add any other models here (e.g., 'App\Models\Order')
                                                ];
                                                
                                                // Get the current selected value for editing/old input
                                                $currentPayableType = old('payable_type', $payment->payable_type ?? '');
                                                
                                                // If editing and current value is not in the list (e.g., a custom or deleted model), add it.
                                                if ($currentPayableType && !in_array($currentPayableType, $payableTypes)) {
                                                    $payableTypes[] = $currentPayableType;
                                                }
                                            @endphp

                                            @foreach($payableTypes as $type)
                                                <option value="{{ $type }}" {{ $currentPayableType == $type ? 'selected' : '' }}>
                                                    {{ class_basename($type) }}
                                                </option>
                                            @endforeach
                                        </select>
                                        
                                        @error('payable_type')
                                            <div class="text-danger small">{{ $message }}</div>
                                        @enderror
                                        <small class="text-muted">The model (Subscription, Booking, etc.) this payment is for.</small>
                                    </div>


                                    <div class="form-group col-md-6">
                                        <label>Payable ID</label>
                                        <input type="number" name="payable_id" class="form-control" required
                                            value="{{ old('payable_id', $payment->payable_id ?? '') }}"
                                            placeholder="e.g., Subscription ID">
                                        <small class="text-muted">The ID of the associated model (e.g., 101).</small>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="form-group col-md-6">
                                        <label>User</label>
                                        {{-- Use 'users' variable passed from controller for dropdown --}}
                                        <select name="user_id" class="form-control select2" required>
                                            @foreach($users as $user)
                                                <option value="{{ $user->id }}" {{ old('user_id', $payment->user_id ?? '') == $user->id ? 'selected' : '' }}>
                                                    {{ $user->name }} (ID: {{ $user->id }})
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>

                                    <div class="form-group col-md-6">
                                        <label>Amount</label>
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text"><i class="fas fa-dollar-sign"></i></span>
                                            </div>
                                            <input type="number" step="0.01" name="amount" class="form-control" 
                                                value="{{ old('amount', $payment->amount ?? '') }}" required>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="form-group col-md-4">
                                        <label>Currency</label>
                                        <input type="text" name="currency" class="form-control" 
                                            value="{{ old('currency', $payment->currency ?? 'USD') }}" required maxlength="3">
                                    </div>

                                    <div class="form-group col-md-4">
                                        <label>Method</label>
                                        <select name="payment_method" class="form-control" required>
                                            <option value="">-- Select Method --</option>
                                            @php $methods = ['stripe', 'paypal', 'credit_card', 'bank_transfer', 'manual']; @endphp
                                            @foreach($methods as $method)
                                                <option value="{{ $method }}" {{ old('payment_method', $payment->payment_method ?? '') == $method ? 'selected' : '' }}>{{ ucfirst(str_replace('_', ' ', $method)) }}</option>
                                            @endforeach
                                        </select>
                                    </div>

                                    <div class="form-group col-md-4">
                                        <label>Status</label>
                                        <select name="status" class="form-control" required>
                                            <option value="pending" {{ old('status', $payment->status ?? '') == 'pending' ? 'selected' : '' }}>Pending</option>
                                            <option value="completed" {{ old('status', $payment->status ?? '') == 'completed' ? 'selected' : '' }}>Completed</option>
                                            <option value="failed" {{ old('status', $payment->status ?? '') == 'failed' ? 'selected' : '' }}>Failed</option>
                                            <option value="refunded" {{ old('status', $payment->status ?? '') == 'refunded' ? 'selected' : '' }}>Refunded</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label>Transaction ID / Reference</label>
                                    <input type="text" name="transaction_id" class="form-control" 
                                        value="{{ old('transaction_id', $payment->transaction_id ?? '') }}" 
                                        placeholder="External ID from Stripe, PayPal, etc.">
                                </div>
                                
                                <div class="form-group">
                                    <label>Notes/Description</label>
                                    <textarea name="description" class="form-control" rows="3"
                                        placeholder="Internal notes about the payment or reason for manual entry.">{{ old('description', $payment->description ?? '') }}</textarea>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="metadata" role="tabpanel">
                        <div class="card shadow-sm rounded-3 mb-4">
                            <div class="card-header border-bottom fw-bold">
                                <h3 class="card-title">Gateway / Metadata (JSON)</h3>
                            </div>
                            <div class="card-body">
                                <div class="form-group">
                                    <label>Metadata</label>
                                    <textarea name="metadata" class="form-control" rows="10"
                                        placeholder="Enter raw JSON or payment gateway response data here.">{{ old('metadata', isset($payment) ? json_encode($payment->metadata, JSON_PRETTY_PRINT) : '') }}</textarea>
                                    <small class="text-muted">This field stores the raw JSON response from the payment gateway.</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- This tab only makes sense when editing an existing payment --}}
                    @if(isset($payment) && $payment->payable && method_exists($payment->payable, 'payments'))
                    <div class="tab-pane fade" id="history" role="tabpanel">
                        <div class="card shadow-sm rounded-3 mb-4">
                            <div class="card-header border-bottom fw-bold">
                                <h3 class="card-title">Other Payments for this {{ class_basename($payment->payable_type) }}</h3>
                            </div>
                            <div class="card-body">
                                <table class="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Transaction ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @forelse($payment->payable->payments->sortByDesc('created_at') as $p)
                                            <tr>
                                                <td><a href="{{ route('admin.payments.edit', $p->id) }}">{{ $p->id }}</a></td>
                                                <td>{{ $p->created_at->format('d M Y H:i') }}</td>
                                                <td>{{ $p->currency }} {{ number_format($p->amount, 2) }}</td>
                                                <td>
                                                    @php 
                                                        $badge = ['completed' => 'success', 'pending' => 'warning', 'failed' => 'danger', 'refunded' => 'info']; 
                                                    @endphp
                                                    <span class="badge badge-{{ $badge[$p->status] ?? 'secondary' }}">{{ ucfirst($p->status) }}</span>
                                                </td>
                                                <td>{{ $p->transaction_id ?? '-' }}</td>
                                            </tr>
                                        @empty
                                            <tr><td colspan="5">No other related payments found.</td></tr>
                                        @endforelse
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    @endif

                </div> {{-- /tab-content --}}

            </form>
        </div>
    </div>

    <div class="col-md-4">
        <div class="position-sticky">

            @include('admin.payments.partials.action-buttons')

        </div>
    </div>

</div>

@endsection

@push('css')
{{-- Ensure you load the select2 CSS if you use the select2 class --}}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ttskch/select2-bootstrap4-theme@1.3.6/dist/select2-bootstrap4.min.css">

<style>
.position-sticky { position: sticky; z-index: 100; top: 10px !important; }

#paymentTabs.nav-pills { flex-wrap: wrap; gap: 0.5rem; }
#paymentTabs.nav-pills .nav-link { border-radius: 0.5rem; color: #6c757d; font-weight: 500; transition: all 0.2s ease-in-out; background-color: #fff; }
#paymentTabs.nav-pills .nav-link:hover { background-color: #f8f9fa; color: #222 !important; border-radius: 0.3rem; }
#paymentTabs.nav-pills .nav-link.active { border-bottom: 3px solid #007bff; color: #007bff !important; font-weight: 600; background-color: #fff; border-radius: 0.3rem; box-shadow: 0 2px 4px rgba(0,123,255,0.2); }
/* Custom style to align with AdminLTE's .select2-container--bootstrap4 */
.select2-container .select2-selection--single { height: calc(2.25rem + 2px) !important; }
</style>
@endpush

@push('js')
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Select2 for the user selection for better searchability
    $('.select2').select2({
        theme: 'bootstrap4',
        placeholder: "Select a user",
        allowClear: true
    });
});
</script>
@endpush
