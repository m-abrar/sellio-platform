/**
 * Property Booking Registry Logic
 * Specifically handles the flatpickr initialization for date range filtering.
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize Flatpickr for Date Range
        if (typeof flatpickr !== 'undefined') {
            flatpickr("#date_range_picker", {
                mode: "range",
                dateFormat: "Y-m-d",
                onClose: function(selectedDates, dateStr, instance) {
                    if (selectedDates.length === 2) {
                        const start = instance.formatDate(selectedDates[0], "Y-m-d");
                        const end = instance.formatDate(selectedDates[1], "Y-m-d");
                        $('#start_date').val(start);
                        $('#end_date').val(end);
                    } else if (selectedDates.length === 0) {
                        $('#start_date').val('');
                        $('#end_date').val('');
                    }
                }
            });
        }

        // Module Specific DataTable Logic (if needed)
        // Note: Generic logic is handled by registry-index.js
    });

})(jQuery);
