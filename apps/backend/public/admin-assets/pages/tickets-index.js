/**
 * Support Ticket Registry Management Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        const $selectAll = $('#check-all');
        const $bulkBar = $('#bulk-floating-bar');
        const $selectedCount = $('#selected-count');

        function updateBulkUI() {
            const checkedCount = $('.ticket-checkbox:checked').length;
            if (checkedCount > 0) {
                $selectedCount.text(checkedCount);
                if ($bulkBar.hasClass('d-none')) {
                    $bulkBar.removeClass('d-none').addClass('animate__fadeInUpCustom');
                }
            } else {
                $bulkBar.addClass('d-none').removeClass('animate__fadeInUpCustom');
            }
        }

        // Delegated Select All
        $(document).on('change', '#check-all', function() {
            $('.ticket-checkbox').prop('checked', this.checked);
            updateBulkUI();
        });

        // Deselect All Button in Bar
        $(document).on('click', '#deselectAll', function() {
            $('.ticket-checkbox').prop('checked', false);
            $('#check-all').prop('checked', false);
            updateBulkUI();
        });

        // Delegated Individual Checkbox
        $(document).on('change', '.ticket-checkbox', function() {
            const total = $('.ticket-checkbox').length;
            const checked = $('.ticket-checkbox:checked').length;
            
            $('#check-all').prop('checked', total === checked && total > 0);
            updateBulkUI();
        });

        // Handle Bulk Update
        $(document).on('click', '[data-action="bulk-update"]', function() {
            const btn = $(this);
            const type = btn.data('type');
            const value = btn.data('value');
            const count = $('.ticket-checkbox:checked').length;
            
            if (count === 0) return;

            if (window.SellioAlert) {
                SellioAlert.fire({
                    title: 'Bulk Action Confirmation',
                    text: `Apply "${value.toUpperCase()}" ${type} to ${count} selected tickets?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: 'var(--primary)',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Execute Action',
                    backdrop: `rgba(15, 23, 42, 0.4)`
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#bulk-type-input').val(type);
                        $('#bulk-value-input').val(value);
                        $('#tickets-mass-action-form').submit();
                    }
                });
            }
        });

        // Ticket Table DataTables
        if (typeof $.fn.DataTable === 'function') {
            if ($('#tickets-table tbody tr:not(.empty-state)').length > 0 && $('#tickets-table').find('i.fa-inbox').length === 0) {
                $('#tickets-table').DataTable({
                    "paging": false, 
                    "lengthChange": false,
                    "searching": false,
                    "ordering": true,
                    "order": [],
                    "info": false,
                    "autoWidth": false,
                    "responsive": true,
                    "dom": 't',
                    "columnDefs": [
                        { "orderable": false, "targets": [0, 5] }
                    ]
                });
            }
        }
    });
})(jQuery);
