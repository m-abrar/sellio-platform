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
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
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
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ $location->exists ? route('admin.locations.update', $location->id) : route('admin.locations.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($location->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Configuration Column --}}
            <div class="col-md-8">
                <div class="card card-premium overflow-hidden">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;">Location Configuration</h3>
                    </div>
                    <div class="card-body p-4">
                        {{-- Title Field --}}
                        <div class="form-group mb-4">
                            <label for="title" class="font-weight-600"><i class="fas fa-map-marker-alt mr-1 text-primary"></i> Location Name <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" 
                                   class="form-control form-control-lg @error('title') is-invalid @enderror" 
                                   placeholder="e.g. Downtown District"
                                   value="{{ old('title', $location?->title ?? '') }}" required list="location-title-suggestions">
                            <datalist id="location-title-suggestions">
                                @foreach(\App\Models\Location::select('title')->distinct()->limit(20)->pluck('title') as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        {{-- DRY: Monospace Slug Input --}}
                        <div class="form-group mb-4">
                            <label for="slug" class="font-weight-600 text-muted small">URL Slug</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-light border-right-0"><i class="fas fa-link fa-xs text-muted"></i></span>
                                </div>
                                <input type="text" name="slug" id="slug" 
                                       class="form-control form-control-monospace @error('slug') is-invalid @enderror"
                                       placeholder="automatic-slug-generation"
                                       value="{{ old('slug', $location?->slug ?? '') }}">
                            </div>
                            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        {{-- Regional Details Row --}}
                        <div class="row">
                            <div class="col-md-4 mb-4">
                                <label class="font-weight-600">State / Province</label>
                                <input type="text" name="state" class="form-control @error('state') is-invalid @enderror"
                                       value="{{ old('state', $location?->state ?? '') }}" placeholder="California">
                                @error('state') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="font-weight-600">Country <span class="text-danger">*</span></label>
                                <input type="text" name="country" class="form-control @error('country') is-invalid @enderror"
                                       value="{{ old('country', $location?->country ?? '') }}" placeholder="United States">
                                @error('country') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="font-weight-600">ZIP Code</label>
                                <input type="text" name="zip_code" class="form-control @error('zip_code') is-invalid @enderror"
                                       value="{{ old('zip_code', $location?->zip_code ?? '') }}" placeholder="90210">
                                @error('zip_code') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                        </div>

                        {{-- Coordinates Row --}}
                        <div class="row">
                            <div class="col-md-6 mb-4">
                                <label class="font-weight-600 text-muted small"><i class="fas fa-arrows-alt-v mr-1"></i> Latitude</label>
                                <input type="text" id="latitude" name="latitude" class="form-control @error('latitude') is-invalid @enderror"
                                       value="{{ old('latitude', $location?->latitude ?? '') }}">
                                @error('latitude') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                            <div class="col-md-6 mb-4">
                                <label class="font-weight-600 text-muted small"><i class="fas fa-arrows-alt-h mr-1"></i> Longitude</label>
                                <input type="text" id="longitude" name="longitude" class="form-control @error('longitude') is-invalid @enderror"
                                       value="{{ old('longitude', $location?->longitude ?? '') }}">
                                @error('longitude') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                        </div>

                        {{-- Description --}}
                        <div class="form-group mb-0">
                            <label for="description" class="font-weight-600">Location Description</label>
                            <textarea name="description" rows="4" 
                                      class="form-control @error('description') is-invalid @enderror" 
                                      placeholder="Describe regional highlights or operation details...">{{ old('description', $location?->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- DRY: Module Applicability Grid --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Service Availability</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            @php
                                $modules = [
                                    'is_property'   => ['icon' => 'fas fa-home',           'label' => 'Real Estate'],
                                    'is_event'      => ['icon' => 'fas fa-calendar-alt',   'label' => 'Events'],
                                    'is_job'        => ['icon' => 'fas fa-briefcase',      'label' => 'Job Board'],
                                    'is_auto'       => ['icon' => 'fas fa-car',            'label' => 'Automotive'],
                                    'is_service'    => ['icon' => 'fas fa-tools',          'label' => 'Professional Services'],
                                    'is_classified' => ['icon' => 'fas fa-th-large',       'label' => 'Marketplace'],
                                    'is_product'    => ['icon' => 'fas fa-shopping-bag',   'label' => 'Product'],
                                    'is_blog'       => ['icon' => 'fas fa-newspaper',      'label' => 'Blog'],
                                ];
                            @endphp

                            @include('admin._partials._modules-checkboxes', ['model' => $location])
                        </div>
                    </div>
                </div>

                {{-- Gallery Partial --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Regional Gallery Collection</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Location::GALLERY_MEDIA,
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => \App\Models\Location::class,
                            'id' => $location->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>
            </div>

            {{-- High Contrast Sidebar --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $location,
                    'title' => 'LOCATION',
                    'duplicate' => 'admin.locations.duplicate'
                ])
                @include('admin.locations.partials.map-card')

                {{-- Featured Image Partial --}}
                <div class="card card-premium mb-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Location::PRIMARY_MEDIA,
                            'label' => 'Main Cover Image',
                            'multiple' => false,
                            'model' => \App\Models\Location::class,
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
<script>
    $(document).ready(function () {
        // Auto-generate Slug Logic
        const titleInput = $('#title');
        const slugInput = $('#slug');

        titleInput.on('input', function () {
            if(!slugInput.data('edited')){
                let slug = $(this).val()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
                slugInput.val(slug);
            }
        });

        slugInput.on('change', function() {
            $(this).data('edited', true);
        });
    });
</script>
@endpush

@if($location->exists)
    <form id="delete-form" action="{{ route('admin.locations.destroy', $location->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this location?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form').submit();
                }
            })
        }
    </script>
@endif

@include('admin._partials._toggle-card-css')
