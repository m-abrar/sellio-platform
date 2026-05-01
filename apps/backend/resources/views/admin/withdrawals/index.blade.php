@extends('adminlte::page')

@section('title', 'Payout Management | Financials')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-hand-holding-usd mr-2 text-primary"></i> Payout Management
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Review and process fund withdrawal requests from marketplace partners.</p>
            </div>
            <div class="col-sm-6 text-right">
                <ol class="breadcrumb float-sm-right bg-transparent p-0 mt-3">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Withdrawals</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert') 

    <div class="row mb-4">
        <div class="col-12">
            <div class="glass-card shadow-sm p-2 d-flex align-items-center bg-white" style="gap: 15px; width: fit-content; border-radius: 16px;">
                <span class="text-muted small font-weight-bold ml-3 mr-1"><i class="fas fa-filter mr-2 text-primary"></i> QUEUE STATUS:</span>
                <ul class="nav nav-pills">
                    <li class="nav-item">
                        <a class="nav-link px-4 py-1 small font-weight-bold {{ $filter_status === 'pending' ? 'active shadow-sm' : 'text-muted' }}" 
                           href="{{ route('admin.withdrawals.index', ['status' => 'pending']) }}" style="border-radius: 10px;">
                           {{ __('PENDING') }}
                        </a>
                    </li>
                    <li class="nav-item mx-1">
                        <a class="nav-link px-4 py-1 small font-weight-bold {{ $filter_status === 'approved' ? 'active shadow-sm' : 'text-muted' }}" 
                           href="{{ route('admin.withdrawals.index', ['status' => 'approved']) }}" style="border-radius: 10px;">
                           {{ __('APPROVED') }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link px-4 py-1 small font-weight-bold {{ $filter_status === 'rejected' ? 'active shadow-sm' : 'text-muted' }}" 
                           href="{{ route('admin.withdrawals.index', ['status' => 'rejected']) }}" style="border-radius: 10px;">
                           {{ __('REJECTED') }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4">
            <h3 class="card-title font-weight-bold text-dark mb-0">
                <i class="fas fa-stream mr-2 text-primary opacity-50"></i> {{ ucfirst($filter_status) }} Requests
            </h3>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="withdrawals-table" class="table table-hover table-premium mb-0">
                    <thead>
                        <tr>
                            <th class="px-4">PARTNER DETAILS</th>
                            <th>TOTAL AMOUNT</th>
                            <th>METHOD</th>
                            <th style="width: 25%;">DESTINATION DATA</th>
                            <th class="text-center">STATUS</th>
                            <th>SUBMISSION DATE</th>
                            <th class="text-right px-4">OPERATIONS</th>
                        </tr>
                    </thead>

                    <tbody>
                        @forelse ($withdrawals as $withdrawal)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-primary-soft text-primary mr-3 shadow-xs" style="width:42px; height:42px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-user text-sm"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $withdrawal->user->name ?? 'N/A (Deleted)' }}</span>
                                            <small class="text-muted font-weight-bold" style="font-size: 0.65rem; letter-spacing: 0.5px;">ACCOUNT #{{ $withdrawal->user_id }}</small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="text-dark font-weight-bold" style="font-size: 1.1rem;">
                                        <span class="text-primary mr-1" style="font-size: 0.8rem;">$</span>{{ number_format($withdrawal->amount_dollars, 2) }}
                                    </div>
                                </td>
                                
                                <td class="align-middle">
                                    <span class="badge badge-secondary-light text-muted px-2 py-1 font-weight-bold" style="font-size: 0.7rem;">
                                        <i class="fas fa-university mr-1 opacity-50"></i> {{ strtoupper($withdrawal->method ?? 'OTHER') }}
                                    </span>
                                </td>

                                <td class="align-middle">
                                    <div class="small text-dark font-weight-600" style="line-height: 1.5;">
                                        {{ $withdrawal->details ?: '—' }}
                                    </div>
                                    @if ($withdrawal->admin_note)
                                        <div class="mt-2">
                                            <div class="badge badge-danger-light text-danger text-xs p-2 border-left" style="border-left: 3px solid var(--danger) !important; white-space: normal; text-align: left; border-radius: 4px 8px 8px 4px;">
                                                <i class="fas fa-info-circle mr-1"></i> <strong>NOTE:</strong> {{ $withdrawal->admin_note }}
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
                                    <span class="badge badge-{{ $statusClass }}-light text-{{ $statusClass }} px-3 py-1 shadow-xs text-uppercase" style="font-size: 0.65rem; letter-spacing: 0.5px; border-radius: 20px;">
                                        <i class="fas fa-circle mr-1" style="font-size: 0.4rem; vertical-align: middle;"></i> {{ $withdrawal->status }}
                                    </span>
                                    @if($withdrawal->status !== 'pending')
                                        <div class="smallest text-muted mt-2 font-weight-bold">
                                            {{ ($withdrawal->approved_at ?? $withdrawal->rejected_at)?->format('M d, Y') }}
                                        </div>
                                    @endif
                                </td>

                                <td class="align-middle">
                                    <div class="text-dark font-weight-bold mb-0" style="font-size: 0.85rem;">
                                        {{ $withdrawal->created_at->format('M d, Y') }}
                                    </div>
                                    <div class="text-muted smallest font-weight-bold mt-1">
                                        <i class="far fa-clock mr-1 opacity-50"></i>{{ $withdrawal->created_at->format('H:i') }}
                                    </div>
                                </td>

                                <td class="text-right align-middle px-4">
                                    @if ($withdrawal->status === 'pending')
                                        <div class="btn-group shadow-sm" style="border-radius: 10px; overflow: hidden;">
                                            <form action="{{ route('admin.withdrawals.approve', $withdrawal) }}" method="POST" class="m-0">
                                                @csrf
                                                <button type="submit" class="btn btn-success btn-sm px-3 border-0" 
                                                        title="{{ __('Approve') }}" 
                                                        onclick="return confirm('Confirm payout of ${{ number_format($withdrawal->amount_dollars, 2) }}?')">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                            </form>

                                            <button type="button" class="btn btn-danger btn-sm px-3 border-0" 
                                                    title="{{ __('Reject') }}" 
                                                    data-toggle="modal" 
                                                    data-target="#rejectModal" 
                                                    data-withdrawal-route="{{ route('admin.withdrawals.reject', $withdrawal) }}">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    @else
                                        <span class="badge badge-light text-muted px-3 py-1 font-weight-bold" style="font-size: 0.65rem; border-radius: 20px; border: 1px solid #eee;">
                                            <i class="fas fa-archive mr-1 opacity-50"></i> ARCHIVED
                                        </span>
                                    @endif
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="text-center py-5">
                                    <div class="py-5">
                                        <i class="fas fa-file-invoice-dollar fa-4x text-muted opacity-25 mb-4"></i>
                                        <h5 class="text-muted font-weight-bold">Zero Requests Found</h5>
                                        <p class="small text-secondary">New payouts in the "{{ $filter_status }}" queue will appear here.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($withdrawals->hasPages())
            <div class="card-footer bg-white border-0 py-4 px-4">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted small font-weight-bold text-uppercase letter-spacing-1">
                        Registry: Page {{ $withdrawals->currentPage() }} of {{ $withdrawals->lastPage() }}
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
        <div class="modal-content">
            <div class="modal-header border-0 bg-danger px-4 py-4" style="border-radius: 24px 24px 0 0;">
                <h5 class="modal-title text-white font-weight-bold"><i class="fas fa-ban mr-2"></i> REJECT PAYOUT REQUEST</h5>
                <button type="button" class="close text-white opacity-100" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="rejectForm" method="POST">
                @csrf
                <div class="modal-body p-4">
                    <div class="d-flex align-items-center p-3 mb-4 rounded-xl" style="background: rgba(220,53,69,0.05); border: 1px solid rgba(220,53,69,0.1);">
                        <div class="icon-box-soft bg-white text-danger mr-3 shadow-xs" style="min-width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <p class="mb-0 text-dark small font-weight-500">
                            Rejecting this request will immediately refund the <strong>full balance</strong> back to the partner's account wallet.
                        </p>
                    </div>
                    <div class="form-group mb-0">
                        <label class="small text-muted font-weight-bold text-uppercase mb-2" style="letter-spacing: 1px;">Internal Rejection Reason <span class="text-danger">*</span></label>
                        <textarea name="admin_note" id="admin_note" rows="4" class="form-control" 
                                  placeholder="Provide clarity for the partner (e.g., Invalid bank details)..." required style="border-radius: 12px;"></textarea> 
                    </div>
                </div>
                <div class="modal-footer border-0 p-4 pt-0">
                    <button type="button" class="btn btn-light rounded-pill px-4 font-weight-bold mr-2" data-dismiss="modal">CANCEL</button>
                    <button type="submit" class="btn btn-danger rounded-pill px-4 font-weight-bold shadow-lg">CONFIRM REJECTION</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

@section('js')
    <script>
        $(document).ready(function () {
             if ($('#withdrawals-table tbody tr').length > 0) {
                 $('#withdrawals-table').DataTable({
                     "paging": false,
                     "searching": true,
                     "ordering": true,
                     "info": false,
                     "autoWidth": false,
                     "responsive": true,
                     "order": [[5, "desc"]],
                     dom: '<"row px-4 pt-4 pb-2"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                            '<"row"<"col-sm-12"tr>>',
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Search requests...",
                    },
                    "columnDefs": [
                        { "orderable": false, "targets": [6] }
                    ]
                 });
                 $('.dataTables_filter input').addClass('form-control shadow-xs').css({'width': '280px', 'border-radius': '10px'});
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
