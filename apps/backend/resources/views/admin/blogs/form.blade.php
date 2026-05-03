@extends('adminlte::page')

@section('title', ($blog->exists ? 'Edit' : 'Add') . ' Blog Post')

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-blog mr-2 text-primary"></i> {{ $blog->exists ? 'Edit Article' : 'Compose New Article' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $blog->exists ? 'Modify existing content, SEO metadata, and publication status.' : 'Draft a new editorial piece with rich media and optimized meta tags.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.blogs.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Articles
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="blog-form" 
          action="{{ $blog->exists ? route('admin.blogs.update', $blog->id) : route('admin.blogs.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($blog->exists) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Left Column: Content & SEO --}}
            <div class="col-md-8">
                {{-- Basic Article Info (Title, Slug, Category, Content) --}}
                @include('admin.blogs.partials.basic-info')
                
                {{-- SEO Meta Tags --}}
                @include('admin.blogs.partials.seo-meta')
            </div>

            {{-- Right Column: Actions & Media --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px; z-index: 10;">
                    
                    {{-- Action Card --}}
                    @include('admin._partials._form-actions', [
                        'model' => $blog,
                        'title' => 'ARTICLE',
                        'back' => 'admin.blogs.index'
                    ])

                    @if($blog->exists)
                        <div class="mt-2 mb-4 px-2">
                            <a href="{{ url('blog/' . $blog->slug) }}" target="_blank" class="btn btn-light btn-block btn-sm rounded-pill font-weight-bold text-primary border shadow-xs">
                                <i class="fas fa-external-link-alt mr-1"></i> VIEW LIVE ARTICLE
                            </a>
                        </div>
                    @endif

                    {{-- Featured Image (Spatie Media Integration) --}}
                    <div class="card border-0 shadow-premium mb-4" style="border-radius: 20px; overflow: hidden;">
                        <div class="card-header bg-white border-0 py-3 px-4">
                            <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                                <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                            </h3>
                        </div>
                        <div class="card-body p-0">
                            {{-- Using your custom Spatie Media uploader partial --}}
                            @include('admin._partials._image-uploader', [
                                'name' => 'featured_image',
                                'label' => 'Select Featured Image',
                                'multiple' => false,
                                'model' => \App\Models\Blog::class,
                                'id' => $blog->id ?? null,
                            ])
                        </div>
                    </div>

                    {{-- Additional Meta (Reading Time, Video Link, etc) --}}
                    <div class="card border-0 shadow-premium mb-4 overflow-hidden" style="border-radius: 20px;">
                        <div class="card-header bg-white border-0 py-3 px-4">
                            <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                                <i class="fas fa-clock mr-2 text-primary opacity-50"></i> Meta Metrics
                            </h3>
                        </div>
                        <div class="card-body p-4">
                            <div class="form-group mb-4">
                                <label class="small font-weight-bold text-muted text-uppercase">Est. Reading Time (Mins)</label>
                                <input type="number" name="reading_time" class="form-control" value="{{ old('reading_time', $blog->reading_time ?? 5) }}">
                            </div>

                            <div class="custom-control custom-switch custom-switch-premium">
                                <input type="checkbox" name="is_featured" class="custom-control-input" id="is_featured" value="1" {{ old('is_featured', $blog->is_featured ?? false) ? 'checked' : '' }}>
                                <label class="custom-control-label font-weight-bold text-dark small" for="is_featured">Featured Post</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('css')
<style>
    .rounded-3 { border-radius: 0.6rem !important; }
    label { font-weight: 600; color: #495057; font-size: 0.9rem; }
</style>
@endpush

@push('js')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        $('.select2').select2({ theme: 'bootstrap4', width: '100%' });

        // Auto-generate Slug from Title
        const titleInput = document.getElementById('title');
        const slugInput = document.getElementById('slug');
        
        if (titleInput && slugInput) {
            titleInput.addEventListener('input', function () {
                // Only auto-generate if the slug is empty or we are creating new
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
@endpush
