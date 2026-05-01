@extends('adminlte::page')

@section('title', ($page->exists ? 'Edit' : 'Add') . ' Content')

@section('content_header')
<div class="container-fluid">
    <div class="row mb-2">
        <div class="col-sm-6">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-file-alt mr-2 text-primary"></i> 
                {{ $page->exists ? 'Edit Content: ' . $page->title : 'Create New Content' }}
            </h1>
        </div>
        <div class="col-sm-6 text-right">
            <a href="{{ route('admin.pages.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
                <i class="fas fa-arrow-left mr-1"></i> Back to List
            </a>
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
                    @include('admin.pages.partials.action-buttons')

                    <div class="card shadow-sm border-0 mt-4 overflow-hidden rounded-3">
                        <div class="card-header bg-white border-bottom">
                            <h3 class="card-title font-weight-bold text-muted small text-uppercase">
                                <i class="fas fa-image mr-1 text-primary"></i> Featured Image
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

@push('css')
<style>
    .sticky-top { top: 20px; }
    .rounded-3 { border-radius: 0.6rem !important; }
    .form-control:focus { border-color: var(--primary); box-shadow: none; }
    label { font-weight: 600; color: #495057; font-size: 0.9rem; }
</style>
@endpush

@push('js')
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
@endpush
