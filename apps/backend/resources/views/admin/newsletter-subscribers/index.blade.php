@extends('adminlte::page')

@section('title', 'Newsletter Subscribers')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-envelope-open-text mr-2 text-primary"></i> Newsletter Audience
                </h1>
                <ol class="breadcrumb bg-transparent p-0 mt-2 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Subscribers</li>
                </ol>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Audience registry for multi-channel marketing and prospect engagement.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.newsletter-subscribers.export') }}" class="btn btn-back shadow-sm rounded-pill px-4">
                    <i class="fas fa-file-export mr-1"></i> EXPORT AUDIENCE
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Subscriber Management Card --}}
    <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">
                Audience Registry <span class="badge badge-light border ml-2 px-2" style="font-weight: 500;">{{ $subscribers->total() }} Total</span>
            </h3>
            <div class="card-tools">
                <a href="{{ route('admin.newsletter-subscribers.export') }}" class="btn btn-default shadow-sm border px-3 text-muted bg-white">
                    <i class="fas fa-file-export mr-1 text-xs"></i> Export CSV
                </a>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="subscribers-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th>Subscriber Identity</th>
                            <th>Acquisition Source</th>
                            <th>Subscription Date</th>
                            <th class="text-center">Opt-in Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($subscribers as $subscriber)
                            <tr>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-shape mr-3 bg-light border rounded-circle d-flex align-items-center justify-content-center shadow-xs" style="width:40px; height:40px;">
                                            <i class="fas fa-user-check text-primary" style="font-size: 0.9rem;"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $subscriber->email }}</span>
                                            <small class="text-muted text-uppercase font-weight-bold" style="font-size: 0.65rem; letter-spacing: 0.5px;">
                                                Identity: {{ $subscriber->user_id ? 'Registered (UID:'.$subscriber->user_id.')' : 'Guest Prospect' }}
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="badge badge-primary-light text-primary px-2 py-1 text-uppercase" style="font-size: 0.7rem;">
                                        <i class="fas fa-fingerprint mr-1 text-xs"></i> {{ $subscriber->source ?? 'Main Website' }}
                                    </span>
                                </td>

                                <td class="align-middle small">
                                    <div class="text-dark font-weight-bold">
                                        {{ $subscriber->created_at->format('M d, Y') }}
                                    </div>
                                    <div class="text-muted">
                                        <i class="far fa-clock mr-1 text-xs"></i> {{ $subscriber->created_at->format('g:i A') }}
                                    </div>
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $subscriber->is_confirmed ? 'badge-success-light' : 'badge-warning-light' }} px-3 py-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px; min-width: 95px;">
                                        <i class="fas {{ $subscriber->is_confirmed ? 'fa-check-double' : 'fa-hourglass-half' }} mr-1"></i>
                                        {{ $subscriber->is_confirmed ? 'Confirmed' : 'Pending' }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.newsletter-subscribers.edit', $subscriber->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Edit Detail">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form action="{{ route('admin.newsletter-subscribers.destroy', $subscriber->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Unsubscribe"
                                                    onclick="return confirm('Remove this subscriber from the audience registry?')">
                                                <i class="fas fa-user-minus"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="6" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-users-slash fa-3x text-muted mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No Subscribers Found</h5>
                                        <p class="text-secondary">Your newsletter audience list is currently empty.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($subscribers->hasPages())
            <div class="card-footer bg-white border-top py-3">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted small font-weight-bold text-uppercase">
                        Showing {{ $subscribers->firstItem() }}-{{ $subscribers->lastItem() }} of {{ $subscribers->total() }}
                    </span>
                    <div>
                        {{ $subscribers->links('pagination::bootstrap-4') }}
                    </div>
                </div>
            </div>
        @endif
    </div>
</div>
@endsection

@section('css')
<style>
    /* Premium Table Styling */
    .table-premium thead th { border-top: none; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; color: #6c757d; }
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .text-monospace { font-family: 'SFMono-Regular', Consolas, monospace !important; }
    .font-weight-600 { font-weight: 600 !important; }

    /* Blueprint Light Badge Classes */
    .badge-success-light { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-warning-light { background-color: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }
    .badge-primary-light { background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }

    /* Action Buttons Style */
    .btn-group-premium .btn { border: 1px solid #e9ecef; background: #fff; }
    .btn-group-premium .btn:hover { background: #f8f9fa; }

    .dataTables_filter { float: left !important; text-align: left !important; }
    .dataTables_filter input { margin-left: 0 !important; }
    .dataTables_length { float: right !important; text-align: right !important; }
</style>
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        
        // Refined Search UI for DataTables
        if ($('#subscribers-table tbody tr:not(.empty-state)').length > 0) {
            $('#subscribers-table').DataTable({
                "paging": true,
                "info": true,
                "searching": true,
                "ordering": true,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                       '<"row"<"col-sm-12"tr>>' +
                       '<"row pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search records...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            
            $('.dataTables_filter input').addClass('form-control form-control-sm form-control-premium shadow-none border-light').css('width', '220px');
        }
    });
</script>
@endsection
