/**
 * Taxonomy Management Logic (Amenities, Brands, Categories, Features, etc.)
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        const titleInput = $('#title');
        const slugInput = $('#slug');

        // Auto-Slug Logic
        if (titleInput.length && slugInput.length) {
            titleInput.on('input', function () {
                if(!slugInput.data('edited')){
                    let slug = $(this).val()
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '');
                    slugInput.val(slug);
                }
            });

            slugInput.on('change', function() {
                $(this).data('edited', true);
            });
        }
    });
})(jQuery);
