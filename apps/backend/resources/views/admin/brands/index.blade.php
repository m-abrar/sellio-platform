@extends('adminlte::page')

@section('title', 'Brands')

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-copyright mr-2 text-primary"></i> Brands
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Brands</li>
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
            <h3 class="card-title font-weight-600 text-muted mb-0">Brand Management</h3>
            <a href="{{ route('admin.brands.create') }}" class="btn btn-primary btn-flat shadow-sm px-4">
                <i class="fas fa-plus-circle mr-1"></i> Add Brand
            </a>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                {{-- Applied 'table-premium' class from blueprint --}}
                <table id="brands-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 70px;">Logo</th>
                            <th>Brand Details</th>
                            <th>Module Applicability</th>
                            <th class="text-center">Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($brands as $brand)
                            <tr>

                                <td class="text-center align-middle">
                                    <div class="icon-box-preview shadow-xs" style="width: 45px; height: 45px; border-radius: 8px; overflow:hidden; margin: auto;">
                                        <img src="{{ $brand->thumbnail_url }}" 
                                             alt="{{ $brand->title }}"
                                             class="w-100 h-100"
                                             style="object-fit: cover;">
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $brand->title ?? 'N/A' }}</span>
                                    <small class="text-muted text-monospace" style="font-size: 0.75rem;">/{{ $brand->slug }}</small>
                                </td>

                                <td class="align-middle"> 
                                    <div class="d-flex flex-wrap">
                                        @php
                                            $modules = [
                                                'is_property'   => ['title' => 'Property',   'icon' => 'fa-home',         'color' => 'bg-indigo'],
                                                'is_event'      => ['title' => 'Event',      'icon' => 'fa-calendar-alt', 'color' => 'bg-olive'],
                                                'is_job'        => ['title' => 'Job',        'icon' => 'fa-briefcase',    'color' => 'bg-navy'],
                                                'is_auto'       => ['title' => 'Auto',       'icon' => 'fa-car',          'color' => 'bg-lightblue'],
                                                'is_service'    => ['title' => 'Service',    'icon' => 'fa-tools',        'color' => 'bg-maroon'],
                                                'is_classified' => ['title' => 'Classified', 'icon' => 'fa-tag',          'color' => 'bg-orange'],
                                            ];
                                            $hasModule = false;
                                        @endphp

                                        @foreach($modules as $column => $data)
                                            @if($brand->$column)
                                                @php $hasModule = true; @endphp
                                                <span class="badge {{ $data['color'] }} text-xs mr-1 mb-1 shadow-xs px-2 py-1" 
                                                      data-toggle="tooltip" title="{{ $data['title'] }} Module">
                                                    <i class="fas {{ $data['icon'] }} fa-xs mr-1"></i> {{ $data['title'] }}
                                                </span>
                                            @endif
                                        @endforeach
                                        
                                        @if(!$hasModule)
                                            <span class="text-muted small italic">General / Unassigned</span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-center align-middle">
                                    {{-- Light badge style for a modern look --}}
                                    <span class="badge {{ $brand->is_published ? 'badge-success-light' : 'badge-danger-light' }} px-3 py-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                        {{ $brand->is_published ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    {{-- Standardized premium button group --}}
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.brands.edit', $brand->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Modify Settings">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        
                                        <form action="{{ route('admin.brands.destroy', $brand->id) }}" 
                                              method="POST" 
                                              class="d-inline"
                                              onsubmit="return confirm('Are you sure you want to delete this brand?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Delete Brand">
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
                                        <i class="fas fa-copyright fa-4x text-muted mb-3 opacity-25"></i>
                                        <h5 class="text-muted font-weight-bold">No Brands Found</h5>
                                        @if(request('search'))
                                            <p class="text-secondary small mb-3">No results matching "<strong>{{ request('search') }}</strong>".</p>
                                            <a href="{{ route('admin.brands.index') }}" class="btn btn-default btn-sm px-4">Clear Search</a>
                                        @else
                                            <p class="text-secondary small mb-3">Define manufacturer and brand names for better structure.</p>
                                            <a href="{{ route('admin.brands.create') }}" class="btn btn-primary btn-sm btn-flat px-4">
                                                <i class="fas fa-plus mr-1"></i> Add Brand
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

        @if(method_exists($brands, 'hasPages') && $brands->hasPages())
            <div class="card-footer bg-white py-3 border-top border-light">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="text-muted small">
                        Showing <strong>{{ $brands->firstItem() }}</strong> to <strong>{{ $brands->lastItem() }}</strong> of <strong>{{ $brands->total() }}</strong> brands
                    </div>
                    <div>
                        {{ $brands->links('pagination::bootstrap-4') }}
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
            if ($('#brands-table tbody tr:not(.empty-state)').length > 0) {
                if ($.fn.DataTable.isDataTable('#brands-table')) {
                    $('#brands-table').DataTable().destroy();
                }

                $('#brands-table').DataTable({
                    "responsive": true,
                    "autoWidth": false,
                    "dom": '<"row px-4 pb-3"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                    "order": [[1, "asc"]],
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Quick Search..."
                    },
                    "columnDefs": [
                        { "orderable": false, "targets": [0, 4] }
                    ]
                });
            }
            
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
@endsection
