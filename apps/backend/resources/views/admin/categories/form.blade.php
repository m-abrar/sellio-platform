{{--
    Administrative Taxonomy: Category Configuration
    
    This view serves as the primary interface for managing hierarchical 
    category structures within the platform. It orchestrates 
    parent-child associations, URI identification, visual identity 
    (thumbnails), and cross-module applicability (blog, products, 
    classifieds), facilitating a multi-dimensional organization 
    system for platform assets.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Category $category The category model instance.
    @variables Collection $categories Available parent categories.
--}}
@extends('adminlte::page')

@section('title', ($category->exists ? 'Edit' : 'Create') . ' Category')

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-folder-open mr-2 text-primary"></i> 
                    {{ $category->exists ? 'Modify Category' : 'New Category' }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
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
<div class="container-fluid pb-5">
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
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Basic Configuration</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label for="title" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Category Name <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" 
                                   class="form-control form-control-hero" 
                                   placeholder="e.g. Residential Apartments"
                                   value="{{ old('title', $category?->title ?? '') }}" required list="category-title-suggestions">
                            <datalist id="category-title-suggestions">
                                @foreach(\App\Models\Category::select('title')->distinct()->limit(20)->pluck('title') as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">URL Slug</label>
                            <input type="text" name="slug" id="slug" 
                                   class="form-control form-control-premium text-monospace small"
                                   placeholder="automatic-slug-generation"
                                   value="{{ old('slug', $category?->slug ?? '') }}">
                            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        {{-- Parent Category Selection --}}
                        <div class="form-group mb-4">
                            <label for="parent_id" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Parent Category</label>
                            <div class="select2-premium">
                                <select name="parent_id" id="parent_id" class="form-control select2">
                                    <option value="">-- None (Root Category) --</option>
                                    @foreach($categories as $item)
                                        @if(!$category->exists || $category->id !== $item->id)
                                            <option value="{{ $item->id }}" {{ old('parent_id', $category?->parent_id ?? '') == $item->id ? 'selected' : '' }}>
                                                {{ $item->title }} 
                                                @if($item->is_blog) [Blog] @elseif($item->is_product) [Product] @endif
                                            </option>
                                        @endif
                                    @endforeach
                                </select>
                            </div>
                            @error('parent_id') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label for="description" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Internal Description</label>
                            <textarea name="description" id="description" rows="4" 
                                      class="form-control rounded-xl border-light"
                                      placeholder="Briefly describe the purpose of this category...">{{ old('description', $category?->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Module Assignments --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Feature Applicability</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            @include('admin._partials._modules-checkboxes', ['model' => $category])
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
                            'name' => 'gallery',
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => \App\Models\Category::class,
                            'id' => $category->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>
            </div>

            {{-- Sidebar --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $category,
                    'title' => 'CATEGORY',
                    'duplicate' => 'admin.categories.duplicate'
                ])

                {{-- Featured Image Partial --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4 mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">
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
    
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this category listing?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Yes, delete it!',
                customClass: {
                    popup: 'rounded-xl',
                    confirmButton: 'rounded-pill px-4',
                    cancelButton: 'rounded-pill px-4'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form').submit();
                }
            })
        }
    </script>
@endif

@include('admin._partials._toggle-card-css')
