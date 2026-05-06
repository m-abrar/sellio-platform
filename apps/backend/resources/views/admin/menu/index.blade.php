@extends('adminlte::page')

@section('title', 'Menu Locations')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sitemap mr-2 text-primary opacity-50"></i> Navigation Systems
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Orchestrate multi-level navigation structures across platform verticals.
                </p>
            </div>
            <div class="col-sm-4 text-right">
                @include('admin._partials._back-button')
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Structural Overview --}}
    <div class="card border-0 shadow-premium overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-map mr-1 text-primary opacity-50"></i> Navigation Registry
            </h3>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    <i class="fas fa-network-wired mr-1"></i> {{ $menus->count() }} SLOTS
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="menu-locations-table" class="table table-hover table-premium mb-0">
                    <thead>
                        <tr>
                            <th class="pl-4">Structure Name</th>
                            <th>Technical Key</th>
                            <th>Assigned Theme</th>
                            <th>Last Modification</th>
                            <th class="text-right pr-4">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($menus as $menu)
                            <tr>
                                <td class="pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-square-premium mr-3">
                                            <i class="fas fa-route text-primary opacity-75"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark uppercase letter-spacing-1">{{ $menu->title }}</span>
                                            <small class="text-muted text-xs font-weight-bold text-uppercase ls-0-5">Navigation Provider</small>
                                        </div>
                                    </div>
                                </td>
                                
                                <td>
                                    <code class="premium-code">{{ $menu->location_key }}</code>
                                </td>
                                
                                <td>
                                    <span class="badge badge-indigo-soft px-3 py-1 text-xs font-weight-bold rounded-pill uppercase">
                                        <i class="fas fa-palette mr-1"></i> {{ $menu->theme_key }}
                                    </span>
                                </td>
                                
                                <td>
                                    <div class="text-muted smallest font-weight-bold uppercase d-flex align-items-center">
                                        <i class="far fa-clock mr-2 text-warning"></i> 
                                        {{ $menu->updated_at->diffForHumans() }}
                                    </div>
                                </td>
                                
                                <td class="text-right pr-4">
                                    <a href="{{ route('admin.menu.edit', $menu) }}" 
                                       class="btn btn-premium-soft btn-premium-soft-primary">
                                        <i class="fas fa-layer-group mr-1"></i> Configure Links
                                    </a>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="5" class="text-center py-5">
                                    <i class="fas fa-map-signs fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                    <h5 class="text-muted font-weight-bold smallest uppercase letter-spacing-1">No Menu Locations Defined</h5>
                                    <p class="small text-secondary mb-0">Registered navigation slots are provided by your active theme assets.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer bg-white border-0 py-4 px-4 text-center">
             <p class="mb-0 text-muted smallest font-weight-bold uppercase letter-spacing-1">
                <i class="fas fa-info-circle mr-1 text-info"></i> Navigation slots are defined within theme asset manifest files
            </p>
        </div>
    </div>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();

        if ($('#menu-locations-table tbody tr:not(.empty-state)').length > 0) {
            $('#menu-locations-table').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": false,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row px-0 pt-2"<"col-sm-12"f>>' + '<"row"<"col-sm-12"tr>>' + '<"row px-0 pb-3"<"col-sm-12"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Filter navigation systems...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            $('.dataTables_filter input').addClass('form-control shadow-none border-light w-250-p');
        }
    });
</script>
@endsection
