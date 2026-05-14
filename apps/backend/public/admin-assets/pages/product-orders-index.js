/**
 * Product Order Registry Management Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        const $bulkBar = $('#bulk-floating-bar');
        const $selectedCount = $('#selected-count');

        function updateBulkUI() {
            const checkedCount = $('.order-checkbox:checked').length;
            if (checkedCount > 0) {
                $selectedCount.text(checkedCount);
                if ($bulkBar.hasClass('d-none')) {
                    $bulkBar.removeClass('d-none').addClass('animate__fadeInUpCustom');
                }
            } else {
                $bulkBar.addClass('d-none').removeClass('animate__fadeInUpCustom');
            }
        }

        // Selection Handlers
        $(document).on('change', '#selectAll', function() {
            $('.order-checkbox').prop('checked', this.checked);
            updateBulkUI();
        });

        $(document).on('click', '#deselectAll', function() {
            $('.order-checkbox').prop('checked', false);
            $('#selectAll').prop('checked', false);
            updateBulkUI();
        });

        $(document).on('change', '.order-checkbox', function() {
            const $orderCheckboxes = $('.order-checkbox');
            if (!this.checked) $('#selectAll').prop('checked', false);
            if ($('.order-checkbox:checked').length === $orderCheckboxes.length) $('#selectAll').prop('checked', true);
            updateBulkUI();
        });

        // Bulk Action Handler
        $(document).on('click', '[data-action="bulk-status-trigger"]', function() {
            const status = $(this).data('status');
            const count = $('.order-checkbox:checked').length;

            if (window.PremiumConfirm) {
                PremiumConfirm.fire({
                    title: `Update ${count} orders?`,
                    text: `Lifecycle status will be transitioned to ${status.toUpperCase()}`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'TRANSITION ALL',
                    cancelButtonText: 'ABORT'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#bulk-status-input').val(status);
                        $('#bulk-action-form').submit();
                    }
                });
            }
        });

        // DataTable Initialization
        if ($('#orders-table tbody tr:not(.empty-state)').length > 0) {
            $('#orders-table').DataTable({
                "paging": false,
                "lengthChange": false,
                "searching": false,
                "ordering": true,
                "info": false,
                "dom": 't',
                "columnDefs": [
                    { "orderable": false, "targets": [0, 1, 7] }
                ]
            });
        }
    });
})(jQuery);
