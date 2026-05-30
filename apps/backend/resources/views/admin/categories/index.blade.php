{{--
    Administrative Taxonomy: Category Registry
    
    This view provides the authoritative command center for managing the 
    platform's hierarchical classification system. It aggregates 
    category identities, parent-child relationships, cross-module 
    applicability, and publication status, facilitating efficient 
    auditing and moderation of the multi-dimensional taxonomy registry.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Paginator $categories Paginated collection of Category model instances.
--}}
@extends('adminlte::page')

@section('title', __('Categories Registry'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8 text-center text-sm-left mb-3 mb-sm-0">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-folder-open mr-2 text-primary"></i> {{ __('Market Segments') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Organize platform listings into a logical hierarchy and taxonomy.') }}</p>
            </div>
            <div class="col-sm-4 d-flex align-items-center justify-content-center justify-content-sm-end gap-12">
                <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                    <i class="fas fa-th-large"></i> Dashboard
                </a>
                <a href="{{ route('admin.categories.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('ADD CATEGORY') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Premium Search Filter --}}
    <div class="card registry-card-premium registry-filter-card mb-4 shadow-sm border-0" style="border-radius: 20px;">
        <div class="card-body d-flex align-items-center py-0" style="min-height: 66px;">
            <div class="d-flex flex-column flex-md-row align-items-center justify-content-between w-100">
                <div class="d-flex flex-row align-items-center mb-0">
                    <span class="form-label-premium mt-2 mr-3 font-weight-bold text-uppercase smallest letter-spacing-1 d-flex align-items-center">
                        <i class="fas fa-search mr-1 text-primary opacity-75"></i> {{ __('Taxonomy Search:') }}
                    </span>
                    <form action="{{ route('admin.categories.index') }}" method="GET" class="d-flex align-items-center m-0">
                        <div class="input-group input-group-premium col-search-reduced shadow-xs rounded-pill overflow-hidden border mr-2 mb-0">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-white border-0"><i class="fas fa-search text-xs text-muted"></i></span>
                            </div>
                            <input type="text" name="search" class="form-control border-0 px-0 mb-0" style="height: 36px;" 
                                   placeholder="{{ __('Search category...') }}" value="{{ request('search') }}">
                        </div>
                        <button type="submit" class="btn btn-primary-soft rounded-circle icon-box-38 shadow-xs border-0 d-flex align-items-center justify-content-center mb-0">
                            <i class="fas fa-sync-alt text-primary"></i>
                        </button>
                    </form>
                </div>
                
                <div class="d-flex align-items-center ml-md-auto mb-0">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs mb-0">
                        <i class="fas fa-sitemap mr-1"></i> {{ $categories->total() }} {{ __('Segments Found') }}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div class="card registry-table-card border-0 shadow-premium" style="border-radius: 24px; overflow: hidden;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">
                <i class="fas fa-database mr-2 text-primary"></i> {{ __('Global Taxonomy Registry') }}
            </h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="categories-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"order": [[1, "asc"]], "columnDefs": [{"orderable": false, "targets": [0, 4]}], "dom": "tr"}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center col-media-80 pl-4">{{ __('Icon') }}</th>
                            <th>{{ __('Segment Identity') }}</th>
                            <th>{{ __('Module Applicability Spectrum') }}</th>
                            <th class="text-center">{{ __('Lifecycle') }}</th>
                            <th class="text-right pr-4">{{ __('Operations') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($categories as $category)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-xs rounded-12 overflow-hidden border-0" style="width: 48px; height: 48px; margin: 0 auto;">
                                        <img src="{{ $category->thumbnail_url }}" 
                                             class="w-100 h-100 object-fit-cover"
                                             alt="{{ $category->title }}">
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
                                            <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">
                                                {{ $category->title ?? __('N/A') }}
                                            </span>
                                            <small class="text-muted font-weight-bold uppercase smallest-0-7 letter-spacing-1">
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
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $category])
                                </td>

                                <td class="text-center align-middle">
                                    @if($category->is_published)
                                        <span class="badge badge-success-light text-success px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">{{ __('ACTIVE') }}</span>
                                    @else
                                        <span class="badge badge-danger-light text-danger px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">{{ __('OFFLINE') }}</span>
                                    @endif
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.categories.edit', $category->id) }}" class="btn text-info" data-toggle="tooltip" title="{{ __('Modify Configuration') }}"><i class="fas fa-edit"></i></a>
                                        <form id="delete-category-{{ $category->id }}" action="{{ route('admin.categories.destroy', $category->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger" 
                                                    data-toggle="tooltip" title="{{ __('Purge Segment') }}" 
                                                    data-action="delete-trigger"
                                                    data-form-id="delete-category-{{ $category->id }}"
                                                    data-confirm-title="{{ __('Purge Taxonomy?') }}"
                                                    data-confirm-text="{{ __('This segment and its associations will be removed.') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 5,
                                'icon' => 'fas fa-tags',
                                'title' => __('Taxonomy Is Unmapped'),
                                'description' => request('search') 
                                    ? __('No segments matching ":search"', ['search' => request('search')])
                                    : __('Organize your marketplace items by creating your first segment.'),
                                'button_text' => __('Add Category'),
                                'button_link' => route('admin.categories.create')
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card-footer bg-white border-top py-4 px-4">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div class="small text-muted font-weight-bold uppercase letter-spacing-1 mb-3 mb-md-0">
                    <i class="fas fa-list-ol mr-2 text-primary opacity-50"></i>
                    {{ __('Showing :first - :last of :total segments', ['first' => $categories->firstItem(), 'last' => $categories->lastItem(), 'total' => $categories->total()]) }}
                </div>
                <div class="pagination-premium">
                    {{ $categories->appends(request()->except('page'))->links('pagination::bootstrap-4') }}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('js')
    <script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
