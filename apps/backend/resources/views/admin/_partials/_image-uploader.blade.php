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
        <h4 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">{{ $label ?? 'Upload Images' }}</h4>
    </div>

    <div class="card-body text-center p-4">
@else
    <div class="image-uploader-content text-center p-4">
@endif
        @php
            $imageUrls = [];
            $modelClass = $model;
            $modelMap = \App\Http\Controllers\Dashboard\MediaController::$modelMap;
            
            // 1. Resolve Alias to Class (if an alias was passed)
            if (isset($modelMap[strtolower($model)])) {
                $modelClass = $modelMap[strtolower($model)];
            }
            
            // 2. Identify the Alias for Frontend (JS) use
            $flippedMap = array_flip($modelMap);
            $alias = $flippedMap[$modelClass] ?? 'unknown';

            // 3. Establish Record Persistence
            $isEdit = $id && $modelClass::find($id);
            $record = $isEdit ? $modelClass::find($id) : null;
            
            if ($record) {
                if ($multiple) {
                    $imageUrls = $record->getMedia($name)->map(fn($media) => $media->getUrl());
                } else {
                    $url = $record->getFirstMediaUrl($name);
                    $imageUrls = $url ? [$url] : [];
                }
            }
        @endphp

        <div id="{{ $name }}-dropzone"
             class="dropzone border-dashed rounded-xl p-5 d-flex align-items-center justify-content-center flex-column {{ $isEdit ? 'cursor-pointer dropzone-premium' : 'bg-light text-muted dropzone-locked' }}">
            <div class="dropzone-glow position-absolute"></div>
            <div class="upload-icon-wrapper mb-3 shadow-premium rounded-circle bg-white d-flex align-items-center justify-content-center transition-all">
                <i class="fas fa-cloud-upload-alt fa-2x text-primary opacity-75"></i>
            </div>
            <h6 class="font-weight-bold text-dark mb-1 position-relative dropzone-title">
                @if($isEdit)
                    Quick Image Sync
                @else
                    System Lock: Initialization Required
                @endif
            </h6>
            <p class="text-muted smallest mb-0 px-4 font-weight-bold uppercase opacity-50 position-relative dropzone-subtitle">
                @if($isEdit)
                    Drag & Drop or Click to Explore
                @else
                    Establish record persistence before attaching assets.
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

<style>
    .border-dashed { border-style: dashed !important; }
    .dropzone { 
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; 
        position: relative;
        overflow: hidden;
    }
    .dropzone:hover { 
        border-color: var(--primary) !important; 
        background: rgba(var(--primary-rgb), 0.05) !important; 
        transform: translateY(-2px);
    }
    .dropzone::before {
        content: '';
        position: absolute;
        top: 0; left: -100%; width: 50%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transition: 0.5s;
        pointer-events: none;
    }
    .dropzone:hover::before { left: 150%; }
    
    .image-container .remove-image { 
        opacity: 0; 
        transform: scale(0.5);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        background: #ef4444 !important;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;
    }
    .image-container:hover .remove-image { 
        opacity: 1; 
        transform: scale(1); 
    }
    .image-container:hover img {
        filter: brightness(0.95);
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        border-color: var(--primary) !important;
    }
    .dropzone:hover .upload-icon-wrapper {
        transform: scale(1.1) rotate(5deg);
        background-color: var(--primary-soft) !important;
        border-color: var(--primary-soft) !important;
    }
</style>


<script>
    document.addEventListener("DOMContentLoaded", function () {
        let dropzone = document.getElementById("{{ $name }}-dropzone");
        let previewContainer = document.getElementById("{{ $name }}-preview");
        let isMultiple = @json($multiple);
        let imagesArray = [];

        function handleFileUpload(file) {
            if (!file || !file.type.startsWith("image/")) {
                alert("Please upload a valid image file.");
                return;
            }

            let formData = new FormData();
            formData.append("image", file);
            formData.append("_token", "{{ csrf_token() }}");
            formData.append("model", "{{ $alias }}");
            formData.append("id", "{{ $id ?? '' }}");
            formData.append("name", "{{ $name ?? 'images' }}");
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
                        previewContainer.innerHTML = ""; // Clear previous preview
                    } else {
                        imagesArray.push(data.url);
                    }

                    let imageHtml = `
                        <div class="image-container position-relative group">
                            <img src="${data.url}" class="img-thumbnail border-0 shadow-premium rounded-xl image-preview-img-sm">
                            <button type="button" class="btn btn-danger btn-xs remove-image position-absolute d-flex align-items-center justify-content-center shadow-sm image-preview-remove-sm" 
                                    data-image="${data.url}">
                                <i class="fas fa-times smallest"></i>
                            </button>
                        </div>`;

                    previewContainer.insertAdjacentHTML('beforeend', imageHtml);
                    attachRemoveEvents();
                } else {
                    alert(data.message || "Upload failed.");
                }
            })
            .catch(error => {
                console.error("Upload error:", error);
                alert("Something went wrong!");
            });
        }

        function attachRemoveEvents() {
            document.querySelectorAll(".remove-image").forEach(button => {
                button.addEventListener("click", function () {
                    let imagePath = this.getAttribute("data-image");

                    // Remove from local array
                    imagesArray = imagesArray.filter(img => img !== imagePath);

                    // Remove preview
                    this.parentElement.remove();

                    // Send DELETE request to backend
                    fetch("{{ route('delete.image') }}", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRF-TOKEN": "{{ csrf_token() }}"
                        },
                        body: JSON.stringify({
                            image: imagePath,
                            model: "{{ $alias }}",
                            id: "{{ $id ?? '' }}",
                            name: "{{ $name ?? 'images' }}"
                        })

                    })
                    .then(response => response.json())
                    .then(data => {
                        if (!data.success) {
                            console.warn("Server failed to delete image:", data.message);
                            // Optional: Alert or rollback UI change
                        }
                    })
                    .catch(error => {
                        console.error("Deletion error:", error);
                        // Optional: Alert or rollback UI change
                    });
                });
            });
        }


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
            [...event.dataTransfer.files].forEach(handleFileUpload);
        });

        dropzone.addEventListener("click", function () {
            let fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.multiple = isMultiple;
            fileInput.onchange = function (event) {
                [...event.target.files].forEach(handleFileUpload);
            };
            fileInput.click();
        });

        attachRemoveEvents();
    });
</script>
