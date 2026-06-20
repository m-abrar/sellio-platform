{{--
    Administrative Taxonomy: Tag Configuration
    
    This view serves as the primary interface for managing meta tags 
    within the platform. It orchestrates labeling, URI identification, 
    descriptive metadata, visual identity (badges), and cross-module 
    applicability (products, classifieds, blog), facilitating 
    granular classification and filtering across all marketplace 
    verticals.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Tag $tag The tag model instance.
--}}
@extends('adminlte::page')

@section('title', ($tag->exists ? __('Modify') : __('New')) . ' ' . __('Tag'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-tags mr-2 text-primary"></i>
                    {{ $tag->exists ? __('Modify Tag') : __('New Tag') }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $tag->exists ? __('Update classification labels and Available In for this group.') : __('Define a new taxonomy element to classify marketplace assets and content.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.tags.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to List') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ $tag->exists ? route('admin.tags.update', $tag->id) : route('admin.tags.store') }}" 
          method="POST" 
          enctype="multipart/form-data"
          id="tagMainForm">
        @csrf
        @if($tag->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Primary Data Column --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Basic Configuration') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label for="title" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Tag Name') }} <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" 
                                   class="form-control form-control-hero" 
                                   placeholder="{{ __('e.g. Featured, Hot Deal, New') }}"
                                   value="{{ old('title', $tag->title ?? '') }}" required list="tag-title-suggestions">
                            <datalist id="tag-title-suggestions">
                                @foreach($titleSuggestions ?? [] as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('URL Identifier (Slug)') }}</label>
                            <input type="text" name="slug" id="slug" 
                                   class="form-control form-control-premium text-monospace small"
                                   placeholder="automatic-slug-generation"
                                   value="{{ old('slug', $tag->slug ?? '') }}">
                            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label for="description" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Internal Description') }}</label>
                            <textarea name="description" id="description" rows="4" 
                                      class="form-control rounded-xl border-light"
                                      placeholder="{{ __('Briefly describe the purpose of this tag group...') }}">{{ old('description', $tag->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Interactive Module Grid --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Feature Applicability') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            @include('admin._partials._modules-checkboxes', ['model' => $tag])
                        </div>
                    </div>
                </div>

                {{-- Gallery Partial --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Gallery Collection') }}</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Tag::GALLERY_MEDIA,
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => 'tag',
                            'id' => $tag->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>
            </div>

            {{-- Sidebar --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $tag,
                    'title' => 'TAG',
                    'duplicate' => 'admin.tags.duplicate'
                ])

                {{-- Featured Image Partial --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> {{ __('Visual Identity') }}
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Tag::PRIMARY_MEDIA,
                            'label' => __('Main Icon / Badge'),
                            'multiple' => false,
                            'model' => 'tag',
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

@section('js')
    @include('admin._partials._sweetalert')
    <script src="{{ asset('admin-assets/pages/taxonomy-form.js') }}"></script>
@endsection


