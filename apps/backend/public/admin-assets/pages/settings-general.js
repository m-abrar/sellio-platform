/**
 * Administrative Infrastructure: General Identity Orchestration
 * 
 * This module facilitates the brand asset management (logo/favicon) 
 * for the platform identity interface. It orchestrates drag-and-drop 
 * uploads and real-time previews, ensuring 100% CSP compliance by 
 * eliminating inline interaction logic.
 */
$(document).ready(function() {
    // Brand Logo Logic
    const logoInput = $('#site-logo-input');
    const logoWrapper = $('#logo-dropzone');
    const logoPreviewContainer = $('#logo-preview-container');

    if (logoInput.length && logoWrapper.length) {
        const updateLogoPreview = (file) => {
            if (file) {
                const url = URL.createObjectURL(file);
                logoPreviewContainer.html(`<img src="${url}" class="img-fluid drop-shadow-sm mb-3 max-h-80" alt="Logo Preview">`);
            }
        };

        logoWrapper.on('click', function() {
            logoInput.click();
        });

        logoInput.on('change', function(e) {
            updateLogoPreview(e.target.files[0]);
        });

        logoWrapper.on('dragover', function(e) {
            e.preventDefault();
            $(this).addClass('bg-primary-soft border-primary').removeClass('bg-light');
        }).on('dragleave drop', function(e) {
            e.preventDefault();
            $(this).removeClass('bg-primary-soft border-primary').addClass('bg-light');
            if (e.type === 'drop') {
                const files = e.originalEvent.dataTransfer.files;
                logoInput[0].files = files;
                updateLogoPreview(files[0]);
            }
        });
    }

    // Favicon Logic
    const faviconInput = $('#site-favicon-input');
    const faviconWrapper = $('#favicon-dropzone');
    const faviconPreviewContainer = $('#favicon-preview-container');

    if (faviconInput.length && faviconWrapper.length) {
        const updateFaviconPreview = (file) => {
            if (file) {
                const url = URL.createObjectURL(file);
                faviconPreviewContainer.html(`<img src="${url}" width="56" height="56" class="drop-shadow-sm rounded shadow-xs" alt="Favicon Preview">`);
            }
        };

        faviconWrapper.on('click', function() {
            faviconInput.click();
        });

        faviconInput.on('change', function(e) {
            updateFaviconPreview(e.target.files[0]);
        });

        faviconWrapper.on('dragover', function(e) {
            e.preventDefault();
            $(this).addClass('bg-info-soft border-info').removeClass('bg-light');
        }).on('dragleave drop', function(e) {
            e.preventDefault();
            $(this).removeClass('bg-info-soft border-info').addClass('bg-light');
            if (e.type === 'drop') {
                const files = e.originalEvent.dataTransfer.files;
                faviconInput[0].files = files;
                updateFaviconPreview(files[0]);
            }
        });
    }
});
