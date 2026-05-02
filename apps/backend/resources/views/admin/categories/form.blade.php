@extends('adminlte::page')

@section('title', ($category->exists ? 'Edit' : 'Create') . ' Category')

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-folder-open mr-2 text-primary"></i> 
                    {{ $category->exists ? 'Modify Category' : 'New Category' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $category->exists ? 'Update hierarchy, labels, and module applicability for this grouping.' : 'Define a new taxonomy level to organize marketplace assets and content.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.categories.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to List
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ $category->exists ? route('admin.categories.update', $category->id) : route('admin.categories.store') }}" 
          method="POST" 
          enctype="multipart/form-data"
          id="categoryMainForm">
        @csrf
        @if($category->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Primary Data Column --}}
            <div class="col-md-8">
                <div class="card card-premium overflow-hidden">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;">Basic Configuration</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group mb-4">
                            <label for="title" class="font-weight-600"><i class="fas fa-folder mr-1 text-primary"></i> Category Name <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" 
                                   class="form-control form-control-lg @error('title') is-invalid @enderror" 
                                   placeholder="e.g. Residential Apartments"
                                   value="{{ old('title', $category?->title ?? '') }}" required list="category-title-suggestions">
                            <datalist id="category-title-suggestions">
                                @foreach(\App\Models\Category::select('title')->distinct()->limit(20)->pluck('title') as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        {{-- DRY: Applied form-control-monospace class --}}
                        <div class="form-group mb-4">
                            <label for="slug" class="font-weight-600 text-muted small">URL Slug</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-light border-right-0"><i class="fas fa-link fa-xs text-muted"></i></span>
                                </div>
                                <input type="text" name="slug" id="slug" 
                                       class="form-control form-control-monospace @error('slug') is-invalid @enderror"
                                       placeholder="automatic-slug-generation"
                                       value="{{ old('slug', $category?->slug ?? '') }}">
                            </div>
                            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>


                        {{-- Parent Category Selection --}}
                        <div class="form-group mb-4">
                            <label for="parent_id" class="font-weight-600">Parent Category</label>
                            <select name="parent_id" id="parent_id" class="form-control select2 @error('parent_id') is-invalid @enderror">
                                <option value="">-- None (Root Category) --</option>
                                @foreach($categories as $item)
                                    {{-- Prevent assigning itself as parent when editing --}}
                                    @if(!$category->exists || $category->id !== $item->id)
                                        <option value="{{ $item->id }}" {{ old('parent_id', $category?->parent_id ?? '') == $item->id ? 'selected' : '' }}>
                                            {{ $item->title }} 
                                            @if($item->is_blog) [Blog] @elseif($item->is_product) [Product] @endif
                                        </option>
                                    @endif
                                @endforeach
                            </select>
                            <small class="form-text text-muted">Select a parent if this is a sub-category.</small>
                            @error('parent_id') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label for="description" class="font-weight-600">Internal Description</label>
                            <textarea name="description" id="description" rows="4" 
                                      class="form-control @error('description') is-invalid @enderror" 
                                      placeholder="Briefly describe the purpose of this category...">{{ old('description', $category?->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Module Assignments --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Feature Applicability</h3>
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

                            @include('admin._partials._modules-checkboxes', ['model' => $category])
                        </div>
                    </div>
                </div>

                {{-- Gallery Partial --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Gallery Collection</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => 'gallery',
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => \App\Models\Category::class,
                            'id' => $category->id ?? null,
                        ])
                    </div>
                </div>
            </div>

            {{-- High Contrast Sidebar --}}
            <div class="col-md-4">
                @include('admin.categories.partials.action-buttons')

                {{-- Featured Image Partial --}}
                <div class="card card-premium mb-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => 'thumbnail',
                            'label' => 'Main Icon / Badge',
                            'multiple' => false,
                            'model' => \App\Models\Category::class,
                            'id' => $category->id ?? null,
                        ])
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

{{-- DRY: Removed @push('css') block entirely --}}

@push('js')
<script>
    $(document).ready(function () {
        // Auto-Slug Logic
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

        $('.select2').select2({
            theme: 'bootstrap4',
            width: '100%',
            placeholder: 'Search or select...'
        });

        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@endpush

@if($category->exists)
    <form id="delete-form" action="{{ route('admin.categories.destroy', $category->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this category listing?",
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
