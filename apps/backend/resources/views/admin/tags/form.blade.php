@extends('adminlte::page')

@section('title', ($tag->exists ? 'Modify' : 'New') . ' Tag')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-tags mr-2 text-primary"></i>
                    {{ $tag->exists ? 'Modify Tag' : 'New Tag' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $tag->exists ? 'Update classification label and associated metadata.' : 'Define a new taxonomy element for resource categorization.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.tags.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to List
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ $tag->exists ? route('admin.tags.update', $tag->id) : route('admin.tags.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($tag->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Content Section --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;">Tag Configuration</h3>
                    </div>
                    <div class="card-body p-4">
                        {{-- Name & Slug Row --}}
                        <div class="row">
                            <div class="col-md-7">
                                <div class="form-group mb-4">
                                    <label for="title" class="font-weight-600"><i class="fas fa-tags mr-1 text-primary"></i> Tag Name <span class="text-danger">*</span></label>
                                    <input type="text" name="title" id="title" 
                                           class="form-control form-control-lg @error('title') is-invalid @enderror" 
                                           placeholder="e.g. Featured, Hot Deal, New"
                                           value="{{ old('title', $tag->title ?? '') }}" required list="tag-title-suggestions">
                                    <datalist id="tag-title-suggestions">
                                        @foreach(\App\Models\Tag::select('title')->distinct()->limit(20)->pluck('title') as $title)
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
                                           value="{{ old('slug', $tag->slug ?? '') }}">
                                    @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        {{-- Description --}}
                        <div class="form-group mb-0">
                            <label for="description" class="font-weight-600">Description</label>
                            <textarea name="description" rows="3" 
                                      class="form-control @error('description') is-invalid @enderror" 
                                      placeholder="Briefly describe what this tag represents...">{{ old('description', $tag->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Interactive Module Selection --}}
                <div class="card shadow-premium border-0 mt-4 overflow-hidden" style="border-radius: 20px;">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Scope of Application</h3>
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
                            @include('admin._partials._modules-checkboxes', ['model' => $tag])
                        </div>
                    </div>
                </div>

                {{-- Gallery Section --}}
                <div class="card shadow-premium border-0 mt-4 overflow-hidden" style="border-radius: 20px;">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Additional Tag Visuals</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Tag::GALLERY_MEDIA,
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => \App\Models\Tag::class,
                            'id' => $tag->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>
            </div>

            {{-- Controls Sidebar --}}
            <div class="col-md-4">
                @include('admin.tags.partials.action-buttons')

                {{-- Featured Image Sidebar --}}
                <div class="card border-0 shadow-premium mb-4" style="border-radius: 20px; overflow: hidden;">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Tag::PRIMARY_MEDIA,
                            'label' => 'Main Icon / Badge',
                            'multiple' => false,
                            'model' => \App\Models\Tag::class,
                            'id' => $tag->id ?? null,
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
    document.addEventListener('DOMContentLoaded', function () {
        const titleInput = document.getElementById('title');
        const slugInput = document.getElementById('slug');

        // Auto-generate Slug
        titleInput.addEventListener('input', function () {
            if(!slugInput.dataset.edited) {
                let slug = this.value.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
                slugInput.value = slug;
            }
        });

        slugInput.addEventListener('change', () => slugInput.dataset.edited = "true");
    });
</script>
@endpush

@if($tag->exists)
    <form id="delete-form" action="{{ route('admin.tags.destroy', $tag->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this tag?",
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


