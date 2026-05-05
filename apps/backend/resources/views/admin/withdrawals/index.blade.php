@extends('adminlte::page')

@section('title', 'Payout Management | Financials')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-hand-holding-usd mr-2 text-primary opacity-50"></i> Payout Management
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Review and process fund withdrawal requests from marketplace partners.</p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-end" style="gap: 12px;">
                <span class="badge badge-primary-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-clock mr-1"></i> {{ $withdrawals->total() }} REQUESTS QUEUED
                </span>
                <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                    <i class="fas fa-th-large"></i> Dashboard
                </a>
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
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <span class="form-label-premium mb-0 mr-3">
                        <i class="fas fa-filter mr-1 text-primary opacity-75"></i> Lifecycle:
                    </span>
                    <ul class="nav nav-pills nav-pills-premium">
                        <li class="nav-item">
                            <a class="nav-link {{ $filter_status === 'all' ? 'active' : '' }}" 
                               href="{{ route('admin.withdrawals.index') }}">
                               ALL
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $filter_status === 'pending' ? 'active' : '' }}" 
                               href="{{ route('admin.withdrawals.index', ['status' => 'pending']) }}">
                               PENDING
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $filter_status === 'approved' ? 'active' : '' }}" 
                               href="{{ route('admin.withdrawals.index', ['status' => 'approved']) }}">
                               APPROVED
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $filter_status === 'rejected' ? 'active' : '' }}" 
                               href="{{ route('admin.withdrawals.index', ['status' => 'rejected']) }}">
                               REJECTED
                            </a>
                        </li>
                    </ul>
                </div>
                
                <div class="ml-auto d-flex align-items-center pr-2">
                    <div class="input-group input-group-premium" style="width: 280px;">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                        </div>
                        <input type="text" id="custom-search" class="form-control" placeholder="Search Intelligence...">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-receipt mr-2 text-primary opacity-50"></i> {{ ucfirst($filter_status) }} Requests Registry
            </h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="withdrawals-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4">Partner Intelligence</th>
                            <th class="text-right">Settlement Value</th>
                            <th>Protocol</th>
                            <th style="width: 25%;">Destination Data</th>
                            <th class="text-center">Lifecycle</th>
                            <th>Temporal Data</th>
                            <th class="text-right pr-4">Operations</th>
                        </tr>
                    </thead>

                    <tbody>
                        @forelse ($withdrawals as $withdrawal)
                            <tr>
                                <td class="align-middle pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-primary-soft text-primary mr-3 shadow-xs" style="width:38px; height:38px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                                            <span class="smallest font-weight-bold">{{ strtoupper(substr($withdrawal->user->name ?? '?', 0, 1)) }}</span>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $withdrawal->user->name ?? 'N/A (Deleted)' }}</span>
                                            <small class="text-muted text-monospace smallest" style="font-size: 0.7rem;">ACCOUNT #{{ $withdrawal->user_id }}</small>
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
                                        <i class="fas fa-university mr-1 opacity-50"></i> {{ $withdrawal->method ?? 'OTHER' }}
                                    </span>
                                </td>

                                <td class="align-middle">
                                    <div class="smallest text-dark font-weight-bold uppercase letter-spacing-1" style="line-height: 1.5;">
                                        {{ $withdrawal->details ?: '—' }}
                                    </div>
                                    @if ($withdrawal->admin_note)
                                        <div class="mt-2">
                                            <div class="badge badge-danger-light text-danger smallest p-2 border-left" style="border-left: 3px solid var(--danger) !important; white-space: normal; text-align: left; border-radius: 4px 8px 8px 4px; letter-spacing: 0.5px;">
                                                <i class="fas fa-info-circle mr-1"></i> <strong>NOTE:</strong> {{ $withdrawal->admin_note }}
                                            </div>
                                        </div>
                                    @endif
                                </td>

                                <td class="text-center align-middle">
                                    @php
                                        $statusClass = match($withdrawal->status) {
                                            'pending' => 'badge-warning-light text-warning',
                                            'approved' => 'badge-success-light text-success',
                                            'rejected' => 'badge-danger-light text-danger',
                                            default => 'badge-secondary-light text-secondary'
                                        };
                                    @endphp
                                    <span class="badge {{ $statusClass }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs" style="min-width: 90px;">
                                        {{ $withdrawal->status }}
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
                                             <form action="{{ route('admin.withdrawals.approve', $withdrawal) }}" method="POST" class="m-0">
                                                 @csrf
                                                 <button type="submit" class="btn text-success" 
                                                         title="{{ __('Approve') }}" 
                                                         onclick="return confirm('Confirm payout of ${{ number_format($withdrawal->amount_dollars, 2) }}?')">
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
                                            <i class="fas fa-archive mr-1 opacity-50"></i> ARCHIVED
                                        </span>
                                    @endif
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="text-center py-5">
                                    <div class="py-5">
                                        <i class="fas fa-file-invoice-dollar fa-4x text-muted opacity-25 mb-4 d-block"></i>
                                        <h5 class="text-muted font-weight-bold smallest uppercase letter-spacing-1">Zero Requests Found</h5>
                                        <p class="small text-secondary">New payouts in the "{{ $filter_status }}" queue will appear here.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if(method_exists($withdrawals, 'hasPages') && $withdrawals->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">Displaying {{ $withdrawals->firstItem() }} - {{ $withdrawals->lastItem() }} of {{ $withdrawals->total() }} records</div>
                <div>{{ $withdrawals->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>

{{-- REJECT MODAL --}}
<div class="modal fade" id="rejectModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content border-0 shadow-premium" style="border-radius: 24px;">
            <div class="modal-header border-0 bg-white px-4 pt-4 pb-0">
                <h5 class="modal-title text-dark font-weight-bold smallest uppercase letter-spacing-1"><i class="fas fa-ban mr-2 text-danger"></i> Reject Payout Request</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="rejectForm" method="POST">
                @csrf
                <div class="modal-body p-4">
                    <div class="d-flex align-items-center p-3 mb-4 rounded-xl shadow-xs" style="background: #fff5f5; border: 1px solid #fed7d7;">
                        <div class="icon-box-soft bg-white text-danger mr-3 shadow-xs" style="min-width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <p class="mb-0 text-danger smallest font-weight-bold uppercase letter-spacing-1">
                            Refunds full balance back to the partner.
                        </p>
                    </div>
                    <div class="form-group mb-0">
                        <label class="small text-muted font-weight-bold text-uppercase mb-2 letter-spacing-1">Internal Rejection Reason <span class="text-danger">*</span></label>
                        <textarea name="admin_note" id="admin_note" rows="4" class="form-control form-control-premium" 
                                  placeholder="Provide clarity for the partner (e.g., Invalid bank details)..." required></textarea> 
                    </div>
                </div>
                <div class="modal-footer border-0 p-4 pt-0 d-flex" style="gap: 12px;">
                    <button type="button" class="btn btn-default shadow-xs rounded-pill px-4 py-2 flex-grow-1 font-weight-bold smallest uppercase" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-danger shadow-xs rounded-pill px-4 py-2 flex-grow-1 font-weight-bold smallest uppercase">Confirm Rejection</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@section('js')
    <script>
        $(document).ready(function () {
             if ($('#withdrawals-table tbody tr:not(.empty-state)').length > 0) {
                 var table = $('#withdrawals-table').DataTable({
                     "paging": true,
                     "searching": true,
                     "ordering": true,
                     "info": true,
                     "autoWidth": false,
                     "responsive": true,
                     "order": [[5, "desc"]],
                     "dom": "tr", // Remove default search/length controls for a cleaner look
                     "language": {
                         "emptyTable": "Zero requests detected in this queue."
                     },
                     "columnDefs": [
                         { "orderable": false, "targets": [6] }
                     ]
                 });

                 // Bind custom search field
                 $('#custom-search').on('keyup', function() {
                     table.search(this.value).draw();
                 });
             }

            $('#rejectModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                var route = button.data('withdrawal-route');
                $(this).find('#rejectForm').attr('action', route);
                $(this).find('#admin_note').val('');
            });
        });
    </script>
@endsection
