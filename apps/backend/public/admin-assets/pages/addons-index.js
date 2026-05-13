/**
 * E-Commerce Module: Addon Registry Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize DataTable
        const addonsTable = $('#addons-table');
        if (addonsTable.length > 0 && addonsTable.find('tbody tr:not(.empty-state)').length > 0) {
            addonsTable.DataTable({
                "columnDefs": [
                    { "orderable": false, "targets": [1, 4] }
                ],
                "responsive": true
            });
        }
    });
})(jQuery);
