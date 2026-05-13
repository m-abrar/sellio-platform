{{--
    Administrative Taxonomy: Geographical Registry
    
    This view provides the authoritative command center for managing 
    regional operation hubs and geographical service boundaries. It 
    aggregates area identities, regional metadata (state, country), 
    cross-module applicability, and publication status, facilitating 
    efficient auditing and moderation of the platform's spatial 
    taxonomy registry.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Collection $locations Collection of Location model instances.
--}}
@extends('adminlte::page')

@section('title', 'Locations')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-md-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-map-marker-alt mr-2 text-primary"></i> {{ __('Geographic Areas') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Manage regional operational hubs and service availability boundaries.') }}
                </p>
            </div>
            <div class="col-md-4 text-right">
                <a href="{{ route('admin.locations.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('Add Location') }}
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
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">{{ __('Geographic Registry') }}</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-map-marked-alt mr-1"></i> {{ count($locations) }} {{ __('AREAS FOUND') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                {{-- DRY: Applied table-premium for the consistent brand hover effect --}}
                <table id="locations-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center col-media-70">{{ __('Preview') }}</th>
                            <th>{{ __('Name') }}</th>
                            <th>{{ __('Regional Details') }}</th>
                            <th>{{ __('Module Applicability') }}</th>
                            <th class="text-right">{{ __('Status') }}</th>
                            <th class="text-right px-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($locations as $location)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-sm">
                                        <img src="{{ $location->thumbnail_url }}" 
                                             alt="{{ $location->title ?? 'Location' }}" 
                                             data-fallback="{{ asset('images/fallbacks/default.jpg') }}">
                                    </div>
                                </td>
                                
                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $location->title ?? 'N/A' }}</span>
                                    <small class="text-muted text-monospace smallest-0-7">ID: #LOC-{{ $location->id }}</small>
                                </td>
                                
                                <td class="align-middle">
                                    <span class="text-muted small font-weight-600">
                                        <i class="fas fa-globe-americas mr-1 text-primary"></i>
                                        {{ $location->state ?? 'N/A' }}, {{ $location->country ?? 'N/A' }}
                                    </span>
                                </td>
                                
                                <td class="align-middle">
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $location])
                                </td>
                                
                                <td class="text-right align-middle">
                                    <span class="badge {{ $location->is_published ? 'badge-success-light text-success' : 'badge-danger-light text-danger' }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                        {{ $location->is_published ? __('Active') : __('Draft') }}
                                    </span>
                                </td>
                                
                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.locations.edit', $location->id) }}" class="btn text-info" data-toggle="tooltip" title="{{ __('Modify Details') }}"><i class="fas fa-edit"></i></a>
                                        <form id="delete-location-{{ $location->id }}" action="{{ route('admin.locations.destroy', $location->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger" 
                                                    data-toggle="tooltip" title="{{ __('Remove Location') }}" 
                                                    data-action="delete-trigger"
                                                    data-confirm-title="{{ __('Purge Geographic Area?') }}"
                                                    data-confirm-text="{{ __('This action will remove the regional operation hub and its associations.') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                        @include('admin._partials._empty-state', [
                            'colspan' => 6,
                            'icon' => 'fas fa-map-marked-alt',
                            'title' => __('No Locations Found'),
                            'description' => request('search') 
                                ? __('No results matching ":search"', ['search' => request('search')]) 
                                : __('Define your operation areas to start categorizing entries.'),
                            'button_text' => request('search') ? __('Clear Search') : __('Add Your First Location'),
                            'button_link' => request('search') ? route('admin.locations.index') : route('admin.locations.create')
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
    <script>
        $(function () {
            if ($('#locations-table tbody tr:not(.empty-state)').length > 0) {
                $('#locations-table').DataTable({
                    "order": [[1, "asc"]],
                    "columnDefs": [
                        { "orderable": false, "targets": [0, 3, 5] }
                    ]
                });
            }
        });
    </script>
@endsection
