@extends('adminlte::page')

@section('title', 'Taxonomy Architecture | Market Segments')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-tags mr-2 text-primary"></i> Taxonomy Architecture
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Define and organize hierarchal categories across all marketplace verticals.</p>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.categories.create') }}" class="btn btn-primary btn-sm rounded-pill px-4 font-weight-bold shadow-lg">
                    <i class="fas fa-plus-circle mr-1"></i> ADD SEGMENT
                </a>
                <ol class="breadcrumb float-sm-right bg-transparent p-0 mt-3 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Taxonomy</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0">Marketplace Taxonomy Registry</h3>
            <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest">{{ count($categories) }} SEGMENTS DEFINED</span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="categories-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center pl-4" style="width: 80px;">Icon</th>
                            <th>Segment Identity</th>
                            <th>Module Applicability Spectrum</th>
                            <th class="text-center">Lifecycle</th>
                            <th class="text-right pr-4">Metrics</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($categories as $category)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-xs rounded-lg overflow-hidden border" style="width: 45px; height: 45px; margin: auto;">
                                        <img src="{{ $category->thumbnail_url }}" alt="{{ $category->title }}" class="w-100 h-100 object-fit-cover">
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        @if($category->parent_id)
                                            <div class="mr-2 text-primary opacity-50">
                                                <i class="fas fa-level-up-alt fa-rotate-90 fa-sm"></i>
                                            </div>
                                        @endif
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0" style="font-size: 1rem;">
                                                {{ $category->title ?? 'N/A' }}
                                            </span>
                                            <small class="text-muted font-weight-bold uppercase smallest letter-spacing-1">
                                                @if($category->parent)
                                                    <span class="text-primary">{{ strtoupper($category->parent->title) }}</span> 
                                                    <i class="fas fa-chevron-right mx-1 smallest opacity-50"></i>
                                                @endif
                                                /{{ $category->slug }}
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="d-flex flex-wrap" style="gap: 6px;">
                                        @php
                                            $modules = [
                                                'is_property'   => ['title' => 'Property',   'icon' => 'fa-home',     'text' => 'primary'],
                                                'is_event'      => ['title' => 'Event',      'icon' => 'fa-calendar', 'text' => 'success'],
                                                'is_job'        => ['title' => 'Job',        'icon' => 'fa-briefcase','text' => 'dark'],
                                                'is_auto'       => ['title' => 'Auto',       'icon' => 'fa-car',      'text' => 'info'],
                                                'is_service'    => ['title' => 'Service',    'icon' => 'fa-tools',    'text' => 'danger'],
                                                'is_classified' => ['title' => 'Classified', 'icon' => 'fa-tag',      'text' => 'warning'],
                                            ];
                                            $hasModule = false;
                                        @endphp

                                        @foreach($modules as $column => $data)
                                            @if($category->$column)
                                                @php $hasModule = true; @endphp
                                                <span class="badge badge-{{ $data['text'] }}-light px-2 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 border-0" 
                                                      data-toggle="tooltip" title="{{ $data['title'] }} Engine">
                                                    <i class="fas {{ $data['icon'] }} mr-1"></i> {{ $data['title'] }}
                                                </span>
                                            @endif
                                        @endforeach

                                        @if(!$hasModule)
                                            <span class="text-muted smallest font-weight-bold uppercase italic opacity-50">Global Segment</span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-center align-middle">
                                    @if($category->is_published)
                                        <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase animate-pulse">ACTIVE</span>
                                    @else
                                        <span class="badge badge-danger-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase">OFFLINE</span>
                                    @endif
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.categories.edit', $category->id) }}" 
                                           class="btn btn-white btn-sm text-info py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="Modify Configuration">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        
                                        <form action="{{ route('admin.categories.destroy', $category->id) }}" 
                                              method="POST" 
                                              class="d-inline"
                                              onsubmit="return confirm('Permanently purge this taxonomy segment?')">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" 
                                                    data-toggle="tooltip" title="Purge Segment">
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
                                        <i class="fas fa-tags fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">Taxonomy Is Unmapped</h5>
                                        <p class="text-secondary small">Organize your marketplace items by creating your first segment.</p>
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

@push('js')
    <script>
        $(function () {
            if ($('#categories-table tbody tr:not(.empty-state)').length > 0) {
                $('#categories-table').DataTable({
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
                    "columnDefs": [ { "orderable": false, "targets": [0, 4] } ],
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Filter segments...",
                        "paginate": {
                            "previous": "<i class='fas fa-angle-left'></i>",
                            "next": "<i class='fas fa-angle-right'></i>"
                        }
                    }
                });
                $('.dataTables_filter input').addClass('form-control shadow-none border-light').css('width', '250px');
                $('.dataTables_length select').addClass('form-control form-control-sm shadow-none border-light').css('width', '80px');
            }
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
@endpush
