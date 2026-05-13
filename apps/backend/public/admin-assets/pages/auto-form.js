/**
 * Automotive Vehicle Configuration Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Slug Auto-generation
        const titleInput = $('#title');
        const slugInput = $('#slug');

        titleInput.on('input', function () {
            if(!slugInput.data('edited')){
                let slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                slugInput.val(slug);
            }
        });

        slugInput.on('change', function() { $(this).data('edited', true); });
    });
})(jQuery);
