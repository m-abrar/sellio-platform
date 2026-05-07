{{--
    Administrative Security: Access Architecture (Role Registry)
    
    This view manages the platform's security hierarchy. It provides a 
    comprehensive registry of defined roles and their associated permission 
    blueprints, enabling real-time authority management and security auditing.
    
    @extends adminlte::page
    @context RBAC (Role Based Access Control) Management
    @variables Collection $roles List of all defined Spatie Role models.
--}}
@extends('adminlte::page')

@section('title', 'Access Architecture | Authority Registry')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-user-shield mr-2 text-primary opacity-50"></i> Access Architecture
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage platform authority levels and map granular permissions to security roles.</p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-end">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> Dashboard
                    </a>
                    <a href="{{ route('admin.permissions.index') }}" class="btn-back shadow-sm">
                        <i class="fas fa-key"></i> Permissions
                    </a>
                    <a href="{{ route('admin.roles.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
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

    <div class="card border-0 shadow-premium overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-layer-group mr-2 text-primary opacity-50"></i> System Authority Registry
            </h3>
            <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase ml-auto">
                {{ count($roles) }} ACTIVE ROLES
            </span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="roles-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4 w-25-p">Authority Identity</th>
                            <th>Permission Blueprint</th>
                            <th class="text-right pr-4">Metrics</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($roles as $role)
                            <tr>
                                <td class="align-middle pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center shadow-xs icon-box-45 rounded-12">
                                            <i class="fas fa-fingerprint text-primary"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark text-capitalize mb-0 font-1-0">{{ $role->name }}</span>
                                            <small class="text-muted text-uppercase font-weight-bold smallest letter-spacing-1">
                                                Tier Identifier: {{ strtoupper(Str::random(4)) }}
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <div class="d-flex flex-wrap gap-8">
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
                                        
                                        <form id="delete-role-{{ $role->id }}" action="{{ route('admin.roles.destroy', $role->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn btn-white btn-sm text-danger py-2 px-3" 
                                                    data-toggle="tooltip" title="Purge Role"
                                                    onclick="confirmDelete('delete-role-{{ $role->id }}', 'Purge Security Role?', 'This may affect users assigned to this hierarchy tier.', 'Purge Role')">
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
            <div class="icon-box bg-primary rounded-circle mr-3 d-flex align-items-center justify-content-center shadow-lg icon-box-48">
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

@push('css')
    @include('admin._partials._toggle-card-css')
@endpush

@push('js')
@include('admin._partials._sweetalert')
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
            $('.dataTables_filter input').addClass('form-control form-control-sm form-control-premium shadow-none border-light w-220-p');
        }
    });
</script>
@endpush
