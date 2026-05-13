/**
 * Content Module: Article Registry Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize DataTable
        const blogsTable = $('#blogs-table');
        if (blogsTable.length > 0 && blogsTable.find('tbody tr:not(.empty-state)').length > 0) {
            blogsTable.DataTable({
                "paging": false,
                "info": false,
                "searching": false,
                "responsive": true
            });
        }
    });
})(jQuery);
