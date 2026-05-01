@section('title', 'Support Tickets | Admin Ops')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ticket-alt mr-2 text-primary"></i> 
                    Customer Support Queue
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Monitor user inquiries, resolve platform issues, and manage ticket priority.
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.welcome') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Dashboard
                </a>
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
                <div class="card-body p-2 d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <span class="text-muted smallest font-weight-bold ml-3 mr-3 text-uppercase letter-spacing-1">
                            <i class="fas fa-filter mr-1 text-primary"></i> Filter By Status:
                        </span>
                        <ul class="nav nav-pills p-1 bg-light rounded-pill">
                            @php
                                $statusFilters = [
                                    'open'        => ['label' => 'Open Queue', 'color' => 'success'],
                                    'in-progress' => ['label' => 'In Resolution', 'color' => 'info'],
                                    'closed'      => ['label' => 'Archive', 'color' => 'dark'],
                                ];
                            @endphp
                            @foreach($statusFilters as $key => $filter)
                                <li class="nav-item">
                                    <a class="nav-link {{ $status === $key ? 'active bg-'.$filter['color'].' shadow-sm' : 'text-muted' }} px-4 py-1 smallest font-weight-bold rounded-pill transition-all" 
                                       href="{{ route('admin.tickets.index', ['status' => $key]) }}">
                                       {{ strtoupper($filter['label']) }}
                                    </a>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                    <div class="pr-3">
                        <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest">
                            {{ $tickets->total() }} REQUESTS FOUND
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest" style="letter-spacing: 1px;">Ticket Registry</h3>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="tickets-table" class="table table-hover table-premium mb-0">
                    <thead class="bg-light text-uppercase smallest font-weight-bold">
                        <tr>
                            <th class="pl-4 py-3 border-0">Subject & Identification</th>
                            <th class="py-3 border-0">User Profile</th>
                            <th class="py-3 border-0">Status & Priority</th>
                            <th class="py-3 border-0">Age</th>
                            <th class="text-right pr-4 py-3 border-0">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($tickets as $ticket)
                        <tr>
                            <td class="align-middle pl-4 py-4">
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
                                <a href="{{ route('admin.tickets.show', $ticket->id) }}" class="btn btn-primary-soft rounded-pill px-4 smallest font-weight-bold">
                                    MANAGE <i class="fas fa-arrow-right ml-1"></i>
                                </a>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="5" class="text-center py-5">
                                <div class="py-4">
                                    <i class="fas fa-inbox fa-3x text-light mb-3"></i>
                                    <p class="text-muted font-weight-bold mb-0">No active tickets found for this queue.</p>
                                </div>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
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
        if ($('#tickets-table tbody tr:not(.empty-state)').length > 0 && $('#tickets-table').find('i.fa-inbox').length === 0) {
            $('#tickets-table').DataTable({
                "paging": false, 
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row px-4 pt-3"<"col-sm-12"f>>t',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search within this queue..."
                }
            });
            $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light mb-3').css('width', '250px');
        }
    });
</script>
@stop
