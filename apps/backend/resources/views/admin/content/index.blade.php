@extends('adminlte::page')

@section('title', 'Content Management')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-edit mr-2 text-primary"></i> Page Content Manager
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Content Pages</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Content Strategy Alert --}}
    <div class="card bg-white border-0 shadow-sm mb-4 overflow-hidden" style="border-radius: 10px;">
        <div class="card-body p-0">
            <div class="d-flex align-items-center">
                <div class="bg-warning px-4 d-flex align-items-center justify-content-center" style="align-self: stretch;">
                    <i class="fas fa-layer-group text-white fa-2x"></i>
                </div>
                <div class="p-3">
                    <h6 class="mb-1 font-weight-bold text-dark">Theme-Specific Content Management</h6>
                    <p class="mb-0 text-muted small">Content sections are tied to specific themes. Editing content for one theme will not affect the layout or text of another visual skin.</p>
                </div>
            </div>
        </div>
    </div>

    <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-bold text-muted">Editable Page Sections</h3>
            <div class="card-tools">
                <button type="button" class="btn btn-tool" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="content-pages-table" class="table table-hover table-premium mb-0">
                    <thead>
                        <tr>
                            <th class="px-4">Internal Page Key</th>
                            <th>Active Theme Skin</th>
                            <th>Last Modification</th>
                            <th class="text-right px-4">Actions</th>
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
                                       class="btn btn-warning btn-sm shadow-xs font-weight-bold px-3"
                                       data-toggle="tooltip" title="Modify text and image variables">
                                        <i class="fas fa-pencil-alt mr-1"></i> Edit Content
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
        <div class="card-footer bg-light border-0 py-3">
             <span class="text-xs text-uppercase font-weight-bold text-muted" style="letter-spacing: 1px;">
                <i class="fas fa-info-circle mr-1"></i> Total Registered Sections: {{ $contentPages->count() }}
             </span>
        </div>
    </div>
</div>
@endsection

@section('css')
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
    
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
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
                "dom": '<"row px-4 pt-2"<"col-sm-12"f>>' + '<"row"<"col-sm-12"tr>>' + '<"row px-4 pb-3"<"col-sm-12"p>>',
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
