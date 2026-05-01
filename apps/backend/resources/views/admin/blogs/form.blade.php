@extends('adminlte::page')

@section('title', ($blog->exists ? 'Edit' : 'Add') . ' Blog Post')

@section('plugins.Select2', true)

@section('content_header')
<div class="container-fluid">
    <div class="row mb-2">
        <div class="col-sm-6">
                {{ $blog->exists ? 'Edit Post: ' . $blog->title : 'Create New Blog Post' }}
        </div>
        <div class="col-sm-6 text-right">
            <a href="{{ route('admin.blogs.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
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
                    
                    {{-- Action Buttons (Save, Publish Toggle, Featured Toggle) --}}
                    @include('admin.blogs.partials.action-buttons')

                    {{-- Featured Image (Spatie Media Integration) --}}
                    <div class="card shadow-sm border-0 mt-4 overflow-hidden rounded-3">
                        <div class="card-header bg-white border-bottom">
                            <h3 class="card-title font-weight-bold text-muted small text-uppercase">
                                <i class="fas fa-image mr-1 text-primary"></i> Featured Image
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
                    <div class="card shadow-sm border-0 mt-4 rounded-3">
                        <div class="card-body">
                            <div class="form-group mb-0">
                                <label for="reading_time">Est. Reading Time (Mins)</label>
                                <input type="number" name="reading_time" class="form-control" value="{{ old('reading_time', $blog->reading_time ?? 5) }}">
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
