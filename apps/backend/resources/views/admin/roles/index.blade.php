@extends('adminlte::page')

@section('title', 'Access Architecture | Authority Registry')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-user-shield mr-2 text-primary"></i> Access Control
                </h1>
                <ol class="breadcrumb bg-transparent p-0 mt-2 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Access Control</li>
                </ol>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage system-wide authority levels and map granular permissions to security roles.</p>
            </div>
            <div class="col-sm-5 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.permissions.index') }}" class="btn btn-back shadow-sm px-3 rounded-pill">
                        <i class="fas fa-key mr-1"></i> Permissions
                    </a>
                    <a href="{{ route('admin.roles.create') }}" class="btn btn-primary btn-sm rounded-pill px-4 font-weight-bold shadow-lg">
                        <i class="fas fa-plus-circle mr-1"></i> ADD SECURITY ROLE
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header bg-white border-0 py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0">System Authority Registry</h3>
            <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest">{{ count($roles) }} ACTIVE ROLES</span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="roles-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4" style="width: 25%">Authority Identity</th>
                            <th>Permission Blueprint</th>
                            <th class="text-right pr-4">Metrics</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($roles as $role)
                            <tr>
                                <td class="align-middle pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center shadow-xs" style="width:45px; height:45px; border-radius: 12px;">
                                            <i class="fas fa-fingerprint text-primary"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark text-capitalize mb-0" style="font-size: 1rem;">{{ $role->name }}</span>
                                            <small class="text-muted text-uppercase font-weight-bold smallest letter-spacing-1">
                                                Tier Identifier: {{ strtoupper(Str::random(4)) }}
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <div class="d-flex flex-wrap" style="gap: 8px;">
                                        @forelse($role->permissions as $permission)
                                            <span class="badge badge-info-light text-info px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 border-0 shadow-none">
                                                <i class="fas fa-check-circle mr-1 opacity-50"></i> {{ $permission->name }}
                                            </span>
                                        @empty
                                            <span class="text-muted small font-italic opacity-50">
                                                <i class="fas fa-exclamation-circle mr-1"></i> No specific permissions mapped
                                            </span>
                                        @endforelse
                                    </div>
                                </td>
                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.roles.edit', $role->id) }}" 
                                           class="btn btn-white btn-sm text-info py-2" 
                                           data-toggle="tooltip" title="Edit Spectrum">
                                            <i class="fas fa-shield-alt mr-1"></i> EDIT
                                        </a>
                                        
                                        <form action="{{ route('admin.roles.destroy', $role->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2" 
                                                    data-toggle="tooltip" title="Purge Role"
                                                    onclick="return confirm('Deleting this role may affect users assigned to it. Proceed?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="3" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-user-lock fa-4x text-muted opacity-25 mb-3"></i>
                                        <h5 class="text-muted font-weight-bold">Hierarchy Is Empty</h5>
                                        <p class="small text-secondary">Configure your system's access hierarchy here.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="bg-primary-soft p-4 rounded-xl border border-primary-soft mt-4">
        <div class="d-flex align-items-center">
            <div class="icon-box bg-primary rounded-circle mr-3 d-flex align-items-center justify-content-center shadow-lg" style="width: 48px; height: 48px;">
                <i class="fas fa-shield-virus text-white"></i>
            </div>
            <div>
                <h6 class="font-weight-bold text-primary mb-1 smallest uppercase letter-spacing-1">Security Architecture Protocol</h6>
                <p class="text-muted mb-0 small font-weight-600">Roles define the fundamental access level for users. Changes to permission blueprints are applied in real-time to all active sessions holding this role.</p>
            </div>
        </div>
    </div>
</div>
@endsection

@push('js')
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
@endpush
