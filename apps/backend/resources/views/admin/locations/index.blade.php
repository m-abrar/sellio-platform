@extends('adminlte::page')

@section('title', 'Locations')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-map-marker-alt mr-2 text-primary"></i> Locations
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Locations</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="card card-primary card-outline shadow-sm">
        <div class="card-header border-0 bg-white py-3 d-flex justify-content-between align-items-center">
            <h3 class="card-title font-weight-600 text-muted mb-0">Geographic Operation Areas / Location Groups</h3>
            <a href="{{ route('admin.locations.create') }}" class="btn btn-primary btn-flat shadow-sm px-4">
                <i class="fas fa-plus-circle mr-1"></i> Add Location
            </a>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                {{-- DRY: Applied table-premium for the consistent brand hover effect --}}
                <table id="locations-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 70px;">Preview</th>
                            <th>Name</th>
                            <th>Regional Details</th>
                            <th>Module Applicability</th>
                            <th class="text-center">Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($locations as $location)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="icon-box-preview shadow-xs overflow-hidden mx-auto" style="width: 45px; height: 45px; border-radius: 8px;">
                                        <img src="{{ $location->thumbnail_url }}" 
                                             alt="{{ $location->title ?? 'Location' }}" 
                                             class="w-100 h-100"
                                             style="object-fit: cover;">
                                    </div>
                                </td>
                                
                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $location->title ?? 'N/A' }}</span>
                                    <small class="text-muted text-monospace" style="font-size: 0.75rem;">ID: #LOC-{{ $location->id }}</small>
                                </td>
                                
                                <td class="align-middle">
                                    <span class="text-muted small font-weight-600">
                                        <i class="fas fa-globe-americas mr-1 text-primary"></i>
                                        {{ $location->state ?? 'N/A' }}, {{ $location->country ?? 'N/A' }}
                                    </span>
                                </td>
                                
                                <td class="align-middle">
                                    <div class="d-flex flex-wrap">
                                        @php
                                            $modules = [
                                                'is_property'   => ['title' => 'Property',   'icon' => 'fas fa-home',          'color' => 'bg-indigo'],
                                                'is_event'      => ['title' => 'Event',      'icon' => 'fas fa-calendar-alt',  'color' => 'bg-olive'],
                                                'is_job'        => ['title' => 'Job',        'icon' => 'fas fa-briefcase',     'color' => 'bg-navy'],
                                                'is_auto'       => ['title' => 'Auto',       'icon' => 'fas fa-car',           'color' => 'bg-lightblue'],
                                                'is_service'    => ['title' => 'Service',    'icon' => 'fas fa-tools',         'color' => 'bg-maroon'],
                                                'is_classified' => ['title' => 'Classified', 'icon' => 'fas fa-tag',           'color' => 'bg-orange'],
                                            ];
                                            $hasModule = false;
                                        @endphp

                                        @foreach($modules as $column => $data)
                                            @if($location->$column)
                                                @php $hasModule = true; @endphp
                                                <span class="badge {{ $data['color'] }} text-xs mr-1 mb-1 shadow-sm px-2 py-1" 
                                                      data-toggle="tooltip" title="{{ $data['title'] }} Module">
                                                    <i class="{{ $data['icon'] }} fa-xs mr-1"></i> {{ $data['title'] }}
                                                </span>
                                            @endif
                                        @endforeach

                                        @if(!$hasModule)
                                            <span class="badge badge-secondary-light text-xs mr-1 mb-1 px-2 py-1">
                                                <i class="fas fa-globe mr-1"></i> Global Access
                                            </span>
                                        @endif
                                    </div>
                                </td>
                                
                                <td class="text-center align-middle">
                                    {{-- DRY: Using premium light status badges --}}
                                    <span class="badge {{ $location->is_published ? 'badge-success-light' : 'badge-danger-light' }} px-3 py-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                        {{ $location->is_published ? 'Active' : 'Draft' }}
                                    </span>
                                </td>
                                
                                <td class="text-right align-middle px-4">
                                    {{-- DRY: Standardized premium action group --}}
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.locations.edit', $location->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Modify Details">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        
                                        <form action="{{ route('admin.locations.destroy', $location->id) }}" 
                                              method="POST" 
                                              class="d-inline"
                                              onsubmit="return confirm('Are you sure you want to delete this location?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Remove Location">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="6" class="text-center py-5">
                                    <i class="fas fa-map-marked-alt fa-3x text-muted mb-3 d-block"></i>
                                    <h5 class="text-muted font-weight-bold">No Locations Found</h5>
                                    @if(request('search'))
                                        <p class="text-secondary small mb-3">No results matching "<strong>{{ request('search') }}</strong>".</p>
                                        <a href="{{ route('admin.locations.index') }}" class="btn btn-default btn-sm px-4">Clear Search</a>
                                    @else
                                        <p class="text-secondary small mb-3">Define your operation areas to start categorizing entries.</p>
                                        <a href="{{ route('admin.locations.create') }}" class="btn btn-primary btn-sm btn-flat px-4">
                                            <i class="fas fa-plus mr-1"></i> Add Your First Location
                                        </a>
                                    @endif
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

@section('js')
    <script>
        $(function () {
            // Only initialize DataTable if we have actual data (prevents breaking the empty state)
            if ($('#locations-table tbody tr:not(.empty-state)').length > 0) {
                $('#locations-table').DataTable({
                    "responsive": true,
                    "autoWidth": false,
                    "dom": '<"row px-4 pt-2"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-3"l><"col-sm-12 col-md-3"p>>t<"row px-4 pb-3"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    "order": [[1, "asc"]],
                    "columnDefs": [
                        { "orderable": false, "targets": [0, 3, 5] }
                    ],
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Filter...",
                        "lengthMenu": "_MENU_ per page"
                    }
                });
            }
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
@endsection
