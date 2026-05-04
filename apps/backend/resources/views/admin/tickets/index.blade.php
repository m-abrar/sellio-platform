@extends('adminlte::page')

@section('title', 'Support Tickets Management')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row align-items-center mb-4">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ticket-alt mr-2 text-primary opacity-50"></i> 
                    Customer Support Queue
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Monitor user inquiries, resolve platform issues, and manage ticket priority.
                </p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-end" style="gap: 12px;">
                <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                    <i class="fas fa-th-large"></i> Dashboard
                </a>

                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase shadow-sm">
                    <i class="fas fa-headset mr-1"></i> {{ $tickets->total() }} REQUESTS QUEUED
                </span>
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
                        <i class="fas fa-filter mr-1 text-primary"></i> Queue Filter:
                    </span>
                    <ul class="nav nav-pills p-1 bg-light rounded-pill">
                        <li class="nav-item">
                            <a class="nav-link {{ $status === 'open' ? 'active bg-primary shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                               href="{{ route('admin.tickets.index', ['status' => 'open']) }}">
                               {{ __('OPEN QUEUE') }}
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $status === 'in-progress' ? 'active bg-primary shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                               href="{{ route('admin.tickets.index', ['status' => 'in-progress']) }}">
                               {{ __('IN RESOLUTION') }}
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ $status === 'closed' ? 'active bg-primary shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                               href="{{ route('admin.tickets.index', ['status' => 'closed']) }}">
                               {{ __('ARCHIVE') }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h5 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-layer-group mr-2 text-primary opacity-50"></i> Support Operations Ledger
            </h5>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    <i class="fas fa-history mr-1"></i> LOGGED CASES: {{ $tickets->total() }}
                </span>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                <form id="tickets-mass-action-form" action="{{ route('admin.tickets.bulk-update') }}" method="POST">
                    @csrf
                    <input type="hidden" name="type" id="bulk-type-input">
                    <input type="hidden" name="value" id="bulk-value-input">
                    <table id="tickets-table" class="table table-hover table-premium mb-0">
                        <thead class="bg-light text-uppercase smallest font-weight-bold">
                            <tr>
                            <th class="py-3 border-0 px-4" style="width: 60px;">
                                <div class="custom-control custom-checkbox custom-control-premium">
                                    <input type="checkbox" class="custom-control-input" id="check-all">
                                    <label class="custom-control-label" for="check-all"></label>
                                </div>
                            </th>
                            <th class="py-3 border-0" style="width: 35%;">Subject & Identification</th>
                            <th class="py-3 border-0" style="width: 20%;">User Profile</th>
                            <th class="py-3 border-0" style="width: 15%;">Status & Priority</th>
                            <th class="py-3 border-0" style="width: 15%;">Ticket Age</th>
                            <th class="py-3 border-0 text-right px-4" style="width: 140px;">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                            @forelse($tickets as $ticket)
                            <tr>
                                <td class="text-center align-middle py-4">
                                    <div class="custom-control custom-control-premium custom-checkbox">
                                        <input type="checkbox" name="ids[]" value="{{ $ticket->id }}" class="custom-control-input ticket-checkbox" id="check-{{ $ticket->id }}">
                                        <label class="custom-control-label" for="check-{{ $ticket->id }}"></label>
                                    </div>
                                </td>
                                <td class="align-middle py-4">
                                    <a href="{{ route('admin.tickets.show', $ticket->id) }}" class="font-weight-bold text-dark d-block mb-1 text-truncate" style="font-size: 0.95rem; max-width: 350px;" title="{{ $ticket->title }}">
                                        {{ $ticket->title }}
                                    </a>
                                    <div class="d-flex align-items-center overflow-hidden">
                                        <span class="badge badge-light border text-muted smallest px-2 mr-2" style="font-weight: 500; flex-shrink: 0;">ID: #{{ $ticket->id }}</span>
                                        <p class="text-muted smallest mb-0 text-truncate" style="max-width: 250px; opacity: 0.7;">{{ $ticket->description }}</p>
                                    </div>
                                </td>
                                <td class="align-middle py-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-circle bg-light border text-muted mr-3 shadow-xs" style="width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-user-circle"></i>
                                        </div>
                                        <div class="overflow-hidden">
                                            <span class="d-block font-weight-bold text-dark smallest text-truncate" style="max-width: 150px;">{{ $ticket->user->name ?? 'Guest User' }}</span>
                                            <span class="text-muted smallest text-truncate d-block" style="max-width: 150px;">{{ $ticket->user->email ?? 'Direct Submission' }}</span>
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
                                        <form id="delete-ticket-{{ $ticket->id }}" action="{{ route('admin.tickets.destroy', $ticket->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn btn-white btn-sm text-danger py-2 px-3" data-toggle="tooltip" title="Purge Ticket" onclick="confirmDelete('delete-ticket-{{ $ticket->id }}', 'Purge Support Ticket?', 'This will permanently remove the ticket from the system database.', 'Purge Ticket')">
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

            @if(method_exists($tickets, 'hasPages') && $tickets->hasPages())
                <div class="card-footer bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase">Displaying {{ $tickets->firstItem() }} - {{ $tickets->lastItem() }} of {{ $tickets->total() }} records</div>
                    <div>{{ $tickets->appends(request()->except('page'))->links('pagination::bootstrap-4') }}</div>
                </div>
            @endif
        </div>
    </div>
</div>

{{-- Premium Floating Action Bar --}}
<div id="bulk-floating-bar" class="bulk-floating-bar d-none">
    <div class="container-fluid h-100">
        <div class="d-flex align-items-center justify-content-between h-100 px-4">
            <div class="d-flex align-items-center">
                <div class="selection-count-badge mr-4">
                    <span id="selected-count">0</span> SELECTED
                </div>
                <div class="divider-v"></div>
                <div class="d-flex" style="gap: 15px;">
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-action-pill dropdown-toggle" data-toggle="dropdown">
                            <i class="fas fa-toggle-on mr-2"></i> STATUS
                        </button>
                        <div class="dropdown-menu dropdown-menu-right shadow-premium-lg border-0 mb-3" style="border-radius: 15px;">
                            <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1" href="javascript:void(0)" onclick="handleBulkUpdate('status', 'open')">
                                <i class="fas fa-envelope-open mr-2 text-success"></i> Re-Open Tickets
                            </a>
                            <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1" href="javascript:void(0)" onclick="handleBulkUpdate('status', 'in-progress')">
                                <i class="fas fa-spinner mr-2 text-info"></i> Shift to In-Progress
                            </a>
                            <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1" href="javascript:void(0)" onclick="handleBulkUpdate('status', 'closed')">
                                <i class="fas fa-archive mr-2 text-dark"></i> Close & Archive
                            </a>
                        </div>
                    </div>

                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-action-pill dropdown-toggle" data-toggle="dropdown">
                            <i class="fas fa-bolt mr-2"></i> PRIORITY
                        </button>
                        <div class="dropdown-menu dropdown-menu-right shadow-premium-lg border-0 mb-3" style="border-radius: 15px;">
                            <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1 text-danger" href="javascript:void(0)" onclick="handleBulkUpdate('priority', 'urgent')">
                                <i class="fas fa-fire mr-2"></i> Escalate to Urgent
                            </a>
                            <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1 text-warning" href="javascript:void(0)" onclick="handleBulkUpdate('priority', 'high')">
                                <i class="fas fa-arrow-up mr-2"></i> Elevate to High
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="d-flex align-items-center">
                <button type="button" class="btn btn-danger-pill mr-3" onclick="handleBulkUpdate('action', 'delete')">
                    <i class="fas fa-trash-alt mr-2"></i> PURGE SELECTION
                </button>
                <button type="button" class="btn btn-close-bar" id="deselectAll">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    </div>
</div>
@stop

@push('css')
@include('admin._partials._toggle-card-css')
<style>
    .transition-all { transition: all 0.25s ease-in-out; }
    .nav-pills .nav-link:not(.active):hover { background: rgba(0,0,0,0.03); color: var(--primary) !important; }
    
    .table-premium { 
        table-layout: fixed !important;
        width: 100% !important;
    }
    
    .table-premium td {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    /* Allow wrapping for specific items if needed, but ensure base cell doesn't expand */
    .table-premium td .text-truncate {
        max-width: 100% !important;
    }

    .badge-primary-light { background-color: var(--primary-soft); color: var(--primary); }
    #tickets-table thead th { letter-spacing: 1px; color: #8898aa; }
    .btn-primary-soft { background: rgba(70, 165, 172, 0.1); color: #46a5ac; border: 1px solid rgba(70, 165, 172, 0.2); }
    .btn-primary-soft:hover { background: #46a5ac; color: #fff; }

    /* Floating Action Bar Styling */
    .bulk-floating-bar {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 900px;
        height: 80px;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 40px;
        z-index: 9999;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
        color: #fff;
        display: flex;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .bulk-floating-bar.d-none {
        display: none !important;
        opacity: 0;
        transform: translate(-50%, 40px);
    }

    .selection-count-badge {
        background: var(--primary);
        color: #fff;
        padding: 8px 20px;
        border-radius: 30px;
        font-weight: 800;
        font-size: 0.75rem;
        letter-spacing: 1px;
    }

    .divider-v {
        width: 1px;
        height: 30px;
        background: rgba(255, 255, 255, 0.1);
        margin: 0 25px;
    }

    .btn-action-pill {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        border-radius: 30px;
        padding: 8px 25px;
        font-weight: 700;
        font-size: 0.7rem;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: all 0.3s ease;
    }

    .btn-action-pill:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.2);
    }

    .btn-danger-pill {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
        color: #ef4444;
        border-radius: 30px;
        padding: 8px 25px;
        font-weight: 700;
        font-size: 0.7rem;
        letter-spacing: 1px;
        text-transform: uppercase;
        transition: all 0.3s ease;
    }

    .btn-danger-pill:hover {
        background: #ef4444;
        color: #fff;
    }

    .btn-close-bar {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        font-size: 1.2rem;
        transition: color 0.3s ease;
        padding: 10px;
    }

    .btn-close-bar:hover {
        color: #fff;
    }

    /* Animation */
    .animate__fadeInUpCustom {
        animation: fadeInUpCustom 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeInUpCustom {
        from { opacity: 0; transform: translate(-50%, 50px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
</style>
@endpush

@section('js')
@include('admin._partials._sweetalert')

<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        
        // DataTables Initialization (Resilient)
        if (typeof $.fn.DataTable === 'function') {
            if ($('#tickets-table tbody tr:not(.empty-state)').length > 0 && $('#tickets-table').find('i.fa-inbox').length === 0) {
                try {
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
                } catch (e) {
                    console.warn("DataTable initialization failed:", e);
                }
            }
        } else {
            console.warn("DataTable plugin not loaded.");
        }

    // Bulk Selection Logic
    const $selectAll = $('#check-all');
    const $bulkBar = $('#bulk-floating-bar');
    const $selectedCount = $('#selected-count');

    function updateBulkUI() {
        const checkedCount = $('.ticket-checkbox:checked').length;
        if (checkedCount > 0) {
            $selectedCount.text(checkedCount);
            if ($bulkBar.hasClass('d-none')) {
                $bulkBar.removeClass('d-none').addClass('animate__fadeInUpCustom');
            }
        } else {
            $bulkBar.addClass('d-none').removeClass('animate__fadeInUpCustom');
        }
    }

    // Delegated Select All
    $(document).on('change', '#check-all', function() {
        $('.ticket-checkbox').prop('checked', this.checked);
        updateBulkUI();
    });

    // Deselect All Button in Bar
    $(document).on('click', '#deselectAll', function() {
        $('.ticket-checkbox').prop('checked', false);
        $('#check-all').prop('checked', false);
        updateBulkUI();
    });

    // Delegated Individual Checkbox
    $(document).on('change', '.ticket-checkbox', function() {
        const total = $('.ticket-checkbox').length;
        const checked = $('.ticket-checkbox:checked').length;
        
        $('#check-all').prop('checked', total === checked && total > 0);
        updateBulkUI();
    });

    // Handle Bulk Update
    window.handleBulkUpdate = function(type, value) {
        const count = $('.ticket-checkbox:checked').length;
        if (count === 0) return;

        SellioAlert.fire({
            title: 'Bulk Action Confirmation',
            text: `Apply "${value.toUpperCase()}" ${type} to ${count} selected tickets?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary)',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Execute Action',
            backdrop: `rgba(15, 23, 42, 0.4)`
        }).then((result) => {
            if (result.isConfirmed) {
                $('#bulk-type-input').val(type);
                $('#bulk-value-input').val(value);
                $('#tickets-mass-action-form').submit();
            }
        });
    };
});
</script>
@stop
