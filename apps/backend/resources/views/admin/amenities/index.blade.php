{{--
    Administrative Taxonomy: Amenity Registry
    
    This view provides the authoritative command center for the 
    supplementary features and convenience factors classification. 
    It aggregates feature identities, cross-module categorizations, 
    and publication status, facilitating efficient auditing and 
    moderation of the platform's descriptive taxonomies.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Collection $amenities Collection of Amenity model instances.
--}}
@extends('adminlte::page')

@section('title', __('Amenities'))

{{-- Plugin handled by config/adminlte.php --}}
@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-md-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-bath mr-2 text-primary"></i> {{ __('Amenities') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Manage supplementary features and convenience factors for listings.') }}
                </p>
            </div>
            <div class="col-md-4 text-right">
                <a href="{{ route('admin.amenities.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('Add Amenity') }}
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
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">{{ __('Global Amenities Manifest') }}</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-concierge-bell mr-1"></i> {{ count($amenities) }} {{ __('AMENITIES FOUND') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                {{-- Refined: Applied table-premium for the brand-border hover effect --}}
                <table id="amenities-table" class="table table-hover table-premium mb-0 datatable-init">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center col-media-80">{{ __('Icon') }}</th>
                            <th>{{ __('Feature Name') }}</th>
                            <th>{{ __('Module Categorization') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th class="text-right px-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($amenities as $amenity)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-sm">
                                        @if(!empty($amenity->icon))
                                            <i class="{{ $amenity->icon }} text-primary"></i> 
                                        @else
                                            <i class="fas fa-concierge-bell text-muted opacity-50"></i>
                                        @endif
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $amenity->title ?? __('N/A') }}</span>
                                    <small class="text-muted text-monospace smallest-0-7">{{ __('REF') }}: #AMN-{{ str_pad($amenity->id, 4, '0', STR_PAD_LEFT) }}</small>
                                </td>

                                <td class="align-middle">
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $amenity])
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ ($amenity->is_published ?? false) ? 'badge-success-light text-success' : 'badge-secondary-light text-secondary' }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                        {{ ($amenity->is_published ?? false) ? __('Active') : __('Draft') }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.amenities.edit', $amenity->id) }}" class="btn text-info" data-toggle="tooltip" title="{{ __('Modify Feature') }}"><i class="fas fa-edit"></i></a>
                                        <form id="delete-amenity-{{ $amenity->id }}" action="{{ route('admin.amenities.destroy', $amenity->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                             <button type="button" class="btn text-danger" 
                                                    data-toggle="tooltip" title="{{ __('Delete Amenity') }}" 
                                                    data-action="delete-trigger"
                                                    data-confirm-title="{{ __('Purge Amenity?') }}"
                                                    data-confirm-text="{{ __('This action will remove the supplementary feature and its associations.') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                        @include('admin._partials._empty-state', [
                            'colspan' => 5,
                            'icon' => 'fas fa-concierge-bell',
                            'title' => __('No Amenities Found'),
                            'description' => request('search') 
                                ? __('No results matching ":search"', ['search' => request('search')]) 
                                : __('Enhance your listings by adding features like "WiFi", "Parking", or "Pet Friendly".'),
                            'button_text' => request('search') ? __('Clear Search') : __('Create First Amenity'),
                            'button_link' => request('search') ? route('admin.amenities.index') : route('admin.amenities.create')
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
