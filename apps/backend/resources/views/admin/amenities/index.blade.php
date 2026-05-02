@extends('adminlte::page')

@section('title', 'Amenities')

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-swimming-pool mr-2 text-primary"></i> Amenities
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage global features, facility offerings, and comfort options.</p>
            </div>
            <div class="col-sm-6 d-flex flex-column align-items-end justify-content-center">
                <ol class="breadcrumb bg-transparent p-0 mb-0 smallest font-weight-bold text-uppercase letter-spacing-1">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}" class="text-primary">Dashboard</a></li>
                    <li class="breadcrumb-item active text-muted">Amenities</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">Global Amenities Manifest</h3>
            <div class="card-tools d-flex align-items-center">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-concierge-bell mr-1"></i> {{ count($amenities) }} AMENITIES FOUND
                </span>
                <a href="{{ route('admin.amenities.create') }}" class="btn btn-primary btn-sm rounded-pill px-4 font-weight-bold shadow-sm mr-2">
                    <i class="fas fa-plus-circle mr-1"></i> ADD AMENITY
                </a>
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
                                    {{-- Brand Identity Box --}}
                                    <div class="icon-box-preview bg-light shadow-xs d-flex align-items-center justify-content-center mx-auto" 
                                         style="width: 40px; height: 40px; border-radius: 8px; border: 1px solid #eee;">
                                        @if(!empty($amenity->icon))
                                            <i class="{{ $amenity->icon }} fa-lg text-primary"></i> 
                                        @else
                                            <i class="fas fa-question fa-sm text-muted"></i>
                                        @endif
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $amenity->title ?? 'N/A' }}</span>
                                    <small class="text-muted text-monospace" style="font-size: 0.7rem;">REF: #AMN-{{ str_pad($amenity->id, 4, '0', STR_PAD_LEFT) }}</small>
                                </td>

                                <td class="align-middle"> 
                                    <div class="d-flex flex-wrap">
                                        @php
                                            $modules = [
                                                'is_property'   => ['title' => 'Property',   'icon' => 'fas fa-home',         'color' => 'badge-indigo-light'],
                                                'is_event'      => ['title' => 'Event',      'icon' => 'fas fa-calendar-alt', 'color' => 'badge-olive-light'],
                                                'is_job'        => ['title' => 'Job',        'icon' => 'fas fa-briefcase',    'color' => 'badge-navy-light'],
                                                'is_auto'       => ['title' => 'Auto',       'icon' => 'fas fa-car',          'color' => 'badge-lightblue-light'],
                                                'is_service'    => ['title' => 'Service',    'icon' => 'fas fa-tools',        'color' => 'badge-maroon-light'],
                                                'is_classified' => ['title' => 'Classified', 'icon' => 'fas fa-tag',          'color' => 'badge-orange-light'],
                                            ];
                                            $hasModule = false;
                                        @endphp

                                        @foreach($modules as $column => $data)
                                            @if($amenity->$column)
                                                @php $hasModule = true; @endphp
                                                <span class="badge {{ $data['color'] }} px-2 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 border-0 mr-1 mb-1" 
                                                      data-toggle="tooltip" title="{{ $data['title'] }} Module">
                                                    <i class="{{ $data['icon'] }} mr-1"></i> {{ $data['title'] }}
                                                </span>
                                            @endif
                                        @endforeach
                                        
                                        @if(!$hasModule)
                                            <span class="badge badge-secondary-light text-xs px-2 py-1 italic">
                                                <i class="fas fa-info-circle mr-1"></i> Unassigned
                                            </span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-center align-middle">
                                    {{-- Applied: Premium light status badges --}}
                                    <span class="badge {{ ($amenity->is_published ?? false) ? 'badge-success-light' : 'badge-secondary-light' }} px-3 py-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                        {{ ($amenity->is_published ?? false) ? 'Active' : 'Draft' }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    {{-- Refined: Standardized premium action group --}}
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.amenities.edit', $amenity->id) }}" 
                                           class="btn btn-white btn-sm text-info py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="Modify Feature">
                                             <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        
                                        <form id="delete-amenity-{{ $amenity->id }}" action="{{ route('admin.amenities.destroy', $amenity->id) }}" 
                                              method="POST" 
                                              class="d-inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="button" class="btn btn-white btn-sm text-danger py-2 px-3" 
                                                    data-toggle="tooltip" title="Delete Amenity"
                                                    onclick="confirmDelete('delete-amenity-{{ $amenity->id }}')">
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
                                        <i class="fas fa-concierge-bell fa-4x text-muted mb-3 opacity-25"></i>
                                        <h5 class="text-muted font-weight-bold">No Amenities Found</h5>
                                        @if(request('search'))
                                            <p class="text-secondary small mb-3">No results matching "<strong>{{ request('search') }}</strong>".</p>
                                            <a href="{{ route('admin.amenities.index') }}" class="btn btn-default btn-sm px-4">Clear Search</a>
                                        @else
                                            <p class="text-secondary small mb-3">Enhance your listings by adding features like "WiFi", "Parking", or "Pet Friendly".</p>
                                            <a href="{{ route('admin.amenities.create') }}" class="btn btn-primary btn-sm btn-flat px-4">
                                                <i class="fas fa-plus mr-1"></i> Create First Amenity
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
                    "dom": '<"row px-4 pt-3"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                           '<"row"<"col-sm-12"tr>>' +
                           '<"row px-4 pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
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
                $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '250px');
                $('.dataTables_length select').addClass('form-control form-control-sm shadow-none border-light').css('width', '70px');
            }
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
@endsection
