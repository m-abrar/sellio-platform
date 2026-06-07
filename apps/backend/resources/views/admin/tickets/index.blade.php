{{--
    Administrative Communication Module: Support Ticket Registry
    
    This view serves as the primary orchestration layer for marketplace 
    customer support. It facilitates the monitoring of user inquiries, 
    resolution lifecycle management (Open -> In-Progress -> Closed), 
    and bulk operational updates for high-volume ticket queues.
    
    @extends adminlte::page
    @context Communication Management
    @variables Collection $tickets Collection of Ticket model instances.
    @variables string $status The active status filter context.
--}}
@extends('adminlte::page')

@section('title', __('Support Tickets'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row align-items-center mb-4">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ticket-alt mr-2 text-primary"></i> {{ __('Customer Support Queue') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Monitor user inquiries, resolve platform issues, and manage ticket priority.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase shadow-xs">
                    <i class="fas fa-headset mr-1"></i> {{ $tickets->total() }} {{ __('REQUESTS QUEUED') }}
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
            <div class="card border-0 shadow-premium rounded-20">
                <div class="card-body p-2 d-flex align-items-center">
                    <span class="text-muted smallest font-weight-bold ml-3 mr-3 text-uppercase letter-spacing-1">
                        <i class="fas fa-filter mr-1 text-primary"></i> {{ __('Queue Filter') }}:
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

    @include('admin.tickets._filter')

    <div class="card border-0 shadow-premium overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h5 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-layer-group mr-2 text-primary"></i> {{ __('Support Operations Ledger') }}
            </h5>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    <i class="fas fa-history mr-1"></i> {{ __('LOGGED CASES') }}: {{ $tickets->total() }}
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
                            <th class="py-3 border-0 px-4 w-60-p no-sort">
                                <div class="custom-control custom-checkbox custom-control-premium">
                                    <input type="checkbox" class="custom-control-input" id="check-all">
                                    <label class="custom-control-label" for="check-all"></label>
                                </div>
                            </th>
                            <th class="py-3 border-0 w-35-p">{{ __('Subject & Identification') }}</th>
                            <th class="py-3 border-0 w-20-p">{{ __('User Profile') }}</th>
                            <th class="py-3 border-0 w-15-p">{{ __('Status & Priority') }}</th>
                            <th class="py-3 border-0 w-15-p">{{ __('Ticket Age') }}</th>
                            <th class="py-3 border-0 text-right px-4 w-140-p no-sort">{{ __('Actions') }}</th>
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
                                    <a href="{{ route('admin.tickets.show', $ticket->id) }}" class="font-weight-bold text-dark d-block mb-1 text-truncate font-0-95 w-max-350" title="{{ $ticket->title }}">
                                        {{ $ticket->title }}
                                    </a>
                                    <div class="d-flex align-items-center overflow-hidden">
                                        <span class="badge badge-light border text-muted smallest px-2 mr-2 font-weight-500 flex-shrink-0">{{ __('ID:') }} #{{ $ticket->id }}</span>
                                        <p class="text-muted smallest mb-0 text-truncate w-max-250 opacity-70">{{ $ticket->description }}</p>
                                    </div>
                                </td>
                                <td class="align-middle py-4">
                                    <div class="d-flex align-items-center">
                                        <div class="rounded-circle overflow-hidden border bg-white mr-3 shadow-xs icon-box-42">
                                            <img src="{{ $ticket->user?->avatar_url ?? asset('images/fallbacks/default-avatar.png') }}"
                                                 alt="{{ $ticket->user->name ?? __('Guest User') }}"
                                                 class="w-100 h-100 object-fit-cover">
                                        </div>
                                        <div class="overflow-hidden">
                                            <span class="d-block font-weight-bold text-dark smallest text-truncate w-max-150">{{ $ticket->user->name ?? __('Guest User') }}</span>
                                            <span class="text-muted smallest text-truncate d-block w-max-150">{{ $ticket->user->email ?? __('Direct Submission') }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle py-4">
                                    @php
                                        $statusMeta = $ticket->getStatusMeta();
                                        $priorityMeta = $ticket->getPriorityMeta();
                                    @endphp
                                    <span class="badge badge-{{ $statusMeta['color'] }}-light text-{{ $statusMeta['color'] }} px-3 py-1 smallest font-weight-bold mb-1 rounded-pill">{{ strtoupper(__($statusMeta['label'])) }}</span>
                                    <br>
                                    <span class="text-{{ $priorityMeta['color'] }} font-weight-bold text-uppercase smallest-0-65 ls-0-5">
                                        <i class="fas fa-bolt mr-1"></i> {{ __($priorityMeta['label']) }} {{ __('Priority') }}
                                    </span>
                                </td>
                                <td class="align-middle py-4">
                                    <div class="font-weight-600 text-dark smallest">{{ $ticket->created_at->diffForHumans(null, true) }} {{ __('ago') }}</div>
                                    <small class="text-muted smallest">{{ $ticket->created_at->format('M d, Y') }}</small>
                                </td>
                                <td class="text-right align-middle pr-4 py-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.tickets.show', $ticket->id) }}" class="btn btn-white btn-sm text-primary py-2 px-3 border-right" data-toggle="tooltip" title="{{ __('Open Ticket') }}">
                                            <i class="fas fa-envelope-open-text"></i>
                                        </a>
                                        <form id="delete-ticket-{{ $ticket->id }}" action="{{ route('admin.tickets.destroy', $ticket->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn btn-white btn-sm text-danger py-2 px-3" 
                                                     data-toggle="tooltip" title="{{ __('Purge Ticket') }}" 
                                                     data-action="delete-trigger"
                                                     data-confirm-title="{{ __('Purge Support Ticket?') }}"
                                                     data-confirm-text="{{ __('This will permanently remove the ticket from the system database.') }}"
                                                     data-confirm-btn="{{ __('Purge Ticket') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                            @empty
                                @include('admin._partials._empty-state', [
                                    'colspan' => 6,
                                    'icon' => 'fas fa-inbox',
                                    'title' => __('No active tickets found for this queue.'),
                                    'description' => __('The support queue is currently clear. Customer requests will materialize here once synchronized with the platform.'),
                                ])
                            @endforelse
                        </tbody>
                    </table>
                </form>
            </div>

            @if(method_exists($tickets, 'hasPages') && $tickets->hasPages())
                <div class="card-footer bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <div class="text-muted smallest font-weight-bold uppercase">{{ __('Displaying :first - :last of :total records', ['first' => $tickets->firstItem(), 'last' => $tickets->lastItem(), 'total' => $tickets->total()]) }}</div>
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
                    <span id="selected-count">0</span> {{ __('SELECTED') }}
                </div>
                <div class="divider-v"></div>
                <div class="d-flex gap-15">
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-action-pill dropdown-toggle" data-toggle="dropdown">
                            <i class="fas fa-toggle-on mr-2"></i> {{ __('STATUS') }}
                        </button>
                        <div class="dropdown-menu dropdown-menu-right shadow-premium-lg border-0 mb-3 rounded-15">
                            <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1" href="javascript:void(0)" data-action="bulk-update" data-type="status" data-value="open">
                                <i class="fas fa-envelope-open mr-2 text-success"></i> {{ __('Re-Open Tickets') }}
                            </a>
                            <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1" href="javascript:void(0)" data-action="bulk-update" data-type="status" data-value="in-progress">
                                <i class="fas fa-spinner mr-2 text-info"></i> {{ __('Shift to In-Progress') }}
                            </a>
                            <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1" href="javascript:void(0)" data-action="bulk-update" data-type="status" data-value="closed">
                                <i class="fas fa-archive mr-2 text-dark"></i> {{ __('Close & Archive') }}
                            </a>
                        </div>
                    </div>

                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-action-pill dropdown-toggle" data-toggle="dropdown">
                            <i class="fas fa-bolt mr-2"></i> {{ __('PRIORITY') }}
                        </button>
                        <div class="dropdown-menu dropdown-menu-right shadow-premium-lg border-0 mb-3 rounded-15">
                            <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1 text-danger" href="javascript:void(0)" data-action="bulk-update" data-type="priority" data-value="urgent">
                                <i class="fas fa-fire mr-2"></i> {{ __('Escalate to Urgent') }}
                            </a>
                            <a class="dropdown-item py-3 px-4 font-weight-bold smallest uppercase letter-spacing-1 text-warning" href="javascript:void(0)" data-action="bulk-update" data-type="priority" data-value="high">
                                <i class="fas fa-arrow-up mr-2"></i> {{ __('Elevate to High') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="d-flex align-items-center">
                <button type="button" class="btn btn-danger-pill mr-3" data-action="bulk-update" data-type="action" data-value="delete">
                    <i class="fas fa-trash-alt mr-2"></i> {{ __('PURGE SELECTION') }}
                </button>
                <button type="button" class="btn btn-close-bar" id="deselectAll">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    </div>
</div>
@stop

@push('js')
<script src="{{ asset('admin-assets/pages/tickets-index.js') }}"></script>
@endpush
