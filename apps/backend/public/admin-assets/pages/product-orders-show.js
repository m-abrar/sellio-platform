/**
 * E-Commerce Module: Order Operational Intelligence Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize Select2
        if ($.fn.select2) {
            $('.select2').select2({
                theme: 'bootstrap4',
                width: '100%'
            });
        }

        // Print Orchestration
        $(document).on('click', '[data-action="print-invoice"]', function() {
            window.print();
        });

        // Lifecycle Transition UI Orchestration
        const statusSelect = $('#statusSelect');
        const trackingGroup = $('#trackingGroup');
        const trackingStatuses = ['shipped', 'out_for_delivery', 'delivered'];

        if (statusSelect.length) {
            statusSelect.on('change', function() {
                const status = $(this).val();
                if (trackingStatuses.includes(status)) {
                    trackingGroup.removeClass('d-none').hide().fadeIn();
                } else {
                    trackingGroup.fadeOut(function() {
                        $(this).addClass('d-none');
                    });
                }
            });
        }
    });
})(jQuery);
