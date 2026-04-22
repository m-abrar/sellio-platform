@extends('adminlte::page')

@section('title', 'Content Management')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-alt mr-2 text-primary"></i> Content & Pages
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Pages</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Main Table Card --}}
    <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">
                Page Registry <span class="badge badge-light border ml-2 px-2" style="font-weight: 500;">{{ count($pages) }} Total</span>
            </h3>
            <div class="card-tools">
                <a href="{{ route('admin.pages.create') }}" class="btn btn-primary shadow-sm px-4">
                    <i class="fas fa-plus-circle mr-1"></i> Add Content
                </a>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="pages-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4" style="width: 40%">Title & Identity</th>
                            <th style="width: 25%">Permanent Link (Slug)</th>
                            <th class="text-center">Visibility</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($pages as $page)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-shape mr-3 bg-light border rounded d-flex align-items-center justify-content-center shadow-xs" style="width:45px; height:45px; border-radius: 8px !important;">
                                            <i class="fas {{ $page->type == 'system' ? 'fa-microchip text-warning' : 'fa-feather-alt text-primary' }}"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $page->title }}</span>
                                            <span class="badge badge-primary-light text-primary text-xs px-2 mt-1 text-uppercase" style="letter-spacing: 0.5px;">
                                                {{ $page->type }}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="text-xs text-muted mb-1 font-weight-bold text-monospace uppercase">Slug: <span class="text-primary">{{ $page->slug }}</span></div>
                                    <a href="{{ url($page->slug) }}" target="_blank" class="text-secondary small d-flex align-items-center">
                                        <i class="fas fa-external-link-alt mr-2 text-xs"></i> 
                                        {{ Str::limit(url($page->slug), 30) }}
                                    </a>
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $page->status == 'active' ? 'badge-success-light' : 'badge-danger-light' }} px-3 py-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px; min-width: 95px;">
                                        <i class="fas {{ $page->status == 'active' ? 'fa-check-circle' : 'fa-times-circle' }} mr-1"></i>
                                        {{ $page->status == 'active' ? 'Published' : 'Hidden' }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.pages.edit', $page->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Edit Content">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form action="{{ route('admin.pages.destroy', $page->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Delete Page"
                                                    onclick="return confirm('Permanently remove this page?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="4" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-file-signature fa-3x text-muted mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No Content Created</h5>
                                        <p class="text-secondary mb-3">Start creating static pages or system content.</p>
                                        <a href="{{ route('admin.pages.create') }}" class="btn btn-primary btn-sm px-4">
                                            <i class="fas fa-plus mr-1"></i> Create First Page
                                        </a>
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

@section('css')
<style>
    /* Blueprint Layout Utilities */
    .table-premium thead th { border-top: none; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; color: #6c757d; }
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .text-monospace { font-family: 'SFMono-Regular', Consolas, monospace !important; }
    .uppercase { text-transform: uppercase; }

    /* Blueprint Light Badge Classes */
    .badge-success-light { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-danger-light { background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-primary-light { background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }

    /* Button Group Premium Style */
    .btn-group-premium .btn { border: 1px solid #e9ecef; background: #fff; }
    .btn-group-premium .btn:hover { background: #f8f9fa; }
    
    .font-weight-600 { font-weight: 600 !important; }

    .dataTables_filter { float: left !important; text-align: left !important; }
    .dataTables_filter input { margin-left: 0 !important; }
    .dataTables_length { float: right !important; text-align: right !important; }
</style>

@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        
        // Premium Datatable Initialization
        if ($('#pages-table tbody tr').length > 0 && !$('.empty-state').length) {
            $('#pages-table').DataTable({
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
                    "searchPlaceholder": "Search pages...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            // Style the search input to match blueprint
            $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '250px');
        }
    });
</script>
@endsection
