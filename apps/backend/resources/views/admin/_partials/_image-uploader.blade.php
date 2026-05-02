<div class="card card-premium overflow-hidden mb-0">
    <div class="card-header border-0 bg-white py-3 px-4">
        <h4 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">{{ $label ?? 'Upload Images' }}</h4>
    </div>

    <div class="card-body text-center p-4">
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
             style="{{ $isEdit ? 'border: 2px dashed rgba(70, 165, 172, 0.3); background: rgba(70, 165, 172, 0.02);' : 'pointer-events: none; opacity: 0.6;' }}">
            <div class="upload-icon-wrapper mb-3 shadow-sm rounded-circle bg-white d-flex align-items-center justify-content-center" style="width: 64px; height: 64px;">
                <i class="fas fa-cloud-upload-alt fa-2x text-primary"></i>
            </div>
            <h6 class="font-weight-bold text-dark mb-1">
                @if($isEdit)
                    Drag & drop {{ $multiple ? 'images' : 'image' }} here
                @else
                    Record Initialization Required
                @endif
            </h6>
            <p class="text-muted smallest mb-0 px-4">
                @if($isEdit)
                    Or click to browse from your device. Supported: JPG, PNG, WEBP.
                @else
                    Please save the {{ strtolower(class_basename($model)) }} record before attaching media assets.
                @endif
            </p>
        </div>

        <div class="mt-4 d-flex flex-wrap justify-content-center" id="{{ $name }}-preview" style="gap: 12px;">
            @foreach($imageUrls as $img)
                <div class="image-container position-relative group">
                    <img src="{{ $img }}" class="img-thumbnail border-0 shadow-premium rounded-lg" style="width: 100px; height: 100px; object-fit: cover;">
                    <button type="button" class="btn btn-danger btn-xs remove-image position-absolute" 
                            style="top: -8px; right: -8px; border-radius: 50%; width: 24px; height: 24px; padding: 0;"
                            data-image="{{ $img }}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            @endforeach
        </div>
    </div>
</div>

<style>
    .border-dashed { border-style: dashed !important; transition: all 0.3s ease; }
    .dropzone:hover { border-color: var(--primary) !important; background: rgba(70, 165, 172, 0.05) !important; }
    .rounded-xl { border-radius: 16px !important; }
    .image-container .remove-image { 
        opacity: 0; 
        transition: all 0.2s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .image-container:hover .remove-image { opacity: 1; transform: scale(1.1); }
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
                        <div class="image-container d-inline-block position-relative">
                            <img src="${data.url}" class="img-thumbnail shadow-sm rounded">
                            <button type="button" class="btn btn-danger btn-sm remove-image" data-image="${data.url}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>`;

                    previewContainer.innerHTML += imageHtml;
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
