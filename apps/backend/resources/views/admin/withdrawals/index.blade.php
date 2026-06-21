{{--
    Administrative Financial Module: Payout Management Registry
    
    This view provides the authoritative Dashboard for processing 
    partner fund withdrawals. It orchestrates the lifecycle of payout 
    requests (pending, approved, rejected), integrates destination bank 
    intelligence, and facilitates secure fiscal settlements with 
    marketplace partners while maintaining a rigorous audit log.
    
    @extends adminlte::page
    @context Financial Management
    @variables Collection $withdrawals Collection of Withdrawal model instances.
    @variables String $filter_status The active lifecycle filter status.
--}}
@extends('adminlte::page')

@section('title', __('Payout Management'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-hand-holding-usd mr-2 text-primary"></i> {{ __('Payout Management') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Review and process fund withdrawal requests from marketplace partners.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <span class="badge badge-primary-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase shadow-xs">
                    <i class="fas fa-clock mr-1"></i> {{ $withdrawals->total() }} {{ __('REQUESTS QUEUED') }}
                </span>
            </div>
        </div>
    </div>
@stop

@push('css')
    @include('admin._partials._toggle-card-css')
    <style>
        #withdrawals-table {
            table-layout: fixed;
            width: 100% !important;
        }

        #withdrawals-table th,
        #withdrawals-table td {
            overflow-wrap: anywhere;
            white-space: normal;
            word-break: normal;
        }

        #withdrawals-table .withdrawal-partner,
        #withdrawals-table .withdrawal-destination,
        #withdrawals-table .withdrawal-wallet-card {
            min-width: 0;
        }

        #withdrawals-table .withdrawal-wallet-card .d-flex {
            gap: 0.5rem;
        }

        #withdrawals-table .withdrawal-wallet-card span:last-child {
            flex-shrink: 0;
        }

        #withdrawals-table .withdrawal-method,
        #withdrawals-table .withdrawal-date,
        #withdrawals-table .withdrawal-status,
        #withdrawals-table .withdrawal-actions {
            white-space: nowrap;
        }

        #withdrawals-table .withdrawal-actions .btn-group {
            flex-wrap: nowrap;
        }

        @media (max-width: 1199.98px) {
            #withdrawals-table {
                min-width: 980px;
            }
        }
    </style>
@endpush

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert') 

    {{-- Payout Lifecycle + Partner Filter --}}
    @include('admin.withdrawals._filter')

    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-receipt mr-2 text-primary"></i> {{ __(ucfirst($filter_status)) }} {{ __('All Requests') }}
            </h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="withdrawals-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": true, "searching": true, "ordering": true, "info": true, "order": [[3, "desc"]], "dom": "tr"}'>
                    <colgroup>
                        <col style="width: 22%;">
                        <col style="width: 22%;">
                        <col style="width: 10%;">
                        <col style="width: 12%;">
                        <col style="width: 14%;">
                        <col style="width: 10%;">
                    </colgroup>
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4">{{ __('Partner') }}</th>
                            <th class="text-right">{{ __('Settlement Value') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th>{{ __('Date') }}</th>
                            <th class="text-right pr-4">{{ __('Operations') }}</th>
                            <th>{{ __('Details') }}</th>
                        </tr>
                    </thead>

                    <tbody>
                        @forelse ($withdrawals as $withdrawal)
                            @php
                                $walletBalance = $withdrawal->user?->wallet_balance ?? 0;
                                $pendingForPartner = $withdrawal->user
                                    ? $withdrawal->user->withdrawals()->where('status', \App\Models\Withdrawal::STATUS_PENDING)->sum('amount') / 100
                                    : 0;
                                $remainingAfterQueue = $walletBalance - $pendingForPartner;
                            @endphp
                            <tr>
                                <td class="align-middle pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="mr-3">
                                            @if ($withdrawal->user && $withdrawal->user->avatar_url)
                                                <img src="{{ $withdrawal->user->avatar_url }}" alt="{{ $withdrawal->user->name }}" class="rounded-circle shadow-xs border" style="width: 38px; height: 38px; object-fit: cover;">
                                            @else
                                                <div class="icon-box-soft bg-primary-soft text-primary shadow-xs icon-box-38 rounded-10 d-flex align-items-center justify-content-center">
                                                    <span class="smallest font-weight-bold">{{ strtoupper(substr($withdrawal->user->name ?? '?', 0, 1)) }}</span>
                                                </div>
                                            @endif
                                        </div>
                                        <div class="withdrawal-partner">
                                            <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1 text-truncate">{{ $withdrawal->user->name ?? __('N/A (Deleted)') }}</span>
                                            <small class="text-muted text-monospace smallest smallest-0-7">{{ __('ACCOUNT') }} #{{ $withdrawal->user_id }}</small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle text-right">
                                    <div class="text-dark font-weight-bold">
                                        <span class="smallest font-weight-normal opacity-50 mr-1">$</span>{{ number_format($withdrawal->amount_dollars, 2) }}
                                    </div>
                                    <div class="smallest text-muted mt-1 withdrawal-method">
                                        <i class="fas fa-university mr-1 opacity-50"></i>
                                        <span class="font-weight-bold uppercase letter-spacing-1">{{ __('Protocol') }}:</span>
                                        {{ Str::limit($withdrawal->method ?? __('Other'), 28) }}
                                    </div>
                                    <div class="mt-2 p-2 rounded-lg bg-light border text-left withdrawal-wallet-card">
                                        <div class="d-flex justify-content-between smallest font-weight-bold text-muted uppercase letter-spacing-1">
                                            <span>{{ __('Wallet') }}</span>
                                            <span class="text-dark">${{ number_format($walletBalance, 2) }}</span>
                                        </div>
                                        <div class="d-flex justify-content-between smallest font-weight-bold text-muted uppercase letter-spacing-1 mt-1">
                                            <span>{{ __('Pending Queue') }}</span>
                                            <span class="{{ $pendingForPartner > $walletBalance ? 'text-danger' : 'text-primary' }}">${{ number_format($pendingForPartner, 2) }}</span>
                                        </div>
                                        <div class="d-flex justify-content-between smallest font-weight-bold text-muted uppercase letter-spacing-1 mt-1">
                                            <span>{{ __('After Queue') }}</span>
                                            <span class="{{ $remainingAfterQueue < 0 ? 'text-danger' : 'text-success' }}">${{ number_format($remainingAfterQueue, 2) }}</span>
                                        </div>
                                    </div>
                                </td>
                                
                                <td class="text-center align-middle withdrawal-status">
                                    @php $status = $withdrawal->getStatusMeta(); @endphp
                                    <span class="badge badge-{{ $status['color'] }}-light text-{{ $status['color'] }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs min-w-90">
                                        {{ $status['label'] }}
                                    </span>
                                </td>

                                <td class="align-middle withdrawal-date">
                                    <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1 mb-1">
                                        {{ $withdrawal->created_at->format('M d, Y') }}
                                    </div>
                                    <div class="smallest text-muted uppercase letter-spacing-1">
                                        <i class="far fa-clock mr-1 opacity-50"></i>{{ $withdrawal->created_at->format('H:i') }}
                                    </div>
                                </td>

                                <td class="text-right align-middle pr-4 withdrawal-actions">
                                    @if ($withdrawal->status === 'pending')
                                        <div class="btn-group btn-group-premium">
                                             <form id="approve-form-{{ $withdrawal->id }}" action="{{ route('admin.withdrawals.approve', $withdrawal) }}" method="POST" class="m-0">
                                                 @csrf
                                                 <button type="button" class="btn text-success" 
                                                         title="{{ __('Approve Payout') }}" 
                                                         data-action="confirm-trigger"
                                                         data-confirm-title="{{ __('Approve Payout?') }}"
                                                         data-confirm-text="{{ __('Confirming this will process $:amount. Current wallet balance: $:balance. Pending payout queue for this partner: $:pending.', ['amount' => number_format($withdrawal->amount_dollars, 2), 'balance' => number_format($walletBalance, 2), 'pending' => number_format($pendingForPartner, 2)]) }}"
                                                         data-confirm-button="{{ __('Approve Now') }}">
                                                     <i class="fas fa-check"></i>
                                                 </button>
                                             </form>
                                             <button type="button" class="btn text-danger" 
                                                     title="{{ __('Reject') }}" 
                                                     data-toggle="modal" 
                                                     data-target="#rejectModal" 
                                                     data-withdrawal-route="{{ route('admin.withdrawals.reject', $withdrawal) }}">
                                                 <i class="fas fa-times"></i>
                                             </button>
                                         </div>
                                    @else
                                        <span class="badge badge-secondary-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-archive mr-1 opacity-50"></i> {{ __('ARCHIVED') }}
                                        </span>
                                    @endif
                                </td>

                                <td class="align-middle">
                                    <a href="{{ route('admin.withdrawals.show', $withdrawal) }}" class="btn btn-light btn-sm rounded-pill font-weight-bold smallest uppercase letter-spacing-1 text-primary border">
                                        <i class="fas fa-file-invoice-dollar mr-1"></i> {{ __('View Details') }}
                                    </a>
                                </td>

                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 6,
                                'icon' => 'fas fa-file-invoice-dollar',
                                'title' => __('Zero Requests Found'),
                                'description' => __('New payouts in the ":status" queue will appear here once requested by marketplace partners.', ['status' => __($filter_status)]),
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if(method_exists($withdrawals, 'hasPages') && $withdrawals->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying :first - :last of :total records', ['first' => $withdrawals->firstItem(), 'last' => $withdrawals->lastItem(), 'total' => $withdrawals->total()]) }}</div>
                <div>{{ $withdrawals->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
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
            <form id="rejectForm" method="POST">
                @csrf
                <div class="modal-body p-4">
                    <div class="d-flex align-items-center p-3 mb-4 rounded-xl shadow-xs bg-danger-soft-alt border-danger-soft-alt">
                        <div class="icon-box-soft bg-white text-danger mr-3 shadow-xs icon-box-40 rounded-10 d-flex align-items-center justify-content-center">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <p class="mb-0 text-danger smallest font-weight-bold uppercase letter-spacing-1">
                            {{ __('Refunds full balance back to the partner.') }}
                        </p>
                    </div>
                    <div class="form-group mb-0">
                        <label class="small text-muted font-weight-bold text-uppercase mb-2 letter-spacing-1">{{ __('Internal Rejection Reason') }} <span class="text-danger">*</span></label>
                        <textarea name="admin_note" id="admin_note" rows="4" class="form-control form-control-premium" 
                                  placeholder="{{ __('Provide clarity for the partner (e.g., Invalid bank details)...') }}" required></textarea> 
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
    <script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
    <script src="{{ asset('admin-assets/pages/withdrawals-index.js') }}"></script>
@endsection
