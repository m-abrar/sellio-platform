@extends('adminlte::page')

@section('title', 'Access Control - Roles')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-user-shield mr-2 text-primary"></i> Access Control
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Roles</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Roles Registry Card --}}
    <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">System Role Registry</h3>
            <div class="card-tools">
                <a href="{{ route('admin.roles.create') }}" class="btn btn-primary btn-flat shadow-sm px-4 font-weight-bold">
                    <i class="fas fa-plus-circle mr-1"></i> Add New Role
                </a>
                <button type="button" class="btn btn-tool" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="roles-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th style="width: 25%">Role Identity</th>
                            <th>Permission Blueprint</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($roles as $role)
                            <tr>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-shape mr-3 bg-primary-light border rounded-circle d-flex align-items-center justify-content-center shadow-xs" style="width:42px; height:42px;">
                                            <i class="fas fa-fingerprint text-primary"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark text-capitalize mb-0">{{ $role->name }}</span>
                                            <small class="text-muted text-uppercase font-weight-bold" style="font-size: 0.6rem; letter-spacing: 0.5px;">
                                                Security Tier: {{ $loop->iteration }}
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <div class="d-flex flex-wrap" style="gap: 6px;">
                                        @forelse($role->permissions as $permission)
                                            <span class="badge badge-info-light text-info px-2 py-1 text-uppercase" style="font-size: 0.65rem; letter-spacing: 0.3px;">
                                                <i class="fas fa-check-double mr-1 text-xs"></i> {{ $permission->name }}
                                            </span>
                                        @empty
                                            <span class="text-muted small italic opacity-75">
                                                <i class="fas fa-info-circle mr-1"></i> No specific permissions assigned
                                            </span>
                                        @endforelse
                                    </div>
                                </td>
                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.roles.edit', $role->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Edit Permissions">
                                            <i class="fas fa-shield-alt mr-1"></i> Edit
                                        </a>
                                        
                                        <form action="{{ route('admin.roles.destroy', $role->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Delete Role"
                                                    onclick="return confirm('Deleting this role may affect users assigned to it. Proceed?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="4" class="text-center py-5">
                                    <i class="fas fa-user-lock fa-4x text-light mb-3"></i>
                                    <h5 class="text-muted font-weight-bold">No Roles Defined</h5>
                                    <p class="small text-secondary">Configure your system's access hierarchy here.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    {{-- Bottom Security Note --}}
    <div class="card bg-white border shadow-xs mt-4 overflow-hidden" style="border-radius: 8px;">
        <div class="card-body p-0">
            <div class="d-flex">
                <div class="bg-warning px-3 d-flex align-items-center">
                    <i class="fas fa-shield-virus text-white fa-lg"></i>
                </div>
                <div class="p-3">
                    <p class="mb-0 small font-weight-600 text-dark">Security Protocol</p>
                    <p class="mb-0 small text-muted">Roles define the fundamental access level for users. Changes to permission blueprints are applied in real-time to all active sessions holding this role.</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('css')
<style>
    /* Premium Table & Layout */
    .table-premium thead th { border-top: none; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; color: #6c757d; padding: 1rem; }
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .text-monospace { font-family: monospace; }
    .font-weight-600 { font-weight: 600 !important; }

    /* Custom Color Accents */
    .bg-primary-light { background-color: #eff6ff; }
    .badge-info-light { background-color: #f0f9ff; color: #0369a1; border: 1px solid #e0f2fe; }
    
    /* Action Buttons Style */
    .btn-group-premium .btn { border: 1px solid #e9ecef; background: #fff; padding: 0.25rem 0.75rem; font-size: 0.85rem; }
    .btn-group-premium .btn:hover { background: #f8f9fa; }

    .italic { font-style: italic; }
    .opacity-75 { opacity: 0.75; }
</style>
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        
        if ($('#roles-table tbody tr:not(.empty-state)').length > 0) {
            $('#roles-table').DataTable({
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
                    "searchPlaceholder": "Filter roles...",
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
