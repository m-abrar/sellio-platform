/**
 * Financial Module: Payout Management Registry Logic
 * Core initialization is handled by registry-index.js via .datatable-init
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize DataTable Search HUD Binding
        const withdrawalTable = $('#withdrawals-table').DataTable();
        
        // Bind custom intelligence search field
        $('#custom-search').on('keyup', function() {
            withdrawalTable.search(this.value).draw();
        });

        // Reject Modal Orchestration
        $('#rejectModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget);
            const route = button.data('withdrawal-route');
            $(this).find('#rejectForm').attr('action', route);
            $(this).find('#admin_note').val('');
        });
    });
})(jQuery);
