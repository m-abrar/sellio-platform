/**
 * Aesthetic Module: Visual Token Configuration Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        const baseInput = $('#font-family-base');
        const headingInput = $('#font-family-heading');
        const basePreview = $('#preview-base');
        const headingPreview = $('#preview-heading');

        /**
         * Extract the primary font name from a CSS font-family string
         */
        function extractFontName(fontString) {
            let name = fontString.split(',')[0].trim();
            return name.replace(/['"]/g, '');
        }

        const LOCAL_FONT_STYLESHEETS = {
            Inter: '/vendor/npm/fontsource/bundle.css',
            Outfit: '/vendor/npm/fontsource/bundle.css',
        };

        function loadGoogleFont(fontName) {
            if (!fontName || ['serif', 'sans-serif', 'monospace', 'cursive', 'system-ui'].includes(fontName.toLowerCase())) return;

            const stylesheet = LOCAL_FONT_STYLESHEETS[fontName];
            if (!stylesheet) return;

            const fontId = 'local-font-' + fontName.replace(/\s+/g, '-').toLowerCase();
            if ($('#' + fontId).length === 0) {
                $('head').append(`<link id="${fontId}" href="${stylesheet}" rel="stylesheet">`);
            }
        }

        /**
         * Update the real-time typography preview
         */
        function updatePreview() {
            const baseFont = baseInput.val();
            const headingFont = headingInput.val();
            const baseName = extractFontName(baseFont);
            const headingName = extractFontName(headingFont);

            loadGoogleFont(baseName);
            loadGoogleFont(headingName);

            basePreview.css('font-family', baseFont);
            headingPreview.css('font-family', headingFont);
        }

        // Throttled update orchestration
        let timeout = null;
        const debounceUpdate = function() {
            clearTimeout(timeout);
            timeout = setTimeout(updatePreview, 500);
        };

        baseInput.on('input', debounceUpdate);
        headingInput.on('input', debounceUpdate);

        // Initial preview state
        updatePreview();
    });
})(jQuery);
