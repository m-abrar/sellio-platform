/**
 * Global Registry Index Logic
 * Handles common initialization for data tables, tooltips, and delegated event listeners.
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // 1. Initialize Tooltips
        if ($.fn.tooltip) {
            $('[data-toggle="tooltip"]').tooltip();
        }

        // 2. Initialize Select2
        if ($.fn.select2) {
            $('.select2').each(function() {
                $(this).select2({
                    theme: 'bootstrap4',
                    width: '100%',
                    dropdownParent: $(this).parent()
                });
            });
        }

        // 3. Generic DataTables Orchestration
        if ($.fn.DataTable) {
            // Auto-init tables with class .datatable-init
            $('.datatable-init').each(function() {
                if (!$.fn.DataTable.isDataTable(this)) {
                    $(this).DataTable({
                        "columnDefs": [
                            { "orderable": false, "targets": "no-sort" }
                        ],
                        "language": {
                            "search": "_INPUT_",
                            "searchPlaceholder": "Search records..."
                        }
                    });
                }
            });
        }
        
        // 4. Delegated Status Toggles
        $(document).on('change', '[data-action="status-toggle"]', function() {
            const $this = $(this);
            const url = $this.data('url');
            const state = $this.is(':checked') ? 1 : 0;
            
            if (!url) return;
            
            $.post(url, {
                _token: $('meta[name="csrf-token"]').attr('content'),
                status: state
            }).done(function(response) {
                if (typeof Swal !== 'undefined' && response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.message || 'Status updated successfully.',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            }).fail(function() {
                $this.prop('checked', !state); // Revert
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to update status.'
                    });
                }
            });
        });
    });

})(jQuery);
