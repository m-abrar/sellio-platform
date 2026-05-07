{{--
    Administrative Taxonomy: Category Registry
    
    This view provides the authoritative command center for managing the 
    platform's hierarchical classification system. It aggregates 
    category identities, parent-child relationships, cross-module 
    applicability, and publication status, facilitating efficient 
    auditing and moderation of the multi-dimensional taxonomy registry.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Collection $categories Collection of Category model instances.
--}}
@extends('adminlte::page')

@section('title', 'Taxonomy Architecture | Market Segments')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-md-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-folder-open mr-2 text-primary opacity-50"></i> Taxonomy Architecture
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Organize platform listings into a logical hierarchy and taxonomy.
                </p>
            </div>
            <div class="col-md-4 text-right">
                <a href="{{ route('admin.categories.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                    <i class="fas fa-plus-circle mr-2"></i> Add Category
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden rounded-24 datatable-premium-layout">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Global Taxonomy Registry</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-sitemap mr-1"></i> {{ count($categories) }} CATEGORIES FOUND
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="categories-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center col-media-80">Icon</th>
                            <th>Segment Identity</th>
                            <th>Module Applicability Spectrum</th>
                            <th class="text-right">Lifecycle</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($categories as $category)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-sm">
                                        <img src="{{ $category->thumbnail_url }}" alt="{{ $category->title }}">
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        @if($category->parent_id)
                                            <div class="mr-2 text-primary opacity-50">
                                                <i class="fas fa-level-up-alt fa-rotate-90 fa-sm"></i>
                                            </div>
                                        @endif
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0 font-1-0">
                                                {{ $category->title ?? 'N/A' }}
                                            </span>
                                            <small class="text-muted font-weight-bold uppercase smallest letter-spacing-1">
                                                @if($category->parent)
                                                    <span class="text-primary">{{ strtoupper($category->parent->title) }}</span> 
                                                    <i class="fas fa-chevron-right mx-1 smallest opacity-50"></i>
                                                @endif
                                                /{{ $category->slug }}
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $category])
                                </td>

                                <td class="text-right align-middle">
                                    @if($category->is_published)
                                        <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase animate-pulse">ACTIVE</span>
                                    @else
                                        <span class="badge badge-danger-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase">OFFLINE</span>
                                    @endif
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.categories.edit', $category->id) }}" class="btn text-info" data-toggle="tooltip" title="Modify Configuration"><i class="fas fa-edit"></i></a>
                                        <form id="delete-category-{{ $category->id }}" action="{{ route('admin.categories.destroy', $category->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger" data-toggle="tooltip" title="Purge Segment" onclick="confirmDelete('delete-category-{{ $category->id }}', 'Purge Taxonomy?', 'This segment and its associations will be removed.')"><i class="fas fa-trash-alt"></i></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="5" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-tags fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">Taxonomy Is Unmapped</h5>
                                        <p class="text-secondary small">Organize your marketplace items by creating your first segment.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        @include('admin._partials._sweetalert')
    </div>
</div>
@endsection

@section('js')
    <script>
        $(function () {
            if ($('#categories-table tbody tr:not(.empty-state)').length > 0) {
                $('#categories-table').DataTable({
                    "paging": true,
                    "lengthChange": true,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "responsive": true,
                    "dom": '<"row"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                           '<"row"<"col-sm-12"tr>>' +
                           '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    "order": [[1, "asc"]],
                    "columnDefs": [ { "orderable": false, "targets": [0, 4] } ],
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Filter segments...",
                        "paginate": {
                            "previous": "<i class='fas fa-angle-left'></i>",
                            "next": "<i class='fas fa-angle-right'></i>"
                        }
                    }
                });
                $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light');
                $('.dataTables_length select').addClass('form-control form-control-premium shadow-none border-light');
            }
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
@stop
