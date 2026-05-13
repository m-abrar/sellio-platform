/**
 * Finance Module: Global Transaction Ledger Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize DataTable
        const transactionsTable = $('#transactions-table');
        if (transactionsTable.length > 0) {
            transactionsTable.DataTable({
                paging: true,
                searching: true,
                ordering: true,
                order: [[7, 'desc']], // Default: Chronological order (descending)
                responsive: true
            });
        }
    });
})(jQuery);
