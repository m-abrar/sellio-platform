@extends('adminlte::page')

@section('title', 'Listing Types')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-md-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-layer-group mr-2 text-primary"></i> Listing Types
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Define classification groupings for specialized listing formats.
                </p>
            </div>
            <div class="col-md-4 text-right">
                <a href="{{ route('admin.types.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                    <i class="fas fa-plus-circle mr-2"></i> Add Type
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden rounded-24 datatable-premium-layout">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Listing Type Registry</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-layer-group mr-1"></i> {{ count($types) }} TYPES FOUND
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                {{-- Refined: Applied table-premium for the brand-border hover effect --}}
                <table id="types-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center col-media-80">Icon</th>
                            <th>Name / Identity</th>
                            <th>Module Utilization</th>
                            <th class="text-center">Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($types as $type)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-sm">
                                        <i class="{{ $type->icon ?? 'fas fa-layer-group' }} text-primary"></i>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $type->title ?? 'N/A' }}</span>
                                    <small class="text-muted text-monospace smallest-0-7">UID: #TYP-{{ $type->id }}</small>
                                </td>

                                <td class="align-middle">
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $type])
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $type->is_published ? 'badge-success-light text-success' : 'badge-secondary-light text-secondary' }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                        {{ $type->is_published ? 'Active' : 'Draft' }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.types.edit', $type->id) }}" class="btn text-info" data-toggle="tooltip" title="Modify Details"><i class="fas fa-edit"></i></a>
                                        <form id="delete-type-{{ $type->id }}" action="{{ route('admin.types.destroy', $type->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger" data-toggle="tooltip" title="Remove Type" onclick="confirmDelete('delete-type-{{ $type->id }}')"><i class="fas fa-trash-alt"></i></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="5" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-layer-group fa-3x text-muted mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No Types Found</h5>
                                        @if(request('search'))
                                            <p class="text-secondary small mb-3">No results matching "<strong>{{ request('search') }}</strong>".</p>
                                            <a href="{{ route('admin.types.index') }}" class="btn btn-default btn-sm px-4">Clear Search</a>
                                        @else
                                            <p class="text-secondary small mb-3">Organize your ecosystem by creating your first listing type.</p>
                                            <a href="{{ route('admin.types.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                                                <i class="fas fa-plus mr-2"></i> Create First Type
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
@endsection


@section('js')
    <script>
        $(function () {
            if ($('#types-table tbody tr:not(.empty-state)').length > 0) {
                $('#types-table').DataTable({
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
                    "columnDefs": [
                        { "orderable": false, "targets": [0, 2, 4] }
                    ],
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Search types...",
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
