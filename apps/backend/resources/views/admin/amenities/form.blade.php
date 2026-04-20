@extends('adminlte::page')

@section('title', (isset($amenity) ? 'Modify' : 'New') . ' Amenity')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-star mr-2 text-primary"></i> 
                    {{ isset($amenity) ? 'Modify Amenity' : 'New Amenity' }}
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.amenities.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to List
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ isset($amenity) ? route('admin.amenities.update', $amenity->id) : route('admin.amenities.store') }}" 
          method="POST" 
          enctype="multipart/form-data"
          id="amenityMainForm">
        @csrf
        @if(isset($amenity)) @method('PATCH') @endif

        <div class="row">
            {{-- Primary Data Column --}}
            <div class="col-md-8">
                <div class="card card-primary card-outline shadow-sm">
                    <div class="card-header border-0 bg-white py-3">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;">Amenity Specifications</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-7">
                                <div class="form-group mb-4">
                                    <label for="title" class="font-weight-600"><i class="fas fa-check-circle mr-1 text-primary"></i> Amenity Name <span class="text-danger">*</span></label>
                                    <input type="text" name="title" id="title" 
                                           class="form-control form-control-lg form-control-border @error('title') is-invalid @enderror" 
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
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text bg-light border-right-0"><i class="fas fa-link fa-xs text-muted"></i></span>
                                        </div>
                                        <input type="text" name="slug" id="slug" 
                                               class="form-control form-control-monospace @error('slug') is-invalid @enderror"
                                               placeholder="automatic-slug"
                                               value="{{ old('slug', $amenity->slug ?? '') }}">
                                    </div>
                                    @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label for="description" class="font-weight-600">Public Description <span class="text-danger">*</span></label>
                            <textarea name="description" id="description" rows="4" 
                                      class="form-control form-control-border @error('description') is-invalid @enderror" 
                                      placeholder="Explain what this amenity covers..." required>{{ old('description', $amenity->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Module Assignments --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header border-0 bg-light">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Module Applicability</h3>
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

                            @include('admin._partials._modules-checkboxes', ['model' => $amenity])
                        </div>
                    </div>
                </div>

                {{-- Additional Images Gallery --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header border-0 bg-light py-2">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase">Gallery Collection</h3>
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
                <div class="card shadow-sm mt-4 border-0">
                    <div class="card-header bg-white border-bottom">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase">
                            <i class="fas fa-image mr-1 text-primary"></i> Primary Image
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

@if(isset($amenity))
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


