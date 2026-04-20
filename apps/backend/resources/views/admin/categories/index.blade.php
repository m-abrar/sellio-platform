@extends('adminlte::page')

@section('title', 'Categories')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-tags mr-2 text-primary"></i> Categories
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Categories</li>
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
            <h3 class="card-title font-weight-600 text-muted mb-0">Taxonomy Management</h3>
            <a href="{{ route('admin.categories.create') }}" class="btn btn-primary btn-flat shadow-sm px-4">
                <i class="fas fa-plus-circle mr-1"></i> Add Category
            </a>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                {{-- DRY: Added 'table-premium' class for the hover effect --}}
                <table id="categories-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 70px;">Icon</th>
                            <th>Category Details</th>
                            <th>Module Applicability</th>
                            <th class="text-center">Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($categories as $category)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="icon-box-preview shadow-xs" style="width: 45px; height: 45px; border-radius: 8px; overflow:hidden; margin: auto;">
                                        <img src="{{ $category->thumbnail_url }}" 
                                             alt="{{ $category->title }}"
                                             class="w-100 h-100"
                                             style="object-fit: cover;">
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        @if($category->parent_id)
                                            <div class="mr-2 text-muted">
                                                {{-- Visual indicator for sub-category --}}
                                                <i class="fas fa-level-up-alt fa-rotate-90 fa-xs"></i>
                                            </div>
                                        @endif
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">
                                                {{ $category->title ?? 'N/A' }}
                                            </span>
                                            <small class="text-muted text-monospace" style="font-size: 0.75rem;">
                                                @if($category->parent)
                                                    <span class="text-primary">{{ $category->parent->title }}</span> 
                                                    <i class="fas fa-chevron-right mx-1 fa-xs"></i>
                                                @endif
                                                /{{ $category->slug }}
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="d-flex flex-wrap">
                                        @php
                                            $modules = [
                                                'is_property'   => ['title' => 'Property',   'icon' => 'fa-home',     'color' => 'bg-indigo'],
                                                'is_event'      => ['title' => 'Event',      'icon' => 'fa-calendar', 'color' => 'bg-olive'],
                                                'is_job'        => ['title' => 'Job',        'icon' => 'fa-briefcase','color' => 'bg-navy'],
                                                'is_auto'       => ['title' => 'Auto',       'icon' => 'fa-car',      'color' => 'bg-lightblue'],
                                                'is_service'    => ['title' => 'Service',    'icon' => 'fa-tools',    'color' => 'bg-maroon'],
                                                'is_classified' => ['title' => 'Classified', 'icon' => 'fa-tag',      'color' => 'bg-orange'],
                                            ];
                                            $hasModule = false;
                                        @endphp

                                        @foreach($modules as $column => $data)
                                            @if($category->$column)
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
                                    {{-- DRY: Using reusable light badge classes --}}
                                    <span class="badge {{ $category->is_published ? 'badge-success-light' : 'badge-danger-light' }} px-3 py-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                        {{ $category->is_published ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>

                                

                                <td class="text-right align-middle px-4">
                                    {{-- DRY: Using 'btn-group-premium' for standardized look --}}
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.categories.edit', $category->id) }}" 
                                           class="btn btn-default btn-sm text-info" 
                                           data-toggle="tooltip" title="Modify Settings">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        
                                        <form action="{{ route('admin.categories.destroy', $category->id) }}" 
                                              method="POST" 
                                              class="d-inline"
                                              onsubmit="return confirm('Are you sure you want to delete this category?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" 
                                                    data-toggle="tooltip" title="Delete Category">
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
                                        <i class="fas fa-tags fa-4x text-muted mb-3 opacity-25"></i>
                                        <h5 class="text-muted font-weight-bold">No Categories Found</h5>
                                        @if(request('search'))
                                            <p class="text-secondary small mb-3">No results matching "<strong>{{ request('search') }}</strong>".</p>
                                            <a href="{{ route('admin.categories.index') }}" class="btn btn-default btn-sm px-4">Clear search</a>
                                        @else
                                            <p class="text-secondary small mb-3">Organize your marketplace items by creating your first category.</p>
                                            <a href="{{ route('admin.categories.create') }}" class="btn btn-primary btn-sm btn-flat px-4">
                                                <i class="fas fa-plus mr-1"></i> Create First Category
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

        @if(method_exists($categories, 'hasPages') && $categories->hasPages())
            <div class="card-footer bg-white py-3 border-top border-light">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="text-muted small">
                        Showing <strong>{{ $categories->firstItem() }}</strong> to <strong>{{ $categories->lastItem() }}</strong> of <strong>{{ $categories->total() }}</strong> categories
                    </div>
                    <div>
                        {{ $categories->links('pagination::bootstrap-4') }}
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
            if ($('#categories-table tbody tr:not(.empty-state)').length > 0) {
                if ($.fn.DataTable.isDataTable('#categories-table')) {
                    $('#categories-table').DataTable().destroy();
                }

                $('#categories-table').DataTable({
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
