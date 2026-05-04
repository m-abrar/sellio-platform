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

            $isEdit = $id && $model::find($id);
            $record = $isEdit ? $model::find($id) : null;

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
             class="dropzone border-dashed rounded-xl p-5 d-flex align-items-center justify-content-center flex-column {{ $isEdit ? 'cursor-pointer' : 'bg-light text-muted' }}"
             style="{{ $isEdit ? 'border: 2px dashed rgba(var(--primary-rgb), 0.3); background: rgba(var(--primary-rgb), 0.02); transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); min-height: 180px;' : 'pointer-events: none; opacity: 0.6;' }}">
            <div class="dropzone-glow position-absolute" style="width: 100%; height: 100%; background: radial-gradient(circle at center, rgba(var(--primary-rgb), 0.05) 0%, transparent 70%); top: 0; left: 0; z-index: 0; pointer-events: none;"></div>
            <div class="upload-icon-wrapper mb-3 shadow-premium rounded-circle bg-white d-flex align-items-center justify-content-center transition-all" style="width: 80px; height: 80px; border: 1px solid #edf2f7; z-index: 1;">
                <i class="fas fa-cloud-upload-alt fa-2x text-primary opacity-75"></i>
            </div>
            <h6 class="font-weight-bold text-dark mb-1 position-relative" style="z-index: 1; letter-spacing: 0.5px;">
                @if($isEdit)
                    Quick Image Sync
                @else
                    System Lock: Initialization Required
                @endif
            </h6>
            <p class="text-muted smallest mb-0 px-4 font-weight-bold uppercase opacity-50 position-relative" style="letter-spacing: 1px; z-index: 1;">
                @if($isEdit)
                    Drag & Drop or Click to Explore
                @else
                    Establish record persistence before attaching assets.
                @endif
            </p>
        </div>

        <div class="mt-4 d-flex flex-wrap justify-content-center" id="{{ $name }}-preview" style="gap: 20px;">
            @foreach($imageUrls as $img)
                <div class="image-container position-relative group">
                    <div class="image-shine position-absolute" style="top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%); z-index: 1; border-radius: 16px; pointer-events: none;"></div>
                    <img src="{{ $img }}" class="img-thumbnail border-0 shadow-premium rounded-xl" style="width: 120px; height: 120px; object-fit: cover; transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); border: 3px solid #fff !important;">
                    <button type="button" class="btn btn-danger btn-xs remove-image position-absolute d-flex align-items-center justify-content-center shadow-lg" 
                            style="top: -10px; right: -10px; border-radius: 50%; width: 28px; height: 28px; padding: 0; border: 2px solid #fff; z-index: 2;"
                            data-image="{{ $img }}">
                        <i class="fas fa-times smallest"></i>
                    </button>
                    <div class="image-overlay position-absolute rounded-xl d-flex align-items-center justify-content-center transition-all opacity-0 group-hover:opacity-100" 
                         style="top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.2); z-index: 1;">
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
    
    .rounded-xl { border-radius: 16px !important; }
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
            formData.append("model", "{{ addslashes($model ?? '') }}");
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
                            <img src="${data.url}" class="img-thumbnail border-0 shadow-premium rounded-xl" style="width: 110px; height: 110px; object-fit: cover; transition: all 0.3s ease;">
                            <button type="button" class="btn btn-danger btn-xs remove-image position-absolute d-flex align-items-center justify-content-center shadow-sm" 
                                    style="top: -8px; right: -8px; border-radius: 50%; width: 26px; height: 26px; padding: 0; border: 2px solid #fff; transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);"
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
                            model: "{{ class_basename($model) ?? '' }}", // now "Location" instead of "AppModelsLocation"
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
