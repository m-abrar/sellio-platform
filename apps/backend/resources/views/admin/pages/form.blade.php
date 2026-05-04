@extends('adminlte::page')

@section('title', ($page->exists ? 'Edit' : 'Add') . ' Content | Page Architect')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-alt mr-2 text-primary opacity-50"></i> 
                    {{ $page->exists ? 'Modify Content: ' . $page->title : 'Create New Content' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $page->exists ? 'Update page content, layout structure, and SEO configurations.' : 'Draft a new informative page with rich layout blocks and meta optimization.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> Dashboard
                    </a>
                    <a href="{{ route('admin.pages.index') }}" class="btn-back shadow-sm">
                        <i class="fas fa-arrow-left"></i> Back to List
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="page-form" 
          action="{{ $page->exists ? route('admin.pages.update', $page->id) : route('admin.pages.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($page->exists) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Left Column: Content & SEO --}}
            <div class="col-md-8">
                @include('admin.pages.partials.basic-info')
                @include('admin.pages.partials.seo-meta')
            </div>

            {{-- Right Column: Actions & Media --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px; z-index: 10;">
                    {{-- Action Card --}}
                    @include('admin._partials._form-actions', [
                        'model' => $page,
                        'title' => 'PAGE',
                        'back' => 'admin.pages.index'
                    ])

                    @if($page->exists)
                        <div class="mt-2 mb-4 px-2">
                            <a href="{{ url($page->slug) }}" target="_blank" class="btn btn-primary-soft btn-block py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-sm">
                                <i class="fas fa-external-link-alt mr-1"></i> VIEW LIVE PAGE
                            </a>
                        </div>
                    @endif

                    <div class="card card-premium shadow-premium mb-4">
                        <div class="card-header bg-white border-0 py-3 px-4">
                            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                                <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                            </h3>
                        </div>
                        <div class="card-body p-0">
                            @include('admin._partials._image-uploader', [
                                'name' => \App\Models\Page::PRIMARY_MEDIA,
                                'label' => 'Select Featured Image',
                                'multiple' => false,
                                'model' => \App\Models\Page::class,
                                'id' => $page->id ?? null,
                            ])
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
<style>
    .sticky-top { top: 20px; }
    .form-control:focus { border-color: var(--primary); box-shadow: none; }
</style>
@endsection

@section('js')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Auto-generate Slug from Title
        const titleInput = document.getElementById('title');
        const slugInput = document.getElementById('slug');
        
        if (titleInput && slugInput) {
            titleInput.addEventListener('input', function () {
                let slug = this.value.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
                slugInput.value = slug;
            });
        }
    });
</script>
@endsection
