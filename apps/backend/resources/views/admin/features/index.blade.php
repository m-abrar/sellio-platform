{{--
    Administrative Taxonomy: Feature Registry
    
    This view provides the authoritative command center for managing 
    technical specifications and attribute groupings. It aggregates 
    feature identities, cross-module availability, and publication 
    status, facilitating efficient auditing and moderation of the 
    platform's descriptive taxonomy registry.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Collection $features Collection of Feature model instances.
--}}
@extends('adminlte::page')

@section('title', __('Listing Features'))

{{-- Plugin handled by config/adminlte.php --}}
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
            <div class="col-sm-4 d-flex align-items-center justify-content-center justify-content-sm-end">
                <a href="{{ route('admin.features.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('Add Feature') }}
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
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">{{ __('Product Features Registry') }}</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-star mr-1"></i> {{ count($features) }} {{ __('FEATURES FOUND') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                {{-- Premium Hover Interaction --}}
                <table id="features-table" class="table table-hover table-premium mb-0 datatable-init">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center col-media-100">{{ __('Preview') }}</th>
                            <th>{{ __('Feature Identity') }}</th>
                            <th>{{ __('Module Availability') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th class="text-right px-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($features as $feature)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-sm">
                                        @if($feature->thumbnail_url)
                                             <img src="{{ $feature->thumbnail_url }}" 
                                                  alt="{{ $feature->title }}" 
                                                  data-fallback="{{ asset('images/fallbacks/default.jpg') }}">
                                        @else
                                            <i class="fas fa-star text-muted opacity-50"></i>
                                        @endif
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark smallest uppercase letter-spacing-1">{{ $feature->title ?? __('Untitled') }}</span>
                                    <small class="text-muted font-italic">{{ Str::limit($feature->description, 40) }}</small>
                                </td>

                                <td class="align-middle">
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $feature])
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $feature->is_published ? 'badge-success-light text-success' : 'badge-secondary-light text-secondary' }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                        {{ $feature->is_published ? __('Active') : __('Inactive') }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
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

        
    </div>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection


@section('js')
    <script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
