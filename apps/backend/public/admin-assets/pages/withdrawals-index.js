/**
 * Financial Module: Payout Management Registry Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize DataTable
        const withdrawalTable = $('#withdrawals-table');
        if (withdrawalTable.length > 0 && withdrawalTable.find('tbody tr:not(.empty-state)').length > 0) {
            const table = withdrawalTable.DataTable({
                "paging": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
                "order": [[5, "desc"]],
                "dom": "tr", // Custom HUD layout
                "language": {
                    "emptyTable": "Zero requests detected in this queue."
                },
                "columnDefs": [
                    { "orderable": false, "targets": [6] }
                ]
            });

            // Bind custom intelligence search field
            $('#custom-search').on('keyup', function() {
                table.search(this.value).draw();
            });
        }

        // Reject Modal Orchestration
        $('#rejectModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget);
            const route = button.data('withdrawal-route');
            $(this).find('#rejectForm').attr('action', route);
            $(this).find('#admin_note').val('');
        });
    });
})(jQuery);
