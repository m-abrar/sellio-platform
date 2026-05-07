{{--
    Administrative Content: Editorial Desk Configuration
    
    This view serves as the authoritative interface for managing 
    platform-wide blog content. It orchestrates rich editorial pieces, 
    associating them with visual identities (featured images), 
    SEO metadata structures, and publication metrics. It provides 
    a high-fidelity composition environment for both new drafts and 
    existing article updates.
    
    @extends adminlte::page
    @context Blog Module Management
    @variables Blog $blog The blog model instance being managed.
--}}
@extends('adminlte::page')

@section('title', ($blog->exists ? 'Edit' : 'Add') . ' Blog Post | Editorial Desk')

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-blog mr-2 text-primary opacity-50"></i> {{ $blog->exists ? 'Edit Article' : 'Compose New Article' }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $blog->exists ? 'Modify existing content, SEO metadata, and publication status.' : 'Draft a new editorial piece with rich media and optimized meta tags.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> Dashboard
                    </a>
                    <a href="{{ route('admin.blogs.index') }}" class="btn btn-back shadow-sm">
                        <i class="fas fa-arrow-left"></i> Back to Articles
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form id="blog-form" 
          action="{{ $blog->exists ? route('admin.blogs.update', $blog->id) : route('admin.blogs.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($blog->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Left Column: Content & SEO --}}
            <div class="col-md-8">
                {{-- Basic Article Info (Title, Slug, Category, Content) --}}
                @include('admin.blogs.partials.basic-info')
                
                {{-- SEO Meta Tags --}}
                @include('admin.blogs.partials.seo-meta')
            </div>

            {{-- Right Column: Actions & Media --}}
            <div class="col-md-4">
                {{-- Action Card --}}
                @include('admin._partials._form-actions', [
                    'model' => $blog,
                    'title' => 'ARTICLE',
                    'back' => 'admin.blogs.index'
                ])

                @if($blog->exists)
                    <div class="mt-2 mb-4 px-2">
                        <a href="{{ url('blog/' . $blog->slug) }}" target="_blank" class="btn btn-primary-soft btn-block py-3 rounded-pill font-weight-bold uppercase letter-spacing-1 shadow-sm font-11-p">
                            <i class="fas fa-external-link-alt mr-1"></i> VIEW LIVE ARTICLE
                        </a>
                    </div>
                @endif

                {{-- Featured Image --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => 'featured_image',
                            'label' => 'Select Featured Image',
                            'multiple' => false,
                            'model' => \App\Models\Blog::class,
                            'id' => $blog->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                {{-- Additional Meta --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">
                            <i class="fas fa-clock mr-2 text-primary opacity-50"></i> Meta Metrics
                        </h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Est. Reading Time (Mins)</label>
                            <input type="number" name="reading_time" class="form-control form-control-premium" value="{{ old('reading_time', $blog->reading_time ?? 5) }}">
                        </div>

                        <div class="bg-light p-3 rounded-xl border border-light">
                            <div class="custom-control custom-switch custom-switch-premium">
                                <input type="checkbox" name="is_featured" class="custom-control-input" id="is_featured" value="1" {{ old('is_featured', $blog->is_featured ?? false) ? 'checked' : '' }}>
                                <label class="custom-control-label small font-weight-bold text-dark uppercase letter-spacing-1 pt-2-p" for="is_featured">Featured Editorial</label>
                            </div>
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
@endsection

@section('js')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        $('.select2').select2({ theme: 'bootstrap4', width: '100%' });

        // Auto-generate Slug from Title
        const titleInput = document.getElementById('title');
        const slugInput = document.getElementById('slug');
        
        if (titleInput && slugInput) {
            titleInput.addEventListener('input', function () {
                @if(!$blog->exists)
                    let slug = this.value.toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '');
                    slugInput.value = slug;
                @endif
            });
        }
    });
</script>
@endsection
