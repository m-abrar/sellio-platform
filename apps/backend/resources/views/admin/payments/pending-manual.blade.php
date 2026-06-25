@php use Illuminate\Support\Facades\Storage; @endphp
@extends('adminlte::page')

@section('title', __('Pending Manual Payments'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-hand-holding-usd mr-2 text-warning opacity-75"></i>
                    {{ $pageTitle ?? __('Pending Manual Payments') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Review submitted bank transfer receipts and approve or reject each transaction.') }}</p>
            </div>
            <div class="col-sm-5 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.payments.index') }}" class="btn btn-white rounded-pill px-4 py-2 font-weight-bold shadow-sm smallest uppercase letter-spacing-1 border">
                        <i class="fas fa-receipt mr-2"></i> {{ __('All Payments') }}
                    </a>
                    <a href="{{ route('admin.welcome') }}" class="btn btn-white rounded-pill px-4 py-2 font-weight-bold shadow-sm smallest uppercase letter-spacing-1 border">
                        <i class="fas fa-th-large mr-2"></i> {{ __('Dashboard') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        {{-- Search Filter --}}
        <div class="card registry-card-premium registry-filter-card mb-4">
            <div class="card-body">
                <form method="GET" action="{{ route('admin.payments.pending-manual') }}">
                    <div class="row align-items-end">
                        <div class="col-md-8">
                            <label class="form-label-premium">{{ __('Search') }}</label>
                            <div class="input-group input-group-premium">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                                </div>
                                <input type="text" name="search" class="form-control"
                                       placeholder="{{ __('Payment ID or transaction reference') }}"
                                       value="{{ request('search') }}">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="d-flex align-items-center justify-content-end gap-12">
                                <button type="submit" class="btn-filter-premium flex-grow-1">
                                    <i class="fas fa-sync-alt mr-2"></i> {{ __('SEARCH') }}
                                </button>
                                <a href="{{ route('admin.payments.pending-manual') }}" class="btn-reset-premium" data-toggle="tooltip" title="{{ __('Reset') }}">
                                    <i class="fas fa-undo text-danger"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {{-- Payments List --}}
        <div class="card card-premium shadow-premium border-0 overflow-hidden rounded-24">
            <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                    <i class="fas fa-clock mr-2 text-warning opacity-75"></i> {{ __('Awaiting Approval') }}
                </h3>
                <span class="badge badge-warning-light text-warning px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    <i class="fas fa-hourglass-half mr-1"></i> {{ count($payments) }} {{ __('PENDING') }}
                </span>
            </div>

            <div class="card-body p-4 bg-light-soft">
                @forelse($payments as $payment)
                @php
                    $payable     = $payment->payable;
                    $payableType = class_basename($payable ?? '');
                    $payableLabel = match($payableType) {
                        'PropertyBooking' => __('Property Booking'),
                        'EventBooking'    => __('Event Booking'),
                        'Order'           => __('Product Order'),
                        default           => $payableType ?: __('Unknown'),
                    };
                    $payableIcon = match($payableType) {
                        'PropertyBooking' => 'fas fa-home',
                        'EventBooking'    => 'fas fa-calendar-check',
                        'Order'           => 'fas fa-shopping-bag',
                        default           => 'fas fa-link',
                    };
                    $proofFile = $payment->proof_file;
                    $proofUrl  = $proofFile ? Storage::disk('public')->url($proofFile) : null;
                    $isImage   = $proofFile && preg_match('/\.(jpg|jpeg|png)$/i', $proofFile);
                    $isPdf     = $proofFile && preg_match('/\.pdf$/i', $proofFile);
                @endphp

                <div class="card border-0 shadow-premium rounded-24 overflow-hidden mb-4">
                    <div class="card-body p-0">
                        <div class="row no-gutters">

                            {{-- Left: Payment & User Info --}}
                            <div class="col-md-4 p-4 border-right">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="icon-box-soft bg-warning-soft mr-3 d-flex align-items-center justify-content-center shadow-xs rounded-12" style="width:44px;height:44px;flex-shrink:0">
                                        <i class="fas fa-hand-holding-usd text-warning"></i>
                                    </div>
                                    <div>
                                        <div class="font-weight-bold text-dark smallest uppercase letter-spacing-1">{{ __('Manual Transfer') }}</div>
                                        <div class="text-monospace smallest text-muted">#{{ $payment->id }}</div>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <div class="h4 font-weight-bold text-dark mb-0">
                                        <span class="small text-muted font-weight-normal mr-1">{{ $payment->currency }}</span>{{ number_format($payment->amount, 2) }}
                                    </div>
                                    <div class="smallest text-muted uppercase letter-spacing-1">{{ __('Transfer Amount') }}</div>
                                </div>

                                @if($payment->user)
                                <div class="d-flex align-items-center p-2 bg-light-soft rounded-xl border border-light-soft mb-3">
                                    <div class="icon-box-soft bg-primary-soft mr-2 d-flex align-items-center justify-content-center rounded-10" style="width:36px;height:36px;flex-shrink:0">
                                        <span class="small font-weight-bold text-primary">{{ strtoupper(substr($payment->user->name, 0, 1)) }}</span>
                                    </div>
                                    <div class="overflow-hidden">
                                        <div class="font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1 text-truncate">{{ $payment->user->name }}</div>
                                        <div class="text-muted smallest text-truncate">{{ $payment->user->email }}</div>
                                    </div>
                                </div>
                                @endif

                                <div class="d-flex align-items-center gap-8">
                                    <i class="{{ $payableIcon }} text-muted small mr-1"></i>
                                    <span class="smallest font-weight-bold text-muted uppercase letter-spacing-1">{{ $payableLabel }}</span>
                                    @if($payable)
                                        <span class="text-muted smallest">·</span>
                                        <span class="text-monospace smallest text-muted">#{{ $payable->id }}</span>
                                    @endif
                                </div>
                                <div class="smallest text-muted mt-2">
                                    <i class="far fa-clock mr-1"></i>{{ $payment->created_at->diffForHumans() }}
                                </div>
                            </div>

                            {{-- Centre: Proof of Payment --}}
                            <div class="col-md-5 p-4 border-right">
                                <div class="smallest font-weight-bold text-muted uppercase letter-spacing-1 mb-3">
                                    <i class="fas fa-file-invoice mr-1"></i> {{ __('Submitted Receipt') }}
                                </div>

                                @if($proofUrl && $isImage)
                                    <a href="{{ $proofUrl }}" target="_blank" rel="noopener">
                                        <img src="{{ $proofUrl }}"
                                             alt="{{ __('Payment receipt') }}"
                                             class="img-fluid rounded-12 border shadow-xs"
                                             style="max-height:220px;object-fit:contain;width:100%;background:#f8f9fa;">
                                    </a>
                                    <div class="mt-2 text-center">
                                        <a href="{{ $proofUrl }}" target="_blank" rel="noopener"
                                           class="smallest text-primary font-weight-bold">
                                            <i class="fas fa-external-link-alt mr-1"></i>{{ __('Open full size') }}
                                        </a>
                                    </div>
                                @elseif($proofUrl && $isPdf)
                                    <div class="d-flex align-items-center justify-content-center rounded-12 border bg-light-soft p-4" style="min-height:120px">
                                        <div class="text-center">
                                            <i class="fas fa-file-pdf fa-3x text-danger mb-2 d-block"></i>
                                            <a href="{{ $proofUrl }}" target="_blank" rel="noopener"
                                               class="btn btn-sm btn-outline-danger rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                                <i class="fas fa-download mr-1"></i> {{ __('View PDF Receipt') }}
                                            </a>
                                        </div>
                                    </div>
                                @else
                                    <div class="d-flex align-items-center justify-content-center rounded-12 border bg-light-soft p-4" style="min-height:120px">
                                        <div class="text-center text-muted">
                                            <i class="fas fa-file-times fa-2x mb-2 d-block opacity-50"></i>
                                            <span class="smallest">{{ __('No receipt uploaded') }}</span>
                                        </div>
                                    </div>
                                @endif
                            </div>

                            {{-- Right: Actions --}}
                            <div class="col-md-3 p-4 d-flex flex-column justify-content-between">
                                <div>
                                    <div class="smallest font-weight-bold text-muted uppercase letter-spacing-1 mb-3">
                                        <i class="fas fa-tasks mr-1"></i> {{ __('Decision') }}
                                    </div>

                                    {{-- Approve --}}
                                    <form id="approve-form-{{ $payment->id }}"
                                          action="{{ route('admin.payments.approve', $payment->id) }}"
                                          method="POST" class="mb-2">
                                        @csrf
                                        <button type="button"
                                                class="btn btn-success btn-block font-weight-bold small uppercase letter-spacing-1 rounded-pill py-2 shadow-sm"
                                                onclick="confirmManualAction('approve-form-{{ $payment->id }}', '{{ __('Approve Payment') }}', '{{ __('Confirm this bank transfer and mark the booking as paid?') }}', '{{ __('Approve') }}', 'success')">
                                            <i class="fas fa-check-circle mr-1"></i> {{ __('Approve') }}
                                        </button>
                                    </form>

                                    {{-- Reject --}}
                                    <form id="reject-form-{{ $payment->id }}"
                                          action="{{ route('admin.payments.reject', $payment->id) }}"
                                          method="POST">
                                        @csrf
                                        <button type="button"
                                                class="btn btn-outline-danger btn-block font-weight-bold small uppercase letter-spacing-1 rounded-pill py-2"
                                                onclick="confirmManualAction('reject-form-{{ $payment->id }}', '{{ __('Reject Payment') }}', '{{ __('Reject this receipt? The booking stays pending so the user can resubmit.') }}', '{{ __('Reject') }}', 'warning')">
                                            <i class="fas fa-times-circle mr-1"></i> {{ __('Reject') }}
                                        </button>
                                    </form>
                                </div>

                                <div class="mt-3">
                                    <a href="{{ route('admin.payments.edit', $payment->id) }}"
                                       class="btn btn-light btn-block border font-weight-bold smallest uppercase letter-spacing-1 rounded-pill py-2 text-muted shadow-xs">
                                        <i class="fas fa-edit mr-1"></i> {{ __('Edit Record') }}
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                @empty
                    <div class="card border-0 shadow-premium rounded-24 py-5 text-center bg-white">
                        <div class="py-4">
                            <i class="fas fa-check-double fa-4x text-success opacity-25 mb-3 d-block"></i>
                            <h5 class="text-muted font-weight-bold">{{ __('All Clear') }}</h5>
                            <p class="small text-secondary mb-0">{{ __('No manual payments are pending approval.') }}</p>
                        </div>
                    </div>
                @endforelse
            </div>

            @if(method_exists($payments, 'hasPages') && $payments->hasPages())
                <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying :first - :last of :total records', ['first' => $payments->firstItem(), 'last' => $payments->lastItem(), 'total' => $payments->total()]) }}</div>
                    <div>{{ $payments->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
@endsection

@section('js')
@include('admin._partials._sweetalert')
<script>
function confirmManualAction(formId, title, message, confirmBtn, type) {
    Swal.fire({
        title: title,
        text: message,
        icon: type,
        showCancelButton: true,
        confirmButtonText: confirmBtn,
        cancelButtonText: '{{ __('Cancel') }}',
        confirmButtonColor: type === 'success' ? '#28a745' : '#dc3545',
    }).then(function (result) {
        if (result.isConfirmed) {
            document.getElementById(formId).submit();
        }
    });
}
</script>
@endsection
