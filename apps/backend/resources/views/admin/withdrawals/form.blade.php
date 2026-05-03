@extends('adminlte::page')

@section('title', $location->exists ? 'Edit Location' : 'Add Location')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-2">
            <div class="col-sm-6">
                     {{ $location->exists ? 'Edit Location' : 'Add Location' }}
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

<form action="{{ $location->exists ? route('admin.locations.update', $location->id) : route('admin.locations.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    @if($location->exists) @method('PATCH') @endif

    <div class="row">
        <div class="col-md-8">
            <div class="card card-primary card-outline shadow-sm border-0">
                <div class="card-header border-0 bg-white py-3"><h3 class="card-title">Location Details</h3></div>
                <div class="card-body">
                    
                    <div class="form-group">
                        <label for="title">Location Name <span class="text-danger">*</span></label>
                        <input type="text" name="title" id="title" class="form-control @error('title') is-invalid @enderror" 
                            value="{{ old('title', $location->title ?? '') }}" required>
                        @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="form-group">
                        <label for="slug">Slug</label>
                        <input type="text" name="slug" id="slug" class="form-control @error('slug') is-invalid @enderror"
                               value="{{ old('slug', $location->slug ?? '') }}">
                        @error('slug') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    {{-- NOTE: City and Address fields have been removed as requested. --}}

                    <div class="form-group row">
                        <div class="col-md-4">
                            <label for="state">State</label>
                            <input type="text" name="state" class="form-control @error('state') is-invalid @enderror"
                                   value="{{ old('state', $location->state ?? '') }}">
                            @error('state') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                        <div class="col-md-4">
                            <label for="country">Country <span class="text-danger">*</span></label>
                            <input type="text" name="country" class="form-control @error('country') is-invalid @enderror"
                                   value="{{ old('country', $location->country ?? '') }}">
                            @error('country') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                        <div class="col-md-4">
                            <label for="zip_code">ZIP Code</label>
                            <input type="text" name="zip_code" class="form-control @error('zip_code') is-invalid @enderror"
                                   value="{{ old('zip_code', $location->zip_code ?? '') }}">
                            @error('zip_code') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>

                    <div class="form-group row">
                        <div class="col-md-6">
                            <label>Latitude</label>
                            <input type="text" id="latitude" name="latitude" class="form-control @error('latitude') is-invalid @enderror"
                                   value="{{ old('latitude', $location->latitude ?? '') }}">
                            @error('latitude') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                        <div class="col-md-6">
                            <label>Longitude</label>
                            <input type="text" id="longitude" name="longitude" class="form-control @error('longitude') is-invalid @enderror"
                                   value="{{ old('longitude', $location->longitude ?? '') }}">
                            @error('longitude') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>

                    <hr>
                    <div class="form-group">
                        <label>Location Applicable for Modules</label>
                        @php
                            $modules = [
                                'is_property' => 'Property Listings',
                                'is_event' => 'Events',
                                'is_job' => 'Jobs',
                                'is_auto' => 'Auto Listings',
                                'is_service' => 'Services',
                                'is_classified' => 'Classified Ads',
                            ];
                        @endphp

                        <div class="row">
                            @foreach($modules as $column => $label)
                                @php
                                    // Use old value or the existing location value
                                    $checked = old($column, $location->$column ?? false);
                                @endphp
                                <div class="col-md-4 col-sm-6">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" name="{{ $column }}" value="1" 
                                            id="{{ $column }}" {{ $checked ? 'checked' : '' }}>
                                        <label class="form-check-label" for="{{ $column }}">
                                            {{ $label }}
                                        </label>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                    <hr>

                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea name="description" class="form-control @error('description') is-invalid @enderror">{{ old('description', $location->description ?? '') }}</textarea>
                        @error('description') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="form-group">
                        <label>Published</label>
                        <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input" id="publishedSwitch" name="is_published" value="1" 
                                   {{ old('is_published', $location->is_published ?? '0') == '1' ? 'checked' : '' }} />
                            <label class="custom-control-label" for="publishedSwitch">Active</label>
                        </div>
                    </div>

                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Location
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-4">

            @include('admin.locations.map')
            
            @include('admin._partials._image-uploader', [
                'name' => \App\Models\Location::PRIMARY_MEDIA,
                'label' => 'Featured Image',
                'multiple' => false,
                'model' => \App\Models\Location::class,
                'id' => $location->id ?? null,
            ])
        </div>

        <div class="col-md-12">

            @include('admin._partials._image-uploader', [
                'name' => \App\Models\Location::GALLERY_MEDIA,
                'label' => 'Additional Images',
                'multiple' => true,
                'model' => \App\Models\Location::class,
                'id' => $location->id ?? null,
            ])

        </div>

    </div>
</form>
@endsection

@push('js')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Auto-generate Slug
        document.getElementById('name').addEventListener('input', function () {
            let slug = this.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            document.getElementById('slug').value = slug;
        });

    });
</script>
@endpush


@push('css')
    
@endpush
