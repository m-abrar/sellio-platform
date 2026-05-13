/**
 * Sellio Administrative Image Uploader Logic
 * Handles asynchronous media synchronization with data-attribute orchestration.
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        $('.dropzone-premium').each(function() {
            initUploader($(this));
        });

        function initUploader($dropzone) {
            const name = $dropzone.data('name');
            const alias = $dropzone.data('alias');
            const recordId = $dropzone.data('record-id');
            const multiple = $dropzone.data('multiple');
            const uploadUrl = $dropzone.data('upload-url');
            const deleteUrl = $dropzone.data('delete-url');
            const csrfToken = $dropzone.data('csrf');
            const previewContainer = document.getElementById(name + '-preview');

            if (!$dropzone.length || !previewContainer) return;

            // Handle Clicks
            $dropzone.on('click', function() {
                let fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.multiple = multiple;
                fileInput.onchange = function(event) {
                    [...event.target.files].forEach(file => handleFileUpload(file, $dropzone, previewContainer));
                };
                fileInput.click();
            });

            // Handle Drag & Drop
            $dropzone.on('dragover', function(e) {
                e.preventDefault();
                $(this).addClass('border-primary');
            }).on('dragleave', function() {
                $(this).removeClass('border-primary');
            }).on('drop', function(e) {
                e.preventDefault();
                $(this).removeClass('border-primary');
                const files = e.originalEvent.dataTransfer.files;
                [...files].forEach(file => handleFileUpload(file, $dropzone, previewContainer));
            });

            // Initial attachment of remove events for existing images
            attachRemoveEvents(previewContainer, $dropzone);
        }

        function handleFileUpload(file, $dropzone, previewContainer) {
            if (!file || !file.type.startsWith("image/")) {
                if (window.PremiumToast) PremiumToast.fire({ icon: 'error', title: 'Invalid image format.' });
                return;
            }

            const formData = new FormData();
            formData.append("image", file);
            formData.append("_token", $dropzone.data('csrf'));
            formData.append("model", $dropzone.data('alias'));
            formData.append("id", $dropzone.data('record-id'));
            formData.append("name", $dropzone.data('name'));
            formData.append("multiple", $dropzone.data('multiple') ? '1' : '0');

            fetch($dropzone.data('upload-url'), {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (!$dropzone.data('multiple')) {
                        previewContainer.innerHTML = "";
                    }

                    const imageHtml = `
                        <div class="image-container position-relative group">
                            <img src="${data.url}" class="img-thumbnail border-0 shadow-premium rounded-xl image-preview-img">
                            <button type="button" class="btn btn-danger btn-xs remove-image position-absolute d-flex align-items-center justify-content-center shadow-lg" 
                                    data-image="${data.url}">
                                <i class="fas fa-times smallest"></i>
                            </button>
                        </div>`;

                    previewContainer.insertAdjacentHTML('beforeend', imageHtml);
                    attachRemoveEvents(previewContainer, $dropzone);
                    
                    if (window.PremiumToast) PremiumToast.fire({ icon: 'success', title: 'Asset synchronized.' });
                } else {
                    if (window.PremiumToast) PremiumToast.fire({ icon: 'error', title: data.message || 'Upload failed.' });
                }
            })
            .catch(error => {
                console.error("Upload error:", error);
                if (window.PremiumToast) PremiumToast.fire({ icon: 'error', title: 'System communication error.' });
            });
        }

        function attachRemoveEvents(container, $dropzone) {
            $(container).find('.remove-image').off('click').on('click', function(e) {
                e.stopPropagation();
                const $btn = $(this);
                const imagePath = $btn.data('image');

                // Send DELETE request
                fetch($dropzone.data('delete-url'), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": $dropzone.data('csrf')
                    },
                    body: JSON.stringify({
                        image: imagePath,
                        model: $dropzone.data('alias'),
                        id: $dropzone.data('record-id'),
                        name: $dropzone.data('name')
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        $btn.closest('.image-container').fadeOut(300, function() { $(this).remove(); });
                        if (window.PremiumToast) PremiumToast.fire({ icon: 'info', title: 'Asset removed.' });
                    }
                })
                .catch(error => console.error("Deletion error:", error));
            });
        }
    });
})(jQuery);
