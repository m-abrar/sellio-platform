@extends('adminlte::page')

@section('title', 'Content Management | Pages Registry')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-alt mr-2 text-primary opacity-50"></i> Content & Static Pages
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage system blueprints, informational assets, and footer navigation layers.</p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> Dashboard
                    </a>
                    <a href="{{ route('admin.pages.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                        <i class="fas fa-plus-circle mr-1"></i> ADD PAGE
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Main Table Card --}}
    <div class="card card-premium overflow-hidden">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-layer-group mr-2 text-primary opacity-50"></i> Static Content Registry
            </h3>
            <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase ml-auto">
                {{ count($pages) }} ACTIVE PAGES
            </span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="pages-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="pl-4 w-40-p">Title & Identity</th>
                            <th class="w-25-p">Permanent Link (Slug)</th>
                            <th class="text-center">Visibility</th>
                            <th class="text-right pr-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($pages as $page)
                            <tr>
                                <td class="align-middle pl-4">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-box-soft bg-primary-soft mr-3 d-flex align-items-center justify-content-center icon-box-45 rounded-12">
                                            <i class="fas {{ $page->type == 'system' ? 'fa-microchip text-warning' : 'fa-feather-alt text-primary' }}"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0 font-0-95">{{ $page->title }}</span>
                                            <span class="badge badge-primary-light text-primary px-2 py-1 rounded-pill font-weight-bold smallest uppercase mt-1">
                                                <i class="fas fa-tag mr-1 text-xs"></i> {{ $page->type }}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="smallest text-muted mb-1 font-weight-bold uppercase letter-spacing-1">Segment: <span class="text-primary">{{ $page->slug }}</span></div>
                                    <a href="{{ url($page->slug) }}" target="_blank" class="text-secondary smallest font-weight-bold d-flex align-items-center hover-primary">
                                        <i class="fas fa-external-link-alt mr-2"></i> 
                                        Live View
                                    </a>
                                </td>

                                <td class="text-center align-middle">
                                    @if($page->status == 'active')
                                        <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-check-circle mr-1"></i> PUBLISHED
                                        </span>
                                    @else
                                        <span class="badge badge-secondary-soft text-secondary px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-eye-slash mr-1"></i> ARCHIVED
                                        </span>
                                    @endif
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.pages.edit', $page->id) }}" 
                                           class="btn btn-white text-info py-2 px-3 d-inline-flex align-items-center" 
                                           data-toggle="tooltip" title="Edit Content">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form id="delete-form-{{ $page->id }}" action="{{ route('admin.pages.destroy', $page->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn btn-white text-danger py-2 px-3 border-left d-inline-flex align-items-center" 
                                                    data-toggle="tooltip" title="Purge Asset"
                                                    onclick="confirmDelete('delete-form-{{ $page->id }}', 'Purge Page?', 'This content will be permanently removed from the platform.', 'Purge Now')">
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
                                        <i class="fas fa-file-signature fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">Content Library Is Empty</h5>
                                        <p class="text-secondary small mb-3">No static pages have been architected yet.</p>
                                        <a href="{{ route('admin.pages.create') }}" class="btn btn-primary btn-sm px-4 rounded-pill font-weight-bold">
                                            <i class="fas fa-plus mr-1"></i> CREATE FIRST PAGE
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

@endsection

@section('js')
@include('admin._partials._sweetalert')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        
        if ($('#pages-table tbody tr:not(.empty-state)').length > 0) {
            $('#pages-table').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row px-0 pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                       '<"row"<"col-sm-12"tr>>' +
                       '<"row px-0 pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Filter content...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light w-250-p');
        }
    });
</script>
@endsection
