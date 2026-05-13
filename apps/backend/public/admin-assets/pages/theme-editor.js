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

        /**
         * Asynchronously load Google Fonts into the document head
         */
        function loadGoogleFont(fontName) {
            if (!fontName || ['serif', 'sans-serif', 'monospace', 'cursive', 'system-ui'].includes(fontName.toLowerCase())) return;
            
            const fontId = 'google-font-' + fontName.replace(/\s+/g, '-').toLowerCase();
            if ($('#' + fontId).length === 0) {
                const link = `<link id="${fontId}" href="https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;700&display=swap" rel="stylesheet">`;
                $('head').append(link);
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
