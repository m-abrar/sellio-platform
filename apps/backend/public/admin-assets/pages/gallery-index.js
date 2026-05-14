/**
 * Media Module: Global Gallery Registry Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {

        // Initialize Tooltips
        if ($.fn.tooltip) {
            $('[data-toggle="tooltip"]').tooltip();
        }

        // Upload Area Interaction
        const $uploadArea = $('.upload-area');
        const $fileInput = $('#newAssetFile');
        const $fileNameDisplay = $('#fileNameDisplay');

        if ($uploadArea.length && $fileInput.length) {
            $uploadArea.on('click', function() {
                $fileInput.click();
            });

            $fileInput.on('change', function() {
                const fileName = this.files[0] ? this.files[0].name : '';
                if ($fileNameDisplay.length) {
                    $fileNameDisplay.html(fileName ? `<i class="fas fa-check-circle mr-1"></i> Ready: ${fileName}` : '');
                }
            });
        }

        // Custom File Input Label Sync
        $(document).on('change', '.custom-file-input', function() {
            const fileName = $(this).val().split('\\').pop();
            $(this).siblings('.custom-file-label').addClass('selected').html(fileName);
        });
    });
})(jQuery);
