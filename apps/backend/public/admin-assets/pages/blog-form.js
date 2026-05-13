/**
 * Content Module: Editorial Desk Configuration Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        const titleInput = $('#title');
        const slugInput = $('#slug');

        // Auto-generate Slug Orchestration
        if (titleInput.length && slugInput.length) {
            titleInput.on('input', function () {
                if(!slugInput.data('edited')) {
                    let slug = $(this).val().toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '');
                    slugInput.val(slug);
                }
            });

            slugInput.on('change', function() { $(this).data('edited', true); });
        }

        // Initialize Select2 if available
        if ($.fn.select2) {
            $('.select2').select2({
                theme: 'bootstrap4',
                width: '100%'
            });
        }
    });
})(jQuery);
