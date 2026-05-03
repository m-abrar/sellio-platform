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
                <a href="{{ route('admin.types.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-1"></i> ADD TYPE
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
                            <th class="text-center" style="width: 80px;">Icon</th>
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
                                    <div class="icon-box-preview bg-light shadow-xs d-flex align-items-center justify-content-center mx-auto" style="width: 40px; height: 40px; border-radius: 8px;">
                                        <i class="{{ $type->icon ?? 'fas fa-question' }} fa-lg text-primary"></i>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $type->title ?? 'N/A' }}</span>
                                    <small class="text-muted text-monospace" style="font-size: 0.7rem;">UID: #TYP-{{ $type->id }}</small>
                                </td>

                                <td class="align-middle"> 
                                    <div class="d-flex flex-wrap">
                                        @php
                                            $activeModules = array_filter([
                                                'Property'   => [$type->is_property, 'fas fa-home', 'badge-indigo-light'],
                                                'Event'      => [$type->is_event, 'fas fa-calendar-alt', 'badge-olive-light'],
                                                'Job'        => [$type->is_job, 'fas fa-briefcase', 'badge-navy-light'],
                                                'Auto'       => [$type->is_auto, 'fas fa-car', 'badge-lightblue-light'],
                                                'Service'    => [$type->is_service, 'fas fa-tools', 'badge-maroon-light'],
                                                'Classified' => [$type->is_classified, 'fas fa-tag', 'badge-orange-light'],
                                            ], fn($m) => $m[0]);
                                        @endphp

                                        @forelse($activeModules as $title => $data)
                                            <span class="badge {{ $data[2] }} px-2 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 border-0 mr-1 mb-1" 
                                                  data-toggle="tooltip" title="{{ $title }} Module">
                                                <i class="{{ $data[1] }} mr-1"></i> {{ $title }}
                                            </span>
                                        @empty
                                            <span class="badge badge-secondary-light px-2 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 border-0 mr-1 mb-1">
                                                <i class="fas fa-info-circle mr-1"></i> Unassigned
                                            </span>
                                        @endforelse
                                    </div>
                                </td>

                                <td class="text-center align-middle">
                                    {{-- Applied: Premium light status badges --}}
                                    <span class="badge {{ $type->is_published ? 'badge-success-light' : 'badge-secondary-light' }} px-3 py-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                        {{ $type->is_published ? 'Active' : 'Draft' }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    {{-- Refined: Standardized premium action group --}}
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.types.edit', $type->id) }}" 
                                           class="btn btn-white btn-sm text-info py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="Modify Details">
                                             <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        
                                        <form action="{{ route('admin.types.destroy', $type->id) }}" 
                                              method="POST" 
                                              class="d-inline"
                                              onsubmit="return confirm('Permanently delete this type?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" 
                                                    data-toggle="tooltip" title="Remove Type">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
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
                                            <a href="{{ route('admin.types.create') }}" class="btn btn-primary btn-sm btn-flat px-4">
                                                <i class="fas fa-plus mr-1"></i> Create First Type
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
            if ($('#types-table tbody tr:not(.empty-state)').length > 0) {
                $('#types-table').DataTable({
                    "paging": true,
                    "lengthChange": true,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "responsive": true,
                    "dom": '<"row pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                           '<"row"<"col-sm-12"tr>>' +
                           '<"row pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
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
                $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '250px');
                $('.dataTables_length select').addClass('form-control form-control-sm shadow-none border-light').css('width', '70px');
            }
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
@endsection
