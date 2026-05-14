{{--
    Administrative Security: Permission Registry
    
    This view provides a high-fidelity audit trail of all security protocols 
    within the system. It enables granular management of gated resources, 
    facilitating atomic access control through identifier modification 
    and protocol revocation.
    
    @extends adminlte::page
    @context Security / Permissions Management
    @variables Collection $permissions List of all Spatie Permission models.
--}}
@extends('adminlte::page')

@section('title', __('Granular Permissions'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-7">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-fingerprint mr-2 text-primary"></i> {{ __('Granular Permissions') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('High-fidelity mapping of system gates and low-level access protocols.') }}</p>
            </div>
            <div class="col-sm-5 d-flex align-items-center justify-content-end">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> {{ __('Dashboard') }}
                    </a>
                    <a href="{{ route('admin.roles.index') }}" class="btn-back shadow-sm">
                        <i class="fas fa-user-shield"></i> {{ __('Access Roles') }}
                    </a>
                    <a href="{{ route('admin.permissions.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                        <i class="fas fa-plus-circle mr-1"></i> ADD GATED RESOURCE
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
                {{ count($permissions) }} {{ __('ACTIVE PROTOCOLS') }}
            </span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="permissions-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": true, "lengthChange": false, "searching": true, "ordering": true, "info": true}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4">{{ __('Resource Identifier') }}</th>
                            <th>{{ __('Guard Protocol') }}</th>
                            <th class="text-right pr-4">{{ __('Metrics') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($permissions as $permission)
                            <tr>
                                <td class="align-middle pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center icon-box-42 rounded-12">
                                            <i class="fas fa-code text-primary smallest"></i>
                                        </div>
                                        <div>
                                            <code class="text-primary font-weight-bold font-0-95 bg-transparent border-0 p-0">{{ $permission->name }}</code>
                                            <small class="d-block text-muted text-uppercase font-weight-bold mt-1 smallest-0-6 ls-0-8">
                                                {{ __('System Gate Architecture') }}
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <span class="badge badge-secondary-soft text-secondary px-3 py-2 rounded-pill font-weight-bold text-monospace smallest">
                                        <i class="fas fa-shield-alt mr-1 opacity-50"></i>{{ strtoupper($permission->guard_name ?? 'WEB') }}
                                    </span>
                                </td>
                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.permissions.edit', $permission->id) }}" 
                                           class="btn btn-white btn-sm text-info py-2" 
                                           data-toggle="tooltip" title="{{ __('Modify Identifier') }}">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        
                                        <form id="delete-permission-{{ $permission->id }}" action="{{ route('admin.permissions.destroy', $permission->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                             <button type="button" class="btn btn-white btn-sm text-danger py-2 px-3" 
                                                     data-toggle="tooltip" title="{{ __('Revoke Protocol') }}"
                                                     data-action="delete-trigger"
                                                     data-confirm-title="{{ __('Revoke Permission?') }}"
                                                     data-confirm-text="{{ __('This will remove the protocol from all associated roles.') }}">
                                                 <i class="fas fa-trash-alt"></i>
                                             </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                        @include('admin._partials._empty-state', [
                            'colspan' => 3,
                            'icon' => 'fas fa-lock',
                            'title' => __('Registry Is Vacant'),
                            'description' => __('Individual permissions define granular user capabilities within the system logic.'),
                        ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@push('css')
    @include('admin._partials._toggle-card-css')
@endpush

@push('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endpush
