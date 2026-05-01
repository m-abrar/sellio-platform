@extends('adminlte::page')

@section('title', ($amenity->exists ? 'Modify' : 'New') . ' Amenity')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-star mr-2 text-primary"></i> 
                    {{ $amenity->exists ? 'Modify Amenity' : 'New Amenity' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $amenity->exists ? 'Update classification label and associated metadata.' : 'Define a new taxonomy element for resource categorization.' }}
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
<div class="container-fluid">
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
                <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;">Amenity Specifications</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-7">
                                <div class="form-group mb-4">
                                    <label for="title" class="font-weight-600"><i class="fas fa-check-circle mr-1 text-primary"></i> Amenity Name <span class="text-danger">*</span></label>
                                    <input type="text" name="title" id="title" 
                                           class="form-control form-control-lg @error('title') is-invalid @enderror" 
                                           placeholder="e.g. Swimming Pool, Air Conditioning"
                                           value="{{ old('title', $amenity->title ?? '') }}" required list="amenity-title-suggestions">
                                    <datalist id="amenity-title-suggestions">
                                        @foreach(\App\Models\Amenity::select('title')->distinct()->limit(20)->pluck('title') as $title)
                                            <option value="{{ $title }}">
                                        @endforeach
                                    </datalist>
                                    @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-5">
                                <div class="form-group mb-4">
                                    <label for="slug" class="font-weight-600 text-muted small">URL Slug</label>
                                    <input type="text" name="slug" id="slug" 
                                           class="form-control form-control-monospace @error('slug') is-invalid @enderror"
                                           placeholder="automatic-slug"
                                           value="{{ old('slug', $amenity->slug ?? '') }}">
                                    @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label for="description" class="font-weight-600">Public Description <span class="text-danger">*</span></label>
                            <textarea name="description" id="description" rows="4" 
                                      class="form-control @error('description') is-invalid @enderror" 
                                      placeholder="Explain what this amenity covers..." required>{{ old('description', $amenity->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Module Assignments --}}
                <div class="card shadow-premium border-0 mt-4 overflow-hidden" style="border-radius: 20px;">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Module Applicability</h3>
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

                            @include('admin._partials._modules-checkboxes', ['model' => $amenity])
                        </div>
                    </div>
                </div>

                {{-- Additional Images Gallery --}}
                <div class="card shadow-premium border-0 mt-4 overflow-hidden" style="border-radius: 20px;">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Gallery Collection</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Amenity::GALLERY_MEDIA,
                            'label' => 'Supporting Images',
                            'multiple' => true,
                            'model' => \App\Models\Amenity::class,
                            'id' => $amenity->id ?? null,
                        ])
                    </div>
                </div>
            </div>

            {{-- High Contrast Sidebar --}}
            <div class="col-md-4">
                @include('admin.amenities.partials.action-buttons')

                {{-- Featured Image Sidebar --}}
                <div class="card border-0 shadow-premium mb-4" style="border-radius: 20px; overflow: hidden;">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Amenity::PRIMARY_MEDIA,
                            'label' => 'Featured Icon',
                            'multiple' => false,
                            'model' => \App\Models\Amenity::class,
                            'id' => $amenity->id ?? null,
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
        const titleInput = $('#title');
        const slugInput = $('#slug');

        // Auto-Slug Logic (jQuery version for blueprint consistency)
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

@if($amenity->exists)
    <form id="delete-form" action="{{ route('admin.amenities.destroy', $amenity->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this amenity?",
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


