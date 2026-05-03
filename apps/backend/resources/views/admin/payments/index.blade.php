@extends('adminlte::page')

@section('title', 'Payments & Revenue')

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-wallet mr-2 text-primary"></i> Payments
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Payments</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        {{-- Premium Filter Card --}}
        <div class="card card-outline card-secondary shadow-sm mb-4">
            <div class="card-body py-4">
                <form method="GET" action="{{ route('admin.payments.index') }}">
                    <div class="row align-items-end">
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">User Search</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-white border-right-0"><i class="fas fa-search text-muted text-xs"></i></span>
                                </div>
                                <input type="text" name="user_name" class="form-control border-left-0" placeholder="Name or Email" value="{{ request('user_name') }}">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Status</label>
                            <select name="status" class="form-control select2 shadow-xs">
                                <option value="">All Statuses</option>
                                <option value="pending" {{ request('status') == 'pending' ? 'selected' : '' }}>Pending</option>
                                <option value="completed" {{ request('status') == 'completed' ? 'selected' : '' }}>Completed</option>
                                <option value="failed" {{ request('status') == 'failed' ? 'selected' : '' }}>Failed</option>
                                <option value="refunded" {{ request('status') == 'refunded' ? 'selected' : '' }}>Refunded</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Gateway</label>
                            <select name="method" class="form-control shadow-xs">
                                <option value="">All Methods</option>
                                <option value="stripe" {{ request('method') == 'stripe' ? 'selected' : '' }}>Stripe</option>
                                <option value="paypal" {{ request('method') == 'paypal' ? 'selected' : '' }}>PayPal</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <button type="submit" class="btn btn-primary btn-block font-weight-bold shadow-xs">
                                <i class="fas fa-filter mr-1"></i> APPLY FILTERS
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {{-- Payments Table Card --}}
        <div class="card card-primary card-outline shadow-sm border-0">
            <div class="card-header border-0 bg-white py-3">
                <h3 class="card-title font-weight-600 text-muted">
                    <i class="fas fa-list-ul mr-1 text-primary"></i> Transaction Ledger
                </h3>
                <div class="card-tools">
                    <a href="{{ route('admin.payments.create') }}" class="btn btn-primary btn-flat shadow-sm px-4 font-weight-bold">
                        <i class="fas fa-plus-circle mr-1"></i> Log Offline Payment
                    </a>
                </div>
            </div>
            
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="payments-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th>Client</th> 
                                <th>Purpose & Gateway</th> 
                                <th>Date / Time</th> 
                                <th class="text-right">Amount</th> 
                                <th class="text-center">Status</th> 
                                <th class="text-right px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($payments as $payment)
                                @php
                                    $statusClass = match ($payment->status) {
                                        'completed' => 'success',
                                        'failed'    => 'danger',
                                        'refunded'  => 'info', 
                                        default     => 'warning',
                                    };
                                @endphp
                                <tr>
                                    <td class="align-middle">
                                        @if($payment->user)
                                            <div class="d-flex align-items-center">
                                                <div class="avatar-sm mr-2 bg-light rounded-circle d-flex align-items-center justify-content-center border shadow-xs" style="width:34px; height:34px;">
                                                    <span class="text-xs font-weight-bold text-primary">{{ strtoupper(substr($payment->user->name, 0, 1)) }}</span>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $payment->user->name }}</span>
                                                    <small class="text-muted text-monospace" style="font-size: 0.75rem;">{{ $payment->user->email }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary-light border px-2">
                                                <i class="fas fa-user-slash mr-1"></i> Guest/Deleted
                                            </span>
                                        @endif
                                    </td>
                                    
                                    <td class="align-middle">
                                        <div class="font-weight-600 text-dark">
                                            @include('admin.payments.partials._payable_link', ['payable' => $payment->payable])
                                        </div>
                                        <div class="mt-1">
                                            @php
                                                $methodIcon = match($payment->payment_method) {
                                                    'stripe' => 'fab fa-cc-stripe text-indigo',
                                                    'paypal' => 'fab fa-paypal text-primary',
                                                    default  => 'fas fa-money-check text-muted'
                                                };
                                            @endphp
                                            <small class="badge badge-light border font-weight-normal text-muted px-2 py-1">
                                                <i class="{{ $methodIcon }} mr-1"></i> {{ ucwords($payment->payment_method) }}
                                            </small>
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <div class="text-dark font-weight-600 mb-0" style="font-size: 0.9rem;">
                                            {{ ($payment->paid_at ?? $payment->created_at)->format('M d, Y') }}
                                        </div>
                                        <div class="text-muted small">
                                            <i class="far fa-clock mr-1 text-xs"></i>{{ ($payment->paid_at ?? $payment->created_at)->format('g:i A') }}
                                        </div>
                                    </td>

                                    <td class="text-right align-middle">
                                        <div class="font-weight-bold text-lg {{ $payment->status == 'completed' ? 'text-success' : 'text-dark' }}">
                                            <span class="text-xs font-weight-normal opacity-7 mr-1">{{ strtoupper($payment->currency) }}</span>{{ number_format($payment->amount, 2) }}
                                        </div>
                                        <code class="text-xs bg-light px-1 rounded border shadow-xs text-muted" title="Gateway Reference">
                                            {{ $payment->transaction_id ?? '---' }}
                                        </code>
                                    </td>

                                    <td class="text-center align-middle">
                                        <span class="badge badge-{{ $statusClass }}-light px-3 py-1 shadow-xs text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                            {{ $payment->status }}
                                        </span>
                                    </td>
                                    
                                    <td class="text-right align-middle px-4">
                                        <div class="btn-group btn-group-premium shadow-sm">
                                            <a href="{{ route('admin.payments.edit', $payment->id) }}" 
                                               class="btn btn-default btn-sm text-warning" 
                                               data-toggle="tooltip" title="Modify Record">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <form action="{{ route('admin.payments.destroy', $payment->id) }}" method="POST" class="d-inline">
                                                @csrf @method('DELETE')
                                                <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                        data-toggle="tooltip" title="Delete Log"
                                                        onclick="return confirm('Delete this financial record?')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr class="empty-state">
                                    <td colspan="7" class="text-center py-5">
                                        <div class="py-4">
                                            <i class="fas fa-coins fa-3x text-muted opacity-3 mb-3 d-block"></i>
                                            <h5 class="text-muted font-weight-bold">No Payment Records Found</h5>
                                            <p class="small text-secondary">Try adjusting your filters to find specific transactions.</p>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if ($payments->lastPage() > 1)
                <div class="card-footer bg-white border-0 py-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-muted small font-weight-600">
                            Showing {{ $payments->firstItem() }} to {{ $payments->lastItem() }} of {{ $payments->total() }} records
                        </span>
                        <div>
                            {{ $payments->appends(request()->except('page'))->links('pagination::bootstrap-4') }}
                        </div>
                    </div>
                </div>
            @endif
        </div>
    </div>
@endsection

@section('js')
<script>
    $(function () {
        if ($('#payments-table tbody tr:not(.empty-state)').length > 0) {
            $('#payments-table').DataTable({
                "paging": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
                "order": [[3, "desc"]], // Date / Time column
                dom: '<"row pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                       '<"row"<"col-sm-12"tr>>' +
                       '<"row pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search ledger...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                },
                "columnDefs": [
                    { "orderable": false, "targets": [6] }
                ]
            });
            $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '250px');
        }
        $('[data-toggle="tooltip"]').tooltip();
        if ($('.select2').length) {
            $('.select2').select2({ theme: 'bootstrap4' });
        }
    });
</script>
@endsection
