{{--
    Administrative Financial Module: Withdrawal Detail & Configuration
    
    This view facilitates the management of partner payout requests.
    It provides a high-fidelity interface for reviewing request details,
    payout method intelligence, and administrative status transitions.
    
    @extends adminlte::page
    @context Financial Management
    @variables Withdrawal $withdrawal The withdrawal request model instance.
--}}
@extends('adminlte::page')

@section('title', __('Payout Request Details | Financials'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-invoice-dollar mr-2 text-primary opacity-50"></i> {{ __('Payout Request') }} #{{ $withdrawal->id }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Review and synchronize financial settlement for marketplace partners.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.withdrawals.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to List') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="row">
        {{-- Primary Intelligence Column --}}
        <div class="col-md-8">
            {{-- Status & Quick Metrics --}}
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card border-0 shadow-premium rounded-xl bg-primary text-white overflow-hidden h-100">
                        <div class="card-body p-4 position-relative">
                            <div class="opacity-10 position-absolute r-minus-10 b-minus-20 fs-8-rem">
                                <i class="fas fa-money-check-alt"></i>
                            </div>
                            <h6 class="smallest font-weight-bold uppercase letter-spacing-2 mb-3 opacity-75">{{ __('Settlement Amount') }}</h6>
                            <h2 class="font-weight-bold mb-0">${{ number_format($withdrawal->amount_dollars, 2) }}</h2>
                            <p class="smallest font-weight-bold mt-2 mb-0 text-white-50 uppercase">{{ __('Base Units') }}: {{ number_format($withdrawal->amount) }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-0 shadow-premium rounded-xl h-100 bg-white">
                        <div class="card-body p-4 d-flex align-items-center">
                            <div class="icon-box-premium bg-light-soft mr-4">
                                <i class="fas fa-shield-alt text-primary opacity-75"></i>
                            </div>
                            <div>
                                <h6 class="smallest font-weight-bold text-muted uppercase letter-spacing-2 mb-1">{{ __('Request Status') }}</h6>
                                @php $status = $withdrawal->getStatusMeta(); @endphp
                                <span class="badge badge-{{ $status['color'] }}-light text-{{ $status['color'] }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                                    <i class="fas fa-circle mr-1 text-xs"></i> {{ $status['label'] }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Request Specifics --}}
            <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                <div class="card-header border-0 bg-white py-4 px-4">
                    <h3 class="card-title-main">{{ __('Payment Details') }}</h3>
                </div>
                <div class="card-body p-4 pt-0">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group mb-4">
                                <label class="small font-weight-bold text-muted uppercase mb-2 d-block">{{ __('Payment Method') }}</label>
                                <div class="p-3 bg-light rounded-xl border border-light-soft d-flex align-items-center">
                                    <i class="fas fa-university mr-3 text-primary opacity-50"></i>
                                    <span class="font-weight-bold text-dark">{{ $withdrawal->method ?: 'N/A' }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group mb-4">
                                <label class="small font-weight-bold text-muted uppercase mb-2 d-block">{{ __('Temporal Signature') }}</label>
                                <div class="p-3 bg-light rounded-xl border border-light-soft d-flex align-items-center">
                                    <i class="fas fa-clock mr-3 text-primary opacity-50"></i>
                                    <span class="font-weight-bold text-dark">{{ $withdrawal->created_at->format('M d, Y @ H:i') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group mb-0">
                        <label class="small font-weight-bold text-muted uppercase mb-2 d-block">{{ __('Destination Credentials') }}</label>
                        <div class="p-4 bg-dark text-white rounded-xl shadow-premium-sm font-weight-600 font-0-9">
                            <pre class="mb-0 text-white pre-wrap">{{ $withdrawal->details ?: __('No detailed credentials provided.') }}</pre>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Administrative Processing --}}
            @if($withdrawal->status === 'pending')
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Administrative Actions') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <form action="{{ route('admin.withdrawals.approve', $withdrawal) }}" method="POST" id="payoutApproveForm">
                            @csrf
                            <div class="form-group mb-4">
                                <label class="small font-weight-bold text-muted uppercase mb-2 d-block">{{ __('Internal Payout Note') }}</label>
                                <textarea name="admin_note" rows="3" class="form-control form-control-premium" placeholder="{{ __('Enter transaction ID or notes for the partner...') }}"></textarea>
                            </div>
                            
                            <div class="d-flex gap-12">
                                <button type="button" class="btn btn-success rounded-pill px-4 py-3 flex-grow-1 font-weight-bold smallest uppercase letter-spacing-1 shadow-sm" 
                                    data-action="confirm-action"
                                    data-form-id="payoutApproveForm"
                                    data-confirm-title="{{ __('Finalize Payout?') }}"
                                    data-confirm-text="{{ __('Confirm that funds have been transferred to the partner.') }}"
                                    data-confirm-btn="<i class='fas fa-check-circle mr-2'></i> {{ __('Yes, Finalize!') }}"
                                    data-confirm-icon="question"
                                    data-confirm-icon-color="#10b981">
                                    <i class="fas fa-check-circle mr-2"></i> {{ __('Approve & Process') }}
                                </button>
                                <button type="button" class="btn btn-danger-soft rounded-pill px-4 py-3 flex-grow-1 font-weight-bold smallest uppercase letter-spacing-1 border" data-toggle="modal" data-target="#rejectModal">
                                    <i class="fas fa-ban mr-2"></i> {{ __('Reject Request') }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            @elseif($withdrawal->admin_note)
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4 border-left-premium-{{ $status['color'] }}">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Administrative Audit Log') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="p-3 rounded-xl border" :class="'bg-{{ $status['color'] }}-soft text-{{ $status['color'] }} border-{{ $status['color'] }}-light'">
                            <i class="fas fa-info-circle mr-2"></i> <strong>{{ __('Audit Note') }}:</strong> {{ $withdrawal->admin_note }}
                        </div>
                    </div>
                </div>
            @endif
        </div>

        {{-- Sidebar Context Column --}}
        <div class="col-md-4">
            {{-- Partner Identity --}}
            <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                <div class="card-header border-0 bg-white py-4 px-4">
                    <h3 class="card-title-side">{{ __('Partner Identity') }}</h3>
                </div>
                <div class="card-body p-4 pt-0 text-center">
                    <div class="avatar-box mx-auto mb-3 shadow-premium rounded-circle overflow-hidden border-4-fff icon-box-100">
                        <img src="{{ $withdrawal->user->getFirstMediaUrl(\App\Models\User::PRIMARY_MEDIA) ?: asset('images/fallbacks/avatar.jpg') }}" class="w-100 h-100 object-fit-cover">
                    </div>
                    <h5 class="font-weight-bold text-dark mb-1">{{ $withdrawal->user->name ?? __('Deleted User') }}</h5>
                    <p class="text-muted smallest font-weight-bold uppercase letter-spacing-1 mb-4">{{ $withdrawal->user->email ?? __('N/A') }}</p>
                    
                    <div class="border-top pt-4">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted smallest font-weight-bold uppercase">{{ __('Account ID') }}</span>
                            <span class="text-dark font-weight-bold smallest">#{{ $withdrawal->user_id }}</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted smallest font-weight-bold uppercase">{{ __('Role') }}</span>
                            <span class="badge badge-primary-light text-primary smallest rounded-pill px-2">{{ __('PARTNER') }}</span>
                        </div>
                    </div>
                    
                    <a href="{{ route('admin.users.show', $withdrawal->user_id) }}" class="btn btn-outline-primary btn-block rounded-pill mt-4 smallest font-weight-bold uppercase letter-spacing-1">
                        {{ __('View Complete Profile') }}
                    </a>
                </div>
            </div>

            {{-- Policy Information --}}
            <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4 bg-light">
                <div class="card-body p-4">
                    <h6 class="font-weight-bold text-dark mb-3"><i class="fas fa-gavel mr-2 text-warning"></i> {{ __('Settlement Policy') }}</h6>
                    <ul class="list-unstyled smallest text-muted font-weight-600 leading-1-8">
                        <li><i class="fas fa-check text-success mr-2"></i> {{ __('Manual verification required.') }}</li>
                        <li><i class="fas fa-check text-success mr-2"></i> {{ __('2FA verification for admin.') }}</li>
                        <li><i class="fas fa-check text-success mr-2"></i> {{ __('Payout method must be active.') }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- REJECT MODAL --}}
<div class="modal fade" id="rejectModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content border-0 shadow-premium rounded-24">
            <div class="modal-header border-0 bg-white px-4 pt-4 pb-0">
                <h5 class="modal-title text-dark font-weight-bold smallest uppercase letter-spacing-1"><i class="fas fa-ban mr-2 text-danger"></i> {{ __('Reject Payout Request') }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="{{ __('Close') }}">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form action="{{ route('admin.withdrawals.reject', $withdrawal) }}" method="POST">
                @csrf
                <div class="modal-body p-4">
                    <div class="form-group mb-0">
                        <label class="small text-muted font-weight-bold text-uppercase mb-2 letter-spacing-1">{{ __('Internal Rejection Reason') }} <span class="text-danger">*</span></label>
                        <textarea name="admin_note" rows="4" class="form-control form-control-premium" placeholder="{{ __('Provide clarity for the partner...') }}" required></textarea> 
                    </div>
                </div>
                <div class="modal-footer border-0 p-4 pt-0 d-flex gap-12">
                    <button type="button" class="btn btn-default shadow-xs rounded-pill px-4 py-2 flex-grow-1 font-weight-bold smallest uppercase" data-dismiss="modal">{{ __('Cancel') }}</button>
                    <button type="submit" class="btn btn-danger shadow-xs rounded-pill px-4 py-2 flex-grow-1 font-weight-bold smallest uppercase">{{ __('Confirm Rejection') }}</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@section('js')
    @include('admin._partials._sweetalert')
@endsection
