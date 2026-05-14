/**
 * Administrative Taxonomy: Lifecycle Orchestration
 * 
 * Manages the interactive behaviors for category, type, and tag management 
 * modules, including slug generation and operational confirmations.
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        const $titleInput = $('#title');
        const $slugInput = $('#slug');

        /**
         * Automatic Slug Generation Protocol
         * Synchronizes the URI identifier with the title unless manually overridden.
         */
        if ($titleInput.length && $slugInput.length) {
            $titleInput.on('input', function() {
                if (!$slugInput.data('edited')) {
                    let slug = $(this).val()
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '');
                    $slugInput.val(slug);
                }
            });

        /**
         * Live Icon Preview Integration
         * Synchronizes the visual addon with the FontAwesome class input.
         */
        const $iconInput = $('#icon');
        const $iconPreview = $('#icon-preview-addon i');

        if ($iconInput.length && $iconPreview.length) {
            $iconInput.on('input', function() {
                const val = $(this).val() || 'fas fa-icons';
                $iconPreview.attr('class', val + ' text-primary');
            });
        }
    });

})(jQuery);
