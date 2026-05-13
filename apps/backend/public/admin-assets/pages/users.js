/**
 * User Identity Management Logic
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize Tooltips
        if ($.fn.tooltip) {
            $('[data-toggle="tooltip"]').tooltip();
        }

        // Initialize DataTable
        const userTable = $('#users-table');
        if (userTable.length > 0 && userTable.find('tbody tr:not(.empty-state)').length > 0) {
            userTable.DataTable({
                "paging": true,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
                "dom": '<"row pt-3 px-4"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 text-right"f>>' +
                       '<"row"<"col-sm-12"tr>>' +
                       '<"row pb-3 px-4"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
                "language": {
                    "search": "",
                    "searchPlaceholder": "Search by name or email...",
                    "paginate": {
                        "previous": "<i class='fas fa-angle-left'></i>",
                        "next": "<i class='fas fa-angle-right'></i>"
                    }
                }
            });
            $('.dataTables_filter input').addClass('form-control shadow-none border-light w-250-p');
        }
    });
})(jQuery);
