@extends('adminlte::page')

@section('title', (isset($location) ? 'Edit' : 'Add') . ' Location')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-map-marker-alt mr-2 text-primary"></i>
                    {{ isset($location) ? 'Modify Location' : 'New Location' }}
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.locations.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to List
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ isset($location) ? route('admin.locations.update', $location->id) : route('admin.locations.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if(isset($location)) @method('PATCH') @endif

        <div class="row">
            {{-- Main Configuration Column --}}
            <div class="col-md-8">
                <div class="card card-primary card-outline shadow-sm">
                    <div class="card-header border-0 bg-white py-3">
                        <h3 class="card-title font-weight-bold text-dark">Location Configuration</h3>
                    </div>
                    <div class="card-body">
                        {{-- Title Field --}}
                        <div class="form-group mb-4">
                            <label for="title" class="font-weight-600"><i class="fas fa-map-marker-alt mr-1 text-primary"></i> Location Name <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" 
                                   class="form-control form-control-lg form-control-border @error('title') is-invalid @enderror" 
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
                            <label for="slug" class="font-weight-600 text-muted">URL Slug</label>
                            <div class="input-group">
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
                                <input type="text" name="state" class="form-control form-control-border @error('state') is-invalid @enderror"
                                       value="{{ old('state', $location?->state ?? '') }}" placeholder="California">
                                @error('state') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="font-weight-600">Country <span class="text-danger">*</span></label>
                                <input type="text" name="country" class="form-control form-control-border @error('country') is-invalid @enderror"
                                       value="{{ old('country', $location?->country ?? '') }}" placeholder="United States">
                                @error('country') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                            <div class="col-md-4 mb-4">
                                <label class="font-weight-600">ZIP Code</label>
                                <input type="text" name="zip_code" class="form-control form-control-border @error('zip_code') is-invalid @enderror"
                                       value="{{ old('zip_code', $location?->zip_code ?? '') }}" placeholder="90210">
                                @error('zip_code') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                        </div>

                        {{-- Coordinates Row --}}
                        <div class="row">
                            <div class="col-md-6 mb-4">
                                <label class="font-weight-600 text-muted small"><i class="fas fa-arrows-alt-v mr-1"></i> Latitude</label>
                                <input type="text" id="latitude" name="latitude" class="form-control form-control-border @error('latitude') is-invalid @enderror"
                                       value="{{ old('latitude', $location?->latitude ?? '') }}">
                                @error('latitude') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                            <div class="col-md-6 mb-4">
                                <label class="font-weight-600 text-muted small"><i class="fas fa-arrows-alt-h mr-1"></i> Longitude</label>
                                <input type="text" id="longitude" name="longitude" class="form-control form-control-border @error('longitude') is-invalid @enderror"
                                       value="{{ old('longitude', $location?->longitude ?? '') }}">
                                @error('longitude') <span class="invalid-feedback">{{ $message }}</span> @enderror
                            </div>
                        </div>

                        {{-- Description --}}
                        <div class="form-group mb-0">
                            <label for="description" class="font-weight-600">Location Description</label>
                            <textarea name="description" rows="4" 
                                      class="form-control form-control-border @error('description') is-invalid @enderror" 
                                      placeholder="Describe regional highlights or operation details...">{{ old('description', $location?->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- DRY: Module Applicability Grid --}}
                <div class="card shadow-sm border-0">
                    <div class="card-header border-0 bg-light">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Service Availability</h3>
                    </div>
                    <div class="card-body">
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
                <div class="card shadow-sm border-0">
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Location::GALLERY_MEDIA,
                            'label' => 'Regional Gallery Collection',
                            'multiple' => true,
                            'model' => \App\Models\Location::class,
                            'id' => $location->id ?? null,
                        ])
                    </div>
                </div>
            </div>

            {{-- High Contrast Sidebar --}}
            <div class="col-md-4">
                @include('admin.locations.partials.action-buttons')
                @include('admin.locations.partials.map-card')

                {{-- Featured Image Partial --}}
                <div class="card shadow-sm mt-4 border-0">
                    <div class="card-header bg-white border-bottom">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase">
                            <i class="fas fa-image mr-1 text-primary"></i> Main Cover Image
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Location::PRIMARY_MEDIA,
                            'label' => 'Primary Display',
                            'multiple' => false,
                            'model' => \App\Models\Location::class,
                            'id' => $location->id ?? null,
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
    document.addEventListener('DOMContentLoaded', function () {
        // Auto-generate Slug Logic
        const titleInput = document.getElementById('title');
        const slugInput = document.getElementById('slug');

        titleInput.addEventListener('input', function () {
            if(!slugInput.dataset.edited){
                let slug = this.value.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
                slugInput.value = slug;
            }
        });

        slugInput.addEventListener('change', function() {
            this.dataset.edited = "true";
        });
    });
</script>
@endpush

@if(isset($location))
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
