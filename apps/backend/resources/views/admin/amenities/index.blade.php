@extends('adminlte::page')

@section('title', 'Amenities')

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-md-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-bath mr-2 text-primary"></i> Amenities
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Manage supplementary features and convenience factors for listings.
                </p>
            </div>
            <div class="col-md-4 text-right">
                <a href="{{ route('admin.amenities.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                    <i class="fas fa-plus-circle mr-2"></i> Add Amenity
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
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Global Amenities Manifest</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-concierge-bell mr-1"></i> {{ count($amenities) }} AMENITIES FOUND
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                {{-- Refined: Applied table-premium for the brand-border hover effect --}}
                <table id="amenities-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 80px;">Icon</th>
                            <th>Feature Name</th>
                            <th>Module Categorization</th>
                            <th class="text-center">Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($amenities as $amenity)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-sm">
                                        @if(!empty($amenity->icon))
                                            <i class="{{ $amenity->icon }} text-primary"></i> 
                                        @else
                                            <i class="fas fa-concierge-bell text-muted opacity-50"></i>
                                        @endif
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $amenity->title ?? 'N/A' }}</span>
                                    <small class="text-muted text-monospace" style="font-size: 0.7rem;">REF: #AMN-{{ str_pad($amenity->id, 4, '0', STR_PAD_LEFT) }}</small>
                                </td>

                                <td class="align-middle">
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $amenity])
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ ($amenity->is_published ?? false) ? 'badge-success-light text-success' : 'badge-secondary-light text-secondary' }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                        {{ ($amenity->is_published ?? false) ? 'Active' : 'Draft' }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.amenities.edit', $amenity->id) }}" class="btn text-info" data-toggle="tooltip" title="Modify Feature"><i class="fas fa-edit"></i></a>
                                        <form id="delete-amenity-{{ $amenity->id }}" action="{{ route('admin.amenities.destroy', $amenity->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger" data-toggle="tooltip" title="Delete Amenity" onclick="confirmDelete('delete-amenity-{{ $amenity->id }}')"><i class="fas fa-trash-alt"></i></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="5" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-concierge-bell fa-4x text-muted mb-3 opacity-25"></i>
                                        <h5 class="text-muted font-weight-bold">No Amenities Found</h5>
                                        @if(request('search'))
                                            <p class="text-secondary small mb-3">No results matching "<strong>{{ request('search') }}</strong>".</p>
                                            <a href="{{ route('admin.amenities.index') }}" class="btn btn-default btn-sm px-4">Clear Search</a>
                                        @else
                                            <p class="text-secondary small mb-3">Enhance your listings by adding features like "WiFi", "Parking", or "Pet Friendly".</p>
                                            <a href="{{ route('admin.amenities.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                                                <i class="fas fa-plus mr-2"></i> Create First Amenity
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
            if ($('#amenities-table tbody tr:not(.empty-state)').length > 0) {
                $('#amenities-table').DataTable({
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
                        "searchPlaceholder": "Search amenities...",
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
