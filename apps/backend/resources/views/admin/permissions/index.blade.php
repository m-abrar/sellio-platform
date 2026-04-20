@extends('adminlte::page')

@section('title', 'Access Control - Permissions')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-key mr-2 text-primary"></i> Granular Permissions
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item"><a href="{{ route('admin.roles.index') }}">Access Control</a></li>
                    <li class="breadcrumb-item active">Permissions</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Permissions Table Card --}}
    <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">Permission Registry</h3>
            <div class="card-tools">
                <a href="{{ route('admin.permissions.create') }}" class="btn btn-primary btn-flat shadow-sm px-4 font-weight-bold">
                    <i class="fas fa-plus-circle mr-1"></i> Add New Permission
                </a>
                <button type="button" class="btn btn-tool" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="permissions-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th>Permission Identifier</th>
                            <th>Guard Type</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($permissions as $permission)
                            <tr>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box mr-3 bg-light border rounded d-flex align-items-center justify-content-center shadow-xs" style="width:38px; height:38px;">
                                            <i class="fas fa-code text-xs text-muted"></i>
                                        </div>
                                        <div>
                                            <code class="premium-code text-primary">{{ $permission->name }}</code>
                                            <small class="d-block text-muted text-uppercase font-weight-bold mt-1" style="font-size: 0.6rem; letter-spacing: 0.8px;">
                                                System Gate / API Resource
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <span class="badge badge-secondary-light border px-2 py-1 text-monospace" style="font-size: 0.75rem;">
                                        <i class="fas fa-shield-alt mr-1 text-xs opacity-50"></i>{{ $permission->guard_name ?? 'web' }}
                                    </span>
                                </td>
                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.permissions.edit', $permission->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Modify Identifier">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        
                                        <form action="{{ route('admin.permissions.destroy', $permission->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Revoke Permission"
                                                    onclick="return confirm('Deleting this will remove this permission from all associated roles. Continue?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="4" class="text-center py-5">
                                    <i class="fas fa-fingerprint fa-4x text-light mb-3"></i>
                                    <h5 class="text-muted font-weight-bold">No Permissions Seeded</h5>
                                    <p class="small text-secondary">Individual permissions define granular user capabilities within the system logic.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@section('css')
<style>
    /* Premium Architecture Styles */
    .table-premium thead th { border-top: none; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; color: #6c757d; padding: 1rem; }
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .text-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; }
    .font-weight-600 { font-weight: 600 !important; }

    /* Code Identifier Styling */
    .premium-code {
        background-color: #f1f5f9;
        color: #2563eb !important;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.85rem;
        border: 1px solid #e2e8f0;
    }

    /* Guard Badge */
    .badge-secondary-light { background-color: #f8fafc; color: #475569; border: 1px solid #e2e8f0 !important; }

    /* Action Buttons Style */
    .btn-group-premium .btn { border: 1px solid #e9ecef; background: #fff; padding: 0.25rem 0.75rem; }
    .btn-group-premium .btn:hover { background: #f8f9fa; }
    
    .opacity-50 { opacity: 0.5; }
</style>
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        
        if ($('#permissions-table tbody tr:not(.empty-state)').length > 0) {
            $('#permissions-table').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row px-4 pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                       '<"row"<"col-sm-12"tr>>' +
                       '<"row px-4 pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Filter identifiers...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '220px');
        }
    });
</script>
@endsection
