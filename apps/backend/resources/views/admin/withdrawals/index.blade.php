{{--
    Administrative Financial Module: Payout Management Registry
    
    This view provides the authoritative command center for processing 
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
@endpush

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert') 

    {{-- Premium Status Filter --}}
    <div class="card registry-card-premium registry-filter-card mb-4">
        <div class="card-body">
            <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
                <div class="d-flex flex-column flex-md-row align-items-center mb-3 mb-md-0">
                    <span class="form-label-premium mb-3 mb-md-0 mr-md-3 text-center text-md-left">
                        <i class="fas fa-filter mr-1 text-primary opacity-75"></i> {{ __('Lifecycle:') }}
                    </span>
                    <ul class="nav nav-pills nav-pills-premium flex-wrap justify-content-center">
                        <li class="nav-item">
                            <a class="nav-link {{ $filter_status === 'all' ? 'active' : '' }}" 
                               href="{{ route('admin.withdrawals.index') }}">
                               {{ __('ALL') }}
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $filter_status === 'pending' ? 'active' : '' }}" 
                               href="{{ route('admin.withdrawals.index', ['status' => 'pending']) }}">
                               {{ __('PENDING') }}
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $filter_status === 'approved' ? 'active' : '' }}" 
                               href="{{ route('admin.withdrawals.index', ['status' => 'approved']) }}">
                               {{ __('APPROVED') }}
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $filter_status === 'rejected' ? 'active' : '' }}" 
                               href="{{ route('admin.withdrawals.index', ['status' => 'rejected']) }}">
                               {{ __('REJECTED') }}
                            </a>
                        </li>
                    </ul>
                </div>
                
                <div class="w-100 w-md-auto d-flex align-items-center">
                    <div class="input-group input-group-premium w-100 col-media-280-md">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                        </div>
                        <input type="text" id="custom-search" class="form-control" placeholder="{{ __('Search Intelligence...') }}">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-receipt mr-2 text-primary"></i> {{ __(ucfirst($filter_status)) }} {{ __('Requests Registry') }}
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
                       data-datatable-config='{"paging": true, "searching": true, "ordering": true, "info": true, "order": [[5, "desc"]], "dom": "tr"}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4">{{ __('Partner Intelligence') }}</th>
                            <th class="text-right">{{ __('Settlement Value') }}</th>
                            <th>{{ __('Protocol') }}</th>
                            <th class="w-25-p">{{ __('Destination Data') }}</th>
                            <th class="text-center">{{ __('Lifecycle') }}</th>
                            <th>{{ __('Temporal Data') }}</th>
                            <th class="text-right pr-4">{{ __('Operations') }}</th>
                        </tr>
                    </thead>

                    <tbody>
                        @forelse ($withdrawals as $withdrawal)
                            <tr>
                                <td class="align-middle pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-primary-soft text-primary mr-3 shadow-xs icon-box-38 rounded-10 d-flex align-items-center justify-content-center">
                                            <span class="smallest font-weight-bold">{{ strtoupper(substr($withdrawal->user->name ?? '?', 0, 1)) }}</span>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $withdrawal->user->name ?? __('N/A (Deleted)') }}</span>
                                            <small class="text-muted text-monospace smallest smallest-0-7">{{ __('ACCOUNT') }} #{{ $withdrawal->user_id }}</small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle text-right">
                                    <div class="text-dark font-weight-bold">
                                        <span class="smallest font-weight-normal opacity-50 mr-1">$</span>{{ number_format($withdrawal->amount_dollars, 2) }}
                                    </div>
                                </td>
                                
                                <td class="align-middle">
                                    <span class="smallest font-weight-bold uppercase letter-spacing-1 text-muted">
                                        <i class="fas fa-university mr-1 opacity-50"></i> {{ $withdrawal->method ?? __('OTHER') }}
                                    </span>
                                </td>

                                <td class="align-middle">
                                    <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1 leading-1-5">
                                        {{ $withdrawal->details ?: '—' }}
                                    </div>
                                    @if ($withdrawal->admin_note)
                                        <div class="mt-2">
                                            <div class="badge badge-danger-light text-danger smallest p-2 border-left-premium-danger note-badge-premium">
                                                <i class="fas fa-info-circle mr-1"></i> <strong>{{ __('NOTE:') }}</strong> {{ $withdrawal->admin_note }}
                                            </div>
                                        </div>
                                    @endif
                                </td>

                                <td class="text-center align-middle">
                                    @php $status = $withdrawal->getStatusMeta(); @endphp
                                    <span class="badge badge-{{ $status['color'] }}-light text-{{ $status['color'] }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs min-w-90">
                                        {{ $status['label'] }}
                                    </span>
                                </td>

                                <td class="align-middle">
                                    <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1 mb-1">
                                        {{ $withdrawal->created_at->format('M d, Y') }}
                                    </div>
                                    <div class="smallest text-muted uppercase letter-spacing-1">
                                        <i class="far fa-clock mr-1 opacity-50"></i>{{ $withdrawal->created_at->format('H:i') }}
                                    </div>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    @if ($withdrawal->status === 'pending')
                                        <div class="btn-group btn-group-premium">
                                             <form id="approve-form-{{ $withdrawal->id }}" action="{{ route('admin.withdrawals.approve', $withdrawal) }}" method="POST" class="m-0">
                                                 @csrf
                                                 <button type="button" class="btn text-success" 
                                                         title="{{ __('Approve Payout') }}" 
                                                         data-action="confirm-trigger"
                                                         data-confirm-title="{{ __('Approve Payout?') }}"
                                                         data-confirm-text="{{ __('Confirming this will process the settlement of $:amount to the partner.', ['amount' => number_format($withdrawal->amount_dollars, 2)]) }}"
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
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 7,
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
