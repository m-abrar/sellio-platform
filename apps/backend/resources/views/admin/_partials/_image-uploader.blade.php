{{--
    Administrative High-Fidelity Image Uploader
    
    A sophisticated drag-and-drop interface for asynchronous media management.
    Supports single and multiple asset uploads, real-time preview synchronization,
    and state-dependent interaction (locked vs active based on record persistence).
    
    @param string $name The input/collection name (e.g., 'gallery').
    @param string $model The fully qualified class name of the associated model.
    @param int|null $id The primary key of the record.
    @param bool $multiple Whether to allow multiple image uploads.
    @param string|null $label The display title for the uploader card.
    @param bool $noCard Whether to omit the wrapping .card container.
--}}
@if(!($noCard ?? false))
<div class="card card-premium overflow-hidden mb-0">
    <div class="card-header border-0 bg-white py-3 px-4">
        <h4 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">{{ $label ?? __('Upload Images') }}</h4>
    </div>

    <div class="card-body text-center p-4">
@else
    <div class="image-uploader-content text-center p-4">
@endif
        @php
            $imageUrls = [];
            $modelMap = \App\Http\Controllers\Dashboard\MediaController::$modelMap;
            $flippedMap = array_flip($modelMap);

            // 1. Identify the Alias and Class
            if (isset($record) && $record->exists) {
                $modelClass = get_class($record);
                $alias = $flippedMap[$modelClass] ?? 'unknown';
            } else {
                $alias = isset($modelMap[strtolower($model)]) ? strtolower($model) : ($flippedMap[$model] ?? 'unknown');
                $modelClass = $modelMap[$alias] ?? $model;
            }

            // 2. Establish Record Persistence (Avoid ::find if record is passed)
            $isEdit = isset($record) && $record->exists;
            
            if ($isEdit) {
                if ($multiple) {
                    $imageUrls = $record->getMedia($name)->map(fn($media) => $media->getUrl());
                } else {
                    $url = $record->getFirstMediaUrl($name);
                    $imageUrls = $url ? [$url] : [];
                }
            }
        @endphp

        <div id="{{ $name }}-dropzone"
             class="dropzone border-dashed rounded-xl p-5 d-flex align-items-center justify-content-center flex-column {{ $isEdit ? 'cursor-pointer dropzone-premium' : 'bg-light text-muted dropzone-locked' }}"
             data-name="{{ $name }}"
             data-alias="{{ $alias }}"
             data-record-id="{{ $record->id ?? ($id ?? '') }}"
             data-multiple="{{ $multiple ? '1' : '0' }}"
             data-upload-url="{{ route('upload.image') }}"
             data-delete-url="{{ route('delete.image') }}"
             data-csrf="{{ csrf_token() }}">
            <div class="dropzone-glow position-absolute"></div>
            <div class="upload-icon-wrapper mb-3 shadow-premium rounded-circle bg-white d-flex align-items-center justify-content-center transition-all">
                <i class="fas fa-cloud-upload-alt fa-2x text-primary opacity-75"></i>
            </div>
            <h6 class="font-weight-bold text-dark mb-1 position-relative dropzone-title">
                @if($isEdit)
                    {{ __('Quick Image Sync') }}
                @else
                    {{ __('System Lock: Initialization Required') }}
                @endif
            </h6>
            <p class="text-muted smallest mb-0 px-4 font-weight-bold uppercase opacity-50 position-relative dropzone-subtitle">
                @if($isEdit)
                    {{ __('Drag & Drop or Click to Explore') }}
                @else
                    {{ __('Establish record persistence before attaching assets.') }}
                @endif
            </p>
        </div>

        <div class="mt-4 d-flex flex-wrap justify-content-center image-preview-container" id="{{ $name }}-preview">
            @foreach($imageUrls as $img)
                <div class="image-container position-relative group">
                    <div class="image-shine position-absolute image-preview-shine"></div>
                    <img src="{{ $img }}" class="img-thumbnail border-0 shadow-premium rounded-xl image-preview-img">
                    <button type="button" class="btn btn-danger btn-xs remove-image position-absolute d-flex align-items-center justify-content-center shadow-lg image-preview-remove"
                            data-image="{{ $img }}">
                        <i class="fas fa-times smallest"></i>
                    </button>
                    <div class="image-overlay position-absolute rounded-xl d-flex align-items-center justify-content-center transition-all opacity-0 group-hover:opacity-100 image-preview-overlay">
                        <i class="fas fa-search-plus text-white opacity-75"></i>
                    </div>
                </div>
            @endforeach
        </div>
@if(!($noCard ?? false))
    </div>
</div>
@else
    </div>
@endif
