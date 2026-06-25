{{--
    Administrative Taxonomy: Geographical Location Configuration
    
    This view serves as the primary interface for managing geographical 
    entities and regional operation hubs. It orchestrates labeling, 
    URI identification, spatial coordinates (latitude/longitude), 
    visual identities (cover images), and cross-module availability 
    (properties, products, etc.), ensuring a consistent spatial 
    taxonomy across all marketplace verticals.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Location $location The location model instance.
--}}
@extends('adminlte::page')

@section('title', ($location->exists ? 'Edit' : 'Add') . ' Location')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-map-marker-alt mr-2 text-primary"></i>
                    {{ $location->exists ? 'Modify Location' : 'New Location' }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $location->exists ? 'Update geographical boundaries and service availability.' : 'Define a new regional operation hub for the platform.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.locations.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to List
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ $location->exists ? route('admin.locations.update', $location->id) : route('admin.locations.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($location->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Configuration Column --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Location Configuration</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        {{-- Title Field --}}
                        <div class="form-group mb-4">
                            <label for="title" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Location Name <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" 
                                   class="form-control form-control-hero" 
                                   placeholder="{{ __('e.g. Downtown District') }}"
                                   value="{{ old('title', $location?->title ?? '') }}" required list="location-title-suggestions">
                            <datalist id="location-title-suggestions">
                                @foreach($titleSuggestions ?? [] as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">URL Slug</label>
                            <input type="text" name="slug" id="slug" 
                                   class="form-control form-control-premium text-monospace small"
                                   placeholder="{{ __('automatic-slug-generation') }}"
                                   value="{{ old('slug', $location?->slug ?? '') }}">
                            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        {{-- Regional Details Row --}}
                        <div class="row">
                            <div class="col-md-4 mb-4">
                                <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">State / Province</label>
                                <input type="text" name="state" class="form-control form-control-premium"
                                       value="{{ old('state', $location?->state ?? '') }}" placeholder="{{ __('California') }}">
                                @error('state') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Country <span class="text-danger">*</span></label>
                                <input type="text" name="country" class="form-control form-control-premium"
                                       value="{{ old('country', $location?->country ?? '') }}" placeholder="{{ __('United States') }}">
                                @error('country') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">ZIP Code</label>
                                <input type="text" name="zip_code" class="form-control form-control-premium"
                                       value="{{ old('zip_code', $location?->zip_code ?? '') }}" placeholder="90210">
                                @error('zip_code') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                            </div>
                        </div>

                        {{-- Coordinates Row --}}
                        <div class="row">
                            <div class="col-md-6 mb-4">
                                <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1"><i class="fas fa-arrows-alt-v mr-1"></i> Latitude</label>
                                <input type="text" id="latitude" name="latitude" class="form-control form-control-premium"
                                       value="{{ old('latitude', $location?->latitude ?? '') }}">
                                @error('latitude') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                            </div>
                            <div class="col-md-6 mb-4">
                                <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1"><i class="fas fa-arrows-alt-h mr-1"></i> Longitude</label>
                                <input type="text" id="longitude" name="longitude" class="form-control form-control-premium"
                                       value="{{ old('longitude', $location?->longitude ?? '') }}">
                                @error('longitude') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                            </div>
                        </div>

                        {{-- Description --}}
                        <div class="form-group mb-0">
                            <label for="description" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Location Description</label>
                            <textarea name="description" rows="4" 
                                      class="form-control rounded-xl border-light"
                                      placeholder="{{ __('Describe regional highlights or operation details...') }}">{{ old('description', $location?->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- DRY: Available In Grid --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Service Availability</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            @include('admin._partials._modules-checkboxes', ['model' => $location])
                        </div>
                    </div>
                </div>

                {{-- Gallery Partial --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Regional Gallery Collection</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Location::GALLERY_MEDIA,
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => 'location',
                            'id' => $location->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>
            </div>

            {{-- Sidebar --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $location,
                    'title' => 'LOCATION',
                ])
                
                @include('admin.locations.partials.map-card')

                {{-- Featured Image Partial --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Location::PRIMARY_MEDIA,
                            'label' => 'Main Cover Image',
                            'multiple' => false,
                            'model' => 'location',
                            'id' => $location->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('js')
<script src="{{ asset('admin-assets/pages/taxonomy-form.js') }}"></script>
@endpush

@if($location->exists)
    <form id="delete-trigger-form" action="{{ route('admin.locations.destroy', $location->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
@endif

@include('admin._partials._toggle-card-css')
