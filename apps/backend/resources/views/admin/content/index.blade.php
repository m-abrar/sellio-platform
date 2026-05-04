@extends('adminlte::page')

@section('title', 'Content Management')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-edit mr-2 text-primary opacity-50"></i> Page Content Manager
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Theme-specific content orchestration for dynamic platform verticals.
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

    {{-- Content Strategy Alert --}}
    <div class="card border-0 shadow-premium mb-4 overflow-hidden" style="border-radius: 20px;">
        <div class="card-body p-0">
            <div class="d-flex align-items-stretch">
                <div class="bg-warning px-4 d-flex align-items-center justify-content-center" style="min-width: 80px; opacity: 0.9;">
                    <i class="fas fa-layer-group text-white fa-2x shadow-sm"></i>
                </div>
                <div class="p-4">
                    <h6 class="mb-1 font-weight-bold text-dark smallest text-uppercase letter-spacing-1">Theme-Specific Content Strategy</h6>
                    <p class="mb-0 text-muted smallest font-weight-bold uppercase">Content sections are tied to specific skins. Modifying assets for one theme will not affect other visual configurations.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-file-invoice mr-1 text-primary opacity-50"></i> Editable Page Sections
            </h3>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    <i class="fas fa-cubes mr-1"></i> {{ $contentPages->count() }} FRAGMENTS
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="content-pages-table" class="table table-hover table-premium mb-0">
                    <thead class="bg-light text-uppercase smallest font-weight-bold">
                        <tr>
                            <th class="py-3 border-0 px-4">Internal Page Key</th>
                            <th class="py-3 border-0">Active Theme Skin</th>
                            <th class="py-3 border-0">Last Modification</th>
                            <th class="py-3 border-0 text-right px-4">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($contentPages as $contentEntry)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-square mr-3 bg-light border d-flex align-items-center justify-content-center shadow-xs" style="width:40px; height:40px; border-radius: 10px;">
                                            <i class="fas fa-file-alt text-primary opacity-75"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark text-capitalize">{{ str_replace('_', ' ', $contentEntry->page) }}</span>
                                            <code class="text-xs text-muted font-monospace">{{ $contentEntry->page }}</code>
                                        </div>
                                    </div>
                                </td>
                                
                                <td class="align-middle">
                                    <span class="badge badge-indigo-soft border border-indigo text-indigo px-3 py-1 text-uppercase" style="font-size: 0.65rem; letter-spacing: 0.5px;">
                                        <i class="fas fa-palette mr-1"></i> {{ $contentEntry->theme_key }}
                                    </span>
                                </td>
                                
                                <td class="align-middle">
                                    <div class="d-flex align-items-center text-muted small">
                                        <i class="far fa-clock mr-2 text-warning"></i>
                                        @isset($contentEntry->latest_update)
                                            <span class="font-weight-600">{{ \Carbon\Carbon::parse($contentEntry->latest_update)->diffForHumans() }}</span>
                                        @else
                                            <span class="text-light-gray italic">No history found</span>
                                        @endisset
                                    </div>
                                </td>
                                
                                <td class="text-right align-middle px-4">
                                    <a href="{{ route('admin.content.edit', ['page' => $contentEntry->page, 'theme_key' => $contentEntry->theme_key]) }}" 
                                       class="btn btn-primary rounded-pill shadow-premium px-4 font-weight-bold smallest">
                                        <i class="fas fa-pencil-alt mr-1"></i> EDIT CONTENT
                                    </a>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="text-center py-5">
                                    <div class="empty-state">
                                        <i class="fas fa-folder-open fa-4x text-light mb-3"></i>
                                        <h5 class="text-muted font-weight-bold">No Editable Sections Found</h5>
                                        <p class="small text-secondary">Ensure your page content registries are seeded correctly in the database.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer bg-white border-0 py-4 px-4">
             <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                <i class="fas fa-info-circle mr-1 text-info"></i> Global Content Ledger Synchronized
             </span>
        </div>
    </div>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
<style>
    /* Premium Table Styling */
    .table-premium thead th { 
        border-top: none; 
        text-transform: uppercase; 
        font-size: 0.7rem; 
        letter-spacing: 1.2px; 
        color: #8b959e; 
        padding: 1.25rem 1rem; 
        background-color: #fcfcfc;
    }
    
    .shadow-xs { box-shadow: 0 5px 10px rgba(0,0,0,0.01); }
    .font-weight-600 { font-weight: 600 !important; }
    .font-monospace { font-family: 'SFMono-Regular', Consolas, monospace; }
    
    .badge-indigo-soft { background-color: #f5f3ff; color: #5b21b6; border-color: #ddd6fe !important; }
    .text-indigo { color: #6366f1; }
    
    .table-hover tbody tr:hover {
        background-color: rgba(0, 123, 255, 0.02) !important;
        cursor: default;
    }

    .icon-square { transition: all 0.3s ease; }
    tr:hover .icon-square { background-color: #fff !important; transform: scale(1.1); }
    
    .btn-warning { color: #fff !important; background-color: #f39c12; border-color: #e67e22; }
    .btn-warning:hover { background-color: #e67e22; }
    
    .text-light-gray { color: #cbd5e0; }
    .text-xs { font-size: 0.7rem; }
</style>
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();

        if ($('#content-pages-table tbody tr:not(.empty-state)').length > 0) {
            $('#content-pages-table').DataTable({
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
                    "searchPlaceholder": "Search content keys...",
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
