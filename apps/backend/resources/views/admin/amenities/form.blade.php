{{--
    Administrative Taxonomy: Amenity Configuration
    
    This view serves as the primary interface for managing amenity 
    classifications within the platform. It orchestrates labeling, 
    URI identification, descriptive metadata, visual identity (icons), 
    and cross-Available In (properties, products, etc.), 
    ensuring a consistent classification system across all marketplace 
    verticals.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Amenity $amenity The amenity model instance.
--}}
@extends('adminlte::page')

@section('title', ($amenity->exists ? 'Modify' : 'New') . ' Amenity')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-bath mr-2 text-primary"></i> 
                    {{ $amenity->exists ? 'Modify Amenity' : 'New Amenity' }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $amenity->exists ? 'Update classification labels, icons, and Available In for this group.' : 'Define a new taxonomy element to classify marketplace assets and content.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.amenities.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to List
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ $amenity->exists ? route('admin.amenities.update', $amenity->id) : route('admin.amenities.store') }}" 
          method="POST" 
          enctype="multipart/form-data"
          id="amenityMainForm">
        @csrf
        @if($amenity->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Primary Data Column --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Basic Configuration</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label for="title" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Amenity Name <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" 
                                   class="form-control form-control-hero" 
                                   placeholder="e.g. Swimming Pool, Air Conditioning"
                                   value="{{ old('title', $amenity->title ?? '') }}" required list="amenity-title-suggestions">
                            <datalist id="amenity-title-suggestions">
                                @foreach($titleSuggestions ?? [] as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">URL Identifier (Slug)</label>
                            <input type="text" name="slug" id="slug" 
                                   class="form-control form-control-premium text-monospace small"
                                   placeholder="automatic-slug-generation"
                                   value="{{ old('slug', $amenity->slug ?? '') }}">
                            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label for="description" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Internal Description</label>
                            <textarea name="description" id="description" rows="4" 
                                      class="form-control rounded-xl border-light"
                                      placeholder="Briefly describe the purpose of this amenity...">{{ old('description', $amenity->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Modules --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Feature Applicability</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            @include('admin._partials._modules-checkboxes', ['model' => $amenity])
                        </div>
                    </div>
                </div>

                {{-- Gallery Partial --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Gallery Collection</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Amenity::GALLERY_MEDIA,
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => 'amenity',
                            'id' => $amenity->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>
            </div>

            {{-- Sidebar --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $amenity,
                    'title' => 'AMENITY',
                    'duplicate' => 'admin.amenities.duplicate'
                ])

                {{-- Featured Image Partial --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Amenity::PRIMARY_MEDIA,
                            'label' => 'Main Icon / Badge',
                            'multiple' => false,
                            'model' => 'amenity',
                            'id' => $amenity->id ?? null,
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

@if($amenity->exists)
    <form id="delete-form" action="{{ route('admin.amenities.destroy', $amenity->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
@endif

@include('admin._partials._toggle-card-css')


