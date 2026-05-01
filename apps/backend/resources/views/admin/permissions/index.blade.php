@extends('adminlte::page')

@section('title', 'Security Gates | Granular Permissions')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-fingerprint mr-2 text-primary"></i> Granular Permissions
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">High-fidelity mapping of system gates and low-level access protocols.</p>
            </div>
            <div class="col-sm-6 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 10px;">
                    <a href="{{ route('admin.roles.index') }}" class="btn btn-outline-primary btn-sm rounded-pill px-3 font-weight-bold shadow-xs border">
                        <i class="fas fa-user-shield mr-1"></i> ROLES
                    </a>
                    <a href="{{ route('admin.permissions.create') }}" class="btn btn-primary btn-sm rounded-pill px-4 font-weight-bold shadow-lg ml-2">
                        <i class="fas fa-plus-circle mr-1"></i> ADD GATED RESOURCE
                    </a>
                </div>
                <ol class="breadcrumb float-sm-right bg-transparent p-0 mt-3 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Permission Registry</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header bg-white border-0 py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0">Security Gate Registry</h3>
            <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest">{{ count($permissions) }} ACTIVE PROTOCOLS</span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="permissions-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4">Resource Identifier</th>
                            <th>Guard Protocol</th>
                            <th class="text-right pr-4">Metrics</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($permissions as $permission)
                            <tr>
                                <td class="align-middle pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center" style="width:42px; height:42px; border-radius: 12px;">
                                            <i class="fas fa-code text-primary smallest"></i>
                                        </div>
                                        <div>
                                            <code class="text-primary font-weight-bold" style="font-size: 0.95rem; background: transparent; border: none; padding: 0;">{{ $permission->name }}</code>
                                            <small class="d-block text-muted text-uppercase font-weight-bold mt-1" style="font-size: 0.6rem; letter-spacing: 0.8px;">
                                                System Gate Architecture
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <span class="badge badge-secondary-soft text-secondary px-3 py-2 rounded-pill font-weight-bold text-monospace" style="font-size: 0.7rem;">
                                        <i class="fas fa-shield-alt mr-1 opacity-50"></i>{{ strtoupper($permission->guard_name ?? 'WEB') }}
                                    </span>
                                </td>
                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.permissions.edit', $permission->id) }}" 
                                           class="btn btn-white btn-sm text-info py-2" 
                                           data-toggle="tooltip" title="Modify Identifier">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        
                                        <form action="{{ route('admin.permissions.destroy', $permission->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2" 
                                                    data-toggle="tooltip" title="Revoke Protocol"
                                                    onclick="return confirm('Deleting this will remove this permission from all associated roles. Continue?')">
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
                                        <i class="fas fa-lock fa-4x text-muted opacity-25 mb-3"></i>
                                        <h5 class="text-muted font-weight-bold">Registry Is Vacant</h5>
                                        <p class="small text-secondary">Individual permissions define granular user capabilities within the system logic.</p>
                                    </div>
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

@push('js')
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
@endpush
