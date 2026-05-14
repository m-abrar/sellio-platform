/**
 * Aesthetic Module: Theme Library Explorer Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize tooltips if any
        if ($.fn.tooltip) {
            $('[data-toggle="tooltip"]').tooltip();
        }

        /**
         * Deep Linking Orchestration
         * Automatically activates the correct vertical tab based on URL hash.
         */
        const hash = window.location.hash;
        if (hash) {
            const $tab = $('.nav-pills a[href="' + hash + '"]');
            if ($tab.length) {
                $tab.tab('show');
            }
        }

        // Update URL hash when switching tabs for persistence
        $('.nav-pills a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
            window.location.hash = e.target.hash;
        });
    });

})(jQuery);
