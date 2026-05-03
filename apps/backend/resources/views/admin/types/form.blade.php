@extends('adminlte::page')

@section('title', ($type->exists ? 'Edit' : 'Add') . ' Listing Type')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-layer-group mr-2 text-primary"></i> 
                    {{ $type->exists ? 'Modify Listing Type' : 'New Listing Type' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $type->exists ? 'Update classification labels, icons, and module applicability for this group.' : 'Define a new taxonomy grouping to classify marketplace assets and content.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.types.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to List
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ $type->exists ? route('admin.types.update', $type->id) : route('admin.types.store') }}" 
          method="POST" 
          enctype="multipart/form-data"
          id="typeMainForm">
        @csrf
        @if($type->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Primary Data Column --}}
            <div class="col-md-8">
                <div class="card card-premium overflow-hidden">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;">Basic Configuration</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group mb-4">
                            <label for="title" class="font-weight-600"><i class="fas fa-tag mr-1 text-primary"></i> Type Name <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" 
                                   class="form-control form-control-lg @error('title') is-invalid @enderror" 
                                   placeholder="e.g. Residential, Workshop, Full-Time"
                                   value="{{ old('title', $type?->title ?? '') }}" required list="type-title-suggestions">
                            <datalist id="type-title-suggestions">
                                @foreach(\App\Models\Type::select('title')->distinct()->limit(20)->pluck('title') as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="row">
                            {{-- Monospace Slug --}}
                            <div class="col-md-6 mb-4">
                                <label for="slug" class="font-weight-600 text-muted small">URL Identifier (Slug)</label>
                                <div class="input-group shadow-xs">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text bg-light border-right-0"><i class="fas fa-link fa-xs text-muted"></i></span>
                                    </div>
                                    <input type="text" name="slug" id="slug" 
                                           class="form-control form-control-monospace @error('slug') is-invalid @enderror"
                                           placeholder="automatic-slug-generation"
                                           value="{{ old('slug', $type?->slug ?? '') }}">
                                </div>
                                @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                            </div>

                            {{-- Icon Picker Field --}}
                            <div class="col-md-6 mb-4">
                                <label for="icon" class="font-weight-600 text-muted small">Visual Icon (FontAwesome)</label>
                                <div class="input-group shadow-xs">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text bg-light border-right-0" id="icon-preview-addon">
                                            <i class="{{ old('icon', $type?->icon ?? 'fas fa-icons') }} text-primary"></i>
                                        </span>
                                    </div>
                                    <input type="text" name="icon" id="icon" 
                                           class="form-control form-control-monospace @error('icon') is-invalid @enderror"
                                           placeholder="fas fa-tag"
                                           value="{{ old('icon', $type?->icon ?? '') }}">
                                </div>
                                @error('icon') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label for="description" class="font-weight-600">Internal Description</label>
                            <textarea name="description" id="description" rows="4" 
                                      class="form-control @error('description') is-invalid @enderror" 
                                      placeholder="Briefly describe the purpose of this type grouping...">{{ old('description', $type?->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Interactive Module Grid --}}
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
                            @include('admin._partials._modules-checkboxes', ['model' => $type])
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
                            'name' => \App\Models\Type::GALLERY_MEDIA,
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => \App\Models\Type::class,
                            'id' => $type->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>
            </div>

            {{-- High Contrast Sidebar --}}
            <div class="col-md-4">
                @include('admin.types.partials.action-buttons')

                {{-- Featured Image Partial --}}
                <div class="card card-premium mb-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Type::PRIMARY_MEDIA,
                            'label' => 'Main Icon / Badge',
                            'multiple' => false,
                            'model' => \App\Models\Type::class,
                            'id' => $type->id ?? null,
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
        const iconInput = document.getElementById('icon');
        const iconPreview = document.querySelector('#icon-preview-addon i');

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

        // Live Icon Preview
        iconInput.addEventListener('input', function() {
            const val = this.value || 'fas fa-icons';
            iconPreview.className = val + ' text-primary';
        });
    });
</script>
@endpush

@include('admin._partials._toggle-card-css')

@if($type->exists)
    <form id="delete-form" action="{{ route('admin.types.destroy', $type->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this type?",
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


