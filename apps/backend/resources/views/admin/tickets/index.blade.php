@extends('adminlte::page')

@section('title', 'Support Tickets | Admin Ops')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row align-items-center mb-4">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold d-inline-block">
                    <i class="fas fa-ticket-alt mr-2 text-primary opacity-50"></i> 
                    Customer Support Queue
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Monitor user inquiries, resolve platform issues, and manage ticket priority.
                </p>
            </div>
            <div class="col-sm-5 d-flex flex-column align-items-end justify-content-center">
                <ol class="breadcrumb bg-transparent p-0 mb-0 smallest font-weight-bold text-uppercase letter-spacing-1">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}" class="text-primary">Dashboard</a></li>
                    <li class="breadcrumb-item active text-muted">Support</li>
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
            <div class="card border-0 shadow-premium" style="border-radius: 20px;">
                <div class="card-body p-2 d-flex align-items-center">
                    <span class="text-muted smallest font-weight-bold ml-3 mr-3 text-uppercase letter-spacing-1">
                        <i class="fas fa-filter mr-1 text-primary"></i> Filter By Status:
                    </span>
                    <ul class="nav nav-pills p-1 bg-light rounded-pill">
                        <li class="nav-item">
                            <a class="nav-link {{ $status === 'open' ? 'active bg-success shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                               href="{{ route('admin.tickets.index', ['status' => 'open']) }}">
                               <i class="fas fa-envelope-open mr-2"></i> OPEN QUEUE
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $status === 'in-progress' ? 'active bg-info shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                               href="{{ route('admin.tickets.index', ['status' => 'in-progress']) }}">
                               <i class="fas fa-spinner mr-2"></i> IN RESOLUTION
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $status === 'closed' ? 'active bg-dark shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                               href="{{ route('admin.tickets.index', ['status' => 'closed']) }}">
                               <i class="fas fa-archive mr-2"></i> ARCHIVE
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    </div>

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0" style="letter-spacing: 1px;">
                Active Support Queue
            </h3>
            <div class="card-tools">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-headset mr-1"></i> {{ $tickets->total() }} REQUESTS FOUND
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
            <div id="bulk-actions-container" class="d-none animate__animated animate__fadeIn">
                <div class="dropdown d-inline-block">
                    <button class="btn btn-primary btn-sm dropdown-toggle rounded-pill px-4 shadow-sm font-weight-bold" type="button" data-toggle="dropdown">
                        <i class="fas fa-tasks mr-1"></i> BULK ACTIONS (<span id="selected-count">0</span>)
                    </button>
                    <div class="dropdown-menu dropdown-menu-right shadow-lg border-0" style="border-radius: 12px; min-width: 200px;">
                        <h6 class="dropdown-header text-uppercase smallest letter-spacing-1">Update Status</h6>
                        <a class="dropdown-item py-2 smallest font-weight-bold" href="#" onclick="handleBulkUpdate('status', 'open')"><i class="fas fa-envelope-open mr-2 text-success"></i> Mark as Open</a>
                        <a class="dropdown-item py-2 smallest font-weight-bold" href="#" onclick="handleBulkUpdate('status', 'in-progress')"><i class="fas fa-spinner mr-2 text-info"></i> Mark In-Progress</a>
                        <a class="dropdown-item py-2 smallest font-weight-bold" href="#" onclick="handleBulkUpdate('status', 'closed')"><i class="fas fa-archive mr-2 text-dark"></i> Mark as Closed</a>
                        <div class="dropdown-divider"></div>
                        <h6 class="dropdown-header text-uppercase smallest letter-spacing-1">Change Priority</h6>
                        <a class="dropdown-item py-2 smallest font-weight-bold text-danger" href="#" onclick="handleBulkUpdate('priority', 'urgent')"><i class="fas fa-fire mr-2"></i> Set Urgent</a>
                        <a class="dropdown-item py-2 smallest font-weight-bold text-warning" href="#" onclick="handleBulkUpdate('priority', 'high')"><i class="fas fa-bolt mr-2"></i> Set High</a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                <form id="bulk-action-form" action="{{ route('admin.tickets.bulk-update') }}" method="POST">
                    @csrf
                    <input type="hidden" name="type" id="bulk-type-input">
                    <input type="hidden" name="value" id="bulk-value-input">
                    <table id="tickets-table" class="table table-hover table-premium mb-0">
                        <thead class="bg-light text-uppercase smallest font-weight-bold">
                            <tr>
                                <th class="text-center py-3 border-0" style="width: 50px">
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" id="selectAll">
                                        <label class="custom-control-label" for="selectAll"></label>
                                    </div>
                                </th>
                                <th class="py-3 border-0">Subject & Identification</th>
                                <th class="py-3 border-0">User Profile</th>
                                <th class="py-3 border-0">Status & Priority</th>
                                <th class="py-3 border-0">Age</th>
                                <th class="text-right pr-4 py-3 border-0">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($tickets as $ticket)
                            <tr>
                                <td class="text-center align-middle py-4">
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" name="ids[]" value="{{ $ticket->id }}" class="custom-control-input ticket-checkbox" id="check-{{ $ticket->id }}">
                                        <label class="custom-control-label" for="check-{{ $ticket->id }}"></label>
                                    </div>
                                </td>
                                <td class="align-middle py-4">
                                    <a href="{{ route('admin.tickets.show', $ticket->id) }}" class="font-weight-bold text-dark d-block mb-1" style="font-size: 0.95rem;">
                                        {{ $ticket->title }}
                                    </a>
                                    <div class="d-flex align-items-center">
                                        <span class="badge badge-light border text-muted smallest px-2 mr-2" style="font-weight: 500;">ID: #{{ $ticket->id }}</span>
                                        <p class="text-muted smallest mb-0 text-truncate" style="max-width: 300px; opacity: 0.7;">{{ $ticket->description }}</p>
                                    </div>
                                </td>
                                <td class="align-middle py-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-circle bg-light border text-muted mr-3 shadow-xs" style="width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-user-circle"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark smallest">{{ $ticket->user->name ?? 'Guest User' }}</span>
                                            <span class="text-muted smallest">{{ $ticket->user->email ?? 'Direct Submission' }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle py-4">
                                    @php
                                        $statusColor = match($ticket->status) {
                                            'open' => 'success',
                                            'in-progress' => 'info',
                                            'closed' => 'dark',
                                            default => 'warning'
                                        };
                                        $priorityColor = match($ticket->priority) {
                                            'urgent' => 'danger',
                                            'high' => 'warning',
                                            'medium' => 'primary',
                                            default => 'secondary'
                                        };
                                    @endphp
                                    <span class="badge badge-{{ $statusColor }}-light text-{{ $statusColor }} px-3 py-1 smallest font-weight-bold mb-1 rounded-pill">{{ strtoupper($ticket->status) }}</span>
                                    <br>
                                    <span class="text-{{ $priorityColor }} font-weight-bold text-uppercase" style="font-size: 0.65rem; letter-spacing: 0.5px;">
                                        <i class="fas fa-bolt mr-1"></i> {{ $ticket->priority }} Priority
                                    </span>
                                </td>
                                <td class="align-middle py-4">
                                    <div class="font-weight-600 text-dark smallest">{{ $ticket->created_at->diffForHumans(null, true) }} ago</div>
                                    <small class="text-muted smallest">{{ $ticket->created_at->format('M d, Y') }}</small>
                                </td>
                                <td class="text-right align-middle pr-4 py-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.tickets.show', $ticket->id) }}" class="btn btn-white btn-sm text-primary py-2 px-3 border-right" data-toggle="tooltip" title="Open Ticket">
                                            <i class="fas fa-envelope-open-text"></i>
                                        </a>
                                        <form action="{{ route('admin.tickets.destroy', $ticket->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" data-toggle="tooltip" title="Purge Ticket" onclick="return confirm('Permanently delete ticket?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="6" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-inbox fa-3x text-light mb-3"></i>
                                        <p class="text-muted font-weight-bold mb-0">No active tickets found for this queue.</p>
                                    </div>
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </form>
            </div>

            @if($tickets->hasPages())
                <div class="card-footer bg-white py-4 border-top">
                    {{ $tickets->appends(['status' => $status])->links() }}
                </div>
            @endif
        </div>
    </div>
</div>
@stop

@push('css')
@include('admin._partials._toggle-card-css')
<style>
    .transition-all { transition: all 0.25s ease-in-out; }
    .nav-pills .nav-link:not(.active):hover { background: rgba(0,0,0,0.03); color: var(--primary) !important; }
    #tickets-table thead th { letter-spacing: 1px; color: #8898aa; }
    .btn-primary-soft { background: rgba(70, 165, 172, 0.1); color: #46a5ac; border: 1px solid rgba(70, 165, 172, 0.2); }
    .btn-primary-soft:hover { background: #46a5ac; color: #fff; }
</style>
@endpush

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        
        // DataTables Initialization
        if ($('#tickets-table tbody tr:not(.empty-state)').length > 0 && $('#tickets-table').find('i.fa-inbox').length === 0) {
            $('#tickets-table').DataTable({
                "paging": false, 
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row pt-3"<"col-sm-12"f>>t',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search within this queue..."
                },
                "columnDefs": [
                    { "orderable": false, "targets": 0 }
                ]
            });
            $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light mb-3').css('width', '250px');
        }

        // Bulk Selection Logic
        const $selectAll = $('#selectAll');
        const $ticketCheckboxes = $('.ticket-checkbox');
        const $bulkContainer = $('#bulk-actions-container');
        const $selectedCount = $('#selected-count');

        function updateBulkUI() {
            const checkedCount = $('.ticket-checkbox:checked').length;
            if (checkedCount > 0) {
                $bulkContainer.removeClass('d-none');
                $selectedCount.text(checkedCount);
            } else {
                $bulkContainer.addClass('d-none');
            }
        }

        $selectAll.on('change', function() {
            $('.ticket-checkbox').prop('checked', this.checked);
            updateBulkUI();
        });

        $(document).on('change', '.ticket-checkbox', function() {
            if (!this.checked) $selectAll.prop('checked', false);
            if ($('.ticket-checkbox:checked').length === $('.ticket-checkbox').length) $selectAll.prop('checked', true);
            updateBulkUI();
        });

        // Handle Bulk Update
        window.handleBulkUpdate = function(type, value) {
            Swal.fire({
                title: 'Mass update ' + $('.ticket-checkbox:checked').length + ' tickets?',
                text: "Updating " + type + " to " + value.toUpperCase(),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'var(--primary)',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirm Update'
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#bulk-type-input').val(type);
                    $('#bulk-value-input').val(value);
                    $('#bulk-action-form').submit();
                }
            });
        };
    });
</script>
@stop
