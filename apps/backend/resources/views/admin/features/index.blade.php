@extends('adminlte::page')

@section('title', 'Listing Features')

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-md-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-star mr-2 text-primary"></i> Listing Features
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Manage technical specifications and attribute groupings for listings.
                </p>
            </div>
            <div class="col-md-4 text-right">
                <a href="{{ route('admin.features.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                    <i class="fas fa-plus-circle mr-2"></i> Add Feature
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Product Features Registry</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-star mr-1"></i> {{ count($features) }} FEATURES FOUND
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                {{-- Premium Hover Interaction --}}
                <table id="features-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 100px;">Preview</th>
                            <th>Feature Identity</th>
                            <th>Module Availability</th>
                            <th class="text-center">Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($features as $feature)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-sm">
                                        @if($feature->thumbnail_url)
                                            <img src="{{ $feature->thumbnail_url }}" 
                                                 alt="{{ $feature->title }}" 
                                                 onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        @else
                                            <i class="fas fa-star text-muted opacity-50"></i>
                                        @endif
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark smallest uppercase letter-spacing-1">{{ $feature->title ?? 'Untitled' }}</span>
                                    <small class="text-muted font-italic">{{ Str::limit($feature->description, 40) }}</small>
                                </td>

                                <td class="align-middle">
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $feature])
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $feature->is_published ? 'badge-success-light text-success' : 'badge-secondary-light text-secondary' }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                        {{ $feature->is_published ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.features.edit', $feature->id) }}" class="btn text-info" data-toggle="tooltip" title="Edit Configuration"><i class="fas fa-edit"></i></a>
                                        <form id="delete-feature-{{ $feature->id }}" action="{{ route('admin.features.destroy', $feature->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger" data-toggle="tooltip" title="Remove Feature" onclick="confirmDelete('delete-feature-{{ $feature->id }}')"><i class="fas fa-trash-alt"></i></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="5" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-layer-group fa-4x text-muted mb-3 opacity-25"></i>
                                        <h5 class="text-muted font-weight-bold">No Features Found</h5>
                                        @if(request('search'))
                                            <p class="text-secondary small mb-3">No results matching "<strong>{{ request('search') }}</strong>".</p>
                                            <a href="{{ route('admin.features.index') }}" class="btn btn-default btn-sm px-4">Clear Search</a>
                                        @else
                                            <p class="text-secondary small mb-3">Define characteristics like "Fuel Type", "Experience Level", or "Property Age".</p>
                                            <a href="{{ route('admin.features.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                                                <i class="fas fa-plus mr-2"></i> Add Your Initial Feature
                                            </a>
                                        @endif
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

@section('css')
@include('admin._partials._toggle-card-css')
<style>
    .dataTables_filter { float: left !important; text-align: left !important; }
    .dataTables_filter input { margin-left: 0 !important; }
    .dataTables_length { float: right !important; text-align: right !important; }
</style>
@endsection


@section('js')
    <script>
        $(function () {
            if ($('#features-table tbody tr:not(.empty-state)').length > 0) {
                $('#features-table').DataTable({
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
                    "columnDefs": [
                        { "orderable": false, "targets": [0, 4] }
                    ],
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Search features...",
                        "paginate": {
                            "previous": "<i class='fas fa-angle-left'></i>",
                            "next": "<i class='fas fa-angle-right'></i>"
                        },
                        "lengthMenu": "_MENU_ per page"
                    }
                });
                $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light');
                $('.dataTables_length select').addClass('form-control form-control-premium shadow-none border-light');
            }
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
@endsection
