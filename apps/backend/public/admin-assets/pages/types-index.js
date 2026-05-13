/**
 * Taxonomy Module: Listing Type Registry Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize DataTable
        const typesTable = $('#types-table');
        if (typesTable.length > 0 && typesTable.find('tbody tr:not(.empty-state)').length > 0) {
            typesTable.DataTable({
                "paging": true,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row"<"col-sm-12 col-md-6"f><"col-sm-12 col-md-6"l>>' +
                       '<"row"<"col-sm-12"tr>>' +
                       '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                "columnDefs": [
                    { "orderable": false, "targets": [0, 2, 4] }
                ],
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search types...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    },
                    "lengthMenu": "_MENU_ per page"
                }
            });
            $('.dataTables_filter input').addClass('form-control form-control-premium shadow-none border-light');
            $('.dataTables_length select').addClass('form-control form-control-premium shadow-none border-light');
        }

        // Initialize Tooltips
        if ($.fn.tooltip) {
            $('[data-toggle="tooltip"]').tooltip();
        }
    });
})(jQuery);
