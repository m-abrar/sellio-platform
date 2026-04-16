@extends('adminlte::page')

@section('title', 'Withdrawals: ' . ucfirst($filter_status))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-hand-holding-usd mr-2 text-primary"></i> Payout Requests
                    <small class="text-muted text-sm ml-2 font-weight-normal">({{ ucfirst($filter_status) }})</small>
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Withdrawals</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert') 

    <div class="row mb-3">
        <div class="col-12">
            <div class="bg-white rounded shadow-sm p-2 d-flex align-items-center" style="gap: 10px; width: fit-content; border: 1px solid #e9ecef;">
                <span class="text-muted font-weight-bold ml-2 mr-1"><i class="fas fa-filter mr-1 text-primary"></i> {{ __('Status') }}:</span>
                <ul class="nav nav-pills">
                    <li class="nav-item">
                        <a class="nav-link {{ $filter_status === 'pending' ? 'active bg-warning font-weight-bold' : 'text-secondary' }} px-3 py-1 text-sm mr-1" 
                           href="{{ route('admin.withdrawals.index', ['status' => 'pending']) }}">
                           {{ __('Pending') }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $filter_status === 'approved' ? 'active bg-success font-weight-bold' : 'text-secondary' }} px-3 py-1 text-sm mr-1" 
                           href="{{ route('admin.withdrawals.index', ['status' => 'approved']) }}">
                           {{ __('Approved') }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $filter_status === 'rejected' ? 'active bg-danger font-weight-bold' : 'text-secondary' }} px-3 py-1 text-sm" 
                           href="{{ route('admin.withdrawals.index', ['status' => 'rejected']) }}">
                           {{ __('Rejected') }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">
                <i class="fas fa-stream mr-1"></i> {{ ucfirst($filter_status) }} Queue
            </h3>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="withdrawals-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4">User Details</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th style="width: 25%;">Transfer Details</th>
                            <th class="text-center">Status</th>
                            <th>Date Requested</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        @forelse ($withdrawals as $withdrawal)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        <div class="bg-light rounded-circle d-flex align-items-center justify-content-center mr-3 border shadow-xs" style="width:38px; height:38px;">
                                            <i class="fas fa-user text-primary text-xs"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $withdrawal->user->name ?? 'N/A (Deleted)' }}</span>
                                            <small class="text-muted text-monospace" style="font-size: 0.7rem;">UID: #{{ $withdrawal->user_id }}</small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="text-lg font-weight-bold text-dark">
                                        <span class="text-xs font-weight-normal opacity-7 mr-1">$</span>{{ number_format($withdrawal->amount_dollars, 2) }}
                                    </div>
                                </td>
                                
                                <td class="align-middle">
                                    <span class="badge badge-light border px-2 py-1 font-weight-normal">
                                        <i class="fas fa-university mr-1 text-muted text-xs"></i> {{ ucfirst($withdrawal->method ?? 'Other') }}
                                    </span>
                                </td>

                                <td class="align-middle">
                                    <div class="small text-dark font-weight-500" style="line-height: 1.4;">
                                        {{ $withdrawal->details ?: '—' }}
                                    </div>
                                    @if ($withdrawal->admin_note)
                                        <div class="mt-2">
                                            <div class="badge badge-danger-light text-danger text-xs p-2 border-left" style="border-left-width: 3px !important; white-space: normal; text-align: left;">
                                                <i class="fas fa-comment-dots mr-1"></i> <strong>Admin Note:</strong> {{ $withdrawal->admin_note }}
                                            </div>
                                        </div>
                                    @endif
                                </td>

                                <td class="text-center align-middle">
                                    @php
                                        $statusClass = match($withdrawal->status) {
                                            'pending' => 'warning',
                                            'approved' => 'success',
                                            'rejected' => 'danger',
                                            default => 'secondary'
                                        };
                                    @endphp
                                    <span class="badge badge-{{ $statusClass }}-light px-3 py-1 shadow-xs text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                        {{ $withdrawal->status }}
                                    </span>
                                    @if($withdrawal->status !== 'pending')
                                        <div class="text-xs text-muted mt-1 opacity-7">
                                            {{ ($withdrawal->approved_at ?? $withdrawal->rejected_at)?->format('d M, Y') }}
                                        </div>
                                    @endif
                                </td>

                                <td class="align-middle">
                                    <div class="text-dark font-weight-600 mb-0" style="font-size: 0.9rem;">
                                        {{ $withdrawal->created_at->format('M d, Y') }}
                                    </div>
                                    <div class="text-muted small">
                                        <i class="far fa-clock mr-1 text-xs"></i>{{ $withdrawal->created_at->format('H:i') }}
                                    </div>
                                </td>

                                <td class="text-right align-middle px-4">
                                    @if ($withdrawal->status === 'pending')
                                        <div class="btn-group">
                                            <form action="{{ route('admin.withdrawals.approve', $withdrawal) }}" method="POST" class="m-0">
                                                @csrf
                                                <button type="submit" class="btn btn-success btn-xs px-2" 
                                                        title="{{ __('Approve') }}" 
                                                        style="border-top-right-radius: 0; border-bottom-right-radius: 0; height: 30px"
                                                        onclick="return confirm('Are you sure you want to approve this withdrawal of ${{ number_format($withdrawal->amount_dollars, 2) }}?')">
                                                    <i class="fas fa-check mr-1"></i> {{ __('Approve') }}
                                                </button>
                                            </form>

                                            <button type="button" class="btn btn-danger btn-xs px-2" 
                                                    title="{{ __('Reject') }}" 
                                                    style="border-top-left-radius: 0; border-bottom-left-radius: 0; height: 30px"
                                                    data-toggle="modal" 
                                                    data-target="#rejectModal" 
                                                    data-withdrawal-route="{{ route('admin.withdrawals.reject', $withdrawal) }}">
                                                <i class="fas fa-times mr-1"></i> {{ __('Reject') }}
                                            </button>
                                        </div>
                                    @else
                                        <span class="badge badge-light border text-muted px-3 py-1">
                                            <i class="fas fa-lock mr-1 opacity-5"></i> Archived
                                        </span>
                                    @endif
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="7" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-inbox fa-3x text-muted opacity-3 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No {{ $filter_status }} requests found</h5>
                                        <p class="small text-secondary">New payout requests will appear here for review.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($withdrawals->hasPages())
            <div class="card-footer bg-white border-0 py-3">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted small font-weight-600">
                        Showing page {{ $withdrawals->currentPage() }} of {{ $withdrawals->lastPage() }}
                    </span>
                    <div>
                        {{ $withdrawals->appends(request()->except('page'))->links('pagination::bootstrap-4') }}
                    </div>
                </div>
            </div>
        @endif
    </div>
</div>

{{-- REJECT MODAL --}}
<div class="modal fade" id="rejectModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-danger text-white border-0">
                <h5 class="modal-title font-weight-bold"><i class="fas fa-ban mr-2"></i> Reject Payout</h5>
                <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="rejectForm" method="POST">
                @csrf
                <div class="modal-body py-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="bg-danger-light rounded-circle p-3 mr-3 text-danger">
                            <i class="fas fa-exclamation-triangle fa-lg"></i>
                        </div>
                        <p class="mb-0 text-muted small">
                            Rejecting this request will automatically refund the <strong>full amount</strong> back to the user's wallet.
                        </p>
                    </div>
                    <div class="form-group">
                        <label class="small text-muted font-weight-bold uppercase mb-2">Rejection Reason <span class="text-danger">*</span></label>
                        <textarea name="admin_note" id="admin_note" rows="4" class="form-control shadow-xs" 
                                  placeholder="e.g., Invalid bank details or suspicious activity..." required></textarea> 
                    </div>
                </div>
                <div class="modal-footer bg-light border-0">
                    <button type="button" class="btn btn-link text-muted font-weight-bold" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-danger px-4 font-weight-bold shadow-sm">Confirm Rejection</button>
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
                 $('#withdrawals-table').DataTable({
                     "paging": true,
                     "searching": true,
                     "ordering": true,
                     "info": true,
                     "autoWidth": false,
                     "responsive": true,
                     "order": [[5, "desc"]], // Date column
                     dom: '<"row px-4 pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                            '<"row"<"col-sm-12"tr>>' +
                            '<"row px-4 pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Search payouts...",
                        "paginate": {
                            "previous": "<i class='fas fa-angle-left'></i>",
                            "next": "<i class='fas fa-angle-right'></i>"
                        }
                    },
                    "columnDefs": [
                        { "orderable": false, "targets": [6] }
                    ]
                 });
                 $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '220px');
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
