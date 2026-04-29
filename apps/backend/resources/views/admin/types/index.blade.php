@extends('adminlte::page')

@section('title', 'Listing Types')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-layer-group mr-2 text-primary"></i> Listing Types
                </h1>
            </div>
            <div class="col-sm-6">
                <div class="float-sm-right">
                    <a href="{{ route('admin.types.create') }}" class="btn btn-primary btn-flat shadow-sm px-4 text-white font-weight-bold">
                        <i class="fas fa-plus-circle mr-1"></i> Add Type
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="card card-primary card-outline shadow-sm">
        <div class="card-header border-0 bg-white py-3 d-flex justify-content-between align-items-center">
            <h3 class="card-title font-weight-600 text-muted mb-0">Global Categorization Types</h3>
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
                                                'Property'   => [$type->is_property, 'fas fa-home', 'bg-indigo'],
                                                'Event'      => [$type->is_event, 'fas fa-calendar-alt', 'bg-olive'],
                                                'Job'        => [$type->is_job, 'fas fa-briefcase', 'bg-navy'],
                                                'Auto'       => [$type->is_auto, 'fas fa-car', 'bg-lightblue'],
                                                'Service'    => [$type->is_service, 'fas fa-tools', 'bg-maroon'],
                                                'Classified' => [$type->is_classified, 'fas fa-tag', 'bg-orange'],
                                            ], fn($m) => $m[0]);
                                        @endphp

                                        @forelse($activeModules as $title => $data)
                                            <span class="badge {{ $data[2] }} text-xs mr-1 mb-1 shadow-xs px-2 py-1" 
                                                  data-toggle="tooltip" title="{{ $title }} Module">
                                                <i class="{{ $data[1] }} fa-xs mr-1"></i> {{ $title }}
                                            </span>
                                        @empty
                                            <span class="badge badge-secondary-light text-xs px-2 py-1">
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
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.types.edit', $type->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Modify Details">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        
                                        <form action="{{ route('admin.types.destroy', $type->id) }}" 
                                              method="POST" 
                                              class="d-inline"
                                              onsubmit="return confirm('Permanently delete this type?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
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
                    "dom": '<"row px-4 pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                           '<"row"<"col-sm-12"tr>>' +
                           '<"row px-4 pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
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
