{{--
    Administrative Financial Module: Payout Request Detail

    Focused review page for one partner withdrawal request. Keeps the registry
    compact while preserving full destination, wallet, and lifecycle context.
--}}
@extends('adminlte::page')

@section('title', __('Payout Request #:id', ['id' => $withdrawal->id]))

@push('css')
    @include('admin._partials._toggle-card-css')
@endpush

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-invoice-dollar mr-2 text-primary"></i>
                    {{ __('Payout Request') }} #{{ $withdrawal->id }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Review destination details, wallet context, and lifecycle state before acting.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.withdrawals.index') }}" class="btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to Payouts') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    @php $status = $withdrawal->getStatusMeta(); @endphp

    <div class="row">
        <div class="col-lg-8 mb-4">
            <div class="card card-premium shadow-premium border-0 overflow-hidden">
                <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                    <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                        <i class="fas fa-university mr-2 text-primary"></i> {{ __('Destination Data') }}
                    </h3>
                    <span class="badge badge-{{ $status['color'] }}-light text-{{ $status['color'] }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                        {{ $status['label'] }}
                    </span>
                </div>
                <div class="card-body p-4">
                    <div class="row mb-4">
                        <div class="col-md-4 mb-3 mb-md-0">
                            <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1 mb-1">{{ __('Amount') }}</div>
                            <div class="h3 font-weight-bold text-dark mb-0">${{ number_format($withdrawal->amount_dollars, 2) }}</div>
                        </div>
                        <div class="col-md-4 mb-3 mb-md-0">
                            <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1 mb-1">{{ __('Method') }}</div>
                            <div class="font-weight-bold text-dark">{{ $withdrawal->method ?? __('Other') }}</div>
                        </div>
                        <div class="col-md-4">
                            <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1 mb-1">{{ __('Requested') }}</div>
                            <div class="font-weight-bold text-dark">{{ $withdrawal->created_at->format('M d, Y H:i') }}</div>
                        </div>
                    </div>

                    <div class="bg-light border rounded-xl p-4">
                        <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1 mb-2">{{ __('Full Destination Details') }}</div>
                        <pre class="mb-0 text-dark font-weight-bold white-space-pre-wrap">{{ $withdrawal->details ?: __('No destination details supplied.') }}</pre>
                    </div>

                    @if($withdrawal->admin_note)
                        <div class="mt-4 alert alert-danger mb-0">
                            <div class="smallest font-weight-bold uppercase letter-spacing-1 mb-1">{{ __('Admin Note') }}</div>
                            <div>{{ $withdrawal->admin_note }}</div>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <div class="col-lg-4 mb-4">
            <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-4">
                        <img src="{{ $withdrawal->user?->avatar_url ?? asset('images/fallbacks/default-avatar.png') }}"
                             alt="{{ $withdrawal->user->name ?? __('Partner') }}"
                             class="rounded-circle shadow-xs border mr-3"
                             width="52"
                             height="52"
                             style="object-fit: cover;">
                        <div class="min-width-0">
                            <div class="font-weight-bold text-dark text-truncate">{{ $withdrawal->user->name ?? __('N/A (Deleted)') }}</div>
                            <div class="smallest text-muted text-monospace">{{ __('ACCOUNT') }} #{{ $withdrawal->user_id }}</div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between py-2 border-bottom">
                        <span class="smallest font-weight-bold text-muted uppercase letter-spacing-1">{{ __('Wallet') }}</span>
                        <span class="font-weight-bold text-dark">${{ number_format($walletBalance, 2) }}</span>
                    </div>
                    <div class="d-flex justify-content-between py-2 border-bottom">
                        <span class="smallest font-weight-bold text-muted uppercase letter-spacing-1">{{ __('Pending Queue') }}</span>
                        <span class="font-weight-bold {{ $pendingForPartner > $walletBalance ? 'text-danger' : 'text-primary' }}">${{ number_format($pendingForPartner, 2) }}</span>
                    </div>
                    <div class="d-flex justify-content-between py-2">
                        <span class="smallest font-weight-bold text-muted uppercase letter-spacing-1">{{ __('After Queue') }}</span>
                        <span class="font-weight-bold {{ $remainingAfterQueue < 0 ? 'text-danger' : 'text-success' }}">${{ number_format($remainingAfterQueue, 2) }}</span>
                    </div>
                </div>
            </div>

            @if ($withdrawal->status === \App\Models\Withdrawal::STATUS_PENDING)
                <div class="card card-premium shadow-premium border-0 overflow-hidden">
                    <div class="card-body p-4">
                        <form action="{{ route('admin.withdrawals.approve', $withdrawal) }}" method="POST" class="mb-3">
                            @csrf
                            <button type="submit" class="btn btn-success btn-block rounded-pill font-weight-bold py-3 smallest uppercase letter-spacing-1">
                                <i class="fas fa-check mr-2"></i> {{ __('Approve Payout') }}
                            </button>
                        </form>
                        <form action="{{ route('admin.withdrawals.reject', $withdrawal) }}" method="POST">
                            @csrf
                            <div class="form-group">
                                <label class="smallest font-weight-bold text-muted uppercase letter-spacing-1">{{ __('Rejection Reason') }}</label>
                                <textarea name="admin_note" rows="3" class="form-control form-control-premium" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-danger btn-block rounded-pill font-weight-bold py-3 smallest uppercase letter-spacing-1">
                                <i class="fas fa-times mr-2"></i> {{ __('Reject Payout') }}
                            </button>
                        </form>
                    </div>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
