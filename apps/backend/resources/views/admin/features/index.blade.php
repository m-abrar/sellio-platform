@extends('adminlte::page')

@section('title', 'Listing Features')

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-star mr-2 text-primary"></i> Features
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Features</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="card card-primary card-outline shadow-sm">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">Management of Listing Features</h3>
            <div class="card-tools d-flex">
                <form action="{{ route('admin.features.index') }}" method="GET" class="mr-3">
                    <div class="input-group input-group-sm" style="width: 250px;">
                        <input type="text" name="search" class="form-control shadow-xs border-0 bg-light" 
                               placeholder="Search features..." value="{{ request('search') }}">
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-default shadow-xs border-0 bg-light">
                                <i class="fas fa-search text-muted"></i>
                            </button>
                        </div>
                    </div>
                </form>
                <a href="{{ route('admin.features.create') }}" class="btn btn-primary btn-flat shadow-sm px-4">
                    <i class="fas fa-plus-circle mr-1"></i> Add Feature
                </a>
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
                                    {{-- Feature Image Wrapper --}}
                                    <div class="feature-preview-container shadow-xs border rounded bg-light overflow-hidden mx-auto" 
                                         style="width: 50px; height: 50px;">
                                        @if($feature->thumbnail_url)
                                            <img src="{{ $feature->thumbnail_url }}" 
                                                 alt="{{ $feature->title }}" 
                                                 class="img-fluid h-100 w-100" 
                                                 style="object-fit: cover;">
                                        @else
                                            <div class="d-flex align-items-center justify-content-center h-100">
                                                <i class="fas fa-image text-muted opacity-50"></i>
                                            </div>
                                        @endif
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark">{{ $feature->title ?? 'Untitled' }}</span>
                                    <small class="text-muted font-italic">{{ Str::limit($feature->description, 40) }}</small>
                                </td>

                                <td class="align-middle"> 
                                    <div class="d-flex flex-wrap">
                                        @php
                                            $modules = [
                                                'is_property'   => ['title' => 'Property',   'icon' => 'fas fa-home',         'color' => 'bg-indigo'],
                                                'is_event'      => ['title' => 'Event',      'icon' => 'fas fa-calendar-alt', 'color' => 'bg-olive'],
                                                'is_job'        => ['title' => 'Job',        'icon' => 'fas fa-briefcase',    'color' => 'bg-navy'],
                                                'is_auto'       => ['title' => 'Auto',       'icon' => 'fas fa-car',          'color' => 'bg-lightblue'],
                                                'is_service'    => ['title' => 'Service',    'icon' => 'fas fa-tools',        'color' => 'bg-maroon'],
                                                'is_classified' => ['title' => 'Classified', 'icon' => 'fas fa-tag',          'color' => 'bg-orange'],
                                            ];
                                            $hasModule = false;
                                        @endphp

                                        @foreach($modules as $column => $data)
                                            @if($feature->$column)
                                                @php $hasModule = true; @endphp
                                                <span class="badge {{ $data['color'] }} text-xs mr-1 mb-1 shadow-xs px-2 py-1" 
                                                      data-toggle="tooltip" title="{{ $data['title'] }}">
                                                    <i class="{{ $data['icon'] }} fa-xs mr-1"></i> {{ $data['title'] }}
                                                </span>
                                            @endif
                                        @endforeach
                                        
                                        @if(!$hasModule)
                                            <span class="badge badge-dark text-xs px-2 py-1 shadow-sm">
                                                <i class="fas fa-globe-americas mr-1"></i> Global Feature
                                            </span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-center align-middle">
                                    {{-- Light-style Status Badges --}}
                                    <span class="badge {{ $feature->is_published ? 'badge-success-light' : 'badge-secondary-light' }} px-3 py-1 text-uppercase" style="font-size: 0.7rem;">
                                        {{ $feature->is_published ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.features.edit', $feature->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Edit Configuration">
                                            <i class="fas fa-edit"></i>
                                        </a>
                                        
                                        <form action="{{ route('admin.features.destroy', $feature->id) }}" 
                                              method="POST" 
                                              class="d-inline"
                                              onsubmit="return confirm('Archive this feature? User listings may be affected.')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Remove Feature">
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
                                        <i class="fas fa-layer-group fa-4x text-muted mb-3 opacity-25"></i>
                                        <h5 class="text-muted font-weight-bold">No Features Found</h5>
                                        @if(request('search'))
                                            <p class="text-secondary small mb-3">No results matching "<strong>{{ request('search') }}</strong>".</p>
                                            <a href="{{ route('admin.features.index') }}" class="btn btn-default btn-sm px-4">Clear Search</a>
                                        @else
                                            <p class="text-secondary small mb-3">Define characteristics like "Fuel Type", "Experience Level", or "Property Age".</p>
                                            <a href="{{ route('admin.features.create') }}" class="btn btn-primary btn-sm btn-flat px-4">
                                                <i class="fas fa-plus mr-1"></i> Add Your Initial Feature
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

        @if(method_exists($features, 'hasPages') && $features->hasPages())
            <div class="card-footer bg-white py-3 border-top border-light">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="text-muted small">
                        Showing <strong>{{ $features->firstItem() }}</strong> to <strong>{{ $features->lastItem() }}</strong> of <strong>{{ $features->total() }}</strong> features
                    </div>
                    <div>
                        {{ $features->links('pagination::bootstrap-4') }}
                    </div>
                </div>
            </div>
        @endif
    </div>
</div>
@endsection

@section('js')
    <script>
        $(function () {
            if ($('#features-table tbody tr:not(.empty-state)').length > 0) {
                $('#features-table').DataTable({
                    "responsive": true,
                    "autoWidth": false,
                    "order": [[1, "asc"]],
                    "columnDefs": [
                        { "orderable": false, "targets": [0, 4] }
                    ],
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Filter features..."
                    }
                });
            }
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
@endsection
