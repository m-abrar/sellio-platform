@props([
    'model', // The Eloquent Model class name (e.g., 'App\Models\Post')
    'id' => null, // The ID of the model instance (for editing/existing record)
    'name' => 'avatar', // The media collection name
    'multiple' => true, // Whether to allow multiple images
    'label' => __('Upload Images'), // Card title label
    'card' => false, // Whether to wrap the content in a Bootstrap Card
    'triggerId' => null, // ID of an external button to trigger the click
])

@php

    // --- Blade PHP Logic for fetching existing images ---
    $imageUrls = [];
    $isEdit = $id && class_exists($model) && $model::find($id); 
    $record = $isEdit ? $model::find($id) : null;

    if ($record) {
        if ($multiple) {
            $imageUrls = $record->getMedia($name)->map(fn($media) => $media->getUrl());
        } else {
            $url = $record->getFirstMediaUrl($name);
            $imageUrls = $url ? [$url] : [];
        }
    }

    // Prepare model class name for JavaScript
    $jsModelName = class_basename($model);
@endphp

@if ($card)
<div class="card my-4">
    {{-- Card Header --}}
    <div class="card-header">
        <h4 class="card-title">{{ $label }}</h4>
    </div>
    {{-- Card Body and Dropzone --}}
    <div class="card-body text-center">
@endif
    
    {{-- Image Preview Container (Avatar style) --}}
    <div class="text-center" id="{{ $name }}-preview">
        @foreach($imageUrls as $img)
            <div class="image-container d-inline-block position-relative">
                <img src="{{ $img }}" class="img-thumbnail img-avatar-lg shadow-sm rounded-circle"> 
                <button type="button" class="btn btn-danger btn-sm remove-image" data-image="{{ $img }}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        @endforeach
    </div>

    {{-- Dropzone: Always visible and active for drag/drop --}}
    <div id="{{ $name }}-dropzone"
         class="dropzone rounded px-4 mb-2 d-flex align-items-center justify-content-center flex-column 
                {{ $isEdit ? '' : 'bg-light text-muted' }}" 
         style="{{ $isEdit ? '' : 'pointer-events: none; opacity: 0.6;' }}">
        <i class="fas fa-cloud-upload-alt fa-2x text-primary"></i>
        <p class="mt-2">
            @if($isEdit)
                {{ __('Drag & drop :type here or click to upload.', ['type' => $multiple ? __('images') : __('image')]) }}
            @else
                {!! __('Please save the **:model** first to upload images.', ['model' => strtolower($jsModelName)]) !!}
            @endif
        </p>
    </div>

@if ($card)
    </div>
</div>
@endif

{{-- JavaScript Logic --}}
<script>
    document.addEventListener("DOMContentLoaded", function () {
        const dropzoneId = "{{ $name }}-dropzone";
        const previewId = "{{ $name }}-preview";
        const triggerId = "{{ $triggerId }}";
        
        let dropzone = document.getElementById(dropzoneId);
        let previewContainer = document.getElementById(previewId);
        let externalTrigger = triggerId ? document.getElementById(triggerId) : null;

        if (!dropzone || !previewContainer) {
            return;
        }

        let isMultiple = @json($multiple);
        let imagesArray = @json($imageUrls);
        
        const isEditable = {{ $isEdit ? 'true' : 'false' }};


        // --- Core Upload Function: Handles opening the file dialog ---
        function triggerFileSelect(event) {
            // Prevent default behavior if triggered by a button click
            if(event && event.type === 'click' && event.target.tagName !== 'INPUT') {
                event.preventDefault();
            }

            if (!isEditable) {
                alert("{{ __('Please save the record first to upload images.') }}");
                return;
            }
            let fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.multiple = isMultiple;
            fileInput.onchange = function (event) {
                [...event.target.files].forEach(handleFileUpload);
            };
            fileInput.click();
        }

        // --- File Upload Handler (API communication) ---
        function handleFileUpload(file) {
             if (!file || !file.type.startsWith("image/")) {
                alert("{{ __('Please upload a valid image file.') }}");
                return;
            }
            
            let formData = new FormData();
            formData.append("image", file);
            formData.append("_token", "{{ csrf_token() }}");
            formData.append("model", "{{ addslashes($model) }}");
            formData.append("id", "{{ $id }}");
            formData.append("name", "{{ $name }}");
            formData.append("multiple", "{{ $multiple ? '1' : '0' }}");

            fetch("{{ route('upload.image') }}", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (!isMultiple) {
                        imagesArray = [data.url];
                        previewContainer.innerHTML = ""; 
                    } else {
                        imagesArray.push(data.url);
                    }

                    let imageHtml = `
                        <div class="image-container d-inline-block position-relative">
                            <img src="${data.url}" class="img-thumbnail img-avatar-lg shadow-sm rounded-circle">
                            <button type="button" class="btn btn-danger btn-sm remove-image" data-image="${data.url}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>`;

                    previewContainer.innerHTML += imageHtml;
                    attachRemoveEvents();
                } else {
                    alert(data.message || "{{ __('Upload failed.') }}");
                }
            })
            .catch(error => {
                console.error("Upload error:", error);
                alert("{{ __('Something went wrong!') }}");
            });
        }


        // --- Event Listeners ---
        
        // 1. Dropzone Click Listener
        dropzone.addEventListener("click", triggerFileSelect);
        
        // 2. External Trigger Listener (NEW: Link external button to file select)
        if (externalTrigger) {
            externalTrigger.addEventListener('click', triggerFileSelect);
        }

        // 3. Dropzone Drag/Drop Listeners (Remain for drag-and-drop functionality)
        dropzone.addEventListener("dragover", function (event) {
            event.preventDefault();
            dropzone.classList.add("border-primary");
        });

        dropzone.addEventListener("dragleave", function () {
            dropzone.classList.remove("border-primary");
        });

        dropzone.addEventListener("drop", function (event) {
            event.preventDefault();
            dropzone.classList.remove("border-primary");
            if (isEditable) {
                [...event.dataTransfer.files].forEach(handleFileUpload);
            }
        });
        
        // --- Remove Button Logic (Remains the same) ---
        function attachRemoveEvents() {
            previewContainer.querySelectorAll(".remove-image").forEach(button => {
                button.removeEventListener('click', handleRemoveClick);
                button.addEventListener("click", handleRemoveClick);
            });
        }

        function handleRemoveClick() {
            let imagePath = this.getAttribute("data-image");

            imagesArray = imagesArray.filter(img => img !== imagePath);
            this.parentElement.remove();

            fetch("{{ route('delete.image') }}", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": "{{ csrf_token() }}"
                },
                body: JSON.stringify({
                    image: imagePath,
                    model: "{{ $jsModelName }}",
                    id: "{{ $id }}",
                    name: "{{ $name }}"
                })
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.warn("Server failed to delete image:", data.message);
                }
            });
        }
        
        attachRemoveEvents();
    });
</script>
