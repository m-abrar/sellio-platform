@extends('adminlte::page')

@section('title', 'Menu Locations')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sitemap mr-2 text-primary"></i> Navigation Systems
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Orchestrate multi-level navigation structures across platform verticals.
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.welcome') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Dashboard
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Structural Overview --}}
    <div class="card card-premium overflow-hidden">
        <div class="card-header border-0 bg-white py-3 px-4">
            <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">Navigation Registry</h3>
            <div class="card-tools">
                <span class="badge badge-light border px-3 py-2 shadow-xs">
                    <i class="fas fa-network-wired mr-1 text-primary"></i> Registered Slots: {{ $menus->count() }}
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="menu-locations-table" class="table table-hover table-premium mb-0">
                    <thead>
                        <tr>
                            <th class="px-4">Structure Name</th>
                            <th>Technical Key</th>
                            <th>Assigned Theme</th>
                            <th>Last Modification</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($menus as $menu)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-square mr-3 bg-light border d-flex align-items-center justify-content-center shadow-xs" style="width:42px; height:42px; border-radius: 10px;">
                                            <i class="fas fa-route text-primary opacity-75"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark">{{ $menu->title }}</span>
                                            <small class="text-muted text-xs font-weight-600 text-uppercase" style="letter-spacing: 0.5px;">Navigation Provider</small>
                                        </div>
                                    </div>
                                </td>
                                
                                <td class="align-middle">
                                    <code class="premium-code">{{ $menu->location_key }}</code>
                                </td>
                                
                                <td class="align-middle">
                                    <span class="badge badge-indigo-soft border border-indigo text-indigo px-3 py-1 text-xs font-weight-bold">
                                        <i class="fas fa-palette mr-1"></i> {{ $menu->theme_key }}
                                    </span>
                                </td>
                                
                                <td class="align-middle">
                                    <div class="text-muted small d-flex align-items-center">
                                        <i class="far fa-clock mr-2 text-warning"></i> 
                                        {{ $menu->updated_at->diffForHumans() }}
                                    </div>
                                </td>
                                
                                <td class="text-right align-middle px-4">
                                    <a href="{{ route('admin.menu.edit', $menu) }}" 
                                       class="btn btn-primary btn-sm btn-flat shadow-xs font-weight-bold px-3">
                                        <i class="fas fa-layer-group mr-1"></i> Configure Links
                                    </a>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="5" class="text-center py-5">
                                    <i class="fas fa-map-signs fa-4x text-light mb-3"></i>
                                    <h5 class="text-muted font-weight-bold">No Menu Locations Defined</h5>
                                    <p class="small text-secondary">Registered navigation slots are provided by your active theme assets.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer bg-white border-0 py-3 text-center">
             <p class="mb-0 text-muted small">
                <i class="fas fa-info-circle mr-1 text-info"></i> 
                Looking to add a new location? Navigation placements are hard-coded in the **Theme Definition** files.
            </p>
        </div>
    </div>
</div>
@endsection

@section('css')
<style>
    /* Premium UI Components */
    .table-premium thead th { 
        border-top: none; 
        text-transform: uppercase; 
        font-size: 0.7rem; 
        letter-spacing: 1.2px; 
        color: #8b959e; 
        padding: 1.25rem 1rem; 
        background-color: #fcfcfc;
    }

    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .font-weight-600 { font-weight: 600 !important; }
    
    .premium-code { 
        background-color: #f1f5f9; 
        color: #2563eb !important; 
        padding: 0.2rem 0.5rem; 
        border-radius: 4px; 
        font-weight: 600; 
        font-size: 0.85rem; 
        border: 1px solid #e2e8f0; 
    }

    .badge-indigo-soft { background-color: #f5f3ff; color: #5b21b6; border-color: #ddd6fe !important; }
    .text-indigo { color: #6366f1; }
    
    .table-hover tbody tr:hover {
        background-color: rgba(0, 123, 255, 0.02) !important;
    }

    .icon-square { transition: all 0.3s ease; }
    tr:hover .icon-square { background-color: #fff !important; transform: scale(1.05); }

    .btn-flat { border-radius: 6px !important; }
</style>
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
            $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '250px');
        }
    });
</script>
@endsection
