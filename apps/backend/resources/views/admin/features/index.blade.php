{{--
    Administrative Taxonomy: Feature Registry
    
    This view provides the authoritative Dashboard for managing 
    technical specifications and attribute groupings. It aggregates 
    feature identities, cross-module availability, and publication 
    status, facilitating efficient auditing and moderation of the 
    platform's descriptive taxonomy registry.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Paginator $features Paginated collection of Feature model instances.
--}}
@extends('adminlte::page')

@section('title', __('Listing Features'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8 text-center text-sm-left mb-3 mb-sm-0">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-star mr-2 text-primary"></i> {{ __('Listing Features') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Manage technical specifications and attribute groupings for listings.') }}
                </p>
            </div>
            <div class="col-sm-4 d-flex align-items-center justify-content-center justify-content-sm-end gap-12">
                <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                    <i class="fas fa-th-large"></i> Dashboard
                </a>
                <a href="{{ route('admin.features.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('ADD FEATURE') }}
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
                        <i class="fas fa-search mr-1 text-primary opacity-75"></i> {{ __('Feature Search:') }}
                    </span>
                    <form action="{{ route('admin.features.index') }}" method="GET" class="d-flex align-items-center m-0">
                        <div class="input-group input-group-premium col-search-reduced shadow-xs rounded-pill overflow-hidden border mr-2 mb-0">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-white border-0"><i class="fas fa-search text-xs text-muted"></i></span>
                            </div>
                            <input type="text" name="search" class="form-control border-0 px-0 mb-0" style="height: 36px;" 
                                   placeholder="{{ __('Search feature...') }}" value="{{ request('search') }}">
                        </div>
                        <button type="submit" class="btn btn-primary-soft rounded-circle icon-box-38 shadow-xs border-0 d-flex align-items-center justify-content-center mb-0">
                            <i class="fas fa-sync-alt text-primary"></i>
                        </button>
                    </form>
                </div>
                
                <div class="d-flex align-items-center ml-md-auto mb-0">
                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs mb-0">
                        <i class="fas fa-star mr-1"></i> {{ $features->total() }} {{ __('Features Found') }}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div class="card registry-table-card border-0 shadow-premium" style="border-radius: 24px; overflow: hidden;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">
                <i class="fas fa-database mr-2 text-primary"></i> {{ __('Listing Features') }}
            </h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="features-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"order": [[1, "asc"]], "columnDefs": [{"orderable": false, "targets": [0, 4]}], "dom": "tr"}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center col-media-80 pl-4">{{ __('Preview') }}</th>
                            <th>{{ __('Feature Identity') }}</th>
                            <th>{{ __('Module Availability') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th class="text-right pr-4">{{ __('Operations') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($features as $feature)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-xs rounded-12 overflow-hidden border-0" style="width: 48px; height: 48px; margin: 0 auto;">
                                        @if($feature->thumbnail_url)
                                             <img src="{{ $feature->thumbnail_url }}" 
                                                  class="w-100 h-100 object-fit-cover"
                                                  alt="{{ $feature->title }}" 
                                                  data-fallback="{{ asset('images/fallbacks/default.jpg') }}">
                                        @else
                                            <div class="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                                                <i class="fas fa-star text-muted opacity-50"></i>
                                            </div>
                                        @endif
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $feature->title ?? __('Untitled') }}</span>
                                    <small class="text-muted font-italic smallest-0-7">{{ Str::limit($feature->description, 60) }}</small>
                                </td>

                                <td class="align-middle">
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $feature])
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $feature->is_published ? 'badge-success-light text-success' : 'badge-secondary-light text-secondary' }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                        {{ $feature->is_published ? __('Active') : __('Inactive') }}
                                    </span>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.features.edit', $feature->id) }}" class="btn text-info" data-toggle="tooltip" title="{{ __('Edit Configuration') }}"><i class="fas fa-edit"></i></a>
                                        <form id="delete-feature-{{ $feature->id }}" action="{{ route('admin.features.destroy', $feature->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                             <button type="button" class="btn text-danger" 
                                                    data-toggle="tooltip" title="{{ __('Remove Feature') }}" 
                                                    data-action="delete-trigger"
                                                    data-confirm-title="{{ __('Purge Feature?') }}"
                                                    data-confirm-text="{{ __('This feature and its associations will be removed.') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 5,
                                'icon' => 'fas fa-layer-group',
                                'title' => __('No Features Found'),
                                'description' => request('search') 
                                    ? __('No results matching ":search"', ['search' => request('search')]) 
                                    : __('Define characteristics like "Fuel Type", "Experience Level", or "Property Age".'),
                                'button_text' => request('search') ? __('Clear Search') : __('Add Your Initial Feature'),
                                'button_link' => request('search') ? route('admin.features.index') : route('admin.features.create')
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
                    {{ __('Showing :first - :last of :total features', ['first' => $features->firstItem(), 'last' => $features->lastItem(), 'total' => $features->total()]) }}
                </div>
                <div class="pagination-premium">
                    {{ $features->appends(request()->except('page'))->links('pagination::bootstrap-4') }}
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
