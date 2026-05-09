{{--
    Administrative Taxonomy: Brand Registry
    
    This view provides the authoritative command center for manufacturer 
    identities and brand associations. It aggregates brand identities, 
    cross-module applicability, and publication status, facilitating 
    efficient auditing and moderation of the platform's manufacturer 
    taxonomies.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Collection $brands Collection of Brand model instances.
--}}
@extends('adminlte::page')

@section('title', __('Brands'))

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-md-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-award mr-2 text-primary"></i> {{ __('Manufacturer Brands') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Manage manufacturer profiles and brand associations for listings.') }}
                </p>
            </div>
            <div class="col-md-4 text-right">
                <a href="{{ route('admin.brands.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('Add Brand') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden rounded-24 datatable-premium-layout">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">{{ __('Manufacturer Brand Manifest') }}</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-gem mr-1"></i> {{ count($brands) }} {{ __('BRANDS FOUND') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                {{-- Applied 'table-premium' class from blueprint --}}
                <table id="brands-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center col-media-70">{{ __('Logo') }}</th>
                            <th>{{ __('Brand Details') }}</th>
                            <th>{{ __('Module Applicability') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th class="text-right px-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($brands as $brand)
                            <tr>

                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-sm">
                                        <img src="{{ $brand->thumbnail_url }}" 
                                             alt="{{ $brand->title }}" 
                                             onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $brand->title ?? 'N/A' }}</span>
                                    <small class="text-muted text-monospace smallest-0-75">/{{ $brand->slug }}</small>
                                </td>

                                <td class="align-middle">
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $brand])
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $brand->is_published ? 'badge-success-light text-success' : 'badge-danger-light text-danger' }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                        {{ $brand->is_published ? __('Active') : __('Inactive') }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.brands.edit', $brand->id) }}" class="btn text-info" data-toggle="tooltip" title="{{ __('Modify Identity') }}"><i class="fas fa-edit"></i></a>
                                        <form id="delete-brand-{{ $brand->id }}" action="{{ route('admin.brands.destroy', $brand->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger" data-toggle="tooltip" title="{{ __('Remove Brand') }}" onclick="confirmDelete('delete-brand-{{ $brand->id }}', '{{ __('Purge Brand?') }}', '{{ __('This action will remove the manufacturer identity and its associations.') }}')"><i class="fas fa-trash-alt"></i></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                        @include('admin._partials._empty-state', [
                            'colspan' => 5,
                            'icon' => 'fas fa-copyright',
                            'title' => __('No Brands Found'),
                            'description' => request('search') 
                                ? __('No results matching ":search"', ['search' => request('search')]) 
                                : __('Define manufacturer and brand names for better structure.'),
                            'button_text' => request('search') ? __('Clear Search') : __('Add Brand'),
                            'button_link' => request('search') ? route('admin.brands.index') : route('admin.brands.create')
                        ])
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
@endsection


@section('js')
    <script>
        $(function () {
            if ($('#brands-table tbody tr:not(.empty-state)').length > 0) {
                $('#brands-table').DataTable({
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
                    "order": [[1, "asc"]],
                    "columnDefs": [
                        { "orderable": false, "targets": [0, 4] }
                    ],
                    "language": {
                        "search": "",
                        "searchPlaceholder": "Search brands...",
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
