<div class="card border-0 shadow-none mb-0">
    <div class="card-header">
        <h4 class="card-title">{{ $label ?? 'Upload Images' }}</h4>
    </div>

    <div class="card-body text-center">
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
             class="dropzone border rounded p-4 d-flex align-items-center justify-content-center flex-column {{ $isEdit ? '' : 'bg-light text-muted' }}"
             style="{{ $isEdit ? '' : 'pointer-events: none; opacity: 0.6;' }}">
            <i class="fas fa-cloud-upload-alt fa-2x text-primary"></i>
            <p class="mt-2">
                @if($isEdit)
                    Drag & drop {{ $multiple ? 'images' : 'image' }} here or click to upload.
                @else
                    Please save the {{ strtolower(class_basename($model)) }} first to upload images.
                @endif
            </p>
        </div>

        <div class="mt-3 text-center" id="{{ $name }}-preview">
            @foreach($imageUrls as $img)
                <div class="image-container d-inline-block position-relative">
                    <img src="{{ $img }}" class="img-thumbnail shadow-sm rounded">
                    <button type="button" class="btn btn-danger btn-sm remove-image" data-image="{{ $img }}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            @endforeach
        </div>
    </div>
</div>


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
