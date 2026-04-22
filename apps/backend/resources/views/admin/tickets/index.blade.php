@extends('adminlte::page')

@section('title', 'Support Tickets')

@section('plugins.Datatables', true)

@section('content_header')
<div class="container-fluid">
    <div class="row mb-2">
        <div class="col-sm-6">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-ticket-alt mr-2 text-success"></i> Support Tickets
            </h1>
        </div>
        <div class="col-sm-6 text-right">
            {{-- Ticket creation handled via user frontend or support dashboard --}}
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
                <span class="text-muted font-weight-bold ml-2 mr-1"><i class="fas fa-filter mr-1 text-primary"></i> Status:</span>
                <ul class="nav nav-pills">
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'open' ? 'active bg-success font-weight-bold' : 'text-secondary' }} px-3 py-1 text-sm mr-1" 
                           href="{{ route('admin.tickets.index', ['status' => 'open']) }}">
                           Open
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'in-progress' ? 'active bg-info font-weight-bold' : 'text-secondary' }} px-3 py-1 text-sm mr-1" 
                           href="{{ route('admin.tickets.index', ['status' => 'in-progress']) }}">
                           In Progress
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ $status === 'closed' ? 'active bg-dark font-weight-bold' : 'text-secondary' }} px-3 py-1 text-sm" 
                           href="{{ route('admin.tickets.index', ['status' => 'closed']) }}">
                           Closed
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">
                Ticket Queue
                <span class="badge badge-light border ml-2 px-2" style="font-weight: 500;">{{ $tickets->total() }} total</span>
            </h3>
            <div class="card-tools">
                <button type="button" class="btn btn-tool" data-card-widget="maximize"><i class="fas fa-expand"></i></button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="tickets-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th>Subject / Description</th>
                            <th>User</th>
                            <th>Status & Priority</th>
                            <th>Created</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($tickets as $ticket)
                        <tr>
                            <td class="align-middle">
                                <a href="{{ route('admin.tickets.show', $ticket->id) }}" class="font-weight-bold text-dark d-block">
                                    {{ $ticket->title }}
                                </a>
                                <small class="text-muted d-block text-truncate" style="max-width: 250px;">{{ $ticket->description }}</small>
                            </td>
                            <td class="align-middle">{{ $ticket->user->name ?? 'Guest' }}</td>
                            <td class="align-middle">
                                <span class="badge badge-{{ match($ticket->status) {
                                    'open' => 'success',
                                    'in-progress' => 'info',
                                    'closed' => 'dark',
                                    default => 'warning'
                                } }} px-2 mb-1 d-inline-block">{{ ucfirst($ticket->status) }}</span>
                                <br>
                                <small class="text-{{ match($ticket->priority) {
                                    'urgent' => 'danger',
                                    'high' => 'orange',
                                    'medium' => 'primary',
                                    default => 'secondary'
                                } }} font-weight-bold text-uppercase" style="font-size: 0.7rem;">
                                    {{ ucfirst($ticket->priority) }} Priority
                                </small>
                            </td>
                            <td class="align-middle small">{{ $ticket->created_at->diffForHumans() }}</td>
                            <td class="text-right align-middle px-4">
                                <div class="btn-group btn-group-premium shadow-sm">
                                    <a href="{{ route('admin.tickets.show', $ticket->id) }}" class="btn btn-default btn-sm text-primary" data-toggle="tooltip" title="View Ticket">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="6" class="text-center py-4 text-muted">No tickets found for status "{{ ucfirst($status) }}"</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            @if($tickets->hasPages())
                <div class="card-footer bg-white py-3">
                    {{ $tickets->appends(['status' => $status])->links() }}
                </div>
            @endif
        </div>
    </div>
</div>
@stop

@section('css')
<style>
    .nav-pills-premium { padding: 1px; }
    .nav-pills-premium .nav-link { border-radius: 20px !important; font-size: 0.85rem; color: #6c757d; font-weight: 500; transition: all 0.3s ease; }
    .nav-pills-premium .nav-link.active { background-color: #007bff !important; color: #fff !important; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

    .dataTables_filter { float: left !important; text-align: left !important; }
    .dataTables_filter input { margin-left: 0 !important; }
    .dataTables_length { float: right !important; text-align: right !important; }
</style>

@stop

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        if ($('#tickets-table tbody tr').length > 1 || $('#tickets-table tbody tr').text().indexOf('No tickets') === -1) {
            $('#tickets-table').DataTable({
                "paging": false, /* Kept false if using server side pagination appends footer links */
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true,
                "language": {
                    "search": "",
                    "searchPlaceholder": "Filter table items..."
                }
            });
            $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '200px');
        }
    });
</script>
@stop
