@extends('adminlte::page')

@section('title', 'Tags')

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-md-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-tags mr-2 text-primary"></i> Listing Tags
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Manage high-level classification labels for quick filtering and discovery.
                </p>
            </div>
            <div class="col-md-4 text-right">
                <a href="{{ route('admin.tags.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-1"></i> ADD TAG
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
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Listing Tags Catalog</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-hashtag mr-1"></i> {{ count($tags) }} TAGS FOUND
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="tags-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 70px;">Preview</th>
                            <th>Tag Details</th>
                            <th>Module Applicability</th>
                            <th class="text-center">Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($tags as $tag)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="icon-box-preview shadow-xs" style="width: 45px; height: 45px; border-radius: 8px; overflow:hidden; margin: auto; border: 1px solid #eee;">
                                        <img src="{{ $tag->thumbnail_url }}" 
                                             alt="{{ $tag->title ?? 'Tag' }}" 
                                             class="w-100 h-100"
                                             style="object-fit: cover;">
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $tag->title ?? 'N/A' }}</span>
                                    <small class="text-muted text-monospace" style="font-size: 0.75rem;">/{{ $tag->slug }}</small>
                                </td>

                                <td class="align-middle"> 
                                    <div class="d-flex flex-wrap">
                                        @php
                                            $modules = [
                                                'is_property'   => ['title' => 'Property',   'icon' => 'fa-home',         'color' => 'badge-indigo-light'],
                                                'is_event'      => ['title' => 'Event',      'icon' => 'fa-calendar-alt', 'color' => 'badge-olive-light'],
                                                'is_job'        => ['title' => 'Job',        'icon' => 'fa-briefcase',    'color' => 'badge-navy-light'],
                                                'is_auto'       => ['title' => 'Auto',       'icon' => 'fa-car',          'color' => 'badge-lightblue-light'],
                                                'is_service'    => ['title' => 'Service',    'icon' => 'fa-tools',        'color' => 'badge-maroon-light'],
                                                'is_classified' => ['title' => 'Classified', 'icon' => 'fa-tag',          'color' => 'badge-orange-light'],
                                            ];
                                            $hasModule = false;
                                        @endphp

                                        @foreach($modules as $column => $data)
                                            @if($tag->$column)
                                                @php $hasModule = true; @endphp
                                                <span class="badge {{ $data['color'] }} px-2 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 border-0 mr-1 mb-1" 
                                                      data-toggle="tooltip" 
                                                      title="{{ $data['title'] }} Module">
                                                    <i class="fas {{ $data['icon'] }} mr-1"></i> {{ $data['title'] }}
                                                </span>
                                            @endif
                                        @endforeach
                                        
                                        @if(!$hasModule)
                                            <span class="text-muted small italic">General / Unassigned</span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $tag->is_published ? 'badge-success-light' : 'badge-danger-light' }} px-3 py-1 text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                        {{ $tag->is_published ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.tags.edit', $tag->id) }}" 
                                           class="btn btn-white btn-sm text-info py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="Modify Settings">
                                             <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        
                                        <form action="{{ route('admin.tags.destroy', $tag->id) }}" 
                                              method="POST" 
                                              class="d-inline"
                                              onsubmit="return confirm('Are you sure you want to delete this tag?')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" 
                                                    data-toggle="tooltip" title="Delete Tag">
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
                                        <h5 class="text-muted font-weight-bold">No Tags Found</h5>
                                        @if(request('search'))
                                            <p class="text-secondary small mb-3">No results matching "<strong>{{ request('search') }}</strong>".</p>
                                            <a href="{{ route('admin.tags.index') }}" class="btn btn-default btn-sm px-4">Clear Search</a>
                                        @else
                                            <p class="text-secondary small mb-3">Group your items by adding searchable tags.</p>
                                            <a href="{{ route('admin.tags.create') }}" class="btn btn-primary btn-sm btn-flat px-4">
                                                <i class="fas fa-plus mr-1"></i> Add Tag
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
            if ($('#tags-table tbody tr:not(.empty-state)').length > 0) {
                $('#tags-table').DataTable({
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
                    "order": [[1, "asc"]],
                    "columnDefs": [
                        { "orderable": false, "targets": [0, 4] }
                    ],
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Search tags...",
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
