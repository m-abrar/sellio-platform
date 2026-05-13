/**
 * Taxonomy Module: Listing Type Configuration Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        const titleInput = $('#title');
        const slugInput = $('#slug');
        const iconInput = $('#icon');
        const iconPreview = $('#icon-preview-addon i');

        // Auto-generate Slug
        titleInput.on('input', function () {
            if(!slugInput.data('edited')) {
                let slug = $(this).val().toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
                slugInput.val(slug);
            }
        });

        slugInput.on('change', function() { $(this).data('edited', true); });

        // Live Icon Preview Integration
        iconInput.on('input', function() {
            const val = $(this).val() || 'fas fa-icons';
            iconPreview.attr('class', val + ' text-primary');
        });
    });
})(jQuery);
